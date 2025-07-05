import { Usuario } from "../model/Usuario.js";
import bcrypt from "bcrypt";

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
      const novoUsuario = await Usuario.create(req.body);
      await novoUsuario.save();

      const { senha, ...usuarioSemSenha } = novoUsuario.toObject();

      res
        .status(201)
        .json({
          message: "Usuário cadastrado com sucesso",
          usuario: usuarioSemSenha,
        });
    } catch (erro) {
      if (erro.code === 11000 && erro.keyPattern.email) {
      return res.status(409).json({ message: "Email já cadastrado" });
    } else {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao cadastrar usuário` });
    }
    }
  }

  static async loginUsuario(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ message: "Email e senha são obrigatórios para o login." });
      }

      const usuario = await Usuario.findOne({ email });

      if (!usuario) {
        return res
          .status(401)
          .json({
            message: "Credenciais inválidas: Email ou senha incorretos.",
          });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res
          .status(401)
          .json({
            message: "Credenciais inválidas: Email ou senha incorretos.",
          });
      }

      const { senha: _, ...usuarioLogado } = usuario.toObject();
      res
        .status(200)
        .json({
          message: "Login realizado com sucesso!",
          usuario: usuarioLogado,
        });

    } catch (erro) {
      res
        .status(500)
        .send({ message: `${erro.message} - falha ao realizar login` });
    }
  }
}

export default UsuarioController;
