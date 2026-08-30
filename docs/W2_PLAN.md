# W2 执行计划：完整数据驱动内核（调度器 + 观察闭环）

> **定位**：`EXECUTION_PLAN.md`（V1.1）W2 阶段（09-07~09-13）的详细可执行版。
> 起点基线：W1 后半已提交（`469fa34`），`tsc --noEmit` 零错误，`vitest` 32/32 绿。
> 撰写日期：2026-08-29。

---

## 0. 阶段论文（Thesis）

> **世界从"只回应玩家"升级为"自己在动"——非玩家事件由调度器驱动，观察进入认知闭环。**

用户可感知的转变（对应 VISION 核心承诺排序）：
- **可感知后果（#2）**：公开说出秘密 → 在场的 NPC 真的知道、缺席的不知道；错过家长会 → 校方评价真实下降（已有）。
- **持久世界（#4）**：刷新后世界 + 待触发事件不丢。

W2 每个任务的"更接近活世界的哪个瞬间"必须能回答；答不上来的不做。

## 0.1 已定案决策（2026-08-29 用户校准）

| 决策 | 结论 | 对计划的影响 |
| :--- | :--- | :--- |
| C-W2.1 App 层走查 | **先走查再进主线**：W2.0 作为第 0 步，人工/Playwright 验证 W1 退出门后再进调度器 | W2.0 为强制前置，回归先修 |
| C-W2.2 调度确定性 | **seed 伪随机**：seeded RNG（mulberry32/LCG），`scheduler.seed` 持久化，同 seed+同序列 → 一致级联，保留概率分布 | W2.1 内建 seeded RNG；`Math.random` 禁用 |
| C-W2.3 前提测试世界 | **测试内独立世界**：独立夹具定义覆盖 resource/authority/min_trust/capability，不扩展 `spyFamilyMin` | W2.2 走独立夹具，最小定义保持纯净 |

---

## 1. 起点审计（已核实，2026-08-29）

### 🟢 已具备（W1 交付）
| 能力 | 位置 | 状态 |
| :--- | :--- | :--- |
| 7 类前提**判定代码** | `runtime/kernel2.ts` `checkPrecondition` | 全 7 类 switch 分支齐备 |
| 效果/确定性级联数据驱动 | `kernel2.ts` `applyEffects` + `triggerProbability===1` | directEffects 从定义读取，占位符 `$actor/$target` 解析 |
| 拒绝即事件 | `kernel2.ts` `fail()` | 拒绝写入 `eventChronicleLog`，`title=[rejected]` |
| 确定性重放 | `kernel2.ts` `makeEventId` = `evt:{turn}:{seq}:{type}` | 测试已断言 `evt:2:0:speech_act` |
| 最小 SPY×FAMILY 定义 | `spyFamily/spyFamilyMin.ts` | 8 角色 / 4 地点 / 2 核心秘密 + 1 可发现 / 5 动作 |

### 🟡 部分 / 缺口
| 缺口 | 现状 | W2 处置 |
| :--- | :--- | :--- |
| 前提**定义级测试** | 仅 location/knowledge/co_presence/capability 有用例 | 补 resource/authority/min_trust（§4 W2.2） |
| **调度器** | 无；`triggerProbability<1` 的 spawnEvent 只返回 `spawnedEvents`，无人执行 | 实现最小调度器（§4 W2.1） |
| **观察闭环** | `speech_act` 记录在场者听到，但**不写入认知账本** | 公开披露→在场者认知更新（§4 W2.3） |
| 持久化 | App.tsx 有 v3 快照（kernelState/chronicle/notes/role） | 将调度队列纳入快照（§4 W2.4） |
| **App 层端到端验证** | W1 绞杀者重构只经 tsc + 单测，未走查真实浏览器 | W2 前置收尾（§4 W2.0） |

---

## 2. 依赖图与任务拆解

