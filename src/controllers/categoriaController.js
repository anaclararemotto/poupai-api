import Categoria from "../model/Categoria.js";

class CategoriaController {
    static async listarCategorias(req, res) {
        try {
            const categorias = await Categoria.find({});
            res.status(200).json(categorias);
        } catch (erro) {
            res.status(500).send({message: `${erro.message} - falha ao listar categorias`});
        }
    }

    static async listarCategoriaPorId(req, res) {
        try {
            const id = req.params.id;
            const categoriaEncontrada = await Categoria.findById(id);
            res.status(200).json(categoriaEncontrada);
        } catch (erro) {
            res.status(500).send({ message: `${erro.message} - falha ao listar categoria por ID` });                                                 
        }
    }

    static async cadastrarCategoria(req, res) {
            try {
                const novaCategoria = await Categoria.create(req.body);
                res.status(201).json({
                    message: "Categoria cadastrada com  sucesso",
                    categoria: novaCategoria
                });
            } catch (erro) {
                res.status(500).send({ message: `${erro.message} - falha ao cadastrar categoria` });
            }
        }

        static async excluirCategoria(req, res) {
                try {
                  const id = req.params.id;
                  await Categoria.findByIdAndDelete(id);
                  res.status(200).json({ message: "Categoria excluída com sucesso" });
                } catch (erro) {
                  res
                    .status(500)
                    .json({ message: `Erro ao excluir Categoria: ${erro.message}` });
                }
              }
}

export default CategoriaController