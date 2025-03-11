import express from "express";
import axios from "axios";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());

// Servir archivos estáticos
app.use(express.static(__dirname));

const API_KEY = "372a8da0c43b491eb37c1509df62e5a7";
const API_URL = "https://api.football-data.org/v4/teams/90";

app.get("/api/team/real-betis-balompie", async (req, res) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para servir index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
