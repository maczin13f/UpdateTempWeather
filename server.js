const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado ao MongoDB!"))
.catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

const BuscaSchema = new mongoose.Schema({
  user_id: String,
  cidade: String,
  codigo_iso: String,
  estado: String,
  temperatura: String,
  data: String,
  hora: String,
});

const Busca = mongoose.model("Busca", BuscaSchema);



app.post("/save-search", async (req, res) => {
  try {
    const busca = new Busca(req.body);
    await busca.save();
    res.status(201).json({ message: "Busca salva com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao salvar busca:", err);
    res.status(500).json({ error: "Erro ao salvar busca" });
  }
});

app.get("/buscas", async (req, res) => {
  try {
    const buscas = await Busca.find().sort({ _id: -1 });
    res.json(buscas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

