import nodemailer from "nodemailer";
import { subscriptionConfirmationTemplate } from "./templates/subscription-confirmation.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSubscriptionConfirmationEmail(to: string, name: string): Promise<void> {
  await transporter.sendMail({
    from: `"Coezmuc" <${process.env.SMTP_USER}>`,
    to,
    subject: "Recebemos sua inscrição!",
    html: subscriptionConfirmationTemplate(name),
  });
}
