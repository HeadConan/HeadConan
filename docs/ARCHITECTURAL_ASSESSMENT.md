# HeadConan 架构评估报告（Architectural Assessment）

> 阶段：实现前规划（Phase 0）。
> 目的：在写出任何生产代码之前，先确定 HeadConan **实际上是什么**、原型**实际上做了什么**、哪些是**假装实现的**，以及哪些抽象值得保留、哪些必须抛弃。
> 依据：对仓库全部源码与文档的通读（`src/**`、`server.ts`、根级 15 份文档、`docs/**` 21 份文档、`docs/layout/*`、`docs/world-atlas/*`）。

---

## 1. HeadConan 目前是什么

从代码与文档的交叉验证来看，HeadConan 当前是一个**「生成式界面 + 文本交互」的研究原型**，而非一个世界运行时：

- **界面层（真实的）**：React 19 + Tailwind 的精致暗色 UI，11 种语义 UI Block（地图、证据板、档案、时间线、事件、关系、统计、文档、导演控制台等），由一个规则式 `computeUIPlan` 编排进一个固定 3 列 CSS 网格。
- **状态层（部分真实的）**：`src/world/types.ts` 中扁平的 `WorldState`（角色/地点/派系/事件/统计/文档的数组），由 `App.tsx` 的 `useState` 持有，并写入 `localStorage`。
- **AI 层（真实但被误用）**：`server.ts` 是稳健的 Express 代理（Gemini + DeepSeek + 图片生成 + 过程式回退）。但提示词迫使 LLM 在一轮内输出「完整世界状态 + UI 布局计划」的巨型 JSON。
- **世界表示层（真实但未接线）**：`src/world/representation/*` 是一套正式的类型化表示体系（Definition/State/Dynamics/Presentation 四层分离、认知投影器、校验器、动作求值器、四个基准世界），但**完全未接入** `App.tsx` 的实时循环。

一句话概括：**原型是一个「看起来像世界模拟器的生成式仪表盘」；真正意义上的世界运行时尚未存在，只有它的建筑材料（表示体系）和它的展示皮囊（UI 块）。**

---

## 2. 原型实现了什么（REAL）

| 子系统 | 位置 | 真实性 | 说明 |
| :--- | :--- | :--- | :--- |
| 世界表示基础 | `src/world/representation/*` | **REAL** | Definition/State/Dynamics/Presentation 四层分离、Fact/Belief/Secret/Rumor 认知模型、关系与权力向量、`projectEpistemicPerspective`、`validateWorldDefinition`、`evaluateWorldAction`、四个基准世界。通过类型检查。 |
| AI 网关代理 | `server.ts` | **REAL** | Gemini 3.7 Flash、DeepSeek V3/R1、图片生成、JSON 提取与回退链。 |
| 世界图册 | `src/data/worldAtlas.ts` + `WorldAtlasExplorer` | **REAL** | 400+ 世界分类库、50 个金标准世界、雷达图与筛选。 |
| 交互外壳 | `ActionDock`、`Header`、`EngineSelector` | **REAL** | 建议词条、引擎切换、角色切换。 |
| 纯视觉组件 | `StatsBlock`、`TimelineBlock`、`DocumentBlock` 等 | **REAL（仅视觉）** | 对现有数据渲染良好，但无交互深度。 |
| 布局研究 | `docs/LAYOUT_*`、`docs/layout/*`、`docs/PRESENTATION_MODEL.md` | **REAL（设计资产）** | 5 空间原语、注意力打分、FLIP 过渡、6 个场景布局分析——这是最有价值的设计资产之一。 |

---

## 3. 原型假装实现了什么（FAKE / MOCKED）

| 假装实现 | 证据 | 真相 |
| :--- | :--- | :--- |
| **世界生成** | `src/world/engine.ts` 用 `prompt.includes('mystery')` 等关键词匹配返回静态种子 | 模板匹配，不是合成。任何不在种子库里的提示词都会落到通用模板。 |
| **因果模拟** | `simulateWorldInteraction` 按 `includes('attack')/includes('talk')` 等字符串猜测情感倾向 | 关键词启发式 + 硬编码数值漂移，不验证任何前提条件，不产生真正的级联后果。 |
| **导演/上帝干预** | `DirectorConsoleBlock` 提交时给文本加 `[DIRECTOR INTERVENTION]` 前缀 | 用文本前缀伪装权限，绕过了任何权限/规则系统。 |
| **信息不对称** | `Header` 切换角色只改 `activeRoleId` 并重算 UI 计划 | 世界状态**不经过**认知过滤就到达 UI；`representation` 的投影器被闲置。 |
| **UI 自适应** | `computeUIPlan` 按 `style.primarySurfaceType` 返回固定 Block 数组 | 规则树，无注意力模型、无焦点对象、无空间持久性。 |
| **持久化** | `localStorage` 保存世界 JSON + 编年史 | 同一浏览器可跨刷新恢复，但无事件日志、无分支、无快照版本、无多端。 |
| **证据板/地图交互** | 硬编码 SVG 坐标与连线 | 用户不能拖拽、连线、推理；纯展示。 |

