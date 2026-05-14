import authenticate from "../../lib/jwt.js";
import ExpenseController from "./controller.js";
import type { FastifyInstance } from "fastify";

async function expenseRoutes(fastify: FastifyInstance) {
    const expenseController = new ExpenseController();

    fastify.post('/create', { preHandler: [authenticate] }, async (request, reply) => {
        return expenseController.createExpense(request, reply);
    });
    fastify.delete('/delete/:id', { preHandler: [authenticate] }, async (request, reply) => {
        return expenseController.deleteExpense(request, reply);
    });
    fastify.put('/update/:id', { preHandler: [authenticate] }, async (request, reply) => {
        return expenseController.updateExpense(request, reply);
    });
    fastify.get('/', { preHandler: [authenticate] }, async (request, reply) => {
        return expenseController.getExpenses(request, reply);
    });
    fastify.get('/types', { preHandler: [authenticate] }, async (request, reply) => {
        return expenseController.getTypes(request, reply);
    });
}

export { expenseRoutes };