import express from "express";
import usuario from "./usuarioRoutes.js";
import transacao from "./transacaoRoutes.js";
import banco from "./bancoRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("API Poupa.ai"));
    console.log("Rota raiz configurada");
    
    app.use(express.json(), usuario, transacao, banco);
}

export default routes;