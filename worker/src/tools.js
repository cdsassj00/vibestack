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

function brief(b, m, site) {
  return {
    board: b.key, id: m.id, title: m.t, short: m.st || m.t,
    column: colName(b, m.d), row: rowName(b, m.l), grade: GRADE[m.g || 1],
    network: NET[m.n], tools: m.s, output: m.out || '',
    url: `${site}${b.path}#m=${m.id}`
  };
}

function full(b, m, site) {
  const alt = m.alt ? (b.byId[m.alt] ? { id: m.alt, title: b.byId[m.alt].t, row: rowName(b, b.byId[m.alt].l) } : null) : null;
  const out = {
    ...brief(b, m, site),
    targets: trackNames(b, m.k),
    description: m.desc,
    examples: m.ex,
    keywords: m.kw || [],
    closed_network_alternative: alt,
    public_cases: (m.pub || []).map(p => ({ who: p.j, case: p.c })),
    private_cases: (m.pri || []).map(p => ({ who: p.j, case: p.c }))
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

function textHay(m) {
  return [m.id, m.t, m.st, m.desc, m.out, ...(m.kw || []), ...m.s, ...m.ex,
    ...(m.pub || []).map(p => p.j + ' ' + p.c), ...(m.pri || []).map(p => p.j + ' ' + p.c)].join(' ').toLowerCase();
}

// ---------------------------------------------------------------- 도구 정의
const boardProp = { type: 'string', enum: ['work', 'vibe'], description: 'work = AI 업무활용 보드(업무 영역 × AI 활용 방법 L1~L4), vibe = AI 바이브코딩 보드(만드는 방식 × 구조 단계 S1~S5)' };

export const TOOLS = [
  {
    name: 'search_modules',
    title: '역량 모듈 검색',
    description: '교육과정 역량 모듈을 검색합니다. 키워드, 보드, 열(업무 영역·만드는 방식), 행 번호, 대상 직무, 망 환경으로 거를 수 있습니다. 결과에는 모듈 id가 있으니 자세한 내용은 get_module로 봅니다.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '검색어. 모듈 이름·설명·도구·실습 예시·사례에서 찾습니다. 예: 회의록, HWPX, 폐쇄망, NotebookLM' },
        board: { ...boardProp, description: boardProp.description + '. 비우면 두 보드 모두' },
        column: { type: 'string', description: '열 키. work: O 공통, R 리서치, D 문서, C 콘텐츠, A 데이터, P 업무처리. vibe: O 공통, C 챗 AI 결과물, G 앱 생성 서비스, N 에이전트 서비스, K 코딩에이전트' },
        row: { type: 'integer', description: '행 번호. work는 1~4(L1 대화형·L2 위임형·L3 제작형·L4 구축형), vibe는 1~5(S1~S5)' },
        track: { type: 'string', description: '대상 직무 키 또는 이름. work: 공·서·정·재·홍·민·연·전, vibe: 공·초·현·강·전·개' },
        network: { type: 'string', enum: ['closed', 'external', 'all'], description: 'closed = 폐쇄망에서 쓸 수 있는 모듈만(외부망 필요 제외), external = 외부망 필요 모듈만' },
        limit: { type: 'integer', minimum: 1, maximum: 50, description: '최대 개수(기본 20)' }
      }
    },
    run(a, ctx) {
      const q = (a.query || '').trim().toLowerCase();
      const words = q ? q.split(/\s+/) : [];
      const res = [];
      for (const b of pickBoards(a.board)) {
        const trackKey = a.track && (b.axes.tracks[a.track] ? a.track : Object.keys(b.axes.tracks).find(k => b.axes.tracks[k] === a.track));
        for (const m of b.modules) {
          if (a.column && m.d !== a.column) continue;
          if (a.row && m.l !== a.row) continue;
          if (a.track && !(trackKey && (m.k.includes(trackKey) || m.k.includes(b.axes.universalTrack)))) continue;
          if (a.network === 'closed' && m.n === 'E') continue;
          if (a.network === 'external' && m.n !== 'E') continue;
          if (words.length) { const h = textHay(m); if (!words.every(w => h.includes(w))) continue; }
          res.push(brief(b, m, ctx.site));
        }
      }
      const limit = Math.min(Math.max(a.limit || 20, 1), 50);
      return { total: res.length, shown: Math.min(res.length, limit), modules: res.slice(0, limit) };
    }
  },
  {
    name: 'get_module',
    title: '역량 모듈 상세',
    description: '모듈 하나의 설명, 실습 예시, 산출물, 도구, 대상 직무, 공공·민간 적용 사례, 폐쇄망 대안을 돌려줍니다. 바이브코딩 모듈은 구성도(요소 연결)와 관련 시나리오도 포함합니다.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: '모듈 id. 예: D15, R2, VK10' } },
      required: ['id']
    },
    run(a, ctx) {
      const id = String(a.id || '').trim().toUpperCase();
      const b = boardOfId(id);
      if (!b) throw new UserError(`모듈 id ${id}를 찾지 못했습니다. search_modules로 id를 먼저 확인합니다.`);
      return full(b, b.byId[id], ctx.site);
    }
  },
  {
    name: 'get_matrix',
    title: '매트릭스 구조',
    description: '보드의 가로축·세로축 정의와 칸마다 들어 있는 모듈 목록(id·짧은 이름)을 돌려줍니다. 과정 전체 구조를 파악할 때 씁니다.',
    inputSchema: { type: 'object', properties: { board: boardProp }, required: ['board'] },
    run(a, ctx) {
      const b = BOARDS[a.board];
      if (!b) throw new UserError('board는 work 또는 vibe입니다.');
      const ax = b.axes;
      const item = m => ({ id: m.id, short: m.st || m.t, network: NET[m.n] });
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
    run(a) {
      const b = BOARDS[a.board];
      if (!b) throw new UserError('board는 work 또는 vibe입니다.');
      const name = id => (b.byId[id] ? { id, title: b.byId[id].t } : { id, title: '(없는 모듈)' });
      return Object.entries(b.presets).map(([key, p]) => ({
        key, name: p.name,
        days: p.days.map((d, i) => ({ day: i + 1, am: d.am.map(name), pm: d.pm.map(name) }))
      }));
    }
  },
  {
    name: 'check_course',
    title: '과정표 검사',
    description: '과정표 초안을 보드 규칙으로 검사합니다. 없는 모듈 id, 망 환경에 맞지 않는 모듈(폐쇄망인데 외부망 필요), 중복, 빈 칸, 칸당 모듈 수, 일수를 확인하고 문제 목록과 모듈 이름을 붙인 과정표를 돌려줍니다.',
    inputSchema: {
      type: 'object',
      properties: {
        board: boardProp,
        network: { type: 'string', enum: ['external', 'closed', 'mixed'], description: '교육 대상 기관의 망 환경' },
        expected_days: { type: 'integer', minimum: 1, maximum: 10, description: '과정 일수. 주면 days 길이와 비교합니다.' },
        days: {
          type: 'array', description: '일차별 배치',
          items: { type: 'object', properties: { am: { type: 'array', items: { type: 'string' } }, pm: { type: 'array', items: { type: 'string' } } } }
        }
      },
      required: ['board', 'days']
    },
    run(a) {
      const b = BOARDS[a.board];
      if (!b) throw new UserError('board는 work 또는 vibe입니다.');
      const days = Array.isArray(a.days) ? a.days : [];
      const problems = [];
      if (a.expected_days && days.length !== a.expected_days) problems.push(`일수가 ${days.length}일입니다. ${a.expected_days}일이어야 합니다.`);
      const seen = new Set();
      let ext = 0; let total = 0;
      const out = days.map((d, di) => {
        const r = { day: di + 1 };
        for (const sk of ['am', 'pm']) {
          const label = `${di + 1}일차 ${sk === 'am' ? '오전' : '오후'}`;
          const ids = (Array.isArray(d?.[sk]) ? d[sk] : []).map(x => String(x).trim().toUpperCase());
          r[sk] = ids.map(id => {
            const m = b.byId[id];
            if (!m) { problems.push(`${label} ${id}: 없는 모듈 id입니다.`); return { id, title: null }; }
            if (seen.has(id)) problems.push(`${label} ${id}: 이미 넣은 모듈입니다.`);
            seen.add(id); total++;
            if (m.n === 'E') { ext++; if (a.network === 'closed') problems.push(`${label} ${id}: 외부망이 필요한 모듈이라 폐쇄망 과정에 맞지 않습니다.${m.alt && b.byId[m.alt] ? ` 대안: ${m.alt} ${b.byId[m.alt].t}` : ''}`); }
            return { id, title: m.t, row: rowName(b, m.l), network: NET[m.n] };
          });
          if (!ids.length) problems.push(`${label}이 비어 있습니다.`);
          if (ids.length > MAX_PER_SLOT) problems.push(`${label}에 모듈이 ${ids.length}개입니다. ${MAX_PER_SLOT}개 이하를 권장합니다.`);
        }
        return r;
      });
      if (a.network === 'mixed' && total && ext / total > 0.5) problems.push(`외부망 필요 모듈이 ${ext}/${total}개로 절반을 넘습니다.`);
      return { ok: problems.length === 0, problems, days: out };
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
