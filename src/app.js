import express from "express";
import conectaNaDatabase from "./config/db.Connect.js";
import routes from "./routes/index.js";
import cors from "cors";

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
  console.error("Erro de conexão", erro);
});

conexao.once("open", () => {
  console.log("Conexão com o banco feita com sucesso!");
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json()); 

routes(app);

app.listen(4000, () => console.log("API rodando na porta 4000"));

export default app;
