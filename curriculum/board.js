/**
 * 교육과정 설계 보드 공용 엔진 — 매트릭스(열 × 행), 역량 모듈 카드, 과정표 빌더
 * AI 업무활용 과정(/curriculum/)과 AI 바이브코딩 과정(/vibecoding/)이 설정만 바꿔 함께 쓴다.
 * 과정표는 이 브라우저의 localStorage 에만 저장한다.
 *
 * cfg: { modules, candidates, presets, heroPreset, storageKey, courseName,
 *        cols: { 키: [이름, 부제] }, colOrder: [...], base: { key, label }, colAxisName,
 *        rows: { 번호: [이름, 부제, 설명] }, rowOrder: [...], rowPrefix, rowAxisName,
 *        tracks: { 키: 이름 }, universalTrack, featured: [...], related?: (m) => [문자열] }
 */
import { mountPlanner } from './ai-planner.js';
import { EN, L } from '../i18n.js';

export function initBoard(cfg) {
const { modules: MODULES, candidates: CANDIDATES, presets: PRESETS } = cfg;

// ==========================================
// 0. 라인 아이콘 (이모지 대신)
// ==========================================
const icon = (paths, size = 16) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  sun: icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'),
  moon: icon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
  up: icon('<path d="m18 15-6-6-6 6"/>', 14),
  down: icon('<path d="m6 9 6 6 6-6"/>', 14),
  close: icon('<path d="M18 6 6 18M6 6l12 12"/>', 15)
};

// ==========================================
// 1. 축 정의
// ==========================================
const DOM = cfg.cols;
const DORDER = cfg.colOrder;
const BASE = cfg.base;
const LV = cfg.rows;
const ROWS = cfg.rowOrder;
const RP = cfg.rowPrefix || 'L';
const TRACK = cfg.tracks;
const UNI = cfg.universalTrack;
const NET = EN
  ? { E: 'Internet required', B: 'Air-gapped alternative available', I: 'Prepare online, then bring into the air-gapped network' }
  : { E: '외부망 필요', B: '폐쇄망 대안 있음', I: '외부망 준비 후 폐쇄망 반입' };
const GRADE = EN
  ? { 1: 'Intro', 2: 'Basic', 3: 'Intermediate', 4: 'Advanced', 5: 'Project' }
  : { 1: '입문', 2: '기초', 3: '중급', 4: '심화', 5: '프로젝트' };
// CDSA 교육·컨설팅 문의폼(cdsa.kr과 같은 폼). 과정표 요약을 복사해 두고 이 폼을 연다
const INQUIRY_URL = 'https://cdsapaper.lovable.app/inquiry/cdsa';
const FEATURED = cfg.featured || [];

// 데이터 파일의 배열 순서를 그대로 쓴다 (칸 안의 표시 순서)
const mods = MODULES.map((m, i) => ({ ...m, ord: i, g: m.g || 1, out: m.out || '', kw: m.kw || [], alt: m.alt || '' }));
const byId = Object.fromEntries(mods.map(m => [m.id, m]));

// ==========================================
// 2. 상태 (필터·선택 칸·과정표)
// ==========================================
const F = { tracks: new Set(), grades: new Set(), net: 'all', stacks: new Set(), q: '' };
let sel = null;
// 매트릭스 칸 보기: simple(짧은 이름만) · detail(전체 이름·예시 수·도구)
const VIEW_KEY = (cfg.storageKey || 'board') + '.mxview';
let mxView = 'simple';
try { if (localStorage.getItem(VIEW_KEY) === 'detail') mxView = 'detail'; } catch (e) { /* 저장소를 못 쓰면 기본값 */ }
let showAllStacks = false;

const KEY = cfg.storageKey;
const blank = () => ({ name: '', days: [{ am: [], pm: [] }, { am: [], pm: [] }, { am: [], pm: [] }], act: { d: 0, s: 'am' }, pick: {}, open: {}, memo: {} });
let S = load();

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (v && Array.isArray(v.days) && v.days.length) {
      v.pick = v.pick || {};
      v.open = v.open || {};
      v.memo = v.memo || {};
      v.act = v.act || { d: 0, s: 'am' };
      return v;
    }
  } catch (e) { /* 저장소를 못 쓰는 환경에서는 빈 과정표로 시작 */ }
  return blank();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 무시 */ }
}

