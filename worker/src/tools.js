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
  '홈페이지': ['웹', '사이트'], '마케팅': ['홍보', '콘텐츠', 'sns'], '광고': ['홍보', '콘텐츠'], '앱': ['웹앱', '앱'], '챗봇': ['챗봇', 'rag'], '에이전트': ['에이전트', '위임'], 'api': ['api', '키']
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
function checkCourse(b, days, network, expectedDays, talk = false) {
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
      if (!ids.length && !(talk && sk === 'pm')) problems.push(`${label}이 비어 있습니다.`);
      if (ids.length > MAX_PER_SLOT) problems.push(`${label}에 모듈이 ${ids.length}개입니다. ${MAX_PER_SLOT}개 이하를 권장합니다.`);
    }
    clean.push(c);
    return r;
  });
  if (network === 'mixed' && total && ext / total > 0.5) problems.push(`외부망 필요 모듈이 ${ext}/${total}개로 절반을 넘습니다.`);
  return { ok: problems.length === 0, problems, days: out, clean };
}

// ---------------------------------------------------------------- 요청 문장 해석
// MCP를 쓰는 사람은 보드 용어(L1·S1·열 키)를 모른다. 요청 문장에서 기간·망·경험·목표·직무를 읽는다.
const has = (t, re) => re.test(t);
export function parseRequest(text) {
  const t = String(text || '').toLowerCase().replace(/\s+/g, ' ');
  const guessed = [];
  const num = { 하루: 1, 이틀: 2, 사흘: 3, 나흘: 4, 닷새: 5 };
  let days = 0; let hours = 0;
  const d = t.match(/(\d+)\s*일(?!차)/) || t.match(/(하루|이틀|사흘|나흘|닷새)/);
  if (d) days = num[d[1]] || parseInt(d[1], 10);
  const h = t.match(/(\d+(?:\.\d+)?)\s*(시간|h\b)/);
  if (h) hours = parseFloat(h[1]);
  if (!days && !hours) { days = 1; guessed.push('days'); }

  let internet = 'yes';
  if (has(t, /폐쇄망|내부망|망\s?분리|업무망|인터넷(이|을)?\s?(안|못|불가|차단)|외부\s?(ai|망)\S*\s?(안|못|불가|차단)|(챗gpt|chatgpt|클라우드 ai)\S*\s?(못|안|금지|차단)|오프라인|보안.{0,4}(엄격|민감)/)) internet = 'no';
  if (has(t, /일부|혼합|섞|망\s?연계|인터넷.{0,6}(일부|제한)/) && internet === 'no') internet = 'partial';
  else if (internet === 'yes' && has(t, /공공|기관|청\b|시청|구청|도청|군청|공단|공사|부처|지자체|공무원|청 /)) { internet = 'partial'; guessed.push('internet'); }
  else if (internet === 'yes') guessed.push('internet');

  let goal = 'use';
  if (has(t, /바이브\s?코딩|웹\s?앱|웹앱|앱(을|을\s)?\s?만들|홈페이지|웹\s?(사이트|서비스)\s?(만들|개발|구축)|서비스(를)?\s?만들|배포|풀스택|프론트엔드|백엔드/)) goal = 'build_apps';
  else if (has(t, /자동화|도구(를)?\s?(직접\s?)?(만들|제작)|매크로|vba|파이썬|python|코드|스크립트|앱스\s?스크립트|apps script|poc|시제품|블루|구축|rag|에이전트\s?(만들|개발)|챗봇\s?(만들|개발)/)) goal = 'build_tools';
  else guessed.push('goal');

  let experience = '';
  if (has(t, /개발자|전산|정보화|it\s?담당|개발\s?경험|엔지니어/)) experience = 'developer';
  else if (has(t, /코딩\s?(가능|경험|조금)|코드를?\s?(조금|다룰)|파이썬.{0,4}(경험|가능)/)) experience = 'coding';
  else if (has(t, /처음|왕초보|초보|입문|기초|전\s?직원|비전공|어르신|시니어|첫/)) experience = 'none';
  else if (has(t, /심화|고급|실무\s?활용|이미\s?(쓰|활용)|활용\s?중|그린/)) experience = 'working';
  else if (has(t, /써\s?(본|봤)|사용해\s?(본|봤)|중급/)) experience = 'chat';
  if (!experience) { experience = goal === 'build_apps' ? 'chat' : goal === 'build_tools' ? 'working' : 'chat'; guessed.push('experience'); }

  const TRACK_WORDS = [['홍', /홍보|대변인|언론|sns|콘텐츠|마케팅|광고|브랜드/], ['민', /민원|현장|상담|콜센터|창구|복지/], ['재', /예산|재무|회계|기획/], ['정', /정책|제도|법령|규제|입법/], ['연', /연구|r&d|논문|조사/], ['전', /전산|정보화|it|개발/], ['서', /서무|총무|행정\s?지원|인사/],
    ['초', /비전공|입문자|초보/], ['현', /현업|실무자/], ['강', /강사|교사|교육\s?담당|교수/], ['개', /개발자|개발\s?경험/]];
  const tracks = TRACK_WORDS.filter(([, re]) => re.test(t)).map(([k]) => k);
  if (!tracks.length) guessed.push('audience');
  return { days, hours, internet, goal, experience, tracks, guessed };
}
function pickLevel(goal, experience) {
  if (goal === 'build_apps') return { none: 'intro', chat: 'intro', working: 'basic', coding: 'advanced', developer: 'build' }[experience];
  if (goal === 'build_tools') return experience === 'coding' || experience === 'developer' ? 'build' : 'make';
  return { none: 'intro', chat: 'basic', working: 'basic', coding: 'advanced', developer: 'build' }[experience];
}
// 사이트 용어 없이 읽히는 교육 내용 한 줄
function plain(b, m, exFor) {
  const alt = m.alt && b.byId[m.alt];
  return {
    id: m.id, title: m.t, what: m.desc,
    how: `${b.axes.rows[m.l][1]} (${b.axes.rowPrefix}${m.l})`,
    area: colName(b, m.d),
    difficulty: GRADE[m.g || 1],
    internet: m.n === 'E' ? `외부 서비스 필요${alt ? ` — 폐쇄망이면 ${alt.id} ${alt.t}` : ''}` : m.n === 'I' ? '외부에서 준비 후 내부로 반입' : '폐쇄망에서도 가능',
    tools: m.s.slice(0, 6),
    practice: exFor(m),
    output: m.out || ''
  };
}

