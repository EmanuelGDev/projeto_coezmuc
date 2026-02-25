import type { FastifyReply, FastifyRequest } from "fastify"
import { UserService } from "./service";

class UserController {

    
    private service : UserService

    constructor(){
        this.service = new UserService();
    }

     async createUser(request: FastifyRequest, reply: FastifyReply){
        try{
            const {username,email,password,confirmPassword} = request.body as {username: string, email: string, password: string, confirmPassword: string};
            const user = await this.service.createUser(username,email,password,confirmPassword);
            reply.code(201).send(user);   
        }
        catch(err){
            reply.code(400).send(err)
        }   
    }
}

export {UserController}