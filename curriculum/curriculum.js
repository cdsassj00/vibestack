/**
 * AI 교육과정 설계 보드 — 업무 영역 × AI 활용 수준 매트릭스, 역량 모듈, 과정표 빌더
 * 데이터는 ./data.js 의 정적 모듈. 과정표는 이 브라우저의 localStorage 에만 저장한다.
 */
import { MODULES, CANDIDATES, PRESETS } from './data.js';

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
const DOM = {
  O: ['공통 기반', 'LLM 기본기·프롬프트·보안·개발환경·프로젝트'],
  R: ['리서치·지식검색', '정보 탐색, 근거 비교, 문서 검색·질의응답'],
  D: ['문서 작성·편집', '기안·보고·회의록·양식·요약'],
  C: ['콘텐츠 제작', '이미지·영상·음성·슬라이드·인포그래픽'],
  A: ['데이터 분석', 'Excel·통계·시뮬레이션·대시보드'],
  P: ['업무처리·연계', '파일·입력·알림·신청·시스템 연계']
};
const DORDER = ['R', 'D', 'C', 'A', 'P'];
const LV = {
  1: ['대화형', '이미 있는 서비스에 묻기', 'LLM 자체 능력(추출·조합·번역·멀티모달), 생성 서비스, 폐쇄망 로컬 챗'],
  2: ['위임형', '이미 있는 에이전트에 맡기기', '딥리서치, 에이전트 모드, 젠스파크·마누스, 앱 생성 서비스. 외부망 전용'],
  3: ['제작형', 'AI가 짜준 코드로 도구 만들기', 'VBA·Python·PowerShell·CMD·HTML·JS·Apps Script'],
  4: ['구축형', '에이전트·시스템을 직접 구축', '코딩에이전트, 배포(Netlify·Cloudflare·Supabase), RAG·MCP, 로컬 LLM, 폐쇄망 위임형 에이전트']
};
const TRACK = { '공': '전 직원 공통', '서': '서무·총괄', '정': '정책·제도', '재': '기획·예산·재무', '홍': '홍보·대변인', '민': '민원·현장', '연': '연구·R&D', '전': '정보화·전산' };
const NET = { E: '외부망 필요', B: '폐쇄망 대안 있음', I: '외부망 준비 후 폐쇄망 반입' };
const GRADE = { 1: '입문', 2: '기초', 3: '중급', 4: '심화', 5: '프로젝트' };
const FEATURED = ['ChatGPT', 'Claude', 'Gemini', 'NotebookLM', 'Perplexity', 'Genspark', 'Google AI Studio', 'Google Stitch', 'Lovable', 'VBA', 'Python', 'PowerShell', 'CMD', 'HTML·JS', 'Apps Script', 'Power Query', 'Netlify', 'Cloudflare', 'Vercel', 'Supabase', 'Firebase', 'Flask·SQLite', 'Ollama', 'LM Studio', 'OpenCode', 'RAG', 'MCP', 'HWPX', 'Whisper', 'n8n', 'Claude Code', 'Codex', 'Antigravity', 'Tauri'];

// 데이터 파일의 배열 순서를 그대로 쓴다 (칸 안의 표시 순서)
const mods = MODULES.map((m, i) => ({ ...m, ord: i, g: m.g || 1, out: m.out || '', kw: m.kw || [], alt: m.alt || '' }));
const byId = Object.fromEntries(mods.map(m => [m.id, m]));

// ==========================================
// 2. 상태 (필터·선택 칸·과정표)
// ==========================================
const F = { tracks: new Set(), grades: new Set(), net: 'all', stacks: new Set(), q: '' };
let sel = null;
let showAllStacks = false;

const KEY = 'aiboard.v2';
const blank = () => ({ name: '', days: [{ am: [], pm: [] }, { am: [], pm: [] }, { am: [], pm: [] }], act: { d: 0, s: 'am' }, pick: {}, open: {} });
let S = load();

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (v && Array.isArray(v.days) && v.days.length) {
      v.pick = v.pick || {};
      v.open = v.open || {};
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
  return escapeHtml(e).replace(/\((외부망|반입|신규)\)/, (m, a) => `<span class="xt xt-${{ '외부망': 'E', '반입': 'I', '신규': 'S' }[a]}">${a}</span>`);
}