// 수준별 기본 행(방법·구조 단계)과 난이도 상한
for (const b of Object.values(BOARDS)) for (const m of b.modules) {
  ALL_MODULES.push(m);
  ALL_TEXTS.push(...m.ex.map(e => e.toLowerCase()), ...[...(m.pub || []), ...(m.pri || [])].map(p => p.c.toLowerCase()));
}

// 공통 기반 모듈을 고를 때 점수가 같으면 이 순서로 (보안·검증·문제 정의 먼저)
const BASE_PRIORITY = {
  work: ['O2', 'O6', 'O11', 'O3', 'O12', 'O1', 'O5', 'O10', 'O9', 'O8', 'O7'],
  vibe: ['VO2', 'VO1', 'VO5', 'VO3', 'VO4', 'VO8', 'VO6', 'VO9']
};
const LEVELS = {
  work: { intro: { rows: [1], maxGrade: 2, label: '입문: AI 대화창 기본' }, basic: { rows: [1, 2], maxGrade: 3, label: '기초: 대화창과 전용 서비스' }, advanced: { rows: [2, 3], maxGrade: 5, label: '중급: 전용 서비스와 AI가 준 코드 실행' }, make: { rows: [3], maxGrade: 5, label: '제작: AI가 짜 준 코드로 업무 도구 만들기' }, build: { rows: [3, 4], maxGrade: 5, label: '심화: 코드 실행과 코딩에이전트로 구축' } },
  vibe: { intro: { rows: [1, 2], maxGrade: 2, label: '입문: 로컬 실행과 배포' }, basic: { rows: [1, 2, 3], maxGrade: 3, label: '기초: 로컬·배포·외부 데이터' }, advanced: { rows: [3, 4], maxGrade: 5, label: '중급: 외부 데이터와 백엔드' }, build: { rows: [4, 5], maxGrade: 5, label: '심화: 백엔드와 AI 기능 연결' } }
};

