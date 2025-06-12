import Conta  from "../model/Conta.js";
import Transacao from "../model/Transacao.js";
import ContaController from "./ContaContoller.js";

class TransacaoController {
  
  static async listarTransacoes(req, res) {
    try {
      const listarTransacoes = await Transacao.find({});
      res.status(200).json(listarTransacoes);
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao listar transações` });
    }
  }

  static async listarTransacoesPorId(req, res) {
    try {
      const id = req.params.id;
      const transacaoEncontrada = await Transacao.findById(id);
      res.status(200).json(transacaoEncontrada);
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao listar transações` });
    }
  }

  static async criarTransacoes(req, res) {
  try {
    const { tipo, valor, data, categoria, bancoOrigem, bancoDestino, conta } = req.body;

    console.log(req.body);

    if (!["receita", "despesa", "transferencia"].includes(tipo)) {
      return res.status(400).json({
        message: "Tipo de transação inválido. Deve ser 'receita', 'despesa' ou 'transferencia'.",
      });
    }

    if (valor <= 0 || valor > 5000) {
      return res.status(400).json({
        message: "Valor inválido. Deve ser maior que 0 e menor ou igual a 5000.",
      });
    }

    const contaExistente = await Conta.findById(conta);
    if (!contaExistente) {
      return res.status(404).json({ message: "Conta não encontrada." });
    }

    if ((tipo === "despesa" || tipo === "transferencia") && contaExistente.saldo < valor) {
      return res.status(400).json({ message: `Saldo insuficiente para ${tipo}.` });
    }

    try {
      if (tipo === "receita") {
        if (!bancoDestino) {
          return res.status(400).json({ message: "Conta de destino obrigatória para receita." });
        }
        await ContaController.adicionarSaldo(conta, valor); 
      } else if (tipo === "despesa") {
        if (!bancoOrigem) {
          return res.status(400).json({ message: "Conta de origem obrigatória para despesa." });
        }
        await ContaController.subtrairSaldo(conta, valor);
      } else if (tipo === "transferencia") {
        if (!bancoOrigem || !bancoDestino) {
          return res.status(400).json({ message: "Contas de origem e destino obrigatórias para transferência." });
        }
        await ContaController.transferirSaldo(conta, conta, valor); 
      }
    } catch (erroSaldo) {
      return res.status(400).json({ message: `Falha ao atualizar saldo: ${erroSaldo.message}` });
    }

    const novaTransacao = new Transacao({
      tipo,
      valor,
      data: new Date(data),
      categoria: tipo !== "transferencia" ? categoria : undefined,
      bancoOrigem: tipo !== "despesa" ? bancoOrigem : undefined,
      bancoDestino: tipo !== "receita" ? bancoDestino : undefined,
      conta,
    });

    await novaTransacao.save();

    const contaAtualizada = await Conta.findById(conta);

    res.status(201).json({
      message: "Transação criada com sucesso",
      transacao: novaTransacao,
      saldoAtual: contaAtualizada.saldo,
    });
  } catch (erro) {
    res.status(500).json({ message: `Erro ao criar transação: ${erro.message}` });
  }
}


  static async excluirTransacao(req, res) {
    try {
      const id = req.params.id;
      await Transacao.findByIdAndDelete(id);
      res.status(200).json({ message: "Transação excluída com sucesso" });
    } catch (erro) {
      res
        .status(500)
        .json({ message: `Erro ao excluir transação: ${erro.message}` });
    }
  }
}

export default TransacaoController;
