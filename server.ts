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
      imageGeneration: {
        available: hasGemini,
        models: ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'],
      }
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

// Helper for Procedural Vector Art Fallback
function generateProceduralFallbackImage(options: {
  title: string;
  subtitle?: string;
  category?: string;
  aspectRatio?: string;
  genre?: string;
  accentColor?: string;
}): string {
  const {
    title = 'ENTITY VISUAL',
    subtitle = 'SYSTEM GENERATIVE ASSET',
    category = 'concept',
    aspectRatio = '1:1',
    genre = 'Cyberpunk / Speculative',
    accentColor = '#06b6d4',
  } = options;

  let width = 800;
  let height = 800;
  if (aspectRatio === '16:9') {
    width = 1280;
    height = 720;
  } else if (aspectRatio === '4:3') {
    width = 960;
    height = 720;
  } else if (aspectRatio === '3:4') {
    width = 720;
    height = 960;
  } else if (aspectRatio === '9:16') {
    width = 720;
    height = 1280;
  }

  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background:#090d16;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.2" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.75" stroke-opacity="0.35"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#grad1)" />
  <rect width="${width}" height="${height}" fill="url(#grid)" />
  <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.4}" fill="url(#glow)" />

  <!-- Tactical Decorative Rings -->
  <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.28}" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6,8" stroke-opacity="0.6" />
  <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.35}" fill="none" stroke="#64748b" stroke-width="0.75" stroke-opacity="0.4" />
  
  <!-- Category Specific Geometry -->
  ${category === 'character' ? `
    <path d="M ${width/2 - 70} ${height/2 + 80} C ${width/2 - 70} ${height/2 - 10}, ${width/2 - 50} ${height/2 - 60}, ${width/2} ${height/2 - 60} C ${width/2 + 50} ${height/2 - 60}, ${width/2 + 70} ${height/2 - 10}, ${width/2 + 70} ${height/2 + 80} Z" fill="#1e293b" stroke="${accentColor}" stroke-width="1.5" />
    <circle cx="${width/2}" cy="${height/2 - 95}" r="45" fill="#334155" stroke="${accentColor}" stroke-width="2" />
    <line x1="${width/2 - 35}" y1="${height/2 - 95}" x2="${width/2 + 35}" y2="${height/2 - 95}" stroke="${accentColor}" stroke-width="2" />
  ` : category === 'location' ? `
    <polygon points="${width/2},${height/2 - 110} ${width/2 + 110},${height/2 + 80} ${width/2 - 110},${height/2 + 80}" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="10,5" />
    <circle cx="${width/2}" cy="${height/2}" r="8" fill="${accentColor}" />
    <line x1="${width/2 - 130}" y1="${height/2}" x2="${width/2 + 130}" y2="${height/2}" stroke="#64748b" stroke-width="1" stroke-dasharray="4,4" />
    <line x1="${width/2}" y1="${height/2 - 130}" x2="${width/2}" y2="${height/2 + 130}" stroke="#64748b" stroke-width="1" stroke-dasharray="4,4" />
  ` : category === 'evidence' ? `
    <rect x="${width/2 - 90}" y="${height/2 - 100}" width="180" height="200" rx="8" fill="#1e293b" stroke="#eab308" stroke-width="1.5" />
    <line x1="${width/2 - 70}" y1="${height/2 - 60}" x2="${width/2 + 70}" y2="${height/2 - 60}" stroke="#cbd5e1" stroke-width="2" />
    <line x1="${width/2 - 70}" y1="${height/2 - 30}" x2="${width/2 + 40}" y2="${height/2 - 30}" stroke="#94a3b8" stroke-width="1.5" />
    <line x1="${width/2 - 70}" y1="${height/2}" x2="${width/2 + 60}" y2="${height/2}" stroke="#94a3b8" stroke-width="1.5" />
    <rect x="${width/2 - 70}" y="${height/2 + 30}" width="70" height="25" fill="#ca8a04" rx="4" />
    <text x="${width/2 - 35}" y="${height/2 + 47}" fill="#000" font-size="11" font-weight="bold" text-anchor="middle">EXHIBIT</text>
  ` : `
    <polygon points="${width/2 - 60},${height/2 - 60} ${width/2 + 60},${height/2 - 60} ${width/2 + 90},${height/2 + 60} ${width/2 - 90},${height/2 + 60}" fill="none" stroke="${accentColor}" stroke-width="2" />
    <circle cx="${width/2}" cy="${height/2}" r="35" fill="none" stroke="#ec4899" stroke-width="1.5" />
  `}

  <!-- Header Stamped Label -->
  <rect x="30" y="30" width="160" height="28" fill="#0f172a" stroke="#334155" stroke-width="1" rx="4" />
  <text x="42" y="49" fill="${accentColor}" font-size="11" font-weight="bold" letter-spacing="1.5">SYNTH-ASSET // ${category.toUpperCase()}</text>

  <!-- Corner Brackets -->
  <path d="M 25,45 L 25,25 L 45,25" fill="none" stroke="${accentColor}" stroke-width="2" />
  <path d="M ${width - 45},25 L ${width - 25},25 L ${width - 25},45" fill="none" stroke="${accentColor}" stroke-width="2" />
  <path d="M 25,${height - 45} L 25,${height - 25} L 45,${height - 25}" fill="none" stroke="${accentColor}" stroke-width="2" />
  <path d="M ${width - 45},${height - 25} L ${width - 25},${height - 25} L ${width - 25},${height - 45}" fill="none" stroke="${accentColor}" stroke-width="2" />

  <!-- Bottom Details -->
  <rect x="30" y="${height - 75}" width="${width - 60}" height="45" fill="#030712" fill-opacity="0.85" stroke="#1e293b" stroke-width="1" rx="4" />
  <text x="45" y="${height - 52}" fill="#f8fafc" font-size="14" font-weight="bold">${title.substring(0, 40)}</text>
  <text x="45" y="${height - 38}" fill="#94a3b8" font-size="10">${subtitle.substring(0, 60)} • ${genre}</text>
  <text x="${width - 45}" y="${height - 45}" fill="${accentColor}" font-size="10" text-anchor="end">${aspectRatio} // GEN-AI ACTIVE</text>
