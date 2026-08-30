/**
 * HEADCONAN — 定义驱动内核（kernel2）确定性意图解析器（W1）
 *
 * 与 p0 resolver（runtime/resolver.ts）同构：用户自然语言 → 候选 KernelEvent。
 * 区别：针对 SPY×FAMILY 最小定义 + kernel2 事件类型（action / speech_act / reveal_fact），
 * 且支持顺序规划（如"检查钢笔"自动先"前往走廊"）。
 *
 * 设计（docs/EXECUTION_PLAN.md §1.3 / §6）：
 *   - 确定性解析器是测试/离线路径 + LLM 不可用时的自动回退；
 *     W3 的 LLM 提议通道共享同一 resolve → candidate → validate → applyEvent 接口。
 *   - 解析器只"提议"，一切写入由内核判定（拒绝即事件）。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { WorldStateInstance } from '../representation/types/state';
import type { EntityId } from '../representation/types/primitives';
import type { KernelEvent, SpeechIntentTag } from './kernel2';
import type { SceneIntentHint } from './scene';
import { SPYF } from '../spyFamily/spyFamilyMin';

export interface ResolvedKernelAction {
  events: KernelEvent[];
  /** 解析可信度（0-1）；规则命中 = 1，兜底 = 0.4 */
  confidence: number;
  /** 人类可读的解析说明（供调试与澄清反馈） */
  resolution: string;
  /** 无需内核写入的提示（如导演通道的未支持说明） */
  notice?: string;
  /** W3.1：场景切换意图（travel→exploration / talk→conversation / inspect→exploration） */
  sceneHint?: SceneIntentHint;
}

export interface ResolvedDirectorAction {
  event?: KernelEvent;
  notice?: string;
}

// ---------------------------------------------------------------------------
// 实体 / 地点解析（在文本中按别名找出目标）
// ---------------------------------------------------------------------------

interface NamedEntity {
  id: string;
  aliases: string[];
}

const KNOWN_CHARACTERS: NamedEntity[] = [
  { id: SPYF.loid, aliases: ['loid', '洛德', '黄昏', 'twilight', '老公', '爸爸', 'loid forger'] },
  { id: SPYF.yor, aliases: ['yor', '约尔', '约尔福杰', '妻子', '老婆', '妈妈', 'thorns', '荆棘公主'] },
  { id: SPYF.anya, aliases: ['anya', '安雅', '阿尼亚', '女儿', '小狗'] },
  { id: SPYF.damian, aliases: ['damian', '达米安', '德斯蒙德'] },
  { id: SPYF.mrSmith, aliases: ['smith', '史密斯', '史密斯老师'] },
  { id: SPYF.becky, aliases: ['becky', '贝琪', '布莱克贝尔'] },
  { id: SPYF.bond, aliases: ['bond', '邦德', '大狗狗'] },
  { id: SPYF.headmaster, aliases: ['headmaster', '校长'] },
];

const KNOWN_LOCATIONS: NamedEntity[] = [
  { id: SPYF.living, aliases: ['客厅', '家里', '回家', 'living', 'home'] },
  { id: SPYF.street, aliases: ['街道', '街上', '通勤街道', 'street'] },
  { id: SPYF.corridor, aliases: ['走廊', '学园', '伊甸', 'corridor', 'eden'] },
  { id: SPYF.infirmary, aliases: ['医务室', 'infirmary'] },
];

