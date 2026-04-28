import { FastifyRequest } from "fastify";
import { RevenueModel } from "../../lib/scheema";


export type RevenueData = {
    type: string;
    description: string;
    date: Date;
    value: number;
}


class RevenueService {

    async createRevenue(data: RevenueData, request: FastifyRequest) {

const user = (request as any).user;
        if (!user) {
            throw new Error("User not found");
        } else if (!user.isAdmin) {
            throw new Error("Only admins are allowed to do this action");
        }

        if (!data.type || !data.description || !data.value) {
            throw new Error("Missing required fields");
        }
        const newRevenue = await RevenueModel.create({
            type: data.type,
            description: data.description,
            value: data.value
        });
        return newRevenue;
    }

    async deleteRevenue(id: string, request: FastifyRequest) {

const user = (request as any).user;
        if (!user) {
            throw new Error("User not found");
        } else if (!user.isAdmin) {
            throw new Error("Only admins are allowed to do this action");
        }

        const revenue = await RevenueModel.findById(id);
        if (!revenue) {
            throw new Error("Revenue not found");
        }
        await RevenueModel.findByIdAndDelete(id);
    }

    async getRevenues(request: FastifyRequest) {
        const user = (request as any).user;
        if (!user) {
            throw new Error("User not found");
        } else if (!user.isAdmin) {
            throw new Error("Only admins are allowed to do this action");
        }
        return await RevenueModel.find();
    }

    async validateAdmin(request: FastifyRequest) {

    }
}

export default RevenueService;