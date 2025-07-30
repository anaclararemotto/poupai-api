// src/controllers/usuarioController.js

import { Usuario } from "../model/Usuario.js";
import Conta from "../model/Conta.js"; // Certifique-se de que o caminho está correto
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { segredo } from "../auth/auth.js"; // Certifique-se de que o caminho está correto

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
            console.log("DEBUG - Cadastro: Senha recebida:", senha);

            const usuarioExistente = await Usuario.findOne({ email });
            if (usuarioExistente) {
                return res.status(409).json({ message: "Email já cadastrado." });
            }

            const novoUsuario = new Usuario({
                nome,
                email,
                senha: senha,
            });

            await novoUsuario.save();
            console.log('DEBUG - Cadastro: Senha hasheada salva no DB (via middleware):', novoUsuario.senha);

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
            res
                .status(500)
                .json({ message: `Erro ao criar usuário: ${erro.message}` });
        }
    }

    static async loginUsuario(req, res) {
        try {
            const { email, senha } = req.body;
            console.log("DEBUG - Login: Senha digitada:", senha);

            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(401).json({ message: "Usuário não encontrado" });
            }
            console.log("DEBUG - Login: Hash do usuário no DB:", usuario.senha);

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            console.log("DEBUG - Login: Resultado da comparação (senhaValida):", senhaValida);

            if (!senhaValida) {
                return res.status(401).json({ message: "Senha incorreta" });
            }

            const payload = {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
            };

            const token = jwt.sign(payload, segredo, { expiresIn: "1h" });

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                domain: 'localhost',
                maxAge: 3600000
            });

            res.status(200).json({
                message: "Login realizado com sucesso!",
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

    // Este é o método que precisava de atenção
    static async obterUsuarioLogado(req, res) {
        try {
            // O objeto 'user' é adicionado à requisição pelo middleware 'autenticarJWT'
            const usuarioAutenticado = req.user;

            if (!usuarioAutenticado || !usuarioAutenticado.id) {
                return res.status(401).json({ message: "Usuário não autenticado ou dados incompletos." });
            }

            // Opcional: Buscar dados completos do usuário no banco de dados,
            // caso o payload do JWT não contenha todas as informações necessárias.
            const usuarioCompleto = await Usuario.findById(usuarioAutenticado.id).select('-senha'); // Exclui a senha

            if (!usuarioCompleto) {
                return res.status(404).json({ message: "Usuário logado não encontrado no banco de dados." });
            }

            res.status(200).json({
                id: usuarioCompleto._id,
                nome: usuarioCompleto.nome,
                email: usuarioCompleto.email,
                // Adicione outros campos do usuário que deseja retornar
            });
        } catch (erro) {
            res.status(500).json({ message: `Erro ao obter usuário logado: ${erro.message}` });
        }
    }
}

// Exporta a CLASSE, não uma instância.
export default UsuarioController;