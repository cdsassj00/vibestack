/**
 * MCP 서버 (Streamable HTTP, 상태 없음) — POST /mcp 로 JSON-RPC 메시지를 받고 JSON으로 답한다.
 * 서버 알림(SSE)은 쓰지 않으므로 GET 은 405 를 돌려준다.
 */
import { TOOLS, UserError } from './tools.js';

const SERVER = { name: 'vibestack', title: 'VibeStack 교육과정 데이터', version: '1.0.0' };
const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const MAX_BODY = 64 * 1024;
const INSTRUCTIONS = [
  'VibeStack은 AI 강사용 교육과정 설계 데이터입니다. 두 보드가 있습니다.',
  '- work: AI 업무활용 보드. 가로 업무 영역(리서치·문서·콘텐츠·데이터·업무처리), 세로 AI 활용 방법(L1 대화창 안, L2 전용 AI 서비스, L3 AI가 준 코드 실행, L4 코딩에이전트로 구축).',
  '- vibe: AI 바이브코딩 보드. 가로 만드는 방식(챗 AI 결과물·앱 생성 서비스·에이전트 서비스·코딩에이전트), 세로 구조 단계(S1 로컬 실행~S5 AI 기능 연결).',
  '과정을 짤 때는 search_modules나 get_matrix로 모듈을 고르고, get_module로 실습 예시를 확인하고, check_course로 검사합니다.',
  '폐쇄망 기관이면 외부망 필요 모듈 대신 closed_network_alternative 모듈을 씁니다.'
].join('\n');

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
        return ok(msg.id, { content: [{ type: 'text', text: JSON.stringify(data, null, 1) }], structuredContent: Array.isArray(data) ? { items: data } : data, isError: false });
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
