import { FastifyReply, FastifyRequest } from "fastify";
import ExpenseService, { ExpenseData } from "./service.js";

class ExpenseController {
    private service: ExpenseService;
    constructor() {
        this.service = new ExpenseService();
    }


    async createExpense(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body as ExpenseData;
            const expense = await this.service.createExpense(data, request);
            reply.code(201).send(expense);
        } catch (err) {
            reply.code(400).send(err);
        }
    }

    async deleteExpense(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            await this.service.deleteExpense(id, request);
            reply.code(204).send();
        } catch (err) {
            reply.code(400).send(err);
        }
    }

    async getExpenses(request: FastifyRequest, reply: FastifyReply) {
        try {
            const expenses = await this.service.getExpenses(request);
            reply.code(200).send(expenses);
        } catch (err) {
            reply.code(400).send(err);
        }
    }
    async updateExpense(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const data = request.body as Partial<ExpenseData>;
            const updated = await this.service.updateExpense(id, data, request);
            reply.code(200).send(updated);
        } catch (err) {
            reply.code(400).send(err);
        }
    }

    async getTypes(_request: FastifyRequest, reply: FastifyReply) {
        // Retorna o array de tipos sem bater no banco —
        // é uma lista estática que o front usa pra popular o <select>
        reply.code(200).send(this.service.types);
    }
}

export default ExpenseController;