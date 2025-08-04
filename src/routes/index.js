import express from "express";
import banco from "./bancoRoutes.js";
import categoria from "./categoriaRoutes.js";
import conta from "./contaRoutes.js";
import transacao from "./transacaoRoutes.js";
import usuarioRouter from "./usuarioRoutes.js";

import { autenticarJWT } from "../auth/auth.js";
import UsuarioController from "../controllers/usuarioController.js";

const routes = (app) => {
  app.route("/").get((req, res) => res.status(200).send("API Poupa.ai"));
  console.log("Rota raiz configurada");

  app.use(express.json());
  app.use("/auth", usuarioRouter);
  app.get("/usuario/me", autenticarJWT, UsuarioController.obterUsuarioLogado);
  app.get("/usuario", autenticarJWT, UsuarioController.listarUsuarios);
  app.use("/banco", autenticarJWT, banco);
  app.use("/conta", autenticarJWT, conta);
  app.use("/transacao", autenticarJWT, transacao);
  app.use("/categoria", autenticarJWT, categoria);
};

export default routes;