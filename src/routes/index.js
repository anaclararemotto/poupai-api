import express from "express";
import banco from "./bancoRoutes.js";
import categoria from "./categoriaRoutes.js";
import conta from "./contaRoutes.js";
import transacao from "./transacaoRoutes.js";
import usuario from "./usuarioRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("API Poupa.ai"));
    console.log("Rota raiz configurada");
    
    app.use(express.json(), usuario, transacao, banco, conta, categoria);
}

export default routes;