function pass(m) {
  if (F.tracks.size && !m.k.some(k => F.tracks.has(k)) && !m.k.includes('공')) return false;
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
    more.textContent = showAllStacks ? '주요 도구만' : `도구 ${hidden}개 더 보기`;
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

  const corner = document.createElement('div');
  corner.className = 'h rh corner';
  corner.innerHTML = '세로 AI 활용 수준<br>가로 업무 영역';
  mx.appendChild(corner);

  DORDER.forEach(d => {
    const h = document.createElement('div');
    h.className = 'h';
    h.innerHTML = `${escapeHtml(DOM[d][0])}<small>${escapeHtml(DOM[d][1])}</small>`;
    mx.appendChild(h);
  });

  const oList = mods.filter(m => m.d === 'O' && pass(m));
  const st = document.createElement('button');
  st.type = 'button';
  st.className = 'strip';
  st.setAttribute('aria-selected', sel === 'O');
  st.innerHTML = '<b>공통 기반·프로젝트</b>' +
    oList.map(m => `<span class="sg${inB.has(m.id) ? ' on' : ''}">${escapeHtml(m.t)}</span>`).join('') +
    `<span class="n">${oList.length}</span>`;
  st.addEventListener('click', () => { sel = sel === 'O' ? null : 'O'; renderMatrix(); renderLib(); jump(); });
  mx.appendChild(st);

  [1, 2, 3, 4].forEach(l => {
    const rh = document.createElement('div');
    rh.className = 'rh';
    rh.innerHTML = `<span class="lv lv${l}">L${l}</span><b>${LV[l][0]} · ${LV[l][1]}</b><small>${LV[l][2]}</small>`;
    mx.appendChild(rh);

    DORDER.forEach(d => {
      const list = mods.filter(m => m.d === d && m.l === l && pass(m));
      const isSel = sel && sel !== 'O' && sel.d === d && sel.l === l;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cell';
      b.setAttribute('aria-selected', !!isSel);
      b.setAttribute('aria-label', `${DOM[d][0]} L${l} 역량 모듈 ${list.length}개`);
      b.innerHTML = !list.length
        ? `<span class="none">${l === 2 && F.net === 'closed' ? closedAltNote(d) : '해당 모듈 없음'}</span>`
        : list.map(m => `<span class="g${inB.has(m.id) ? ' on' : ''}"><i class="net-dot-${m.n}" title="${NET[m.n]}"></i><span><b>${escapeHtml(m.t)}</b><small>예시 ${m.ex.length}개 · ${escapeHtml(m.s.slice(0, 3).join(', '))}</small></span></span>`).join('');
      b.addEventListener('click', () => { sel = isSel ? null : { d, l }; renderMatrix(); renderLib(); jump(); });
      mx.appendChild(b);
    });
  });
}

function jump() { $('lib').scrollIntoView({ block: 'start' }); }

// 폐쇄망 필터에서 비는 L2 칸에 그 열의 대안 모듈(L4 등)을 안내한다
function closedAltNote(d) {
  const alts = [...new Set(mods.filter(m => m.d === d && m.l === 2 && m.alt).map(m => m.alt))].map(id => byId[id]).filter(Boolean);
  const head = '폐쇄망에는 기성 에이전트 서비스가 없습니다.';
  if (!alts.length) return head;
  return `${head} 대안: ${alts.map(a => `${escapeHtml(a.t)} (L${a.l})`).join(', ')}`;
}

