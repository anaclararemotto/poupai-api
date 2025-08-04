import { DateTime } from "luxon";
import mongoose from "mongoose";
import Banco from "../model/Banco.js";
import Categoria from "../model/Categoria.js";
import Conta from "../model/Conta.js";
import Transacao from "../model/Transacao.js";
import ContaController from "./ContaContoller.js";

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
    console.log("Corpo da requisição:", req.body);

    let { tipo, valor, categoria, bancoOrigem, bancoDestino, data, conta } = req.body;
    tipo = String(tipo).toLowerCase();

    const tiposValidos = ["receita", "despesa", "transferencia"];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ message: "Tipo de transação inválido." });
    }

    const valorLimpo = String(valor).replace(/[^\d,]/g, "").replace(",", ".");
    const valorNumerico = parseFloat(valorLimpo);
    if (isNaN(valorNumerico) || valorNumerico <= 0 || valorNumerico > 5000) {
      return res.status(400).json({ message: "Valor inválido." });
    }

    const contaUsuario = await Conta.findById(conta);
    if (!contaUsuario) {
      return res.status(404).json({ message: "Conta do usuário não encontrada." });
    }

    if (tipo !== "transferencia") {
      if (!categoria) {
        return res.status(400).json({ message: "Categoria é obrigatória para receitas e despesas." });
      }
      const categoriaExistente = await Categoria.findById(categoria);
      if (!categoriaExistente) {
        return res.status(404).json({ message: "Categoria não encontrada." });
      }
    }

    // Validação de bancos
    if (["despesa", "transferencia"].includes(tipo)) {
      const bancoOrigemExiste = await Banco.findById(bancoOrigem);
      if (!bancoOrigemExiste) {
        return res.status(404).json({ message: "Banco de origem não encontrado." });
      }
      if (contaUsuario.saldo < valorNumerico) {
        return res.status(400).json({ message: "Saldo insuficiente." });
      }
    }

    if (["receita", "transferencia"].includes(tipo)) {
      const bancoDestinoExiste = await Banco.findById(bancoDestino);
      if (!bancoDestinoExiste) {
        return res.status(404).json({ message: "Banco de destino não encontrado." });
      }
    }

    let dataCorrigida;
    try {
      dataCorrigida = data
        ? DateTime.fromISO(data, { zone: "America/Sao_Paulo" }).toUTC().toJSDate()
        : new Date();
    } catch (e) {
      return res.status(400).json({ message: "Data inválida." });
    }

    // Cria a transação
    const novaTransacao = new Transacao({
      tipo,
      valor: valorNumerico,
      data: dataCorrigida,
      categoria: tipo !== "transferencia" ? categoria : undefined,
      bancoOrigem: ["despesa", "transferencia"].includes(tipo) ? bancoOrigem : undefined,
      bancoDestino: ["receita", "transferencia"].includes(tipo) ? bancoDestino : undefined,
      conta: contaUsuario._id,
    });

    await novaTransacao.save();
    console.log("Transação salva:", novaTransacao);

    // --- Lógica de atualização de saldo alinhada ---
    if (tipo === "receita") {
      contaUsuario.saldo += valorNumerico;
      await contaUsuario.save();
    } else if (tipo === "despesa") {
      contaUsuario.saldo -= valorNumerico;
      await contaUsuario.save();
    } else if (tipo === "transferencia") {
      const contaDestino = await Conta.findOne({ banco: bancoDestino });
      if (!contaDestino) {
        return res.status(404).json({ message: "Conta de destino não encontrada." });
      }
      contaUsuario.saldo -= valorNumerico;
      contaDestino.saldo += valorNumerico;
      await contaUsuario.save();
      await contaDestino.save();
    }
    // --- Fim da lógica de atualização ---

    const contaAtualizada = await Conta.findById(contaUsuario._id);

    return res.status(201).json({
      message: "Transação criada com sucesso",
      transacao: novaTransacao,
      saldoAtual: contaAtualizada.saldo,
    });
  } catch (erro) {
    console.error("Erro ao criar transação:", erro);
    return res.status(500).json({ message: `Erro ao criar transação: ${erro.message}` });
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
      return res.status(404).json({ message: "Conta do usuário não encontrada." });
    }

    if (transacao.conta.toString() !== contaUsuario._id.toString()) {
      return res.status(403).json({ message: "Acesso negado à transação." });
    }

    const conta = await Conta.findById(transacao.conta);
    if (!conta) {
      return res.status(404).json({ message: "Conta associada à transação não encontrada." });
    }

    const valorTransacao = Number(transacao.valor);

    // Lógica de reversão do saldo
    if (transacao.tipo === "receita") {
      conta.saldo -= valorTransacao;
      await conta.save();
    } else if (transacao.tipo === "despesa") {
      conta.saldo += valorTransacao;
      await conta.save();
    } else if (transacao.tipo === "transferencia") {
      const contaOrigem = await Conta.findById(transacao.bancoOrigem);
      const contaDestino = await Conta.findById(transacao.bancoDestino);

      if (contaOrigem && contaDestino) {
        contaOrigem.saldo += valorTransacao;
        contaDestino.saldo -= valorTransacao;
        await contaOrigem.save();
        await contaDestino.save();
      }
    }

    await Transacao.findByIdAndDelete(id);

    const contaAtualizada = await Conta.findById(conta._id);
    const saldoAtual = contaAtualizada.saldo;
    
    res.status(200).json({ 
      message: "Transação excluída com sucesso e saldo atualizado.", 
      saldoAtual: saldoAtual 
    });
  } catch (erro) {
    res.status(500).json({ message: `Erro ao excluir transação: ${erro.message}` });
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
      console.log("Editar Transação: Revertendo saldo original...");
      const valorOriginal = Number(transacao.valor);
      if (isNaN(valorOriginal)) {
        throw new Error(
          "Valor original da transação inválido (não é um número)."
        );
      }

      if (transacao.tipo === "receita") {
        await ContaController.subtrairSaldo(conta._id, valorOriginal);
        console.log(
          `Revertida Receita: Subtraído ${valorOriginal} de conta ${conta._id}`
        );
      } else if (transacao.tipo === "despesa") {
        await ContaController.adicionarSaldo(conta._id, valorOriginal);
        console.log(
          `Revertida Despesa: Adicionado ${valorOriginal} a conta ${conta._id}`
        );
      } else if (transacao.tipo === "transferencia") {
        await ContaController.transferirSaldo(
          transacao.bancoDestino,
          transacao.bancoOrigem,
          valorOriginal
        );
        console.log(
          `Revertida Transferência: ${valorOriginal} de ${transacao.bancoDestino} para ${transacao.bancoOrigem}`
        );
      }
      console.log("Editar Transação: Saldo original revertido.");

      const { tipo, valor, categoria, bancoOrigem, bancoDestino } =
        dadosAtualizados;

      const valorLimpo = String(valor)
        .replace(/[R$\s.]/g, "")
        .replace(",", ".");
      const novoValor = Number(valorLimpo);

      if (isNaN(novoValor)) {
        throw new Error(
          `Novo valor da transação inválido: '${valor}' (não é um número após limpeza).`
        );
      }

      if (!["receita", "despesa", "transferencia"].includes(tipo)) {
        return res.status(400).json({ message: "Tipo inválido." });
      }

      if (novoValor <= 0 || novoValor > 5000) {
        return res
          .status(400)
          .json({ message: "Valor inválido (deve ser entre 0.01 e 5000)." });
      }
      console.log("Editar Transação: Novo Valor (numérico e limpo)", novoValor);

      console.log("Editar Transação: Aplicando novo saldo...");
      if (tipo === "receita") {
        await ContaController.adicionarSaldo(conta._id, novoValor);
        console.log(
          `Aplicada Receita: Adicionado ${novoValor} a conta ${conta._id}`
        );
      } else if (tipo === "despesa") {
        const contaAtualizadaParaVerificacao = await Conta.findById(conta._id);
        if (contaAtualizadaParaVerificacao.saldo < novoValor) {
          return res
            .status(400)
            .json({ message: "Saldo insuficiente para despesa." });
        }
        await ContaController.subtrairSaldo(conta._id, novoValor);
        console.log(
          `Aplicada Despesa: Subtraído ${novoValor} de conta ${conta._id}`
        );
      } else if (tipo === "transferencia") {
        await ContaController.transferirSaldo(
          bancoOrigem,
          bancoDestino,
          novoValor
        );
        console.log(
          `Aplicada Transferência: ${novoValor} de ${bancoOrigem} para ${bancoDestino}`
        );
      }
      console.log("Editar Transação: Novo saldo aplicado.");

      const transacaoAtualizada = await Transacao.findByIdAndUpdate(
        id,
        {
          tipo,
          valor: novoValor,
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
          data: dadosAtualizados.data || transacao.data,
        },
        { new: true }
      );
      console.log("Editar Transação: Transação atualizada no DB.");

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
      res.status(500).json({
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
      res.status(500).json({
        message: "Erro ao obter total de despesas",
        error: error.message,
      });
    }
  }
}

export default TransacaoController;
