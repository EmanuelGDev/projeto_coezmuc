import authenticate from "../../lib/jwt";
import type { FastifyInstance } from "fastify";
import ExpenseController from "./controller";

async function ExpenseRoutes(fastify: FastifyInstance) {
    const expenseController = new ExpenseController();

    fastify.post('/create', { preHandler: [authenticate] }, async (request, reply) => {
        return expenseController.createExpense(request, reply);
    });
    fastify.delete('/delete/:id', { preHandler: [authenticate] }, async (request, reply) => {
        return expenseController.deleteExpense(request, reply);
    });
    fastify.get('/', { preHandler: [authenticate] }, async (request, reply) => {
        return expenseController.getExpenses(request, reply);
    });
}

export { ExpenseRoutes }