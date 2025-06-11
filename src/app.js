import express from "express"
import conectaNaDatabase from "./config/db.Connect.js";
import routes from "./routes/index.js";

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
    console.error("Erro de conexão", erro);
});

conexao.once("open", () => {
    console.log("Conexão com o banco feita com sucesso!");
    
})

const app = express();
routes(app);

export default app;