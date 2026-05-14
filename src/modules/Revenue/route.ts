import authenticate from "../../lib/jwt.js";
import RevenueController from "./controller.js";
import type { FastifyInstance } from "fastify";

async function revenueRoutes(fastify: FastifyInstance) {
    const revenueController = new RevenueController();

    fastify.post('/create', { preHandler: [authenticate] }, async (request, reply) => {
        return revenueController.createRevenue(request, reply);
    });
    fastify.delete('/delete/:id', { preHandler: [authenticate] }, async (request, reply) => {
        return revenueController.deleteRevenue(request, reply);
    });
    fastify.get('/', { preHandler: [authenticate] }, async (request, reply) => {
        return revenueController.getRevenues(request, reply);
    });
    fastify.put('/update/:id', { preHandler: [authenticate] }, async (request, reply) => {
        return revenueController.updateRevenue(request, reply);
    });
    fastify.get('/types', { preHandler: [authenticate] }, async (request, reply) => {
       
        return revenueController.getTypes(request, reply);
    });
}

export { revenueRoutes }