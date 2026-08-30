# UX P0 修复方案（UX_P0_FIX_PLAN）

> 来源：三路并行 UX 审计（浏览器真实走查 11 步 / 代码级组件审查 / 启发式评估），2026-08-30。
> 本文档只覆盖 **P0 级**两项：入口如实化（P0-1）与死胡同清零（P0-2）。
> P1/P2 项另列于审计结论，不在本方案执行范围（除一处与 P0-2 强耦合的导演派发一致性，见 §B1）。

---

## 1. 目标与非目标

### 目标
1. **恢复信任**：所有入口（自定义提示词 / 3 预设卡 / 72 世界图集）不再"假装"会生成对应世界，如实标注当前为 SPY×FAMILY 内核演示。
2. **可点击即真实**：任何可点击的 affordance 必须二选一——要么命中真实内核行为，要么禁用并标注"W3 即将支持"。
3. **导演模式自洽**：修复"导演 overlay 显示导演 UI 但派发走玩家路径"的不一致（P0-2 的前置条件）。

### 非目标（明确不做）
- 不做真实自定义世界生成（W3：LLM 提议通道）。
- 不做 3 个预设/72 图集世界的真实数据接线（W3）。
- 不扩展角色模型（Yor/Anya 可玩视角 = P1-4，另期处理）。
- 不处理 P2 级改进（假遥测、可访问性、占位符长度等）。

---

## 1.5 前置核查结论（2026-08-30，方案定稿前完成）

1. **测试断言与 B9 兼容（安全，不会破坏现有测试）**：
   - `kernel2.test.ts:138` 断言 `r.reason` 含 `'不在伊甸学园走廊'` → 地点名（`requires_location` 拒绝路径，B9 不改此分支），非原始 ID。
   - `kernel2.test.ts:179` 断言 `r.reason` 含 `'这个秘密并没有对你开放'` → 知识类拒绝文案，非原始 ID。
   - `kernel2.test.ts:83` 断言 `eventChronicleLog.at(-1).description` 含 `'说'` → **B9 改 `buildDescription` 的 speech_act 分支时必须保留"说"字**（新格式 `{演员名} 对 {目标名} 说: "..."` 自然保留）。
   - 全仓库测试**无一处**断言 `char:spyf:*` 原始 ID 出现在拒绝消息或描述中 → B9 去内部化可放心实施。
2. **atlas 选择单一汇聚点**：`WorldAtlasExplorer.tsx` 的 `handleLaunchWorld`（L199-205）是唯一触发 `onSelectPromptForWorld` 的地方；App.tsx 两处传参（L368 / L515）均指向 `handleInitiatePrompt`。→ **A3 拦截注入 `handleLaunchWorld` 内部**（改为先弹诚实提示、确认后再走原路径），两处 App.tsx 调用点零改动。
3. **`kernel2Resolver.ts` 已具备兜底标记能力**：`resolveUserAction` 兜底分支 confidence=0.4 且 `resolution` 含"兜底：…"；`resolveDirectorAction` 已存在（L212）。→ B8 仅需在 App.tsx 消费 confidence；T1 可直接针对现有函数断言。

---

## 2. 变更设计（按文件）

### A. P0-1 入口如实化

#### A1. `src/components/world/EmptyPromptSpace.tsx`
- **主文案**：副标题改为诚实表述。建议：
  - 原：*"Give HeadConan an idea, scenario, role, or situation. A living interactive world and custom interface will form around your imagination."*
  - 新：*"输入任何想法即可进入 SPY×FAMILY 内核演示。自定义世界生成（W3）将按你的想象力构筑专属世界。"*
- **输入框下**增加一行 mono 说明（诚实、非侵入）：`当前版本：任意输入统一进入 SPY×FAMILY 内核演示；自定义世界生成将在 W3 提供。`
- **预设区**：
  - 区标题改为 `更多世界即将支持（W3）`；
  - 3 张预设卡保留视觉预览，但置为**禁用态**（`disabled` + `cursor-not-allowed` + 右上角 `W3` 徽标），点击不产生任何跳转；
  - 底部"Browse Atlas"按钮保留（浏览目录本身合法），图集内选择拦截见 A3。

