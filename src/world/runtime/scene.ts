/**
 * HEADCONAN RUNTIME — 场景状态机（W3.1）
 *
 * 目的（docs/W3_PLAN.md §3 W3.1）：界面围绕"当下在做什么"重组。
 *   - 场景 = 玩家"当下在做什么"的体验配置（SCENE_MODEL.md）。
 *   - 纯函数推导：世界状态 + 观察者 + 意图提示 → 场景（可序列化，随快照持久化）。
 *   - 触发源（2 源，可解释性优先）：
 *       1. 用户意图（resolveUserAction 返回 sceneHint：travel→exploration / talk→conversation / inspect→exploration）
 *       2. 世界节奏（时钟/地点推进：residence→everyday，其余→exploration）
 *   - 导演视角（observer=null）→ world_editing（SCENE_MODEL §3：玩家/Host 可不同场景）。
 *   - 切换纪律：显式用户切换 > 自动切换；场景类型未变则保留 inScene 与 lastTransition。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { WorldStateInstance, SceneState, SceneType } from '../representation/types/state';
import type { EntityId } from '../representation/types/primitives';

/** 场景切换的意图提示（由解析层产生，W3.1 确定性；W3.2 LLM 提议共享同一契约） */
export interface SceneIntentHint {
  type: 'travel' | 'talk' | 'inspect' | 'world_edit' | 'cadence';
  targetId?: EntityId;
}

/** 默认场景（实例化 / 旧快照兜底） */
export function defaultScene(): SceneState {
  return { current: 'everyday', inScene: {} };
}

/**
 * 场景推导（纯函数）：世界状态 + 观察者 + 意图提示 → 场景。
 * 规则：
 *   1. 导演（observer=null，全知）→ world_editing；
 *   2. 显式意图覆盖：talk→conversation；travel/inspect→exploration；world_edit→world_editing；
 *   3. 地点推导（cadence/默认）：residence→everyday，其余→exploration。
 * 场景类型未变 → 返回原引用（保留 inScene 与 lastTransition）；切换 → 记录 lastTransition。
 */
export function deriveScene(
  world: WorldDefinition,
  state: WorldStateInstance,
  observer: EntityId | null,
  intentHint?: SceneIntentHint
): SceneState {
  // 1. 导演（全知）→ world_editing
  if (observer === null) {
    return transition(state.scene, 'world_editing', '导演视角', state.clock.turnNumber);
  }

  // 2. 显式意图覆盖
  if (intentHint) {
    switch (intentHint.type) {
      case 'talk':
        return transition(state.scene, 'conversation', '对话意图', state.clock.turnNumber);
      case 'travel':
      case 'inspect':
        return transition(state.scene, 'exploration', '探索意图', state.clock.turnNumber);
      case 'world_edit':
        return transition(state.scene, 'world_editing', '世界编辑意图', state.clock.turnNumber);
      case 'cadence':
        break; // 落入地点推导
    }
  }

  // 3. 地点推导（节奏/默认）：residence → everyday，其余 → exploration
  const loc = state.entityStates[observer]?.currentLocationId;
  const locDef = world.locations.find(l => l.id === loc);
  const next: SceneType = locDef?.type === 'residence' ? 'everyday' : 'exploration';
  return transition(state.scene, next, '地点推导', state.clock.turnNumber);
}

function transition(prev: SceneState, next: SceneType, reason: string, turn: number): SceneState {
  if (prev.current === next) {
    return prev; // 场景类型未变：保留 inScene 与 lastTransition
  }
  return {
    current: next,
    inScene: {}, // 场景类型切换 → 场景内状态重置
    lastTransition: { from: prev.current, to: next, reason, turn },
  };
}