// 모듈이 있는 칸을 선택하고 모듈 목록으로 이동
function selectModuleCell(m) {
  sel = m.d === 'O' ? 'O' : { d: m.d, l: m.l };
  if (F.net === 'ext' && m.n !== 'E') {
    F.net = 'all';
    [...$('fNet').children].forEach(x => x.setAttribute('aria-pressed', x.dataset.v === 'all'));
  }
  renderAll();
  jump();
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
  if (sel === 'O') {
    list = mods.filter(m => m.d === 'O' && pass(m));
    title = '공통 기반·프로젝트';
    hint = '다시 누르면 전체 보기';
  } else if (sel) {
    list = mods.filter(m => m.d === sel.d && m.l === sel.l && pass(m));
    title = `${DOM[sel.d][0]} × L${sel.l} ${LV[sel.l][0]}`;
    hint = '칸을 다시 누르면 전체 보기';
  } else {
    list = mods.filter(pass);
    title = `역량 모듈 ${list.length}개`;
    hint = '칸을 누르면 해당 칸의 모듈만 표시합니다';
  }
  $('libTitle').textContent = title;
  $('libHint').textContent = hint;

  const c = $('cards');
  c.innerHTML = '';
  if (!list.length) {
    c.innerHTML = '<div class="cur-empty">조건에 맞는 역량 모듈이 없습니다. 필터를 풀거나 다른 칸을 눌러 보세요.</div>';
    return;
  }

  const ord = { O: 0, R: 1, D: 2, C: 3, A: 4, P: 5 };
  list = list.slice().sort((a, b) => a.l - b.l || ord[a.d] - ord[b.d] || (a.ord || 0) - (b.ord || 0));
  list.forEach(m => {
    const has = inB.has(m.id);
    const el = document.createElement('article');
    el.className = 'mcard' + (has ? ' in' : '');
    el.draggable = true;
    el.innerHTML =
      `<div class="mid"><span>${escapeHtml(DOM[m.d][0])}</span><span>${escapeHtml(m.id)}</span></div>` +
      `<div class="mt">${escapeHtml(m.t)}</div>` +
      `<div class="mdesc">${escapeHtml(m.desc)}</div>` +
      `<div class="tags"><span class="tag lvt lv${m.l}">L${m.l} ${LV[m.l][0]}</span><span class="tag grade">난이도 ${GRADE[m.g]}</span><span class="tag net-${m.n}">${NET[m.n]}</span>` +
        m.k.map(k => `<span class="tag">${escapeHtml(TRACK[k] || k)}</span>`).join('') + '</div>' +
      `<div class="tools"><b>도구</b> ${escapeHtml(m.s.join(', '))}</div>` +
      (m.out ? `<div class="tools"><b>산출물</b> ${escapeHtml(m.out)}</div>` : '') +
      (m.alt && byId[m.alt] ? `<button type="button" class="alt-link">폐쇄망이면 ${escapeHtml(byId[m.alt].t)} (L${byId[m.alt].l}) 참고</button>` : '') +
      `<div class="uses">${useHTML('공공 적용', m.pub)}${useHTML('민간 적용', m.pri)}</div>` +
      `<div class="ex"><b>실습 예시</b><ul>${m.ex.map(e => `<li>${exHTML(e)}</li>`).join('')}</ul></div>` +
      `<div class="act"><span class="src">예시는 강사가 기관에 맞게 바꿉니다</span><button type="button" class="btn btn-primary btn-sm add">${has ? '담김 · 빼기' : '담기'}</button></div>`;
    el.querySelector('.add').addEventListener('click', e => { e.stopPropagation(); has ? removeId(m.id) : addId(m.id); });
    el.querySelector('.alt-link')?.addEventListener('click', e => { e.stopPropagation(); selectModuleCell(byId[m.alt]); });
    el.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', JSON.stringify({ id: m.id })); e.dataTransfer.effectAllowed = 'copyMove'; });
    c.appendChild(el);
  });
}

function renderCands() {
  const open = CANDIDATES.filter(c => c.status !== 'done');
  $('candCount').textContent = open.length ? `${open.length}개` : '';
  $('cands').innerHTML = open.length
    ? open.map(c => `<div class="cand"><div class="cand-h"><span class="tag lvt lv${+c.l || 1}">L${+c.l || 1}</span><span class="cand-d">${escapeHtml((DOM[c.d] || DOM.P)[0])}</span></div><b>${escapeHtml(c.t)}</b><p>${escapeHtml(c.why || '')}</p></div>`).join('')
    : '<div class="cur-empty">남은 후보가 없습니다.</div>';
}

// ==========================================
// 6. 과정표 빌더
// ==========================================
function addId(id) {
  if (inBuilder().has(id)) { showToast('이미 담긴 모듈입니다.'); return; }
  let { d, s } = S.act;
  if (!S.days[d]) { d = 0; s = 'am'; }
  S.days[d][s].push(id);
  save(); renderAll();
  showToast(`${d + 1}일차 ${s === 'am' ? '오전' : '오후'}에 담았습니다.`);
}

function removeSilent(id) {
  S.days.forEach(d => { d.am = d.am.filter(x => x !== id); d.pm = d.pm.filter(x => x !== id); });
}

