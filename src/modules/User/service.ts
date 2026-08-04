import { UserModel } from "../../lib/scheema.js";
import bcrypt from "bcrypt";

class UserService {

    async createUser(username: string, email: string, password: string, confirmPassword: string) {
        if (!username || !email || !password || !confirmPassword) {
            throw new Error("Missing required fields");
        }
        await this.existEmail(email);
        this.validatePasswordStrength(password);
        await this.confirmPassword(password, confirmPassword);

        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = false;

        const newUser = await UserModel.create({ username, email, password: hashedPassword, isAdmin });
        return (await newUser).save();
    }

    async getUser(id: string) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async existEmail(email: string) {
        const user = await UserModel.findOne({ email });
        if (user) {
            throw new Error("Email already in use");
        }
        return null;
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

    async confirmPassword(password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        return true;
    }

}

export { UserService }