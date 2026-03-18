import type { FastifyInstance } from "fastify";
import { SubscriptionController } from "./controller";

async function subscriptionRoutes(fastify: FastifyInstance) {

    const subscriptionController = new SubscriptionController();

    fastify.post('/create', async (request, reply) => {
        return subscriptionController.createSubscription(request, reply);
    });
    fastify.get('/userSubscriptions/:userId', async (request, reply) => {
        return subscriptionController.getSubscriptionByUserId(request, reply);
    });
    fastify.get('/', async (request, reply) => {
        return subscriptionController.getSubscriptions(request, reply);
    });
    fastify.get('/:id', async (request, reply) => {
        return subscriptionController.getSubscriptionById(request, reply);
    })
}

export { subscriptionRoutes }