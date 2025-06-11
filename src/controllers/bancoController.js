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
}

export default BancoController;