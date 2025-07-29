import express from "express";
import UsuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/usuario", UsuarioController.listarUsuarios);
router.get("/usuario/:id", UsuarioController.listarUsuariosPorId);
router.post("/usuario", UsuarioController.cadastrarUsuario);
router.post("/login", UsuarioController.loginUsuario);
router.get("/usuario/me", autenticarToken, UsuarioController.obterUsuarioLogado); // <<-- AQUI ESTÁ A ROTA COM MIDDLEWARE

export default router;