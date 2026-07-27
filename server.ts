import './src/env.js';
import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import mongoose from 'mongoose';
import { routes } from './src/routes/routes.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = fastify({ logger: false })

let isConnected = false

const mongodb = async () => {
    if (isConnected) return
    try {
        await mongoose.connect(process.env.DATABASE_URI as string)
        isConnected = true
        console.log("Connected to MongoDB")
    } catch (err) {
        console.log("Error connecting to MongoDB", err)
        throw err
    }
}

app.setErrorHandler((error, request, reply) => {
    reply.code(400).send({ message: (error as Error).message })
})

let appReady = false

const buildApp = async () => {
    if (appReady) return app

    await app.register(cors, {
        origin: process.env.CORS_ORIGIN || (process.env.VERCEL !== '1' ? 'http://localhost:5173' : undefined),
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })

    await app.register(fastifyCookie)

    await app.register(routes)
    await app.ready()

    appReady = true
    return app
}

// Handler exportado para a Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
    await mongodb()
    const fastifyApp = await buildApp()
    fastifyApp.server.emit('request', req, res)
}

// Inicialização local (fora da Vercel)
if (process.env.VERCEL !== '1') {
    mongodb()
        .then(() => buildApp())
        .then((fastifyApp) => fastifyApp.listen({ port: Number(process.env.PORT) || 3333, host: '0.0.0.0' }))
        .then(() => console.log(`Server running on port ${process.env.PORT || 3333}`))
        .catch((err) => {
            console.error(err)
            process.exit(1)
        })
}