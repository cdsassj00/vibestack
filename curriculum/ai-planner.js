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
import { EN, L } from '../i18n.js';

const NET = EN
  ? { E: 'Internet required', B: 'Air-gapped alternative available', I: 'Prepare online, then bring in' }
  : { E: '외부망 필요', B: '폐쇄망 대안 있음', I: '외부망 준비 후 반입' };
const GRADE = EN
  ? { 1: 'Intro', 2: 'Basic', 3: 'Intermediate', 4: 'Advanced', 5: 'Project' }
  : { 1: '입문', 2: '기초', 3: '중급', 4: '심화', 5: '프로젝트' };
const NETCOND = EN
  ? { ext: 'Internet-connected (internet available)', closed: 'Air-gapped (no internet)', mixed: 'Mixed (training room online, daily work on an air-gapped network)' }
  : { ext: '외부망(인터넷 사용 가능)', closed: '폐쇄망(인터넷 사용 불가)', mixed: '혼합(교육장은 외부망, 현업은 폐쇄망)' };
const LEVEL = EN ? {
  intro: ['Intro', 'First-time learners. Pick mostly intro and basic levels.'],
  work: ['Practical', 'People with some hands-on experience. Pick mostly basic and intermediate levels.'],
  adv: ['Advanced', 'People who want to build things themselves. Pick mostly intermediate, advanced and project levels.']
} : {
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
        lines.push(`${m.id} | ${m.t} | ${GRADE[m.g]} | ${NET[m.n]} | ${L('산출물', 'deliverable')}: ${m.out || '-'} | ${L('도구', 'tools')}: ${m.s.slice(0, 4).join(', ')} | ${L('대상', 'audience')}: ${tracks}`);
      });
    }
  }
  return lines.join('\n');
}

function presetText(ctx) {
  return Object.values(ctx.presets).map(p => {
    const days = p.days.map((d, i) => L(`${i + 1}일차 오전: ${d.am.join(', ')} / 오후: ${d.pm.join(', ')}`, `Day ${i + 1} morning: ${d.am.join(', ')} / afternoon: ${d.pm.join(', ')}`)).join('\n');
    return `${L('예시', 'Sample')} "${p.name}"\n${days}`;
  }).join('\n\n');
}

function axisText(ctx) {
  const cols = [ctx.cfg.base?.key, ...ctx.cfg.colOrder].filter(Boolean).map(d => `- ${d}: ${ctx.cfg.cols[d][0]} (${ctx.cfg.cols[d][1]})`).join('\n');
  const rows = ctx.cfg.rowOrder.map(l => `- ${rowName(ctx, l)}: ${ctx.cfg.rows[l][1]}. ${ctx.cfg.rows[l][2] || ''}`).join('\n');
  return L(`가로축 ${ctx.cfg.colAxisName}\n${cols}\n세로축 ${ctx.cfg.rowAxisName} (숫자가 클수록 어렵습니다)\n${rows}`, `Columns: ${ctx.cfg.colAxisName}\n${cols}\nRows: ${ctx.cfg.rowAxisName} (higher numbers are harder)\n${rows}`);
}

function condText(ctx, cond) {
  const none = L('지정 안 함', 'not specified');
  const tracks = cond.tracks.length ? cond.tracks.map(k => ctx.cfg.tracks[k]).join(', ') : none;
  if (EN) return [
    `- Organization and audience: ${cond.org || none}`,
    `- Roles: ${tracks}`,
    `- Length: ${cond.days} day(s) (each day has a morning and an afternoon slot)`,
    `- Network: ${NETCOND[cond.net]}`,
    `- Level: ${LEVEL[cond.level][0]}. ${LEVEL[cond.level][1]}`,
    `- Work problems to solve: ${cond.problems || none}`
  ].join('\n');
  return [
    `- 기관·교육 대상: ${cond.org || none}`,
    `- 직무: ${tracks}`,
    `- 교육 기간: ${cond.days}일 (하루는 오전·오후 두 칸)`,
    `- 망 환경: ${NETCOND[cond.net]}`,
    `- 수준: ${LEVEL[cond.level][0]}. ${LEVEL[cond.level][1]}`,
    `- 풀고 싶은 업무 문제: ${cond.problems || none}`
  ].join('\n');
}

