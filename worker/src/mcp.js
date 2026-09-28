/**
 * MCP 서버 (Streamable HTTP, 상태 없음) — POST /mcp 로 JSON-RPC 메시지를 받고 JSON으로 답한다.
 * 서버 알림(SSE)은 쓰지 않으므로 GET 은 405 를 돌려준다.
 */
import { TOOLS, UserError } from './tools.js';

const SERVER = { name: 'vibestack', title: 'VibeStack 교육과정 데이터', version: '1.1.0' };
const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const MAX_BODY = 64 * 1024;
const INSTRUCTIONS = [
  'VibeStack은 AI 강사가 만든 생성형 AI 교육과정 설계 데이터입니다. 공공기관·기업 직원 대상 AI 업무활용 교육과 바이브코딩(AI로 업무 도구·웹앱 만들기) 교육의 교육 내용, 실습 과제, 적용 사례, 예시 과정이 들어 있습니다.',
  '사용자는 이 사이트의 용어(L1, S1, 보드, 모듈 id)를 모릅니다. 사용자 문장을 그대로 넘기고, 답할 때 용어는 풀어서 씁니다.',
  '- 교육과정·커리큘럼·특강 설계 요청: design_course에 사용자 문장을 request로 그대로 넣어 한 번 부릅니다. understood가 틀렸을 때만 그 항목을 인자로 고쳐 다시 부릅니다.',
  '- 실습 과제나 적용 사례만 필요할 때: find_practices. 특정 주제·도구를 다루는 교육 내용: search_modules. 상세: get_module에 ids로 한 번에.',
  '- 교육 체계나 L1~L4 같은 표기를 설명할 때: get_design_guide.',
  '- 바이브코딩 용어·오류 메시지: lookup_term. 만들 프로그램의 기술 조합: recommend_stack.',
  '모든 도구는 1초 안에 끝나고 결과가 정해져 있으니 같은 내용을 반복해서 부르지 않습니다. 답에는 board_url(과정표를 사이트에서 여는 링크)을 함께 알려 줍니다.'].join('\n');

const toolList = TOOLS.map(t => ({
  name: t.name, title: t.title, description: t.description, inputSchema: t.inputSchema,
  annotations: { title: t.title, readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
}));
const toolByName = Object.fromEntries(TOOLS.map(t => [t.name, t]));

const ok = (id, result) => ({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

function handle(msg, ctx) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return fail(msg?.id, -32600, 'Invalid Request');
  const isNotification = msg.id === undefined || msg.id === null;
  if (isNotification) return null;
  const p = msg.params || {};
  switch (msg.method) {
    case 'initialize': {
      const v = VERSIONS.includes(p.protocolVersion) ? p.protocolVersion : VERSIONS[0];
      return ok(msg.id, { protocolVersion: v, capabilities: { tools: { listChanged: false } }, serverInfo: SERVER, instructions: INSTRUCTIONS });
    }
    case 'ping':
      return ok(msg.id, {});
    case 'tools/list':
      return ok(msg.id, { tools: toolList });
    case 'tools/call': {
      const tool = toolByName[p.name];
      if (!tool) return fail(msg.id, -32602, `Unknown tool: ${p.name}`);
      try {
        const data = tool.run(p.arguments || {}, ctx);
        return ok(msg.id, { content: [{ type: 'text', text: JSON.stringify(data) }], structuredContent: Array.isArray(data) ? { items: data } : data, isError: false });
      } catch (e) {
        const text = e instanceof UserError ? e.message : '도구 실행 중 오류가 났습니다.';
        if (!(e instanceof UserError)) console.error(e);
        return ok(msg.id, { content: [{ type: 'text', text }], isError: true });
      }
    }
    default:
      return fail(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id'
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });

// MCP_TOKEN 비밀값이 있으면 그 키를 가진 요청만 받는다 (Authorization: Bearer 또는 ?key=)
function authorized(request, env) {
  if (!env.MCP_TOKEN) return true;
  const url = new URL(request.url);
  const bearer = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  return bearer === env.MCP_TOKEN || url.searchParams.get('key') === env.MCP_TOKEN;
}

export async function handleMcp(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST, OPTIONS', ...CORS } });
  if (!authorized(request, env)) return json(fail(null, -32001, 'Unauthorized'), 401);
  const text = await request.text();
  if (text.length > MAX_BODY) return json(fail(null, -32600, 'Request too large'), 413);
  let body;
  try { body = JSON.parse(text); } catch { return json(fail(null, -32700, 'Parse error'), 400); }
  const ctx = { site: (env.SITE_URL || 'https://ag-firebase-board-2026.web.app').replace(/\/$/, '') };
  if (Array.isArray(body)) {
    const out = body.map(m => handle(m, ctx)).filter(Boolean);
    return out.length ? json(out) : new Response(null, { status: 202, headers: CORS });
  }
  const out = handle(body, ctx);
  return out ? json(out) : new Response(null, { status: 202, headers: CORS });
}
