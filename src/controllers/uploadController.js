import multer from "multer";
import path from "path";
import Transacao from "../model/Transacao.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

export const uploadImage = [
  upload.single("arquivo"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "Arquivo não enviado" });

      const transacaoId = req.body.transacaoId;
      if (!transacaoId)
        return res
          .status(400)
          .json({ message: "ID da transação não fornecido" });

      const imgPath = req.file.filename;
      await Transacao.findByIdAndUpdate(transacaoId, { imgPath });

      res.json({ imgPath });
    } catch (err) {
      res.status(500).json({ error: "Erro ao salvar imagem" });
    }
  },
];
