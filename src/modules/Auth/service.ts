import { UserModel, PasswordResetTokenModel } from "../../lib/scheema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateResetToken, hashResetToken } from "../../lib/resetToken.js";
import { sendPasswordResetEmail }from "../../shared/email/emailService.js";

const RESET_TOKEN_EXPIRATION_MINUTES = 15;

class AuthService {

    async login(email: string, password: string) {
        if (!email || !password) {
            throw new Error("Missing required fields");
        }

        const jwt_secret = process.env.JWT_SECRET as string;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
        }

        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: Boolean(user.isAdmin),
                tokenVersion: user.tokenVersion ?? 0,
            },
            jwt_secret,
            { expiresIn: '168h' }
        );

        return {
            token,
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                isAdmin: Boolean(user.isAdmin),
            },
        };
    }

    async logout(userId: string) {
        await UserModel.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
    }

    async me(userId: string) {
        const user = await UserModel.findById(userId).select('username email isAdmin');
        if (!user) throw new Error("User not found");
        return {
            id: user._id,
            name: user.username,
            email: user.email,
            isAdmin: Boolean(user.isAdmin),
        };
    }

    async forgotPassword(email: string) {
        if (!email) throw new Error("Email é obrigatório");

        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("Email não encontrado");
        }

        const { rawToken, tokenHash } = generateResetToken();
        const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRATION_MINUTES * 60 * 1000);

        await PasswordResetTokenModel.create({
            userId: user._id,
            tokenHash,
            expiresAt,
        });

        const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${rawToken}`;
        await sendPasswordResetEmail(user.email, resetLink);
    }

    async verifyResetToken(rawToken: string) {
        if (!rawToken) throw new Error("Token é obrigatório");

        const tokenHash = hashResetToken(rawToken);
        const resetToken = await PasswordResetTokenModel.findOne({ tokenHash, used: false });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new Error("Link inválido ou expirado");
        }

        return { valid: true };
    }

    async resetPassword(rawToken: string, newPassword: string) {
        if (!rawToken || !newPassword) throw new Error("Dados incompletos");
        this.validatePasswordStrength(newPassword);

        const tokenHash = hashResetToken(rawToken);
        const resetToken = await PasswordResetTokenModel.findOne({ tokenHash, used: false });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new Error("Link inválido ou expirado");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await UserModel.updateOne(
            { _id: resetToken.userId },
            { password: hashedPassword, $inc: { tokenVersion: 1 } }
        );

        resetToken.used = true;
        await resetToken.save();
    }

    validatePasswordStrength(password: string) {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push("A senha deve ter no mínimo 8 caracteres");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("A senha deve conter ao menos uma letra minúscula");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("A senha deve conter ao menos uma letra maiúscula");
        }
        if (!/\d/.test(password)) {
            errors.push("A senha deve conter ao menos um número");
        }
        if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]/;']/.test(password)) {
            errors.push("A senha deve conter ao menos um caractere especial");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(" | "));
        }
    }
}

export { AuthService }