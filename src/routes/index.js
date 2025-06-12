import express from "express";
import usuario from "./usuarioRoutes.js";
import transacao from "./transacaoRoutes.js";
import banco from "./bancoRoutes.js";
import conta from "./contaRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("API Poupa.ai"));
    console.log("Rota raiz configurada");
    
    app.use(express.json(), usuario, transacao, banco, conta);
}

export default routes;