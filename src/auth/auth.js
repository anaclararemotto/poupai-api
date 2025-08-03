import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const segredo = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

export function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  console.log("DEBUG Middleware: Token recebido:", token);

  jwt.verify(token, segredo, (err, usuarioDecodificado) => {
    if (err) {
      console.error("DEBUG Middleware: Erro na verificação do token:", err);
      return res.status(403).json({ message: "Token inválido ou expirado" });
    }
    req.user = usuarioDecodificado;
    console.log("DEBUG Middleware: Token decodificado. Payload:", req.user);
    next();
  });
}
