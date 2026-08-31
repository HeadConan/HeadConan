/**
 * HeadConan Routing — Stage A1: input classifier (structured vs open-ended).
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A1.
 * Position: this is the FIRST hop of the pipeline —
 *   INPUT → [CLASSIFY] → INTERPRET → PROPOSE → VALIDATE → COMMIT|CLARIFY|REJECT.
 *
 * Design constraints (from the plan):
 *   - reuse, do not rebuild: structured inputs are recognized with the same
 *     verb/entity vocabulary the deterministic parsers already use; this file
 *     only decides WHICH path, it never parses into events.
 *   - offline-testable: the core classifier is deterministic; an optional LLM
 *     classifier can be injected for ambiguous inputs (documented, not faked).
 *   - every decision carries a confidence; the threshold θ decides the path.
 *     Conservative default: when in doubt, go LLM (open) — never force a
 *     structured parse on ambiguous text.
 */

import { REASON_CODES } from './types';
import type { RouteInputClass, ReasonCode, RoutePath } from './types';

/* ------------------------------------------------------------------ */
/* Vocabulary — mirrors what the deterministic parsers already accept. */
/* ------------------------------------------------------------------ */

/** Action verbs that signal an explicit, structured instruction. */
const ACTION_VERBS = [
  'ask', 'tell', 'follow', 'observe', 'leave', 'inspect', 'search', 'use', 'go', 'move',
  'travel', 'talk', 'speak', 'interrogate', 'confront', 'audit', 'drink', 'eat', 'watch',
  'listen', 'open', 'read', 'take', 'give', 'show', 'walk', 'run', 'hide', 'wait', 'guard',
  'check', 'investigate', 'examine', 'approach', 'enter', 'exit', 'grab', 'steal', 'burn',
  'throw', 'follow', 'chase', 'tell', 'promise', 'reveal', 'hide', 'burn', 'open',
  '问', '询问', '告诉', '跟着', '跟踪', '观察', '离开', '检查', '搜查', '用', '去',
  '移动', '说', '交谈', '审讯', '质问', '审计', '喝', '吃', '看', '听', '打开', '读',
  '拿', '给', '展示', '走', '跑', '躲', '等', '调查', '接近', '进入', '退出', '抓',
  '偷', '烧', '扔', '递', '拿走', '翻', '搜', '查', '跟', '追', '递给',
] as const;

/** Entities the parsers know — used to boost structured confidence. */
const ENTITIES = [
  'yor', 'anya', 'loid', 'bond', 'chancellor', 'vance', 'cross', 'thorne', 'reed',
  'damian', 'city hall', 'eden academy', 'berlint', 'kitchen', 'living room', 'drawer',
  'letter', 'phone', 'tea', 'cup', 'hallway', 'bedroom', 'window', 'door', 'file', 'ledger',
  '约尔', '阿尼亚', '洛德', '邦德', '大臣', '市政厅', '伊甸学院', '巴林特', '厨房',
  '客厅', '抽屉', '信', '手机', '茶', '杯子', '走廊', '卧室', '窗户', '门', '档案', '账本',
] as const;

/* ------------------------------------------------------------------ */
/* Classifier                                                          */
/* ------------------------------------------------------------------ */

export interface RouteClassified {
  inputClass: RouteInputClass;
  /** short human-readable label, e.g. "explicit action instruction". */
  classification: string;
  /** confidence in [0,1] — compared against θ downstream. */
  confidence: number;
  /** why this decision was reached (audit). */
  rationale: string;
}

export type ClassifyFn = (text: string) => Promise<RouteClassified>;

const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isCjk = (v: string): boolean => /[\u4e00-\u9fff]/.test(v);
const CJK_VERBS_START = ACTION_VERBS.filter(isCjk).sort((a, b) => b.length - a.length); // longest first
const CJK_VERBS_ANY = CJK_VERBS_START.filter((v) => v.length >= 2); // multi-char only: single chars over-match in prose ("信用" contains "用")
const ASCII_VERBS = ACTION_VERBS.filter((v) => /^[a-z]/.test(v));

