import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM = `Eres VialBot CR, un asistente virtual amigable, paciente y motivador especializado en educación vial para Costa Rica. Tu misión es ayudar a los usuarios a prepararse para el examen teórico de manejo del COSEVI (Consejo de Seguridad Vial).

PERSONALIDAD: Amigable, cercano, usa lenguaje simple. Celebra aciertos, anima ante errores. NUNCA hagas sentir mal al usuario. Usa ocasionalmente emojis.

CONOCIMIENTO CLAVE:
- Señales de tránsito: ALTO (octagonal, rojo), preventivas (triangular, amarilla), informativas (rectangular, azul/verde)
- Prioridad de paso: en rotondas ceden los que entran. En cruces sin señal: cede quien viene de la izquierda
- Límites de velocidad: zona urbana 40 km/h, zonas escolares 25 km/h, autopistas 120 km/h, zona residencial 40 km/h
- Cinturón: obligatorio conductor y todos los pasajeros. Reduce 50% riesgo de muerte
- Conducción defensiva: distancia mínima 2 segundos del vehículo delante
- Uso de celular: prohibido al volante en Costa Rica

Responde SIEMPRE en español. Máximo 3 párrafos cortos. Incluye ejemplos prácticos de Costa Rica. Si la pregunta no es de educación vial, responde: "Solo respondo dudas de educación vial 🚦".`;

app.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Falta el campo 'message'" });
    }

    const messages = [
      ...history
        .filter((m) => m && m.role && m.content)
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content),
        })),
      { role: "user", content: message },
    ];

    const completion = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      temperature: 0.3,
      system: SYSTEM,
      messages,
    });

    const reply = completion.content?.[0]?.text || "Sin respuesta.";
    res.json({ reply });
  } catch (error) {
    console.error("Error Anthropic:", error);
    res.status(500).json({ error: "Error al consultar Anthropic" });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor VialBot corriendo en http://localhost:${PORT}`);
});
