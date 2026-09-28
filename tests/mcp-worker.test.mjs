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
  assert.deepEqual(names, ['design_course', 'search_modules', 'get_module', 'find_practices', 'get_design_guide', 'get_matrix', 'list_presets', 'check_course', 'lookup_term', 'recommend_stack']);
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
await test('design_course: 요청 문장만으로 설계', async () => {
  const r = (await call('design_course', { request: '조달청 직원 대상 3일 AI 과정, 계약 검토·법령 업무 중심' })).structuredContent;
  assert.equal(r.sessions.length, 3);
  const items = r.sessions.flatMap(d => [...d.morning, ...d.afternoon]);
  assert.equal(items.length, 18);
  assert.equal(new Set(items.map(m => m.id)).size, 18);
  assert.ok(items.some(m => m.id === 'R7'), '법령 검색이 들어가야 합니다');
  assert.ok(items.slice(0, 3).some(m => m.id.startsWith('O')), '공통 기반으로 시작합니다');
  assert.ok(items.every(m => m.what && m.how && m.practice.length === 3 && m.internet));
  assert.match(r.understood.internet, /망분리/);   // 공공기관이라 망분리로 추정
  assert.ok(r.understood.guessed.includes('internet'));
  assert.ok(items.filter(m => m.internet.startsWith('외부 서비스 필요')).length <= 9);
  assert.equal(r.check.ok, true);
  assert.match(r.board_url, /\/curriculum\/#plan=[^/]+\/[^/]+\/[^/]+$/);
  assert.match(r.table_markdown, /\| 3일차 \|/);
});
await test('design_course: 폐쇄망·특강·바이브코딩·인자 우선', async () => {
  const closed = (await call('design_course', { request: '인터넷이 안 되는 내부망 기관 이틀 교육' })).structuredContent;
  assert.match(closed.understood.internet, /불가/);
  assert.ok(closed.sessions.flatMap(d => [...d.morning, ...d.afternoon]).every(m => !m.internet.startsWith('외부 서비스 필요')));
  const talk = (await call('design_course', { request: '시청 홍보팀 2시간 생성형 AI 특강' })).structuredContent;
  assert.equal(talk.sessions.length, 1);
  assert.equal(talk.sessions[0].items.length, 3);
  assert.match(talk.understood.audience, /홍보/);
  assert.equal(talk.check.ok, true);
  const vibe = (await call('design_course', { request: '비전공자 대상 바이브코딩으로 웹앱 만드는 2일 과정' })).structuredContent;
  assert.match(vibe.board_url, /\/vibecoding\/#plan=/);
  assert.match(vibe.understood.goal, /웹앱/);
  const over = (await call('design_course', { request: '공무원 AI 교육', days: 2, internet: 'yes', goal: 'build_tools', experience: 'developer', include: ['O4'], exclude: ['O7'] })).structuredContent;
  const ids = over.sessions.flatMap(d => [...d.morning, ...d.afternoon]).map(m => m.id);
  assert.equal(over.sessions.length, 2);
  assert.match(over.understood.internet, /가능/);
  assert.ok(ids.includes('O4') && !ids.includes('O7'));
  assert.equal(ids.at(-1), 'O4', '여러 날 과정은 프로젝트로 끝납니다');
});
await test('design_course: API·코랩 실습은 L3', async () => {
  const r = (await call('design_course', { request: '오픈라우터 API로 이미지 영상 일괄 생성하는 코랩 실습 2일' })).structuredContent;
  const ids = r.sessions.flatMap(d => [...d.morning, ...d.afternoon]).map(m => m.id);
  assert.match(r.understood.goal, /코드/);
  assert.ok(ids.includes('C17') && ids.includes('O13'));
});
await test('search_modules: 폐쇄망 문장 인식', async () => {
  const r = (await call('search_modules', { query: '인터넷 안 되는 곳에서 회의록 정리' })).structuredContent;
  assert.ok(r.total > 0 && r.modules.every(m => m.network !== '외부망 필요'));
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
