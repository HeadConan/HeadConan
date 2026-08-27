# HeadConan 世界运行时（WORLD RUNTIME）

> 本文件是内核（[`HEADCONAN_KERNEL.md`](./HEADCONAN_KERNEL.md)）的实现规格：定义结构、实例语义、状态真理源、转移抽象、事件模型、信息不对称、代理/玩家/主持人模型、记忆与持久化的归属。

---

## 1. WorldDefinition（世界定义）—— 组合结构

**原则**：不是每个类别一个类。定义由「几个最小组合体」构成。现有 `representation/` 的类型已接近正确，本文件做三点修正（见 1.2）。

### 1.1 组合结构

```
WorldDefinition
├── 身份与版本（id, name, tagline, premise, version）
├── Axioms（公理：不变法则）            —— 物理/社会契约/机构规范
├── Ontology（本体）                    —— CapabilityDefinition + PropertyDefinition
├── Baseline（正典基底）                —— entities（char/org/loc/object/resource）+ relationships + groundTruthFacts
├── Dynamics（动力学）                  —— WorldActionDefinition[]（前提/效果/后果）
├── PossibilitySpace（可能性空间）       —— InhabitedRoleSlot[]（模式/代理级/认知雾/禁忌）
└── ExperienceProfile（体验信号）        —— 幻想原型/张力梯度/密度/推荐模态
```

**文化/机构/地理不需要专属类**：
- 机构 = `OrganizationEntity`（doctrine/cohesion/prestige）+ 挂在组织上的规范（`SocialNorm`）。
- 文化 = 公理 + 规范 + 体验信号（`dominantTone` 等）的涌现，不单独建模。
- 地理 = `LocationEntity`（accessibility/spatialAffordances）+ 位置间关系（如 `adjacency` 可用 Relationship 或自定义属性表达）。

### 1.2 对现有类型的修正

| # | 修正 | 原因 |
| :--- | :--- | :--- |
| 1 | **信念从定义迁到状态**：删除 `CharacterEntity.beliefs` 静态数组，改为运行时 `BeliefRecord[]`（随状态演化） | 信念随时间变化；静态信念与模拟冲突（危险假设 #4） |
| 2 | **`knownFactIds` 单一源**：运行时认知记录以 `epistemics.entityKnownFacts` 为准；定义中保留的 `knownFactIds` 仅作**初始认知**（种子） | 双源必然漂移（危险假设 #5） |
| 3 | **动作定义补三类专门化**：`speech_act` 类别、延迟后果（`spawnEvent.delayInTurns`/`afterInUniverseTime`）、组织级效果（`targetDomain: organization`） | 四世界压力测试的吃紧点（见内核 3.5） |
| 4 | **`currentSituationNarrative` 从状态移除**：改为事件日志的最新摘要（派生） | 字符串 blob 无法计算显著性（危险假设 #9） |

### 1.3 定义不变式（校验器必须强制）

1. 所有引用（角色/组织/地点/事实/动作/关系）必须存在（已有 `validateWorldDefinition` 覆盖大部分）。
2. 每个角色必须能解析出：角色 ↔ 实体绑定、认知雾级别、可用动作类别（已有）。
3. 定义不得包含任何运行时值（回合数、当前时间、当前状态、UI 计划）。
4. `groundTruthFacts` 中同一条事实不得有两条可见域矛盾的记录（新增校验）。

---

## 2. 世界实例 / 场景 / 时间线 / 分支

| 概念 | 定义 | 存储形式 |
| :--- | :--- | :--- |
| **WorldInstance** | 一次具体运行：`definitionId + scenarioId + 当前状态 + 事件日志 + 时钟 + 代理绑定` | 状态快照（周期性）+ 追加日志 |
| **ScenarioSeed** | 起始配置：初始情境 + 初始状态突变（`StateEffect[]`）+ 推荐角色 | 定义侧数据（种子库） |
| **Timeline** | 事件日志按时间排序的投影 | 不存储（派生视图） |
| **TimelineBranch** | 在日志某点派生出的新实例（`parentTimelineId + forkedAtTurn + divergenceReason`） | 分支即「复制实例 + 从分歧点继续」 |

**实例化流程**（确定性）：
1. `instantiate(definition, scenario)` → 深拷贝定义基线 → 应用 `initialStateMutations` → 初始化认知记录（角色初始 `knownFactIds` 来自定义）→ 时钟归零 → 日志空。
2. 任何时刻 `restore(instanceId, snapshotOrLog)` 可重建。

> 分支的操作成本 = 一次实例复制 + 之后只写新日志。禁止为分支建独立数据库（过度工程）。

