import express from "express"
import CategoriaController from "../controllers/categoriaController.js";

const router = express.Router();

router.get("/categoria", CategoriaController.listarCategorias);
router.get("/categoria/:id", CategoriaController.listarCategoriaPorId);
router.post("/categoria", CategoriaController.cadastrarCategoria);
router.delete("/categoria/:id", CategoriaController.excluirCategoria);

export default router;