const $ = id => document.getElementById(id);

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function showToast(message) {
  const container = $('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
}

function inBuilder() {
  const s = new Set();
  S.days.forEach(d => { d.am.forEach(i => s.add(i)); d.pm.forEach(i => s.add(i)); });
  return s;
}

// 실습 예시 끝의 (외부망)(반입)(신규) 표시를 작은 태그로 바꾼다
function exHTML(e) {
  return escapeHtml(e).replace(/\((외부망|반입|신규)\)/, (m, a) => `<span class="xt xt-${{ '외부망': 'E', '반입': 'I', '신규': 'S' }[a]}">${EN ? { '외부망': 'Internet', '반입': 'Bring in', '신규': 'New' }[a] : a}</span>`);
}

function pass(m) {
  if (F.tracks.size && !m.k.some(k => F.tracks.has(k)) && !(UNI && m.k.includes(UNI))) return false;
  if (F.net === 'closed' && m.n === 'E') return false;
  if (F.net === 'ext' && m.n !== 'E') return false;
  if (F.grades.size && !F.grades.has(m.g)) return false;
  if (F.stacks.size && !m.s.some(s => F.stacks.has(s))) return false;
  if (F.q) {
    const q = F.q.toLowerCase();
    const hay = [m.id, m.t, m.desc, m.out, m.kw.join(' '), m.s.join(' '), m.ex.join(' '), m.pub.map(p => p.j + ' ' + p.c).join(' '), m.pri.map(p => p.j + ' ' + p.c).join(' ')].join(' ').toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

// ==========================================
// 3. 필터
// ==========================================
function chip(label, pressed, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'chip';
  b.textContent = label;
  b.setAttribute('aria-pressed', pressed);
  b.addEventListener('click', onClick);
  return b;
}

function renderFilters() {
  const ft = $('fTrack');
  ft.innerHTML = '';
  Object.entries(TRACK).forEach(([k, v]) => ft.appendChild(chip(v, F.tracks.has(k), () => {
    F.tracks.has(k) ? F.tracks.delete(k) : F.tracks.add(k);
    renderFilters(); renderAll();
  })));

  const fg = $('fGrade');
  fg.innerHTML = '';
  Object.entries(GRADE).forEach(([k, v]) => fg.appendChild(chip(v, F.grades.has(+k), () => {
    F.grades.has(+k) ? F.grades.delete(+k) : F.grades.add(+k);
    renderFilters(); renderAll();
  })));

  const allStacks = [...new Set(mods.flatMap(m => m.s))];
  const feat = FEATURED.filter(s => allStacks.includes(s));
  const rest = allStacks.filter(s => !feat.includes(s)).sort((a, b) => a.localeCompare(b, 'ko'));
  const base = window.innerWidth < 700 ? feat.slice(0, 10) : feat;
  const list = showAllStacks ? feat.concat(rest) : base;
  const hidden = feat.length + rest.length - base.length;

  const fs = $('fStack');
  fs.innerHTML = '';
  list.forEach(s => fs.appendChild(chip(s, F.stacks.has(s), () => {
    F.stacks.has(s) ? F.stacks.delete(s) : F.stacks.add(s);
    renderFilters(); renderAll();
  })));
  if (hidden > 0 || showAllStacks) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'stack-more';
    more.textContent = showAllStacks ? L('주요 도구만', 'Main tools only') : L(`도구 ${hidden}개 더 보기`, `${hidden} more tools`);
    more.addEventListener('click', () => { showAllStacks = !showAllStacks; renderFilters(); });
    fs.appendChild(more);
  }
}

// ==========================================
// 4. 매트릭스
// ==========================================
function renderMatrix() {
  const mx = $('mx');
  const inB = inBuilder();
  mx.innerHTML = '';
  mx.style.setProperty('--mx-cols', DORDER.length);
  mx.classList.toggle('mx-detail', mxView === 'detail');

  const corner = document.createElement('div');
  corner.className = 'h rh corner';
  corner.innerHTML = L(`세로 ${escapeHtml(cfg.rowAxisName)}<br>가로 ${escapeHtml(cfg.colAxisName)}`, `Rows: ${escapeHtml(cfg.rowAxisName)}<br>Columns: ${escapeHtml(cfg.colAxisName)}`);
  mx.appendChild(corner);

  DORDER.forEach(d => {
    const h = document.createElement('div');
    h.className = 'h';
    h.innerHTML = `${escapeHtml(DOM[d][0])}<small>${escapeHtml(DOM[d][1])}</small>`;
    mx.appendChild(h);
  });

  const oList = mods.filter(m => m.d === BASE.key && pass(m));
  const st = document.createElement('button');
  st.type = 'button';
  st.className = 'strip';
  st.setAttribute('aria-selected', sel === BASE.key);
  st.innerHTML = `<b>${escapeHtml(BASE.label)}</b>` +
    oList.map(m => `<span class="sg${inB.has(m.id) ? ' on' : ''}" title="${escapeHtml(m.t)}">${escapeHtml(mxView === 'detail' ? m.t : (m.st || m.t))}</span>`).join('') +
    `<span class="n">${oList.length}</span>`;
  st.addEventListener('click', () => { sel = sel === BASE.key ? null : BASE.key; renderMatrix(); renderLib(); jump(); });
  mx.appendChild(st);

  ROWS.forEach(l => {
    const rh = document.createElement('div');
    const zebra = ROWS.indexOf(l) % 2 === 0 ? ' zb' : '';
    rh.className = `rh rl${l}${zebra}`;
    rh.innerHTML = mxView === 'detail'
      ? `<span class="lv lv${l}">${RP}${l}</span><b>${LV[l][0]} · ${LV[l][1]}</b><small>${LV[l][2]}</small>`
      : `<span class="lv lv${l}">${RP}${l}</span><b>${LV[l][0]}</b><small>${LV[l][1]}</small>`;
    mx.appendChild(rh);

    DORDER.forEach(d => {
      const list = mods.filter(m => m.d === d && m.l === l && pass(m));
      const isSel = sel && sel !== BASE.key && sel.d === d && sel.l === l;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cell' + zebra;
      b.setAttribute('aria-selected', !!isSel);
      b.setAttribute('aria-label', L(`${DOM[d][0]} ${RP}${l} 역량 모듈 ${list.length}개`, `${DOM[d][0]} ${RP}${l}: ${list.length} modules`));
      b.innerHTML = !list.length
        ? `<span class="none">${F.net === 'closed' ? closedAltNote(d, l) : L('해당 모듈 없음', 'No modules')}</span>`
        : list.map(m => mxView === 'detail'
          ? `<span class="g n-${m.n}${inB.has(m.id) ? ' on' : ''}" title="${NET[m.n]}"><span><b>${escapeHtml(m.t)}</b><small>${L(`예시 ${m.ex.length}개`, `${m.ex.length} exercises`)} · ${escapeHtml(m.s.slice(0, 3).join(', '))}</small></span></span>`
          : `<span class="g n-${m.n}${inB.has(m.id) ? ' on' : ''}" title="${escapeHtml(m.t)} · ${NET[m.n]}"><b>${escapeHtml(m.st || m.t)}</b></span>`).join('');
      b.addEventListener('click', () => { sel = isSel ? null : { d, l }; renderMatrix(); renderLib(); jump(); });
      mx.appendChild(b);
    });
  });
}

function jump() { $('lib').scrollIntoView({ block: 'start' }); }

// 폐쇄망 필터에서 비는 칸에 그 칸 모듈들의 폐쇄망 대안(alt)을 안내한다
function closedAltNote(d, l) {
  const all = mods.filter(m => m.d === d && m.l === l);
  if (!all.length) return L('해당 모듈 없음', 'No modules');
  const alts = [...new Set(all.filter(m => m.alt).map(m => m.alt))].map(id => byId[id]).filter(Boolean);
  const head = cfg.closedNote?.[l] || L('외부망이 필요한 모듈만 있는 칸입니다.', 'Every module in this cell needs the internet.');
  if (!alts.length) return head;
  return `${head} ${L('폐쇄망 대안', 'Air-gapped alternatives')}: ${alts.map(a => `${escapeHtml(a.t)} (${RP}${a.l})`).join(', ')}`;
}

// 모듈이 있는 칸을 선택하고 모듈 목록으로 이동
function selectModuleCell(m) {
  sel = m.d === BASE.key ? BASE.key : { d: m.d, l: m.l };
  if (F.net === 'ext' && m.n !== 'E') {
    F.net = 'all';
    [...$('fNet').children].forEach(x => x.setAttribute('aria-pressed', x.dataset.v === 'all'));
  }
  renderAll();
  jump();
}

// ==========================================
// 4-1. 구성도 (fl) — 외부 서비스 · 박스 안 · 사용자·화면 3열 도식
// ==========================================
let flowSeq = 0;
const FLOW_RE = /^([XCU]):(.+?) > ([XCU]):(.+?)(?: : (.+))?$/;
const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩';

// 글자 폭 추정: 한글 1, 영문·숫자·기호 0.62
const textUnits = t => [...t].reduce((a, ch) => a + (/[\u3131-\uD79D]/.test(ch) ? 1 : 0.62), 0);

function flowLines(name, max = 8.2) {
  if (textUnits(name) <= max) return [name];
  const mid = name.length / 2;
  let cut = -1;
  [...name].forEach((ch, i) => { if ('· ('.includes(ch) && i > 1 && i < name.length - 2 && (cut < 0 || Math.abs(i - mid) < Math.abs(cut - mid))) cut = i; });
  if (cut < 0) { cut = Math.ceil(mid); return [name.slice(0, cut), name.slice(cut)]; }
  const ch = name[cut];
  return [name.slice(0, ch === '·' ? cut + 1 : cut).trim(), name.slice(ch === '(' ? cut : cut + 1).trim()];
}

function flowSVG(fl) {
  const W = 360, LANE = { X: { cx: 48, w: 96 }, C: { cx: 180, w: 108 }, U: { cx: 312, w: 96 } };
  const nodes = {}, order = { X: [], C: [], U: [] }, edges = [];
  const node = (lane, name) => {
    const key = lane + ':' + name;
    if (!nodes[key]) { nodes[key] = { lane, name }; order[lane].push(key); }
    return key;
  };
  for (const raw of fl.e || []) {
    const m = raw.match(FLOW_RE);
    if (!m) continue;
    edges.push({ a: node(m[1], m[2].trim()), b: node(m[3], m[4].trim()), label: (m[5] || '').trim() });
  }
  if (!edges.length) return '';

  const NH = 34, PITCH = 52, TOP = 30;
  const rows = Math.max(1, ...Object.values(order).map(l => l.length));
  const bodyH = rows * PITCH;
  // 외부 ↔ 사용자로 바로 가는 화살표는 박스 아래로 돌린다
  const skips = edges.filter(e => nodes[e.a].lane !== 'C' && nodes[e.b].lane !== 'C' && nodes[e.a].lane !== nodes[e.b].lane);
  const boxBottom = TOP + bodyH + 4;
  const H = boxBottom + 6 + skips.length * 12;
  for (const lane of 'XCU') {
    const list = order[lane];
    list.forEach((key, i) => { const n = nodes[key]; n.x = LANE[lane].cx; n.w = LANE[lane].w; n.y = TOP + (i + 0.5) * bodyH / list.length; });
  }

  const id = 'fla' + (++flowSeq);
  let svg = `<svg class="flow-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHtml((fl.box || '') + L(' 구성도', ' diagram'))}">` +
    `<defs><marker id="${id}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="fl-arrow" d="M0 0 L8 4 L0 8 z"/></marker></defs>` +
    `<text class="fl-lane" x="${LANE.X.cx}" y="12" text-anchor="middle">${L('외부', 'External')}</text>` +
    `<text class="fl-lane" x="${LANE.U.cx}" y="12" text-anchor="middle">${L('사용자·화면', 'User · screen')}</text>` +
    `<rect class="fl-box" x="116" y="4" width="128" height="${boxBottom - 4}" rx="12"/>` +
    `<text class="fl-box-t" x="180" y="19" text-anchor="middle">${escapeHtml(fl.box || '')}</text>`;

  const pairs = new Set(edges.map(e => e.a + '>' + e.b));
  const badges = [];
  edges.forEach((e, i) => {
    const A = nodes[e.a], B = nodes[e.b];
    let x1, y1, x2, y2;
    if (skips.includes(e)) {
      const ry = boxBottom + 8 + skips.indexOf(e) * 12;
      const bx = B.x + (B.x > A.x ? -18 : 18);
      svg += `<path class="fl-edge fl-route" d="M${A.x} ${A.y + NH / 2} V${ry} H${bx} V${B.y + NH / 2}" marker-end="url(#${id})"/>`;
      badges.push({ x: 180, y: ry, n: i + 1 });
      return;
    }
    if (A.lane === B.lane && Math.abs(order[A.lane].indexOf(e.a) - order[A.lane].indexOf(e.b)) > 1) {
      // 사이에 노드가 있으면 노드 왼쪽 바깥으로 돌아간다
      const xr = A.x - A.w / 2 - 7;
      svg += `<path class="fl-edge fl-route" d="M${A.x - A.w / 2} ${A.y} H${xr} V${B.y} H${B.x - B.w / 2 - 1}" marker-end="url(#${id})"/>`;
      badges.push({ x: xr, y: (A.y + B.y) / 2, n: i + 1 });
      return;
    }
    if (A.lane === B.lane) {
      const down = B.y > A.y;
      const dx = down ? -26 : 26;
      x1 = x2 = A.x + dx;
      y1 = A.y + (down ? NH / 2 : -NH / 2);
      y2 = B.y + (down ? -NH / 2 : NH / 2);
    } else {
      const right = B.x > A.x;
      const off = pairs.has(e.b + '>' + e.a) ? (e.a < e.b ? -5 : 5) : 0;
      x1 = A.x + (right ? A.w / 2 : -A.w / 2);
      x2 = B.x + (right ? -B.w / 2 : B.w / 2);
      y1 = A.y + off; y2 = B.y + off;
    }
    svg += `<line class="fl-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id})"/>`;
    badges.push({ x: (x1 + x2) / 2, y: (y1 + y2) / 2, n: i + 1 });
  });

  for (const key of Object.keys(nodes)) {
    const n = nodes[key];
    const lines = flowLines(n.name, n.lane === 'C' ? 9.6 : 8.2);
    svg += `<rect class="fl-node fl-${n.lane}" x="${n.x - n.w / 2}" y="${n.y - NH / 2}" width="${n.w}" height="${NH}" rx="8"/>`;
    lines.forEach((t, j) => {
      const ty = n.y + (lines.length === 1 ? 4 : (j === 0 ? -3 : 10));
      svg += `<text class="fl-node-t" x="${n.x}" y="${ty}" text-anchor="middle">${escapeHtml(t)}</text>`;
    });
  }
  badges.forEach(b => {
    svg += `<circle class="fl-badge" cx="${b.x}" cy="${b.y}" r="7"/><text class="fl-badge-t" x="${b.x}" y="${b.y + 3.5}" text-anchor="middle">${b.n}</text>`;
  });
  svg += '</svg>';

  const legend = edges.map((e, i) => `<li><span class="fl-num">${CIRCLED[i] || i + 1}</span>${escapeHtml(nodes[e.a].name)} → ${escapeHtml(nodes[e.b].name)}${e.label ? ` <em>${escapeHtml(e.label)}</em>` : ''}</li>`).join('');
  return `<div class="flow"><div class="flow-h">${L('구성도', 'How it fits together')}</div>${svg}<ol class="flow-legend">${legend}</ol></div>`;
}

// ==========================================
// 5. 역량 모듈 카드
// ==========================================
function useHTML(label, list) {
  if (!list.length) return '';
  return `<div class="use"><div class="use-h">${label}</div>` +
    list.map(p => `<div class="use-r"><b>${escapeHtml(p.j)}</b><span>${escapeHtml(p.c)}</span></div>`).join('') + '</div>';
}

function renderLib() {
  const inB = inBuilder();
  let list, title, hint;
  if (sel === BASE.key) {
    list = mods.filter(m => m.d === BASE.key && pass(m));
    title = BASE.label;
    hint = L('다시 누르면 전체 보기', 'Click again to show all');
  } else if (sel) {
    list = mods.filter(m => m.d === sel.d && m.l === sel.l && pass(m));
    title = `${DOM[sel.d][0]} × ${RP}${sel.l} ${LV[sel.l][0]}`;
    hint = L('칸을 다시 누르면 전체 보기', 'Click the cell again to show all');
  } else {
    list = mods.filter(pass);
    title = L(`역량 모듈 ${list.length}개`, `${list.length} modules`);
    hint = L('칸을 누르면 해당 칸의 모듈만 표시합니다', 'Click a cell to show only its modules');
  }
  $('libTitle').textContent = title;
  $('libHint').textContent = hint;

  const c = $('cards');
  c.innerHTML = '';
  if (!list.length) {
    c.innerHTML = `<div class="cur-empty">${L('조건에 맞는 역량 모듈이 없습니다. 필터를 풀거나 다른 칸을 눌러 보세요.', 'No modules match. Clear a filter or pick another cell.')}</div>`;
    return;
  }

  const ord = Object.fromEntries([BASE.key, ...DORDER].map((k, i) => [k, i]));
  list = list.slice().sort((a, b) => a.l - b.l || ord[a.d] - ord[b.d] || (a.ord || 0) - (b.ord || 0));
  list.forEach(m => {
    const has = inB.has(m.id);
    const el = document.createElement('article');
    el.className = 'mcard' + (has ? ' in' : '');
    el.dataset.id = m.id;
    el.draggable = true;
    el.innerHTML =
      `<div class="mid"><span>${escapeHtml(DOM[m.d][0])}</span><span>${escapeHtml(m.id)}</span></div>` +
      `<div class="mt">${escapeHtml(m.t)}</div>` +
      `<div class="mdesc">${escapeHtml(m.desc)}</div>` +
      `<div class="tags"><span class="tag lvt lv${m.l}">${RP}${m.l} ${LV[m.l][0]}</span><span class="tag grade">${L('난이도', 'Level')} ${GRADE[m.g]}</span><span class="tag net-${m.n}">${NET[m.n]}</span>` +
        m.k.map(k => `<span class="tag">${escapeHtml(TRACK[k] || k)}</span>`).join('') + '</div>' +
      `<div class="tools"><b>${L('도구', 'Tools')}</b> ${escapeHtml(m.s.join(', '))}</div>` +
      (m.out ? `<div class="tools"><b>${L('산출물', 'Deliverable')}</b> ${escapeHtml(m.out)}</div>` : '') +
      (relList(m).length ? `<div class="tools"><b>${L('관련 시나리오', 'Related scenarios')}</b> ${escapeHtml(relList(m).join(', '))}</div>` : '') +
      (m.alt && byId[m.alt] ? `<button type="button" class="alt-link">${L(`폐쇄망이면 ${escapeHtml(byId[m.alt].t)} (${RP}${byId[m.alt].l}) 참고`, `On an air-gapped network, see ${escapeHtml(byId[m.alt].t)} (${RP}${byId[m.alt].l})`)}</button>` : '') +
      (m.fl ? flowSVG(m.fl) : '') +
      `<div class="uses">${useHTML(L('공공 적용', 'Public sector use'), m.pub)}${useHTML(L('민간 적용', 'Private sector use'), m.pri)}</div>` +
      `<div class="ex"><b>${L('실습 예시', 'Hands-on exercises')}</b><ul>${m.ex.map(e => `<li>${exHTML(e)}</li>`).join('')}</ul></div>` +
      `<div class="act"><span class="src">${L('예시는 강사가 기관에 맞게 바꿉니다', 'Instructors adapt the exercises to each organization')}</span><button type="button" class="btn btn-primary btn-sm add">${has ? L('담김 · 빼기', 'Added · remove') : L('담기', 'Add')}</button></div>`;
    el.querySelector('.add').addEventListener('click', e => { e.stopPropagation(); has ? removeId(m.id) : addId(m.id); });
    el.querySelector('.alt-link')?.addEventListener('click', e => { e.stopPropagation(); selectModuleCell(byId[m.alt]); });
    el.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', JSON.stringify({ id: m.id })); e.dataTransfer.effectAllowed = 'copyMove'; });
    c.appendChild(el);
  });
}

function relList(m) {
  return cfg.related ? cfg.related(m) : [];
}

function renderCands() {
  const open = CANDIDATES.filter(c => c.status !== 'done');
  $('candCount').textContent = open.length ? L(`${open.length}개`, `${open.length}`) : '';
  $('cands').innerHTML = open.length
    ? open.map(c => `<div class="cand"><div class="cand-h"><span class="tag lvt lv${+c.l || 1}">${RP}${+c.l || 1}</span><span class="cand-d">${escapeHtml((DOM[c.d] || [c.d])[0])}</span></div><b>${escapeHtml(c.t)}</b><p>${escapeHtml(c.why || '')}</p></div>`).join('')
    : `<div class="cur-empty">${L('남은 후보가 없습니다.', 'No candidates left.')}</div>`;
}

// ==========================================
// 6. 과정표 빌더
// ==========================================
function addId(id) {
  if (inBuilder().has(id)) { showToast(L('이미 담긴 모듈입니다.', 'This module is already in the plan.')); return; }
  let { d, s } = S.act;
  if (!S.days[d]) { d = 0; s = 'am'; }
  S.days[d][s].push(id);
  save(); renderAll();
  showToast(L(`${d + 1}일차 ${s === 'am' ? '오전' : '오후'}에 담았습니다.`, `Added to day ${d + 1}, ${s === 'am' ? 'morning' : 'afternoon'}.`));
}

// AI 과정 구성 결과를 과정표에 넣는다 (ai-planner.js에서 호출)
function applyPlan(plan, ask = L('지금 과정표를 지우고 AI 구성안을 담습니다.', 'This replaces the current course plan with the AI plan.')) {
  if (inBuilder().size && !confirm(ask)) return false;
  S = blank();
  S.name = plan.name;
  S.days = plan.days.map(d => ({ am: d.am.filter(i => byId[i]), pm: d.pm.filter(i => byId[i]) }));
  S.pick = { ...plan.pick };
  S.memo = { ...plan.memo };
  save(); renderAll();
  $('builder').scrollIntoView({ block: 'start' });
  return true;
}

function removeSilent(id) {
  S.days.forEach(d => { d.am = d.am.filter(x => x !== id); d.pm = d.pm.filter(x => x !== id); });
}

function removeId(id) {
  removeSilent(id);
  delete S.pick[id];
  delete S.open[id];
  delete S.memo[id];
  save(); renderAll();
}

function moveId(id, d, s, before) {
  removeSilent(id);
  const a = S.days[d][s];
  const i = before ? a.indexOf(before) : -1;
  i < 0 ? a.push(id) : a.splice(i, 0, id);
  save(); renderAll();
}

function parseDrop(e) {
  try { return JSON.parse(e.dataTransfer.getData('text/plain')); } catch (x) { return null; }
}

function shift(di, sk, id, dir) {
  const a = S.days[di][sk];
  const i = a.indexOf(id);
  const j = i + dir;
  if (j < 0 || j >= a.length) return;
  [a[i], a[j]] = [a[j], a[i]];
  save(); renderBuilder();
}

function pickLabel(n, open) {
  if (EN) return `${n ? `${n} exercises chosen` : 'Choose exercises'} · ${open ? 'collapse' : 'expand'}`;
  return `${n ? `예시 ${n}개 선택` : '예시 고르기'} ${open ? '접기' : '펼치기'}`;
}

function renderBuilder() {
  $('bname').value = S.name || '';
  const wrap = $('days');
  wrap.innerHTML = '';

  S.days.forEach((day, di) => {
    const box = document.createElement('div');
    box.className = 'day';
    box.innerHTML = `<div class="day-h"><span>${L(`${di + 1}일차`, `Day ${di + 1}`)}</span>${S.days.length > 1 ? `<button type="button" class="noprint" data-rm="${di}">${L('일차 삭제', 'Remove day')}</button>` : ''}</div>`;

    ['am', 'pm'].forEach(sk => {
      const act = S.act.d === di && S.act.s === sk;
      const slot = document.createElement('div');
      slot.className = 'slot' + (act ? ' active' : '');
      slot.innerHTML = `<div class="sl2"><b>${sk === 'am' ? L('오전', 'Morning') : L('오후', 'Afternoon')}</b><span class="noprint">${act ? L('여기에 담는 중', 'Adding here') : L('눌러서 담을 곳으로', 'Click to add here')}</span></div>`;

      day[sk].forEach(id => {
        const m = byId[id];
        if (!m) return;
        const picks = (S.pick[id] || []).filter(i => i < m.ex.length);
        const open = !!S.open[id];
        const netTag = m.n === 'E' ? `<span class="nt nt-E">${L('외부망', 'Internet')}</span>` : m.n === 'I' ? `<span class="nt nt-I">${L('반입', 'Bring in')}</span>` : '';

        const p = document.createElement('div');
        p.className = 'pill';
        p.draggable = true;
        p.innerHTML =
          `<div class="prow"><span class="lvb lv${m.l}">${RP}${m.l}</span><span class="tt">${escapeHtml(m.t)}${netTag}</span>` +
          `<button type="button" class="mv noprint" aria-label="${L('위로', 'Move up')}">${ICONS.up}</button><button type="button" class="mv noprint" aria-label="${L('아래로', 'Move down')}">${ICONS.down}</button><button type="button" class="x noprint" aria-label="${L('빼기', 'Remove')}">${ICONS.close}</button></div>` +
          `<button type="button" class="pk noprint" aria-expanded="${open}">${pickLabel(picks.length, open)}</button>` +
          (S.memo[id] ? `<div class="pmemo"><span>${L('맞춤 실습', 'Custom exercise')}</span>${escapeHtml(S.memo[id])}</div>` : '') +
          (picks.length && !open ? `<div class="pp">${picks.map(i => escapeHtml(m.ex[i] || '')).join(' / ')}</div>` : '') +
          (open ? `<div class="pl">${m.ex.map((e, i) => `<label><input type="checkbox" data-i="${i}"${picks.includes(i) ? ' checked' : ''}> ${exHTML(e)}</label>`).join('')}</div>` : '');

        const [up, dn, x] = p.querySelectorAll('.prow button');
        up.addEventListener('click', e => { e.stopPropagation(); shift(di, sk, id, -1); });
        dn.addEventListener('click', e => { e.stopPropagation(); shift(di, sk, id, 1); });
        x.addEventListener('click', e => { e.stopPropagation(); removeId(id); });
        p.querySelector('.pk').addEventListener('click', e => { e.stopPropagation(); S.open[id] = !open; save(); renderBuilder(); });
        p.querySelectorAll('.pl input').forEach(cb => {
          cb.addEventListener('click', e => e.stopPropagation());
          cb.addEventListener('change', () => {
            const i = +cb.dataset.i;
            let a = S.pick[id] || [];
            a = cb.checked ? [...new Set(a.concat(i))].sort((q, r) => q - r) : a.filter(v => v !== i);
            S.pick[id] = a;
            save(); renderSummary();
            p.querySelector('.pk').textContent = pickLabel(a.length, true);
          });
        });
        p.querySelector('.pl')?.addEventListener('click', e => e.stopPropagation());
        p.addEventListener('dragstart', e => { e.stopPropagation(); e.dataTransfer.setData('text/plain', JSON.stringify({ id, move: 1 })); });
        p.addEventListener('dragover', e => e.preventDefault());
        p.addEventListener('drop', e => {
          e.preventDefault(); e.stopPropagation();
          slot.classList.remove('over');
          const d = parseDrop(e);
          if (!d || d.id === id || !byId[d.id]) return;
          if (!d.move && inBuilder().has(d.id)) { showToast(L('이미 담긴 모듈입니다.', 'This module is already in the plan.')); return; }
          moveId(d.id, di, sk, id);
        });
        slot.appendChild(p);
      });

      slot.addEventListener('click', () => { S.act = { d: di, s: sk }; save(); renderBuilder(); });
      slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('over'); });
      slot.addEventListener('dragleave', () => slot.classList.remove('over'));
      slot.addEventListener('drop', e => {
        e.preventDefault();
        slot.classList.remove('over');
        const d = parseDrop(e);
        if (!d || !byId[d.id]) return;
        if (!d.move && inBuilder().has(d.id)) { showToast(L('이미 담긴 모듈입니다.', 'This module is already in the plan.')); return; }
        moveId(d.id, di, sk);
      });
      box.appendChild(slot);
    });
    wrap.appendChild(box);
  });

  wrap.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.rm;
    if (!confirm(L(`${i + 1}일차와 담긴 모듈을 삭제합니다.`, `Remove day ${i + 1} and its modules?`))) return;
    S.days.splice(i, 1);
    if (S.act.d >= S.days.length) S.act = { d: 0, s: 'am' };
    save(); renderAll();
  }));

  renderSummary();
  $('fab').textContent = L(`내 과정 ${inBuilder().size}`, `My plan ${inBuilder().size}`);
}

