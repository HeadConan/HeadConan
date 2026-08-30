# W2 收尾执行计划（观察闭环 → 验收）

> **定位**：`EXECUTION_PLAN.md`（V1.1）W2 阶段的剩余可执行版。W2.1 调度器已提交（`56d226d`）；P0 UX 修复已提交（`2d62233` + `2bab021`）。
> 撰写日期：2026-08-30。基线已验证：`tsc --noEmit` 零错误，`vitest` 57/57 绿。

---

## 0. 阶段论文（Thesis）

> **世界从"只回应玩家"升级为"自己在动、秘密会扩散"——观察进入认知闭环，信息不对称从静态种子升级为运行时传播。**

用户可感知的转变（对应 VISION 核心承诺排序）：
- **可感知后果（#2）**：Director 注入秘密 / 公开说出秘密 → 在场的 NPC 真的知道、缺席的不知道；下一次反应因此不同。
- **持久世界（#4）**：刷新后世界 + 待触发事件不丢（调度队列随快照恢复续跑）。

本阶段每个任务必须能回答"更接近进入活世界的哪个瞬间"；答不上来的不做（EXECUTION_PLAN §6 范围纪律）。

---

## 1. 当前基线（已核实，2026-08-30）

### 🟢 已完成并提交
| 项 | 提交 | 说明 |
| :--- | :--- | :--- |
| W1 运行时接线 | `469fa34` | kernel2 + kernel2Resolver + legacyAdapter + App 绞杀者重构 |
| W2.1 调度器 | `56d226d` | scheduler.ts（seed RNG / once / periodic / 预算 / 拒绝即事件 / maxAttempts）；`tickScheduler` 已接入 App（App.tsx L301） |
| P0-1 入口如实化 | `2d62233` | EmptyPromptSpace / WorldGenesisAnimation / WorldAtlasExplorer + UX_P0_FIX_PLAN |
| P0-2 死胡同清零 | `2bab021` | Director 真实注入 / Character / Map / Event / Notes / B8 兜底标注 / B9 去内部化 + 2 个测试 |
| W2.0 走查发现 | 已处置 | 走查暴露的 P0 问题全部修复并提交；W1 退出门（切角色→界面真的变）无回归 |

### 🟡 缺口（本计划处置）
| 缺口 | 现状 | 处置 |
| :--- | :--- | :--- |
| **观察闭环** | `kernel2.ts` 的 `observations` 只记录（utteranceHeard / factIdsRevealed），**不写认知账本**；`reveal_fact` 只写 target 一人 | W2.3（本阶段主线） |
| 前提 7/7 定义级测试 | 仅 location/knowledge/co_presence/capability 有用例 | W2.2（独立夹具世界） |
| 持久化补强 | App 已整存 v3 快照（含 `scheduler` 字段兜底），但**无 round-trip 续跑测试** | W2.4 |

---

## 2. 依赖图与任务拆解

```
W2.3 观察闭环（主线，1~2 日）
   │  秘密扩散机制：reveal_fact 广播 + 公开话语披露 → 在场者认知更新
   ▼
W2.2 前提 7/7 定义级测试（并行，1 日）  ──┐
W2.4 持久化补强（并行，1 日）            ──┤  相互独立，可与 W2.3 并行
   ▼
W2.5 验收与提交（1 日）
    W2 退出门三连 + tsc/vitest 全绿 + 校准问题 + 提交
```

**关键依赖**：W2.3 是本阶段核心（W2 主退出门）；W2.2/W2.4 独立可并行，不阻塞主线。

---

## 3. 任务规格（含接口设计）

### W2.3 观察闭环（主线）

**用户可感知效果**：导演注入秘密或角色公开说出秘密后，在场的 NPC 真的知道（下次反应/推理不同），缺席的不知道——信息不对称成为"运行时传播"而非静态种子。

**接口设计**（内核只做传播，不做内容判定——保持"解释在解析层、写入在内核"的架构红线）：

```ts
// kernel2.ts 新增（W2.3）
/**
 * 观察闭环传播：事实披露后，向披露现场共现实体广播（受 visibilityScope 约束）。
 * 返回新增的观察记录；已持有者（pushKnownFact 返回 false）跳过。
 */
function propagateFactToCoPresent(
  world: WorldDefinition,
  state: WorldStateInstance,
  factId: FactId,
  atEntityId: EntityId,          // 披露现场实体（取该实体的 currentLocationId 为传播地点）
  excludeEntityIds: EntityId[]   // 已持有者 / 披露对象，不重复广播
): ObservationRecord[]

// KernelOptions 新增（可选）
discloseFactResolver?: (world: WorldDefinition, event: KernelEvent) => FactId[]
// 用途：speech_act 公开说出秘密时，由解析层判定"此话语披露了哪些事实"，内核只执行传播。
```