```
W2.0 App 层走查（前置收尾，半日）
   │  确认 W1 退出门：切角色→界面内容真的变；Step 1/2/4 可跑
   ▼
W2.1 调度器（核心增量，2 日）
   │  tick / 延迟 once / 周期 periodic / 预算上限 / 拒绝即事件 / maxAttempts
   ▼
W2.3 观察闭环（1~2 日）
   │  公开披露 → 在场者认知更新（W2 主退出门）
   ▼
W2.4 持久化补强（1 日，可与 W2.2 并行）
   │  调度队列纳入快照 + 会话恢复续跑
   ▼
W2.2 前提 7/7 定义级测试（1 日，可与 W2.3 并行）
   │  每类 ≥2 用例（通过 + 拒绝理由）
   ▼
W2.5 验收与提交（1 日）
    tsc 全绿 + vitest 全绿 + 校准问题 + 提交
```

**关键依赖**：W2.3 依赖 W2.1（非玩家事件经调度器产生，观察随之传播）；W2.2/W2.4 相对独立，可与主线并行。

---

## 3. 假设 → 实验 → 证伪门槛

> 取自 `EXECUTION_PLAN.md §4`，此处落为 W2 内部可执行粒度。

| # | 假设 | 实验 | 证伪门槛 |
| :--- | :--- | :--- | :--- |
| H-W2.1 | 最小调度器足以让"世界自己动"且保持确定性 | 延迟 once / 周期 periodic / 预算上限 / 拒绝即事件 / maxAttempts 各 1 个单测 + 重放一致性 | 任一调度事件无法确定性触发，或重放不一致（→ 暂停，先修内核正确性） |
| H-W2.2 | 7 类前提全部可确定性判定并给出失败原因 | 每类 ≥2 用例（通过 + 拒绝 reason） | 任一前提类型无确定性判定（→ 暂停，先修内核正确性） |
| H-W2.3 | 公开披露经观察进入在场者认知，缺席者不知 | 集成测试：公开指控/坦白 → 在场者认知账本更新、缺席者不更新 | 在场者未更新或缺席者更新（→ 泄漏：先修投影/认知传播） |
| H-W2.4 | 快照含调度队列，会话恢复后续跑不重不漏 | JSON round-trip → 恢复 → tick 续跑 | 恢复后事件丢失或重复触发（→ 修序列化） |

**全局证伪门槛（红线，来自 EXECUTION_PLAN §4 W2）**：任一前提类型无法确定性判定，或重放不一致 → **暂停推进，先修内核正确性，其他一切让路**。

---

## 4. 任务规格（含接口设计）

### W2.0 前置收尾：W1 退出门 App 层验证（半日）

**用户可感知效果**：确认绞杀者重构无回归，W1 退出门（切角色→界面真的变）真达成。

**走查清单**（dev server + 手动/Playwright）：
1. 进入 → 生成动画 → 早餐场景（全家就位）
2. 输入「夸奖约尔」→ 约尔按自己视角回应
3. 输入「问安雅学校」→ 安雅回应（含史密斯老师线索）
4. 输入「检查钢笔」→ 自动先前往走廊 → 钢笔秘密进入洛德认知
5. 切到 Director → 看到全部秘密（洛德视角看不到约尔杀手/安雅读心）
6. 切到 Yor → 只看到她自己已知的事实（看不到洛德是间谍）
7. 刷新 → 世界与进度恢复

**证伪门槛**：任一核心交互崩溃 / 空白 / 投影不随角色变化 → 先修 W1 回归再进 W2.1。

---

### W2.1 调度器（核心增量，2 日）

**目的**：`triggerProbability<1` 的级联、延迟后果、周期事件获得真实执行路径；世界在玩家不输入时仍有后续。

**接口设计**（最小可行，不做优先级系统/复杂时间模型）：

```ts
// runtime/scheduler.ts（新建）
export interface ScheduledEvent {
  id: string;                    // 确定性：`sch:{turn}:{seq}:{actionId}`
  actionId: ActionId;
  actorId: EntityId;
  targetIds: EntityId[];
  params?: Record<string, unknown>;
  kind: 'once' | 'periodic';
  dueTurn: number;               // 到期 turn
  intervalTurns: number;         // periodic 重排间隔；once = 0
  attempts: number;              // 已尝试次数
  maxAttempts: number;           // 拒绝耗尽即移除（默认 3）
}

export interface SchedulerState {
  queue: ScheduledEvent[];
  budgetPerTurn: number;         // 每 turn 最多执行数（默认 3）
  nextSeq: number;               // 确定性 ID 序号
}

export function enqueueScheduled(
  state: WorldStateInstance, ev: Omit<ScheduledEvent, 'id' | 'attempts'>, opts?: KernelOptions
): void;

/** 推进调度：处理 all dueTurn<=当前turn 的事件（受预算上限约束）；返回执行的 ApplyResult 列表 */
export function tickScheduler(state: WorldStateInstance, opts: KernelOptions): ApplyResult[];
```