function renderSummary() {
  const ms = [...inBuilder()].map(i => byId[i]).filter(Boolean);
  const el = $('sum');
  if (!ms.length) {
    el.innerHTML = `<div>${L('아직 담긴 모듈이 없습니다. 예시 과정을 불러오거나 역량 모듈을 담아 보세요. 담은 뒤 "예시 고르기"로 이번 과정에서 다룰 실습을 고릅니다.', 'No modules yet. Load a sample course or add modules. Then use "Choose exercises" to pick the hands-on tasks for this course.')}</div>`;
    return;
  }
  const lc = ROWS.map(l => ms.filter(m => m.l === l).length);
  const dc = DORDER.map(d => [d, ms.filter(m => m.d === d).length]);
  const ext = ms.filter(m => m.n === 'E');
  const imp = ms.filter(m => m.n === 'I');
  const picked = ms.reduce((a, m) => a + (S.pick[m.id] || []).length, 0);
  const tools = {};
  ms.forEach(m => m.s.forEach(s => { tools[s] = (tools[s] || 0) + 1; }));
  const tl = Object.entries(tools).sort((a, b) => b[1] - a[1]);

  let h = `<div><h3>${L(`역량 모듈 ${ms.length}개 · 선택한 실습 예시 ${picked}개`, `${ms.length} modules · ${picked} exercises chosen`)}</h3>` +
    `<div class="lvbar">${lc.map((c, i) => c ? `<i class="lv${ROWS[i]}" style="width:${c / ms.length * 100}%"></i>` : '').join('')}</div>` +
    `<div class="lvleg">${lc.map((c, i) => `<span>${RP}${ROWS[i]} ${LV[ROWS[i]][0]} ${c}</span>`).join('')}</div></div>`;
  h += `<div><h3>${L('난이도 구성', 'Level mix')}</h3><div class="toolset">${Object.entries(GRADE).map(([k, v]) => { const c = ms.filter(m => m.g === +k).length; return `<span class="tag${c ? '' : ' muted'}">${v} ${c}</span>`; }).join('')}</div></div>`;
  h += `<div><h3>${L(`${escapeHtml(cfg.colAxisName)} 커버리지`, `${escapeHtml(cfg.colAxisName)} coverage`)}</h3><div class="toolset">${dc.map(([d, c]) => `<span class="tag${c ? '' : ' muted'}">${DOM[d][0]} ${c}</span>`).join('')}</div></div>`;
  if (F.net === 'closed' && ext.length) {
    h += `<div class="warn"><b>${L(`폐쇄망에서 바로 못 쓰는 모듈 ${ext.length}개`, `${ext.length} modules cannot run on an air-gapped network as is`)}</b><br>${ext.map(m => escapeHtml(m.t)).join('<br>')}<br>${L('외부망 교육장에서 실습하거나 결과물을 이관하는 방식으로 운영합니다.', 'Run them in an internet-connected training room, or carry the results over afterward.')}</div>`;
  } else if (ext.length) {
    h += `<div><h3>${L(`외부망 필요 ${ext.length}개`, `${ext.length} need the internet`)}</h3>${L('교육장 인터넷과 개인 계정을 미리 준비합니다.', 'Prepare internet access in the training room and personal accounts in advance.')}</div>`;
  }
  if (imp.length) h += `<div><h3>${L(`사전 반입 필요 ${imp.length}개`, `${imp.length} need files brought in first`)}</h3>${L('모델·라이브러리·공개자료를 외부망에서 준비해 승인 절차로 반입합니다.', 'Download models, libraries and public data on an internet-connected PC, then bring them in through the security approval process.')}</div>`;
  h += `<div><h3>${L('준비할 도구', 'Tools to prepare')}</h3><div class="toolset">${tl.map(([s, c]) => `<span class="tag">${escapeHtml(s)}${c > 1 ? ' ' + c : ''}</span>`).join('')}</div></div>`;
  el.innerHTML = h;
}

