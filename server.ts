import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { routes } from './src/routes/routes.js';

dotenv.config(); 

const app = fastify({ logger: true });

const mongodb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI as string);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

app.setErrorHandler((error, request, reply) => {
  reply.code(400).send({ message: (error as Error).message });
});

const start = async () => {
  await app.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(","), 
  });

  await app.register(routes);

  try {
    await app.listen({ 
      port: Number(process.env.PORT) || 3333,
      host: '0.0.0.0' 
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

mongodb();
start();