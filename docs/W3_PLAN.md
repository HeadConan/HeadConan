# W3 执行计划（动作·场景·代理）

> **定位**：`EXECUTION_PLAN.md`（V1.1）W3 阶段的可执行版。W2 收尾已提交（`292e309`，观察闭环 + 前提 7/7 + 持久化 round-trip）。
> 撰写日期：2026-08-30。基线已验证：`tsc --noEmit` 零错误，`vitest` 81/81 绿。

---

## 0. 阶段论文（Thesis）

> **世界从"回应玩家"升级为"自己在动、NPC 有独立视角、界面随场景重组"——LLM 成为第一提议者，NPC 从模板反应升级为代理。**

用户可感知的转变（对应 VISION 核心承诺排序）：
- **自治 NPC（#5）**：Anya 自主插话（Step 3）、Yor 按自己投影回应（Step 2）——不再只是脚本节拍。
- **场景化界面（#3）**：场景自动切换（Step 5 通勤 / Step 7 医务室 / Step 10 世界编辑），界面围绕"当下在做什么"重组。
- **可感知后果（#2）**：LLM 提议的意图经校验真实进入内核（Step 2/4/6），拒绝即事件语义不变。

本阶段每个任务必须能回答"更接近进入活世界的哪个瞬间"；答不上来的不做（EXECUTION_PLAN §6 范围纪律）。

---

## 1. 当前基线（已核实，2026-08-30）

### 🟢 已完成并提交
| 项 | 提交 | 说明 |
| :--- | :--- | :--- |
| W1 运行时接线 | `469fa34` | kernel2 + kernel2Resolver + legacyAdapter + App 绞杀者重构 |
| W2.1 调度器 | `56d226d` | scheduler.ts（seed RNG / once / periodic / 预算 / 拒绝即事件） |
| P0-1 入口如实化 | `2d62233` | EmptyPromptSpace / WorldGenesisAnimation / WorldAtlasExplorer |
| P0-2 死胡同清零 | `2bab021` | Director 真实注入 / B8 兜底标注 / B9 去内部化 |
| W2 收尾 | `292e309` | 观察闭环（reveal 广播 + 公开话语披露）+ 前提 7/7 测试 + 持久化 round-trip |

### 🟡 缺口（W3 处置）
| 缺口 | 现状 | 处置 |
| :--- | :--- | :--- |
| **LLM 提议通道** | `resolveUserAction` 是 10 条确定性规则；LLM 未接入动作流 | W3.2（第一提议者 + 确定性回退） |
| **场景概念** | 无 scene 字段；`computeUIPlan` 每帧算 blocks | W3.1（可序列化场景状态机） |
| **一阶对话** | speech_act 在内核已存在；ActionDock 是自由文本 | W3.3（点击目标 + 场景绑定话语） |
| **代理循环** | `spyFamilyReaction` 是确定性脚本（W1） | W3.4（感知→决策→候选事件→内核） |

---

## 2. 依赖图与任务拆解

```
W3.1 场景状态机（独立先行，1~2 日）
   │  可序列化 scene 字段 + 触发规则（意图/节奏/导演）
   ▼
W3.3 一阶对话（依赖 ②，1 日）
   │  点击目标 + 场景绑定话语 + 场景内对话状态
   │
W3.2 LLM 提议基础设施（独立，1~2 日）  ──┐
   │  /api/propose-events + proposeUserEvents   │
   ▼                                          ▼
W3.4 代理循环（依赖 ②，1~2 日）
   │  感知（投影）→ 决策（LLM 提议+效用）→ 候选事件 → 内核
   ▼
W3.5 验收与提交（1 日）
    W3 退出门三连 + tsc/vitest 全绿 + 校准问题 + 提交
```

**关键路径** = `max(W3.1→W3.3, W3.2→W3.4)`。W3.1 与 W3.2 相互独立可并行。

**W3 中点门槛（约 09-17，部分学分）**：Step 1/2/4/8/9 确定性路径必须可运行——即使 LLM/代理循环未完成，体验不断裂（确定性回退永不硬阻塞）。

---

## 3. 任务规格（含接口设计）

### W3.1 场景状态机（独立先行）

