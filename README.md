# HeadConan

> **"HeadConan turns imagination into interactive worlds through generative UI, narrative, and visual experiences."**

HeadConan is an experimental research prototype for a new interaction paradigm. Rather than forcing users into static chatbot threads or rigid dashboard templates, HeadConan listens to human imagination, externalizes it into structured world state, and dynamically projects generative UI modules tailored specifically to the scenario.

---

## 🧭 Core Concept

The user gives HeadConan an idea, scenario, fantasy, role, or situation:
- *"I want to become the ruler of a fictional authoritarian empire beginning to fracture."*
- *"I want to experience the most intense semester of my life at university."*
- *"Put me inside an alternate-history world where the Cold War ended differently."*

Instead of responding with a static text wall, HeadConan constructs a living cognitive scaffold:
1. **Semantic World State**: Entities, characters, factions, locations, timeline ticks, intelligence documents, and key tensions.
2. **Generative Interface**: Dynamically planned UI blocks (interactive tactical maps, classified dossiers, faction influence gauges, relationship networks, schedule logs).
3. **Continuous Mutation Loop**: Natural language interactions ("Move the army north", "Confront the Chancellor") mutate world state, and the UI adapts reactively.

---

## ⚡ Multi-Model Intelligence System (DeepSeek & Gemini)

HeadConan supports multi-model AI routing with dedicated support for:
- 🔷 **DeepSeek-V3 (`deepseek-chat`)**: High-speed, 671B MoE model for creative roleplay & structured generative world synthesis.
- 🧠 **DeepSeek-R1 (`deepseek-reasoner`)**: Deep Chain-of-Thought reasoning for complex geopolitical simulations & multi-branch state matrices.
- ⚡ **Gemini 3.7 Flash (`gemini-3.7-flash`)**: High-performance multimodal reasoning.
- ⚙️ **Procedural Simulation Engine**: Zero-dependency deterministic offline simulation.

---

## 🏛️ Project Architecture

```
User Imagination
      │
      ▼
AI Workflow (DeepSeek V3/R1 | Gemini 3.7 | Local Engine)
      │
      ▼
World State (Independent Domain Entity Model)
      │
      ▼
UI Planning & Block Composition (Semantic UI Block Tree)
      │
      ▼
Deterministic Block Renderer (React Components + SVG Storytelling Maps)
      │
      ▼
Interactive Experience & State Mutations (Minimum Sufficient Updates)
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure API Keys in .env (optional, falls back gracefully to procedural engine)
# DEEPSEEK_API_KEY=your_deepseek_key
# GEMINI_API_KEY=your_gemini_key

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📚 Living Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System architecture, decoupling of World State & UI Representation.
- [`AI_WORKFLOW.md`](./AI_WORKFLOW.md) — Multi-model prompt architecture, DeepSeek & Gemini API workflows.
- [`PRODUCT.md`](./PRODUCT.md) — Product concept, hypothesis, and interaction loops.
- [`EXPERIMENTS.md`](./EXPERIMENTS.md) — Experiment logs, hypotheses, observations, and discoveries.
- [`DESIGN.md`](./DESIGN.md) — Visual principles, typography, cinematic dark mode, and UI standards.
- [`WORLD_MODEL.md`](./WORLD_MODEL.md) — Domain ontology (`WorldState`, `Character`, `Faction`, `Timeline`, etc.).
- [`UI_SYSTEM.md`](./UI_SYSTEM.md) — Semantic UI block registry, composition, and rendering logic.
- [`ROADMAP.md`](./ROADMAP.md) — Research roadmap from prototype to full cognitive environment.
