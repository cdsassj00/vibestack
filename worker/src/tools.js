/**
 * MCP 도구 — 교육과정 보드·용어 사전·스택 진단 데이터를 읽기 전용으로 돌려준다.
 * 데이터는 사이트와 같은 파일을 배포할 때 함께 묶는다(복사본 없음).
 */
import { MODULES as WORK_MODULES, PRESETS as WORK_PRESETS } from '../../curriculum/data.js';
import { AXES as WORK_AXES } from '../../curriculum/axes.js';
import { MODULES as VIBE_MODULES, PRESETS as VIBE_PRESETS } from '../../vibecoding/data.js';
import { AXES as VIBE_AXES } from '../../vibecoding/axes.js';
import { TERMS, ERRORS, GROUPS } from '../../glossary-data.js';
import { QUESTIONS, diagnose, activeQuestions } from '../../diagnosis.js';
import { VIBE_SCENARIOS } from '../../scenarios-data.js';

const NET = { E: '외부망 필요', B: '폐쇄망 대안 있음', I: '외부망 준비 후 폐쇄망 반입' };
const GRADE = { 1: '입문', 2: '기초', 3: '중급', 4: '심화', 5: '프로젝트' };
const MAX_PER_SLOT = 6;

const BOARDS = {
  work: { key: 'work', name: 'AI 업무활용 교육과정 설계 보드', path: '/curriculum/', modules: WORK_MODULES, presets: WORK_PRESETS, axes: WORK_AXES },
  vibe: { key: 'vibe', name: 'AI 바이브코딩 교육과정 설계 보드', path: '/vibecoding/', modules: VIBE_MODULES, presets: VIBE_PRESETS, axes: VIBE_AXES }
};
for (const b of Object.values(BOARDS)) b.byId = Object.fromEntries(b.modules.map(m => [m.id, m]));
const scenarioTitle = Object.fromEntries(VIBE_SCENARIOS.map(s => [s.id, s.title]));

const boardOfId = id => (BOARDS.work.byId[id] ? BOARDS.work : BOARDS.vibe.byId[id] ? BOARDS.vibe : null);
const colName = (b, d) => b.axes.cols[d]?.[0] || d;
const rowName = (b, l) => `${b.axes.rowPrefix}${l} ${b.axes.rows[l]?.[0] || ''}`;
const trackNames = (b, k) => (k || []).map(x => b.axes.tracks[x] || x);

const moduleUrl = (b, site, id) => `${site}${b.path}#m=${id}`;

function brief(b, m) {
  const r = { id: m.id, title: m.t, cell: `${m.d} ${colName(b, m.d)} · ${rowName(b, m.l)}`, grade: GRADE[m.g || 1], network: NET[m.n], tools: m.s.slice(0, 6) };
  if (m.alt) r.closed_alt = m.alt;
  return r;
}

function full(b, m, site) {
  const alt = m.alt ? (b.byId[m.alt] ? { id: m.alt, title: b.byId[m.alt].t, row: rowName(b, b.byId[m.alt].l) } : null) : null;
  const out = {
    board: b.key, id: m.id, title: m.t, short: m.st || m.t,
    column: colName(b, m.d), row: rowName(b, m.l), grade: GRADE[m.g || 1],
    network: NET[m.n], tools: m.s, output: m.out || '',
    url: moduleUrl(b, site, m.id),
    targets: trackNames(b, m.k),
    description: m.desc,
    examples: m.ex,
    keywords: m.kw || [],
    closed_network_alternative: alt,
    public_cases: (m.pub || []).map(p => ({ who: p.j, case: p.c })),
    private_cases: (m.pri || []).map(p => ({ who: p.j, case: p.c })),
    // 같은 열에서 한 단계 다음 방법(행)으로 이어지는 모듈
    next_steps: b.modules.filter(x => x.d === m.d && x.l === m.l + 1).map(x => ({ id: x.id, title: x.t }))
  };
  if (m.fl) out.diagram = { box: m.fl.box, edges: m.fl.e, legend: 'X 외부 서비스 · C 박스 안 · U 사용자·화면. "출발 > 도착 : 설명"' };
  if (m.sc?.length) out.related_scenarios = m.sc.map(id => scenarioTitle[id]).filter(Boolean);
  return out;
}

function pickBoards(board) {
  if (board === 'work') return [BOARDS.work];
  if (board === 'vibe') return [BOARDS.vibe];
  return [BOARDS.work, BOARDS.vibe];
}

