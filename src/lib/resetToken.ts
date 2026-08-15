import crypto from "crypto";

const SECRET = process.env.RESET_TOKEN_SECRET as string;

export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  return { rawToken, tokenHash };
}

export function hashResetToken(rawToken: string): string {
  return crypto.createHmac("sha256", SECRET).update(rawToken).digest("hex");
}