function loadPreset(k) {
  const p = PRESETS[k];
  if (!p) return;
  if (inBuilder().size && !confirm(L('지금 과정표를 지우고 예시 과정을 불러옵니다.', 'This replaces the current course plan with the sample course.'))) return;
  S = blank();
  S.name = p.name;
  S.days = p.days.map(d => ({ am: d.am.filter(i => byId[i]), pm: d.pm.filter(i => byId[i]) }));
  save(); renderAll();
  showToast(L('예시 과정을 불러왔습니다.', 'Sample course loaded.'));
}

function copyText(txt, msg) {
  const fallback = () => {
    const t = document.createElement('textarea');
    t.value = txt;
    document.body.appendChild(t);
    t.select();
    try { document.execCommand('copy'); showToast(msg); } catch (e) { showToast(L('복사하지 못했습니다.', 'Could not copy.')); }
    t.remove();
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(() => showToast(msg), fallback);
  else fallback();
}

function courseText() {
  const lines = [S.name || cfg.courseName];
  S.days.forEach((d, i) => ['am', 'pm'].forEach(s => {
    if (!d[s].length) return;
    lines.push('', L(`[${i + 1}일차 ${s === 'am' ? '오전' : '오후'}]`, `[Day ${i + 1} ${s === 'am' ? 'morning' : 'afternoon'}]`));
    d[s].forEach(id => {
      const m = byId[id];
      if (!m) return;
      lines.push(`- ${m.t} (${RP}${m.l} ${LV[m.l][0]} / ${L('난이도', 'Level')} ${GRADE[m.g]} / ${NET[m.n]} / ${m.s.join(', ')})`);
      if (m.out) lines.push(`    ${L('산출물', 'Deliverable')}: ${m.out}`);
      if (S.memo[id]) lines.push(`    ${L('맞춤 실습', 'Custom exercise')}: ${S.memo[id]}`);
      const p = (S.pick[id] || []).filter(x => x < m.ex.length);
      lines.push(`    ${L('실습 예시', 'Exercises')}: ` + (p.length ? p.map(x => m.ex[x]).join(', ') : L(`강사 재량 (${m.ex.slice(0, 3).join(', ')} 등)`, `instructor's choice (e.g. ${m.ex.slice(0, 3).join(', ')})`)));
    });
  }));
  return lines.join('\n');
}

// 과정표를 다시 여는 링크 (#plan= 형식은 openPlanFromHash와 같다)
function planUrl() {
  const plan = S.days.map(d => d.am.join(',') + ';' + d.pm.join(',')).join('/');
  return `${location.origin}${location.pathname}#plan=${plan}&name=${encodeURIComponent(S.name || cfg.courseName)}`;
}

// 문의폼에 붙여 넣을 요약: 과정 이름, 일차별 모듈 이름, 과정표 링크
function inquiryText() {
  const lines = [L(`[${cfg.courseName} 문의] ${S.name || cfg.courseName}`, `[${cfg.courseName} inquiry] ${S.name || cfg.courseName}`)];
  S.days.forEach((d, i) => ['am', 'pm'].forEach(s => {
    const names = d[s].map(id => byId[id]?.t).filter(Boolean);
    if (names.length) lines.push(L(`${i + 1}일차 ${s === 'am' ? '오전' : '오후'}`, `Day ${i + 1} ${s === 'am' ? 'morning' : 'afternoon'}`) + `: ${names.join(', ')}`);
  }));
  lines.push(`${L('과정표 보기', 'View the plan')}: ${planUrl()}`);
  return lines.join('\n');
}

function openInquiry() {
  if (inBuilder().size) copyText(inquiryText(), L('과정표 요약을 복사했습니다. 문의 내용에 붙여 넣어 주세요.', 'Plan summary copied. Paste it into the inquiry form.'));
  window.open(INQUIRY_URL, '_blank', 'noopener');
}

// ==========================================
// 7. 테마 (VibeStack 본 페이지와 같은 저장 키)
// ==========================================
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('app_theme', theme); } catch (e) { /* 무시 */ }
  const btn = $('themeToggleBtn');
  btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  btn.title = theme === 'dark' ? L('라이트 모드로 전환', 'Switch to light mode') : L('다크 모드로 전환', 'Switch to dark mode');
}