function resolveTarget(text: string, table: NamedEntity[]): string | undefined {
  const lower = text.toLowerCase();
  for (const e of table) {
    if (e.aliases.some(a => lower.includes(a.toLowerCase()))) return e.id;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// 玩家解析（有序规则：specific → generic）
// ---------------------------------------------------------------------------

export function resolveUserAction(
  text: string,
  worldDef: WorldDefinition,
  actorId: EntityId,
  state?: WorldStateInstance,
  /** W3.3：显式对话目标（点击角色卡片注入）；文本指名优先于显式目标 */
  explicitTargetId?: EntityId
): ResolvedKernelAction {
  const textTarget = resolveTarget(text, KNOWN_CHARACTERS);
  const targetId = textTarget ?? explicitTargetId ?? SPYF.yor;
  const lower = text.toLowerCase();

  // 1. 检查钢笔（Step 8）—— 若不在走廊，自动规划"先前往走廊"
  if (/(检查钢笔|检查.*笔|钢笔|inspect.*pen|pen)/i.test(lower)) {
    const events: KernelEvent[] = [];
    const atCorridor =
      state?.entityStates[actorId]?.currentLocationId === SPYF.corridor;
    if (!atCorridor) {
      events.push({
        type: 'action',
        actionId: 'act:spyf:travel',
        actorId,
        targetIds: [SPYF.corridor],
      });
    }
    events.push({ type: 'action', actionId: 'act:spyf:inspect_pen', actorId, targetIds: [SPYF.pen] });
    return {
      events,
      confidence: 1,
      resolution: `意图=检查钢笔（${atCorridor ? '已在走廊' : '先前往走廊'}）。`,
      sceneHint: { type: 'inspect' },
    };
  }

  // 2. 移动/前往（「去」后接「哪」为提问而非移动，如「你昨晚去哪了？」）
  if (/(前往|走到|移动到|travel|move to|go to|去(?!哪))/i.test(lower)) {
    const loc = resolveTarget(lower, KNOWN_LOCATIONS) ?? SPYF.living;
    return {
      events: [{ type: 'action', actionId: 'act:spyf:travel', actorId, targetIds: [loc] }],
      confidence: 1,
      resolution: `意图=前往 ${loc}。`,
      sceneHint: { type: 'travel', targetId: loc },
    };
  }

  // 3. 错过家长会（Step 9）
  if (/(错过家长会|缺席家长会|不去家长会|miss.*(meeting|parent))/i.test(lower)) {
    return {
      events: [{ type: 'action', actionId: 'act:spyf:miss_parent_meeting', actorId, targetIds: [] }],
      confidence: 1,
      resolution: `意图=错过家长会（确定性级联）。`,
    };
  }

  // 4. 摊牌 / 质问（信息不对称强制：不知道秘密会被内核拒绝）
  if (/(摊牌|质问|指控|你就是.*杀手|confront|accuse|i know you)/i.test(lower)) {
    return {
      events: [{ type: 'action', actionId: 'act:spyf:confront', actorId, targetIds: [targetId] }],
      confidence: 1,
      resolution: `意图=摊牌，目标=${targetId}。`,
      sceneHint: { type: 'talk', targetId },
    };
  }

  // 5. 坦白身份（把间谍身份注入目标认知）
  if (/(坦白|我是间谍|我是.*(黄昏|twilight)|reveal.*(identity|spy)|confess)/i.test(lower)) {
    return {
      events: [{ type: 'action', actionId: 'act:spyf:reveal_identity', actorId, targetIds: [targetId] }],
      confidence: 0.95,
      resolution: `意图=坦白身份，目标=${targetId}。`,
      sceneHint: { type: 'talk', targetId },
    };
  }

  // 6. 询问昨晚去向（Step 2 的怀疑种子）
  if (/(昨晚|昨天晚上|昨晚去哪|昨晚.*(去哪|干什么)|last night|where were you)/i.test(lower)) {
    return {
      events: [
        {
          type: 'speech_act',
          actorId,
          targetIds: [targetId],
          utterance: text,
          intentTag: 'ask',
          topic: 'last night',
        },
      ],
      confidence: 1,
      resolution: `意图=询问昨晚去向，目标=${targetId}。`,
      sceneHint: { type: 'talk', targetId },
    };
  }

  // 7. 夸奖
  if (/(夸|夸奖|真好看|真棒|温柔|贤惠|谢谢|compliment|thank|nice|beautiful)/i.test(lower)) {
    return {
      events: [
        { type: 'speech_act', actorId, targetIds: [targetId], utterance: text, intentTag: 'compliment' },
      ],
      confidence: 0.9,
      resolution: `意图=夸奖，目标=${targetId}。`,
      sceneHint: { type: 'talk', targetId },
    };
  }

  // 8. 问学校 / 老师（Step 4，安雅会带出史密斯老师的线索）
  if (/(学校|学园|同学|老师|school|eden|teacher|史密斯)/i.test(lower) && targetId === SPYF.anya) {
    return {
      events: [
        { type: 'speech_act', actorId, targetIds: [SPYF.anya], utterance: text, intentTag: 'ask', topic: 'school' },
      ],
      confidence: 0.95,
      resolution: `意图=询问安雅学校情况。`,
      sceneHint: { type: 'talk', targetId: SPYF.anya },
    };
  }

  // 9. 明确指名目标的提问
  if (targetId && /(问|怎么样|怎么|好吗|呢|在哪|在吗|ask|how|where|what|tell)/i.test(lower)) {
    return {
      events: [
        { type: 'speech_act', actorId, targetIds: [targetId], utterance: text, intentTag: 'ask' },
      ],
      confidence: 0.85,
      resolution: `意图=向 ${targetId} 提问。`,
      sceneHint: { type: 'talk', targetId },
    };
  }

  // 10. 兜底：对在场者说的一句话
  return {
    events: [
      {
        type: 'speech_act',
        actorId,
        targetIds: [targetId],
        utterance: text,
        intentTag: 'say',
      },
    ],
    confidence: 0.4,
    resolution: `兜底：视为对 ${targetId} 说的一句话。`,
    sceneHint: { type: 'talk', targetId },
  };
}

// ---------------------------------------------------------------------------
// 导演解析（全知主持人；W1 仅支持 reveal_fact 注入）
// ---------------------------------------------------------------------------

/** 解析导演指令的揭示目标：优先语法位置（"透露给 Y" / "让 Y 知道"），回退全文本 */
function resolveDirectorTarget(text: string): EntityId | undefined {
  const revealTo = text.match(/透露给\s*([^，。！？\s]+)/);
  if (revealTo) return resolveTarget(revealTo[1], KNOWN_CHARACTERS);
  const letKnow = text.match(/让\s*([^，。！？\s]+?)\s*知道/);
  if (letKnow) return resolveTarget(letKnow[1], KNOWN_CHARACTERS);
  const giveTo = text.match(/给\s*([^，。！？\s]+)/);
  if (giveTo) return resolveTarget(giveTo[1], KNOWN_CHARACTERS);
  return resolveTarget(text, KNOWN_CHARACTERS);
}

/** 剔除目标角色名的别名，避免"让洛德知道钢笔是窃听器"误匹配洛德身份事实 */
function stripTargetAliases(text: string, targetId: EntityId | undefined): string {
  if (!targetId) return text;
  const target = KNOWN_CHARACTERS.find(c => c.id === targetId);
  if (!target) return text;
  return target.aliases.reduce((acc, a) => acc.split(a.toLowerCase()).join(''), text);
}

export function resolveDirectorAction(text: string, worldDef: WorldDefinition): ResolvedDirectorAction {
  const lower = text.toLowerCase();

  // 目标：reveal 到谁？（语法优先，回退默认玩家=洛德）
  const targetId = resolveDirectorTarget(lower) ?? SPYF.loid;

  // 事实匹配：先剔除目标角色名，避免目标名被误判为事实关键词
  const factText = stripTargetAliases(lower, targetId);
  const factMatch: Array<[RegExp, string]> = [
    [/(约尔|yor|杀手|荆棘)/i, SPYF.factYorAssassin],
    [/(洛德|loid|黄昏|twilight|间谍)/i, SPYF.factLoidTwilight],
    [/(安雅|anya|读心|超能力)/i, SPYF.factAnyaTelepath],
    [/(钢笔|pen|窃听)/i, SPYF.factPenSurveillance],
    [/(伪装家庭|fake family)/i, SPYF.factFakeFamily],
  ];
  const matched = factMatch.find(([re]) => re.test(factText));

  if (/(reveal|注入|透露|揭晓|让.*知道|泄露|declassify)/i.test(lower) && matched) {
    return {
      event: { type: 'reveal_fact', actorId: undefined, targetId, factId: matched[1], source: 'host' },
    };
  }

  if (matched) {
    return {
      event: { type: 'reveal_fact', actorId: undefined, targetId, factId: matched[1], source: 'host' },
    };
  }

  return {
    notice:
      '导演通道（W1 最小版）：支持把秘密注入认知，例如「把约尔的秘密透露给洛德」「让洛德知道钢笔是窃听器」。其余叙事写入将在 W2/W3 提供。',
  };
}
