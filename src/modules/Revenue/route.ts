import authenticate from "../../lib/jwt";
import RevenueController from "./controller";
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
}

export { revenueRoutes }