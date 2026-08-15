import type { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./service.js";

const isProd = process.env.NODE_ENV === 'production';

class AuthController {

    private service: AuthService

    constructor() {
        this.service = new AuthService();
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, password } = request.body as { email: string, password: string };
            const { token, user } = await this.service.login(email, password);

            reply.setCookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: 60 * 60 * 168, // 168h em segundos
            });

            reply.code(200).send({ message: "Login successful", data: user });
        } catch (err) {
            reply.code(400).send({ message: (err as Error).message });
        }
    }

    async logout(request: FastifyRequest, reply: FastifyReply) {
        try {
            const user = (request as any).user;
            await this.service.logout(user.userId);
            reply.clearCookie('token', { path: '/' });
            reply.code(200).send({ message: "Logout successful" });
        } catch (err) {
            reply.code(400).send({ message: (err as Error).message });
        }
    }

    async me(request: FastifyRequest, reply: FastifyReply) {
        try {
            const user = (request as any).user;
            const data = await this.service.me(user.userId);
            reply.code(200).send({ data });
        } catch (err) {
            reply.code(400).send({ message: (err as Error).message });
        }
    }

    async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email } = request.body as { email: string };
            await this.service.forgotPassword(email);
            reply.code(200).send({ message: "Email de recuperação enviado." });
        } catch (err) {
            reply.code(400).send({ message: (err as Error).message });
        }
    }

    async verifyResetToken(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { token } = request.query as { token: string };
            const result = await this.service.verifyResetToken(token);
            reply.code(200).send(result);
        } catch (err) {
            reply.code(400).send({ message: (err as Error).message });
        }
    }

    async resetPassword(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { token, newPassword } = request.body as { token: string; newPassword: string };
            await this.service.resetPassword(token, newPassword);
            reply.code(200).send({ message: "Senha redefinida com sucesso." });
        } catch (err) {
            reply.code(400).send({ message: (err as Error).message });
        }
    }
}

export { AuthController }