/**
 * Start-of-text verb detection.
 * CJK verbs need no delimiter (动宾结构: "检查抽屉"); ASCII verbs require a
 * word boundary / delimiter ("Follow her").
 */
const VERB_PATTERN = new RegExp(
  `^\\s*(?:(${CJK_VERBS_START.map(escape).join('|')})|(${ASCII_VERBS.map(escape).join('|')})(?=\\s|$|[.,!?;:'"()]))`,
  'i'
);
/** Any verb anywhere: ASCII with \b, CJK multi-char by containment (no \b for CJK). */
const ANY_ASCII_VERB = new RegExp(`\\b(${ASCII_VERBS.map(escape).join('|')})\\b`, 'i');
const ANY_CJK_VERB = new RegExp(`${CJK_VERBS_ANY.map(escape).join('|')}`);
const ENTITY_PATTERN = new RegExp(`${ENTITIES.map(escape).join('|')}`, 'i');

/** Deterministic classification — offline, fast, and the default path. */
export function classifyDeterministic(text: string): RouteClassified {
  const trimmed = text.trim();
  const verbAtStart = VERB_PATTERN.test(trimmed);
  const anyVerb = ANY_ASCII_VERB.test(trimmed) || ANY_CJK_VERB.test(trimmed);
  const hasEntity = ENTITY_PATTERN.test(trimmed);
  const isShort = trimmed.length <= 24;

  if (verbAtStart) {
    return {
      inputClass: 'user_structured',
      classification: 'explicit action instruction',
      confidence: 0.9,
      rationale: 'text starts with a known action verb',
    };
  }
  if (anyVerb && hasEntity && isShort) {
    return {
      inputClass: 'user_structured',
      classification: 'short verb+entity instruction',
      confidence: 0.72,
      rationale: 'action verb and known entity in a short utterance',
    };
  }
  // Conservative default: ambiguous text belongs to the interpretive (LLM) path.
  return {
    inputClass: 'user_open',
    classification: hasEntity ? 'ambiguous utterance mentioning an entity' : 'free-form utterance',
    confidence: hasEntity ? 0.6 : 0.55,
    rationale: verbAtStart ? '' : 'no reliable structured signal',
  };
}

/**
 * Classify with an optional LLM second opinion for ambiguous inputs.
 * Deterministic result is used unless the input is clearly ambiguous AND an
 * LLM classifier was provided. The LLM is never required for the golden gate.
 */
export async function classifyInput(
  text: string,
  opts: { llm?: ClassifyFn; preferLlm?: boolean } = {}
): Promise<RouteClassified> {
  const det = classifyDeterministic(text);
  if (!opts.preferLlm || !opts.llm || det.inputClass === 'user_structured') return det;
  return opts.llm(text);
}

/* ------------------------------------------------------------------ */
/* Threshold calibration                                               */
/* ------------------------------------------------------------------ */

/**
 * Threshold θ semantics (classification layer):
 *   structured & confidence ≥ θ → trust the classifier → `deterministic_parse`;
 *   otherwise (open, or ambiguous structured) → `llm_interpretation`.
 * The conservative default is to spend one LLM request rather than parse
 * garbage into state (POSITIONING.md §4.1 — LLM-first). `clarify` does NOT
 * belong to the classification layer — it belongs to the interpretation
 * layer (Stage A2/A5, where confidence is about meaning, not about routing).
 * Calibrated on the golden set (see classifier.test.ts).
 */
export const DEFAULT_THRESHOLD = 0.7;

/** Decide which interpretation path a classification takes. */
export function choosePath(
  c: RouteClassified,
  theta: number = DEFAULT_THRESHOLD
): RoutePath {
  return c.inputClass === 'user_structured' && c.confidence >= theta ? 'deterministic_parse' : 'llm_interpretation';
}

/** Keep REASON_CODES referenced so the frozen vocabulary stays linked. */
export const FROZEN_REASON_CODES: readonly ReasonCode[] = REASON_CODES;