#### A2. `src/components/world/WorldGenesisAnimation.tsx`
- **STAGES 文案**如实化（当前"Interpreting premise & user role..."是假的——提示词在 `handleInitiatePrompt` 后被丢弃）：
  - 原 4 段：Interpreting premise… / Constructing spatial… / Mapping factions… / Synthesizing generative UI blocks…
  - 新 4 段：`加载 SPY×FAMILY 世界定义…` / `实例化内核状态（角色·地点·事实）…` / `构建信息不对称投影与界面区块…` / `演示世界就绪`
- **时长**：内核实例化为同步操作（即时完成），动画与真实工作无关。缩短总时长至约 1.2s（保留"告知感"，但不再假装在做生成）。

#### A3. `src/components/atlas/WorldAtlasExplorer.tsx`
- 选中任一世界 → **不再直接** `onSelectPromptForWorld(prompt)` → `handleInitiatePrompt`（当前全部导向 SPY×FAMILY）。
- 改为在 **`handleLaunchWorld`（L199-205）内部**注入拦截（唯一汇聚点，App.tsx L368/L515 零改动）：
  - 点击"Inhabit this world"→ 弹诚实提示 modal：`自定义世界生成将于 W3 上线。当前可将「{world}」作为灵感，进入 SPY×FAMILY 内核演示。`
  - 按钮：`进入演示`（→ 原路径，标注进入演示）/ `取消`。
- 实施时新增本地 state `pendingWorld`（暂存待确认世界），确认后再调用 `onSelectPromptForWorld`。

---

### B. P0-2 死胡同清零

#### B1. 导演派发一致性（P0-2 前置，原 P1-3 的一半）
- `src/app/App.tsx` `handleDispatchAction`（L270）：
  - 原：`const isDirector = observerEntityId === null;`
  - 新：`const isDirector = observerEntityId === null || isDirectorOverlayOpen;`
- **理由**：`DirectorConsoleBlock` 在 overlay 开启时即渲染；若派发仍走玩家路径，B2 的真实注入按钮在 overlay 下依然失效。统一后 **overlay 开启 = 导演模式**（UI 与派发一致）。
- **行为影响（需用户确认，见校准 Q3）**：overlay 开启时，底部 ActionDock 的输入也走导演解析（当前已显示导演指令 chips），此为导演模式的合理语义。

#### B2. `src/components/blocks/DirectorConsoleBlock.tsx`
- **Spawn 页**：4 个假干预（Sector Blackout / Leaked Cable / Border Skirmish / Reveal Secret Location）替换为 **4 条真实可用的「注入秘密」指令**（经 `resolveDirectorAction` 的事实关键词命中，走 reveal_fact）：

  | 按钮标题 | 派发文本（onAction 参数） | 命中的内核事件 |
  |---|---|---|
  | 透露约尔的秘密 | `把约尔的秘密透露给洛德` | reveal `factYorAssassin` → loid |
  | 揭示钢笔窃听 | `让洛德知道钢笔是窃听器` | reveal `factPenSurveillance` → loid |
  | 透露安雅读心 | `把安雅的读心秘密透露给约尔` | reveal `factAnyaTelepath` → yor |
  | 揭示洛德身份 | `把洛德是间谍的秘密透露给安雅` | reveal `factLoidTwilight` → anya |

  - 移除 `[DIRECTOR INTERVENTION]` / `[DIRECTOR OVERRIDE]` 前缀，直接派发中文指令本身。
- **Factions / Rules 页签**：无内核实现 → 页签内所有变更按钮（Antagonize / Appease / Modify Rule）置**禁用态 + `W3` 徽标**；页签本身保留（世界数据可视化有价值）。
- **输入框 placeholder** 改为真实可用的例子：`把约尔的秘密透露给洛德`。

