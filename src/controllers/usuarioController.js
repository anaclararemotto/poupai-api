

// import { Usuario } from "../model/Usuario.js";
// import Conta from "../model/Conta.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import { segredo } from "../auth/auth.js";

// class UsuarioController {
//   static async listarUsuarios(req, res) {
//     try {
//       const listarUsuarios = await Usuario.find({});
//       res.status(200).json(listarUsuarios);
//     } catch (erro) {
//       res
//         .status(500)
//         .send({ message: `${erro.message} - falha ao listar usuários` });
//     }
//   }

//   static async listarUsuariosPorId(req, res) {
//     try {
//       const id = req.params.id;
//       const usuarioEncontrado = await Usuario.findById(id);
//       res.status(200).json(usuarioEncontrado);
//     } catch (erro) {
//       res
//         .status(500)
//         .send({ message: `${erro.message} - falha ao encontrar usuário` });
//     }
//   }

//   static async cadastrarUsuario(req, res) {
//     try {
//       const { nome, email, senha } = req.body; // --- DEBUG: Log da senha recebida no cadastro ---

//       console.log("DEBUG - Cadastro: Senha recebida:", senha);

//       const usuarioExistente = await Usuario.findOne({ email });
//       if (usuarioExistente) {
//         return res.status(409).json({ message: "Email já cadastrado." });
//       }

//       // const senhaHash = await bcrypt.hash(senha, 10); // --- DEBUG: Log do hash gerado no cadastro ---

//       // console.log("DEBUG - Cadastro: Hash gerado:", senhaHash);

//       const novoUsuario = new Usuario({
//         nome,
//         email,
//         senha: senha,
//       });

//       await novoUsuario.save();

//       const novaConta = new Conta({
//         saldo: 0,
//         usuario: novoUsuario._id,
//       });

//       await novaConta.save();

//       res.status(201).json({
//         message: "Usuário e conta criados com sucesso.",
//         usuario: {
//           id: novoUsuario._id,
//           nome: novoUsuario.nome,
//           email: novoUsuario.email,
//         },
//         conta: {
//           id: novaConta._id,
//           saldo: novaConta.saldo,
//         },
//       });
//     } catch (erro) {
//       res
//         .status(500)
//         .json({ message: `Erro ao criar usuário: ${erro.message}` });
//     }
//   }

//   static async loginUsuario(req, res) {
//     try {
//       const { email, senha } = req.body; // --- DEBUG: Log da senha digitada no login ---

//       console.log("DEBUG - Login: Senha digitada:", senha);

//       const usuario = await Usuario.findOne({ email });
//       if (!usuario) {
//         return res.status(401).json({ message: "Usuário não encontrado" });
//       } // --- DEBUG: Log do hash da senha do usuário do DB ---

//       console.log("DEBUG - Login: Hash do usuário no DB:", usuario.senha);

//       const senhaValida = await bcrypt.compare(senha, usuario.senha); // --- DEBUG: Log do resultado da comparação Bcrypt ---

//       console.log(
//         "DEBUG - Login: Resultado da comparação (senhaValida):",
//         senhaValida
//       );

//       if (!senhaValida) {
//         return res.status(401).json({ message: "Senha incorreta" });
//       }

//       const payload = {
//         id: usuario._id,
//         nome: usuario.nome,
//         email: usuario.email,
//       };

//       const token = jwt.sign(payload, segredo, { expiresIn: "1h" });

//       res.status(200).json({
//         message: "Login realizado com sucesso!",
//         token: token,
//         usuario: {
//           id: usuario._id,
//           nome: usuario.nome,
//           email: usuario.email,
//         },
//       });
//     } catch (erro) {
//       res.status(500).json({ message: `Erro no login: ${erro.message}` });
//     }
//   }
// }

// export default UsuarioController;
import { Usuario } from "../model/Usuario.js";
import Conta from "../model/Conta.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { segredo } from "../auth/auth.js";

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
      // --- DEBUG: Log da senha recebida no cadastro ---
      console.log("DEBUG - Cadastro: Senha recebida:", senha);

      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(409).json({ message: "Email já cadastrado." });
      }

      // IMPORTANTE: A lógica de hash da senha com bcrypt está no middleware pre('save') do seu modelo Usuario.js.
      // Então, aqui você passa a senha em texto puro para o construtor do Usuario.
      const novoUsuario = new Usuario({
        nome,
        email,
        senha: senha, // Senha em texto puro, será hasheada pelo middleware antes de salvar
      });

      await novoUsuario.save(); // O middleware pre('save') será acionado aqui para fazer o hash.

      // OPCIONAL: Se quiser ver o hash APÓS o save (e o middleware) para debug
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
          email: novoUsuario.email, // Corrigido de novoUsuario.nome para novoUsuario.email (se foi um erro de cópia/cola)
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
      // --- DEBUG: Log da senha digitada no login ---
      console.log("DEBUG - Login: Senha digitada:", senha);

      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }
      // --- DEBUG: Log do hash da senha do usuário do DB ---
      console.log("DEBUG - Login: Hash do usuário no DB:", usuario.senha);

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      // --- DEBUG: Log do resultado da comparação Bcrypt ---
      console.log(
        "DEBUG - Login: Resultado da comparação (senhaValida):",
        senhaValida
      );

      if (!senhaValida) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      const payload = {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      };

      const token = jwt.sign(payload, segredo, { expiresIn: "1h" });

      // --- CORREÇÃO AQUI: Definir o cookie HTTP Only ---
      res.cookie('jwt', token, {
          httpOnly: true, // O cookie só pode ser acessado pelo servidor (melhora a segurança contra XSS)
          secure: process.env.NODE_ENV === 'production', // Use 'true' em produção (HTTPS)
          sameSite: 'Lax', // Ajuda na proteção contra CSRF. 'Lax' para requisições de mesma origem, ou 'None' para cross-site (requer HTTPS).
          domain: 'localhost', // IMPORTANTE: Permite que o cookie seja acessível em todas as portas do localhost
          maxAge: 3600000 // Tempo de vida do cookie em milissegundos (1 hora)
      });

      // --- CORREÇÃO AQUI: Remover o token do corpo da resposta JSON ---
      // Não é mais necessário enviar o token no corpo da resposta se ele estiver no cookie.
      // Enviar no corpo apenas se o frontend precisar dele explicitamente por algum motivo,
      // mas para autenticação via cookie, não é a melhor prática de segurança.
      res.status(200).json({
        message: "Login realizado com sucesso!",
        // O token não está mais aqui, pois está no cookie
        usuario: { // Você ainda pode enviar os dados do usuário para o frontend se ele precisar.
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