**确定性纪律（用户红线，已定案 2026-08-29）**：
- 非确定性级联（`triggerProbability<1`）引入 **seed 伪随机**：调度器内置 seeded RNG（如 mulberry32/LCG），`WorldStateInstance.scheduler.seed` 持久化于状态，同一 seed + 同一事件序列 → 完全一致的概率级联结果，保持可重放，同时保留概率分布。
- 事件 ID 由 `turn + seq` 生成（复用 `makeEventId` 风格），保证同前缀重放一致。

**接入点**：`applyEvent` 成功后（`case 'action'` 的 spawnEvent 分支）→ `enqueueScheduled`；App 在每次 `handleDispatchAction` 成功推进状态后调用 `tickScheduler`，把触发的调度事件作为「世界自发更新」并入叙事输出（前缀标注 `[世界]`）。

**用户可感知效果**：不输入时世界也会推进——例如家长会倒计时提示、NPC 自主的小动作（W2 用确定性脚本事件，W3 由代理循环接管）。

**验证（vitest，`scheduler.test.ts`）**：
1. once 延迟：dueTurn=3 的事件在 turn 3 tick 触发，此前不触发
2. periodic：每 2 turn 重排，触发 2 次后按 maxTicks 停止（若引入）
3. 预算上限：queue 超预算 → 本 turn 执行前 N 个，其余顺延下一 turn，不丢
4. 拒绝即事件：调度事件前提不满足 → 记 `[rejected]` 日志，attempts+1，耗尽移除
5. 重放：同一初始状态 + 同一事件序列 → 两次 tick 终态一致

**退出门**：以上 5 项全绿。

---

### W2.2 前提 7/7 定义级测试（1 日，可并行）

**目的**：落实 EXECUTION_PLAN W2 退出门「前提 7/7 每类确定性判定 + 失败原因」，为 H-W2.2 提供证据。

**现状**：判定代码齐备；定义级测试覆盖 location（检查钢笔）、knowledge（摊牌）、co_presence（摊牌/坦白）、capability（检查钢笔，无失败用例）。

**任务**（**已定案：测试内独立世界**——不扩展 `spyFamilyMin`，避免污染"最小定义"）：
- 在测试内构造一个**独立的最小世界夹具**（新 `kernel2.preconditions.test.ts` 内定义，或 `test/fixtures` 下独立 `preconditionWorld.ts`），包含覆盖 resource / authority / min_trust / capability 前提的动作与实体：
  - `requires_capability`：无该能力的角色执行 → 拒绝 + reason（含失败用例）
  - `requires_resource`：资源池数量不足 → 拒绝 + reason；补足后通过
  - `requires_authority`：无 `socialPermissions` 权限 → 拒绝 + reason；有权者通过
  - `requires_min_trust`：关系 trust 低于门槛 → 拒绝 + reason；提升后再试通过
- `requires_location` / `requires_knowledge` / `requires_co_presence`：已在 `kernel2.test.ts` 覆盖，此处补边界断言即可。

**说明**：夹具世界遵循 storylet 形（前提/效果/级联全在定义内，不写死 ID），仅服务于前提判定测试，不进运行态。

**验证**：`kernel2.test.ts` 扩展或新增 `kernel2.preconditions.test.ts`，断言 `rejected=true` 且 `reason` 包含预期失败文案。

**退出门**：7 类前提每类 ≥2 用例（通过 + 拒绝理由）。

---

### W2.3 观察闭环（1~2 日）

**目的**：实现 W2 主退出门「公开指控 → 在场者知道 / 缺席者不知道」。当前 `observations` 只记录、不写认知。

