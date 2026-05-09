import type { FastifyInstance } from "fastify";
import { AuthController } from "./controller.js";

async function authRoutes(fastify : FastifyInstance){

    const authController = new AuthController();

    fastify.post('/login', async (request, reply) => {
        return authController.login(request, reply);
    });
}

export { authRoutes }