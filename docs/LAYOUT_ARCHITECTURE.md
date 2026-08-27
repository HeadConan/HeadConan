# HeadConan 布局架构（LAYOUT_ARCHITECTURE）

> 前置阅读：`docs/LAYOUT_RESEARCH.md`（14 问研究）、`docs/LAYOUT_GRAMMAR.md`（5 空间原语）、`docs/PRESENTATION_MODEL.md`、`docs/layout/*`（6 场景布局分析）。本文件把这些设计资产**收敛为可实现的架构**，并补上缺失的关键抽象：**焦点（Focus）**。

---

## 1. 结论：动态信息空间，不是屏幕集合

> **HeadConan 不是「有很多屏幕的应用」，而是「围绕当前活动持续重组的动态信息空间」。**

推理链（压缩自 LAYOUT_RESEARCH）：
1. 世界的相关性是**动态**的：审讯时，嫌疑人微表情占 95% 的现实，全球经济是 0%；边境危机时正好相反。
2. 「屏幕」强迫用户离开当前现实去「导航到地图页」——摧毁沉浸感与工作记忆。
3. 固定网格（3 列卡片）让每个卡片同时争夺注意力——把戏剧变成表格。

因此布局必须由**当前焦点 + 当前活动 + 角色透镜**驱动，而非由预定义的页面驱动。

---

## 2. 呈现流水线（从状态到像素）

```
WORLD STATE（真理）
    │
    ▼
认知投影（观察者视图：玩家/主持人/代理）
    │
    ▼
SIGNIFICANCE（什么此刻重要）
    · 焦点对象（FOCUS：实体/地点/事件/文档）
    · 显著事件（高戏剧性/高紧迫/高变化）
    · 张力与不确定性指标
    │
    ▼
EXPERIENCE STATE（体验状态）
    · focusEntityId · activeActivity · 显著增量 · 环境指标 · 基调
    │
    ▼
PRESENTATION PLAN（呈现计划）
    · stageMode: dialogue|spatial|investigation|strategy|editor
    · satellite 内容：与焦点直接相连的实体/线索/文档
    · ambient 指标：世界稳定度/压力/倒计时
    · dock 词条：与活动匹配的动作建议
    · 世界基调：tokens/排版/氛围（来自 ExperienceProfile）
    │
    ▼
LAYOUT ENGINE（布局引擎）
    · 5 原语编排（Anchor/Stage/Satellite/Ambient/Dock）
    · FLIP 过渡（元素变形/停靠/淡出，不闪跳）
    │
    ▼
RENDER（Block 注册表 + 世界主题）
```

---

## 3. 最小布局语法（5 原语 + 焦点）

### 3.1 原语（既有设计，确认采用）

| 原语 | 职责 | 不变性 |
| :--- | :--- | :--- |
| **Anchor** | 顶部：世界身份、时钟/回合、角色徽章、全局模态入口 | 恒定 |
| **Stage** | 主舞台：对话/空间/证据板/策略矩阵/编辑器的五种形态 | 动态（随焦点切换） |
| **Satellite** | 上下文轨道：与焦点直接相连的检查器内容 | 动态（随焦点过滤） |
| **Ambient** | 宏观环境指标：稳定度/压力/倒计时 | 静默（可收缩为徽章） |
| **Dock** | 底部动作通道：输入 + 词条 + 引擎指示 | 恒定 |

### 3.2 缺失的抽象：Focus（焦点）

原语之间需要**一个显式的中心对象**把「当前注意力」从「屏幕状态」中分离出来：

```
interface Focus {
  type: 'entity' | 'location' | 'event' | 'document' | 'relationship' | 'group' | 'world';
  targetId: string;
  confidence: number;        // 焦点清晰度
  origin: 'user_selected' | 'significance_computed' | 'crisis_forced' | 'activity_inferred';
  activity: string;          // 当前活动：interrogate | investigate | command | converse | edit | observe
  sticky: boolean;           // 用户是否锁定焦点（防自动跳变，见 OPEN_UX_QUESTIONS Q1）
}
```

**Stage 形态由 Focus 决定**：焦点是「人」→ `dialogue` 或 `dossier`；焦点是「地点」→ `spatial`；焦点是「证据」→ `investigation`；焦点是「派系」→ `strategy`；焦点是「规则」→ `editor`。

**Satellite 内容由 Focus 过滤**：只显示与 `focus.targetId` 有直接关系/空间/因果边的内容。

**Focus 的来源优先级**：`crisis_forced` > `user_selected`（含 sticky 锁定）> `significance_computed` > `activity_inferred`。

### 3.3 注意力打分（FocusScore，规范化公式）

沿用 LAYOUT_RESEARCH Q5 的四因子打分，参数由世界定义的 ExperienceProfile 标定：

```
FocusScore(S) = w1·UserIntent(S) + w2·ActivityWeight(S) + w3·SimulationUrgency(S) + w4·RoleAffordance(S)
```

- `w1..w4` 由定义侧 `ExperienceProfile`（如 consequenceLethality 高 → w3 升权）与运行时上下文调节。
- 每个候选焦点输出分数 → 取最高者（或并列展示）。
- 关键性质：**可解释**——呈现层/调试台能看到「为什么是这个焦点」。

