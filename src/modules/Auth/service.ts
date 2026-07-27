import { UserModel } from "../../lib/scheema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
            throw new Error("Invalid password");
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
            token, // o controller extrai isso e NÃO manda no corpo da resposta
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
}

export { AuthService }