</svg>
  `.trim();

  const base64 = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// AI Image Generation Endpoint
app.post('/api/image/generate', async (req, res) => {
  const {
    prompt,
    aspectRatio = '1:1',
    stylePreset = 'cinematic-concept',
    entityType = 'freeform',
    entityTitle = '',
    worldContext = {},
    model = 'gemini-3.1-flash-lite-image',
  } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Style Enhancers
  const styleModifiers: Record<string, string> = {
    'cinematic-noir': 'cinematic neo-noir visual, dramatic chiaroscuro high contrast lighting, heavy shadows, atmospheric rain, neon reflections, 8k resolution, highly detailed character and environment composition',
    'tactical-blueprint': 'tactical architectural holographic blueprint, detailed CAD vector lines, schematic telemetry labels, topographical grid contours, military reconnaissance render, high precision technical concept art',
    'cyber-anime': 'modern anime concept art style, vibrant cyberpunk neon lighting, intricate mechanical augmentations, clean crisp linework, emotive atmosphere, studio quality digital painting',
    'oil-classic': 'masterpiece classical oil painting style, visible rich brushwork texture, dramatic baroque lighting, deep rich pigments, atmospheric depth, fine art museum exhibition quality',
    'retro-scifi': '70s 80s retro sci-fi book cover aesthetic, analog grain texture, painted space opera concept art by Syd Mead and Chris Foss style, nostalgic vibrant palette',
    'photorealistic': 'hyper-realistic 8k raw documentary photograph, Hasselblad camera with 85mm f/1.4 lens, natural dramatic ambient lighting, intricate micro-textures, photorealistic studio quality',
    'forensic-photo': 'authentic forensic case evidence photograph, raw crime scene evidentiary lighting, numbered evidence markers, hyper-detailed macro close-up, sharp investigative archival document',
    'cinematic-concept': 'high-end cinematic keyframe concept art, Unreal Engine 5 render, volumetric atmosphere, octane render quality, 8k textures, epic composition and mood'
  };

  const selectedModifier = styleModifiers[stylePreset] || styleModifiers['cinematic-concept'];
  
  // Construct enriched prompt
  const genreContext = worldContext.genre ? `World Genre: ${worldContext.genre}. ` : '';
  const atmosphereContext = worldContext.atmosphere ? `Atmosphere: ${worldContext.atmosphere}. ` : '';
  const fullPrompt = `${prompt}. ${genreContext}${atmosphereContext}Style & Visuals: ${selectedModifier}. Aspect ratio: ${aspectRatio}.`;

  const ai = getGeminiClient();

  if (ai) {
    try {
      console.log(`[Image Studio] Requesting image generation with model: ${model}, aspect: ${aspectRatio}`);
      
      const response = await ai.models.generateContent({
        model: model || 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      let generatedImageUrl: string | null = null;
      let textResponse = '';

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          } else if (part.text) {
            textResponse += part.text;
          }
        }
      }

      if (generatedImageUrl) {
        return res.json({
          success: true,
          imageUrl: generatedImageUrl,
          prompt: fullPrompt,
          rawPrompt: prompt,
          aspectRatio,
          stylePreset,
          entityType,
          model,
          isAiGenerated: true,
          timestamp: new Date().toISOString(),
        });
      }

      console.warn('[Image Studio] Model returned text instead of inlineData image, using high-fidelity procedural fallback:', textResponse);
    } catch (err: any) {
      console.error('[Image Studio] Error during Gemini image generation:', err);
    }
  }

  // Graceful high-fidelity procedural fallback
  console.log('[Image Studio] Generating procedural visual asset fallback for:', entityTitle || prompt);
  const fallbackUrl = generateProceduralFallbackImage({
    title: entityTitle || prompt.slice(0, 30),
    subtitle: prompt.slice(0, 50),
    category: entityType,
    aspectRatio,
    genre: worldContext.genre || 'Speculative Continuum',
  });

  return res.json({
    success: true,
    imageUrl: fallbackUrl,
    prompt: fullPrompt,
    rawPrompt: prompt,
    aspectRatio,
    stylePreset,
    entityType,
    model: 'procedural-vector-engine',
    isAiGenerated: false,
    isFallback: true,
    message: ai ? 'Image model generated vector concept layout.' : 'No active Gemini API key detected. Generated deterministic vector concept art.',
    timestamp: new Date().toISOString(),
  });
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
