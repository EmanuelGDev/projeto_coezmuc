import "dotenv/config";
import fastify from 'fastify';
import cors from '@fastify/cors'
import mongoose from 'mongoose';
import { routes } from './src/routes/routes.js';

const app = fastify({ logger: true })

const mongodb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI as string)
        console.log("Connected to MongoDB")
    } catch (err) {
        console.log("Error connecting to MongoDB", err)
    }
}

app.setErrorHandler((error, request, reply) => {
    reply.code(400).send({ message: (error as Error).message })
})

const start = async () => {
    await app.register(cors, {
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
    await app.register(routes)

    try {
        await app.listen({ port: 3333 })
    } catch (err) {
        process.exit(1)
    }
}

mongodb();
start();