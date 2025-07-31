// src/auth/auth.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const segredo = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

export function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // Log para depuração: Verifique se o token é recebido corretamente

  console.log("DEBUG Middleware: Token recebido:", token);

  jwt.verify(token, segredo, (err, usuarioDecodificado) => {
    if (err) {
      // Log para depuração: Mostra o erro se o token for inválido/expirado
      console.error("DEBUG Middleware: Erro na verificação do token:", err);
      return res.status(403).json({ message: "Token inválido ou expirado" });
    } // AQUI É A LINHA CRÍTICA // A propriedade 'req.user' DEVE ser o objeto decodificado do token // O payload do token, que o loginUsuario criou, é o 'usuarioDecodificado'
    req.user = usuarioDecodificado;
    console.log("DEBUG Middleware: Token decodificado. Payload:", req.user);
    next();
  });
}
