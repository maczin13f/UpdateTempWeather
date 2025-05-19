const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
  host: "127.0.0.1", // ou o endereço do seu banco de dados
  user: "root", // substitua pelo seu usuário
  password: "felipe2503@#", // substitua pela sua senha
  database: "tempweather", // o nome do banco de dados
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err);
  } else {
    console.log("✅ Conectado ao MySQL!");
  }
});


app.post("/save-search", (req, res) => {
  const { user_id, cidade, codigo_iso, estado, temperatura, data, hora } = req.body;

  const query = `
    INSERT INTO buscas (user_id, cidade, codigo_iso, estado, temperatura, data, hora)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [user_id, cidade, codigo_iso, estado, temperatura, data, hora],
    (err) => {
      if (err) {
        console.error("❌ Erro ao salvar busca:", err);
        return res.status(500).json({ error: "Erro ao salvar busca" });
      }
      res.status(201).json({ message: "Busca salva com sucesso!" });
    }
  );
});

app.get("/buscas", (req, res) => {
  connection.query("SELECT * FROM buscas ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar dados" });
    }
    res.json(results);
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