const PLAN_SHAPE = EN
  ? '{"name":"course name","summary":"two-sentence course description","days":[{"am":["MODULE_ID"],"pm":["MODULE_ID"]}],"reasons":[{"id":"MODULE_ID","text":"why it was chosen"}]}'
  : '{"name":"과정명","summary":"과정 설명 2문장","days":[{"am":["모듈ID"],"pm":["모듈ID"]}],"reasons":[{"id":"모듈ID","text":"고른 이유"}]}';

export function buildPlanPrompt(ctx, cond) {
  const list = allowedModules(ctx, cond);
  if (EN) return `You are a training designer building a ${ctx.cfg.courseName} for public agencies and companies.
Pick modules only from the module list below and draft a ${cond.days}-day course plan.

## 1. Design rules
- Use only module IDs from the "Module list". Never invent an ID.
- The course is exactly ${cond.days} days. The days array has length ${cond.days}.
- Put 2-4 modules in each slot (morning or afternoon, about 3-4 hours). Intro courses may have up to 5-6. Leave no slot empty.
- Do not use the same module twice.
- Start the first slot with foundation modules, then raise the row stage and the level as the course goes on.
- Prefer modules that directly address the "work problems to solve".
- If the course is 2 days or longer, the last afternoon should produce or review a deliverable (project or review modules).
- On an air-gapped network (no internet), do not use modules that need the internet. On a mixed network, internet modules must be no more than half of the course.
- Write one reason per module in "reasons": one plain sentence of about 15 words on how it connects to the work problem or the audience.
- "name" states the course content plainly. No metaphors, exclamation marks or hype (perfect, ultimate, blazing).
- "summary" is two plain sentences naming the audience and the deliverables.
- Write name, summary and reasons in English.

## 2. Matrix axes
${axisText(ctx)}

## 3. Sample courses (for layout reference)
${presetText(ctx)}

## 4. Module list (ID | name | level | network | deliverable | tools | audience)
${catalogText(ctx, list)}

## 5. Conditions for this course
${condText(ctx, cond)}

## Output
Output a single JSON object and nothing else. Shape:
${PLAN_SHAPE}`;
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
    return `${m.id} | ${m.t} | ${L('산출물', 'deliverable')}: ${m.out || '-'}\n${m.ex.map((e, i) => `  ${i}) ${e}`).join('\n')}`;
  }).join('\n');
  if (EN) return `For each module in the course plan below, choose the hands-on exercises to cover in this training.

## Rules
- picks: choose 2-3 exercise numbers per module, closest to the audience and the work problems. Use only the numbers listed for each module.
- For an air-gapped course, avoid exercises marked (외부망) (needs the internet).
- memo: one plain English sentence (about 20 words) with a hands-on task tailored to this organization. Name real tasks and deliverables. No metaphors or hype.
- items contains every module below, in the same order.

## Course conditions
${condText(ctx, cond)}

## Plan modules and exercises
${blocks}

## Output
Output a single JSON object and nothing else. Shape:
{"items":[{"id":"MODULE_ID","picks":[0,2],"memo":"tailored exercise"}]}`;
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
  if (days.length !== cond.days) problems.push(L(`days 배열 길이가 ${days.length}입니다. 정확히 ${cond.days}이어야 합니다.`, `The days array has length ${days.length}. It must be exactly ${cond.days}.`));
  const clean = days.slice(0, cond.days).map((d, di) => {
    const out = {};
    for (const sk of ['am', 'pm']) {
      const label = L(`${di + 1}일차 ${sk === 'am' ? '오전' : '오후'}`, `Day ${di + 1} ${sk === 'am' ? 'morning' : 'afternoon'}`);
      const ids = Array.isArray(d?.[sk]) ? d[sk].map(x => String(x).trim()) : [];
      out[sk] = [];
      for (const id of ids) {
        if (!ctx.byId[id]) { problems.push(`${label} ${id}: ${L('모듈 목록에 없는 ID입니다.', 'not an ID in the module list.')}`); continue; }
        if (!allowed.has(id)) { problems.push(`${label} ${id}: ${L('이번 조건(망 환경·직무)에서 쓸 수 없는 모듈입니다.', 'not allowed under these conditions (network, roles).')}`); continue; }
        if (seen.has(id)) { problems.push(`${label} ${id}: ${L('이미 넣은 모듈입니다.', 'already used.')}`); continue; }
        seen.add(id);
        out[sk].push(id);
      }
      if (!out[sk].length) problems.push(L(`${label}이 비어 있습니다.`, `${label} is empty.`));
      if (out[sk].length > MAX_PER_SLOT) problems.push(L(`${label}에 모듈이 ${out[sk].length}개입니다. ${MAX_PER_SLOT}개 이하로 줄입니다.`, `${label} has ${out[sk].length} modules. Use ${MAX_PER_SLOT} or fewer.`));
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
  onStep(L('1/2 모듈을 골라 일차별로 배치하는 중입니다.', '1/2 Choosing modules and placing them by day.'));
  let text = await ask('plan', messages);
  let { plan, problems } = checkPlan(ctx, cond, parseJSON(text));
  if (problems.length) {
    onStep(L('1/2 배치 결과를 검사해 다시 요청하는 중입니다.', '1/2 Checking the result and asking again.'));
    messages.push({ role: 'assistant', content: text });
    messages.push({ role: 'user', content: L(`다음 문제를 고쳐 같은 형식의 JSON 전체를 다시 출력합니다.\n- ${problems.join('\n- ')}`, `Fix these problems and output the full JSON again in the same shape.\n- ${problems.join('\n- ')}`) });
    text = await ask('plan', messages);
    ({ plan, problems } = checkPlan(ctx, cond, parseJSON(text)));
  }
  onStep(L('2/2 모듈별 실습 예시를 고르는 중입니다.', '2/2 Choosing exercises for each module.'));
  try {
    const exText = await ask('examples', [{ role: 'user', content: buildExamplePrompt(ctx, cond, plan) }]);
    mergeExamples(ctx, plan, parseJSON(exText));
  } catch (e) {
    problems.push(L('실습 예시를 고르지 못했습니다. 과정표에서 직접 고릅니다.', 'Could not choose exercises. Pick them in the course plan.'));
  }
  return { plan, problems };
}

export function errorMessage(e) {
  const code = e?.code || '';
  const map = EN ? {
    not_configured: 'The AI connection (OpenRouter key) is not set up yet. An administrator must add the Worker secret.',
    rate_limited: 'Too many requests. Try again in a minute.',
    no_credit: 'AI credit has run out. Tell the administrator.',
    forbidden_origin: 'AI course planning is not available from this address.',
    timeout: 'The AI took too long and was stopped. Try again.',
    network: 'Could not reach the AI server. Check your network connection.'
  } : {
    not_configured: 'AI 연결 설정(OpenRouter 키)이 아직 없습니다. 관리자가 Worker 비밀값을 등록해야 합니다.',
    rate_limited: '요청이 많아 잠시 막혔습니다. 1분 뒤 다시 시도합니다.',
    no_credit: 'AI 사용 크레딧이 부족합니다. 관리자에게 알립니다.',
    forbidden_origin: '이 주소에서는 AI 과정 구성을 쓸 수 없습니다.',
    timeout: 'AI 응답이 오래 걸려 중단했습니다. 다시 시도합니다.',
    network: 'AI 서버에 연결하지 못했습니다. 네트워크 연결을 확인합니다.'
  };
  if (map[code]) return map[code];
  if (/JSON/.test(e?.message || '')) return L('AI 응답을 과정표 형식으로 읽지 못했습니다. 다시 시도합니다.', 'Could not read the AI response as a course plan. Try again.');
  return L('AI 요청을 처리하지 못했습니다. 잠시 뒤 다시 시도합니다.', 'The AI request failed. Try again shortly.');
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
    <div class="modal-header"><div class="modal-heading"><h2 class="modal-title" id="aipTitle">${L('AI 과정 구성', 'Plan with AI')}</h2><span class="modal-badge">AI</span></div>
    <button type="button" class="modal-close" aria-label="${L('닫기', 'Close')}">×</button></div>
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
    if (EN) return `<p class="aip-lead">Describe the course and the AI picks from this board's ${ctx.mods.length} modules to draft a day-by-day course plan. Review the result before adding it to your plan.</p>
    <div class="aip-grid">
      <div class="form-group aip-wide"><label class="form-label" for="aipOrg">Organization and audience</label>
        <input class="form-input" id="aipOrg" maxlength="200" placeholder="e.g. 25 civil-service staff in a city passport office, little AI experience" value="${esc(cond.org)}"></div>
      <div class="form-group aip-wide"><span class="form-label">Roles (choose any)</span>
        <div class="aip-chips" data-f="tracks">${Object.entries(cfg.tracks).map(([k, v]) => `<button type="button" class="chip" data-v="${k}" aria-pressed="${cond.tracks.includes(k)}">${esc(v)}</button>`).join('')}</div></div>
      <div class="form-group"><span class="form-label">Length</span>${seg('days', { 1: '1 day', 2: '2 days', 3: '3 days', 4: '4 days', 5: '5 days' }, cond.days)}</div>
      <div class="form-group"><span class="form-label">Network</span>${seg('net', { ext: 'Internet', closed: 'Air-gapped', mixed: 'Mixed' }, cond.net)}</div>
      <div class="form-group"><span class="form-label">Level</span>${seg('level', { intro: 'Intro', work: 'Practical', adv: 'Advanced' }, cond.level)}</div>
      <div class="form-group aip-wide"><label class="form-label" for="aipProb">Work problems to solve</label>
        <textarea class="form-textarea" id="aipProb" rows="3" maxlength="800" placeholder="e.g. drafting replies to citizen requests takes too long; weekly Excel totals are done by hand">${esc(cond.problems)}</textarea></div>
    </div>
    <div class="aip-note">${count} modules that fit these conditions go into the list. Your conditions and the module list are sent to an external AI model (through OpenRouter). Do not enter personal data or internal documents.</div>
    <div class="aip-err" id="aipErr" hidden></div>
    <div class="aip-status" id="aipStatus" aria-live="polite"></div>
    <div class="brow aip-actions">
      <button type="button" class="btn btn-primary btn-sm" id="aipRun">Plan with AI</button>
      <button type="button" class="btn btn-secondary btn-sm" id="aipCopy">Copy prompt</button>
      <button type="button" class="btn btn-ghost btn-sm" id="aipPasteBtn">Paste another AI's response</button>
    </div>
    <div class="aip-paste" id="aipPaste" hidden>
      <label class="form-label" for="aipPasteText">Paste the JSON you got from another chat AI using [Copy prompt]. It goes through the same checks.</label>
      <textarea class="form-textarea" id="aipPasteText" rows="5" placeholder='{"name": "...", "days": [...]}'></textarea>
      <div class="brow"><button type="button" class="btn btn-secondary btn-sm" id="aipPasteRun">Check pasted response</button></div>
    </div>`;
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
      return `<li><div class="aip-mh"><span class="lvb lv${m.l}">${RP}${m.l}</span><b>${esc(m.t)}</b>${m.n === 'E' ? `<span class="nt nt-E">${L('외부망', 'Internet')}</span>` : m.n === 'I' ? `<span class="nt nt-I">${L('반입', 'Bring in')}</span>` : ''}</div>` +
        (plan.reason[id] ? `<div class="aip-why">${esc(plan.reason[id])}</div>` : '') +
        (plan.memo[id] ? `<div class="aip-memo"><span>${L('맞춤 실습', 'Custom exercise')}</span>${esc(plan.memo[id])}</div>` : '') +
        (picks.length ? `<div class="aip-ex">${L('실습 예시', 'Exercises')}: ${picks.map(esc).join(' / ')}</div>` : '') + '</li>';
    };
    const n = plan.days.reduce((a, d) => a + d.am.length + d.pm.length, 0);
    return `<div class="aip-head"><h3>${esc(plan.name)}</h3>${plan.summary ? `<p>${esc(plan.summary)}</p>` : ''}<div class="aip-meta">${L(`${plan.days.length}일 · 역량 모듈 ${n}개`, `${plan.days.length} day(s) · ${n} modules`)}</div></div>` +
      (problems.length ? `<div class="aip-err">${L('검사에서 고친 부분이 있습니다. 담기 전에 확인합니다.', 'The checks changed some parts. Review before adding.')}<br>${problems.map(esc).join('<br>')}</div>` : '') +
      plan.days.map((d, i) => `<div class="aip-day"><div class="aip-dh">${L(`${i + 1}일차`, `Day ${i + 1}`)}</div>${['am', 'pm'].map(sk => `<div class="aip-slot"><div class="aip-sl">${sk === 'am' ? L('오전', 'Morning') : L('오후', 'Afternoon')}</div><ul>${d[sk].map(row).join('') || `<li class="aip-empty">${L('비어 있습니다.', 'Empty.')}</li>`}</ul></div>`).join('')}</div>`).join('') +
      `<div class="brow aip-actions"><button type="button" class="btn btn-primary btn-sm" id="aipApply">${L('과정표에 담기', 'Add to course plan')}</button>
       <button type="button" class="btn btn-secondary btn-sm" id="aipBack">${L('조건 고치기', 'Edit conditions')}</button>
       <button type="button" class="btn btn-ghost btn-sm" id="aipAgain">${L('같은 조건으로 다시 구성', 'Try again with the same conditions')}</button></div>`;
  }

  function render() {
    body.innerHTML = result ? resultHTML() : formHTML();
    body.scrollTop = 0;
    ov.querySelector('.modal-card').scrollTop = 0;
    if (result) {
      body.querySelector('#aipApply').addEventListener('click', () => { if (ctx.apply(result.plan)) { close(); showToast(L('AI 구성안을 과정표에 담았습니다.', 'AI plan added to the course plan.')); } });
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
    body.querySelector('#aipCopy').addEventListener('click', () => copyText(buildPlanPrompt(ctx, cond), L('프롬프트를 복사했습니다. 챗 AI에 붙여 넣습니다.', 'Prompt copied. Paste it into a chat AI.')));
    body.querySelector('#aipPasteBtn').addEventListener('click', () => { const p = body.querySelector('#aipPaste'); p.hidden = !p.hidden; });
    body.querySelector('#aipPasteRun').addEventListener('click', () => {
      try {
        result = checkPlan(ctx, cond, parseJSON(body.querySelector('#aipPasteText').value));
        render();
      } catch (e) { showErr(L('붙여 넣은 내용에서 과정표 JSON을 읽지 못했습니다. 응답 전체를 붙여 넣습니다.', 'Could not find course-plan JSON in what you pasted. Paste the whole response.')); }
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
    if (btn) { btn.disabled = true; btn.textContent = L('구성하는 중', 'Planning'); }
    showErr('');
    try {
      result = await runPlanner(ctx, cond, msg => { if (status) status.textContent = msg; });
      busy = false;
      render();
    } catch (e) {
      busy = false;
      console.warn('AI 과정 구성 실패', e);
      if (btn) { btn.disabled = false; btn.textContent = L('AI로 구성하기', 'Plan with AI'); }
      if (status) status.textContent = '';
      showErr(`${errorMessage(e)} ${L('[프롬프트 복사]로 다른 챗 AI에서 구성한 뒤 응답을 붙여 넣을 수도 있습니다.', 'You can also use [Copy prompt] with another chat AI and paste its response.')}`);
    }
  }

  return { open };
}
