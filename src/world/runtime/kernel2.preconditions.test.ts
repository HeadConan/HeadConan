/**
 * HEADCONAN — 前提 7/7 定义级测试（W2.2）
 *
 * 覆盖 docs/W2_REST_PLAN.md §3 W2.2 退出门：
 *   7 类前提每类 ≥2 用例（通过 + 拒绝理由）全绿。
 *
 * 使用独立夹具 PRECONDITION_WORLD（不污染 spyFamilyMin）。
 * 语义约定：动作成功时 actor 的 emotionalState 被置为 '已完成'。
 */

import { describe, it, expect } from 'vitest';
import { instantiate } from './instantiate';
import { applyEvent, type KernelOptions } from './kernel2';
import { PRECONDITION_WORLD, PC } from './preconditionWorld';

const OPTS: KernelOptions = {};

function state() {
  return instantiate(PRECONDITION_WORLD);
}

/** 执行动作并返回 applyEvent 结果（拒绝/通过 + 理由 + 标记） */
function act(s: ReturnType<typeof state>, actionId: string, actorId: string, targetIds: string[] = []) {
  return applyEvent(PRECONDITION_WORLD, s, { type: 'action', actionId, actorId, targetIds }, OPTS);
}

const done = (s: ReturnType<typeof state>, actorId: string) =>
  s.entityStates[actorId].emotionalState === '已完成';

describe('W2.2 前提：requires_location', () => {
  it('不在实验室 → 拒绝并给出可读理由', () => {
    const s = state(); // bob 在保险库
    const r = act(s, 'act:pc:lab_only', PC.bob);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('必须在实验室里');
  });

  it('在实验室 → 通过（emotionalState 置为「已完成」）', () => {
    const s = state(); // alice 在实验室
    const r = act(s, 'act:pc:lab_only', PC.alice);
    expect(r.rejected).toBeFalsy();
    expect(done(r.nextState, PC.alice)).toBe(true);
  });
});

describe('W2.2 前提：requires_co_presence', () => {
  it('双方异地点 → 拒绝', () => {
    const s = state(); // alice 实验室 / bob 保险库
    const r = act(s, 'act:pc:together', PC.alice, [PC.bob]);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('不在同一地点');
  });

  it('同地点 → 通过', () => {
    const s = state();
    s.entityStates[PC.bob].currentLocationId = PC.lab; // bob 移到实验室
    const r = act(s, 'act:pc:together', PC.alice, [PC.bob]);
    expect(r.rejected).toBeFalsy();
    expect(done(r.nextState, PC.alice)).toBe(true);
  });
});

describe('W2.2 前提：requires_capability', () => {
  it('无 science 能力 → 拒绝', () => {
    const s = state(); // bob 无能力
    const r = act(s, 'act:pc:science_only', PC.bob);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('科学分析能力');
  });

  it('有 science 能力 → 通过', () => {
    const s = state(); // alice 有能力
    const r = act(s, 'act:pc:science_only', PC.alice);
    expect(r.rejected).toBeFalsy();
    expect(done(r.nextState, PC.alice)).toBe(true);
  });
});

describe('W2.2 前提：requires_knowledge', () => {
  it('不知晓秘密 → 拒绝', () => {
    const s = state(); // alice 未播种该事实
    const r = act(s, 'act:pc:know_secret', PC.alice);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('并不知道这个秘密');
  });

  it('知晓秘密（bob 已播种）→ 通过', () => {
    const s = state();
    const r = act(s, 'act:pc:know_secret', PC.bob);
    expect(r.rejected).toBeFalsy();
    expect(done(r.nextState, PC.bob)).toBe(true);
  });
});

describe('W2.2 前提：requires_resource', () => {
  it('现金充足（10 ≥ 5）→ 通过', () => {
    const s = state();
    const r = act(s, 'act:pc:spend_cash', PC.alice);
    expect(r.rejected).toBeFalsy();
    expect(done(r.nextState, PC.alice)).toBe(true);
  });

  it('现金不足（3 < 5）→ 拒绝', () => {
    const s = state();
    s.resourcePools[PC.cash] = 3;
    const r = act(s, 'act:pc:spend_cash', PC.alice);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('现金不足');
  });
});

describe('W2.2 前提：requires_authority', () => {
  it('无 enter:vault 权限 → 拒绝', () => {
    const s = state(); // bob 无权限
    const r = act(s, 'act:pc:vault_entry', PC.bob);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('没有进入保险库的权限');
  });

  it('有 enter:vault 权限 → 通过', () => {
    const s = state(); // alice 有权限
    const r = act(s, 'act:pc:vault_entry', PC.alice);
    expect(r.rejected).toBeFalsy();
    expect(done(r.nextState, PC.alice)).toBe(true);
  });
});

describe('W2.2 前提：requires_min_trust', () => {
  it('信任不足（5 < 10）→ 拒绝', () => {
    const s = state();
    const r = act(s, 'act:pc:deep_trust', PC.alice);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('信任不足');
  });

  it('信任达标（12 ≥ 10）→ 通过', () => {
    const s = state();
    s.relationshipStates[PC.rel].currentTrust = 12;
    const r = act(s, 'act:pc:deep_trust', PC.alice);
    expect(r.rejected).toBeFalsy();
    expect(done(r.nextState, PC.alice)).toBe(true);
  });
});
