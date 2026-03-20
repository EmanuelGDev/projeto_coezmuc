import { FastifyRequest, FastifyReply } from "fastify"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string

export default async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply.code(401).send({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return reply.code(401).send({ error: 'Token mal formatado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
    ;(request as any).user = decoded;
  } catch (err) {
    console.log('ERRO:', err)
    return reply.code(401).send({ error: "Token inválido ou expirado" });
  }
}