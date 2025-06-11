import express from "express";
import usuario from "./usuarioRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("API Poupa.ai"));
    console.log("Rota raiz configurada");
    
    app.use(express.json(), usuario);
}

export default routes;