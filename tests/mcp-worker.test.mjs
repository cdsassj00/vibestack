// MCP Worker 검사: node tests/mcp-worker.test.mjs
// Worker의 fetch 핸들러에 JSON-RPC 요청을 직접 넣어 도구 목록과 각 도구 결과를 확인한다.
import assert from 'node:assert/strict';
import worker from '../worker/src/index.js';

const URL_MCP = 'https://example.workers.dev/mcp';
let id = 0;
async function rpc(method, params, env = {}, headers = {}) {
  const res = await worker.fetch(new Request(URL_MCP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...headers },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params })
  }), env);
  return { status: res.status, body: res.status === 202 ? null : await res.json() };
}
const call = async (name, args) => {
  const r = await rpc('tools/call', { name, arguments: args });
  assert.equal(r.status, 200);
  return r.body.result;
};
let n = 0;
const test = async (name, fn) => { await fn(); n++; console.log('ok', name); };

await test('initialize', async () => {
  const r = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '0' } });
  assert.equal(r.body.result.protocolVersion, '2025-06-18');
  assert.ok(r.body.result.capabilities.tools);
  const u = await rpc('initialize', { protocolVersion: '1999-01-01' });
  assert.equal(u.body.result.protocolVersion, '2025-11-25');
});
await test('notification → 202', async () => {
  const res = await worker.fetch(new Request(URL_MCP, { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) }), {});
  assert.equal(res.status, 202);
});
await test('GET → 405, 다른 경로 404', async () => {
  assert.equal((await worker.fetch(new Request(URL_MCP), {})).status, 405);
  assert.equal((await worker.fetch(new Request('https://example.workers.dev/x'), {})).status, 404);
});
await test('tools/list', async () => {
  const r = await rpc('tools/list', {});
  const names = r.body.result.tools.map(t => t.name);
  assert.deepEqual(names, ['draft_course', 'search_modules', 'get_module', 'find_practices', 'get_design_guide', 'get_matrix', 'list_presets', 'check_course', 'lookup_term', 'recommend_stack']);
  r.body.result.tools.forEach(t => { assert.equal(t.inputSchema.type, 'object'); assert.equal(t.annotations.readOnlyHint, true); });
});
await test('search_modules', async () => {
  const r = await call('search_modules', { query: '회의록', board: 'work' });
  assert.ok(r.structuredContent.total > 0);
  assert.ok(r.structuredContent.modules.every(m => m.board === 'work'));
  assert.ok(r.structuredContent.module_url.includes('/curriculum/#m={id}'));
  // 낱말이 모두 맞지 않아도 관련도 순으로 돌려준다
  const loose = await call('search_modules', { query: '계약서를 비교하는 실습', board: 'work' });
  assert.equal(loose.structuredContent.modules[0].id, 'D11');
  const byTool = await call('search_modules', { tool: 'NotebookLM', board: 'work' });
  assert.ok(byTool.structuredContent.modules.some(m => m.id === 'R2'));
  const closed = await call('search_modules', { board: 'work', row: 2, network: 'closed' });
  assert.ok(closed.structuredContent.modules.every(m => m.network !== '외부망 필요'));
  const vibe = await call('search_modules', { board: 'vibe', column: 'K', row: 5 });
  assert.ok(vibe.structuredContent.total >= 2);
});
await test('get_module', async () => {
  const r = await call('get_module', { id: 'r2' });
  assert.equal(r.structuredContent.id, 'R2');
  assert.ok(r.structuredContent.examples.length >= 5);
  assert.ok(r.structuredContent.closed_network_alternative?.id);
  const v = await call('get_module', { id: 'VK10' });
  assert.ok(v.structuredContent.diagram.edges.length >= 3);
  assert.ok(r.structuredContent.next_steps.length >= 1);
  const many = await call('get_module', { ids: ['R2', 'd1', 'ZZ9'] });
  assert.deepEqual(many.structuredContent.modules.map(m => m.id), ['R2', 'D1']);
  assert.deepEqual(many.structuredContent.missing, ['ZZ9']);
  const bad = await call('get_module', { id: 'ZZ9' });
  assert.equal(bad.isError, true);
});
await test('draft_course', async () => {
  const r = (await call('draft_course', { board: 'work', days: 3, topic: '조달청 계약 검토 법령 규격서', network: 'external', level: 'basic', name: '조달 실무' })).structuredContent;
  assert.equal(r.days.length, 3);
  const ids = r.days.flatMap(d => [...d.am, ...d.pm]);
  assert.equal(ids.length, 18);
  assert.equal(new Set(ids.map(m => m.id)).size, 18);
  assert.ok(ids.some(m => m.id === 'R7'), '법령 검색 모듈이 들어가야 합니다');
  const closed = (await call('draft_course', { board: 'work', days: 2, topic: '회의록 보고서', network: 'closed', level: 'basic' })).structuredContent;
  assert.ok(closed.days.flatMap(d => [...d.am, ...d.pm]).every(m => m.network !== '외부망 필요'));
  assert.equal(closed.check.ok, true);
  assert.ok(ids.every(m => m.examples.length === 3));
  assert.equal(r.check.ok, true);
  assert.match(r.board_url, /\/curriculum\/#plan=[^/]+\/[^/]+\/[^/]+&name=/);
  assert.match(r.table_markdown, /\| 3일차 \|/);
  const mixed = (await call('draft_course', { board: 'work', days: 2, network: 'mixed', level: 'advanced' })).structuredContent;
  const m2 = mixed.days.flatMap(d => [...d.am, ...d.pm]);
  assert.ok(m2.filter(m => m.network === '외부망 필요').length <= m2.length / 2);
  const build = (await call('draft_course', { board: 'vibe', days: 2, level: 'build', per_slot: 2, include: ['VO2'], exclude: ['VK10'] })).structuredContent;
  const b2 = build.days.flatMap(d => [...d.am, ...d.pm]).map(m => m.id);
  assert.ok(b2.includes('VO2') && !b2.includes('VK10'));
  assert.equal(b2.at(-1), 'VO7', '여러 날 과정은 프로젝트 모듈로 끝납니다');
});
await test('find_practices', async () => {
  const r = (await call('find_practices', { query: '계약서 비교', kind: 'examples', limit: 5 })).structuredContent;
  assert.ok(r.results.length >= 3);
  assert.ok(r.results[0].text.includes('계약서'));
  const c = (await call('find_practices', { query: '민원', kind: 'cases', network: 'closed' })).structuredContent;
  assert.ok(c.results.every(x => x.type !== 'example' && x.network !== '외부망 필요'));
});
await test('get_design_guide', async () => {
  const r = (await call('get_design_guide', { board: 'work' })).structuredContent.items;
  assert.equal(r.length, 1);
  assert.match(r[0].row_rule, /쓰는 화면/);
  assert.ok(r[0].levels.build);
});
await test('get_matrix', async () => {
  const r = await call('get_matrix', { board: 'work' });
  assert.equal(r.structuredContent.rows.axis, 'AI 활용 방법');
  assert.equal(r.structuredContent.cells.length, 5 * 4);
  const v = await call('get_matrix', { board: 'vibe' });
  assert.equal(v.structuredContent.cells.length, 4 * 5);
});
await test('list_presets', async () => {
  const r = await call('list_presets', { board: 'work' });
  assert.ok(r.structuredContent.items.length >= 4);
  assert.ok(r.structuredContent.items.every(p => p.days.every(d => d.am.every(x => !x.includes('(없는 모듈)')))));
  assert.ok(r.structuredContent.items[0].board_url.includes('#plan='));
});
await test('check_course', async () => {
  const good = await call('check_course', { board: 'work', network: 'external', expected_days: 1, days: [{ am: ['O1', 'D1'], pm: ['R3', 'O6'] }] });
  assert.equal(good.structuredContent.ok, true);
  assert.match(good.structuredContent.board_url, /#plan=O1,D1;R3,O6$/);
  const bad = await call('check_course', { board: 'work', network: 'closed', expected_days: 2, days: [{ am: ['R2', 'XX1', 'D1'], pm: ['D1'] }] });
  const p = bad.structuredContent.problems.join('\n');
  assert.match(p, /일수/); assert.match(p, /XX1/); assert.match(p, /폐쇄망/); assert.match(p, /이미 넣은/);
});
await test('lookup_term', async () => {
  const r = await call('lookup_term', { query: 'CORS' });
  assert.ok(r.structuredContent.results.length >= 1);
  const e = await call('lookup_term', { query: 'ModuleNotFoundError', kind: 'error' });
  assert.equal(e.structuredContent.results[0].kind, 'error');
});
await test('recommend_stack', async () => {
  const r = await call('recommend_stack', { answers: { what: 'web', who: 'team' } });
  assert.match(r.structuredContent.stage, /^S\d/);
  assert.ok(r.structuredContent.start_prompt.length > 50);
  const bad = await call('recommend_stack', { answers: { what: 'nope' } });
  assert.equal(bad.isError, true);
});
await test('MCP_TOKEN 설정 시 키 검사', async () => {
  const env = { MCP_TOKEN: 's3cret' };
  assert.equal((await rpc('tools/list', {}, env)).status, 401);
  assert.equal((await rpc('tools/list', {}, env, { Authorization: 'Bearer s3cret' })).status, 200);
});
await test('잘못된 JSON·없는 메서드', async () => {
  const res = await worker.fetch(new Request(URL_MCP, { method: 'POST', body: '{' }), {});
  assert.equal(res.status, 400);
  const r = await rpc('nope/method', {});
  assert.equal(r.body.error.code, -32601);
});
console.log(`\n${n} tests passed`);