**传播规则（单一规则，不做相信层级）**：
1. **触发 A（reveal_fact 广播，必做）**：`reveal_fact` 写入 target 认知后，向披露现场共现实体广播。地点取 `state.entityStates[event.targetId].currentLocationId`（target 为角色，必有地点）。
2. **触发 B（公开话语披露，必做）**：`speech_act` 处理时，若 `opts.discloseFactResolver` 返回非空 factId[]，按同一规则向 actor 现场的共现听者广播。
3. **范围约束（visibilityScope）**：
   - `cosmic_truth`：不传播（无人可知）；
   - `singular_secret` / `intimate` / `restricted`：仅在披露现场传播给在场见证者（此即"秘密被说出"的戏剧性来源）；
   - `domain_public` / `universal_public`：传播（实际多为 no-op）。
4. **不做**：相信层级、rumor 扩散、跨地点传播（§5 明确不做）。

**接线**：
- `spyFamilyMin.ts` 新增 `SPY_FAMILY_SECRET_UTTERANCES: { pattern: RegExp; factId: FactId }[]`（如"约尔是杀手/荆棘公主"→factYorAssassin；"钢笔是窃听器"→factPenSurveillance；"安雅会读心"→factAnyaTelepath；"洛德是黄昏/间谍"→factLoidTwilight）。
- `App.tsx` 组装 `KERNEL_OPTS` 时注入 `discloseFactResolver`（基于该表，确定性短语匹配；W3 由代理循环判定"是否值得说破"）。

**验证（`kernel2.observation.test.ts`）**：
1. **reveal 广播**：Director reveal factYorAssassin 给洛德，贝琪同地点在场 → 洛德 + 贝琪认知更新；异地校长认知不更新。
2. **公开话语披露**：洛德在贝琪面前说出命中秘密短语的话语 → 贝琪认知更新；异地角色不更新。
3. **投影隔离回读**：广播后 `legacyAdapter` 投影——洛德看到该事实、Yor（未获知）看不到（复用现有投影断言）。
4. **cosmic_truth 不传播**：该类事实 reveal 后仅目标知晓，共现者不更新。

**退出门**：公开披露 → 在场者知道 / 缺席者不知道（W2 主退出门）。

---

### W2.2 前提 7/7 定义级测试（并行）

**用户可感知效果**：内核所有拒绝语义有确定性证据——错误路径给出可读原因，而非静默失败。

**任务**（已定案：测试内独立夹具世界，不扩展 `spyFamilyMin`）：
- 新建 `src/world/runtime/preconditionWorld.ts`（或测试内内联夹具），含覆盖 resource / authority / min_trust / capability 前提的动作与实体：
  - `requires_capability`：无该能力者执行 → 拒绝 + reason；有能力者通过；
  - `requires_resource`：资源不足 → 拒绝 + reason；补足后通过；
  - `requires_authority`：无 `socialPermissions` → 拒绝 + reason；有权者通过；
  - `requires_min_trust`：trust 低于门槛 → 拒绝 + reason；提升后再试通过。
- `requires_location` / `requires_knowledge` / `requires_co_presence` 已有用例，补边界断言即可。

**验证（`kernel2.preconditions.test.ts`）**：每类 ≥2 用例（通过 + 拒绝理由）。

**退出门**：7 类前提每类 ≥2 用例全绿。

---

### W2.4 持久化补强（并行）

**用户可感知效果**：刷新不丢进度、不丢待触发事件（调度队列续跑不重不漏）。

**任务**：
- 新增 `persistence.test.ts`：instantiate → enqueue（once 延迟事件）→ tick 一次 → `JSON.stringify` round-trip → 反序列化 → 再 tick → 断言事件不重、不丢、时钟与 seed 保持。
- 确认 `WorldStateInstance.scheduler`（queue/budgetPerTurn/seed/nextSeq）为纯数据，随快照序列化（无函数/循环引用）。
- **[可选 P1 顺手项，校准 Q4 确认]** App "New World" 重置前弹确认（防误触丢进度）——与持久化同一信任主题。

**退出门**：恢复后调度事件仍在；续跑不重复、不丢失（验收 A7 落点）。

---

### W2.5 验收与提交

**W2 退出门三连**：
1. 公开指控 / 秘密披露 → 在场者知道、缺席者不知道（W2.3）；
2. 同一日志前缀两次重放 → 状态完全一致（调度 seed 确定性 + 全量回归）；
3. 级联有界：调度队列有上限（预算 + maxAttempts + 队列截断），不无限堆积（W2.1，回归断言）。

**门禁**：`tsc --noEmit` + `vitest run` 全绿。
**提交仪式**：向用户提出 2~4 个校准定位问题 → 确认后提交（用户规则，强制）。

---

## 4. 假设 → 实验 → 证伪门槛

