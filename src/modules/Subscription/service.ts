import mongoose from "mongoose";
import { SubscriptionModel, UserModel } from "../../lib/scheema";
import { FastifyRequest } from "fastify";

export type SubscriptionData = {
  userId: string;
  personalData: {
    name: string;
    cpf: string;
    age: number;
    phoneNumber: string;
    city: string;
    centroEspirita: string;
    badgeName: string;
    emergencyContact?: string;
    minorsGuardianName?: string;
    address: string;
    imageConsent: boolean;
    regulationsConsent: boolean;
  };
  healthData: {
    restricaoAlimentar?: string;
    restricaoMedica?: string;
    cuidadosEspeciais?: string;
  };
  paymentData: {
    fullValue: number;
    paidValue: number;
    paymentStatus: string;
  };
  status: {
    subscriptionStatus: string;
  };
};

// Campos obrigatórios de personalData e suas mensagens
const REQUIRED_PERSONAL_FIELDS: { field: keyof SubscriptionData["personalData"]; message: string }[] = [
  { field: "name",           message: "Nome é obrigatório" },
  { field: "cpf",            message: "CPF é obrigatório" },
  { field: "age",            message: "Idade é obrigatória" },
  { field: "phoneNumber",    message: "Telefone é obrigatório" },
  { field: "city",           message: "Cidade é obrigatória" },
  { field: "centroEspirita", message: "Centro espírita é obrigatório" },
  { field: "badgeName",      message: "Nome do crachá é obrigatório" },
  { field: "address",        message: "Endereço é obrigatório" },
];

class SubscriptionService {

  // ─── Helpers privados ────────────────────────────────────────────────────────

  private calculateFullValue(age: number): number {
    if (age < 3)  return 0;
    if (age < 6)  return 150;
    if (age < 11) return 200;
    return 400;
  }

  private async validateSubscriptionData(data: SubscriptionData): Promise<void> {
    if (!data.userId || !data.personalData) {
      throw new Error("Dados obrigatórios ausentes");
    }

    // Valida presença de cada campo obrigatório
    for (const { field, message } of REQUIRED_PERSONAL_FIELDS) {
      const value = data.personalData[field];
      if (value === undefined || value === null || value === "") {
        throw new Error(message);
      }
    }

    // Valida formato do CPF
    const { cpf } = data.personalData;
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      throw new Error("CPF inválido — deve conter exatamente 11 dígitos numéricos");
    }

    // Valida CPF duplicado
    const cpfAlreadyRegistered = await SubscriptionModel.findOne({ "personalData.cpf": cpf });
    if (cpfAlreadyRegistered) {
      throw new Error("CPF já cadastrado");
    }

    // Valida existência do usuário
    const userExists = await UserModel.findById(data.userId);
    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    // Valida consentimentos obrigatórios
    if (!data.personalData.imageConsent || !data.personalData.regulationsConsent) {
      throw new Error("Consentimento para uso de imagem e regulamento é obrigatório");
    }
  }

  // ─── Métodos públicos ────────────────────────────────────────────────────────

  async createSubscription(data: SubscriptionData) {
    await this.validateSubscriptionData(data);

    const fullValue = this.calculateFullValue(data.personalData.age);

    return SubscriptionModel.create({
      userId: new mongoose.Types.ObjectId(data.userId),
      personalData: data.personalData,
      healthData: data.healthData,
      paymentData: {
        fullValue,
        paidValue: 0,
        paymentStatus: "pending",
      },
    });
  }

  async getSubscriptions() {
    return SubscriptionModel.find()
      .sort({ "personalData.name": 1 })
      .collation({ locale: "pt", strength: 1 })
      .populate("userId", "username");
  }

  async getSubscriptionByUserId(userId: string) {
    return SubscriptionModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("userId", "username");
  }

  async getSubscriptionById(id: string) {
    return SubscriptionModel.findById(new mongoose.Types.ObjectId(id))
      .populate("userId", "username");
  }

  async updateSubscription(id: string, data: Partial<SubscriptionData>) {
    if (!id) throw new Error("ID da inscrição é obrigatório");

    const subscription = await SubscriptionModel.findById(new mongoose.Types.ObjectId(id));
    if (!subscription) throw new Error("Inscrição não encontrada");

    // Recalcula fullValue se a idade foi alterada
    if (data.personalData?.age !== undefined) {
      data.paymentData = {
        fullValue:     this.calculateFullValue(data.personalData.age),
        paidValue:     data.paymentData?.paidValue     ?? subscription.paymentData?.paidValue     ?? 0,
        paymentStatus: data.paymentData?.paymentStatus ?? subscription.paymentData?.paymentStatus ?? "pending",
      };
    }

    return SubscriptionModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: data },
      { new: true, runValidators: true }
    ).populate("userId", "username");
  }
}

export { SubscriptionService };