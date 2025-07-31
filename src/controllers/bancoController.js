// src/controllers/bancoController.js (Corrigido para incluir o novo método)

import Banco from '../model/Banco.js';

class BancoController {
    static async listarBancos(req, res) {
        try {
            const bancos = await Banco.find({});
            res.status(200).json(bancos);
        } catch (erro) {
            res.status(500).send({ message: `${erro.message} - falha ao listar bancos` });
        }
    }

    static async listarBancoPorId(req, res) {
        try {
            const id = req.params.id;
            const bancoEncontrado = await Banco.findById(id);
            res.status(200).json(bancoEncontrado);
        } catch (erro) {
            res.status(500).send({ message: `${erro.message} - falha ao listar banco por ID` });
        }
    }

    static async cadastrarBanco(req, res) {
        try {
            const novoBanco = await Banco.create(req.body);
            res.status(201).json({
                message: "Banco cadastrado com sucesso",
                banco: novoBanco
            });
        } catch (erro) {
            res.status(500).send({ message: `${erro.message} - falha ao cadastrar banco` });
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

    // *** ADICIONE ESTE NOVO MÉTODO ***
    static async listarAlgunsBancosPublicos(req, res) {
        try {
            // Exemplo: Retorne uma lista menor ou dados públicos de bancos
            const bancosPublicos = await Banco.find({ isPublic: true }).limit(5); // Supondo um campo 'isPublic'
            // Ou apenas um dummy response:
            // const bancosPublicos = [{ nome: "Banco Público 1", info: "Dados abertos" }, { nome: "Banco Público 2", info: "Mais dados" }];
            res.status(200).json({ message: "Dados de bancos públicos (sem autenticação)", data: bancosPublicos });
        } catch (erro) {
            res.status(500).send({ message: `${erro.message} - falha ao listar bancos públicos` });
        }
    }
}

export default BancoController;