**用户可感知效果**：界面围绕"当下在做什么"重组——Step 5 时钟推进自动切通勤场景、Step 7 前往医务室切探索场景、Step 10 切导演呈世界编辑形态；刷新后场景与场景内状态（如对话轮次）不丢。

**接口设计**（新模块 `src/world/runtime/scene.ts` + `WorldStateInstance` 加字段）：

```ts
// state.ts 新增
export type SceneType = 'conversation' | 'everyday' | 'exploration' | 'world_editing';

export interface SceneState {
  current: SceneType;
  /** 场景内可序列化状态（对话轮次、聚焦对象、已收集线索） */
  inScene: Record<string, unknown>;
  /** 上次切换原因（可解释性：玩家视角 = 叙事线索 + UI 过渡） */
  lastTransition?: { from: SceneType; to: SceneType; reason: string; turn: number };
}

// WorldStateInstance 新增
scene: SceneState;

// scene.ts 新增
export interface SceneIntentHint {
  type: 'travel' | 'talk' | 'inspect' | 'world_edit' | 'cadence';
  targetId?: EntityId;
}

/** 场景推导：世界状态 + 观察者 + 意图提示 → 场景（纯函数，可序列化） */
export function deriveScene(
  world: WorldDefinition,
  state: WorldStateInstance,
  observer: EntityId | null,
  intentHint?: SceneIntentHint
): SceneState
```

**触发规则（2 源，可解释性优先）**：
1. **用户意图**：`resolveUserAction` 返回 `sceneHint`（travel → exploration；talk → conversation；inspect → exploration）。
2. **世界节奏**：`tickScheduler` / 时钟推进触发（Step 5：turn 推进 → everyday→exploration 通勤）。
3. **导演 overlay**：呈现层切 world_editing（不污染世界正典场景；SCENE_MODEL §3 玩家/Host 可不同场景）。

**切换纪律**：显式用户切换 > 自动切换；场景内状态随实例持久化，返回时恢复（SCENE_MODEL §4）。

**接线**：`instantiate` 初始化 `scene`（默认 everyday）；`App.tsx` 在 `handleDispatchAction` 后调用 `deriveScene` 更新；`computeUIPlan` 改为接收 scene 决定 blocks/actions。

**验证（`scene.test.ts`）**：
1. 意图触发：travel 意图 → exploration；talk 意图 → conversation。
2. 节奏触发：时钟推进 → everyday→exploration。
3. 可序列化：scene 随快照 round-trip，场景内状态不丢。
4. 导演视角：observer=null → world_editing 呈现。

**退出门**：场景随意图/节奏自动切换，刷新后场景与场景内状态恢复。

---

### W3.2 LLM 提议意图解析（第一提议者）

**用户可感知效果**：自由文本意图由 LLM 理解并提议结构化候选事件（Step 2/4/6 的对话与动作），经内核校验后真实生效；LLM 不可用/低置信时自动回退确定性解析，体验永不硬阻塞。

**接口设计**（新模块 `src/ai/propose.ts` + 服务端新端点）：

```ts
// src/ai/propose.ts
export interface ProposedAction {
  events: KernelEvent[];
  confidence: number;          // 0-1
  source: 'llm' | 'deterministic' | 'clarify';
  resolution: string;          // 人类可读说明（供调试与澄清反馈）
  notice?: string;             // 澄清/未支持提示（不硬拒绝）
}

/** LLM 提议为主通道；确定性解析器为回退/测试路径（共享同一 resolve→validate→apply 接口） */
export async function proposeUserEvents(
  text: string,
  world: WorldDefinition,
  state: WorldStateInstance,
  actorId: EntityId,
  opts: { provider: AIProviderId; fallback: typeof resolveUserAction }
): Promise<ProposedAction>
```

**服务端 `/api/propose-events`**（复用 `callDeepSeek`/`callGemini` 网关）：
- 入参：`{ action, worldSummary, stateSummary, provider, model }`。
  - `worldSummary`：角色（id+name+aliases）、地点、事实（id+statement）、动作（id+name+前提摘要）。
  - `stateSummary`：各相关实体当前位置、已知事实、最近事件。
