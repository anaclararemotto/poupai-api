import express from "express"
import CategoriaController from "../controllers/categoriaController.js";

const router = express.Router();

// As rotas são definidas em relação ao prefixo "/categoria" em index.js
// A rota GET /categoria para listar todas
router.get("/", CategoriaController.listarCategorias);
// A rota GET /categoria/:id para obter por ID
router.get("/:id", CategoriaController.listarCategoriaPorId);
// A rota POST /categoria para cadastrar
router.post("/", CategoriaController.cadastrarCategoria);
// A rota DELETE /categoria/:id para excluir
router.delete("/:id", CategoriaController.excluirCategoria);

export default router;