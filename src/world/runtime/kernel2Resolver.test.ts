import { describe, it, expect } from 'vitest';
import { resolveUserAction, resolveDirectorAction } from './kernel2Resolver';
import { SPY_FAMILY_MIN, SPYF, DIRECTOR_REVEAL_DIRECTIVES } from '../spyFamily/spyFamilyMin';

describe('kernel2Resolver — 导演指令 → reveal_fact 注入', () => {
  const cases: Array<[string, string, string]> = [
    ['把约尔的秘密透露给洛德', SPYF.factYorAssassin, SPYF.loid],
    ['让洛德知道钢笔是窃听器', SPYF.factPenSurveillance, SPYF.loid],
    ['把安雅的读心秘密透露给约尔', SPYF.factAnyaTelepath, SPYF.yor],
    ['把洛德是间谍的秘密透露给安雅', SPYF.factLoidTwilight, SPYF.anya],
  ];

  it.each(cases)('「%s」→ reveal_fact(%s) → %s', (cmd, factId, targetId) => {
    const r = resolveDirectorAction(cmd, SPY_FAMILY_MIN);
    expect(r.event?.type).toBe('reveal_fact');
    if (r.event?.type === 'reveal_fact') {
      expect(r.event.factId).toBe(factId);
      expect(r.event.targetId).toBe(targetId);
    }
  });

  it('DIRECTOR_REVEAL_DIRECTIVES 全部可解析为 reveal_fact（不死胡同）', () => {
    for (const d of DIRECTOR_REVEAL_DIRECTIVES) {
      const r = resolveDirectorAction(d.command, SPY_FAMILY_MIN);
      expect(r.event?.type).toBe('reveal_fact');
      if (r.event?.type === 'reveal_fact') {
        expect(r.event.factId).toBeDefined();
        expect(r.event.targetId).toBeDefined();
      }
    }
  });

  it('未支持导演指令返回 notice（诚实提示，不死胡同）', () => {
    const r = resolveDirectorAction('掀起一场街头暴乱', SPY_FAMILY_MIN);
    expect(r.event).toBeUndefined();
    expect(r.notice).toBeTruthy();
  });
});

describe('kernel2Resolver — 玩家解析', () => {
  const actor = SPYF.loid;

  it('「问约尔：你最近在忙什么？」→ 规则9 ask（目标约尔）', () => {
    const r = resolveUserAction('问约尔：你最近在忙什么？', SPY_FAMILY_MIN, actor);
    expect(r.confidence).toBeGreaterThanOrEqual(0.85);
    const ev = r.events[0];
    expect(ev.type).toBe('speech_act');
    if (ev.type === 'speech_act') {
      expect(ev.targetIds).toContain(SPYF.yor);
    }
  });

  it('「前往伊甸学园走廊」→ travel 动作', () => {
    const r = resolveUserAction('前往伊甸学园走廊', SPY_FAMILY_MIN, actor);
    expect(r.confidence).toBeGreaterThanOrEqual(0.85);
    const ev = r.events[0];
    expect(ev.type).toBe('action');
    if (ev.type === 'action') {
      expect(ev.actionId).toBe('act:spyf:travel');
      expect(ev.targetIds).toContain(SPYF.corridor);
    }
  });

  it('无意义输入 → 兜底分支，confidence < 0.85', () => {
    const r = resolveUserAction('量子力学与香蕉果冻', SPY_FAMILY_MIN, actor);
    expect(r.confidence).toBeLessThan(0.85);
    expect(r.resolution).toContain('兜底');
  });
});
