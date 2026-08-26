# AI Workflow & Modular Prompting — HeadConan

## 1. Multi-Model Architecture & Intelligent Gateway

HeadConan features a multi-engine AI architecture supporting both **DeepSeek** and **Google Gemini** alongside a deterministic client-side engine:

```
┌────────────────────────────────────────────────────────┐
│               Intelligent AI Gateway                   │
├──────────────────────────┬─────────────────────────────┤
│   🔷 DeepSeek Engine     │      ⚡ Google Gemini        │
│   • deepseek-chat (V3)   │      • gemini-3.7-flash     │
│   • deepseek-reasoner(R1)│                             │
├──────────────────────────┴─────────────────────────────┤
│   ⚙️ Local Procedural Genesis & Simulation Engine      │
│   (Zero-dependency fallback & deterministic runtime)   │
└────────────────────────────────────────────────────────┘
```

### Supported Models:
1. **DeepSeek-V3 (`deepseek-chat`)**:
   - 671B Parameter MoE architecture (37B active).
   - High-throughput generative world synthesis and rich, dynamic roleplay interactions.
   - Structured JSON mode (`response_format: { type: "json_object" }`).
2. **DeepSeek-R1 (`deepseek-reasoner`)**:
   - Chain-of-Thought reasoning for deep political consequences, geopolitical simulation, and multi-turn state mutations.
3. **Gemini 3.7 Flash (`gemini-3.7-flash`)**:
   - High-speed multimodal intelligence via Google GenAI SDK.
4. **Deterministic Procedural Simulator**:
   - Pure client-side rule engine allowing full offline usage without API keys.

---

## 2. Modular Prompt Assembly

The system prompt is divided into decoupled layers:

```
┌────────────────────────────────────────────────────────┐
│ 1. Base System Persona & Interaction Guardrails        │
├────────────────────────────────────────────────────────┤
│ 2. Available UI Capability Registry                    │
├────────────────────────────────────────────────────────┤
│ 3. Current World State & Entity Relations              │
├────────────────────────────────────────────────────────┤
│ 4. User Notes & Memory Context                         │
├────────────────────────────────────────────────────────┤
│ 5. User Input Intent & Direction                       │
├────────────────────────────────────────────────────────┤
│ 6. Enforced Strict JSON Output Schema                  │
└────────────────────────────────────────────────────────┘
```

---

## 3. Server Endpoints & Integration

- `GET /api/health` — Returns status of DeepSeek and Gemini connections.
- `POST /api/generate-world` — Generates a new world and tailored UI blocks. Supports `{ prompt, provider, model }`.
- `POST /api/interact-world` — Simulates consequence calculation and state mutations. Supports `{ action, currentWorld, userNotes, provider, model }`.
- `POST /api/deepseek/generate-world` & `POST /api/deepseek/interact-world` — Direct DeepSeek endpoints.
- `POST /api/gemini/generate-world` & `POST /api/gemini/interact-world` — Direct Gemini endpoints.

---

## 4. Failure Handling & Graceful Degradation

If the selected AI model is unavailable or lacks an API key:
1. The gateway gracefully cascades (DeepSeek $\rightarrow$ Gemini $\rightarrow$ Procedural Engine).
2. Prevents runtime exceptions, providing unbroken interactive gameplay and world evolution.
