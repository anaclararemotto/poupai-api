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

  static async listarContaPorId(req, res) {
    try {
        const id = req.params.id;
        const contaEncontrada = await Conta.findById(id);
        res.status(200).json(contaEncontrada);
    } catch (erro) {
        res.status(500).send({ message: `${erro.message} - falha ao listar conta por ID` });
    }
  }

  static async cadastrarConta(req, res) {
    const novaConta = req.body;
    
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

  static async adicionarSaldo(contaId, valor) {
    const conta = await Conta.findById(contaId);
    if (!conta) throw new Error("Conta não encontrada");
    
    conta.saldo += valor;
    await conta.save();
    return conta;
  }

  static async subtrairSaldo(contaId, valor) {
    const conta = await Conta.findById(contaId);
    if (!conta) throw new Error("Conta não encontrada");

    if (conta.saldo < valor) throw new Error("Saldo insuficiente");
    conta.saldo -= valor;
    await conta.save();
    return conta;
  }

  static async transferirSaldo(origemId, destinoId, valor) {
    const contaOrigem = await Conta.findById(origemId);
    if (!contaOrigem) throw new Error("Conta de origem não encontrada");

    const contaDestino = await Conta.findById(destinoId);
    if (!contaDestino) throw new Error("Conta de destino não encontrada");

    if (contaOrigem.saldo < valor) throw new Error("Saldo insuficiente para transferência");

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    await Promise.all([contaOrigem.save(), contaDestino.save()]);

    return { contaOrigem, contaDestino };
  }
}

export default ContaController;