---

## 3. 世界状态 —— 真理源与派生分离

### 3.1 真理源（SOURCE OF TRUTH，必须持久化）

| 数据 | 说明 |
| :--- | :--- |
| 实体状态 | `entityStates[id] = { currentLocationId, currentActivity, emotionalState, reputationScore, physicalStatus, dynamicAttributes, inventory }` |
| 关系状态 | `relationshipStates[id] = { affinity, trust, powerBalance, recentInteractions, brokenPromises }` |
| 时钟 | `turnNumber + inUniverseTime + elapsedSimulatedSeconds` |
| 认知记录 | `epistemics = { entityKnownFacts, beliefs, activeSecrets, activeRumors, publicExposedFactIds }` |
| 资源池 | `resourcePools[id] = number` |
| 事件日志 | 全部 `SimulationEvent`（追加写） |
| 调度队列 | 待执行的排队事件（含触发时间） |
| 代理绑定 | `agentBindings[entityId] = { controller: player|ai|script|none, policy?, playerId? }` |

### 3.2 派生（DERIVED，永不存储为真理）

| 派生物 | 来源 |
| :--- | :--- |
| 观察者视图 | `projectEpistemicPerspective(state, observer)` |
| 信念真伪标记 | 信念 vs 事实的对比（比对时计算） |
| 显著性/注意力 | Experience Service |
| 呈现计划 | Experience Service |
| 声誉聚合/关系摘要 | 由状态值推导 |
| 叙事散文 | 事件 → LLM 措辞（呈现层缓存，非真理） |
| 时间线/分支图 | 事件日志投影 |

**纪律**：任何字段若能由日志+规则重建，就不进状态快照（快照仅做性能缓存）。

---

## 4. 世界转移（TRANSITIONS）

### 4.1 抽象

```
ACTOR_INTENT + STATE + RULES
        │  解析与校验
        ▼
  CANDIDATE EVENT（候选事件）
        │  内核应用
        ▼
  NEW STATE + SPAWNED EVENTS + OBSERVATIONS + (REJECTED?)
```

**核心签名**：

```
applyEvent(state, definition, event)
  → { nextState, spawnedEvents[], observations[], rejected? , reason? }
```

### 4.2 转移流水线（内核内部）

1. **前提校验**（确定性）：位置共现、能力、知识、资源、权限、信任阈值、主持人权限（干预事件需 `player_directive` 溯源 + 角色权限）。
2. **效果应用**（确定性）：原子突变（set/increment/decrement/reveal_fact/create_entity/modify_status），支持 `$actor`/`$target` 占位符解析。
3. **观察派生**：事件携带「谁在场/谁可见」→ 对每个观察者生成观察记录 → 更新其 `knownFacts`/`beliefs`/`rumors`。**这是信息不对称的写入通道。**
4. **后果排队**：满足触发条件的 `EmergentConsequence` → 立即效果 + 延迟/定期事件进入调度队列。
5. **日志追加**：事件 + 观察 + 拒绝记录全部入日志（拒绝也是日志项，支持「尝试过」叙事）。

### 4.3 「公开指控大臣」示例走查

| 步骤 | 内容 |
| :--- | :--- |
| 意图 | 玩家：「我公开指控大臣。」 |
| 解析 | `intent(accuse, target=minister, claim=fact_ref)` → 候选事件 `public_accusation` |
| 前提 | ① 玩家在场（议会大厅）；② 有说话能力；③ 该指控对象在场；④ 主持人/角色权限允许 |
| 效果 | 大臣 reputation-15；玩家与大臣 relationship(hostility)；议会 faction 立场浮动 |
| 观察 | 在场议员 12 人 → 每人 `knownFacts += 指控内容(作为 rumor/belief)`；媒体事件排队 |
| 后果 | `scheduled_event(大臣回应, +1 回合)`；`scheduled_event(派系 A 表态, +2 回合)` |
| 显著性 | 这是高戏剧性事件 → 体验层提升为焦点 |

---

## 5. 事件模型（EVENT MODEL）

### 5.1 五概念不合并，但只有一层存储

| 概念 | 定义 | 存储 |
| :--- | :--- | :--- |
| **Action（动作）** | 意图：`{ actor, verb, target, payload, context }` | 不存储（输入） |
| **Event（事件）** | 发生的事实：`{ id, type, turn, time, actor, targets, content, publicKnowledgeLevel }` | **日志（唯一存储）** |
| **StateChange（状态变化）** | 事件的效果集 | 由事件+规则派生（可物化为快照） |
| **Observation（观察）** | 谁感知到了什么 | 事件携带的观察副作用 → 写入认知记录 |
| **Consequence（后果）** | 后续事件（立即或延迟） | 调度队列 / 日志 |