- 出参（严格 JSON schema 校验）：`{ events: KernelEvent[], confidence, resolution }` 或 `{ fallback: true, message }`。
- **红线（ADR-008）**：LLM 只提议，内核只写入。服务端校验 schema；客户端校验实体 ID/动作 ID；内核 `applyEvent` 为最终门（拒绝即事件）。

**客户端流程**（`App.tsx` `handleDispatchAction` 改造）：
1. `selectedEngine !== 'procedural'` 且服务可用 → 尝试 LLM 提议。
2. 校验候选事件（实体 ID / 动作 ID / 前提可查）。
3. LLM 不可用 / 解析失败 / 低置信 → 确定性 `resolveUserAction` 回退；低置信 → 澄清提示而非硬拒绝。
4. 交内核 `applyEvent`（最终门）。

**验证（`propose.test.ts` + 服务端固件）**：
1. LLM 固件（记录好的 LLM 输出）→ 候选事件经校验进入内核，状态真实变化。
2. LLM 不可用（fetch 失败）→ 确定性回退，体验不阻塞。
3. 低置信 → 澄清提示，不产生事件。
4. 非法事件（未知实体 ID）→ 客户端校验拒绝，不进入内核。

**退出门**：LLM 提议的意图经校验真实进入内核；LLM 不可用时确定性路径完整可跑（W3 中点门槛）。

---

### W3.3 一阶对话 speech_act（点击目标）

**用户可感知效果**：对话是"结构化事件 + 点击目标"——点角色即对其说话（Step 2/4/6），建议话语绑定场景而非自由文本+建议，对话轮次在场景内推进。

**接口设计**（UI 层 + 复用内核 speech_act）：

- **点击目标**：conversation 场景内，角色卡片可点击 → 设置 `targetIds=[该角色]`，ActionDock 提示"对 X 说"。
- **场景绑定话语**：`deriveScene` 输出的场景决定建议话语集（conversation → "夸奖约尔"/"询问安雅学校"；exploration → "检查钢笔"）。
- **场景内对话状态**：`scene.inScene.dialogueTurn` 递增；`speech_act` 事件带 `intentTag`（ask/compliment/say/probe/confess/insult）。
- 内核 speech_act 已支持共现检查 + 意图增量 + 观察副作用（W2.3），无需改内核。

**验证（`dialogue.test.ts` 或 UI 走查）**：
1. 点击角色 → 生成 `speech_act(actor, targetIds=[该角色])`。
2. 对话轮次在场景内状态递增，刷新恢复。
3. 非共现目标 → 内核拒绝（拒绝即事件）。

**退出门**：对话可点击目标、场景绑定话语、轮次状态可持久化。

---

### W3.4 代理循环（最小可行版）

**用户可感知效果**：NPC 因独立视角而"像活人"——Step 3 Anya 自主插话（无玩家输入产生 speech_act）；Step 2 Yor 按自己投影回应（不知 Loid 是间谍，绝不泄露杀手身份）。

**接口设计**（新模块 `src/world/runtime/agentLoop.ts`）：

```ts
export interface NpcPerception {
  npcId: EntityId;
  knownFactIds: FactId[];            // 只含该 NPC 自己的认知账本（投影隔离核心）
  coPresent: EntityId[];             // 现场共现实体
  recentEvents: SimulationEvent[];   // 最近事件（该 NPC 视角可感知的）
  relationshipSnapshot: Record<string, DynamicRelationshipState>;
}

/** 感知：只取 NPC 自己的投影，绝不包含其他实体的认知 */
export function perceiveFor(
  npcId: EntityId,
  world: WorldDefinition,
  state: WorldStateInstance
): NpcPerception

export interface AgentContext {
  npcId: EntityId;
  world: WorldDefinition;
  state: WorldStateInstance;
  stimulus: KernelEvent;             // 触发刺激（玩家 speech_act / 世界事件）
  budget: number;                    // 本 turn 剩余代理决策预算
}

export interface AgentDecision {
  events: KernelEvent[];
  source: 'llm' | 'deterministic';
  confidence: number;
}

/** 决策：LLM 提议候选 + 效用选择；LLM 不可用 → 确定性回退 */
export async function decideNpc(
  ctx: AgentContext,
  opts: { propose: ProposeFn; fallback: DeterministicReaction }
): Promise<AgentDecision>
```