// 모듈 고르기와 배치: 행·난이도·망·직무 조건 → 주제 점수 → 열 고르게 → 순서대로 칸에 나눈다
function draft(b, o) {
  const level = LEVELS[b.key][o.levelKey];
  const rows = level.rows;
  const maxRow = Math.max(...rows);
  const maxGrade = level.maxGrade;
  const { words, network, trackKeys } = o;
  const exclude = new Set((o.exclude || []).map(x => String(x).toUpperCase()));
  const notes = [];
  const pool = new Map();
  for (const m0 of b.modules) {
    let m = m0;
    const isBase = m.d === b.axes.base.key;
    if (isBase ? m.l > maxRow : !rows.includes(m.l)) continue;
    if ((m.g || 1) > maxGrade && !(isBase && m.g === 5)) continue;
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

  const target = o.slots * o.perSlot;
  const chosen = [];
  for (const id of (o.include || []).map(x => String(x).toUpperCase())) {
    const m = b.byId[id];
    if (!m) { notes.push(`include의 ${id}는 없는 모듈입니다.`); continue; }
    if (!chosen.includes(m)) chosen.push(m);
  }
  // 점수순으로 고르되 한 영역에 몰리지 않게 상한을 둔다. 망분리 기관은 외부 서비스 모듈을 절반 이하로
  const ranked = [...pool.values()].sort((x, y) => y.score - x.score || (x.m.g || 1) - (y.m.g || 1));
  const baseCap = Math.max(target <= 3 ? 1 : 2, Math.ceil(target * 0.25));
  const colCap = Math.max(2, Math.ceil(target * 0.35));
  const extCap = network === 'mixed' ? Math.floor(target / 2) : Infinity;
  const count = {};
  let ext = chosen.filter(m => m.n === 'E').length;
  // 여러 회차 과정은 공통 기반(보안·검증·문제 정의)을 먼저 담는다
  const basePri = BASE_PRIORITY[b.key];
  const baseMin = o.slots === 1 ? 0 : Math.min(o.nDays + 1, baseCap);
  const bases = ranked.filter(x => x.m.d === b.axes.base.key && x.m.g !== 5)
    .sort((x, y) => y.score - x.score || basePri.indexOf(x.m.id) - basePri.indexOf(y.m.id));
  for (const { m } of bases) {
    if ((count[m.d] || 0) >= baseMin || chosen.length >= target) break;
    if (chosen.includes(m) || (m.n === 'E' && ext >= extCap)) continue;
    chosen.push(m); count[m.d] = (count[m.d] || 0) + 1;
    if (m.n === 'E') ext++;
  }
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
  // 망분리 기관: 모자라게 채워졌어도 외부 서비스 모듈이 절반을 넘지 않게 뺀다
  while (network === 'mixed' && ext > chosen.length / 2) {
    const i = chosen.map(m => m.n).lastIndexOf('E');
    chosen.splice(i, 1); ext--;
  }
  // 여러 날이면 프로젝트 모듈(난이도 5)로 끝낸다
  const project = o.nDays >= 2 && !chosen.some(m => m.g === 5) ? [...pool.values()].map(x => x.m).find(m => m.g === 5 && m.d === b.axes.base.key) : null;
  if (project) { if (chosen.length >= target) chosen.pop(); chosen.push(project); }
  const replaced = chosen.map(m => pool.get(m.id)?.from && `${pool.get(m.id).from}→${m.id}`).filter(Boolean);
  if (replaced.length) notes.push(`외부 서비스를 쓸 수 없어 폐쇄망 대안으로 바꾼 내용: ${replaced.join(', ')}`);
  if (chosen.length < target) notes.push(`조건에 맞는 교육 내용이 ${chosen.length}개라 계획한 ${target}개를 다 채우지 못했습니다. 경험 수준이나 목표를 넓히면 늘어납니다.`);

  // 순서: 행(방법)마다 공통 기반 먼저 → 난이도 → 영역, 프로젝트는 끝
  const colIdx = d => (d === b.axes.base.key ? -1 : b.axes.colOrder.indexOf(d));
  const key = m => [m.g === 5 ? 1 : 0, m.l, colIdx(m.d) === -1 ? 0 : 1, m.g || 1, colIdx(m.d)];
  chosen.sort((x, y) => { const kx = key(x); const ky = key(y); for (let i = 0; i < kx.length; i++) if (kx[i] !== ky[i]) return kx[i] - ky[i]; return 0; });
  const days = Array.from({ length: o.nDays }, () => ({ am: [], pm: [] }));
  chosen.forEach((m, i) => {
    const si = Math.min(Math.floor(i * o.slots / chosen.length), o.slots - 1);
    days[Math.floor(si / 2)][si % 2 ? 'pm' : 'am'].push(m.id);
  });
  const check = checkCourse(b, days, network, o.nDays, o.slots === 1);
  const exFor = m => m.ex.map((e, i) => ({ e, i, s: textScore(e, words) })).sort((x, y) => y.s - x.s || x.i - y.i).slice(0, o.nEx).map(x => x.e);
  return { days, problems: check.problems, notes, exFor };
}

// ---------------------------------------------------------------- 도구 정의
const boardProp = { type: 'string', enum: ['work', 'vibe'], description: 'work = AI 업무활용 보드(업무 영역 × AI 활용 방법 L1~L4), vibe = AI 바이브코딩 보드(만드는 방식 × 구조 단계 S1~S5)' };

const boardOf = key => { const b = BOARDS[key]; if (!b) throw new UserError('board는 work 또는 vibe입니다.'); return b; };
const networkProp = { type: 'string', enum: ['external', 'closed', 'mixed'], description: '교육 대상 기관의 망 환경. external 외부망(인터넷 가능), closed 폐쇄망·업무망(외부 AI 서비스 못 씀), mixed 둘 다 있음' };
const tracksProp = { type: 'array', items: { type: 'string' }, description: '대상 직무 키 또는 이름. work: 공 전 직원·서 서무·정 정책·재 기획재무·홍 홍보·민 민원현장·연 연구·전 정보화. vibe: 공 전체·초 입문자·현 현업·강 강사·전 전산·개 개발 경험자' };

export const TOOLS = [
  {
    name: 'design_course',
    title: 'AI 교육과정 설계',
    description: 'AI 교육과정(생성형 AI 업무활용, 바이브코딩으로 업무 도구·웹앱 만들기)을 설계합니다. 사용자의 요청 문장을 request에 그대로 넣으면 기간·대상·경험 수준·인터넷 사용 가능 여부·주제를 읽어 일차별(또는 특강 시간별) 교육 내용, 실습 과제, 산출물, 표, 과정표 링크를 한 번에 돌려줍니다. "공무원 3일 AI 교육 짜 줘", "홍보팀 2시간 특강", "인터넷 안 되는 기관 실습" 같은 요청에 먼저 씁니다. 결과의 understood를 보고 틀린 부분만 인자로 고쳐 다시 부릅니다.',
    inputSchema: {
      type: 'object',
      properties: {
        request: { type: 'string', description: '사용자의 요청 문장을 그대로 넣습니다. 예: "조달청 직원 대상 3일 AI 챔피언 과정, 계약·법령 업무 중심, 내부망 사용"' },
        days: { type: 'integer', minimum: 1, maximum: 10, description: '교육 일수. request에서 읽은 값보다 우선합니다' },
        hours: { type: 'number', minimum: 1, maximum: 60, description: '총 교육 시간. 4시간 이하면 특강 한 회차로 구성합니다' },
        internet: { type: 'string', enum: ['yes', 'no', 'partial'], description: '교육장·업무 PC에서 ChatGPT 같은 외부 AI 서비스를 쓸 수 있는지. yes 가능, no 불가(폐쇄망·내부망), partial 일부만(망분리 기관 등)' },
        experience: { type: 'string', enum: ['none', 'chat', 'working', 'coding', 'developer'], description: '교육생 경험. none AI 처음, chat 챗GPT 등을 써 봄, working 업무에 이미 활용, coding 코드를 조금 다룸, developer 개발·전산 담당' },
        goal: { type: 'string', enum: ['use', 'build_tools', 'build_apps'], description: '교육 목표. use 업무에 AI 활용(기본), build_tools AI가 짜 준 코드로 업무 자동화 도구 만들기, build_apps 바이브코딩으로 웹앱·서비스 만들기' },
        audience: { type: 'string', description: '대상 기관·직무. 예: "보건소 민원 담당", "시청 홍보팀"' },
        topic: { type: 'string', description: '중점 업무·주제. 예: "보고서, 회의록, 엑셀 집계"' },
        include: { type: 'array', items: { type: 'string' }, description: '꼭 넣을 모듈 id(이전 결과에서 본 id)' },
        exclude: { type: 'array', items: { type: 'string' }, description: '뺄 모듈 id' },
        name: { type: 'string', description: '과정 이름' },
        examples_per_module: { type: 'integer', minimum: 0, maximum: 8, description: '교육 내용마다 돌려줄 실습 과제 수(기본 3)' }
      }
    },
    run(a, ctx) {
      const text = [a.request, a.audience, a.topic].filter(Boolean).join(' ');
      const p = parseRequest(text);
      const internet = a.internet || p.internet;
      const network = internet === 'no' ? 'closed' : internet === 'partial' ? 'mixed' : 'external';
      const experience = a.experience || p.experience;
      const goal = a.goal || p.goal;
      const b = BOARDS[goal === 'build_apps' ? 'vibe' : 'work'];
      const levelKey = pickLevel(goal, experience);
      const hours = a.hours || (a.days ? 0 : p.hours);
      const days = a.days || (hours ? 0 : p.days) || (hours ? 0 : 1);
      const talk = hours && hours <= 4;
      const nDays = talk ? 1 : Math.min(days || Math.ceil(hours / 6), 10);
      const slots = talk ? 1 : nDays * 2;
      const perSlot = talk ? Math.max(1, Math.round(hours * 1.5)) : 3;
      const r = draft(b, {
        nDays, slots, perSlot, network, levelKey, trackKeys: p.tracks.filter(k => b.axes.tracks[k]),
        words: tokenize(text), include: a.include, exclude: a.exclude,
        nEx: a.examples_per_module === undefined ? 3 : a.examples_per_module
      });
      const netText = { external: '외부 AI 서비스 사용 가능', closed: '외부 AI 서비스 사용 불가(폐쇄망·내부망) — 로컬·기관 AI 중심', mixed: '일부만 가능(망분리) — 외부 서비스 실습을 절반 이하로' }[network];
      const expText = { none: 'AI 처음', chat: '챗 AI를 써 본 정도', working: '업무에 활용 중', coding: '코드를 조금 다룸', developer: '개발·전산 담당' }[experience];
      const goalText = { use: '업무에 AI 활용', build_tools: 'AI가 짜 준 코드로 업무 도구 만들기', build_apps: '바이브코딩으로 웹앱·서비스 만들기' }[goal];
      const name = String(a.name || '').trim().slice(0, 60) || `${b.axes.courseName} (${talk ? `${hours}시간 특강` : `${nDays}일`})`;
      return {
        name,
        understood: {
          duration: talk ? `${hours}시간 특강 1회` : `${nDays}일(하루 오전·오후, 반나절 3~4시간)${hours ? ` — ${hours}시간 기준` : ''}`,
          internet: netText,
          experience: expText,
          goal: goalText,
          audience: p.tracks.map(k => b.axes.tracks[k]).filter(Boolean).join(', ') || '전 직원',
          topic_words: tokenize(text).filter(w => !/^\d/.test(w)),
          level: LEVELS[b.key][levelKey].label,
          guessed: p.guessed.filter(k => !a[k]),
          how_to_fix: '틀린 항목만 days·hours·internet·experience·goal·audience·topic 인자로 넣어 다시 부릅니다.'
        },
        sessions: r.days.map((d, i) => talk
          ? { session: '특강', items: d.am.map(id => plain(b, b.byId[id], r.exFor)) }
          : { day: i + 1, morning: d.am.map(id => plain(b, b.byId[id], r.exFor)), afternoon: d.pm.map(id => plain(b, b.byId[id], r.exFor)) }),
        check: { ok: r.problems.length === 0, problems: r.problems },
        notes: r.notes,
        table_markdown: talk ? r.days[0].am.map((id, i) => `${i + 1}. ${b.byId[id].t}`).join('\n') : tableMarkdown(b, r.days),
        board_url: planUrl(b, ctx.site, name, r.days),
        board_url_note: '이 링크를 열면 VibeStack 과정 설계 보드에 이 과정표가 담깁니다. 사용자에게 함께 알려 줍니다.'
      };
    }
  },
  {
    name: 'search_modules',
    title: '역량 모듈 검색',
    description: 'AI 교육 내용(역량 모듈)을 주제나 도구 이름으로 찾아 관련도 순으로 돌려줍니다. "회의록 AI 교육 내용", "NotebookLM 가르치는 과목", "인터넷 안 되는 곳에서 할 수 있는 실습"처럼 과정 전체가 아니라 교육 내용을 고를 때 씁니다. query만 넣어도 됩니다. 인터넷 불가·폐쇄망 같은 말이 들어가면 폐쇄망에서 가능한 것만 돌려줍니다. 상세는 get_module에 ids로 한 번에 요청합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '검색어. 모듈 이름·키워드·도구·설명·실습 예시·사례에서 찾습니다. 예: "계약서 비교", "회의록 HWPX", "NotebookLM"' },
        board: { ...boardProp, description: boardProp.description + '. 비우면 두 보드 모두(보통 비워 둡니다)' },
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
      if (!a.network && parseRequest(a.query).internet === 'no') a = { ...a, network: 'closed' };
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
    description: '교육 내용(모듈)의 상세를 돌려줍니다. 설명, 실습 과제 전체, 산출물, 도구, 대상 직무, 공공·민간 적용 사례, 인터넷이 안 될 때의 대안, 다음 단계로 배울 내용이 들어 있습니다. id는 design_course·search_modules 결과에 있습니다. 여러 개는 ids로 한 번에(최대 12개) 요청합니다.',
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
    description: '실습 과제 약 1,000개와 공공기관·기업 AI 적용 사례에서 주제에 맞는 것을 찾습니다. "계약서 검토 실습 과제", "민원 업무 AI 적용 사례", "예산 엑셀 실습"처럼 과제나 사례가 필요할 때 씁니다.',
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
    description: '이 교육 체계의 기준을 설명합니다. 결과에 나오는 L1~L4(AI를 쓰는 방법 4단계: 대화창·전용 서비스·AI가 짜 준 코드 실행·코딩에이전트로 구축), S1~S5(만든 프로그램의 구조 단계), 난이도, 인터넷 표기, 과정 배치 원칙의 뜻을 사용자에게 설명할 때 씁니다.',
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
        levels: Object.fromEntries(Object.entries(LEVELS[b.key]).map(([k, v]) => [k, `${v.label} — ${v.rows.map(l => b.axes.rowPrefix + l).join('·')}, 난이도 ${GRADE[v.maxGrade]} 이하`]))
      }));
    }
  },
  {
    name: 'get_matrix',
    title: '매트릭스 구조',
    description: '교육 내용 전체 목록을 업무 영역 × AI 활용 방법 표(또는 만드는 방식 × 구조 단계 표)로 돌려줍니다. "어떤 교육 내용이 있어?"처럼 전체를 훑을 때 씁니다.',
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
    description: '미리 만들어 둔 예시 과정(전 직원 입문 1일, 폐쇄망 기관 2일, 업무 도구 만들기 2일, 바이브코딩 입문 등)을 돌려줍니다. "예시 과정 보여 줘"에 씁니다.',
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
    description: 'design_course 결과에서 교육 내용을 바꾸거나 옮긴 과정표를 검사합니다. 없는 id, 인터넷이 안 되는 기관에 외부 서비스 실습, 중복, 빈 시간, 반나절에 너무 많은 내용, 일수를 확인하고 표와 과정표 링크를 돌려줍니다.',
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
