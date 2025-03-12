import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));
const API_KEY = "372a8da0c43b491eb37c1509df62e5a7";
const BASE_URL = "https://api.football-data.org/v4";
const TEAM_ID = 86; // Real Madrid ID

// Middleware para manejar errores de API
const handleApiRequest = async (url, req, res) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });
    return res.json(response.data);
  } catch (error) {
    console.error(`Error en solicitud a ${url}:`, error.message);
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: error.message,
        details: error.response.data
      });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Obtener información del equipo
app.get("/api/team/real-madrid", async (req, res) => {
  await handleApiRequest(`${BASE_URL}/teams/${TEAM_ID}`, req, res);
});

// Obtener próximos partidos
app.get("/api/team/real-madrid/matches", async (req, res) => {
  const status = req.query.status || 'SCHEDULED'; // SCHEDULED, FINISHED, etc.
  const limit = req.query.limit || 10;
  await handleApiRequest(`${BASE_URL}/teams/${TEAM_ID}/matches?status=${status}&limit=${limit}`, req, res);
});

// Obtener competiciones del equipo
app.get("/api/team/real-madrid/competitions", async (req, res) => {
  await handleApiRequest(`${BASE_URL}/teams/${TEAM_ID}`, req, res);
});

// Obtener información de una competición específica
app.get("/api/competitions/:id", async (req, res) => {
  const competitionId = req.params.id;
  await handleApiRequest(`${BASE_URL}/competitions/${competitionId}`, req, res);
});

// Obtener clasificación de una competición
app.get("/api/competitions/:id/standings", async (req, res) => {
  const competitionId = req.params.id;
  await handleApiRequest(`${BASE_URL}/competitions/${competitionId}/standings`, req, res);
});

// Obtener goleadores de La Liga (PD = Primera Division)
app.get("/api/competitions/:id/scorers", async (req, res) => {
  const competitionId = req.params.id;
  const limit = req.query.limit || 10;
  // El código de La Liga española es 'PD' (Primera División)
  const url = `${BASE_URL}/competitions/${competitionId}/scorers?limit=${limit}`;
  await handleApiRequest(url, req, res);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
