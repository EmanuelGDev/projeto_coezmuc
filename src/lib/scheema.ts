import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: { type: String, required: true,},
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin : {type : Boolean},
    createdAt: { type: Date, default: Date.now }
});

const subscription = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  personalData: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    minorsGuardianName: { type: String },
    city: { type: String, required: true },
    centroEspirita: { type: String, required: true },
    badgeName: { type: String, required: true },
    emergencyContact: { type: String},
    address: { type: String, required: true },
    imageConsent: { type: Boolean, required: true },
    regulationsConsent: { type: Boolean, required: true },
  },

  healthData: {
    restricaoAlimentar: { type: String, default: "" },
    restricaoMedica: { type: String, default: "" },
    cuidadosEspeciais: { type: String, default: "" },
  },

  paymentData: {
    fullValue: { type: Number, required: true },
    paidValue: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
  },

  status: {
    subscriptionStatus: {
      type: String, default: "pending",
    },
  },

  createdAt: { type: Date, default: Date.now },
});

const Revenue = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  value: { type: Number, required: true },
});

export const UserModel = mongoose.model('User', User);
export const SubscriptionModel = mongoose.model('Subscription', subscription);
export const RevenueModel = mongoose.model('Revenue', Revenue);