**循环语义（最小可行，R7 缓解）**：
1. **感知**：`perceiveFor` 只含该 NPC 的 `entityKnownFacts[npcId]` + 现场共现 + 最近事件。**LLM prompt 绝不包含其他实体的认知账本**（投影隔离硬要求，泄漏即证伪）。
2. **决策**：LLM 提议候选 speech_act/action → 确定性效用选择（按 intentTag / 关系值 / 目标优先级打分）。
3. **候选事件 → 内核**：`applyEvent` 校验并写入（拒绝即事件）。
4. **预算上限**：每 turn 每 NPC 至多 N 次决策；仅对话决策点触发（不自主移动）。

**确定性回退**（LLM 不可用/测试路径）：
- 复用 `spyFamilyReaction`（Step 2/4 节拍，投影隔离已内建）。
- **新增 Anya 自主插话触发器**（Step 3）：Anya 知道 Yor 是杀手（其投影内），若 Yor 刚给出可疑 cover 回应 → Anya 冒失插话 `speech_act(anya, "妈妈又杀人了吗？")`。确定性可测。

**接线**：`KernelOptions.reactions` 由代理循环接管（接口不变，仅替换实现）；`App.tsx` 在玩家动作后对现场共现 NPC 逐个跑 `decideNpc`（预算内）。

**验证（`agentLoop.test.ts`）**：
1. **投影隔离断言**：Yor 的决策输入只含其已知事实（不含 factLoidTwilight）——泄漏即证伪（W3 主退出门）。
2. **Anya 自主插话**：无玩家输入下，Anya 在特定刺激后产生 speech_act（Step 3）。
3. **确定性回退**：LLM 不可用时，Step 2/4 节拍与 W1 一致（回归）。
4. **预算上限**：多 NPC 场景下决策数不超预算。

**退出门**：Anya 经代理循环自主插话；Loid/Yor 互不知晓秘密（投影隔离断言）。

---

### W3.5 验收与提交

**W3 退出门三连**：
1. **Anya 自主插话**（Step 3）：无玩家输入产生 Anya 的 speech_act（代理循环或确定性回退）。
2. **投影隔离断言**：Loid/Yor 互不知晓秘密；NPC 决策输入只含自身投影（泄漏即证伪）。
3. **确定性路径可跑**：Step 1/2/4/8/9 在 LLM 关闭时完整可运行（W3 中点门槛）。

**门禁**：`tsc --noEmit` + `vitest run` 全绿。
**提交仪式**：向用户提出 2~4 个校准定位问题 → 确认后提交（用户规则，强制）。按 W3.1→W3.2→W3.3→W3.4 每任务一 commit。

---

## 4. 假设 → 实验 → 证伪门槛

| # | 假设 | 实验 | 证伪门槛 |
| :--- | :--- | :--- | :--- |
| H-W3.1 | 场景随意图/节奏自动切换且可序列化，界面围绕当下任务重组 | scene.test.ts 1-4 | 场景切换引发迷失或闪屏（→ 先发无动画版；仍迷失则回到稳定框架+手动聚焦） |
| H-W3.2 | LLM 提议经校验进入内核，确定性回退永不硬阻塞 | propose.test.ts 1-4 | LLM 输出绕过校验写入 / LLM 不可用时体验硬阻塞（→ 回退确定性路径） |
| H-W3.3 | 对话可点击目标、场景绑定话语、轮次可持久化 | dialogue.test.ts 1-3 | 点击目标未生成结构化事件（→ 修 UI 接线） |
| H-W3.4 | NPC 因独立视角而"像活人"，投影隔离成立 | agentLoop.test.ts 1-4 | NPC 决策使用投影外信息（泄漏）→ **暂停代理循环修投影**（W3 主证伪） |

**全局红线（EXECUTION_PLAN §4 W3）**：NPC 决策泄漏投影外信息，或 LLM 不可用时体验硬阻塞 → 暂停推进，先修对应层。

---

## 5. 明确不做（防过拟合）

