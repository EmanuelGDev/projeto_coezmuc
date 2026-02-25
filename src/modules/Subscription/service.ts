import mongoose from "mongoose";
import { SubscriptionModel, UserModel } from "../../lib/scheema";

export type PersonalData = {
  name: string;
  age: number;
  phoneNumber: string;
  city: string;
  centroEspirita: string;
  badgeName: string;
  emergencyContact?: string;
}

export type PaymentData = {
  fullValue: number;
  paidValue: number;
  paymentStatus: string;
}

export type HealthData = {
  restricaoAlimentar?: string;
  restricaoMedica?: string;
  cuidadosEspeciais?: string;
}


class SubscriptionService {
  async createSubscription(userId: string, personalData: PersonalData, healthData: Object) {

    const paymentData: PaymentData = {
      fullValue: 400,
      paidValue: 0,
      paymentStatus: "pending",
    };

    if (!userId || !personalData) {
      throw new Error("Missing required fields");
    }

    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    if(personalData.age < 6){
        paymentData.fullValue = 100;
    }

    const newSubscription = await SubscriptionModel.create({
      userId,
      personalData,
        healthData,
        paymentData,
        status: { subscriptionStatus: "pedding" },
    });

    return newSubscription;
  }
}

export { SubscriptionService };