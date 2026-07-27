import { FastifyRequest, FastifyReply } from "fastify"
import jwt from "jsonwebtoken";
import { UserModel } from "../lib/scheema.js"; // ajuste o caminho relativo conforme onde esse arquivo está

const JWT_SECRET = process.env.JWT_SECRET as string

export default async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.token;

  if (!token) {
    return reply.code(401).send({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const user = await UserModel.findById(decoded.userId).select('tokenVersion');
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return reply.code(401).send({ error: "Sessão inválida. Faça login novamente." });
    }

    (request as any).user = decoded;
  } catch (err) {
    return reply.code(401).send({ error: "Token inválido ou expirado. Tente fazer login novamente." });
  }
}