function currentTheme() {
  try { return localStorage.getItem('app_theme') || 'dark'; } catch (e) { return 'dark'; }
}

// ==========================================
// 8. 초기화
// ==========================================
function renderStats() {
  const stats = {
    modules: mods.length,
    examples: mods.reduce((a, m) => a + m.ex.length, 0),
    candidates: CANDIDATES.filter(c => c.status !== 'done').length
  };
  document.querySelectorAll('[data-cstat]').forEach(el => { el.textContent = stats[el.dataset.cstat]; });
}

function renderAll() {
  renderMatrix();
  renderLib();
  renderBuilder();
}

// 매트릭스 위 [간단히 / 자세히] 전환 (두 보드 공용이라 마크업 대신 여기서 만든다)
function mountViewToggle() {
  const scroll = document.querySelector('.mx-scroll');
  if (!scroll || document.getElementById('mxView')) return;
  const bar = document.createElement('div');
  bar.className = 'mx-bar noprint';
  bar.innerHTML = `<span>${L('칸 보기', 'Cells')}</span><div class="seg" id="mxView" role="group" aria-label="${L('매트릭스 칸 보기', 'Matrix cell view')}">` +
    `<button type="button" data-v="simple">${L('간단히', 'Simple')}</button><button type="button" data-v="detail">${L('자세히', 'Detailed')}</button></div>`;
  scroll.before(bar);
  const sync = () => [...bar.querySelectorAll('button')].forEach(x => x.setAttribute('aria-pressed', x.dataset.v === mxView));
  sync();
  bar.addEventListener('click', e => {
    const b = e.target.closest('button[data-v]');
    if (!b || b.dataset.v === mxView) return;
    mxView = b.dataset.v;
    try { localStorage.setItem(VIEW_KEY, mxView); } catch (err) { /* 저장 못 해도 화면은 바뀐다 */ }
    sync();
    renderMatrix();
  });
}

