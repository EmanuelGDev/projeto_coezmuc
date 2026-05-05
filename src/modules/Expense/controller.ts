import { FastifyReply, FastifyRequest } from "fastify";
import ExpenseService, { ExpenseData } from "./service";

class ExpenseController {
    private service: ExpenseService;
    constructor() {
        this.service = new ExpenseService();
    }
    

    async createExpense(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body as ExpenseData;
            const Expense = await this.service.createExpense(data,request);
            reply.code(201).send(Expense);
        } catch (err) {
            reply.code(400).send(err);
        }
    }

    async deleteExpense(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            await this.service.deleteExpense(id,request);
            reply.code(204).send();
        } catch (err) {
            reply.code(400).send(err);
        }
    }

    async getExpenses(request: FastifyRequest, reply: FastifyReply) {
        try {
            const Expenses = await this.service.getExpenses(request);
            reply.code(200).send(Expenses);
        } catch (err) {
            reply.code(400).send(err);
        }
    }
}

export default ExpenseController;