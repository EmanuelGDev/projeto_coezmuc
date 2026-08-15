import nodemailer from "nodemailer";
import { subscriptionConfirmationTemplate } from "./templates/subscription-recived.js";
import { subscriptionConfirmedTemplate } from "./templates/subscription-confirmed.js";
import { passwordResetTemplate } from "./templates/password-reset.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("SMTP connection error:", error);
  else console.log("SMTP pronto para envio");
});

export async function sendSubscriptionConfirmationEmail(to: string, name: string): Promise<void> {
  await transporter.sendMail({
    from: `"Coezmuc" <${process.env.SMTP_USER}>`,
    to,
    subject: "Recebemos sua inscrição!",
    html: subscriptionConfirmationTemplate(name),
  });
}

export async function sendSubscriptionConfirmatedEmail(to: string, name: string): Promise<void> {
  await transporter.sendMail({
    from: `"Coezmuc" <${process.env.SMTP_USER}>`,
    to,
    subject: "Sua inscrição foi confirmada!",
    html: subscriptionConfirmedTemplate(name),
  });
}

  export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  await transporter.sendMail({
    from: `"Coezmuc" <${process.env.SMTP_USER}>`,
    to,
    subject: "Recuperação de senha",
    html: passwordResetTemplate(resetLink),
  });
}