// AI 과정 구성 버튼: 과정표 머리와 히어로에 둔다 (두 보드 공용이라 여기서 만든다)
function mountAiButtons() {
  const planner = mountPlanner({ cfg, mods, byId, presets: PRESETS, escapeHtml, showToast, copyText, apply: applyPlan });
  const row = document.querySelector('#builder .bbody .brow');
  if (row) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn-primary btn-sm';
    b.id = 'aiPlan';
    b.textContent = L('AI로 과정 구성', 'Plan with AI');
    b.addEventListener('click', planner.open);
    row.prepend(b);
  }
  const hero = $('heroPreset');
  if (hero) {
    const h = document.createElement('button');
    h.type = 'button';
    h.className = 'btn-link';
    h.textContent = L('AI로 과정 구성 ›', 'Plan with AI ›');
    h.addEventListener('click', planner.open);
    hero.after(h);
  }
}

function setupEventListeners() {
  $('themeToggleBtn').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  $('fNet').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    F.net = b.dataset.v;
    [...$('fNet').children].forEach(x => x.setAttribute('aria-pressed', x === b));
    renderAll();
  });

  $('q').addEventListener('input', e => { F.q = e.target.value.trim(); renderAll(); });
  $('bname').addEventListener('input', e => { S.name = e.target.value; save(); });

  $('addDay').addEventListener('click', () => {
    S.days.push({ am: [], pm: [] });
    S.act = { d: S.days.length - 1, s: 'am' };
    save(); renderAll();
    showToast(L(`${S.days.length}일차를 추가했습니다.`, `Day ${S.days.length} added.`));
  });

  $('preset').addEventListener('change', e => { const v = e.target.value; e.target.value = ''; loadPreset(v); });
  $('heroPreset').addEventListener('click', () => { loadPreset(cfg.heroPreset || Object.keys(PRESETS)[0]); $('builder').scrollIntoView(); });
  $('clear').addEventListener('click', () => { if (!confirm(L('과정표를 비웁니다.', 'Clear the course plan?'))) return; S = blank(); save(); renderAll(); });
  $('print').addEventListener('click', () => window.print());
  $('fab').addEventListener('click', () => $('builder').scrollIntoView());
  $('copy').addEventListener('click', () => copyText(courseText(), L('과정표를 복사했습니다.', 'Course plan copied.')));
  $('inquiry').addEventListener('click', openInquiry);
}

