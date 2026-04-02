import mongoose from "mongoose";
import { SubscriptionModel, UserModel } from "../../lib/scheema";
import { FastifyRequest } from "fastify";

export type SubscriptionData = {
  userId: string;
  personalData: {
    name: string;
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

class SubscriptionService {

  async createSubscription(data: SubscriptionData) {
    if (!data.userId || !data.personalData) {
      throw new Error("Missing required fields");
    }

    const userExists = await UserModel.findById(data.userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    if (data.personalData.imageConsent === false || data.personalData.regulationsConsent === false) {
      throw new Error("Consentimento para uso de imagem e regulamento é obrigatório");
    }

    const fullValue = data.personalData.age < 3 ? 0 : data.personalData.age < 6 ? 150 : data.personalData.age < 11 ? 200 : 400;

    const newSubscription = await SubscriptionModel.create({
      userId: new mongoose.Types.ObjectId(data.userId),
      personalData: data.personalData,
      healthData: data.healthData,
      paymentData: {
        fullValue,
        paidValue: 0,
        paymentStatus: "pending",
      },
    });

    return newSubscription;
  }

  async getSubscriptions(request: FastifyRequest) {
    const user = (request as any).user;

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isAdmin) {
      throw new Error("Only admin are allowed to do this action");
    }

    const subscriptions = await SubscriptionModel.find()
      .sort({ "personalData.name": 1 })
      .collation({ locale: "pt", strength: 1 })
      .populate("userId", "username");

    return subscriptions;
  }

  async getSubscriptionByUserId(userId: string) {
    const subscription = await SubscriptionModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("userId", "username");
    return subscription;
  }

  async getSubscriptionById(id: string) {
    const subscription = await SubscriptionModel.findById(new mongoose.Types.ObjectId(id))
      .populate("userId", "username");
    return subscription;
  }

  async updateSubscription(id: string, data: Partial<SubscriptionData>, request: FastifyRequest) {
    const user = (request as any).user;

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isAdmin) {
      throw new Error("Only admins are allowed to do this action");
    }

    if (!id) {
      throw new Error("É necessário o id da subscription");
    }

    const subscription = await SubscriptionModel.findById(new mongoose.Types.ObjectId(id));

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Recalcula fullValue se age foi atualizado
    if (data.personalData?.age !== undefined) {
      const age = data.personalData.age;
      data.paymentData = {
        ...data.paymentData,
        fullValue: age < 3 ? 0 : age < 6 ? 150 : age < 11 ? 200 : 400,
        paidValue: data.paymentData?.paidValue ?? subscription.paymentData?.paidValue ?? 0,
        paymentStatus: data.paymentData?.paymentStatus ?? subscription.paymentData?.paymentStatus ?? "pending",
      };
    }

    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: data },
      { new: true, runValidators: true }
    ).populate("userId", "username");

    return updatedSubscription;
  }
}

export { SubscriptionService };