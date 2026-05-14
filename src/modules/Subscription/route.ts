import type { FastifyInstance } from "fastify";
import { SubscriptionController } from "./controller.js";
import authenticate from "../../lib/jwt.js";

async function subscriptionRoutes(fastify: FastifyInstance) {

    const subscriptionController = new SubscriptionController();

    fastify.post('/create',{ preHandler: [authenticate] }, async (request, reply) => {
        return subscriptionController.createSubscription(request, reply);
    });
    fastify.get('/userSubscriptions/:userId',{ preHandler: [authenticate] }, async (request, reply) => {
        return subscriptionController.getSubscriptionByUserId(request, reply);
    });
    fastify.get('/',{ preHandler: [authenticate] }, async (request, reply) => {
        return subscriptionController.getSubscriptions(request, reply);
    });
    fastify.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
        return subscriptionController.getSubscriptionById(request, reply);
    })
    fastify.put('/update/:id', { preHandler: [authenticate] }, async (request, reply) => {
        return subscriptionController.updateSubscription(request,reply);
    })
    fastify.get('/revenue-summary', { preHandler: [authenticate] }, async (request, reply) => {
    return subscriptionController.getRevenueSummary(request, reply);
});
}

export { subscriptionRoutes }