---

## 4. 已存在的主要抽象（值得审视并保留/演进）

按「架构重要性」排序：

1. **Definition / State / Dynamics / Presentation 四层分离**（`representation/`）—— 方向正确，是本项目最重要的既有资产。
2. **认知模型**：`Fact`（可见域 6 级）、`Belief`（置信度+真伪）、`SecretItem`（持有者/目标/暴露阈值）、`RumorItem`、`projectEpistemicPerspective` 投影器 —— 解决了信息不对称的最小可行建模。
3. **一阶关系与多维权力**：`RelationshipDefinition`（affinity/trust/powerBalance/visibility/coverStory）、`PowerRelation`（政治/经济/军事/信息/社会/超自然/法证 7 域向量）。
4. **玩家可能性空间**：`InhabitedRoleSlot`（inhabitationMode 5 种、agencyLevel 4 级、epistemicFogOfWar 3 级）—— 玩家≠NPC 的关键抽象。
5. **场景与分支的类型骨架**：`ScenarioSeed`、`TimelineBranch`（仅有类型，无运行时语义）。
6. **体验信号**：`ExperienceProfile`（主导幻想原型、张力梯度、信息密度、`recommendedModalities`）—— 世界驱动 UI 而不硬编码组件的正确接口。
7. **动作声明模型**：`WorldActionDefinition`（preconditions/directEffects/potentialConsequences）+ `evaluateWorldAction` 求值器 —— 已存在但未接入玩家输入路径。
8. **布局语法**：5 空间原语（Anchor/Stage/Satellite/Ambient/Dock）+ `PresentationPlan` 类型草案。
9. **命名空间 ID 与溯源**：`entity:spy_family:loid_forger`、`ProvenanceMeta`（authored/derived/observed/inferred/simulated/temporary）—— 区分正典与幻觉的关键。
10. **校验器**：`validateWorldDefinition`（悬空引用、重复 ID、角色绑定）。

---

## 5. 缺失的抽象（MISSING）

| 缺失抽象 | 为什么必需 | 现状 |
| :--- | :--- | :--- |
| **事件内核（唯一写入者）** | 所有状态变更必须经过单一、可重放、可校验的纯函数；否则无法保证确定性、回滚与分支 | 无；状态被 `mutations.ts` 和 LLM 直接改 |
| **动作解析层** | 用户自由文本 → 结构化候选事件 → 前提校验 → 事件 | 无；文本直接进 LLM 或关键词匹配 |
| **认知更新的副作用化** | 观察必须作为事件的效果写回 `knownFacts`/`beliefs`，才能保证不泄漏 | `projector` 是纯读函数（正确），但没有「观察→知识」的写入通道 |
| **焦点/显著性计算** | 决定「此刻什么重要」——体验层的入口 | 无；`computeUIPlan` 只是规则树 |
| **代理绑定模型** | 一个角色由谁控制（玩家/AI/脚本）应是运行时绑定而非实体属性 | 仅有 `AgentBehavior` 类型壳，无绑定与决策循环 |
| **调度器（时间/待办事件队列）** | 级联后果、「明日大臣反应」、校园日程都需要延迟执行 | 无；事件立即全量应用 |
| **持久化分层** | 定义/实例/状态/事件日志/玩家数据各有归属 | 只有 localStorage 单对象 |
| **对话为一阶对象** | 谎言、潜台词、读心都需要话语（utterance）记录而非叙事文本 | 无 |
| **布局引擎** | 5 原语的实现：焦点→舞台模式→卫星/环境/坞编排 | 只有文档 |
| **创作者/主持人工具的真实通道** | 干预应成为带溯源的事件，经同一内核 | 文本前缀冒充 |

---

## 6. 危险假设（DANGEROUS ASSUMPTIONS）

