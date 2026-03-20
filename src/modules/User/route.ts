import type { FastifyInstance } from "fastify";
import { UserController } from "./controller";
import authenticate from "../../lib/jwt";

async function userRoutes(fastify : FastifyInstance){

    const userController = new UserController();

    fastify.get('/:id',{ preHandler: [authenticate] }, async (request, reply) => {
        return userController.getUser(request, reply);
    });

    fastify.post('/create', async (request, reply) => {
        return userController.createUser(request, reply);
    });


}

export { userRoutes }