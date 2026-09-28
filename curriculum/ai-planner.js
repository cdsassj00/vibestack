/**
 * AI 과정 구성 — 조건을 받아 AI 모델(Worker /ai → OpenRouter)로 과정표 초안을 만든다.
 * 두 보드가 board.js를 거쳐 함께 쓴다.
 *
 * 컨텍스트는 네 층으로 넣는다.
 *   1) 설계 규칙과 출력 형식  2) 예시 과정(PRESETS)  3) 조건에 맞춰 코드로 거른 모듈 목록(한 줄씩)  4) 사용자 조건
 * 호출은 두 번이다.
 *   1차: 모듈을 골라 일차·오전·오후에 배치한다. 코드가 id·망 환경·일수를 검사하고, 틀리면 한 번 다시 묻는다.
 *   2차: 고른 모듈의 실습 예시만 넣고, 모듈마다 예시 2~3개와 기관에 맞춘 실습 한 줄을 받는다.
 * /ai 를 쓸 수 없을 때는 1차 프롬프트를 복사해 다른 챗 AI에 넣고, 받은 JSON을 붙여 넣어 같은 검사를 거친다.
 */
import { AI_CONFIG } from './ai-config.js';

const NET = { E: '외부망 필요', B: '폐쇄망 대안 있음', I: '외부망 준비 후 반입' };
const GRADE = { 1: '입문', 2: '기초', 3: '중급', 4: '심화', 5: '프로젝트' };
const NETCOND = { ext: '외부망(인터넷 사용 가능)', closed: '폐쇄망(인터넷 사용 불가)', mixed: '혼합(교육장은 외부망, 현업은 폐쇄망)' };
const LEVEL = {
  intro: ['입문', '처음 배우는 사람 중심. 입문·기초 난이도 위주로 고릅니다.'],
  work: ['실무', '기본 사용 경험이 있는 사람. 기초·중급 위주로 고릅니다.'],
  adv: ['심화', '직접 만들고 구축하려는 사람. 중급·심화·프로젝트 위주로 고릅니다.']
};
const MAX_PER_SLOT = 6;

// ==========================================
// 1. 컨텍스트 조립 (DOM 없이 동작한다)
// ==========================================

// 조건에 맞는 모듈만 남긴다. 폐쇄망이면 외부망 필요 모듈을 빼고, 직무를 고르면 해당 직무와 공통 모듈만 남긴다.
export function allowedModules(ctx, cond) {
  const uni = ctx.cfg.universalTrack;
  return ctx.mods.filter(m => {
    if (cond.net === 'closed' && m.n === 'E') return false;
    if (cond.tracks.length && !m.k.some(k => cond.tracks.includes(k)) && !(uni && m.k.includes(uni))) return false;
    return true;
  });
}

function colName(ctx, d) {
  return ctx.cfg.cols[d]?.[0] || d;
}

function rowName(ctx, l) {
  return `${ctx.cfg.rowPrefix || 'L'}${l} ${ctx.cfg.rows[l]?.[0] || ''}`;
}

function catalogText(ctx, list) {
  const order = [ctx.cfg.base?.key, ...ctx.cfg.colOrder].filter(Boolean);
  const lines = [];
  for (const d of order) {
    for (const l of ctx.cfg.rowOrder) {
      const cell = list.filter(m => m.d === d && m.l === l);
      if (!cell.length) continue;
      lines.push(`[${colName(ctx, d)} × ${rowName(ctx, l)}]`);
      cell.forEach(m => {
        const tracks = m.k.map(k => ctx.cfg.tracks[k] || k).join('·');
        lines.push(`${m.id} | ${m.t} | ${GRADE[m.g]} | ${NET[m.n]} | 산출물: ${m.out || '-'} | 도구: ${m.s.slice(0, 4).join(', ')} | 대상: ${tracks}`);
      });
    }
  }
  return lines.join('\n');
}

function presetText(ctx) {
  return Object.values(ctx.presets).map(p => {
    const days = p.days.map((d, i) => `${i + 1}일차 오전: ${d.am.join(', ')} / 오후: ${d.pm.join(', ')}`).join('\n');
    return `예시 "${p.name}"\n${days}`;
  }).join('\n\n');
}

