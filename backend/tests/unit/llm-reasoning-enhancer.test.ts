import assert from 'node:assert/strict';
import test from 'node:test';
import { LlmReasoningEnhancer } from '../../src/infrastructure/reasoning/llm-reasoning-enhancer.js';
import { WaterReasoningEngine } from '../../src/infrastructure/reasoning/water-reasoning-engine.js';
import type { ReasoningInput } from '../../src/infrastructure/reasoning/reasoning.types.js';

const input: ReasoningInput = {
  decisionCaseId: 'CASE-LLM-001',
  evaluatedAt: '2026-09-07T03:00:00Z',
  fieldPulse: { evidenceId: 'FIELD-1', observedAt: '2026-09-07T02:59:00Z', waterPresence: 'limited', irrigationFlow: 'not_flowing' },
};

test('uses deterministic fallback when LLM is disabled', async () => {
  const baseline = new WaterReasoningEngine().evaluate(input);
  const result = await new LlmReasoningEnhancer(undefined, 'gemini-2.5-flash', false).enhance(input, baseline, null);
  assert.equal(result.generation?.mode, 'deterministic_fallback');
  assert.deepEqual(result.actionOptions, baseline.actionOptions);
});

test('rejects unsafe generated quantities and preserves baseline options', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ summary: 'Kondisi perlu ditinjau.', options: [{ title: 'Pompa', description: 'Pompa selama 2 jam.', rationale: 'Air terbatas.' }, { title: 'Cek', description: 'Periksa petak.', rationale: 'Data lapangan.' }] }) }] } }] }), { status: 200 });
  try {
    const baseline = new WaterReasoningEngine().evaluate(input);
    const result = await new LlmReasoningEnhancer('test-key', 'gemini-2.5-flash', true).enhance(input, baseline, null);
    assert.equal(result.generation?.mode, 'deterministic_fallback');
    assert.deepEqual(result.actionOptions, baseline.actionOptions);
  } finally { globalThis.fetch = originalFetch; }
});
