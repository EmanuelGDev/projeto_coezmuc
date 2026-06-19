import mongoose from "mongoose";
import { SubscriptionModel, UserModel } from "../../lib/scheema.js";
import { sendSubscriptionConfirmatedEmail, sendSubscriptionConfirmationEmail } from "../../shared/email/emailService.js";
import { createHmac } from "crypto";

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

const REQUIRED_PERSONAL_FIELDS: { field: keyof SubscriptionData["personalData"]; message: string }[] = [
  { field: "name", message: "Nome é obrigatório" },
  { field: "cpf", message: "CPF é obrigatório" },
  { field: "age", message: "Idade é obrigatória" },
  { field: "phoneNumber", message: "Telefone é obrigatório" },
  { field: "city", message: "Cidade é obrigatória" },
  { field: "centroEspirita", message: "Centro espírita é obrigatório" },
  { field: "badgeName", message: "Nome do crachá é obrigatório" },
  { field: "address", message: "Endereço é obrigatório" },
];

class SubscriptionService {

  // ─── Helpers privados ────────────────────────────────────────────────────────

  private hashCpf(cpf: string): string {
    const pepper = process.env.CPF_PEPPER;
    if (!pepper) throw new Error("CPF_PEPPER não definido no ambiente");
    return createHmac("sha256", pepper).update(cpf).digest("hex");
  }

  private calculateFullValue(age: number): number {
    if (age < 3) return 0;
    if (age < 6) return 160;
    if (age < 11) return 215;
    return 430;
  }

  private async validateSubscriptionData(data: SubscriptionData): Promise<void> {
    if (!data.userId || !data.personalData) {
      throw new Error("Dados obrigatórios ausentes");
    }

    for (const { field, message } of REQUIRED_PERSONAL_FIELDS) {
      const value = data.personalData[field];
      if (value === undefined || value === null || value === "") {
        throw new Error(message);
      }
    }

    const { cpf } = data.personalData;
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      throw new Error("CPF inválido — deve conter exatamente 11 dígitos numéricos");
    }

    const cpfHash = this.hashCpf(cpf);
    const cpfAlreadyRegistered = await SubscriptionModel.findOne({ "personalData.cpf": cpfHash });
    if (cpfAlreadyRegistered) {
      throw new Error("CPF já cadastrado");
    }

    const userExists = await UserModel.findById(data.userId);
    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    if (!data.personalData.imageConsent || !data.personalData.regulationsConsent) {
      throw new Error("Consentimento para uso de imagem e regulamento é obrigatório");
    }
  }

  // ─── Métodos públicos ────────────────────────────────────────────────────────

  async createSubscription(data: SubscriptionData) {
    await this.validateSubscriptionData(data);

    const fullValue = this.calculateFullValue(data.personalData.age);

    const [subscription, user] = await Promise.all([
      SubscriptionModel.create({
        userId: new mongoose.Types.ObjectId(data.userId),
        personalData: {
          ...data.personalData,
          cpf: this.hashCpf(data.personalData.cpf), // CPF nunca persiste em plain text
        },
        healthData: data.healthData,
        paymentData: {
          fullValue,
          paidValue: 0,
          paymentStatus: "pending",
        },
      }),
      UserModel.findById(data.userId),
    ]);

    if (user?.email) {
      sendSubscriptionConfirmationEmail(user.email, data.personalData.name)
        .catch((emailErr) => console.error("Falha ao enviar email de confirmação:", emailErr));
    }
    return subscription;
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

    // Se o CPF foi enviado no update, faz hash antes de persistir
    if (data.personalData?.cpf) {
      const { cpf } = data.personalData;
      data.personalData.cpf = this.hashCpf(cpf);
    }

    if (data.personalData?.age !== undefined) {
      data.paymentData = {
        fullValue: this.calculateFullValue(data.personalData.age),
        paidValue: data.paymentData?.paidValue ?? subscription.paymentData?.paidValue ?? 0,
        paymentStatus: data.paymentData?.paymentStatus ?? subscription.paymentData?.paymentStatus ?? "pending",
      };
    }
    if (data.status?.subscriptionStatus === "active") {
      const user = await UserModel.findById(subscription.userId);
      if (user?.email) {
        sendSubscriptionConfirmatedEmail(user.email, subscription.personalData?.name ?? "Confraternista")
          .catch((emailErr) => console.error("Falha ao enviar email de confirmação de inscrição:", emailErr));
      }
    }

    return SubscriptionModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: data },
      { new: true, runValidators: true }
    ).populate("userId", "username");
  }

  async getRevenueSummary() {
    const result = await SubscriptionModel.aggregate([
      { $match: { "paymentData.paidValue": { $gt: 0 } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentData.paidValue" },
          count: { $sum: 1 },
        },
      },
    ]);
    return result[0] ?? { total: 0, count: 0 };
  }
}

export { SubscriptionService };