function axisText(ctx) {
  const cols = [ctx.cfg.base?.key, ...ctx.cfg.colOrder].filter(Boolean).map(d => `- ${d}: ${ctx.cfg.cols[d][0]} (${ctx.cfg.cols[d][1]})`).join('\n');
  const rows = ctx.cfg.rowOrder.map(l => `- ${rowName(ctx, l)}: ${ctx.cfg.rows[l][1]}. ${ctx.cfg.rows[l][2] || ''}`).join('\n');
  return `가로축 ${ctx.cfg.colAxisName}\n${cols}\n세로축 ${ctx.cfg.rowAxisName} (숫자가 클수록 어렵습니다)\n${rows}`;
}

function condText(ctx, cond) {
  const tracks = cond.tracks.length ? cond.tracks.map(k => ctx.cfg.tracks[k]).join(', ') : '지정 안 함';
  return [
    `- 기관·교육 대상: ${cond.org || '지정 안 함'}`,
    `- 직무: ${tracks}`,
    `- 교육 기간: ${cond.days}일 (하루는 오전·오후 두 칸)`,
    `- 망 환경: ${NETCOND[cond.net]}`,
    `- 수준: ${LEVEL[cond.level][0]}. ${LEVEL[cond.level][1]}`,
    `- 풀고 싶은 업무 문제: ${cond.problems || '지정 안 함'}`
  ].join('\n');
}

const PLAN_SHAPE = '{"name":"과정명","summary":"과정 설명 2문장","days":[{"am":["모듈ID"],"pm":["모듈ID"]}],"reasons":[{"id":"모듈ID","text":"고른 이유"}]}';

export function buildPlanPrompt(ctx, cond) {
  const list = allowedModules(ctx, cond);
  return `당신은 공공기관·기업 대상 ${ctx.cfg.courseName}을 설계하는 교육 설계자입니다.
아래 모듈 목록에서만 모듈을 골라 ${cond.days}일 과정표 초안을 만듭니다.

## 1. 설계 규칙
- 모듈 ID는 "모듈 목록"에 있는 것만 씁니다. 목록에 없는 ID를 만들지 않습니다.
- 과정은 정확히 ${cond.days}일입니다. days 배열 길이는 ${cond.days}입니다.
- 한 칸(오전 또는 오후, 약 3~4시간)에 모듈 2~4개를 넣습니다. 입문 과정은 5~6개까지 넣을 수 있습니다. 빈 칸을 두지 않습니다.
- 같은 모듈을 두 번 넣지 않습니다.
- 첫 칸은 공통 기반 모듈로 시작하고, 뒤로 갈수록 세로축 단계와 난이도를 높입니다.
- "풀고 싶은 업무 문제"와 직접 이어지는 모듈을 우선 고릅니다.
- 과정이 2일 이상이면 마지막 오후에 결과물을 만들거나 점검하는 모듈(프로젝트·검증)을 넣습니다.
- 폐쇄망이면 외부망 필요 모듈을 쓰지 않습니다. 혼합이면 외부망 필요 모듈은 과정 전체의 절반을 넘기지 않습니다.
- reasons는 넣은 모듈마다 한 개씩 씁니다. 업무 문제나 대상과 어떻게 이어지는지 40자 안팎의 합니다체 한 문장으로 씁니다.
- name은 과정 내용을 그대로 적은 과정명입니다. 비유, 느낌표, 과장 표현(완벽, 초고속, 압도적 등)을 쓰지 않습니다.
- summary는 대상과 결과물을 적은 합니다체 2문장입니다.

## 2. 매트릭스 축
${axisText(ctx)}

## 3. 예시 과정 (배치 방식 참고용)
${presetText(ctx)}

## 4. 모듈 목록 (ID | 이름 | 난이도 | 망 환경 | 산출물 | 도구 | 대상)
${catalogText(ctx, list)}

## 5. 이번 과정 조건
${condText(ctx, cond)}

## 출력
설명 없이 JSON 하나만 출력합니다. 형식:
${PLAN_SHAPE}`;
}

