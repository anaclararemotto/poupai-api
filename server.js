import "dotenv/config";
import conectaNaDatabase from "./src/config/db.Connect.js";
import app from "./src/app.js";

async function main() {
  try {
    await conectaNaDatabase();
    console.log("Conexão com o banco feita com sucesso!");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Servidor escutando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

main();
