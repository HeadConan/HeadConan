import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Lazy initialization for Gemini client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// AI endpoint for generating a new world
app.post('/api/gemini/generate-world', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(200).json({
      fallback: true,
      message: 'No GEMINI_API_KEY detected on server. Operating in deterministic generative engine mode.'
    });
  }

  try {
    const systemInstruction = `You are the core intelligence of HeadConan, an experimental system that turns human imagination into structured interactive worlds and generative interfaces.
When given an imaginative prompt, interpret the core premise, tension, atmosphere, and user role.
You MUST output ONLY a valid JSON object matching this structure:
{
  "world": {
    "id": "string",
    "name": "string",
    "genre": "string",
    "premise": "string",
    "atmosphere": "string",
    "userRole": {
      "title": "string",
      "authority": "string",
      "objective": "string",
      "traits": ["string"]
    },
    "currentSituation": "string",
    "characters": [
      {
        "id": "string",
        "name": "string",
        "role": "string",
        "faction": "string",
        "status": "string",
        "loyalty": 75,
        "avatar": "string",
        "summary": "string"
      }
    ],
    "locations": [
      {
        "id": "string",
        "name": "string",
        "type": "string",
        "status": "string",
        "significance": "string",
        "coordinates": { "x": 50, "y": 50 }
      }
    ],
    "factions": [
      {
        "id": "string",
        "name": "string",
        "influence": 60,
        "stance": "supportive | neutral | hostile | suspicious",
        "agenda": "string"
      }
    ],
    "events": [
      {
        "id": "string",
        "timestamp": "string",
        "title": "string",
        "category": "crisis | report | opportunity | whisper",
        "description": "string",
        "urgency": "low | medium | high | critical"
      }
    ],
    "timeline": [
      {
        "id": "string",
        "time": "string",
        "title": "string",
        "description": "string",
        "status": "completed | active | upcoming"
      }
    ],
    "stats": [
      {
        "id": "string",
        "label": "string",
        "value": 70,
        "max": 100,
        "unit": "%",
        "trend": "up | down | stable",
        "status": "good | warning | critical"
      }
    ],
    "documents": [
      {
        "id": "string",
        "title": "string",
        "classification": "TOP SECRET | MEMORANDUM | PERSONAL NOTE | DOSSIER",
        "date": "string",
        "author": "string",
        "content": "string"
      }
    ]
  },
  "uiPlanning": {
    "activeLayout": "workspace",
    "suggestedInteractions": ["string", "string", "string"],
    "blocks": [
      {
        "id": "block-1",
        "type": "dashboard | map | timeline | character | document | stats | relationship | event | note",
        "title": "string",
        "priority": "primary | secondary | ephemeral",
        "colSpan": 1 | 2 | 3,
        "dataRef": "string"
      }
    ]
  }
}
Generate only minimum sufficient reality: 4-6 characters, 3-5 locations, 2-4 factions, 3-4 active events, 3-4 timeline points, 3-4 key metrics, and 1-2 secret documents. Tailor the specific UI blocks to the genre (e.g. Political Sim gets intel reports & faction gauges; University gets schedules & dorm map & social links).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Construct an interactive world from this user imagination: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.8,
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini world generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate world' });
  }
});

// AI endpoint for world state mutation based on natural language interaction
app.post('/api/gemini/interact-world', async (req, res) => {
  const { action, currentWorld, userNotes } = req.body;
  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(200).json({
      fallback: true,
      message: 'No GEMINI_API_KEY detected. Utilizing client simulation engine.'
    });
  }

  try {
    const systemInstruction = `You are HeadConan's World Simulation Engine.
The user performs an action or gives a natural language instruction in an ongoing imagined world.
Evaluate the direct consequences, side effects, reactions from characters and factions, new emergent events, and state mutations.
Apply MINIMUM SUFFICIENT UPDATES. Do not rewrite the entire world.
Respond with JSON matching:
{
  "narrativeOutcome": "string (1-3 vivid paragraphs describing immediate outcomes and sensory reality)",
  "stateChanges": {
    "situationUpdate": "string",
    "updatedStats": [
      { "id": "string", "delta": -10, "newValue": 50, "trend": "down", "reason": "string" }
    ],
    "updatedFactions": [
      { "id": "string", "influenceDelta": 5, "stance": "suspicious", "agenda": "string" }
    ],
    "updatedCharacters": [
      { "id": "string", "loyaltyDelta": -15, "status": "string", "reaction": "string" }
    ],
    "newEvents": [
      {
        "id": "string",
        "timestamp": "string",
        "title": "string",
        "category": "crisis | report | opportunity | whisper",
        "description": "string",
        "urgency": "medium | high"
      }
    ],
    "newTimelineItems": [
      {
        "id": "string",
        "time": "string",
        "title": "string",
        "description": "string",
        "status": "active"
      }
    ],
    "newDocuments": [
      {
        "id": "string",
        "title": "string",
        "classification": "string",
        "date": "string",
        "author": "string",
        "content": "string"
      }
    ]
  },
  "suggestedNextActions": ["string", "string", "string"]
}`;

    const promptText = `Current World Summary:
- Title: ${currentWorld.name}
- Premise: ${currentWorld.premise}
- Current Situation: ${currentWorld.currentSituation}
- User Role: ${currentWorld.userRole?.title || 'Protagonist'}
- Existing Notes by User: ${JSON.stringify(userNotes || [])}

User Action / Intent:
"${action}"

Calculate consequence and state updates.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini interaction error:', error);
    res.status(500).json({ error: error.message || 'Interaction processing failed' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HeadConan] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
