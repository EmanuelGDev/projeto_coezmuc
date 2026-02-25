import type { FastifyReply, FastifyRequest } from "fastify";
import { SubscriptionService, type PersonalData } from "./service";

class SubscriptionController {
  private service: SubscriptionService;

  constructor() {
    this.service = new SubscriptionService();
  }

  async createSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {userId, personalData, healthData, paymentData, status} = request.body as {userId : string, personalData: PersonalData, healthData: Object, paymentData: Object, status: string};
      const subscription = await this.service.createSubscription(userId, personalData, healthData);

      return reply.code(201).send({
        message: "Subscription created successfully",
        data: subscription,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      return reply.code(400).send({ error: message });
    }
  }
}

export { SubscriptionController }