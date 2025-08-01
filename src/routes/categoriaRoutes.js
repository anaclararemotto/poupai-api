import express from "express"
import CategoriaController from "../controllers/categoriaController.js";

const router = express.Router();

router.get("/", CategoriaController.listarCategorias);
router.get("/:id", CategoriaController.listarCategoriaPorId);
router.post("/", CategoriaController.cadastrarCategoria);
router.delete("/:id", CategoriaController.excluirCategoria);

export default router;