---

## 4. 世界专属 UI 归属（WORLD-SPECIFIC UI）

**原则**：世界声明「什么模态重要」，体验服务决定「现在用什么模态」，呈现层决定「怎么摆」。**三层都不得硬编码世界专属界面。**

| 世界 | ExperienceProfile 信号（定义侧） | 体验服务产出的默认舞台 | 呈现层实际表现 |
| :--- | :--- | :--- | :--- |
| SPY×FAMILY | `recommendedModalities: [dialogue_focused, relationship_web_graph]`；informationAsymmetry 5 | dialogue + 卫星显示潜台词/秘密徽章 | 对话舞台 + 关系轨道 + 家庭/学校环境 |
| GoT | `[territorial_tactical_map, dossier_matrix]`；consequenceLethality 5 | strategy/spatial | 地图舞台 + 派系账本卫星 + 稳定度环境 |
| Sherlock | `[forensic_evidence_board]`；investigativeDepth 5 | investigation | 证据板舞台 + 嫌疑人/展品卫星 + 可解性环境 |
| 大学 | `[academic_schedule_timeline, relationship_web_graph]`；socialDensity 4 | editor(dialogue)/spatial | 日程舞台 + 同学网络卫星 + 压力/经费环境 |

**落地机制**：
1. 定义侧 `ExperienceProfile.recommendedModalities`（已有）→ 决定**默认舞台形态**与**世界主题**（tokens/排版）。
2. 运行侧 `Focus.activity` → 决定**瞬时舞台形态**（优先级高于默认）。
3. Block 注册表（已有 `UI_CAPABILITY_REGISTRY` 模式）映射「数据形态→渲染器」，**共享**而非世界专属；世界差异只通过主题与数据组合表达。
4. 禁止 `world.id === 'spy-family'` 这类条件渲染分支。

---

## 5. 布局引擎规格（LAYOUT ENGINE）

### 5.1 输入/输出

| 输入 | 输出 |
| :--- | :--- |
| PresentationPlan + Focus + 投影视图 + 世界主题 | 原语组合的布局树（可序列化），供渲染器实例化 |

### 5.2 核心行为

1. **组成**：从 5 原语 + 焦点推导出布局树（Stage 模式、Satellite 可见性与内容、Ambient 指标集、Dock 词条、Anchor 状态）。
2. **过渡**：FLIP——从旧布局到新布局，元素「变形/停靠/淡出」，禁止闪跳。焦点变化时旧舞台收缩进卫星，新舞台从焦点位置展开。
3. **锁止**：`Focus.sticky`（用户锁定的布局/焦点）优先于自动形态切换；仅内容更新，形态不变。
4. **移动端降级**：卫星折叠为抽屉/底栏（继承 OPEN_UX_QUESTIONS Q4 的张力，先做结构化响应式，不做无限画布）。
5. **可序列化**：布局树是数据（`LayoutPlan`），渲染器只是解释器——这保证未来换渲染栈（native/VR）不动体验层。

### 5.3 场景→布局矩阵（六场景，来自 docs/layout/*）

| 场景 | Stage | Satellite | Ambient | Dock 词条 |
| :--- | :--- | :--- | :--- | :--- |
| 对话/审讯 | dialogue | 目标档案+潜台词 | 关系张力 | 赞美/质问/转移话题 |
| 空间探索 | spatial | 地点细节+在场实体 | 危险/天气/时刻 | 移动/侦察/扎营 |
| 法证调查 | investigation | 展品细节+不在场证明 | 可解性/倒计时 | 化验/审讯/出示证据 |
| 地缘战略 | strategy | 派系外交账本 | 稳定度/债务/粮储 | 禁运/召开会议/暗杀授权 |
| 校园日常 | editor(dialogue) | 同学网络+导师反馈 | 经费/压力/任期 | 提交论文/对质/参加研讨 |
| 主持人/建筑师 | editor | 本体图+实体深度检查器 | 不变量健康/延迟 | 触发危机/变更公理/揭示血统 |

---

## 6. 与现有资产的承接

| 现有资产 | 去留 | 用途 |
| :--- | :--- | :--- |
| `docs/LAYOUT_GRAMMAR.md` 5 原语 | ✅ 保留 | 布局引擎的原语规范 |
| `docs/LAYOUT_RESEARCH.md` 14 问 | ✅ 保留 | 设计依据（含 FocusScore 公式） |
| `docs/layout/*` 六场景 | ✅ 保留 | 布局矩阵的规格来源 |
| `docs/PRESENTATION_MODEL.md` | ✅ 保留（补 Focus） | 呈现计划类型草案 |
| `src/ui/renderer.tsx` 3 列网格 | ❌ 替换 | 布局引擎接管 |
| `src/interface/director.ts` 规则树 | ❌ 替换 | 体验服务的显著性计算接管 |
| `UI_CAPABILITY_REGISTRY` | ✅ 演进 | 保留「数据形态→渲染器」映射模式，Block 改为原语内的表面 |
