import type { FastifyInstance } from "fastify";
import { SubscriptionController } from "./controller";
import authenticate from "../../lib/jwt";

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
}

export { subscriptionRoutes }