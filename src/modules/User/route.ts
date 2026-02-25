import type { FastifyInstance } from "fastify";
import { UserController } from "./controller";

async function userRoutes(fastify : FastifyInstance){

    const userController = new UserController();

    fastify.post('/create', async (request, reply) => {
        return userController.createUser(request, reply);
    });
}

export { userRoutes }