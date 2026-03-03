import type { FastifyInstance } from "fastify";
import { SubscriptionController } from "./controller";

async function subscriptionRoutes(fastify : FastifyInstance){

    const subscriptionController = new SubscriptionController();

    fastify.post('/create', async (request, reply) => {
        return subscriptionController.createSubscription(request, reply);
    });

    fastify.get('/', async (request, reply) => {
        return subscriptionController.getSubscriptions(request, reply);
    });
}

export { subscriptionRoutes }