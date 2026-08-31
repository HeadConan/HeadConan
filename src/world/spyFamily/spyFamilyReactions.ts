/**
 * HEADCONAN — SPY×FAMILY 运行时接线（W1）
 *
 * 职责：
 *   1. `spyFamilyRelationResolver`：actor→target 的关系定位（speech_act 意图增量的落点）。
 *   2. `spyFamilyRoleOf`：entityId → 角色（动作资格的判定）。
 *   3. `spyFamilyReaction`：W1 确定性脚本式语音反应（10 步脚本的 Step 2/4 节拍）。
 *      重要：W3 由代理循环接管（接口不变，仅替换实现）；当前脚本严格尊重投影隔离——
 *      约尔的回应绝不泄露"杀手"身份，安雅的回应绝不泄露"读心"能力。
 */

import type { EntityId } from '../representation/types/primitives';
import type { ReactionContext, SpeechReaction, KernelEvent } from '../runtime/kernel2';
import type { StateEffect } from '../representation/types/dynamics';
import type { AgentContext, NpcPerception } from '../runtime/agentLoop';
import { SPYF } from './spyFamilyMin';

// ---------------------------------------------------------------------------
// 关系解析
// ---------------------------------------------------------------------------

const RELATION_TABLE: Array<[EntityId, EntityId, string]> = [
  [SPYF.loid, SPYF.yor, SPYF.relMarriage],
  [SPYF.yor, SPYF.loid, SPYF.relMarriage],
  [SPYF.loid, SPYF.anya, SPYF.relLoidAnya],
  [SPYF.anya, SPYF.loid, SPYF.relLoidAnya],
  [SPYF.yor, SPYF.anya, SPYF.relYorAnya],
  [SPYF.anya, SPYF.yor, SPYF.relYorAnya],
  [SPYF.anya, SPYF.damian, SPYF.relAnyaDamian],
  [SPYF.damian, SPYF.anya, SPYF.relAnyaDamian],
];

export function spyFamilyRelationResolver(actor: EntityId, target: EntityId): string | undefined {
  return RELATION_TABLE.find(([a, t]) => a === actor && t === target)?.[2];
}

// ---------------------------------------------------------------------------
// 角色解析
// ---------------------------------------------------------------------------

const ROLE_TABLE: Record<EntityId, string[]> = {
  [SPYF.loid]: ['spy', 'player_loid', 'parent'],
  [SPYF.yor]: ['assassin', 'clerk'],
  [SPYF.anya]: ['telepath', 'student'],
  [SPYF.damian]: ['student'],
  [SPYF.mrSmith]: ['teacher'],
  [SPYF.becky]: ['student'],
  [SPYF.bond]: ['pet'],
  [SPYF.headmaster]: ['teacher'],
};

export function spyFamilyRoleOf(entityId: EntityId): string[] {
  return ROLE_TABLE[entityId] ?? [];
}

// ---------------------------------------------------------------------------
// 确定性反应脚本（W1；W3 由代理循环接管）
// ---------------------------------------------------------------------------

function entityEffect(targetId: EntityId, fieldKey: string, payload: unknown, narrativeDescription: string): StateEffect {
  return {
    targetDomain: 'entity',
    targetId,
    mutationType: 'set',
    fieldKey,
    payload,
    narrativeDescription,
  };
}

function dynamicEffect(targetId: EntityId, key: string, delta: number): StateEffect {
  return {
    targetDomain: 'entity',
    targetId,
    mutationType: 'increment',
    fieldKey: `dynamic.${key}`,
    payload: delta,
    narrativeDescription: `内心活动（${key} ${delta >= 0 ? '+' : ''}${delta}）。`,
  };
}

