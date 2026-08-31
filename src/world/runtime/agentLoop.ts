/**
 * HEADCONAN RUNTIME — 代理循环（W3.4，最小可行版）
 *
 * 目的（docs/W3_PLAN.md §3 W3.4）：NPC 因独立视角而"像活人"。
 *   - 感知（perceiveFor）：只取 NPC 自己的投影——自身认知账本 + 现场共现 + 最近事件。
 *   - 决策（decideNpc）：LLM 提议候选事件 → 确定性效用选择；LLM 不可用 → 确定性回退。
 *   - 候选事件 → 内核：applyEvent 校验并写入（拒绝即事件）。
 *
 * 红线（W3 主证伪）：投影隔离——NPC 决策输入绝不包含其他实体的认知账本（泄漏即证伪）。
 * 范围纪律：仅对话决策点触发（不自主移动）；每 turn 每 NPC 至多 N 次决策（预算上限）。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { WorldStateInstance } from '../representation/types/state';
import type { EntityId, FactId } from '../representation/types/primitives';
import type { DynamicRelationshipState } from '../representation/types/relationships';
import type { SimulationEvent } from '../representation/types/dynamics';
import { applyEvent, type ApplyResult, type KernelEvent, type KernelOptions } from './kernel2';

// ---------------------------------------------------------------------------
// 感知（投影隔离核心）
// ---------------------------------------------------------------------------

export interface NpcPerception {
  npcId: EntityId;
  /** 只含该 NPC 自己的认知账本（投影隔离核心；绝不包含他者 entityKnownFacts） */
  knownFactIds: FactId[];
  /** 现场共现实体 */
  coPresent: EntityId[];
  /** 最近事件（该 NPC 视角可感知的） */
  recentEvents: SimulationEvent[];
  /** 该 NPC 参与的关系动态快照（source 或 target） */
  relationshipSnapshot: Record<string, DynamicRelationshipState>;
}

/**
 * 感知：只取 NPC 自己的投影。
 * 投影隔离硬要求：knownFactIds 严格来自 state.epistemics.entityKnownFacts[npcId]，
 * 绝不读取其他实体的认知账本——泄漏即证伪（W3 主退出门）。
 */
export function perceiveFor(
  npcId: EntityId,
  world: WorldDefinition,
  state: WorldStateInstance
): NpcPerception {
  const knownFactIds = state.epistemics.entityKnownFacts[npcId] ?? [];

  const loc = state.entityStates[npcId]?.currentLocationId;
  const coPresent = loc
    ? Object.entries(state.entityStates)
        .filter(([id, s]) => id !== npcId && s.currentLocationId === loc)
        .map(([id]) => id)
    : [];

  const relationshipSnapshot: Record<string, DynamicRelationshipState> = {};
  for (const rel of world.relationships) {
    if (rel.sourceEntityId === npcId || rel.targetEntityId === npcId) {
      const dyn = state.relationshipStates[rel.id];
      if (dyn) relationshipSnapshot[rel.id] = dyn;
    }
  }

  return {
    npcId,
    knownFactIds,
    coPresent,
    recentEvents: state.recentEvents.slice(0, 10),
    relationshipSnapshot,
  };
}

// ---------------------------------------------------------------------------
// 决策
// ---------------------------------------------------------------------------

export interface AgentContext {
  npcId: EntityId;
  world: WorldDefinition;
  state: WorldStateInstance;
  /** 触发刺激（玩家 speech_act / 世界事件） */
  stimulus: KernelEvent;
  /** 本 turn 剩余代理决策预算（<=0 → 不决策） */
  budget: number;
}

export interface AgentDecision {
  events: KernelEvent[];
  source: 'llm' | 'deterministic';
  confidence: number;
}

/** LLM 提议函数：接收感知上下文，返回候选事件（null = 无提议，走确定性回退） */
export type ProposeFn = (ctx: AgentContext, perception: NpcPerception) => Promise<KernelEvent[] | null>;

/** 确定性回退：接收感知上下文，返回候选事件（空数组 = 无自主动作） */
export type DeterministicReaction = (ctx: AgentContext, perception: NpcPerception) => KernelEvent[];

/**
 * 决策：LLM 提议候选 + 效用选择；LLM 不可用/无候选 → 确定性回退。
 * 预算纪律：budget<=0 → 空决策；返回事件数不超过 budget（每 turn 每 NPC 至多 N 次）。
 */
export async function decideNpc(
  ctx: AgentContext,
  opts: { propose: ProposeFn; fallback: DeterministicReaction }
): Promise<AgentDecision> {
  if (ctx.budget <= 0) {
    return { events: [], source: 'deterministic', confidence: 1 };
  }

  const perception = perceiveFor(ctx.npcId, ctx.world, ctx.state);

  // 1. LLM 提议（第一提议者；不可用/无候选 → 确定性回退，体验永不硬阻塞）
  try {
    const proposed = await opts.propose(ctx, perception);
    if (proposed && proposed.length > 0) {
      return { events: proposed.slice(0, ctx.budget), source: 'llm', confidence: 0.9 };
    }
  } catch (err) {
    console.warn(`[AgentLoop] ${ctx.npcId} LLM 提议不可用，回退确定性:`, err);
  }

  // 2. 确定性回退（Step 2/4 节拍 + Anya 插话触发器；投影隔离内建）
  const events = opts.fallback(ctx, perception);
  return {
    events: events.slice(0, ctx.budget),
    source: 'deterministic',
    confidence: events.length > 0 ? 0.7 : 1,
  };
}

// ---------------------------------------------------------------------------
// 循环（接线：玩家动作后对现场共现 NPC 逐个决策）
// ---------------------------------------------------------------------------

export interface AgentLoopOptions {
  propose: ProposeFn;
  fallback: DeterministicReaction;
  /** 每 NPC 每 turn 决策预算（默认 1） */
  budgetPerNpc?: number;
  /** 总决策数上限（默认 = 共现 NPC 数） */
  totalBudget?: number;
  kernelOpts?: KernelOptions;
}

export interface AgentLoopResult {
  nextState: WorldStateInstance;
  decisions: AgentDecision[];
  applied: ApplyResult[];
}

/**
 * 代理循环：对现场共现 NPC 逐个决策并应用候选事件（预算内）。
 * 纯函数：克隆输入状态，返回 nextState；不影响调用方状态。
 */
export async function runAgentLoop(
  state: WorldStateInstance,
  world: WorldDefinition,
  observerId: EntityId,
  stimulus: KernelEvent,
  opts: AgentLoopOptions
): Promise<AgentLoopResult> {
  let working = structuredClone(state);
  const decisions: AgentDecision[] = [];
  const applied: ApplyResult[] = [];

  const loc = working.entityStates[observerId]?.currentLocationId;
  const coPresentNpcs = loc
    ? Object.entries(working.entityStates)
        .filter(([id, s]) => id !== observerId && s.currentLocationId === loc)
        .map(([id]) => id)
    : [];

  const budgetPerNpc = opts.budgetPerNpc ?? 1;
  let total = opts.totalBudget ?? coPresentNpcs.length;

  for (const npcId of coPresentNpcs) {
    if (total <= 0) break;
    total -= 1;

    const decision = await decideNpc(
      { npcId, world, state: working, stimulus, budget: budgetPerNpc },
      { propose: opts.propose, fallback: opts.fallback }
    );
    decisions.push(decision);

    for (const ev of decision.events) {
      const r = applyEvent(world, working, ev, opts.kernelOpts);
      working = r.nextState;
      applied.push(r);
    }
  }

  return { nextState: working, decisions, applied };
}
