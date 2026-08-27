/**
 * HEADCONAN P0 — 确定性意图解析器（用户自然语言 → 候选事件）
 *
 * P0 范围：无 LLM 时也能跑通垂直切片。解析器是**确定性规则集**，
 * 接口（resolveUserAction）设计为后续可被「LLM 提议 + 确定性校验」替换（ADR-12）。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { KernelEvent, SpeechIntentTag } from './kernel';
import { P0_ENTITIES, P0_FACTS } from '../p0/world';

export interface ResolvedAction {
  event: KernelEvent;
  /** 解析可信度（0-1）；P0 规则命中 = 1，默认兜底 = 0.4 */
  confidence: number;
  /** 人类可读的解析说明（供调试与澄清反馈） */
  resolution: string;
}

// ---------------------------------------------------------------------------
// 目标解析：在文本中找出角色
// ---------------------------------------------------------------------------

interface NamedEntity {
  id: string;
  aliases: string[];
}

const KNOWN_ENTITIES: NamedEntity[] = [
  { id: P0_ENTITIES.loid, aliases: ['loid', '洛德', '黄昏', 'twilight', '老公'] },
  { id: P0_ENTITIES.yor, aliases: ['yor', '约尔', '约尔福杰', '妻子', '老婆', 'thorns', '荆棘'] },
  { id: P0_ENTITIES.anya, aliases: ['anya', '阿尼亚', '女儿'] },
];

function resolveTarget(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const e of KNOWN_ENTITIES) {
    if (e.aliases.some(a => lower.includes(a.toLowerCase()))) return e.id;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// 意图解析（规则有序：specific → generic）
// ---------------------------------------------------------------------------

const RULES: Array<{
  test: (t: string) => boolean;
  build: (t: string, actorId: string, targetId: string | undefined) => { event: KernelEvent; confidence: number; resolution: string };
}> = [
  // 1. 摊牌/指控（秘密相关）—— 目标必须解析到
  {
    test: t => /(质问|指控|摊牌|你就是|我知道了|accuse|confront|i know you)/i.test(t) && /(刺客|杀手|assassin|thorn)/i.test(t),
    build: (t, actorId, targetId) => ({
      event: {
        type: 'confront_secret',
        actorId,
        targetId: targetId ?? P0_ENTITIES.yor,
        secretFactId: P0_FACTS.yor_is_assassin,
      },
      confidence: 1,
      resolution: `意图=摊牌秘密(fact:yor_is_assassin)，目标=${targetId ?? P0_ENTITIES.yor}。`,
    }),
  },
  // 2. 询问昨晚去向 —— 触发 Yor 的 cover 反应与怀疑上升
  {
    test: t => /(昨晚|昨天晚上|昨晚去哪|last night|where were you)/i.test(t),
    build: (t, actorId, targetId) => ({
      event: {
        type: 'speech_act',
        actorId,
        targetIds: [targetId ?? P0_ENTITIES.yor],
        utterance: t,
        intentTag: 'ask' as SpeechIntentTag,
        topic: 'last night',
      },
      confidence: 1,
      resolution: `意图=询问昨晚去向，目标=${targetId ?? P0_ENTITIES.yor}。`,
    }),
  },
  // 3. 夸奖
  {
    test: t => /(夸|谢谢|真棒|温柔|贤惠|compliment|thank|nice)/i.test(t),
    build: (t, actorId, targetId) => ({
      event: {
        type: 'speech_act',
        actorId,
        targetIds: [targetId ?? P0_ENTITIES.yor],
        utterance: t,
        intentTag: 'compliment' as SpeechIntentTag,
      },
      confidence: 0.9,
      resolution: `意图=夸奖，目标=${targetId ?? P0_ENTITIES.yor}。`,
    }),
  },
  // 4. 坦白（对 Yor 承认自己是间谍）
  {
    test: t => /(坦白|告诉你|我是间谍|我是|confess|i am)/i.test(t),
    build: (t, actorId, targetId) => ({
      event: {
        type: 'speech_act',
        actorId,
        targetIds: [targetId ?? P0_ENTITIES.yor],
        utterance: t,
        intentTag: 'confess' as SpeechIntentTag,
      },
      confidence: 0.9,
      resolution: `意图=坦白，目标=${targetId ?? P0_ENTITIES.yor}。`,
    }),
  },
];

// ---------------------------------------------------------------------------
// 入口
// ---------------------------------------------------------------------------

export function resolveUserAction(text: string, _world: WorldDefinition, actorId: string = P0_ENTITIES.loid): ResolvedAction {
  const targetId = resolveTarget(text);

  for (const rule of RULES) {
    if (rule.test(text)) return rule.build(text, actorId, targetId);
  }

  // 兜底：当作一句普通的话
  return {
    event: {
      type: 'speech_act',
      actorId,
      targetIds: targetId ? [targetId] : [P0_ENTITIES.yor],
      utterance: text,
      intentTag: 'say',
    },
    confidence: 0.4,
    resolution: `兜底：视为对 ${targetId ?? P0_ENTITIES.yor} 说的一句话。`,
  };
}