applyTheme(currentTheme());
mountViewToggle();
mountAiButtons();
setupEventListeners();
renderStats();
renderFilters();
renderAll();
renderCands();
openFromHash();
window.addEventListener('hashchange', openFromHash);

// 주소의 #m=모듈ID로 들어오면 그 모듈의 칸을 열고 카드를 표시한다 (메인 페이지 진단 결과에서 연결)
// #plan=R1,D1;O6,R3/D2;A1&name=과정이름 이면 과정표에 담는다 (MCP draft_course·check_course 결과 링크). 일차는 /, 오전·오후는 ;, 모듈은 , 로 나눈다
function openFromHash() {
  if (location.hash.startsWith('#plan=')) { openPlanFromHash(); return; }
  const id = decodeURIComponent((location.hash.match(/^#m=([\w-]+)/) || [])[1] || '');
  const m = byId[id];
  if (!m) return;
  F.q = ''; $('q').value = '';
  selectModuleCell(m);
  const card = [...$('cards').children].find(el => el.dataset.id === m.id);
  if (card) { card.classList.add('is-target'); card.scrollIntoView({ block: 'center' }); }
}

function openPlanFromHash() {
  const q = new URLSearchParams(location.hash.slice(1));
  const days = (q.get('plan') || '').split('/').slice(0, 10).map(d => {
    const [am = '', pm = ''] = d.split(';');
    const ids = x => x.split(',').map(i => i.trim().toUpperCase()).filter(i => byId[i]);
    return { am: ids(am), pm: ids(pm) };
  });
  history.replaceState(null, '', location.pathname + location.search);
  if (!days.some(d => d.am.length || d.pm.length)) return;
  const name = (q.get('name') || '').slice(0, 60) || cfg.courseName;
  if (applyPlan({ name, days, pick: {}, memo: {} }, L('지금 과정표를 지우고 링크의 과정표를 담습니다.', 'This replaces the current course plan with the one in the link.'))) showToast(L('링크의 과정표를 담았습니다.', 'Course plan from the link loaded.'));
}
}
