import { describe, it, expect } from 'vitest';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../spyFamily/spyFamilyMin';
import { instantiate } from './instantiate';
import { deriveScene, defaultScene } from './scene';

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

describe('W3.1 场景状态机：意图触发', () => {
  it('talk 意图 → conversation', () => {
    const s = breakfastState();
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid, { type: 'talk', targetId: SPYF.yor });
    expect(scene.current).toBe('conversation');
  });

  it('travel 意图 → exploration', () => {
    const s = breakfastState();
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid, { type: 'travel', targetId: SPYF.corridor });
    expect(scene.current).toBe('exploration');
  });

  it('inspect 意图 → exploration', () => {
    const s = breakfastState();
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid, { type: 'inspect' });
    expect(scene.current).toBe('exploration');
  });

  it('world_edit 意图 → world_editing', () => {
    const s = breakfastState();
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid, { type: 'world_edit' });
    expect(scene.current).toBe('world_editing');
  });
});

describe('W3.1 场景状态机：地点/节奏触发', () => {
  it('在客厅（residence）→ everyday', () => {
    const s = breakfastState();
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid);
    expect(scene.current).toBe('everyday');
  });

  it('移动到走廊（campus_hall）→ exploration（节奏/地点推导）', () => {
    const s = breakfastState();
    s.entityStates[SPYF.loid].currentLocationId = SPYF.corridor;
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid);
    expect(scene.current).toBe('exploration');
  });

  it('cadence 意图落入地点推导：在街道 → exploration', () => {
    const s = breakfastState();
    s.entityStates[SPYF.loid].currentLocationId = SPYF.street;
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid, { type: 'cadence' });
    expect(scene.current).toBe('exploration');
  });
});

describe('W3.1 场景状态机：导演视角', () => {
  it('observer=null（全知导演）→ world_editing', () => {
    const s = breakfastState();
    const scene = deriveScene(SPY_FAMILY_MIN, s, null);
    expect(scene.current).toBe('world_editing');
  });
});

describe('W3.1 场景状态机：可序列化与切换语义', () => {
  it('场景随快照 round-trip，场景内状态不丢', () => {
    const s = breakfastState();
    s.scene = { current: 'conversation', inScene: { dialogueTurn: 3 } };
    const restored = JSON.parse(JSON.stringify(s));
    expect(restored.scene).toEqual({ current: 'conversation', inScene: { dialogueTurn: 3 } });
  });

  it('场景类型未变 → 保留 inScene 与 lastTransition（返回原引用）', () => {
    const s = breakfastState();
    s.scene = {
      current: 'conversation',
      inScene: { dialogueTurn: 2 },
      lastTransition: { from: 'everyday', to: 'conversation', reason: '对话意图', turn: 1 },
    };
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid, { type: 'talk' });
    expect(scene).toBe(s.scene);
  });

  it('场景类型切换 → 记录 lastTransition，场景内状态重置', () => {
    const s = breakfastState();
    s.scene = { current: 'conversation', inScene: { dialogueTurn: 2 } };
    const scene = deriveScene(SPY_FAMILY_MIN, s, SPYF.loid, { type: 'travel' });
    expect(scene.current).toBe('exploration');
    expect(scene.inScene).toEqual({});
    expect(scene.lastTransition).toEqual({
      from: 'conversation',
      to: 'exploration',
      reason: '探索意图',
      turn: 1,
    });
  });
});

describe('W3.1 场景状态机：默认场景', () => {
  it('defaultScene → everyday，空场景内状态', () => {
    expect(defaultScene()).toEqual({ current: 'everyday', inScene: {} });
  });

  it('实例化初始化 scene 字段（breakfast 场景在客厅 → everyday）', () => {
    const s = breakfastState();
    expect(s.scene.current).toBe('everyday');
  });
});
