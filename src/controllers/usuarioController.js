import Usuario from "../model/Usuario.js";

class UsuarioController{

    static async listarUsuarios(req, res) {
        try {
            const listarUsuarios = await Usuario.find({});
            res.status(200).json(listarUsuarios);
        } catch (erro) {
            res.status(500).send({message: `${erro.message} - falha ao listar usuários`});      
        }
    }

    static async cadastrarUsuario(req, res) {
        try {
            const novoUsuario = await Usuario.create(req.body);
            await novoUsuario.save();

            const { senha, ...usuarioSemSenha } = novoUsuario.toObject();

            res.status(201).json({message: "Usuário cadastrado com sucesso", usuario: usuarioSemSenha});
        } catch (erro) {
           res.status(500).send({message: `${erro.message} - falha ao cadastrar usuário`});
        }
    }
}

export default UsuarioController;
