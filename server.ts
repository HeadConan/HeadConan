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

// DeepSeek API caller
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/chat/completions';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function cleanAndParseJSON(rawText: string): any {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonSubstr = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonSubstr);
    }
    throw err;
  }
}

async function callDeepSeek(
  messages: DeepSeekMessage[],
  options: { model?: string; temperature?: number } = {}
): Promise<{ text: string; parsed: any; model: string }> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is not configured');
  }

  const model = options.model || 'deepseek-chat';
  const isReasoner = model === 'deepseek-reasoner';

  const bodyPayload: any = {
    model,
    messages,
    stream: false,
  };

  // deepseek-chat supports response_format and temperature; deepseek-reasoner doesn't support them
  if (!isReasoner) {
    bodyPayload.response_format = { type: 'json_object' };
    bodyPayload.temperature = options.temperature ?? 0.7;
  }

  const response = await fetch(DEEPSEEK_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(bodyPayload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content || '';
  const parsed = cleanAndParseJSON(content);

  return {
    text: content,
    parsed,
    model,
  };
}

const SYSTEM_WORLD_GENESIS = `You are the core intelligence of HeadConan, an experimental system that turns human imagination into structured interactive worlds and generative interfaces.
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
Generate only minimum sufficient reality: 4-6 characters, 3-5 locations, 2-4 factions, 3-4 active events, 3-4 timeline points, 3-4 key metrics, and 1-2 secret documents. Tailor the specific UI blocks to the genre.`;

const SYSTEM_WORLD_INTERACTION = `You are HeadConan's World Simulation Engine.
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;

  res.json({
    status: 'ok',
    providers: {
      deepseek: {
        available: hasDeepSeek,
        models: ['deepseek-chat', 'deepseek-reasoner'],
      },
      gemini: {
        available: hasGemini,
        models: ['gemini-3.7-flash'],
      },
    },
    defaultProvider: hasDeepSeek ? 'deepseek' : hasGemini ? 'gemini' : 'procedural',
    timestamp: new Date().toISOString(),
  });
});

// Unified & DeepSeek Generation Endpoint
app.post('/api/generate-world', async (req, res) => {
  const { prompt, provider = 'auto', model } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;

  // Determine effective provider
  let targetProvider = provider;
  if (provider === 'auto') {
    targetProvider = hasDeepSeek ? 'deepseek' : hasGemini ? 'gemini' : 'procedural';
  }

  // 1. Handle DeepSeek
  if (targetProvider === 'deepseek' || targetProvider === 'deepseek-chat' || targetProvider === 'deepseek-reasoner') {
    if (hasDeepSeek) {
      try {
        const selectedModel = model || (targetProvider.startsWith('deepseek-') ? targetProvider : 'deepseek-chat');
        const deepseekRes = await callDeepSeek(
          [
            { role: 'system', content: SYSTEM_WORLD_GENESIS },
            { role: 'user', content: `Construct an interactive world from this user imagination: "${prompt}"` }
          ],
          { model: selectedModel, temperature: 0.75 }
        );

        return res.json({
          ...deepseekRes.parsed,
          provider: 'deepseek',
          model: deepseekRes.model,
        });
      } catch (err: any) {
        console.error('[DeepSeek] World generation error:', err);
        // If DeepSeek fails but Gemini exists, fallback to Gemini
        if (hasGemini) {
          console.log('[AI Gateway] Falling back to Gemini 3.7 Flash');
          targetProvider = 'gemini';
        } else {
          return res.status(200).json({
            fallback: true,
            message: `DeepSeek call failed: ${err.message}. Using deterministic engine.`
          });
        }
      }
    } else if (hasGemini) {
      targetProvider = 'gemini';
    }
  }

  // 2. Handle Gemini
  if (targetProvider === 'gemini' || targetProvider === 'gemini-3.7-flash') {
    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Construct an interactive world from this user imagination: "${prompt}"`,
          config: {
            systemInstruction: SYSTEM_WORLD_GENESIS,
            responseMimeType: 'application/json',
            temperature: 0.8,
          }
        });

        const parsed = cleanAndParseJSON(response.text || '{}');
        return res.json({
          ...parsed,
          provider: 'gemini',
          model: 'gemini-3.7-flash',
        });
      } catch (err: any) {
        console.error('[Gemini] World generation error:', err);
      }
    }
  }

  // 3. Fallback to client-side procedural engine
  res.status(200).json({
    fallback: true,
    message: 'No active AI keys detected on server. Operating in deterministic generative engine mode.'
  });
});

