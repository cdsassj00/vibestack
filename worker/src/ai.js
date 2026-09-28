/**
 * /ai — 보드의 AI 과정 구성이 부르는 OpenRouter 중계.
 * OpenRouter 키(OPENROUTER_API_KEY)는 Worker 비밀값에만 두고, 브라우저는 이 주소만 부른다.
 * 모델·출력 형식은 여기서 정하고 요청이 바꿀 수 없다. 허용한 사이트 주소에서 온 요청만 받는다.
 */
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_CHARS = 60000;
const MAX_MESSAGES = 4;
const MAX_TOKENS = 4000;

// 응답 JSON 형식 (curriculum/ai-planner.js 의 checkPlan·mergeExamples 가 읽는 모양)
const str = { type: 'string' };
const obj = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const SCHEMAS = {
  plan: obj({
    name: str,
    summary: str,
    days: { type: 'array', items: obj({ am: { type: 'array', items: str }, pm: { type: 'array', items: str } }) },
    reasons: { type: 'array', items: obj({ id: str, text: str }) }
  }),
  examples: obj({
    items: { type: 'array', items: obj({ id: str, picks: { type: 'array', items: { type: 'integer' } }, memo: str }) }
  })
};

const SITE_ORIGINS = ['https://ag-firebase-board-2026.web.app', 'https://ag-firebase-board-2026.firebaseapp.com'];
const PREVIEW_ORIGIN = /^https:\/\/ag-firebase-board-2026--[a-z0-9-]+\.web\.app$/;
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function allowedOrigin(origin, env) {
  if (!origin) return false;
  const extra = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return SITE_ORIGINS.includes(origin) || extra.includes(origin) || PREVIEW_ORIGIN.test(origin) || LOCAL_ORIGIN.test(origin);
}

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin'
  };
}

function reply(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...(origin ? cors(origin) : {}) } });
}

function validMessages(m) {
  if (!Array.isArray(m) || !m.length || m.length > MAX_MESSAGES) return false;
  let total = 0;
  for (let i = 0; i < m.length; i++) {
    const x = m[i];
    const role = i % 2 === 0 ? 'user' : 'assistant';
    if (!x || x.role !== role || typeof x.content !== 'string' || !x.content) return false;
    total += x.content.length;
  }
  return total <= MAX_CHARS && m[m.length - 1].role === 'user';
}

export async function handleAi(request, env) {
  const origin = request.headers.get('Origin') || '';
  const okOrigin = allowedOrigin(origin, env);
  if (request.method === 'OPTIONS') return new Response(null, { status: okOrigin ? 204 : 403, headers: okOrigin ? cors(origin) : {} });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST, OPTIONS' } });
  if (!okOrigin) return reply({ error: 'forbidden_origin' }, 403);

  if (env.AI_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.AI_LIMITER.limit({ key: ip });
    if (!success) return reply({ error: 'rate_limited' }, 429, origin);
  }
  if (!env.OPENROUTER_API_KEY) return reply({ error: 'not_configured' }, 503, origin);

  const raw = await request.text();
  if (raw.length > MAX_CHARS * 2) return reply({ error: 'too_large' }, 413, origin);
  let body;
  try { body = JSON.parse(raw); } catch { return reply({ error: 'bad_json' }, 400, origin); }
  const schema = SCHEMAS[body?.kind];
  if (!schema || !validMessages(body.messages)) return reply({ error: 'bad_request' }, 400, origin);

  let res;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_ORIGINS[0],
        'X-Title': 'VibeStack AI course planner'
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || 'google/gemini-3.5-flash',
        messages: body.messages,
        response_format: { type: 'json_schema', json_schema: { name: body.kind, strict: true, schema } },
        temperature: 0.4,
        max_tokens: MAX_TOKENS
      })
    });
  } catch (e) {
    return reply({ error: 'upstream_unreachable' }, 502, origin);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const code = res.status === 402 ? 'no_credit' : res.status === 429 ? 'rate_limited' : 'upstream_error';
    return reply({ error: code, status: res.status, message: data?.error?.message || '' }, res.status === 429 ? 429 : 502, origin);
  }
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || !text) return reply({ error: 'empty_response' }, 502, origin);
  return reply({ text, model: data.model || '', usage: data.usage || null }, 200, origin);
}
