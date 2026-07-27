import type { FastifyInstance } from "fastify";
import { AuthController } from "./controller.js";
import authenticate from "../../middlewares/authenticate.js"; 

async function authRoutes(fastify: FastifyInstance) {

    const authController = new AuthController();

    fastify.post('/login', async (request, reply) => {
        return authController.login(request, reply);
    });

    fastify.post('/logout', { preHandler: authenticate }, async (request, reply) => {
        return authController.logout(request, reply);
    });

    fastify.get('/me', { preHandler: authenticate }, async (request, reply) => {
        return authController.me(request, reply);
    });
}

export { authRoutes }