function removeId(id) {
  removeSilent(id);
  delete S.pick[id];
  delete S.open[id];
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
  return `${n ? `예시 ${n}개 선택` : '예시 고르기'} ${open ? '접기' : '펼치기'}`;
}

function renderBuilder() {
  $('bname').value = S.name || '';
  const wrap = $('days');
  wrap.innerHTML = '';

  S.days.forEach((day, di) => {
    const box = document.createElement('div');
    box.className = 'day';
    box.innerHTML = `<div class="day-h"><span>${di + 1}일차</span>${S.days.length > 1 ? `<button type="button" class="noprint" data-rm="${di}">일차 삭제</button>` : ''}</div>`;

    ['am', 'pm'].forEach(sk => {
      const act = S.act.d === di && S.act.s === sk;
      const slot = document.createElement('div');
      slot.className = 'slot' + (act ? ' active' : '');
      slot.innerHTML = `<div class="sl2"><b>${sk === 'am' ? '오전' : '오후'}</b><span class="noprint">${act ? '여기에 담는 중' : '눌러서 담을 곳으로'}</span></div>`;

      day[sk].forEach(id => {
        const m = byId[id];
        if (!m) return;
        const picks = (S.pick[id] || []).filter(i => i < m.ex.length);
        const open = !!S.open[id];
        const netTag = m.n === 'E' ? '<span class="nt nt-E">외부망</span>' : m.n === 'I' ? '<span class="nt nt-I">반입</span>' : '';

        const p = document.createElement('div');
        p.className = 'pill';
        p.draggable = true;
        p.innerHTML =
          `<div class="prow"><span class="lvb lv${m.l}">L${m.l}</span><span class="tt">${escapeHtml(m.t)}${netTag}</span>` +
          `<button type="button" class="mv noprint" aria-label="위로">${ICONS.up}</button><button type="button" class="mv noprint" aria-label="아래로">${ICONS.down}</button><button type="button" class="x noprint" aria-label="빼기">${ICONS.close}</button></div>` +
          `<button type="button" class="pk noprint" aria-expanded="${open}">${pickLabel(picks.length, open)}</button>` +
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
          if (!d.move && inBuilder().has(d.id)) { showToast('이미 담긴 모듈입니다.'); return; }
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
        if (!d.move && inBuilder().has(d.id)) { showToast('이미 담긴 모듈입니다.'); return; }
        moveId(d.id, di, sk);
      });
      box.appendChild(slot);
    });
    wrap.appendChild(box);
  });

  wrap.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.rm;
    if (!confirm(`${i + 1}일차와 담긴 모듈을 삭제합니다.`)) return;
    S.days.splice(i, 1);
    if (S.act.d >= S.days.length) S.act = { d: 0, s: 'am' };
    save(); renderAll();
  }));

  renderSummary();
  $('fab').textContent = `내 과정 ${inBuilder().size}`;
}

function renderSummary() {
  const ms = [...inBuilder()].map(i => byId[i]).filter(Boolean);
  const el = $('sum');
  if (!ms.length) {
    el.innerHTML = '<div>아직 담긴 모듈이 없습니다. 예시 과정을 불러오거나 역량 모듈을 담아 보세요. 담은 뒤 "예시 고르기"로 이번 과정에서 다룰 실습을 고릅니다.</div>';
    return;
  }
  const lc = [1, 2, 3, 4].map(l => ms.filter(m => m.l === l).length);
  const dc = DORDER.map(d => [d, ms.filter(m => m.d === d).length]);
  const ext = ms.filter(m => m.n === 'E');
  const imp = ms.filter(m => m.n === 'I');
  const picked = ms.reduce((a, m) => a + (S.pick[m.id] || []).length, 0);
  const tools = {};
  ms.forEach(m => m.s.forEach(s => { tools[s] = (tools[s] || 0) + 1; }));
  const tl = Object.entries(tools).sort((a, b) => b[1] - a[1]);

  let h = `<div><h3>역량 모듈 ${ms.length}개 · 선택한 실습 예시 ${picked}개</h3>` +
    `<div class="lvbar">${lc.map((c, i) => c ? `<i class="lv${i + 1}" style="width:${c / ms.length * 100}%"></i>` : '').join('')}</div>` +
    `<div class="lvleg">${lc.map((c, i) => `<span>L${i + 1} ${LV[i + 1][0]} ${c}</span>`).join('')}</div></div>`;
  h += `<div><h3>난이도 구성</h3><div class="toolset">${Object.entries(GRADE).map(([k, v]) => { const c = ms.filter(m => m.g === +k).length; return `<span class="tag${c ? '' : ' muted'}">${v} ${c}</span>`; }).join('')}</div></div>`;
  h += `<div><h3>업무 영역 커버리지</h3><div class="toolset">${dc.map(([d, c]) => `<span class="tag${c ? '' : ' muted'}">${DOM[d][0]} ${c}</span>`).join('')}</div></div>`;
  if (F.net === 'closed' && ext.length) {
    h += `<div class="warn"><b>폐쇄망에서 바로 못 쓰는 모듈 ${ext.length}개</b><br>${ext.map(m => escapeHtml(m.t)).join('<br>')}<br>외부망 교육장에서 실습하거나 결과물을 이관하는 방식으로 운영합니다.</div>`;
  } else if (ext.length) {
    h += `<div><h3>외부망 필요 ${ext.length}개</h3>교육장 인터넷과 개인 계정을 미리 준비합니다.</div>`;
  }
  if (imp.length) h += `<div><h3>사전 반입 필요 ${imp.length}개</h3>모델·라이브러리·공개자료를 외부망에서 준비해 승인 절차로 반입합니다.</div>`;
  h += `<div><h3>준비할 도구</h3><div class="toolset">${tl.map(([s, c]) => `<span class="tag">${escapeHtml(s)}${c > 1 ? ' ' + c : ''}</span>`).join('')}</div></div>`;
  el.innerHTML = h;
}

