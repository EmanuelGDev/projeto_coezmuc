import type { FastifyReply, FastifyRequest } from "fastify";
import { SubscriptionService, type SubscriptionData } from "./service";

class SubscriptionController {
  private service: SubscriptionService;

  constructor() {
    this.service = new SubscriptionService();
  }

  async createSubscription(request: FastifyRequest, reply: FastifyReply) {

    try {
      const subscriptionData = request.body as SubscriptionData;
      const subscription = await this.service.createSubscription(subscriptionData);

      return reply.code(201).send({
        data: subscription,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      return reply.code(400).send({ error: message });
    }
  }

  async getSubscriptions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const subscriptions = await this.service.getSubscriptions();
      return reply.code(200).send({
        data: subscriptions
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      return reply.code(400).send({ error: message });
    }
  }

  async getSubscriptionByUserId(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = request.params as { userId: string };
      const subscription = await this.service.getSubscriptionByUserId(userId);

      if (!subscription) {
        return reply.code(404).send({ error: "Subscription not found" });
      }
      return reply.code(200).send({ data: subscription });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      return reply.code(400).send({ error: message });
    }
  }

  async getSubscriptionById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const subscription = await this.service.getSubscriptionById(id);

      if (!subscription) {
        return reply.code(404).send({ error: "Subscription not found" });
      }
      return reply.code(200).send({ data: subscription });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      return reply.code(400).send({ error: message });
    }
  }

}

export { SubscriptionController }