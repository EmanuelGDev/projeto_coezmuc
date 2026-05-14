import { FastifyReply, FastifyRequest } from "fastify";
import RevenueService, { RevenueData } from "./service.js";

class RevenueController {
    private service: RevenueService;
    constructor() {
        this.service = new RevenueService();
    }


    async createRevenue(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body as RevenueData;
            const revenue = await this.service.createRevenue(data, request);
            reply.code(201).send(revenue);
        } catch (err) {
            reply.code(400).send(err);
        }
    }

    async deleteRevenue(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            await this.service.deleteRevenue(id, request);
            reply.code(204).send();
        } catch (err) {
            reply.code(400).send(err);
        }
    }

    async getRevenues(request: FastifyRequest, reply: FastifyReply) {
        try {
            const revenues = await this.service.getRevenues(request);
            reply.code(200).send(revenues);
        } catch (err) {
            reply.code(400).send(err);
        }
    }
    async updateRevenue(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const data = request.body as Partial<RevenueData>;
            const updated = await this.service.updateRevenue(id, data, request);
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

export default RevenueController;