function loadPreset(k) {
  const p = PRESETS[k];
  if (!p) return;
  if (inBuilder().size && !confirm('지금 과정표를 지우고 예시 과정을 불러옵니다.')) return;
  S = blank();
  S.name = p.name;
  S.days = p.days.map(d => ({ am: d.am.filter(i => byId[i]), pm: d.pm.filter(i => byId[i]) }));
  save(); renderAll();
  showToast('예시 과정을 불러왔습니다.');
}

function copyText(txt, msg) {
  const fallback = () => {
    const t = document.createElement('textarea');
    t.value = txt;
    document.body.appendChild(t);
    t.select();
    try { document.execCommand('copy'); showToast(msg); } catch (e) { showToast('복사하지 못했습니다.'); }
    t.remove();
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(() => showToast(msg), fallback);
  else fallback();
}

function courseText() {
  const lines = [S.name || '생성형 AI 교육과정'];
  S.days.forEach((d, i) => ['am', 'pm'].forEach(s => {
    if (!d[s].length) return;
    lines.push('', `[${i + 1}일차 ${s === 'am' ? '오전' : '오후'}]`);
    d[s].forEach(id => {
      const m = byId[id];
      if (!m) return;
      lines.push(`- ${m.t} (L${m.l} ${LV[m.l][0]} / 난이도 ${GRADE[m.g]} / ${NET[m.n]} / ${m.s.join(', ')})`);
      if (m.out) lines.push(`    산출물: ${m.out}`);
      const p = (S.pick[id] || []).filter(x => x < m.ex.length);
      lines.push('    실습 예시: ' + (p.length ? p.map(x => m.ex[x]).join(', ') : `강사 재량 (${m.ex.slice(0, 3).join(', ')} 등)`));
    });
  }));
  return lines.join('\n');
}

// ==========================================
// 7. 테마 (VibeStack 본 페이지와 같은 저장 키)
// ==========================================
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('app_theme', theme); } catch (e) { /* 무시 */ }
  const btn = $('themeToggleBtn');
  btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  btn.title = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
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
    showToast(`${S.days.length}일차를 추가했습니다.`);
  });

  $('preset').addEventListener('change', e => { const v = e.target.value; e.target.value = ''; loadPreset(v); });
  $('heroPreset').addEventListener('click', () => { loadPreset('intro'); $('builder').scrollIntoView(); });
  $('clear').addEventListener('click', () => { if (!confirm('과정표를 비웁니다.')) return; S = blank(); save(); renderAll(); });
  $('print').addEventListener('click', () => window.print());
  $('fab').addEventListener('click', () => $('builder').scrollIntoView());
  $('copy').addEventListener('click', () => copyText(courseText(), '과정표를 복사했습니다.'));
}

applyTheme(currentTheme());
setupEventListeners();
renderStats();
renderFilters();
renderAll();
renderCands();
