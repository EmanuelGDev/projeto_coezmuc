import fastify from 'fastify';  
import cors from '@fastify/cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {routes} from './src/routes/routes.js';


const app = fastify ({logger : true})

dotenv.config();

const mongodb = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI as string)
        console.log("Connected to MongoDB")
    }   catch(err){ 
        console.log("Error connecting to MongoDB", err)
    }
}

app.setErrorHandler((error, request, reply) =>{
    reply.code(400).send({ message : (error as Error).message })
})

const start = async () => {

    await app.register(cors)
    await app.register(routes)

    try{
        await app.listen({port : 3333})
    } catch(err){
        process.exit(1)
    }
}

mongodb();
start();