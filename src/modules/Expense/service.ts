import { FastifyRequest } from "fastify";
import { ExpenseModel } from "../../lib/scheema";


export type ExpenseData = {
    type: string;
    description: string;
    date: Date;
    value: number;
}


class ExpenseService {

    async createExpense(data: ExpenseData, request: FastifyRequest) {

const user = (request as any).user;
        if (!user) {
            throw new Error("User not found");
        } else if (!user.isAdmin) {
            throw new Error("Only admins are allowed to do this action");
        }

        if (!data.type || !data.description || !data.value) {
            throw new Error("Missing required fields");
        }
        const newExpense = await ExpenseModel.create({
            type: data.type,
            description: data.description,
            value: data.value
        });
        return newExpense;
    }

    async deleteExpense(id: string, request: FastifyRequest) {

const user = (request as any).user;
        if (!user) {
            throw new Error("User not found");
        } else if (!user.isAdmin) {
            throw new Error("Only admins are allowed to do this action");
        }

        const Expense = await ExpenseModel.findById(id);
        if (!Expense) {
            throw new Error("Expense not found");
        }
        await ExpenseModel.findByIdAndDelete(id);
    }

    async getExpenses(request: FastifyRequest) {
        const user = (request as any).user;
        if (!user) {
            throw new Error("User not found");
        } else if (!user.isAdmin) {
            throw new Error("Only admins are allowed to do this action");
        }
        return await ExpenseModel.find();
    }

    async validateAdmin(request: FastifyRequest) {

    }
}

export default ExpenseService;