#### B3. 导演 ActionDock chips（`src/interface/director.ts` + `src/components/layout/ActionDock.tsx`）
- `computeUIPlan` L160-166 的 4 条**英文导演指令**替换为 B2 同一组 4 条真实指令（`Spawn an unexpected crisis...` 等全部是死胡同）。
- **单一来源**：在 `src/world/spyFamily/spyFamilyMin.ts`（或新常量文件）导出 `DIRECTOR_REVEAL_DIRECTIVES: string[]`，B2 与 B3 共用，避免双处漂移。

#### B4. `src/components/blocks/CharacterBlock.tsx`
- **Interrogate X**：模板改为真实可解析的中文提问（命中解析规则 9：目标别名 + 问）：
  - 原：`Summon {name} for a private audience regarding their loyalties...`（兜底为"说英文"）
  - 新：`问{shortName}：你最近在忙什么？`（`shortName` = 角色名首词，如"约尔"）
- **Audit Secret Communications**：无内核支持 → 禁用 + `W3` 徽标。

#### B5. `src/components/blocks/MapBlock.tsx`
- **Survey X**：改为真实移动（命中解析规则 2 travel）：
  - 原：`Dispatch an investigative detachment to {loc}`（兜底成"对地点说话"）
  - 新：`前往{location 名}`（如"前往伊甸学园走廊"）
- **Reinforce Sector**：无内核支持 → 禁用 + `W3` 徽标。

#### B6. `src/components/blocks/EventBlock.tsx`
- **Dispatch Response Directive**：`world.events` 来自 `recentEvents`（内核条目），无通用"回应警报"内核行为。
- 处理：**移除该按钮**（面板变只读 ticker，最诚实）；若实施时发现 events 含可映射角色，则改为 `问{角色}：关于「{title}」…`。**默认移除**。

#### B7. `src/components/world/NotesDrawer.tsx`
- **Translate into active action**：不再包裹 `Act upon recorded deduction: "..."`（兜底死胡同）。
- 改为**直接以笔记内容作为动作文本**发送（用户自己写的中文自然语言走正常解析；可命中即真实，否则走 B8 的诚实兜底标注）。

#### B8. 兜底透明度（`src/world/runtime/kernel2Resolver.ts` + `src/app/App.tsx`）
- `resolveUserAction` 已返回 `confidence` 与 `resolution`（兜底分支为 confidence 0.4，`resolution` 含"兜底：…"）。
- `App.tsx` player 分支组装叙事时：若 `resolved.confidence < 0.85`，在叙事前追加一行说明：`（未识别为具体指令，已当作对约尔的一句闲聊）`。
- 目的：用户不再误以为任意输入都"成功执行"了指令。

#### B9. [顺带，1 级小修] 拒绝/日志消息去内部化（原 P1-5）
- 现状：走查实录 `REJECTED: 共现前提不满足：char:spyf:loid_forger 与 char:spyf:yor_forger 不在同一地点。`——原始实体 ID 泄漏到用户界面。
- 改动点（`src/world/runtime/kernel2.ts`）：
  - 新增局部 `entityName(world, id)` helper（复用 legacyAdapter 同款逻辑，就近实现，不引新依赖；fallback 回原 ID）；
  - `action` 资格拒绝（L282）与 `speech_act` 共现拒绝（L332）中的 `${event.actorId}` / `${targetId}` → `entityName(...)`；
  - `buildDescription`（L417-430）：action（L421）、speech_act（L424）、reveal_fact（L427）三条描述里的原始 ID → 角色名。
    - **约束**：speech_act 描述必须保留"说"字（`kernel2.test.ts:83` 断言 `toContain('说')`）；新格式 `{演员名} 对 {目标名} 说: "..."` 自然满足。
- **范围限定**：仅 kernel2 的 L282 / L332 / buildDescription 三处 + `entityName` helper；不动其它日志格式与测试数据。

---

## 3. 测试与验收

### T1. 新增 `src/world/runtime/kernel2Resolver.test.ts`
- 4 条导演指令 → 断言 `resolveDirectorAction` 返回对应 `reveal_fact`（factId + targetId）。
- `问约尔：你最近在忙什么？` → 规则 9 ask，confidence ≥ 0.85。
- `前往伊甸学园走廊` → travel。
- 无意义输入 → 兜底分支，confidence < 0.85。

