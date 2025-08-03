import Conta from "../model/Conta.js";
import Transacao from "../model/Transacao.js";
import ContaController from "./ContaContoller.js";
import mongoose from "mongoose";

class TransacaoController {
  static async listarTransacoes(req, res) {
    try {
      const contaUsuario = await Conta.findOne({ usuario: req.user.id });

      if (!contaUsuario) {
        return res
          .status(404)
          .json({ message: "Conta do usuário não encontrada" });
      }

      const listarTransacoes = await Transacao.find({ conta: contaUsuario._id })
        .populate("bancoOrigem", "nome")
        .populate("bancoDestino", "nome")
        .populate("categoria", "nome");

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

      const transacaoEncontrada = await Transacao.findById(id)
        .populate("bancoOrigem", "nome")
        .populate("bancoDestino", "nome");

      if (!transacaoEncontrada) {
        return res.status(404).json({ message: "Transação não encontrada." });
      }

      const contaUsuario = await Conta.findOne({ "usuario._id": req.user.id });
      if (!contaUsuario) {
        return res
          .status(404)
          .json({ message: "Conta do usuário não encontrada." });
      }

      if (
        transacaoEncontrada.conta.toString() !== contaUsuario._id.toString()
      ) {
        return res.status(403).json({ message: "Acesso negado à transação." });
      }

      res.status(200).json(transacaoEncontrada);
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao listar transação` });
    }
  }

  static async criarTransacoes(req, res) {
    try {
      const { tipo, valor, categoria, bancoOrigem, bancoDestino } = req.body;

      const contaUsuario = await Conta.findOne({ usuario: req.user.id });
      if (!contaUsuario) {
        return res
          .status(404)
          .json({ message: "Conta do usuário não encontrada." });
      }

      if (!["receita", "despesa", "transferencia"].includes(tipo)) {
        return res.status(400).json({ message: "Tipo de transação inválido." });
      }

      if (valor <= 0 || valor > 5000) {
        return res.status(400).json({ message: "Valor inválido." });
      }

      if (
        (tipo === "despesa" || tipo === "transferencia") &&
        contaUsuario.saldo < valor
      ) {
        return res
          .status(400)
          .json({ message: `Saldo insuficiente para ${tipo}.` });
      }

      if (tipo === "receita") {
        if (!bancoDestino) {
          return res
            .status(400)
            .json({ message: "Conta de destino obrigatória para receita." });
        }
        await ContaController.adicionarSaldo(contaUsuario._id, valor);
      } else if (tipo === "despesa") {
        if (!bancoOrigem) {
          return res
            .status(400)
            .json({ message: "Conta de origem obrigatória para despesa." });
        }
        await ContaController.subtrairSaldo(contaUsuario._id, valor);
      } else if (tipo === "transferencia") {
        if (!bancoOrigem || !bancoDestino) {
          return res.status(400).json({
            message:
              "Contas de origem e destino obrigatórias para transferência.",
          });
        }
        await ContaController.transferirSaldo(
          contaUsuario._id,
          contaUsuario._id,
          valor
        );
      }

      const novaTransacao = new Transacao({
        tipo,
        valor,
        categoria: tipo !== "transferencia" ? categoria : undefined,
        bancoOrigem:
          tipo === "despesa" || tipo === "transferencia"
            ? bancoOrigem
            : undefined,
        bancoDestino:
          tipo === "receita" || tipo === "transferencia"
            ? bancoDestino
            : undefined,
        conta: contaUsuario._id,
      });

      await novaTransacao.save();

      const contaAtualizada = await Conta.findById(contaUsuario._id);

      res.status(201).json({
        message: "Transação criada com sucesso",
        transacao: novaTransacao,
        saldoAtual: contaAtualizada.saldo,
      });
    } catch (erro) {
      res
        .status(500)
        .json({ message: `Erro ao criar transação: ${erro.message}` });
    }
  }

  static async excluirTransacao(req, res) {
    try {
      const id = req.params.id;

      const transacao = await Transacao.findById(id);
      if (!transacao) {
        return res.status(404).json({ message: "Transação não encontrada." });
      }

      const contaUsuario = await Conta.findOne({ usuario: req.user.id });
      if (!contaUsuario) {
        return res
          .status(404)
          .json({ message: "Conta do usuário não encontrada." });
      }

      if (transacao.conta.toString() !== contaUsuario._id.toString()) {
        return res.status(403).json({ message: "Acesso negado à transação." });
      }

      await Transacao.findByIdAndDelete(id);
      res.status(200).json({ message: "Transação excluída com sucesso." });
    } catch (erro) {
      res
        .status(500)
        .json({ message: `Erro ao excluir transação: ${erro.message}` });
    }
  }

 static async editarTransacao(req, res) {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;

    console.log("Editar Transação: ID", id);
    console.log("Editar Transação: Dados Recebidos", dadosAtualizados);

    const transacao = await Transacao.findById(id);
    if (!transacao) {
      return res.status(404).json({ message: "Transação não encontrada." });
    }
    console.log("Editar Transação: Transação Original", transacao);

    // CORREÇÃO AQUI: Use 'usuario: req.user.id' para encontrar a conta do usuário
    const contaUsuario = await Conta.findOne({ usuario: req.user.id });
    if (!contaUsuario) {
      return res
        .status(404)
        .json({ message: "Conta do usuário não encontrada." });
    }
    console.log("Editar Transação: Conta do Usuário", contaUsuario);


    if (transacao.conta.toString() !== contaUsuario._id.toString()) {
      return res.status(403).json({ message: "Acesso negado à transação." });
    }

    const conta = await Conta.findById(transacao.conta);
    if (!conta) {
      return res.status(404).json({ message: "Conta não encontrada." });
    }
    console.log("Editar Transação: Conta Associada à Transação", conta);

    // --- Reverter o saldo da transação original ---
    console.log("Editar Transação: Revertendo saldo original...");
    const valorOriginal = Number(transacao.valor); // Garante que é um número
    if (isNaN(valorOriginal)) {
        throw new Error("Valor original da transação inválido (não é um número).");
    }

    if (transacao.tipo === "receita") {
      await ContaController.subtrairSaldo(conta._id, valorOriginal);
      console.log(`Revertida Receita: Subtraído ${valorOriginal} de conta ${conta._id}`);
    } else if (transacao.tipo === "despesa") {
      await ContaController.adicionarSaldo(conta._id, valorOriginal);
      console.log(`Revertida Despesa: Adicionado ${valorOriginal} a conta ${conta._id}`);
    } else if (transacao.tipo === "transferencia") {
      // Para transferência, reverte a transferência original
      // ATENÇÃO: Aqui transacao.bancoDestino e transacao.bancoOrigem são IDs de BANCOS,
      // mas transferirSaldo espera IDs de CONTAS.
      // Se transferirSaldo move entre contas, você precisa do ID da CONTA, não do BANCO.
      // Se a transferência é DENTRO da mesma conta, esta reversão é desnecessária.
      // Se o erro for aqui, é porque ContaController.transferirSaldo falha com IDs de banco.
      await ContaController.transferirSaldo(
        transacao.bancoDestino,
        transacao.bancoOrigem,
        valorOriginal
      );
      console.log(`Revertida Transferência: ${valorOriginal} de ${transacao.bancoDestino} para ${transacao.bancoOrigem}`);
    }
    console.log("Editar Transação: Saldo original revertido.");

    const {
      tipo,
      valor, // Este é o valor ATUALIZADO que vem do frontend
      categoria,
      bancoOrigem,
      bancoDestino,
    } = dadosAtualizados;

    // --- Validações e Limpeza para os dados atualizados ---
    // NOVO: Limpa o valor para garantir que é um número válido
    const valorLimpo = String(valor).replace(/[R$\s.]/g, '').replace(',', '.');
    const novoValor = Number(valorLimpo); // GARANTE QUE O NOVO VALOR É UM NÚMERO
    
    if (isNaN(novoValor)) {
        throw new Error(`Novo valor da transação inválido: '${valor}' (não é um número após limpeza).`);
    }

    if (!["receita", "despesa", "transferencia"].includes(tipo)) {
      return res.status(400).json({ message: "Tipo inválido." });
    }

    if (novoValor <= 0 || novoValor > 5000) {
      return res.status(400).json({ message: "Valor inválido (deve ser entre 0.01 e 5000)." });
    }
    console.log("Editar Transação: Novo Valor (numérico e limpo)", novoValor);


    // --- Aplica o novo saldo com base nos dados atualizados ---
    console.log("Editar Transação: Aplicando novo saldo...");
    if (tipo === "receita") {
      await ContaController.adicionarSaldo(conta._id, novoValor);
      console.log(`Aplicada Receita: Adicionado ${novoValor} a conta ${conta._id}`);
    } else if (tipo === "despesa") {
      const contaAtualizadaParaVerificacao = await Conta.findById(conta._id);
      if (contaAtualizadaParaVerificacao.saldo < novoValor) {
        return res
          .status(400)
          .json({ message: "Saldo insuficiente para despesa." });
      }
      await ContaController.subtrairSaldo(conta._id, novoValor);
      console.log(`Aplicada Despesa: Subtraído ${novoValor} de conta ${conta._id}`);
    } else if (tipo === "transferencia") {
      await ContaController.transferirSaldo(bancoOrigem, bancoDestino, novoValor);
      console.log(`Aplicada Transferência: ${novoValor} de ${bancoOrigem} para ${bancoDestino}`);
    }
    console.log("Editar Transação: Novo saldo aplicado.");


    const transacaoAtualizada = await Transacao.findByIdAndUpdate(
      id,
      {
        tipo,
        valor: novoValor, // Salva o valor como número no DB
        categoria: tipo !== "transferencia" ? categoria : undefined,
        bancoOrigem:
          tipo === "despesa" || tipo === "transferencia"
            ? bancoOrigem
            : undefined,
        bancoDestino:
          tipo === "receita" || tipo === "transferencia"
            ? bancoDestino
            : undefined,
        conta: conta._id,
        data: dadosAtualizados.data || transacao.data
      },
      { new: true }
    );
    console.log("Editar Transação: Transação atualizada no DB.");


    // Recarrega o saldo da conta para a resposta
    const saldoAtual = (await Conta.findById(conta._id)).saldo;
    console.log("Editar Transação: Saldo Final da Conta", saldoAtual);


    res.status(200).json({
      message: "Transação atualizada com sucesso.",
      transacao: transacaoAtualizada,
      saldoAtual,
    });
  } catch (erro) {
    console.error("Erro no editarTransacao:", erro);
    res
      .status(500)
      .json({ message: `Erro ao editar transação: ${erro.message}` });
  }
}



  static async totalReceitasMes(req, res) {
    try {
      const usuarioId = req.user.id;
      const total = await TransacaoController.obterTotalReceitasMes(usuarioId);
      res.status(200).json({ totalReceitas: total });
    } catch (erro) {
      res.status(500).json({ message: erro.message });
    }
  }

  static async totalDespesasMes(req, res) {
    try {
      const usuarioId = req.user.id;
      const total = await TransacaoController.obterTotalDespesasMes(usuarioId);
      res.status(200).json({ totalDespesas: total });
    } catch (erro) {
      res.status(500).json({ message: erro.message });
    }
  }

  static async obterTotalReceitasMes(req, res) {
    try {
      const usuarioId = req.user.id;
      const conta = await Conta.findOne({ usuario: usuarioId });

      if (!conta) {
        return res
          .status(404)
          .json({ message: "Conta do usuário não encontrada." });
      }

      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const fimMes = new Date(inicioMes);
      fimMes.setMonth(fimMes.getMonth() + 1);
      fimMes.setDate(0);
      fimMes.setHours(23, 59, 59, 999);

      const total = await Transacao.aggregate([
        {
          $match: {
            conta: new mongoose.Types.ObjectId(conta._id),
            tipo: "receita",
            data: { $gte: inicioMes, $lte: fimMes },
          },
        },
        {
          $group: {
            _id: null,
            totalReceitas: { $sum: "$valor" },
          },
        },
      ]);

      const totalReceitas = total.length > 0 ? total[0].totalReceitas : 0;
      res.status(200).json({ totalReceitas });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erro ao obter total de receitas",
          error: error.message,
        });
    }
  }

  static async obterTotalDespesasMes(req, res) {
    try {
      const usuarioId = req.user.id;
      const conta = await Conta.findOne({ usuario: usuarioId });

      if (!conta) {
        return res
          .status(404)
          .json({ message: "Conta do usuário não encontrada." });
      }

      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const fimMes = new Date(inicioMes);
      fimMes.setMonth(fimMes.getMonth() + 1);
      fimMes.setDate(0);
      fimMes.setHours(23, 59, 59, 999);

      const total = await Transacao.aggregate([
        {
          $match: {
            conta: new mongoose.Types.ObjectId(conta._id),
            tipo: "despesa",
            data: { $gte: inicioMes, $lte: fimMes },
          },
        },
        {
          $group: {
            _id: null,
            totalDespesas: { $sum: "$valor" },
          },
        },
      ]);

      const totalDespesas = total.length > 0 ? total[0].totalDespesas : 0;
      res.status(200).json({ totalDespesas });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erro ao obter total de despesas",
          error: error.message,
        });
    }
  }
}

export default TransacaoController;