export function buildExamplePrompt(ctx, cond, plan) {
  const ids = plan.days.flatMap(d => [...d.am, ...d.pm]);
  const blocks = ids.map(id => {
    const m = ctx.byId[id];
    return `${m.id} | ${m.t} | 산출물: ${m.out || '-'}\n${m.ex.map((e, i) => `  ${i}) ${e}`).join('\n')}`;
  }).join('\n');
  return `아래 과정표의 모듈마다 이번 교육에서 다룰 실습 예시를 고릅니다.

## 규칙
- picks: 모듈마다 예시 번호 2~3개를 고릅니다. 대상과 업무 문제에 가까운 예시를 고릅니다. 번호는 각 모듈에 적힌 번호만 씁니다.
- 폐쇄망 과정이면 (외부망) 표시가 있는 예시를 피합니다.
- memo: 이 기관 대상에 맞춘 실습 과제를 합니다체 한 문장(60자 안팎)으로 씁니다. 실제 업무 이름과 결과물을 넣고, 비유와 과장 표현을 쓰지 않습니다.
- items는 아래 모듈을 모두, 같은 순서로 담습니다.

## 과정 조건
${condText(ctx, cond)}

## 과정표 모듈과 실습 예시
${blocks}

## 출력
설명 없이 JSON 하나만 출력합니다. 형식:
{"items":[{"id":"모듈ID","picks":[0,2],"memo":"맞춤 실습 과제"}]}`;
}

// ==========================================
// 2. 응답 검사
// ==========================================

export function parseJSON(text) {
  const s = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('JSON을 찾지 못했습니다.');
  return JSON.parse(s.slice(a, b + 1));
}

// 1차 응답을 검사한다. problems가 비어 있으면 그대로 쓸 수 있다.
export function checkPlan(ctx, cond, raw) {
  const problems = [];
  const allowed = new Set(allowedModules(ctx, cond).map(m => m.id));
  const seen = new Set();
  const days = Array.isArray(raw?.days) ? raw.days : [];
  if (days.length !== cond.days) problems.push(`days 배열 길이가 ${days.length}입니다. 정확히 ${cond.days}이어야 합니다.`);
  const clean = days.slice(0, cond.days).map((d, di) => {
    const out = {};
    for (const sk of ['am', 'pm']) {
      const label = `${di + 1}일차 ${sk === 'am' ? '오전' : '오후'}`;
      const ids = Array.isArray(d?.[sk]) ? d[sk].map(x => String(x).trim()) : [];
      out[sk] = [];
      for (const id of ids) {
        if (!ctx.byId[id]) { problems.push(`${label} ${id}: 모듈 목록에 없는 ID입니다.`); continue; }
        if (!allowed.has(id)) { problems.push(`${label} ${id}: 이번 조건(망 환경·직무)에서 쓸 수 없는 모듈입니다.`); continue; }
        if (seen.has(id)) { problems.push(`${label} ${id}: 이미 넣은 모듈입니다.`); continue; }
        seen.add(id);
        out[sk].push(id);
      }
      if (!out[sk].length) problems.push(`${label}이 비어 있습니다.`);
      if (out[sk].length > MAX_PER_SLOT) problems.push(`${label}에 모듈이 ${out[sk].length}개입니다. ${MAX_PER_SLOT}개 이하로 줄입니다.`);
    }
    return out;
  });
  while (clean.length < cond.days) clean.push({ am: [], pm: [] });
  const reason = {};
  (Array.isArray(raw?.reasons) ? raw.reasons : []).forEach(r => { if (r && seen.has(r.id)) reason[r.id] = String(r.text || '').slice(0, 120); });
  const plan = {
    name: String(raw?.name || '').slice(0, 100) || ctx.cfg.courseName,
    summary: String(raw?.summary || '').slice(0, 300),
    days: clean,
    reason,
    pick: {},
    memo: {}
  };
  return { plan, problems };
}

export function mergeExamples(ctx, plan, raw) {
  (Array.isArray(raw?.items) ? raw.items : []).forEach(it => {
    const m = ctx.byId[it?.id];
    if (!m || !plan.days.some(d => d.am.includes(m.id) || d.pm.includes(m.id))) return;
    const picks = [...new Set((Array.isArray(it.picks) ? it.picks : []).map(Number))]
      .filter(i => Number.isInteger(i) && i >= 0 && i < m.ex.length).sort((a, b) => a - b).slice(0, 4);
    if (picks.length) plan.pick[m.id] = picks;
    if (it.memo) plan.memo[m.id] = String(it.memo).slice(0, 160);
  });
  return plan;
}

// ==========================================
// 3. 모델 호출 (Worker /ai → OpenRouter)
// ==========================================
async function ask(kind, messages) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), AI_CONFIG.timeoutMs);
  let res;
  try {
    res = await fetch(AI_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, messages }),
      signal: ctrl.signal
    });
  } catch (e) {
    const err = new Error(e?.name === 'AbortError' ? 'timeout' : 'network');
    err.code = err.message;
    throw err;
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || data.error || `HTTP ${res.status}`);
    err.code = data.error || `http_${res.status}`;
    throw err;
  }
  return data.text;
}