- 完整 BDI 目标层 / 自治 NPC 社会 / 经济模拟——DEFERRED（代理循环只做"对话决策点"级最小版）。
- NPC 自主移动/行动（代理循环仅响应刺激，不主动移动）。
- 高阶认知（"A 相信 B 相信 p"）——仅投影隔离 + 两方视角过滤。
- 场景树 / 场景图数据库——场景是扁平状态，切换由事件/意图驱动（SCENE_MODEL §6）。
- FLIP 动画 / 布局引擎——W4 范围。
- 语义记忆 / 长文本摘要 / 向量库——DEFERRED。
- 世界编辑器产品化——Host 只读 + 干预事件（现状保持）。

---

## 6. 风险登记（本阶段局部）

| # | 风险 | 概率 | 影响 | 缓解 |
| :--- | :--- | :--- | :--- | :--- |
| R1 | LLM 提议→校验拒绝循环 / LLM 不可用硬阻塞（R4 放大） | 高 | 高 | 确定性解析器为第一回退；低置信→澄清而非硬拒绝；体验永不依赖 LLM 可用性 |
| R2 | 代理循环范围过大挤占 W4（R7 放大） | 中 | 高 | 仅对话决策点 + 预算上限；W3 中点门槛强制先保确定性体验 |
| R3 | 场景自动切换引发迷失（R3） | 中 | 中 | 触发源限"用户意图 + 世界节奏"；始终可手动覆盖 |
| R4 | 投影隔离泄漏（LLM prompt 含他者认知） | 中 | 高 | `perceiveFor` 只取自身账本；泄漏即证伪（H-W3.4），暂停代理循环修投影 |
| R5 | LLM 测试依赖真实 API 随机性 | 中 | 中 | 固件（记录好的 LLM 输出）+ 确定性解析器；`npm run test` 稳定可重放 |

---

## 7. 提交门禁与校准问题（提交前询问，用户规则）

1. **Q1 LLM 接入**：新增 `/api/propose-events` 专用端点（推荐）/ 复用 `/api/interact-world` / 客户端直连？
2. **Q2 场景深度**：完整可序列化状态机（推荐）/ 轻量推导 / 仅类型+布局映射？
3. **Q3 代理范围**：仅对话决策点（推荐）/ 对话+移动 / 完整 BDI（DEFERRED）？
4. **Q4 顺序与粒度**：W3.1→W3.2→W3.3→W3.4 每任务一提交（推荐）/ ①+④ 一组、②+③ 一组？

> 本计划按推荐项定稿（用户已跳过校准，采用"按推荐方案执行"模式）；首个 commit 前重新确认。

---

## 8. 涉及文件清单

| 文件 | 变更 |
|---|---|
| `src/world/representation/types/state.ts` | W3.1：`SceneState` + `WorldStateInstance.scene` |
| `src/world/runtime/scene.ts` | W3.1 新增：`deriveScene` + 触发规则 |
| `src/world/runtime/instantiate.ts` | W3.1：初始化 `scene` 字段 |
| `src/world/runtime/scene.test.ts` | W3.1 新增测试 |
| `src/ai/propose.ts` | W3.2 新增：`proposeUserEvents` |
| `server.ts` | W3.2：`/api/propose-events` 端点 |
| `src/world/runtime/propose.test.ts` | W3.2 新增测试（LLM 固件 + 回退） |
| `src/app/App.tsx` | W3.2/3.3/3.4：handleDispatchAction 改造 + 场景接线 + 代理循环接线 |
| `src/components/layout/ActionDock.tsx` | W3.3：点击目标 + 场景绑定话语 |
| `src/world/runtime/agentLoop.ts` | W3.4 新增：`perceiveFor` + `decideNpc` |
| `src/world/runtime/agentLoop.test.ts` | W3.4 新增测试（投影隔离 + 自主插话） |
| `src/world/spyFamily/spyFamilyReactions.ts` | W3.4：确定性回退 + Anya 插话触发器 |
| `docs/W3_PLAN.md` | 本文档 |

---

## 9. W4 前瞻（本阶段结束后）

- Salience + PresentationPlan（玩家/Host 产生不同呈现计划）；
- 5 基元布局引擎 + Focus（可先无 FLIP 动画版）；
- 持久化 localStorage 全量（世界+log+场景+角色）；
- 10 分钟全流程验收（§9 验收清单 A1-A7）。
