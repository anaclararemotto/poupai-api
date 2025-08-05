import express from "express";
import { autenticarJWT } from "../auth/auth.js";
import UsuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", UsuarioController.cadastrarUsuario);
router.post("/login", UsuarioController.loginUsuario);

router.use(autenticarJWT);

router.get("/me", UsuarioController.obterUsuarioLogado);
router.get("/", UsuarioController.listarUsuarios);
router.get("/:id", UsuarioController.listarUsuariosPorId);

export default router;
