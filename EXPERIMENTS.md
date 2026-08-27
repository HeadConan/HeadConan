# HEADCONAN EXPERIMENTS & DEMO WORLDS

Iteration 2 provides three fully fleshed-out demo worlds showcasing distinct interface languages and role slots.

---

## 1. The Sovereign Imperium of Valen
* **Genre**: Political Simulation & Authoritarian Intrigue
* **Visual Language**: Institutional Bureaucracy (Obsidian marble, Deep Indigo, Serif headings).
* **Primary Surface**: Strategic Garrison Theater & Territorial Map.
* **Roles**:
  - `Supreme Archon Alexander` (Player — First-person executive decrees)
  - `Imperial Shadow Overseer` (Director — Spawning mutinies & leaking memos)
  - `Cosmic Statecraft Architect` (Architect — Rewriting communication axioms)
  - `Grand Imperial Chronicler` (Observer)

---

## 2. St. Jude's Autumn Semester
* **Genre**: Collegiate Life & Social Sphere
* **Visual Language**: Modern Academic (Warm emerald & amber accents, clean sans typography).
* **Primary Surface**: Social Network & Lab Partner Collaboration.
* **Roles**:
  - `Alex Morgan` (Player — Senior honors scholar balancing thesis & friendships)
  - `Campus Proctor & DM` (Director — Spawning surprise pop-quizzes & protests)
  - `The Campus Chronicler` (Observer)

---

## 3. The Blackwood Manor Poisoning
* **Genre**: 1928 Murder Mystery & Detective Noir
* **Visual Language**: Archival Corkboard & Sepia Noir (Pushpins, evidence exhibits, red yarn links).
* **Primary Surface**: Interactive Case Evidence & Deduction Corkboard.
* **Roles**:
  - `Inspector Arthur Finch` (Player — Scotland Yard forensic investigation)
  - `The Shadow Novelist` (Director — Planting forged notes & triggering storms)
  - `Coroner's Silent Inquest` (Observer)

---

# ARCHITECTURAL EXPERIMENT LOG（2026-08-27 起）

> 实验规程：判据写成断言（vitest）；结论由测试决定；证伪即记录「修正哪个 ADR」。
> 用例位置：`src/world/runtime/instantiate.test.ts`（E1）。运行：`npm test`。

## E1 — 单一世界表示能否同时支撑「正典」与「平行场景」？

- **假设**（ADR-1 / HEADCONAN_KERNEL §5）：`WorldDefinition + ScenarioSeed → WorldInstance`，多实例互不污染；种子能表达分歧。
- **结果**：✅ **CONFIRMED**（9/9 断言通过）
- **证据**：
  1. `instantiate()` 两条路径均可用：合成路径（从定义合成初始状态）与基态路径（深拷贝手写 `*_INITIAL_STATE`）。
  2. 三实例（正典 / 瑟曦抢先摊牌 / 财政大臣视角）独立 ID、零共享引用（实体/关系/认知数组/资源池），突变 A 不波及 B/C、不污染定义。
  3. 种子可表达四类分歧：位置、关系亲和、资源、声誉。
  4. 同动作在不同实例产生不同结果：正典实例「摊牌」被拒（非共现），分歧实例通过并触发「劳勃驾崩」级联事件入日志；同效果（声誉 -10）在不同初始值下得到不同绝对结果（82 vs 40）。
- **关键发现（P2 必做）**：现有 `evaluateWorldAction` 仅实现 7 类前提中的 2 类（`requires_co_presence` / `requires_capability`）；`requires_knowledge` 被静默忽略——「不知情的奈德也能向瑟曦摊牌」构成认知泄漏。P2 事件内核必须实现全部前提类型，否则信息不对称架构失效。
- **交付物**：`src/world/runtime/instantiate.ts`（`instantiate` / `synthesizeInitialState` / `applyStateEffect`）；`vitest.config.ts` + `npm test` 脚本；ADR 无变更。
