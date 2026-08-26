# AI Workflow & Modular Prompting — HeadConan

## 1. Modular Prompt Assembly

The system prompt is divided into clean, decoupled layers:

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
│ 6. Enforced JSON Output Schema                         │
└────────────────────────────────────────────────────────┘
```

## 2. Failure Handling & Graceful Degradation

If the AI call is unavailable, lacks an API key, or encounters network limits:
1. The app automatically utilizes its **Built-in Procedural Genesis & Simulation Engine** (`src/world/engine.ts`).
2. Preserves active state without throwing unhandled exceptions.
3. Provides visual notification in developer status bar while keeping the user fully immersed.
4. Seamlessly processes actions deterministically or through real Gemini 3.7 Flash when active.