### T2. 新增 `src/world/runtime/affordanceContract.test.ts`（P0-2 防回归契约）
- 收集**全部可点击 affordance 模板**：导演指令 ×4、CharacterBlock ×2、MapBlock ×2、EventBlock ×1、NotesDrawer ×1。
- 断言：每条模板经 `resolveUserAction` / `resolveDirectorAction` 后，要么 **confidence ≥ 0.85 且事件类型符合预期**，要么处于**禁用清单**（与 `W3` 徽标项一一对应）。
- 目的：任何新增按钮必须二选一（真实 or 禁用），自动守护 P0-2。

### T3. 现有测试 + 类型
- `vitest run`：kernel2 / scheduler / instantiate / p0 全绿。
- `tsc --noEmit`：0 错误。

### T4. 手动验收清单（浏览器）
- [ ] 三入口（自定义提示词 / 预设卡 / 图集）→ 呈现诚实提示，最终进入演示世界
- [ ] 导演 overlay 与导演角色两条路径 → 4 条注入均产生真实叙事（`事实「…」注入 洛德 的认知`，无原始 ID）
- [ ] Character 提问 / Map 前往 → 真实动作叙事；Audit / Reinforce / Factions / Rules 按钮置灰带 `W3`
- [ ] 无意义输入 → 出现兜底标注行
- [ ] 刷新 → 会话恢复不受影响

---

## 4. 提交门禁（遵守用户规则：提交前完整 TSC + 校准问题）

1. `tsc --noEmit` 全绿；
2. `vitest run` 全绿（含新增 T1/T2）；
3. 提交前向用户提出校准问题（见 §5），校准后提交；
4. 提交粒度见校准 Q4（建议 A / B 两个 commit，便于回滚）。

---

## 5. 校准问题（提交前询问，遵守用户规则）

- **Q1 预设卡与图集处理**：禁用 + `W3` 徽标（推荐）/ 保留点击 + 弹"即将支持"提示 / 直接移除？
- **Q2 导演 Spawn 页**：替换为 4 条真实"注入秘密"指令（推荐）/ 整体禁用？
- **Q3 导演 overlay 语义**：overlay 开启 = 全导演模式（UI+派发统一，推荐）/ 保持现状（overlay 仅影响 UI，派发仍走玩家）？
- **Q4 提交粒度**：A（入口如实化）/ B（死胡同清零）两个 commit / 单 commit？
- **Q5 本次是否顺带修 B9**（拒绝消息去内部化）？还是严格只做 P0 主体？

---

## 6. 涉及文件清单

| 文件 | 变更 |
|---|---|
| `src/app/App.tsx` | B1 导演派发统一；B8 兜底标注 |
| `src/components/world/EmptyPromptSpace.tsx` | A1 文案 + 预设禁用 |
| `src/components/world/WorldGenesisAnimation.tsx` | A2 文案 + 时长 |
| `src/components/atlas/WorldAtlasExplorer.tsx` | A3 选择拦截提示 |
| `src/components/blocks/DirectorConsoleBlock.tsx` | B2 真实指令 + 页签禁用 |
| `src/interface/director.ts` | B3 导演 chips 换真指令 |
| `src/components/layout/ActionDock.tsx` | B3（如涉及 chips 展示） |
| `src/world/spyFamily/spyFamilyMin.ts` | B3 `DIRECTOR_REVEAL_DIRECTIVES` 常量 |
| `src/components/blocks/CharacterBlock.tsx` | B4 |
| `src/components/blocks/MapBlock.tsx` | B5 |
| `src/components/blocks/EventBlock.tsx` | B6 |
| `src/components/world/NotesDrawer.tsx` | B7 |
| `src/world/runtime/kernel2Resolver.ts` | B8（如需暴露兜底标记） |
| `src/world/runtime/kernel2.ts` | B9 去内部化 |
| `src/world/runtime/kernel2Resolver.test.ts` | T1 新增 |
| `src/world/runtime/affordanceContract.test.ts` | T2 新增 |