// Backward-compatible Gemini & DeepSeek route aliases
app.post('/api/gemini/generate-world', (req, res, next) => {
  req.body.provider = 'gemini';
  (app._router.handle as any)({ ...req, url: '/api/generate-world' }, res, next);
});

app.post('/api/deepseek/generate-world', (req, res, next) => {
  req.body.provider = 'deepseek';
  (app._router.handle as any)({ ...req, url: '/api/generate-world' }, res, next);
});

// Unified & DeepSeek Interaction Endpoint
app.post('/api/interact-world', async (req, res) => {
  const { action, currentWorld, userNotes, provider = 'auto', model } = req.body;
  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;

  let targetProvider = provider;
  if (provider === 'auto') {
    targetProvider = hasDeepSeek ? 'deepseek' : hasGemini ? 'gemini' : 'procedural';
  }

  const promptText = `Current World Summary:
- Title: ${currentWorld?.name || 'Unknown'}
- Premise: ${currentWorld?.premise || ''}
- Current Situation: ${currentWorld?.currentSituation || ''}
- User Role: ${currentWorld?.userRole?.title || 'Protagonist'}
- Existing Notes by User: ${JSON.stringify(userNotes || [])}

User Action / Intent:
"${action}"

Calculate consequence and state updates.`;

  // 1. DeepSeek
  if (targetProvider === 'deepseek' || targetProvider === 'deepseek-chat' || targetProvider === 'deepseek-reasoner') {
    if (hasDeepSeek) {
      try {
        const selectedModel = model || (targetProvider.startsWith('deepseek-') ? targetProvider : 'deepseek-chat');
        const deepseekRes = await callDeepSeek(
          [
            { role: 'system', content: SYSTEM_WORLD_INTERACTION },
            { role: 'user', content: promptText }
          ],
          { model: selectedModel, temperature: 0.7 }
        );

        return res.json({
          ...deepseekRes.parsed,
          provider: 'deepseek',
          model: deepseekRes.model,
        });
      } catch (err: any) {
        console.error('[DeepSeek] Interaction error:', err);
        if (hasGemini) {
          console.log('[AI Gateway] Falling back to Gemini for interaction');
          targetProvider = 'gemini';
        } else {
          return res.status(200).json({
            fallback: true,
            message: `DeepSeek call failed: ${err.message}. Using client simulation engine.`
          });
        }
      }
    } else if (hasGemini) {
      targetProvider = 'gemini';
    }
  }

  // 2. Gemini
  if (targetProvider === 'gemini' || targetProvider === 'gemini-3.7-flash') {
    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: promptText,
          config: {
            systemInstruction: SYSTEM_WORLD_INTERACTION,
            responseMimeType: 'application/json',
            temperature: 0.7,
          }
        });

        const parsed = cleanAndParseJSON(response.text || '{}');
        return res.json({
          ...parsed,
          provider: 'gemini',
          model: 'gemini-3.7-flash',
        });
      } catch (err: any) {
        console.error('[Gemini] Interaction error:', err);
      }
    }
  }

  // 3. Fallback
  res.status(200).json({
    fallback: true,
    message: 'No active AI key found. Utilizing client simulation engine.'
  });
});

// Route aliases
app.post('/api/gemini/interact-world', (req, res, next) => {
  req.body.provider = 'gemini';
  (app._router.handle as any)({ ...req, url: '/api/interact-world' }, res, next);
});

app.post('/api/deepseek/interact-world', (req, res, next) => {
  req.body.provider = 'deepseek';
  (app._router.handle as any)({ ...req, url: '/api/interact-world' }, res, next);
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
