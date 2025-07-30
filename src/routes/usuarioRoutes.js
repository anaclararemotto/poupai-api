// src/routes/usuarioRoutes.js

import express from "express";
import UsuarioController from "../controllers/usuarioController.js"; // Importa a CLASSE UsuarioController
import { autenticarJWT } from "../auth/auth.js"; // Importa o middleware de autenticação

const router = express.Router();

// Rotas utilizando os métodos estáticos do UsuarioController
router.get("/usuario", UsuarioController.listarUsuarios);
router.get("/usuario/:id", UsuarioController.listarUsuariosPorId);
router.post("/usuario", UsuarioController.cadastrarUsuario);
router.post("/login", UsuarioController.loginUsuario);

// Rota protegida com o middleware autenticarJWT
// O método obterUsuarioLogado é chamado diretamente da classe
router.get("/usuario/me", autenticarJWT, UsuarioController.obterUsuarioLogado);

export default router;