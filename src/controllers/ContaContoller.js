import Conta from "../model/Conta.js";
import {Usuario} from "../model/Usuario.js";

class ContaController {
  static async listarContas(req, res) {
    try {
      const contas = await Conta.find({});
      res.status(200).json(contas);
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao listar contas` });
    }
  }

  static async cadastrarConta(req, res) {
    const novaConta = req.body;
    console.log(req.body);
    
   try {
      const usuarioEncontrado = await Usuario.findById(novaConta.usuario);

      if (!usuarioEncontrado) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const contaCompleta = {
        ...novaConta,
        usuario: usuarioEncontrado.toObject(), 
      };

      const contaCriada = await Conta.create(contaCompleta);

      res.status(201).json({
        message: "Conta criada com sucesso",
        conta: contaCriada
      });

    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha ao cadastrar conta`
      });
    }
  }
}

export default ContaController;
