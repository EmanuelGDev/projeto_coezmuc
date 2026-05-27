import { FastifyRequest } from "fastify";
import { ExpenseModel } from "../../lib/scheema.js";

export type ExpenseData = {
    type: string;
    description: string;
    date: Date;
    value: number;
}

class ExpenseService {
    // Ajuste os tipos conforme a realidade do seu projeto
    types = 
        ["Coordenação Geral",
        "Secretaria",
        "Apoio Médico Espiritual",
        "Manutenção",
        "Integração e Artes", 
        "Contabilidade",
        "Esportes",
        "Estudos",
        "Maternagem",
        "Nutrição"
    ];

    async createExpense(data: ExpenseData, request: FastifyRequest) {
        const user = (request as any).user;
        if (!user) throw new Error("User not found");
        if (!user.isAdmin) throw new Error("Only admins are allowed to do this action");
        if (!data.type || !data.description || !data.value) throw new Error("Missing required fields");

        return await ExpenseModel.create({ type: data.type, description: data.description, value: data.value });
    }

    async deleteExpense(id: string, request: FastifyRequest) {
        const user = (request as any).user;
        if (!user) throw new Error("User not found");
        if (!user.isAdmin) throw new Error("Only admins are allowed to do this action");

        const expense = await ExpenseModel.findById(id);
        if (!expense) throw new Error("Expense not found");
        await ExpenseModel.findByIdAndDelete(id);
    }

    async updateExpense(id: string, data: Partial<ExpenseData>, request: FastifyRequest) {
        const user = (request as any).user;
        if (!user) throw new Error("User not found");
        if (!user.isAdmin) throw new Error("Only admins are allowed to do this action");

        const expense = await ExpenseModel.findById(id);
        if (!expense) throw new Error("Expense not found");
        return await ExpenseModel.findByIdAndUpdate(id, data, { new: true });
    }

    async getExpenses(request: FastifyRequest) {
        const user = (request as any).user;
        if (!user) throw new Error("User not found");
        if (!user.isAdmin) throw new Error("Only admins are allowed to do this action");
        return await ExpenseModel.find();
    }
}

export default ExpenseService;