// 1차 배치 → 검사(틀리면 한 번 다시 묻기) → 2차 예시 선택
export async function runPlanner(ctx, cond, onStep) {
  const messages = [{ role: 'user', content: buildPlanPrompt(ctx, cond) }];
  onStep('1/2 모듈을 골라 일차별로 배치하는 중입니다.');
  let text = await ask('plan', messages);
  let { plan, problems } = checkPlan(ctx, cond, parseJSON(text));
  if (problems.length) {
    onStep('1/2 배치 결과를 검사해 다시 요청하는 중입니다.');
    messages.push({ role: 'assistant', content: text });
    messages.push({ role: 'user', content: `다음 문제를 고쳐 같은 형식의 JSON 전체를 다시 출력합니다.\n- ${problems.join('\n- ')}` });
    text = await ask('plan', messages);
    ({ plan, problems } = checkPlan(ctx, cond, parseJSON(text)));
  }
  onStep('2/2 모듈별 실습 예시를 고르는 중입니다.');
  try {
    const exText = await ask('examples', [{ role: 'user', content: buildExamplePrompt(ctx, cond, plan) }]);
    mergeExamples(ctx, plan, parseJSON(exText));
  } catch (e) {
    problems.push('실습 예시를 고르지 못했습니다. 과정표에서 직접 고릅니다.');
  }
  return { plan, problems };
}

export function errorMessage(e) {
  const code = e?.code || '';
  const map = {
    not_configured: 'AI 연결 설정(OpenRouter 키)이 아직 없습니다. 관리자가 Worker 비밀값을 등록해야 합니다.',
    rate_limited: '요청이 많아 잠시 막혔습니다. 1분 뒤 다시 시도합니다.',
    no_credit: 'AI 사용 크레딧이 부족합니다. 관리자에게 알립니다.',
    forbidden_origin: '이 주소에서는 AI 과정 구성을 쓸 수 없습니다.',
    timeout: 'AI 응답이 오래 걸려 중단했습니다. 다시 시도합니다.',
    network: 'AI 서버에 연결하지 못했습니다. 네트워크 연결을 확인합니다.'
  };
  if (map[code]) return map[code];
  if (/JSON/.test(e?.message || '')) return 'AI 응답을 과정표 형식으로 읽지 못했습니다. 다시 시도합니다.';
  return 'AI 요청을 처리하지 못했습니다. 잠시 뒤 다시 시도합니다.';
}

