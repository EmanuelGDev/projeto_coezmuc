import type { FastifyInstance } from "fastify";
import { userRoutes } from "../modules/User/route.js";
import { authRoutes } from "../modules/Auth/route.js";
import { subscriptionRoutes } from "../modules/Subscription/route.js";
import { revenueRoutes } from "../modules/Revenue/route.js";
import { expenseRoutes } from "../modules/Expense/route.js";

async function routes(fastify: FastifyInstance) {
    fastify.get("/ping", async (request, reply) => {
        return { status: "ok" };
    });
    fastify.register(userRoutes, { prefix: '/user' });
    fastify.register(authRoutes, { prefix: '/auth' });
    fastify.register(subscriptionRoutes, { prefix: '/subscription' });
    fastify.register(revenueRoutes, { prefix: '/revenue' });
    fastify.register(expenseRoutes, { prefix: '/expense' });
}

export { routes }