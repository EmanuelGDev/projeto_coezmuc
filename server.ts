import './src/env.js';
import fastify from 'fastify';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import { routes } from './src/routes/routes.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = fastify({ logger: false })

// Cache da conexão — evita abrir nova conexão a cada invocação serverless
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

// Cache do app — evita registrar plugins múltiplas vezes
let appReady = false

const buildApp = async () => {
    if (appReady) return app

    await app.register(cors, {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })

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