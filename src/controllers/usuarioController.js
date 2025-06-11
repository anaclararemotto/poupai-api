import Usuario from "../model/Usuario.js";

class UsuarioController{

    static async cadastrarUsuario(req, res) {
        try {
            const novoUsuario = await Usuario.create(req.body);
            res.status(201).json({message: "Usuário cadastrado com sucesso", usuario: novoUsuario});
        } catch (erro) {
           res.status(500).send({message: `${erro.message} - falha ao cadastrar usuário`});
        }
    }
}

export default UsuarioController;
