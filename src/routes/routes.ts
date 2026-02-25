import type{ FastifyInstance } from "fastify";
import {userRoutes} from "../modules/User/route";
import { authRoutes } from "../modules/Auth/route";
import { subscriptionRoutes } from "../modules/Subscription/route";

async function routes(fastify : FastifyInstance){
    fastify.register(userRoutes, {prefix : '/user'});
    fastify.register(authRoutes, {prefix : '/auth'});
    fastify.register(subscriptionRoutes, {prefix : '/subscription'});
}

export {routes}