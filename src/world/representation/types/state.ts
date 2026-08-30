/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: World State (B. WHAT IS TRUE RIGHT NOW?)
 * 
 * Represents a living snapshot of reality at a specific temporal moment in simulation.
 */

import { EntityId, FactId, LocationId, ScenarioId, TimelineId, ActionId } from './primitives';
import { DynamicRelationshipState } from './relationships';
import { SecretItem, RumorItem } from './information';
import { SimulationEvent } from './dynamics';

export interface EntityStateSnapshot {
  entityId: EntityId;
  currentLocationId: LocationId;
  currentActivity: string;
  emotionalState: string;
  reputationScore: number;
  physicalStatus: string;
  dynamicAttributes: Record<string, any>;
  inventoryObjectIds: string[];
}

export interface EpistemicStateInstance {
  entityKnownFacts: Record<EntityId, FactId[]>; // EntityId -> Array of known FactIds
  activeSecrets: SecretItem[];
  activeRumors: RumorItem[];
  publicExposedFactIds: FactId[];
}

export interface WorldClock {
  turnNumber: number;
  inUniverseTime: string; // e.g. "Year 298 AC, 3rd Moon", "1895-11-14 21:30 GMT", "Fall Semester, Week 7, Tuesday 14:00"
  elapsedSimulatedSeconds?: number;
}

/** 调度事件（W2）：世界自发推进的最小单元 */
export interface ScheduledEvent {
  id: string;                 // 确定性：`sch:{turn}:{seq}:{actionId}`
  actionId: ActionId;
  actorId: EntityId;
  targetIds: EntityId[];
  params?: Record<string, unknown>;
  kind: 'once' | 'periodic';
  dueTurn: number;            // 到期 turn
  intervalTurns: number;      // periodic 重排间隔；once = 0
  attempts: number;           // 已尝试次数
  maxAttempts: number;        // 拒绝耗尽即移除（默认 3）
  narrativeLabel: string;     // 呈现用标签（源自级联 summary / spawnEvent title）
}

/** 调度器状态（持久化于 WorldStateInstance，保证 seed 重放） */
export interface SchedulerState {
  queue: ScheduledEvent[];
  budgetPerTurn: number;      // 每 turn 最多执行数（默认 3）
  seed: number;               // seeded RNG 状态（持久化，重放一致）
  nextSeq: number;            // 确定性 ID 序号
}

/** 场景类型（W3.1）：玩家"当下在做什么"的体验配置 */
export type SceneType = 'conversation' | 'everyday' | 'exploration' | 'world_editing';

/** 场景状态（W3.1）：可序列化，随快照持久化，刷新后场景与场景内状态不丢 */
export interface SceneState {
  current: SceneType;
  /** 场景内可序列化状态（对话轮次、聚焦对象、已收集线索） */
  inScene: Record<string, unknown>;
  /** 上次切换原因（可解释性：玩家视角 = 叙事线索 + UI 过渡） */
  lastTransition?: { from: SceneType; to: SceneType; reason: string; turn: number };
}

export interface WorldStateInstance {
  instanceId: string;
  definitionId: string;
  scenarioId?: ScenarioId;
  timelineId: TimelineId;
  
  clock: WorldClock;
  currentSituationNarrative: string;
  
  // Dynamic Slices of State
  entityStates: Record<EntityId, EntityStateSnapshot>;
  relationshipStates: Record<string, DynamicRelationshipState>;
  epistemics: EpistemicStateInstance;
  
  // Resource Balances
  resourcePools: Record<string, number>;
  
  // W2: 世界自发事件调度（延迟/周期/概率级联）
  scheduler: SchedulerState;

  // W3.1: 场景状态机（玩家"当下在做什么"；可序列化）
  scene: SceneState;
  
  // History & Incidents
  recentEvents: SimulationEvent[];
  eventChronicleLog: SimulationEvent[];
}