> 结论：**事件日志是唯一脊柱**。动作是其输入，状态变化与观察是其投影，后果是排队事件。五概念语义不同但物理上不重复存储——这既满足「不自动合并」的要求，也避免冗余。

### 5.2 事件类型（初始集合，随世界扩展）

| 类型 | 示例 | 说明 |
| :--- | :--- | :--- |
| `speech_act` | 对话/质问/谎言/坦白 | 含 `utterance`、`subtext?`、`intentTag`；供读心/推演/潜台词 |
| `physical_action` | 攻击/移动/搜查 | 前提多为位置/能力 |
| `political_action` | 结盟/宣战/颁布法令 | 触发组织级效果与延迟后果 |
| `forensic_action` | 检验/发现证据/审讯 | 触发 `reveal_fact` 认知写入 |
| `institutional_action` | 课程/任命/处分 | 触发日程与例行 |
| `directorial_intervention` | 主持人注入事件 | 溯源 `player_directive`，仍需前提校验（权限） |
| `scheduled_trigger` | 定时后果/截止 | 由调度器自动提交 |
| `world_tick` | 日常例行/环境变化 | 自主世界推进的最小步 |

### 5.3 事件纪律

1. 事件不可变（追加写）。修正 = 新事件（`retraction` 类型），不是原地编辑。
2. 事件必须可序列化（纯数据）。叙事散文不是事件的一部分。
3. 事件必须有 `publicKnowledgeLevel`（universal / witnesses_only / covert），观察派生依赖它。

---

## 6. 信息不对称（INFORMATION ASYMMETRY）

### 6.1 最小可行架构（非完整认知逻辑）

```
WORLD TRUTH（事实层，带可见域 + 溯源）
        │ 观察副作用（事件的投影，唯一写入通道）
        ▼
KNOWLEDGE（认知记录：entityKnownFacts[实体]=[事实ID]；beliefs：含置信度/真伪）
        │ 投影（纯读函数）
        ▼
PERCEPTION（projectEpistemicPerspective(observer) → 观察者视图）
```

### 6.2 三原则

1. **真相与认知分存**：事实在定义/状态的事实层；认知记录只存「已知哪些事实 ID + 主观信念」。真伪标记是比对时计算的派生值。
2. **认知只经事件改变**：`reveal_fact` / `observation` 效果是唯一写入通道。任何角色/玩家/呈现层都**不可能**直接读到未授权的真相——因为读的永远是投影结果。
3. **投影在呈现时执行**：每次用户回合结束，按角色（含 `epistemicFogOfWar`）投影。投影结果不回流状态。

### 6.3 秘密与戏剧反讽

- `SecretItem`：`{ factId, holdingEntityIds, targetEntityIds, consequencesIfExposed, exposureThreshold }`。
- 暴露触发：阈值被事件推高（如证据被发现）→ 触发暴露事件（后果进入调度队列）。
- 反讽检测：`compareEpistemicAsymmetry(world, state, A, B, factId)`（已有）——供体验层提示「观众知道而角色不知道」的时刻。

### 6.4 泄漏防护清单

| 场景 | 防护 |
| :--- | :--- |
| 玩家切角色/切主持人 | 每次渲染前重新投影（主持人 = 全知投影，玩家 = 严格一视点投影） |
| LLM 代理上下文注入 | 给代理的上下文 = 该代理的投影视图，**不是**全量状态 |
| 事件内容包含秘密 | 事件 `publicKnowledgeLevel` 决定观察派生范围；covert 事件默认无观察者 |
| 叙事散文泄漏 | 叙事措辞由「该观察者的视图」生成，而非上帝视角 |

---

## 7. 角色 / 代理 / 玩家 / 主持人模型

### 7.1 概念分离（不是类继承，是绑定）

```
Entity（基底：一切事物）
  └─ Character = Entity + 心智（人格/目标/需求/能力/认知记录）
        └─ Agent = Character（或任意实体）+ 决策绑定（谁来驱动）
              绑定 controller: 'player' | 'ai' | 'script' | 'none'
Player    = 一种 视角 + 代理权 + 控制绑定 + 认知边界（可控制 0..n 个角色）
Host      = 一种 角色/权限 + 全知认知透镜 + 干预权限（可同时是 Player）
```

