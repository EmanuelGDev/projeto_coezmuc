import type { FastifyInstance } from "fastify";
import { AuthController } from "./controller.js";
import authenticate from "../../middlewares/authenticate.js";

async function authRoutes(fastify: FastifyInstance) {

    const authController = new AuthController();

    fastify.post('/login',
        {
            config:
            {
                rateLimit:
                {
                    max: 5,
                    timeWindow: '2 minute',
                    skipOnError: false,
                    onExceeding: (req, key) => { console.warn(`[rate-limit] IP ${key} se aproximando do limite de tentativas de login`) },
                    errorResponseBuilder: (req, context) => ({
                        statusCode: 429,
                        error: 'Too Many Requests',
                        message: `Muitas tentativas de login. Tente novamente em ${context.after}.`
                    })
                }
            }
        }, async (request, reply) => {
            return authController.login(request, reply);
        });

    fastify.post('/logout', { preHandler: authenticate }, async (request, reply) => {
        return authController.logout(request, reply);
    });

    fastify.get('/me', { preHandler: authenticate }, async (request, reply) => {
        return authController.me(request, reply);
    });

    fastify.post('/forgot-password',
        {
            config: {
                rateLimit: {
                    max: 3,
                    timeWindow: '10 minute',
                    skipOnError: false,
                    onExceeding: (req, key) => { console.warn(`[rate-limit] IP ${key} se aproximando do limite de recuperação de senha`) },
                    errorResponseBuilder: (req, context) => ({
                        statusCode: 429,
                        error: 'Too Many Requests',
                        message: `Muitas solicitações. Tente novamente em ${context.after}.`
                    })
                }
            }
        }, async (request, reply) => {
            return authController.forgotPassword(request, reply);
        });

    fastify.get('/verify-reset-token', async (request, reply) => {
        return authController.verifyResetToken(request, reply);
    });

    fastify.post('/reset-password',
        {
            config: {
                rateLimit: {
                    max: 5,
                    timeWindow: '10 minute',
                    skipOnError: false,
                    onExceeding: (req, key) => { console.warn(`[rate-limit] IP ${key} se aproximando do limite de troca de senha`) },
                    errorResponseBuilder: (req, context) => ({
                        statusCode: 429,
                        error: 'Too Many Requests',
                        message: `Muitas tentativas. Tente novamente em ${context.after}.`
                    })
                }
            }
        }, async (request, reply) => {
            return authController.resetPassword(request, reply);
        });
}

export { authRoutes }