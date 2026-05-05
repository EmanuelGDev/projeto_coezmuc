import type { FastifyReply, FastifyRequest } from "fastify";
import { SubscriptionService, type SubscriptionData } from "./service";

class SubscriptionController {
  private service: SubscriptionService;

  constructor() {
    this.service = new SubscriptionService();
  }

  // ─── Helper privado ──────────────────────────────────────────────────────────

  private handleError(err: unknown, reply: FastifyReply) {
    const message = err instanceof Error ? err.message : "Unexpected error";

    // Erros de autorização retornam 403
    if (message.toLowerCase().includes("admin") || message.toLowerCase().includes("allowed")) {
      return reply.code(403).send({ error: message });
    }

    // Erros de "not found" retornam 404
    if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("não encontrad")) {
      return reply.code(404).send({ error: message });
    }

    return reply.code(400).send({ error: message });
  }

  // ─── Métodos públicos ────────────────────────────────────────────────────────

  async createSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const subscriptionData = request.body as SubscriptionData;
      const subscription = await this.service.createSubscription(subscriptionData);
      return reply.code(201).send({ data: subscription });
    } catch (err) {
      return this.handleError(err, reply);
    }
  }

  async getSubscriptions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const subscriptions = await this.service.getSubscriptions();
      return reply.code(200).send({ data: subscriptions });
    } catch (err) {
      return this.handleError(err, reply);
    }
  }

  async getSubscriptionByUserId(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = request.params as { userId: string };
      const subscriptions = await this.service.getSubscriptionByUserId(userId);
      return reply.code(200).send({ data: subscriptions });
    } catch (err) {
      return this.handleError(err, reply);
    }
  }

  async getSubscriptionById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const subscription = await this.service.getSubscriptionById(id);

      if (!subscription) {
        return reply.code(404).send({ error: "Inscrição não encontrada" });
      }

      return reply.code(200).send({ data: subscription });
    } catch (err) {
      return this.handleError(err, reply);
    }
  }

  async updateSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const updateData = request.body as Partial<SubscriptionData>;

      const updated = await this.service.updateSubscription(id, updateData); // ← request removido
      return reply.code(200).send({ data: updated });
    } catch (err) {
      return this.handleError(err, reply);
    }
  }
}

export { SubscriptionController };