| 概念 | 本质 | 实现 |
| :--- | :--- | :--- |
| Entity | 存在之物 | `CoreEntityKind`（含 character/agent/organization/location/object/resource/concept） |
| Character | 有心智的实体 | `CharacterEntity`（心智字段 + 初始认知种子） |
| Agent | 实体 + 决策过程 | 运行时 `AgentBinding`（controller + policy 引用） |
| NPC | 由 AI/脚本驱动的 Agent | `controller: 'ai' | 'script'` |
| Player | 视角+代理权+绑定+认知边界 | `InhabitedRoleSlot`（已有）+ `PlayerSession`（用户侧） |
| Host | 角色+权限+全知透镜 | `InhabitedRoleSlot(host)` + 干预事件通道 |

### 7.2 统一动作/观察接口（关键）

所有「控制者」——玩家、AI 代理、脚本、主持人——通过**同一个接口**与世界交互：

```
interface Controller {
  perceive(view: EpistemicPerspective): void;      // 只看投影
  decide(context): CandidateEvent[];               // 产出候选事件
}
applyEvent(state, def, candidate) → result         // 唯一写入路径
```

这使 NPC 代理、玩家代理、主持人代理共享全部基础设施：前提校验、观察副作用、日志、显著性。**「玩家是被人类控制的 NPC」被彻底否决**——玩家是绑定的一个实例。

### 7.3 主持人（Host）设计

| 问题 | 决策 |
| :--- | :--- |
| 是角色、权限、模式还是视角？ | **四者的组合**：角色（Host 角色槽）+ 权限（干预/审查/改规则）+ 模式（UI 上的编辑面）+ 视角（全知投影） |
| 是否有独立引擎？ | **否**。干预 = `directorial_intervention` 事件（溯源 `player_directive`），走同一内核与校验。区别仅在：来源允许、权限检查放宽、观察默认 covert |
| 能看隐藏信息？ | 能——主持人投影 = 全知投影（`observerEntityId` 为空），这是**视角**，不改变状态 |
| 能改定义/规则？ | 能——`define_modification` 事件（版本化 diff），同样入日志、可回滚。运行时不为此开旁路 |

---

## 8. 记忆与持久化的归属

### 8.1 五类记忆的定位

| 记忆 | 是什么 | 住在哪 | 真理性 |
| :--- | :--- | :--- | :--- |
| **世界记忆** | 事件日志 + 状态（全部发生过的） | 运行时（日志是真理） | 真理 |
| **角色记忆** | 该实体 `knownFacts` + 信念 + 交互摘要 | 状态认知记录（结构化）+ 派生摘要（语义） | 事实 ID 是真理；摘要非真理 |
| **玩家记忆** | 用户笔记 + 玩家已感知内容（由角色+日志派生） | 用户数据 | 用户笔记是用户资产 |
| **事件历史** | 日志本身 | 运行时 | 真理 |
| **派生知识** | 长文摘要/检索索引（语义记忆） | 异步构建的派生层 | **非真理**——永远以日志为准，摘要只作上下文 |

### 8.2 记忆在热循环之外

- **热循环只用结构化数据**：状态、认知记录、事件（小而确定）。
- **长文记忆异步派生**：摘要/索引由日志构建，供代理上下文与呈现层使用；任何 LLM 拿到的「记忆」都标注来源（`ProvenanceMeta`），不得覆盖事实层。
- **防污染规则**：LLM 可以生成新事件（观察/推理），但**不能改写既有事实**；修正 = 新事件。

### 8.3 持久化分层

| 层 | 内容 | 所有者 | 存储形态 |
| :--- | :--- | :--- | :--- |
| 定义 | WorldDefinition + 版本 | 作者 | 版本化文档 |
| 实例 | 快照 + 事件日志 + 分支 | 运行时 | 追加日志 + 周期快照 |
| 玩家 | 笔记/绑定/偏好 | 用户 | 用户数据 |
| 制品 | 图片/文档（内容寻址） | 运行时+用户 | 内容寻址存储，事件引用 |

---

## 9. 与世界定义的体验信号对接

```
WorldDefinition.ExperienceProfile
  ├─ primaryFantasy / dominantTone / tensionGradient
  ├─ socialDensity / informationAsymmetry / consequenceLethality / investigativeDepth
  └─ recommendedModalities（dialogue_focused / forensic_evidence_board / territorial_tactical_map / relationship_web_graph / academic_schedule_timeline / dossier_matrix）
        │
        ▼（体验服务解读信号，世界无关）
ExperienceState + PresentationPlan（见 LAYOUT_ARCHITECTURE.md）
```

**纪律**：世界声明「什么模态重要」，体验服务决定「现在用什么模态」，呈现层决定「怎么摆」。三层都不得硬编码「SPY×FAMILY 界面」这类世界专属 UI。
