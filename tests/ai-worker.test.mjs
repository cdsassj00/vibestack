// Worker /ai(OpenRouter 중계) 검사: node tests/ai-worker.test.mjs
// OpenRouter 호출은 가짜 fetch로 바꿔 요청 모양과 보호 규칙을 확인한다.
import assert from 'node:assert/strict';
import worker from '../worker/src/index.js';

const SITE = 'https://ag-firebase-board-2026.web.app';
const URL_AI = 'https://example.workers.dev/ai';
let sent = null;
let upstream = { status: 200, body: { model: 'google/gemini-3.5-flash', choices: [{ message: { content: '{"name":"x","summary":"","days":[],"reasons":[]}' } }] } };
globalThis.fetch = async (url, init) => {
  sent = { url, init, body: JSON.parse(init.body) };
  return new Response(JSON.stringify(upstream.body), { status: upstream.status, headers: { 'Content-Type': 'application/json' } });
};
const env = { OPENROUTER_API_KEY: 'sk-test', OPENROUTER_MODEL: 'google/gemini-3.5-flash' };
const post = (body, origin = SITE, e = env) => worker.fetch(new Request(URL_AI, {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, body: typeof body === 'string' ? body : JSON.stringify(body)
}), e);
const msg = [{ role: 'user', content: '과정표를 만들어 주세요.' }];
let n = 0;
const test = async (name, fn) => { await fn(); n++; console.log('ok', name); };

await test('정상 호출: 모델·형식은 Worker가 정한다', async () => {
  const res = await post({ kind: 'plan', messages: msg, model: 'openai/gpt-5.5-pro' });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), SITE);
  const data = await res.json();
  assert.match(data.text, /"days"/);
  assert.equal(sent.url, 'https://openrouter.ai/api/v1/chat/completions');
  assert.equal(sent.init.headers.Authorization, 'Bearer sk-test');
  assert.equal(sent.body.model, 'google/gemini-3.5-flash');
  assert.equal(sent.body.response_format.json_schema.name, 'plan');
  assert.ok(sent.body.max_tokens <= 4000);
});
await test('미리보기·로컬 주소 허용, 다른 주소 거부', async () => {
  assert.equal((await post({ kind: 'examples', messages: msg }, 'https://ag-firebase-board-2026--pr4-abc-123.web.app')).status, 200);
  assert.equal((await post({ kind: 'plan', messages: msg }, 'http://localhost:5173')).status, 200);
  assert.equal((await post({ kind: 'plan', messages: msg }, 'https://evil.example.com')).status, 403);
  assert.equal((await post({ kind: 'plan', messages: msg }, '')).status, 403);
});
await test('preflight', async () => {
  const ok = await worker.fetch(new Request(URL_AI, { method: 'OPTIONS', headers: { Origin: SITE } }), env);
  assert.equal(ok.status, 204);
  const bad = await worker.fetch(new Request(URL_AI, { method: 'OPTIONS', headers: { Origin: 'https://evil.example.com' } }), env);
  assert.equal(bad.status, 403);
});
await test('요청 검사: 형식·메시지 순서·크기', async () => {
  assert.equal((await post({ kind: 'free', messages: msg })).status, 400);
  assert.equal((await post({ kind: 'plan', messages: [{ role: 'assistant', content: 'x' }] })).status, 400);
  assert.equal((await post({ kind: 'plan', messages: Array(5).fill(0).map((_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'x' })) })).status, 400);
  assert.equal((await post({ kind: 'plan', messages: [{ role: 'user', content: 'x'.repeat(60001) }] })).status, 400);
  assert.equal((await post('{')).status, 400);
});
await test('키가 없으면 503 not_configured', async () => {
  const res = await post({ kind: 'plan', messages: msg }, SITE, {});
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, 'not_configured');
});
await test('호출 수 제한', async () => {
  const res = await post({ kind: 'plan', messages: msg }, SITE, { ...env, AI_LIMITER: { limit: async () => ({ success: false }) } });
  assert.equal(res.status, 429);
});
await test('OpenRouter 오류 전달', async () => {
  upstream = { status: 402, body: { error: { message: 'Insufficient credits' } } };
  const res = await post({ kind: 'plan', messages: msg });
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, 'no_credit');
});
console.log(`\n${n} tests passed`);
