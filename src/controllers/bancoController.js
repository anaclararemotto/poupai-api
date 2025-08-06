import Banco from "../model/Banco.js";

class BancoController {
  static async listarBancos(req, res) {
    try {
      const bancos = await Banco.find({});
      res.status(200).json(bancos);
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao listar bancos` });
    }
  }

  static async listarBancoPorId(req, res) {
    try {
      const id = req.params.id;
      const bancoEncontrado = await Banco.findById(id);
      res.status(200).json(bancoEncontrado);
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao listar banco por ID` });
    }
  }

  static async cadastrarBanco(req, res) {
    try {
      const novoBanco = await Banco.create(req.body);
      res.status(201).json({
        message: "Banco cadastrado com sucesso",
        banco: novoBanco,
      });
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao cadastrar banco` });
    }
  }

  static async excluirBanco(req, res) {
    try {
      const id = req.params.id;
      await Banco.findByIdAndDelete(id);
      res.status(200).json({ message: "Banco excluído com sucesso" });
    } catch (erro) {
      res
        .status(500)
        .json({ message: `Erro ao excluir Banco: ${erro.message}` });
    }
  }

  static async listarAlgunsBancosPublicos(req, res) {
    try {
      const bancosPublicos = await Banco.find({ isPublic: true }).limit(5);
      res.status(200).json({
        message: "Dados de bancos públicos (sem autenticação)",
        data: bancosPublicos,
      });
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao listar bancos públicos` });
    }
  }
}

export default BancoController;