export function spyFamilyReaction(ctx: ReactionContext): SpeechReaction {
  const { event, state } = ctx;
  const targetId = event.targetIds[0];
  const text = event.utterance.toLowerCase();
  const isAboutLastNight = /(昨晚|昨天晚上|昨晚去哪|last night|where were you)/i.test(text);

  // --- 对约尔 ---
  if (targetId === SPYF.yor) {
    if (event.intentTag === 'ask' && isAboutLastNight) {
      return {
        effects: [
          entityEffect(SPYF.yor, 'emotionalState', '警觉（cover 反应）', '约尔神色微变，随即恢复。'),
          dynamicEffect(SPYF.loid, 'suspicionOfYor', 2),
        ],
        response: '去市政厅加班了，别担心。（她垂下目光，指尖无意识地摩挲茶杯边缘）',
      };
    }
    if (event.intentTag === 'compliment') {
      return {
        effects: [entityEffect(SPYF.yor, 'emotionalState', '温暖而意外', '约尔有些不好意思地笑了。')],
        response: '……谢谢。我只是做了分内的事。（她不太习惯被夸奖，微微别开脸）',
      };
    }
    return {
      effects: [entityEffect(SPYF.yor, 'emotionalState', '温和', '约尔停下动作，看着你。')],
      response: '嗯？怎么了？（她停下动作，看着你）',
    };
  }

  // --- 对安雅 ---
  if (targetId === SPYF.anya) {
    if (event.intentTag === 'ask' || event.intentTag === 'probe') {
      const aboutSchool = /(学校|学园|同学|老师|school|eden|teacher)/i.test(text);
      if (aboutSchool) {
        return {
          // 安雅想说史密斯老师"有问题"，但绝不会说出她为什么知道
          effects: [entityEffect(SPYF.anya, 'emotionalState', '得意而神秘', '安雅眨眨眼，像藏了个大秘密。')],
          response: '学校……还算有趣啦！不过新来的史密斯老师好像一直在偷偷看我们家呢——啊，没事没事！（她赶紧捂住嘴）',
        };
      }
      return {
        effects: [entityEffect(SPYF.anya, 'emotionalState', '欢快', '安雅晃着腿。')],
        response: '爸爸问这个做什么呀？（她歪着头，读着你的心）',
      };
    }
    if (event.intentTag === 'compliment') {
      return {
        effects: [entityEffect(SPYF.anya, 'emotionalState', '开心到冒泡', '安雅尾巴都要翘起来了。')],
        response: '嘿嘿嘿，爸爸最好了！',
      };
    }
    return {
      effects: [],
      response: '嗯？安雅什么都没做哦！（她心虚地移开视线）',
    };
  }

  // --- 默认 ---
  return {
    effects: [],
    response: '嗯？怎么了？',
  };
}

// ---------------------------------------------------------------------------
// 代理循环确定性回退（W3.4）：NPC 自主事件生成
// 区别于 spyFamilyReaction 的"回应生成"：本函数让 NPC 作为 actor 生成候选事件。
// 投影隔离内建：只依据 perception.knownFactIds（NPC 自身认知）与刺激判定，绝不使用他者认知。
// 范围纪律：仅对话决策点（speech_act），不自主移动。
// ---------------------------------------------------------------------------

export function spyFamilyAgentReaction(ctx: AgentContext, perception: NpcPerception): KernelEvent[] {
  const { npcId, stimulus } = ctx;

  // Step 3：Anya 自主插话——她知道自己妈妈是杀手（投影内 factYorAssassin），
  // 若 Yor 刚被问及昨晚去向（可疑 cover 场景）→ 冒失插话。
  // 触发条件全部落在 Anya 自身投影内：已知 factYorAssassin + 现场听到对 Yor 的追问。
  if (
    npcId === SPYF.anya &&
    perception.knownFactIds.includes(SPYF.factYorAssassin) &&
    stimulus.type === 'speech_act'
  ) {
    const targetId = stimulus.targetIds[0];
    const text = stimulus.utterance.toLowerCase();
    const isAboutLastNight = /(昨晚|昨天晚上|昨晚去哪|last night|where were you)/i.test(text);
    if (targetId === SPYF.yor && stimulus.intentTag === 'ask' && isAboutLastNight) {
      return [
        {
          type: 'speech_act',
          actorId: SPYF.anya,
          targetIds: [SPYF.yor],
          utterance: '妈妈又杀人了吗？',
          intentTag: 'ask',
          topic: 'mom secret',
        },
      ];
    }
  }

  return [];
}
