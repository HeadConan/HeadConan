/**
 * HeadConan Routing — Stage A1 tests: classifier + θ calibration (RED-FIRST).
 *
 * Gate-Out for Stage A1 (docs/ROUTING_PLAN.md):
 *   - golden set (N=60, balanced) classification accuracy ≥ 95%
 *   - θ calibrated and recorded with its precision/recall behavior
 *   - every misclassification reproduced as a named test case
 */

import { describe, it, expect } from 'vitest';
import { GOLDEN_SET, assertGoldenBalance } from './goldenSet';
import { classifyDeterministic, classifyInput, choosePath, DEFAULT_THRESHOLD } from './classifier';

describe('A1 · golden set integrity', () => {
  it('is exactly 60 balanced cases', () => {
    expect(GOLDEN_SET).toHaveLength(60);
    expect(assertGoldenBalance).not.toThrow();
  });

  it('has unique ids (every misclassification is addressable)', () => {
    const ids = GOLDEN_SET.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('A1 · golden gate (accuracy ≥ 95%)', () => {
  const results = GOLDEN_SET.map((g) => ({ ...g, got: classifyDeterministic(g.text).inputClass }));
  const errors = results.filter((r) => r.got !== r.expected);

  it(`accuracy ≥ 95% on the golden set (errors: ${errors.length}/60)`, () => {
    const acc = (results.length - errors.length) / results.length;
    expect(acc).toBeGreaterThanOrEqual(0.95);
  });

  // Every misclassification is reproduced as a named case (fails the suite by name).
  for (const e of errors) {
    it(`[misclassification] golden#${e.id} ${JSON.stringify(e.text)} → expected ${e.expected}, got ${e.got}`, () => {
      expect(e.got).toBe(e.expected);
    });
  }
});

describe('A1 · boundary cases are named tests', () => {
  const cases: Array<[string, string, 'user_structured' | 'user_open']> = [
    ['verb-start English', 'Follow her', 'user_structured'],
    ['verb-start Chinese', '追她', 'user_structured'],
    ['short verb+entity', 'Read the letter', 'user_structured'],
    ['interrogative ambiguity', '你昨晚去哪了？', 'user_open'],
    ['emotional hedge with verb', 'I want to talk but I am scared', 'user_open'],
    ['mentioning entity only', 'What do you think about Anya?', 'user_open'],
    ['bare question', '为什么茶还是温的？', 'user_open'],
  ];
  for (const [name, text, expected] of cases) {
    it(`${name}: ${JSON.stringify(text)} → ${expected}`, () => {
      expect(classifyDeterministic(text).inputClass).toBe(expected);
    });
  }
});

describe('A1 · θ threshold semantics (path decision)', () => {
  it('structured at high confidence routes to the deterministic parser', () => {
    const c = classifyDeterministic('Follow Yor');
    expect(c.inputClass).toBe('user_structured');
    expect(c.confidence).toBeGreaterThanOrEqual(DEFAULT_THRESHOLD);
    expect(choosePath(c)).toBe('deterministic_parse');
  });

  it('ambiguous input falls below θ → LLM interpretation (conservative, never a bad parse)', () => {
    const c = classifyDeterministic('也许我不该追查下去');
    expect(c.inputClass).toBe('user_open');
    expect(c.confidence).toBeLessThan(DEFAULT_THRESHOLD);
    // LLM-first (POSITIONING §4.1): spend one LLM request, never parse garbage.
    expect(choosePath(c)).toBe('llm_interpretation');
  });

  it('weak structured (verb+entity, short) routes to deterministic parse only if ≥ θ', () => {
    const weak = classifyDeterministic('把茶递给约尔');
    expect(weak.inputClass).toBe('user_structured');
    expect(choosePath(weak)).toBe('deterministic_parse');
  });

  it('confidence is bounded to [0,1]', () => {
    for (const g of GOLDEN_SET) {
      const c = classifyDeterministic(g.text);
      expect(c.confidence).toBeGreaterThanOrEqual(0);
      expect(c.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('the default θ is a calibrated, documented constant', () => {
    // Conservative bias recorded in classifier.ts: wrong structured > wrong open.
    expect(DEFAULT_THRESHOLD).toBe(0.7);
  });
});

describe('A1 · LLM classifier is optional, never required', () => {
  it('classifyInput works without an LLM (offline golden gate)', async () => {
    const c = await classifyInput('Follow Yor');
    expect(c.inputClass).toBe('user_structured');
  });

  it('LLM opinion is used only when preferLlm and input is ambiguous', async () => {
    const llmCalled: string[] = [];
    const llm = async (text: string) => {
      llmCalled.push(text);
      return { inputClass: 'user_open' as const, classification: 'llm', confidence: 0.9, rationale: 'llm' };
    };
    const structured = await classifyInput('Follow Yor', { llm, preferLlm: true });
    expect(structured.inputClass).toBe('user_structured');
    expect(llmCalled).toHaveLength(0); // structured never consults the LLM

    const ambiguous = await classifyInput('也许我不该追查下去', { llm, preferLlm: true });
    expect(ambiguous.inputClass).toBe('user_open');
    expect(llmCalled).toHaveLength(1);
  });
});