// ==========================================
// 4. 화면 (대화상자)
// ==========================================
export function mountPlanner(ctx) {
  const { cfg, escapeHtml: esc, showToast, copyText } = ctx;
  const CKEY = (cfg.storageKey || 'board') + '.ai';
  let cond = { org: '', tracks: [], days: 1, net: 'ext', level: 'intro', problems: '' };
  try { cond = { ...cond, ...JSON.parse(localStorage.getItem(CKEY) || '{}') }; } catch (e) { /* 저장값이 없으면 기본 조건 */ }
  cond.tracks = (cond.tracks || []).filter(k => cfg.tracks[k]);
  let result = null;
  let busy = false;

  const ov = document.createElement('div');
  ov.className = 'modal-overlay aip';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-labelledby', 'aipTitle');
  ov.innerHTML = `<div class="modal-card modal-large">
    <div class="modal-header"><div class="modal-heading"><h2 class="modal-title" id="aipTitle">AI 과정 구성</h2><span class="modal-badge">AI</span></div>
    <button type="button" class="modal-close" aria-label="닫기">×</button></div>
    <div class="modal-body" id="aipBody"></div></div>`;
  document.body.appendChild(ov);
  const body = ov.querySelector('#aipBody');

  const open = () => { ov.classList.add('active'); document.body.style.overflow = 'hidden'; render(); };
  const close = () => { if (busy) return; ov.classList.remove('active'); document.body.style.overflow = ''; };
  ov.querySelector('.modal-close').addEventListener('click', close);
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('active')) close(); });

  const saveCond = () => { try { localStorage.setItem(CKEY, JSON.stringify(cond)); } catch (e) { /* 무시 */ } };
  const seg = (name, opts, cur) => `<div class="seg" data-f="${name}" role="group">${Object.entries(opts).map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${String(v) === String(cur)}">${esc(l)}</button>`).join('')}</div>`;

  function formHTML() {
    const count = allowedModules(ctx, cond).length;
    return `<p class="aip-lead">조건을 적으면 이 보드의 역량 모듈 ${ctx.mods.length}개 중에서 골라 일차별 과정표 초안을 만듭니다. 결과를 확인한 뒤 과정표에 담습니다.</p>
    <div class="aip-grid">
      <div class="form-group aip-wide"><label class="form-label" for="aipOrg">기관·교육 대상</label>
        <input class="form-input" id="aipOrg" maxlength="200" placeholder="예: OO시 민원여권과 주무관 25명, AI 사용 경험 적음" value="${esc(cond.org)}"></div>
      <div class="form-group aip-wide"><span class="form-label">직무 (여러 개 선택)</span>
        <div class="aip-chips" data-f="tracks">${Object.entries(cfg.tracks).map(([k, v]) => `<button type="button" class="chip" data-v="${k}" aria-pressed="${cond.tracks.includes(k)}">${esc(v)}</button>`).join('')}</div></div>
      <div class="form-group"><span class="form-label">교육 기간</span>${seg('days', { 1: '1일', 2: '2일', 3: '3일', 4: '4일', 5: '5일' }, cond.days)}</div>
      <div class="form-group"><span class="form-label">망 환경</span>${seg('net', { ext: '외부망', closed: '폐쇄망', mixed: '혼합' }, cond.net)}</div>
      <div class="form-group"><span class="form-label">수준</span>${seg('level', { intro: '입문', work: '실무', adv: '심화' }, cond.level)}</div>
      <div class="form-group aip-wide"><label class="form-label" for="aipProb">풀고 싶은 업무 문제</label>
        <textarea class="form-textarea" id="aipProb" rows="3" maxlength="800" placeholder="예: 민원 답변 초안 작성에 시간이 오래 걸림, 매주 엑셀 집계를 손으로 함">${esc(cond.problems)}</textarea></div>
    </div>
    <div class="aip-note">조건에 맞는 모듈 ${count}개를 목록으로 넣습니다. 입력한 조건과 모듈 목록이 외부 AI 모델(OpenRouter 경유)로 전송됩니다. 개인정보·내부 자료는 적지 않습니다.</div>
    <div class="aip-err" id="aipErr" hidden></div>
    <div class="aip-status" id="aipStatus" aria-live="polite"></div>
    <div class="brow aip-actions">
      <button type="button" class="btn btn-primary btn-sm" id="aipRun">AI로 구성하기</button>
      <button type="button" class="btn btn-secondary btn-sm" id="aipCopy">프롬프트 복사</button>
      <button type="button" class="btn btn-ghost btn-sm" id="aipPasteBtn">다른 AI 응답 붙여넣기</button>
    </div>
    <div class="aip-paste" id="aipPaste" hidden>
      <label class="form-label" for="aipPasteText">[프롬프트 복사]로 다른 챗 AI에서 받은 JSON을 붙여 넣습니다. 같은 검사를 거쳐 결과를 보여 줍니다.</label>
      <textarea class="form-textarea" id="aipPasteText" rows="5" placeholder='{"name": "...", "days": [...]}'></textarea>
      <div class="brow"><button type="button" class="btn btn-secondary btn-sm" id="aipPasteRun">붙여 넣은 응답 확인</button></div>
    </div>`;
  }

  function resultHTML() {
    const { plan, problems } = result;
    const RP = cfg.rowPrefix || 'L';
    const row = id => {
      const m = ctx.byId[id];
      const picks = (plan.pick[id] || []).map(i => m.ex[i]).filter(Boolean);
      return `<li><div class="aip-mh"><span class="lvb lv${m.l}">${RP}${m.l}</span><b>${esc(m.t)}</b>${m.n === 'E' ? '<span class="nt nt-E">외부망</span>' : m.n === 'I' ? '<span class="nt nt-I">반입</span>' : ''}</div>` +
        (plan.reason[id] ? `<div class="aip-why">${esc(plan.reason[id])}</div>` : '') +
        (plan.memo[id] ? `<div class="aip-memo"><span>맞춤 실습</span>${esc(plan.memo[id])}</div>` : '') +
        (picks.length ? `<div class="aip-ex">실습 예시: ${picks.map(esc).join(' / ')}</div>` : '') + '</li>';
    };
    const n = plan.days.reduce((a, d) => a + d.am.length + d.pm.length, 0);
    return `<div class="aip-head"><h3>${esc(plan.name)}</h3>${plan.summary ? `<p>${esc(plan.summary)}</p>` : ''}<div class="aip-meta">${plan.days.length}일 · 역량 모듈 ${n}개</div></div>` +
      (problems.length ? `<div class="aip-err">검사에서 고친 부분이 있습니다. 담기 전에 확인합니다.<br>${problems.map(esc).join('<br>')}</div>` : '') +
      plan.days.map((d, i) => `<div class="aip-day"><div class="aip-dh">${i + 1}일차</div>${['am', 'pm'].map(sk => `<div class="aip-slot"><div class="aip-sl">${sk === 'am' ? '오전' : '오후'}</div><ul>${d[sk].map(row).join('') || '<li class="aip-empty">비어 있습니다.</li>'}</ul></div>`).join('')}</div>`).join('') +
      `<div class="brow aip-actions"><button type="button" class="btn btn-primary btn-sm" id="aipApply">과정표에 담기</button>
       <button type="button" class="btn btn-secondary btn-sm" id="aipBack">조건 고치기</button>
       <button type="button" class="btn btn-ghost btn-sm" id="aipAgain">같은 조건으로 다시 구성</button></div>`;
  }

  function render() {
    body.innerHTML = result ? resultHTML() : formHTML();
    body.scrollTop = 0;
    ov.querySelector('.modal-card').scrollTop = 0;
    if (result) {
      body.querySelector('#aipApply').addEventListener('click', () => { if (ctx.apply(result.plan)) { close(); showToast('AI 구성안을 과정표에 담았습니다.'); } });
      body.querySelector('#aipBack').addEventListener('click', () => { result = null; render(); });
      body.querySelector('#aipAgain').addEventListener('click', () => { result = null; render(); run(); });
      return;
    }
    body.querySelector('#aipOrg').addEventListener('input', e => { cond.org = e.target.value; saveCond(); });
    body.querySelector('#aipProb').addEventListener('input', e => { cond.problems = e.target.value; saveCond(); });
    body.querySelectorAll('[data-f]').forEach(g => g.addEventListener('click', e => {
      const b = e.target.closest('button[data-v]');
      if (!b || busy) return;
      const f = g.dataset.f;
      if (f === 'tracks') cond.tracks = cond.tracks.includes(b.dataset.v) ? cond.tracks.filter(x => x !== b.dataset.v) : [...cond.tracks, b.dataset.v];
      else cond[f] = f === 'days' ? +b.dataset.v : b.dataset.v;
      saveCond(); render();
    }));
    body.querySelector('#aipRun').addEventListener('click', run);
    body.querySelector('#aipCopy').addEventListener('click', () => copyText(buildPlanPrompt(ctx, cond), '프롬프트를 복사했습니다. 챗 AI에 붙여 넣습니다.'));
    body.querySelector('#aipPasteBtn').addEventListener('click', () => { const p = body.querySelector('#aipPaste'); p.hidden = !p.hidden; });
    body.querySelector('#aipPasteRun').addEventListener('click', () => {
      try {
        result = checkPlan(ctx, cond, parseJSON(body.querySelector('#aipPasteText').value));
        render();
      } catch (e) { showErr('붙여 넣은 내용에서 과정표 JSON을 읽지 못했습니다. 응답 전체를 붙여 넣습니다.'); }
    });
  }

  function showErr(msg) {
    const el = body.querySelector('#aipErr');
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg || '';
  }

  async function run() {
    if (busy) return;
    busy = true;
    const btn = body.querySelector('#aipRun');
    const status = body.querySelector('#aipStatus');
    if (btn) { btn.disabled = true; btn.textContent = '구성하는 중'; }
    showErr('');
    try {
      result = await runPlanner(ctx, cond, msg => { if (status) status.textContent = msg; });
      busy = false;
      render();
    } catch (e) {
      busy = false;
      console.warn('AI 과정 구성 실패', e);
      if (btn) { btn.disabled = false; btn.textContent = 'AI로 구성하기'; }
      if (status) status.textContent = '';
      showErr(`${errorMessage(e)} [프롬프트 복사]로 다른 챗 AI에서 구성한 뒤 응답을 붙여 넣을 수도 있습니다.`);
    }
  }

  return { open };
}
