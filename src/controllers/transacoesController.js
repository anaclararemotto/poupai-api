import Transacao from "../model/Transacao.js";

class TransacaoController {
    
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

      const novaTransacao = new Transacao({
        tipo,
        valor,
        data: new Date(data),
        categoria: tipo !== "transferencia" ? categoria : undefined,
        bancoOrigem: tipo !== "despesa" ? bancoOrigem : undefined,
        bancoDestino: tipo !== "receita" ? bancoDestino : undefined,
      });

      res
        .status(201)
        .json({
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