// ---------------------------------------------------------------- 검색 점수
// 검색어를 낱말로 나눠 낱말마다 어느 필드에서 맞는지로 점수를 매긴다(모든 낱말이 맞지 않아도 순위로 돌려준다).
const SYNONYMS = {
  '엑셀': ['excel', '스프레드시트', '시트'], 'excel': ['엑셀'], '스프레드시트': ['엑셀', 'excel', '시트'],
  'ppt': ['슬라이드', '발표'], '피피티': ['슬라이드', '발표'], '발표자료': ['슬라이드', '발표'], '슬라이드': ['ppt', '발표'],
  '공문': ['기안', '공문서'], '기안문': ['기안', '공문'], '보고서': ['보고', '기안'],
  '녹취': ['회의록', '전사', '녹음'], '회의록': ['녹취', '전사', '회의'], '녹음': ['전사', '회의록', '음성'],
  '법령': ['규정', '조문', '법'], '규정': ['법령', '지침'], '계약서': ['계약'], '입찰': ['조달', '계약'], '조달': ['계약', '구매', '입찰'],
  '민원': ['상담', '응대', 'faq'], '상담': ['민원', 'faq'], '이미지': ['그림', '디자인'], '영상': ['동영상', '비디오'], '동영상': ['영상'],
  '폐쇄망': ['로컬', '내부망', '오프라인'], '내부망': ['폐쇄망', '로컬'], '보안': ['개인정보', '보안'], '자동화': ['반복', '자동'],
  '홈페이지': ['웹', '사이트'], '앱': ['웹앱', '앱'], '챗봇': ['챗봇', 'rag'], '에이전트': ['에이전트', '위임'], 'api': ['api', '키']
};
const PARTICLE = /(하는|하기|해서|하고|하려면|으로|에서|에게|이랑|까지|부터|처럼|을|를|이|가|은|는|의|와|과|로|에|도|만)$/;
// 어디에나 나와 순위를 흐리는 낱말
const STOP = new Set(['ai', '실습', '업무', '교육', '과정', '활용', '하기', '만들기', '하는', '위한', '관련', '방법', '기관', '직원', '사용', '이용', '일차', '설계', '과제', '해줘', '알려줘', '추천']);
export function tokenize(q) {
  const words = String(q || '').toLowerCase().split(/[\s,·/]+/).map(w => w.replace(/[^\p{L}\p{N}+#.-]/gu, '')).filter(Boolean);
  return [...new Set(words.map(w => (w.length > 2 ? w.replace(PARTICLE, '') : w)).filter(w => w.length > 0 && !STOP.has(w)))].slice(0, 12);
}
const FIELDS = new WeakMap();
function fieldsOf(m) {
  if (FIELDS.has(m)) return FIELDS.get(m);
  const lo = x => String(x || '').toLowerCase();
  const f = {
    id: lo(m.id), title: lo(m.t + ' ' + (m.st || '')), kw: lo((m.kw || []).join(' ')), tools: lo(m.s.join(' ')),
    desc: lo(m.desc + ' ' + (m.out || '')), ex: m.ex.map(lo), cases: lo([...(m.pub || []), ...(m.pri || [])].map(p => p.j + ' ' + p.c).join(' '))
  };
  FIELDS.set(m, f);
  return f;
}
function wordScore(f, w) {
  if (f.id === w) return 20;
  let s = 0;
  if (f.title.includes(w)) s += 6;
  if (f.kw.includes(w)) s += 4;
  if (f.tools.includes(w)) s += 4;
  if (f.desc.includes(w)) s += 2;
  s += Math.min(f.ex.filter(e => e.includes(w)).length, 3);
  if (f.cases.includes(w)) s += 1;
  return s;
}
// 낱말마다 맞춤 점수 (계약서 → 계약, 동의어 순으로 물러선다)
function matchWord(f, w) {
  let s = wordScore(f, w);
  if (!s && w.length >= 3 && /[가-힣]$/.test(w)) s = wordScore(f, w.slice(0, -1)) * 0.7;
  if (!s) s = Math.max(0, ...(SYNONYMS[w] || []).map(x => wordScore(f, x) * 0.6));
  return s;
}
// 많은 모듈에 나오는 낱말일수록 가중치를 낮춘다 (idf, 0.1~1)
const ALL_MODULES = [];
const idfCache = new Map();
function idf(w, docs, test) {
  const key = (docs === ALL_MODULES ? 'm:' : 'e:') + w;
  if (idfCache.has(key)) return idfCache.get(key);
  const df = docs.filter(d => test(d, w)).length;
  const v = Math.max(0.1, Math.log((docs.length + 1) / (df + 1)) / Math.log(docs.length + 1));
  if (idfCache.size > 2000) idfCache.clear();
  idfCache.set(key, v);
  return v;
}
export function moduleScore(m, words) {
  if (!words.length) return 0;
  const f = fieldsOf(m);
  let total = 0; let hit = 0;
  for (const w of words) {
    const s = matchWord(f, w);
    if (s) { hit++; total += s * idf(w, ALL_MODULES, (d, x) => matchWord(fieldsOf(d), x) > 0); }
  }
  return total * (hit / words.length); // 낱말을 많이 맞춘 모듈을 앞에 둔다
}
const ALL_TEXTS = [];
function textHit(t, w) {
  if (t.includes(w)) return 1;
  if (w.length >= 3 && /[가-힣]$/.test(w) && t.includes(w.slice(0, -1))) return 0.7;
  return (SYNONYMS[w] || []).some(x => t.includes(x)) ? 0.6 : 0;
}
const textScore = (text, words) => { const t = text.toLowerCase(); return words.reduce((n, w) => { const h = textHit(t, w); return h ? n + h * idf(w, ALL_TEXTS, textHit) : n; }, 0); };

function trackKeyOf(b, t) {
  if (!t) return null;
  return b.axes.tracks[t] ? t : Object.keys(b.axes.tracks).find(k => b.axes.tracks[k].includes(t) || t.includes(b.axes.tracks[k])) || null;
}
const trackOk = (b, m, keys) => !keys.length || keys.some(k => m.k.includes(k)) || m.k.includes(b.axes.universalTrack);
const netOk = (m, network) => network !== 'closed' || m.n !== 'E';

// ---------------------------------------------------------------- 과정표 검사·링크·표
function planUrl(b, site, name, days) {
  const plan = days.map(d => `${d.am.join(',')};${d.pm.join(',')}`).join('/');
  return `${site}${b.path}#plan=${plan}${name ? '&name=' + encodeURIComponent(name) : ''}`;
}
function tableMarkdown(b, days) {
  const cell = ids => ids.map(id => (b.byId[id] ? `${id} ${b.byId[id].st || b.byId[id].t}` : id)).join('<br>');
  return ['| 일차 | 오전 | 오후 |', '|---|---|---|', ...days.map((d, i) => `| ${i + 1}일차 | ${cell(d.am)} | ${cell(d.pm)} |`)].join('\n');
}
function checkCourse(b, days, network, expectedDays) {
  const problems = [];
  if (expectedDays && days.length !== expectedDays) problems.push(`일수가 ${days.length}일입니다. ${expectedDays}일이어야 합니다.`);
  const seen = new Set();
  let ext = 0; let total = 0;
  const clean = [];
  const out = days.map((d, di) => {
    const r = { day: di + 1 }; const c = {};
    for (const sk of ['am', 'pm']) {
      const label = `${di + 1}일차 ${sk === 'am' ? '오전' : '오후'}`;
      const ids = (Array.isArray(d?.[sk]) ? d[sk] : []).map(x => String(x).trim().toUpperCase());
      c[sk] = ids.filter(id => b.byId[id]);
      r[sk] = ids.map(id => {
        const m = b.byId[id];
        if (!m) { problems.push(`${label} ${id}: 없는 모듈 id입니다.`); return { id, title: null }; }
        if (seen.has(id)) problems.push(`${label} ${id}: 이미 넣은 모듈입니다.`);
        seen.add(id); total++;
        if (m.n === 'E') { ext++; if (network === 'closed') problems.push(`${label} ${id}: 외부망이 필요한 모듈이라 폐쇄망 과정에 맞지 않습니다.${m.alt && b.byId[m.alt] ? ` 대안: ${m.alt} ${b.byId[m.alt].t}` : ''}`); }
        return { id, title: m.t, row: rowName(b, m.l), network: NET[m.n] };
      });
      if (!ids.length) problems.push(`${label}이 비어 있습니다.`);
      if (ids.length > MAX_PER_SLOT) problems.push(`${label}에 모듈이 ${ids.length}개입니다. ${MAX_PER_SLOT}개 이하를 권장합니다.`);
    }
    clean.push(c);
    return r;
  });
  if (network === 'mixed' && total && ext / total > 0.5) problems.push(`외부망 필요 모듈이 ${ext}/${total}개로 절반을 넘습니다.`);
  return { ok: problems.length === 0, problems, days: out, clean };
}

// 수준별 기본 행(방법·구조 단계)과 난이도 상한
for (const b of Object.values(BOARDS)) for (const m of b.modules) {
  ALL_MODULES.push(m);
  ALL_TEXTS.push(...m.ex.map(e => e.toLowerCase()), ...[...(m.pub || []), ...(m.pri || [])].map(p => p.c.toLowerCase()));
}

const LEVELS = {
  work: { intro: { rows: [1], maxGrade: 2, label: '입문: AI 대화창 기본' }, basic: { rows: [1, 2], maxGrade: 3, label: '기초: 대화창과 전용 서비스' }, advanced: { rows: [2, 3], maxGrade: 5, label: '중급: 전용 서비스와 AI가 준 코드 실행' }, build: { rows: [3, 4], maxGrade: 5, label: '심화: 코드 실행과 코딩에이전트로 구축' } },
  vibe: { intro: { rows: [1, 2], maxGrade: 2, label: '입문: 로컬 실행과 배포' }, basic: { rows: [1, 2, 3], maxGrade: 3, label: '기초: 로컬·배포·외부 데이터' }, advanced: { rows: [3, 4], maxGrade: 5, label: '중급: 외부 데이터와 백엔드' }, build: { rows: [4, 5], maxGrade: 5, label: '심화: 백엔드와 AI 기능 연결' } }
};

// ---------------------------------------------------------------- 도구 정의
const boardProp = { type: 'string', enum: ['work', 'vibe'], description: 'work = AI 업무활용 보드(업무 영역 × AI 활용 방법 L1~L4), vibe = AI 바이브코딩 보드(만드는 방식 × 구조 단계 S1~S5)' };

const boardOf = key => { const b = BOARDS[key]; if (!b) throw new UserError('board는 work 또는 vibe입니다.'); return b; };
const networkProp = { type: 'string', enum: ['external', 'closed', 'mixed'], description: '교육 대상 기관의 망 환경. external 외부망(인터넷 가능), closed 폐쇄망·업무망(외부 AI 서비스 못 씀), mixed 둘 다 있음' };
const tracksProp = { type: 'array', items: { type: 'string' }, description: '대상 직무 키 또는 이름. work: 공 전 직원·서 서무·정 정책·재 기획재무·홍 홍보·민 민원현장·연 연구·전 정보화. vibe: 공 전체·초 입문자·현 현업·강 강사·전 전산·개 개발 경험자' };

export const TOOLS = [
  {
    name: 'draft_course',
    title: '과정 초안 만들기',
    description: '기관·주제·일수·망 환경·수준·대상 직무를 받아 보드 모듈로 과정표 초안을 한 번에 만듭니다. 일차별 오전·오후 모듈, 주제에 맞는 실습 예시, 검사 결과, 보드에서 바로 여는 링크, 마크다운 표를 돌려줍니다. 과정 설계 요청은 이 도구를 먼저 부르고, 필요하면 모듈을 바꾼 뒤 check_course로 다시 검사합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        board: boardProp,
        days: { type: 'integer', minimum: 1, maximum: 10, description: '과정 일수(하루 = 오전·오후)' },
        topic: { type: 'string', description: '기관·업무·주제 키워드. 모듈과 실습 예시를 고를 때 씁니다. 예: "조달청 계약 검토 법령 규격서", "보건소 민원 응대"' },
        network: networkProp,
        level: { type: 'string', enum: ['intro', 'basic', 'advanced', 'build'], description: 'intro 입문(대화창 기본), basic 기초(대화창+전용 서비스), advanced 중급(전용 서비스+AI가 준 코드 실행), build 심화(코드 실행+코딩에이전트 구축). 기본 basic. 인증 등급처럼 단계가 있으면 낮은 단계는 basic, 도구를 직접 만드는 단계는 build로 둡니다' },
        rows: { type: 'array', items: { type: 'integer' }, description: '쓸 행 번호를 직접 지정(level보다 우선). work 1~4, vibe 1~5' },
        tracks: tracksProp,
        columns: { type: 'array', items: { type: 'string' }, description: '집중할 열 키. 비우면 모든 열. work: R D C A P, vibe: C G N K. 공통 기반 O는 항상 포함' },
        per_slot: { type: 'integer', minimum: 1, maximum: 6, description: '오전·오후 한 칸에 넣을 모듈 수(기본 3, 반나절 3~4시간 기준)' },
        include: { type: 'array', items: { type: 'string' }, description: '반드시 넣을 모듈 id' },
        exclude: { type: 'array', items: { type: 'string' }, description: '뺄 모듈 id(이미 들은 과정 등)' },
        examples_per_module: { type: 'integer', minimum: 0, maximum: 8, description: '모듈마다 돌려줄 실습 예시 수(기본 3, 주제에 가까운 순)' },
        name: { type: 'string', description: '과정 이름' }
      },
      required: ['board', 'days']
    },
    run(a, ctx) {
      const b = boardOf(a.board);
      const nDays = Math.min(Math.max(parseInt(a.days, 10) || 1, 1), 10);
      const network = ['external', 'closed', 'mixed'].includes(a.network) ? a.network : 'external';
      const levelKey = LEVELS[b.key][a.level] ? a.level : 'basic';
      const level = LEVELS[b.key][levelKey];
      const rows = Array.isArray(a.rows) && a.rows.length ? a.rows.map(Number).filter(l => b.axes.rows[l]) : level.rows;
      const maxRow = Math.max(...rows);
      const maxGrade = Array.isArray(a.rows) && a.rows.length ? 5 : level.maxGrade;
      const trackKeys = (a.tracks || []).map(t => trackKeyOf(b, t)).filter(Boolean);
      const cols = (a.columns || []).map(c => String(c).toUpperCase()).filter(c => b.axes.cols[c]);
      const perSlot = Math.min(Math.max(parseInt(a.per_slot, 10) || 3, 1), 6);
      const nEx = a.examples_per_module === undefined ? 3 : Math.min(Math.max(a.examples_per_module, 0), 8);
      const words = tokenize(a.topic);
      const exclude = new Set((a.exclude || []).map(x => String(x).toUpperCase()));
      const notes = [];

      // 후보: 행·난이도·망·직무·열 조건. 폐쇄망이면 외부망 모듈은 폐쇄망 대안으로 바꾼다
      const pool = new Map();
      for (const m0 of b.modules) {
        let m = m0;
        const isBase = m.d === b.axes.base.key;
        if (isBase ? m.l > maxRow : !rows.includes(m.l)) continue;
        if ((m.g || 1) > maxGrade && !(isBase && m.g === 5)) continue;
        if (!isBase && cols.length && !cols.includes(m.d)) continue;
        if (!trackOk(b, m, trackKeys)) continue;
        let from = null;
        if (!netOk(m, network)) {
          // 폐쇄망 대안은 한 단계 위 행, 중급 난이도까지만 받는다
          const alt = m.alt && b.byId[m.alt];
          if (!alt || !netOk(alt, network) || alt.l > maxRow + 1 || (alt.g || 1) > Math.max(maxGrade, 3)) continue;
          from = m.id; m = alt;
        }
        if (exclude.has(m.id) || pool.has(m.id)) continue;
        const topic = moduleScore(m, words) + (from ? moduleScore(b.byId[from], words) / 2 : 0);
        const track = trackKeys.some(k => m.k.includes(k)) ? 2 : 0;
        pool.set(m.id, { m, from, score: 1 + topic + track + (m.g === 5 ? -5 : 0) });
      }

      const target = nDays * 2 * perSlot;
      const chosen = [];
      for (const id of (a.include || []).map(x => String(x).toUpperCase())) {
        const m = b.byId[id];
        if (!m) { notes.push(`include의 ${id}는 없는 모듈입니다.`); continue; }
        if (!chosen.includes(m)) chosen.push(m);
      }
      // 점수순으로 고르되 한 열에 몰리지 않게 열별 상한을 둔다
      const ranked = [...pool.values()].sort((x, y) => y.score - x.score || (x.m.g || 1) - (y.m.g || 1));
      const baseCap = Math.max(2, Math.ceil(target * 0.25));
      const colCap = Math.max(2, Math.ceil(target * (cols.length === 1 ? 1 : 0.35)));
      // 망 환경이 섞인 기관이면 외부망 필요 모듈을 절반 이하로 둔다
      const extCap = network === 'mixed' ? Math.floor(target / 2) : Infinity;
      const count = {};
      let ext = chosen.filter(m => m.n === 'E').length;
      for (const pass of [0, 1]) {
        for (const { m } of ranked) {
          if (chosen.length >= target) break;
          if (chosen.includes(m)) continue;
          const cap = m.d === b.axes.base.key ? baseCap : colCap;
          if (pass === 0 && (count[m.d] || 0) >= cap) continue;
          if (m.n === 'E' && ext >= extCap) continue;
          chosen.push(m); count[m.d] = (count[m.d] || 0) + 1;
          if (m.n === 'E') ext++;
        }
      }
      // 여러 날이면 프로젝트 모듈(난이도 5)을 마지막에 둔다
      const project = nDays >= 2 && !chosen.some(m => m.g === 5) ? [...pool.values()].map(x => x.m).find(m => m.g === 5 && m.d === b.axes.base.key) : null;
      if (project) { if (chosen.length >= target) chosen.pop(); chosen.push(project); }
      const replaced = chosen.map(m => pool.get(m.id)?.from && `${pool.get(m.id).from}→${m.id}`).filter(Boolean);
      if (replaced.length) notes.push(`폐쇄망이라 외부망 모듈을 폐쇄망 대안으로 바꿨습니다: ${replaced.join(', ')}`);
      if (chosen.length < target) notes.push(`조건에 맞는 모듈이 ${chosen.length}개라 칸당 ${perSlot}개를 다 채우지 못했습니다. level·rows·columns·tracks 조건을 넓히면 늘어납니다.`);

      // 순서: 행(방법)마다 공통 기반 먼저 → 난이도 → 열, 프로젝트는 끝
      const colIdx = d => (d === b.axes.base.key ? -1 : b.axes.colOrder.indexOf(d));
      const key = m => [m.g === 5 ? 1 : 0, m.l, colIdx(m.d) === -1 ? 0 : 1, m.g || 1, colIdx(m.d)];
      chosen.sort((x, y) => { const kx = key(x); const ky = key(y); for (let i = 0; i < kx.length; i++) if (kx[i] !== ky[i]) return kx[i] - ky[i]; return 0; });
      const slots = nDays * 2;
      const days = Array.from({ length: nDays }, () => ({ am: [], pm: [] }));
      chosen.forEach((m, i) => {
        const si = Math.min(Math.floor(i * slots / chosen.length), slots - 1);
        days[Math.floor(si / 2)][si % 2 ? 'pm' : 'am'].push(m.id);
      });

      const name = String(a.name || '').trim().slice(0, 60) || `${b.axes.courseName} (${nDays}일)`;
      const check = checkCourse(b, days, network, nDays);
      const detail = m => {
        const ex = m.ex.map((e, i) => ({ e, i, s: textScore(e, words) })).sort((x, y) => y.s - x.s || x.i - y.i).slice(0, nEx).map(x => x.e);
        return { ...brief(b, m), examples: ex, output: m.out || '' };
      };
      return {
        name,
        settings: { board: b.name, days: nDays, network, level: `${levelKey} (${level.label})`, rows: rows.map(l => rowName(b, l)), tracks: trackKeys.map(k => b.axes.tracks[k]), per_slot: perSlot, topic_words: words },
        days: days.map((d, i) => ({ day: i + 1, am: d.am.map(id => detail(b.byId[id])), pm: d.pm.map(id => detail(b.byId[id])) })),
        check: { ok: check.ok, problems: check.problems },
        notes,
        board_url: planUrl(b, ctx.site, name, days),
        table_markdown: tableMarkdown(b, days),
        module_url: moduleUrl(b, ctx.site, '{id}')
      };
    }
  },
  {
    name: 'search_modules',
    title: '역량 모듈 검색',
    description: '교육과정 역량 모듈을 검색해 관련도 순으로 돌려줍니다. 낱말 여러 개를 넣어도 모두 맞을 필요는 없습니다. 보드, 열, 행, 난이도, 대상 직무, 망 환경, 도구 이름으로 거를 수 있습니다. 여러 모듈의 상세는 get_module에 ids로 한 번에 요청합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '검색어. 모듈 이름·키워드·도구·설명·실습 예시·사례에서 찾습니다. 예: "계약서 비교", "회의록 HWPX", "NotebookLM"' },
        board: { ...boardProp, description: boardProp.description + '. 비우면 두 보드 모두' },
        column: { type: 'string', description: '열 키. work: O 공통, R 리서치, D 문서, C 콘텐츠, A 데이터, P 업무처리. vibe: O 공통, C 챗 AI 결과물, G 앱 생성 서비스, N 에이전트 서비스, K 코딩에이전트' },
        row: { type: 'integer', description: '행 번호. work는 1~4(L1 대화형·L2 위임형·L3 제작형·L4 구축형), vibe는 1~5(S1~S5)' },
        max_grade: { type: 'integer', minimum: 1, maximum: 5, description: '난이도 상한. 1 입문 2 기초 3 중급 4 심화 5 프로젝트' },
        track: { type: 'string', description: '대상 직무 키 또는 이름. work: 공·서·정·재·홍·민·연·전, vibe: 공·초·현·강·전·개' },
        tool: { type: 'string', description: '도구 이름으로 거르기. 예: NotebookLM, Python, Ollama' },
        network: { type: 'string', enum: ['closed', 'external', 'all'], description: 'closed = 폐쇄망에서 쓸 수 있는 모듈만(외부망 필요 제외), external = 외부망 필요 모듈만' },
        limit: { type: 'integer', minimum: 1, maximum: 50, description: '최대 개수(기본 15)' }
      }
    },
    run(a, ctx) {
      const words = tokenize(a.query);
      const tool = String(a.tool || '').trim().toLowerCase();
      const res = [];
      for (const b of pickBoards(a.board)) {
        const trackKey = trackKeyOf(b, a.track);
        for (const m of b.modules) {
          if (a.column && m.d !== String(a.column).toUpperCase()) continue;
          if (a.row && m.l !== a.row) continue;
          if (a.max_grade && (m.g || 1) > a.max_grade) continue;
          if (a.track && !(trackKey && trackOk(b, m, [trackKey]))) continue;
          if (tool && !m.s.some(x => x.toLowerCase().includes(tool))) continue;
          if (a.network === 'closed' && m.n === 'E') continue;
          if (a.network === 'external' && m.n !== 'E') continue;
          const score = moduleScore(m, words);
          if (words.length && score < 0.3) continue;
          res.push({ score, b, m });
        }
      }
      res.sort((x, y) => y.score - x.score);
      const limit = Math.min(Math.max(a.limit || 15, 1), 50);
      return {
        total: res.length, shown: Math.min(res.length, limit),
        modules: res.slice(0, limit).map(({ b, m }) => ({ board: b.key, ...brief(b, m) })),
        module_url: `${ctx.site}/curriculum/#m={id} (work) · ${ctx.site}/vibecoding/#m={id} (vibe)`
      };
    }
  },
  {
    name: 'get_module',
    title: '역량 모듈 상세',
    description: '모듈의 설명, 실습 예시 전체, 산출물, 도구, 대상 직무, 공공·민간 적용 사례, 폐쇄망 대안, 다음 단계 모듈을 돌려줍니다. 여러 개는 ids로 한 번에(최대 12개) 요청합니다. 바이브코딩 모듈은 구성도와 관련 시나리오도 포함합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: '모듈 id 하나. 예: D15, R2, VK10' },
        ids: { type: 'array', items: { type: 'string' }, maxItems: 12, description: '모듈 id 여러 개' }
      }
    },
    run(a, ctx) {
      const list = (Array.isArray(a.ids) && a.ids.length ? a.ids : [a.id]).filter(Boolean).slice(0, 12).map(x => String(x).trim().toUpperCase());
      if (!list.length) throw new UserError('id 또는 ids를 넣습니다.');
      const found = []; const missing = [];
      for (const id of list) { const b = boardOfId(id); if (b) found.push(full(b, b.byId[id], ctx.site)); else missing.push(id); }
      if (!found.length) throw new UserError(`모듈 id ${missing.join(', ')}를 찾지 못했습니다. search_modules로 id를 먼저 확인합니다.`);
      if (!Array.isArray(a.ids) || !a.ids.length) return found[0];
      return { modules: found, missing };
    }
  },
  {
    name: 'find_practices',
    title: '실습 예시·적용 사례 찾기',
    description: '모든 모듈의 실습 예시(약 1,000개)와 공공·민간 적용 사례에서 주제에 맞는 항목을 찾아 모듈 id와 함께 돌려줍니다. "OO 업무에 쓸 실습", "공공기관 적용 사례"처럼 모듈보다 작은 단위가 필요할 때 씁니다.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '주제 낱말. 예: "계약서 비교", "민원 답변", "예산 엑셀"' },
        board: { ...boardProp, description: boardProp.description + '. 비우면 두 보드 모두' },
        kind: { type: 'string', enum: ['examples', 'cases', 'all'], description: 'examples 실습 예시, cases 공공·민간 사례, all 둘 다(기본)' },
        network: { type: 'string', enum: ['closed', 'all'], description: 'closed = 폐쇄망에서 쓸 수 있는 모듈의 항목만' },
        limit: { type: 'integer', minimum: 1, maximum: 40, description: '최대 개수(기본 20)' }
      },
      required: ['query']
    },
    run(a) {
      const words = tokenize(a.query);
      if (!words.length) throw new UserError('query가 비어 있습니다.');
      const kind = a.kind || 'all';
      const res = [];
      for (const b of pickBoards(a.board)) {
        for (const m of b.modules) {
          if (a.network === 'closed' && m.n === 'E') continue;
          const bonus = moduleScore(m, words) / 20;
          const push = (type, text, extra) => { const s = textScore(text, words); if (s > 0) res.push({ s: s + bonus, item: { type, text, module: m.id, module_title: m.t, row: rowName(b, m.l), network: NET[m.n], ...extra } }); };
          if (kind !== 'cases') m.ex.forEach(e => push('example', e));
          if (kind !== 'examples') {
            (m.pub || []).forEach(p => push('public_case', p.c, { who: p.j }));
            (m.pri || []).forEach(p => push('private_case', p.c, { who: p.j }));
          }
        }
      }
      res.sort((x, y) => y.s - x.s);
      const limit = Math.min(Math.max(a.limit || 20, 1), 40);
      return { total: res.length, results: res.slice(0, limit).map(r => r.item) };
    }
  },
  {
    name: 'get_design_guide',
    title: '과정 설계 기준',
    description: '보드의 축 기준(L1~L4 나누는 법, S1~S5), 난이도·망 환경 표기, 모듈 구성 기준, 과정 배치 원칙, draft_course 수준(level) 정의를 짧게 돌려줍니다. 기준을 설명하거나 과정 구조를 정할 때 웹 검색 대신 씁니다.',
    inputSchema: { type: 'object', properties: { board: { ...boardProp, description: boardProp.description + '. 비우면 두 보드 모두' } } },
    run(a) {
      return pickBoards(a.board).map(b => ({
        board: b.key, name: b.name,
        columns: Object.fromEntries(Object.entries(b.axes.cols).map(([k, v]) => [k, `${v[0]}: ${v[1]}`])),
        rows: Object.fromEntries(b.axes.rowOrder.map(l => [`${b.axes.rowPrefix}${l}`, `${b.axes.rows[l][0]} (${b.axes.rows[l][1]}) ${b.axes.rows[l][2] || ''}`.trim()])),
        row_rule: b.key === 'work'
          ? '세로축은 난이도가 아니라 AI 활용 방법입니다. L1·L2는 기능이 아니라 쓰는 화면으로 나눕니다. ChatGPT·Gemini·Claude·기관/로컬 LLM 챗 대화창 안의 기능(딥리서치·에이전트 모드·프로젝트·커넥터·지식 베이스)은 L1, 다른 주소나 앱을 여는 전용 서비스(NotebookLM·Gamma·Genspark·전사 앱·브라우저 에이전트·오피스 내장 AI)는 L2, AI가 짜준 코드를 붙여 넣어 실행(API·Ollama 호출 포함)은 L3, 코딩에이전트로 구축은 L4입니다.'
          : '세로축은 만든 결과물의 구조 단계입니다. S1 로컬 실행, S2 주소로 공유, S3 외부 데이터 연결, S4 백엔드·DB·로그인, S5 AI 기능 연결 순으로 구조가 늘어납니다.',
        grade: GRADE,
        network: NET,
        targets: b.axes.tracks,
        module_rule: '칸당 모듈 2~3개, 모듈당 실습 예시 5~8개, 공공·민간 적용 사례 2건씩. 모듈 이름은 도구가 바뀌어도 유지되게 업무 결과물 중심으로 짓습니다. 외부망 전용 모듈에는 폐쇄망 대안(alt)을 답니다.',
        course_rule: `하루는 오전·오후 두 칸, 칸마다 모듈 3~4개(최대 ${MAX_PER_SLOT}개)입니다. 공통 기반(보안·검증·문제 정의)으로 시작해 방법(행) 순서로 올라가고, 여러 날 과정은 프로젝트 모듈로 끝냅니다. 폐쇄망 기관은 외부망 필요 모듈 대신 폐쇄망 대안을 씁니다.`,
        levels: Object.fromEntries(Object.entries(LEVELS[b.key]).map(([k, v]) => [k, `${v.label} — 행 ${v.rows.map(l => b.axes.rowPrefix + l).join('·')}, 난이도 ${v.maxGrade} 이하`]))
      }));
    }
  },
  {
    name: 'get_matrix',
    title: '매트릭스 구조',
    description: '보드의 가로축·세로축 정의와 칸마다 들어 있는 모듈 목록(id·짧은 이름)을 돌려줍니다. 과정 전체 구조를 파악할 때 씁니다.',
    inputSchema: { type: 'object', properties: { board: boardProp }, required: ['board'] },
    run(a, ctx) {
      const b = boardOf(a.board);
      const ax = b.axes;
      const item = m => `${m.id} ${m.st || m.t}${m.n === 'E' ? ' (외부망)' : ''}`;
      return {
        board: b.name,
        url: ctx.site + b.path,
        columns: { axis: ax.colAxisName, items: Object.fromEntries(Object.entries(ax.cols).map(([k, v]) => [k, { name: v[0], desc: v[1] }])) },
        rows: { axis: ax.rowAxisName, items: Object.fromEntries(ax.rowOrder.map(l => [`${ax.rowPrefix}${l}`, { name: ax.rows[l][0], sub: ax.rows[l][1], desc: ax.rows[l][2] || '' }])) },
        base: { name: ax.base.label, modules: b.modules.filter(m => m.d === ax.base.key).map(item) },
        cells: ax.colOrder.flatMap(d => ax.rowOrder.map(l => ({
          column: `${d} ${ax.cols[d][0]}`, row: rowName(b, l),
          modules: b.modules.filter(m => m.d === d && m.l === l).map(item)
        }))),
        targets: ax.tracks
      };
    }
  },
  {
    name: 'list_presets',
    title: '예시 과정',
    description: '보드에 들어 있는 예시 과정(일차·오전·오후별 모듈 배치)을 돌려줍니다. 과정을 새로 짤 때 배치 방식 참고용으로 씁니다.',
    inputSchema: { type: 'object', properties: { board: boardProp }, required: ['board'] },
    run(a, ctx) {
      const b = boardOf(a.board);
      const name = id => (b.byId[id] ? `${id} ${b.byId[id].t}` : `${id} (없는 모듈)`);
      return Object.entries(b.presets).map(([key, p]) => ({
        key, name: p.name,
        days: p.days.map((d, i) => ({ day: i + 1, am: d.am.map(name), pm: d.pm.map(name) })),
        board_url: planUrl(b, ctx.site, p.name, p.days)
      }));
    }
  },
  {
    name: 'check_course',
    title: '과정표 검사',
    description: '과정표 초안을 보드 규칙으로 검사합니다. 없는 모듈 id, 망 환경에 맞지 않는 모듈(폐쇄망인데 외부망 필요), 중복, 빈 칸, 칸당 모듈 수, 일수를 확인하고 문제 목록, 모듈 이름을 붙인 과정표, 보드에서 여는 링크, 마크다운 표를 돌려줍니다.',
    inputSchema: {
      type: 'object',
      properties: {
        board: boardProp,
        network: networkProp,
        expected_days: { type: 'integer', minimum: 1, maximum: 10, description: '과정 일수. 주면 days 길이와 비교합니다.' },
        name: { type: 'string', description: '과정 이름(보드 링크에 들어갑니다)' },
        days: {
          type: 'array', description: '일차별 배치',
          items: { type: 'object', properties: { am: { type: 'array', items: { type: 'string' } }, pm: { type: 'array', items: { type: 'string' } } } }
        }
      },
      required: ['board', 'days']
    },
    run(a, ctx) {
      const b = boardOf(a.board);
      const r = checkCourse(b, Array.isArray(a.days) ? a.days.slice(0, 10) : [], a.network, a.expected_days);
      const name = String(a.name || '').trim().slice(0, 60);
      return { ok: r.ok, problems: r.problems, days: r.days, board_url: planUrl(b, ctx.site, name, r.clean), table_markdown: tableMarkdown(b, r.clean) };
    }
  },
  {
    name: 'lookup_term',
    title: '바이브코딩 용어·오류 사전',
    description: '바이브코딩 용어 100개와 자주 보는 오류 메시지 26개에서 찾습니다. 뜻, 언제 나오는지, AI에게 말할 문장, 관련 용어, 관련 교육 모듈을 돌려줍니다.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '용어나 오류 메시지 일부. 예: CORS, 환경변수, ModuleNotFoundError' },
        kind: { type: 'string', enum: ['term', 'error', 'all'], description: '기본 all' },
        limit: { type: 'integer', minimum: 1, maximum: 20, description: '최대 개수(기본 5)' }
      },
      required: ['query']
    },
    run(a) {
      const q = String(a.query || '').trim().toLowerCase();
      if (!q) throw new UserError('query가 비어 있습니다.');
      const limit = Math.min(Math.max(a.limit || 5, 1), 20);
      const res = [];
      if (a.kind !== 'error') {
        TERMS.forEach(t => {
          const names = [t.t, t.en, ...(t.alias || [])].filter(Boolean).map(x => x.toLowerCase());
          const exact = names.some(n => n === q);
          const hit = exact || names.some(n => n.includes(q) || q.includes(n)) || (t.d + ' ' + t.w).toLowerCase().includes(q);
          if (hit) res.push({ score: exact ? 3 : names.some(n => n.includes(q)) ? 2 : 1, item: { kind: 'term', term: t.t, english: t.en, group: GROUPS[t.g] || t.g, meaning: t.d, when: t.w, say_to_ai: t.say, related: t.rel || [], modules: t.m || [] } });
        });
      }
      if (a.kind !== 'term') {
        ERRORS.forEach(e => {
          const hay = (e.t + ' ' + e.d + ' ' + e.where).toLowerCase();
          if (hay.includes(q) || q.includes(e.t.toLowerCase().slice(0, 20))) res.push({ score: e.t.toLowerCase().includes(q) ? 2 : 1, item: { kind: 'error', message: e.t, where: e.where, meaning: e.d, check_first: e.check, say_to_ai: e.say, related: e.rel || [] } });
        });
      }
      res.sort((x, y) => y.score - x.score);
      return { total: res.length, results: res.slice(0, limit).map(r => r.item) };
    }
  },
  {
    name: 'recommend_stack',
    title: '바이브코딩 스택 진단',
    description: '만들 프로그램의 조건을 받아 구조 단계(S1~S5), 만드는 방식, 기술 조합, 주의할 점, 관련 교육 모듈, 시작 프롬프트를 돌려줍니다. VibeStack 메인 페이지의 규칙 기반 진단과 같은 결과입니다. 모르는 항목은 비워 두면 기본값으로 판정합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        answers: {
          type: 'object',
          description: '질문 키별 선택값',
          properties: Object.fromEntries(QUESTIONS.map(q => [q.key, {
            type: 'string', enum: q.options.map(o => o.v),
            description: `${q.q} ` + q.options.map(o => `${o.v}=${o.label}`).join(', ')
          }]))
        },
        note: { type: 'string', description: '추가 요구사항(시작 프롬프트에 들어갑니다)' }
      },
      required: ['answers']
    },
    run(a) {
      const answers = { ...(a.answers || {}) };
      for (const q of QUESTIONS) {
        if (answers[q.key] !== undefined && !q.options.some(o => o.v === answers[q.key])) throw new UserError(`${q.key} 값 ${answers[q.key]}는 쓸 수 없습니다. 가능한 값: ${q.options.map(o => o.v).join(', ')}`);
      }
      for (const q of activeQuestions(answers)) if (answers[q.key] === undefined) answers[q.key] = q.options[0].v;
      const r = diagnose(answers, a.note || '');
      return {
        answers_used: answers,
        stage: `S${r.stage} ${r.stageName}`, stage_desc: r.stageDesc,
        method: r.methodName, method_desc: r.methodDesc, reasons: r.reasons,
        stack: r.stack, warnings: r.warnings,
        modules: (r.modules || []).map(id => (BOARDS.vibe.byId[id] ? { id, title: BOARDS.vibe.byId[id].t } : { id })),
        scenarios: (r.scenarios || []).map(id => scenarioTitle[id] || id),
        start_prompt: r.prompt
      };
    }
  }
];

export class UserError extends Error {}
