import Transacao from "../model/Transacao.js";

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
      const { tipo, valor, data, categoria, bancoOrigem, bancoDestino } =
        req.body;

      if (!["receita", "despesa", "transferencia"].includes(tipo)) {
        return res.status(400).json({
          message:
            "Tipo de transação inválido. Deve ser 'receita', 'despesa' ou 'transferencia'.",
        });
      }

      if (valor <= 0 || valor > 5000){
        return res.status(400).json({
          message: "Valor inválido. Deve ser maior que 0 e menor ou igual a 5000.",
        });
      }

      const novaTransacao = new Transacao({
        tipo,
        valor,
        data: new Date(data),
        categoria: tipo !== "transferencia" ? categoria : undefined,
        bancoOrigem: tipo !== "despesa" ? bancoOrigem : undefined,
        bancoDestino: tipo !== "receita" ? bancoDestino : undefined,
      });

      await novaTransacao.save();

      res.status(201).json({
        message: "Transação criada com sucesso",
        transacao: novaTransacao,
      });
    } catch (erro) {
      res
        .status(500)
        .json({ message: `Erro ao criar transação: ${erro.message}` });
    }
  }
}

export default TransacaoController;