**设计**（数据驱动 + 单一传播规则，不做"相信层级"——那是 DEFERRED）：
- 在内核统一规则：**事实经公开披露（speech_act 含 secret 内容，或 reveal_fact source=host/observation）→ 在场者（co-present 且 observer !== 被披露对象自身）认知账本更新**。
- 具体：`reveal_fact` 在写入 targetId 认知后，向在场其他实体广播（受 `world.groundTruthFacts[f].visibilityScope` 约束；`singular_secret` 仅在披露现场传播）。
- `speech_act` 若 utterance 公开说出秘密（由反应引擎/未来代理判定），走同一传播路径。
- **投影隔离不变**：认知账本更新 ≠ 显示可见；NPC 各自投影仍按自己视角过滤。

**用户可感知效果**：公开说出秘密 → 在场的 NPC 真的知道（下一次反应不同）；缺席的不知道。信息不对称从"静态种子"升级为"运行时传播"。

**验证**（集成测试）：
1. Director 向洛德 reveal 约尔杀手秘密，且约尔在场 → 约尔（已知，不动）、在场第三方认知更新
2. 缺席者（不同地点的角色）认知不更新
3. 信息不对称回读：洛德知道秘密后，投影仅对洛德可见，对 Yor 不可见（复用 legacyAdapter 断言）

**退出门**：公开披露 → 在场者知道 / 缺席者不知道。

---

### W2.4 持久化补强（P8a 并行，1 日）

**目的**：落实验收 A7（刷新后 Step 9 声誉 -10 仍持久）+ 调度队列不丢。

**现状**：App.tsx `LS_KERNEL_STATE v3` 已整存 `kernelState`（含 `clock/entityStates/epistemics/relationshipStates/resourcePools/eventChronicleLog`）。`scheduler` 作为 `WorldStateInstance` 新字段将**自动随快照序列化**。

**任务**：
- 确认 `WorldStateInstance.scheduler` 纳入 `structuredClone` + `JSON` round-trip（无函数/循环引用）
- 会话恢复后：`tickScheduler` 继续按 `dueTurn` 续跑（不重置时钟、不重复触发）
- 在 `instantiate.test.ts` / 新 `persistence.test.ts` 加 round-trip 测试

**用户可感知效果**：刷新不丢进度、不丢待触发事件。

**验证**：instantiate → enqueue → tick → JSON 序列化 → 反序列化 → tick 续跑 → 事件不重不丢。

**退出门**：恢复后调度事件仍在；续跑不重复、不丢失。

---

### W2.5 验收与提交（1 日）

**W2 退出门三连**：
1. 公开指控 → 在场者知道 / 缺席者不知道（W2.3）
2. 同一日志前缀两次重放 → 状态完全一致（W2.1 确定性 + 全量回归）
3. 级联有界：调度队列长度有上限（预算 + maxAttempts + 队列截断），不无限堆积（W2.1）

**门禁**：`npm run lint`（tsc --noEmit）+ `npm run test` 全绿。

**提交仪式**：向用户提出 2~4 个校准定位问题（用户规则，强制）→ 确认后提交。

---

## 5. 明确不做（防过拟合，W2 内）

- 优先级调度系统 / 复杂时间模型（turn 整数即可，不做 wall-clock）
- 观察的"相信层级"（"A 相信 B 相信 p"）——DEFERRED
- 完整 BDI 目标层 / NPC 社会模拟——DEFERRED（W3 只做"对话决策点"级代理循环）
- 调度器驱动的复杂 NPC 自主剧情——W2 只做最小确定性/seed 事件（触发家长会倒计时等）
- 扩展 `spyFamilyMin` 覆盖全部前提类型——前提测试走独立夹具世界（已定案）

---

## 6. 风险登记（W2 局部）

| # | 风险 | 概率 | 影响 | 缓解 |
| :--- | :--- | :--- | :--- | :--- |
| W2-R1 | 调度器引入破坏重放的路径（ID/时钟错位） | 中 | 高 | 确定性 ID（turn+seq）；重放测试为 W2.1 退出门；证伪红线暂停推进 |
| W2-R2 | 观察传播过泛（人人知道）破坏信息不对称 | 中 | 高 | 传播受 visibilityScope 约束；投影隔离不变；泄漏即证伪 |
| W2-R3 | W2.3 范围蔓延到"认知模型" | 中 | 中 | §5 明确不做；单一传播规则，不做相信层级 |
| W2-R4 | W1 App 层回归拖慢 W2 | 低 | 中 | W2.0 前置走查先行；回归先修再进主线 |
