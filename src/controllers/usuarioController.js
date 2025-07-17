import {Usuario} from '../model/Usuario.js';
import Conta from '../model/Conta.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { segredo } from '../auth/auth.js';

class UsuarioController {
  static async listarUsuarios(req, res) {
    try {
      const listarUsuarios = await Usuario.find({});
      res.status(200).json(listarUsuarios);
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao listar usuários` });
    }
  }

  static async listarUsuariosPorId(req, res) {
    try {
      const id = req.params.id;
      const usuarioEncontrado = await Usuario.findById(id);
      res.status(200).json(usuarioEncontrado);
    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao encontrar usuário` });
    }
  }

static async cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaHash,
    });

    await novoUsuario.save();

    const novaConta = new Conta({
      saldo: 0,
      usuario: novoUsuario._id,
    });

    await novaConta.save();

    res.status(201).json({
      message: "Usuário e conta criados com sucesso.",
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      },
      conta: {
        id: novaConta._id,
        saldo: novaConta.saldo,
      },
    });
  } catch (erro) {
    res.status(500).json({ message: `Erro ao criar usuário: ${erro.message}` });
  }
}


static async loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const payload = {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
    };

    const token = jwt.sign(payload, segredo, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token: token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    res.status(500).json({ message: `Erro no login: ${erro.message}` });
  }
}


}

export default UsuarioController;