| # | 假设 | 实验 | 证伪门槛 |
| :--- | :--- | :--- | :--- |
| H-W2.3 | 公开披露经观察进入在场者认知，缺席者不知，且投影隔离不变 | W2.3 验证 1-4（集成测试） | 在场者未更新 / 缺席者更新 / 投影泄漏 → 先修传播与投影，其他让路 |
| H-W2.2 | 7 类前提全部确定性判定并给出失败原因 | 每类 ≥2 用例 | 任一前提无确定性判定 → 暂停，先修内核正确性 |
| H-W2.4 | 快照含调度队列，恢复后续跑不重不漏 | round-trip → 恢复 → tick 续跑 | 恢复后事件丢失或重复触发 → 修序列化 |

**全局红线（EXECUTION_PLAN §4 W2）**：任一前提类型无法确定性判定，或重放不一致 → **暂停推进，先修内核正确性，其他一切让路**。

---

## 5. 明确不做（防过拟合）

- 观察的"相信层级"（"A 相信 B 相信 p"）——DEFERRED；
- rumor 扩散 / 跨地点传播 / 复杂时间模型——不做；
- speech_act 的"NPC 自主决定是否说破秘密"——W2 用确定性短语表，W3 由代理循环接管；
- 扩展 `spyFamilyMin` 覆盖全部前提类型——前提测试走独立夹具（已定案）；
- P1 其余项（8 角色仅 2 可玩视角、重复导航状态不同步、假遥测等）——**默认延后至 W3/W4**，除非校准 Q4 要求在本阶段顺带处理。

---

## 6. 风险登记（本阶段局部）

| # | 风险 | 概率 | 影响 | 缓解 |
| :--- | :--- | :--- | :--- | :--- |
| R1 | 观察传播过泛（人人知道）破坏信息不对称 | 中 | 高 | 传播受 visibilityScope 约束 + 现场共现限定；泄漏即证伪（H-W2.3） |
| R2 | 广播引入重放不一致（认知账本顺序错位） | 低 | 高 | 传播走确定性 `pushKnownFact` + 确定性观察记录；全量重放测试兜底 |
| R3 | 秘密短语表过拟合 / 漏配 | 中 | 中 | 表来自 `spyFamilyMin` 单一来源；affordanceContract 风格防漏配测试 |
| R4 | 范围蔓延到认知模型 / P1 打磨 | 中 | 中 | §5 明确不做；主线只推 W2.3，P1 默认延后 |

---

## 7. 提交门禁与校准问题（提交前询问，用户规则）

1. **Q1 观察闭环范围**：本阶段做"reveal_fact 广播 + 公开话语披露"双触发（推荐）/ 只做 reveal 广播，话语披露延至 W3？
2. **Q2 秘密短语表位置**：`spyFamilyMin` 单一来源 + App 注入 resolver（推荐）/ 直接写死在 kernel2Options 调用处？
3. **Q3 前提测试组织**：独立 `preconditionWorld.ts` 夹具 + `kernel2.preconditions.test.ts`（推荐）/ 并入现有 kernel2.test.ts？
4. **Q4 提交粒度与 P1 顺手项**：W2 整体 1 commit + 不含 P1 项（推荐）/ 拆 2 commit（观察闭环 / 测试+持久化）/ 顺带修"New World 重置无确认"？
5. **Q5 顺带修 B9 式小修**：本阶段是否顺带修复走查遗留的可访问性/重复导航（P2/P1 小项）？默认不修，留 W4。

---

## 8. 涉及文件清单

| 文件 | 变更 |
|---|---|
| `src/world/runtime/kernel2.ts` | W2.3：`propagateFactToCoPresent` + reveal_fact/speech_act 接线 + `discloseFactResolver` 选项 |
| `src/world/runtime/kernel2.observation.test.ts` | W2.3 新增测试 |
| `src/world/spyFamily/spyFamilyMin.ts` | W2.3：`SPY_FAMILY_SECRET_UTTERANCES` 短语表 |
| `src/app/App.tsx` | W2.3：注入 `discloseFactResolver`（+ Q4 若定案则加 New World 重置确认） |
| `src/world/runtime/preconditionWorld.ts` | W2.2 新增夹具世界 |
| `src/world/runtime/kernel2.preconditions.test.ts` | W2.2 新增测试 |
| `src/world/runtime/persistence.test.ts` | W2.4 新增 round-trip 测试 |
| `docs/W2_REST_PLAN.md` | 本文档 |

---

## 9. W3 前瞻（本阶段结束后）

- LLM 提议意图解析（第一提议者，确定性为回退）；
- 场景状态机（对话/日常/探索/世界编辑）；
- 一阶对话 + 代理循环最小版（感知→决策→候选事件→内核，投影隔离为硬要求）；
- W3 中点（约 09-17）部分学分门槛：Step 1/2/4/8/9 确定性路径可运行。