1. **「LLM 能在单轮输出完整且一致的世界状态 JSON」** —— 已多次出现 schema 漂移与幻觉；状态越大越不可靠；token 成本随轮次线性爆炸。这是当前架构最危险的假设。
2. **「LLM 应该设计 UI」** —— 提示词要求 LLM 返回 `uiPlanning.blocks`。这与「世界独立于界面」的根本主张自相矛盾。
3. **「所有世界都适配同一个仪表盘网格」** —— 3 列网格把政治模拟、谋杀谜案、间谍家庭、校园生活压成同一形态。
4. **「信念属于定义而非状态」** —— `CharacterEntity.beliefs` 是静态数组；但信念随时间变化（怀疑、误解、幻灭）。静态信念会与模拟冲突。
5. **`knownFactIds` 双源** —— 定义上的 `char.knownFactIds` 与状态上的 `epistemics.entityKnownFacts` 并存，谁为准？运行时必须单一源。
6. **「表示体系是纯数学，可以慢慢接线」** —— 若接不上实时循环，`representation/` 将成为「漂亮但没用」的死代码。风险在于其正确性永远不被真实路径验证。
7. **「回合=用户动作」** —— 没有时间语义：校园世界需要日历压力，悬疑世界需要倒计时，而 `inUniverseTime` 只是字符串。
8. **「角色切换不改状态」** —— 当前切到导演只是多显示一个控制台；真正的导演视角应改变「可见内容」，而不是「拥有的工具」。
9. **`currentSituationNarrative` 字符串 blob** —— 作为状态唯一叙事锚点，无结构、无法计算显著性。

---

## 7. 应保留（PRESERVE）

| 保留项 | 理由 |
| :--- | :--- |
| `src/world/representation/*` 整体 | 四层分离、认知模型、关系/权力、角色空间、场景/分支骨架、校验器、四个基准世界 —— 这是未来内核的数据契约基础 |
| `server.ts` 代理架构 | 多提供商路由、回退链、图片生成端点，仅需替换提示词与请求/响应契约 |
| `src/data/worldAtlas.ts` | 高价值基准目录；注意其 `rightsStatus` 字段为版权风险提供了入口 |
| 布局研究文档（`docs/LAYOUT_*`、`docs/layout/*`、`PRESENTATION_MODEL.md`） | 5 原语与 14 问研究是布局引擎的规格书 |
| `ActionDock` 交互外壳与建议词条机制 | 唯一成熟的人机通道 |
| 纯视觉组件（Stats/Timeline/Document/Event） | 在数据契约明确后可廉价复用 |
| `ProvenanceMeta` 与命名空间 ID | 溯源是区分正典/幻觉/干预的基石 |
| `evaluateWorldAction` 的 reducer 精神 | `(State, Action) → NextState` 是正确方向，只是求值太浅、未接线 |

---

## 8. 应抛弃（DISCARD）

| 抛弃项 | 理由 |
| :--- | :--- |
| `src/world/types.ts`（遗留 `WorldState`） | 扁平的 lore+UI 混杂物（`colSpan` 在领域类型里）。由 `representation/` 迁移替代 |
| `src/world/engine.ts` 关键词匹配 | 伪合成。替换为：真实世界合成（LLM 产出**定义** JSON + 确定性实例化）+ 确定性回退 |
| `src/world/mutations.ts` 标量钳制 | 无前提、无规则、无级联。替换为事件内核 |
| `src/ai/prompts.ts` 与 `server.ts` 中的单轮巨型 JSON 提示 | 违反一切分离原则。替换为：结构化工具调用/小步状态增量 |
| `src/interface/director.ts` 规则树 | 替换为注意力/显著性驱动的 `PresentationPlanner` |
| `src/ui/renderer.tsx` 3 列网格 | 替换为 5 原语布局引擎 |
| `[DIRECTOR INTERVENTION]` 文本前缀机制 | 替换为带溯源的干预事件，经同一内核与权限校验 |
| 硬编码在 Block 上的布局属性（`colSpan`） | 布局属于体验层，不属于领域数据 |
| 静态种子世界的 UI 计划（`mockWorlds` 中的 `uiPlanning`） | 世界不应携带 UI 计划 |

---

## 9. 结论

原型在**两个方向上各走了一半**：表示体系（正确的数学/认知契约）与展示层（精致的视觉外壳）都已存在，但中间的心脏——**事件驱动的世界转移内核、动作解析、认知副作用、显著性计算、代理绑定**——完全缺失。下一阶段不是「继续堆 UI」，而是把表示体系接线为运行时，并在两者之间建立唯一写入通道。

相关文档：
- 内核定义 → [`HEADCONAN_KERNEL.md`](./HEADCONAN_KERNEL.md)
- 系统边界 → [`SYSTEM_ARCHITECTURE.md`](./SYSTEM_ARCHITECTURE.md)
- 运行时细节 → [`WORLD_RUNTIME.md`](./WORLD_RUNTIME.md)
