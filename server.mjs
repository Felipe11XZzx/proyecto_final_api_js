import express from "express";
import axios from "axios";
import cors from "cors";
const app = express();
const port = 3001;

app.use(cors());
const API_KEY = "372a8da0c43b491eb37c1509df62e5a7";
const API_URL = "https://api.football-data.org/v4/teams/86";

app.get("/api/team/real-madrid", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
