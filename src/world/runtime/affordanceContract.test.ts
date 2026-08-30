/**
 * P0-2 防回归契约：任何可点击 affordance 必须二选一——
 *   要么命中真实内核行为（confidence ≥ 阈值且事件类型符合预期），
 *   要么处于禁用清单（不得被误解析为高置信真实指令）。
 */
import { describe, it, expect } from 'vitest';
import { resolveUserAction, resolveDirectorAction } from './kernel2Resolver';
import { SPY_FAMILY_MIN, SPYF, DIRECTOR_REVEAL_DIRECTIVES } from '../spyFamily/spyFamilyMin';

interface RealAffordance {
  label: string;
  text: string;
  minConfidence: number;
  expectedType: 'reveal_fact' | 'speech_act' | 'action';
}

const REAL_AFFORDANCES: RealAffordance[] = [
  ...DIRECTOR_REVEAL_DIRECTIVES.map((d) => ({
    label: `导演注入-${d.label}`,
    text: d.command,
    minConfidence: 1,
    expectedType: 'reveal_fact' as const,
  })),
  {
    label: 'Character-提问',
    text: '问约尔：你最近在忙什么？',
    minConfidence: 0.85,
    expectedType: 'speech_act',
  },
  {
    label: 'Map-前往',
    text: '前往伊甸学园走廊',
    minConfidence: 0.85,
    expectedType: 'action',
  },
];

const DISABLED_AFFORDANCES: Array<{ label: string; text: string }> = [
  { label: 'Character-Audit Secret Communications', text: 'Audit Secret Communications' },
  { label: 'Map-Reinforce Sector', text: 'Reinforce Sector' },
];

describe('affordanceContract — 可点击二选一：真实 or 禁用', () => {
  it.each(REAL_AFFORDANCES)('$label → 命中真实内核行为', ({ text, minConfidence, expectedType }) => {
    if (expectedType === 'reveal_fact') {
      const r = resolveDirectorAction(text, SPY_FAMILY_MIN);
      expect(r.event?.type).toBe('reveal_fact');
    } else {
      const r = resolveUserAction(text, SPY_FAMILY_MIN, SPYF.loid);
      expect(r.confidence).toBeGreaterThanOrEqual(minConfidence);
      expect(r.events[0].type).toBe(expectedType);
    }
  });

  it.each(DISABLED_AFFORDANCES)('$label → 禁用态，禁止高置信命中', ({ text }) => {
    const r = resolveUserAction(text, SPY_FAMILY_MIN, SPYF.loid);
    expect(r.confidence).toBeLessThan(0.85);
  });
});
