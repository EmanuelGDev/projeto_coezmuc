import mongoose from "mongoose";
import { SubscriptionModel, UserModel } from "../../lib/scheema";

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
  },
  healthData: {
    restricaoAlimentar?: string;
    restricaoMedica?: string;
    cuidadosEspeciais?: string;
  },
  paymentData: {
    fullValue: number;
    paidValue: number;
    paymentStatus: string;
  }
}

class SubscriptionService {

  async createSubscription(data: SubscriptionData) {


    if (!data.userId || !data.personalData) {
      throw new Error("Missing required fields");
    }

    const userExists = await UserModel.findById(data.userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    const fullValue = data.personalData.age < 6 ? 100 : 200;

    const newSubscription = await SubscriptionModel.create({
      userId: new mongoose.Types.ObjectId(data.userId),
      personalData: data.personalData,
      healthData: data.healthData,
      paymentData: {
        fullValue,
        paidValue: 0,
        paymentStatus: "pending"
      }
    });

    return newSubscription;
  }

  async getSubscriptions() {
    const subscriptions = await SubscriptionModel.find()
      .sort({ "personalData.name": 1 })
      .collation({ locale: "pt", strength: 1 })
      .populate("userId", "username");

    return subscriptions;
  }
}

export { SubscriptionService };