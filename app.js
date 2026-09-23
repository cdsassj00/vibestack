/**
 * VibeStack - 바이브코딩 기술 조합 진단 · 시나리오 도감 · 용어·오류 메시지 사전
 * 정적 페이지로 동작한다(Firebase는 Hosting만 쓴다).
 */
import { VIBE_SCENARIOS } from './scenarios-data.js';
import { QUESTIONS, STAGES, METHODS, activeQuestions, answerLabel, diagnose } from './diagnosis.js';
import { MODULES as VIBE_MODULES } from './vibecoding/data.js';
import { GROUPS, TERMS, ERRORS } from './glossary-data.js';

const VIBE_MODULES_BY_ID = Object.fromEntries(VIBE_MODULES.map(m => [m.id, m]));
const TERM_BY_NAME = Object.fromEntries(TERMS.map(t => [t.t, t]));

// ==========================================
// 0. UI Icons (이모지 대신 쓰는 라인 아이콘)
// ==========================================
const icon = (paths, size = 16) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  sun: icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'),
  moon: icon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
  chevron: icon('<path d="m9 18 6-6-6-6"/>'),
  heart: icon('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>', 15),
  comment: icon('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>', 15)
};

// ==========================================
// 1. App State
// ==========================================
let state = {
  activeTrack: 'all',
  answers: {},
  step: 0,
  diagnosis: null,
  currentResultScenario: null,
  searchKeyword: '',
  theme: localStorage.getItem('app_theme') || 'dark',
  gloss: { tab: 'terms', group: 'all', q: '' }
};

// ==========================================
// 2. DOM Elements
// ==========================================
const questionBox = document.getElementById('questionBox');
const progressFill = document.getElementById('progressFill');
const stepIndicator = document.getElementById('stepIndicator');
const decisionQuestion = document.getElementById('decisionQuestion');
const decisionDesc = document.getElementById('decisionDesc');
const decisionOptionsGrid = document.getElementById('decisionOptionsGrid');
const treeHistory = document.getElementById('treeHistory');
const resetTreeBtn = document.getElementById('resetTreeBtn');
const prevStepBtn = document.getElementById('prevStepBtn');
const diagNote = document.getElementById('diagNote');

// Combo Deck Elements
const comboDeckBox = document.getElementById('comboDeckBox');
const comboDeckTitle = document.getElementById('comboDeckTitle');
const comboDeckGrid = document.getElementById('comboDeckGrid');
const restartWizardBtn = document.getElementById('restartWizardBtn');

// Catalog & Community Elements
const toggleCatalogBtn = document.getElementById('toggleCatalogBtn');
const fullCatalogSection = document.getElementById('fullCatalogSection');
const catalogGrid = document.getElementById('catalogGrid');
const scenarioSearchInput = document.getElementById('scenarioSearchInput');

// Modals
const detailModal = document.getElementById('detailModal');
const modalTrackBadge = document.getElementById('modalTrackBadge');
const modalProjectTitle = document.getElementById('modalProjectTitle');
const modalProjectSummary = document.getElementById('modalProjectSummary');
const modalTechTags = document.getElementById('modalTechTags');
const modalReasons = document.getElementById('modalReasons');
const modalCliSnippet = document.getElementById('modalCliSnippet');
const modalGovIdeas = document.getElementById('modalGovIdeas');
const modalBizIdeas = document.getElementById('modalBizIdeas');
const modalPromptText = document.getElementById('modalPromptText');
const copyPromptBtn = document.getElementById('copyPromptBtn');

const glossModal = document.getElementById('glossModal');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// ==========================================
// 3. Application Initialization
// ==========================================
function initApp() {
  applyTheme(state.theme);
  renderQuestion();
  setupEventListeners();
  renderStats();
  renderCatalog();
  renderGlossary();
}

// ==========================================
// 4. 기술 조합 진단 (diagnosis.js 규칙 → 결과 화면)
// ==========================================
function currentQuestions() {
  return activeQuestions(state.answers);
}

function renderQuestion() {
  const qs = currentQuestions();
  const q = qs[state.step];
  if (!q) { showDiagnosis(); return; }

  questionBox.style.display = 'block';
  comboDeckBox.style.display = 'none';

  const total = qs.length;
  if (progressFill) progressFill.style.width = `${Math.round(((state.step + 1) / total) * 100)}%`;
  if (stepIndicator) stepIndicator.textContent = `${state.step + 1} / ${total}`;
  if (prevStepBtn) prevStepBtn.disabled = state.step === 0;
  decisionQuestion.textContent = q.q;
  decisionDesc.textContent = q.desc;

  const opts = q.options.filter(o => !q.filter || q.filter(state.answers, o));
  decisionOptionsGrid.className = 'wizard-options-grid' + (opts.length <= 3 ? '' : ' wizard-options-2');
  decisionOptionsGrid.innerHTML = opts.map(o => `
    <button class="wizard-card-btn${state.answers[q.key] === o.v ? ' is-picked' : ''}" type="button" data-v="${escapeHtml(o.v)}">
      <div class="btn-title" style="justify-content: space-between; width: 100%;">
        <span>${escapeHtml(o.label)}</span>
        <span class="option-chevron">${ICONS.chevron}</span>
      </div>
      ${o.sub ? `<div class="btn-subtitle">${escapeHtml(o.sub)}</div>` : ''}
    </button>
  `).join('');

  decisionOptionsGrid.querySelectorAll('.wizard-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.answers[q.key] = btn.dataset.v;
      // 앞 답변이 바뀌어 건너뛰게 된 질문의 답은 지운다
      QUESTIONS.forEach(x => { if (x.when && !x.when(state.answers)) delete state.answers[x.key]; });
      if (q.key === 'what' && btn.dataset.v === 'chat' && state.answers.ai === 'none') delete state.answers.ai;
      state.step += 1;
      renderQuestion();
    });
  });

  renderAnswerHistory();
}

// 선택한 조건 칩: 누르면 그 질문으로 돌아간다
function renderAnswerHistory() {
  if (!treeHistory) return;
  const qs = currentQuestions();
  const done = qs.slice(0, state.step).filter(q => state.answers[q.key]);
  if (!done.length) {
    treeHistory.innerHTML = '<span class="history-item">아직 없음</span>';
    return;
  }
  treeHistory.innerHTML = done.map(q => {
    const i = qs.indexOf(q);
    return `<button type="button" class="history-item history-btn" data-step="${i}" title="${escapeHtml(q.q)} 다시 고르기">${escapeHtml(answerLabel(q.key, state.answers[q.key]))}</button>`;
  }).join('<span class="history-sep" aria-hidden="true">›</span>');
  treeHistory.querySelectorAll('.history-btn').forEach(b => {
    b.addEventListener('click', () => { state.step = Number(b.dataset.step); renderQuestion(); });
  });
}

function resetDiagnosis() {
  state.answers = {};
  state.step = 0;
  renderQuestion();
}

function showDiagnosis() {
  const r = diagnose(state.answers, diagNote?.value || '');
  state.diagnosis = r;
  questionBox.style.display = 'none';
  comboDeckBox.style.display = 'block';

  comboDeckTitle.textContent = `S${r.stage} ${r.stageName} × ${r.methodName}`;
  const qs = currentQuestions();
  $id('diagConditions').textContent = qs.map(q => answerLabel(q.key, state.answers[q.key])).join(' · ');

  $id('diagStage').textContent = `S${r.stage} ${r.stageName}`;
  $id('diagStageDesc').textContent = r.stageDesc;
  $id('diagSteps').innerHTML = Object.entries(STAGES).map(([k, v]) => {
    const on = r.need[k];
    return `<li class="diag-step${on ? ' on' : ''}${Number(k) === r.stage ? ' top' : ''}"><span>S${k}</span>${escapeHtml(v[0])}</li>`;
  }).join('');

  $id('diagMethod').textContent = r.methodName;
  $id('diagMethodDesc').textContent = r.methodDesc;
  const note = $id('diagMethodNote');
  if (r.chosen && !r.fit) {
    note.innerHTML = `<b>고른 방식(${escapeHtml(METHODS[r.chosen][0])})으로는 어렵습니다.</b><ul>${r.reasons.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
  } else if (!r.chosen) {
    note.textContent = '조건에 맞춰 추천한 방식입니다.';
  } else {
    note.textContent = '고른 방식으로 만들 수 있습니다.';
  }

  $id('diagStack').innerHTML = r.stack.map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join('');
  $id('diagWarn').innerHTML = r.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('');
  const found = termsInText([...r.stack.flat(), ...r.warnings].join(' '));
  $id('diagTerms').innerHTML = found.length
    ? `<span class="diag-terms-k">이 결과에 나온 용어</span><div class="gloss-chips">${termButtons(found)}</div>`
    : '';
  $id('diagPrompt').textContent = r.prompt;

  $id('diagModules').innerHTML = r.modules.map(id => VIBE_MODULES_BY_ID[id]).filter(Boolean).map(m => `
    <a class="diag-mod" href="/vibecoding/#m=${encodeURIComponent(m.id)}">
      <span class="diag-mod-id">${m.d === 'O' ? '공통' : 'S' + m.l} · ${escapeHtml(m.id)}</span>
      <span class="diag-mod-t">${escapeHtml(m.t)}</span>
    </a>`).join('');

  renderScenarioCards(r.scenarios);
  comboDeckBox.scrollIntoView({ behavior: 'smooth' });
}

function $id(id) { return document.getElementById(id); }

// 진단과 비슷한 실무 시나리오 카드
function renderScenarioCards(cardIds) {
  const scenarios = cardIds.map(id => VIBE_SCENARIOS.find(s => s.id === id)).filter(Boolean);
  if (scenarios.length === 0) {
    comboDeckGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        조건에 맞는 시나리오가 없습니다. 아래 전체 도감에서 찾아보세요.
      </div>
    `;
    return;
  }

  comboDeckGrid.innerHTML = scenarios.map((s, idx) => `
    <article class="project-combo-card" data-id="${s.id}">
      <div>
        <div class="card-top-row">
          <span class="card-badge-pill">${idx === 0 ? '가장 가까운 사례' : '비슷한 사례'}</span>
          <span class="card-track-name">${escapeHtml(s.trackName)}</span>
        </div>
        <h3 class="card-project-title">${escapeHtml(s.title)}</h3>
        <p class="card-project-summary">${escapeHtml(s.summary)}</p>

        <div class="card-ideas-summary">
          <div class="idea-row">
            <span class="idea-tag-chip tag-chip-gov">공공</span>
            <span class="idea-text-mini">${escapeHtml(s.publicIdeas ? s.publicIdeas[0] : '행정 업무 자동화')}</span>
          </div>
          <div class="idea-row">
            <span class="idea-tag-chip tag-chip-biz">민간</span>
            <span class="idea-text-mini">${escapeHtml(s.privateIdeas ? s.privateIdeas[0] : '기업 실무 데이터 처리')}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="card-tech-pills">
          ${s.techStack.map(t => `<span class="tech-pill-mini">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="card-action-bar">
          <span style="font-size: 0.78rem; color: var(--text-dim);">구현 내용과 프롬프트 보기</span>
          <span class="btn-open-detail">자세히 보기 ${ICONS.chevron}</span>
        </div>
      </div>
    </article>
  `).join('');

  comboDeckGrid.querySelectorAll('.project-combo-card').forEach(card => {
    card.addEventListener('click', () => {
      const selected = VIBE_SCENARIOS.find(s => s.id === card.getAttribute('data-id'));
      if (selected) openProjectDetailModal(selected);
    });
  });
}

// --------------------------------------------------------------------------
// 카드 클릭 시: 세부 개발 내용 및 AI 마스터 프롬프트 모달
// --------------------------------------------------------------------------
function openProjectDetailModal(scenario) {
  state.currentResultScenario = scenario;

  modalTrackBadge.textContent = scenario.trackName;
  modalProjectTitle.textContent = scenario.title;
  modalProjectSummary.textContent = scenario.summary;

  // 공공 & 민간 구현 아이디어 목록 렌더링
  if (modalGovIdeas) {
    const govList = scenario.publicIdeas || ['온나라 및 행정 업무 서식 자동화', '지자체 데이터 취합 및 이상치 검증'];
    modalGovIdeas.innerHTML = govList.map(item => `
      <li>
        <span>${escapeHtml(item)}</span>
      </li>
    `).join('');
  }

  if (modalBizIdeas) {
    const bizList = scenario.privateIdeas || ['기업 ERP 전표 및 주문서 대량 병합', 'B2B 고객 관리 및 실시간 알림 파이프라인'];
    modalBizIdeas.innerHTML = bizList.map(item => `
      <li>
        <span>${escapeHtml(item)}</span>
      </li>
    `).join('');
  }

  modalTechTags.innerHTML = scenario.techStack.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
  modalReasons.innerHTML = scenario.pros.map(p => `<li>${escapeHtml(p)}</li>`).join('');
  modalCliSnippet.textContent = scenario.cliCommand;

  const generatedPrompt = scenario.promptTemplate.replace('{PROJECT_NAME}', scenario.title.replace(/[^\w\s가-힣]/g, '').trim());
  modalPromptText.value = generatedPrompt;

  openModal(detailModal);
}

// ==========================================
// 5. Methodologies Catalog Rendering & Search
// ==========================================
// 히어로·도감 제목의 숫자를 시나리오 데이터에서 계산해 표시
function renderStats() {
  const stats = {
    scenarios: VIBE_SCENARIOS.length,
    tracks: new Set(VIBE_SCENARIOS.map(s => s.track)).size,
    terms: TERMS.length
  };
  document.querySelectorAll('[data-stat]').forEach(el => {
    el.textContent = stats[el.dataset.stat];
  });
}

function renderCatalog() {
  let list = [...VIBE_SCENARIOS];

  // 1. Track Filter
  if (state.activeTrack !== 'all') {
    list = list.filter(s => s.track === state.activeTrack);
  }

  // 2. Keyword Search
  if (state.searchKeyword.trim()) {
    const q = state.searchKeyword.toLowerCase();
    list = list.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.techStack.some(t => t.toLowerCase().includes(q))
    );
  }

  if (list.length === 0) {
    catalogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-dim);">
        검색 조건에 맞는 시나리오가 없습니다. 다른 검색어를 입력해보세요.
      </div>
    `;
    return;
  }

  catalogGrid.innerHTML = list.map(s => `
    <article class="catalog-card" data-id="${s.id}">
      <div>
        <div class="card-header-row">
          <span class="track-badge ${s.track}">${escapeHtml(s.trackName)}</span>
          <span style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700;">마스터 프롬프트</span>
        </div>
        <h3 class="card-title">${escapeHtml(s.title)}</h3>
        <p class="card-desc">${escapeHtml(s.summary)}</p>
        <div class="card-tech-row">
          ${s.techStack.map(t => `<span class="tech-tag" style="font-size: 0.76rem; padding: 4px 10px;">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
      <div class="card-footer-row">
        <span style="font-size: 0.82rem; color: var(--text-dim);">클릭하여 상세 가이드 & 프롬프트 복사</span>
        <button class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">자세히 보기</button>
      </div>
    </article>
  `).join('');

  catalogGrid.querySelectorAll('.catalog-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const item = VIBE_SCENARIOS.find(s => s.id === id);
      if (item) openProjectDetailModal(item);
    });
  });
}

// ==========================================
// 6. 바이브코딩 용어 사전 · 오류 메시지 사전
// ==========================================
function glossMatch(text) {
  const q = state.gloss.q.toLowerCase();
  return !q || text.toLowerCase().includes(q);
}

function renderGlossary() {
  const g = state.gloss;
  $id('glossTermCount').textContent = TERMS.length;
  $id('glossErrCount').textContent = ERRORS.length;
  $id('glossTabs').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.tab === g.tab));

  const groupsEl = $id('glossGroups');
  groupsEl.style.display = g.tab === 'terms' ? '' : 'none';
  groupsEl.innerHTML = [['all', '전체'], ...Object.entries(GROUPS)].map(([k, label]) =>
    `<button type="button" class="gloss-chip" data-g="${k}" aria-pressed="${g.group === k}">${escapeHtml(label)}</button>`).join('');
  $id('glossSearch').placeholder = g.tab === 'terms' ? '용어·뜻 검색 (예: 키, 배포, CORS)' : '오류 문구 검색 (예: 404, CORS, module)';

  const grid = $id('glossGrid');
  if (g.tab === 'terms') {
    const list = TERMS.map((t, i) => ({ t, i })).filter(({ t }) =>
      (g.group === 'all' || t.g === g.group) && glossMatch([t.t, t.en, t.d, t.w, ...(t.alias || [])].join(' ')));
    grid.className = 'gloss-grid';
    grid.innerHTML = list.length ? list.map(({ t, i }) => `
      <button type="button" class="gloss-item" data-term="${i}">
        <span class="gloss-item-t">${escapeHtml(t.t)}</span>
        <span class="gloss-item-g">${escapeHtml(GROUPS[t.g])}</span>
      </button>`).join('') : '<p class="gloss-empty">검색 결과가 없습니다.</p>';
  } else {
    const list = ERRORS.map((e, i) => ({ e, i })).filter(({ e }) => glossMatch([e.t, e.where, e.d].join(' ')));
    grid.className = 'gloss-grid gloss-grid-err';
    grid.innerHTML = list.length ? list.map(({ e, i }) => `
      <button type="button" class="gloss-item gloss-err" data-err="${i}">
        <code class="gloss-item-t">${escapeHtml(e.t)}</code>
        <span class="gloss-item-g">${escapeHtml(e.where)} · ${escapeHtml(e.d)}</span>
      </button>`).join('') : '<p class="gloss-empty">검색 결과가 없습니다.</p>';
  }
}

function glossRow(label, html) {
  return `<div class="gloss-row"><div class="gloss-k">${label}</div><div class="gloss-v">${html}</div></div>`;
}

function glossSayBlock(text) {
  return `<div class="gloss-say"><p>${escapeHtml(text)}</p><button type="button" class="btn btn-primary btn-sm" data-copy-say>문장 복사</button></div>`;
}

function termButtons(names) {
  return names.filter(n => TERM_BY_NAME[n]).map(n =>
    `<button type="button" class="gloss-chip" data-open-term="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join('');
}

function openTerm(t) {
  $id('glossModalBadge').textContent = GROUPS[t.g];
  $id('glossModalTitle').textContent = t.en ? `${t.t} (${t.en})` : t.t;
  const mods = (t.m || []).map(id => VIBE_MODULES_BY_ID[id]).filter(Boolean);
  $id('glossModalBody').innerHTML =
    glossRow('뜻', escapeHtml(t.d)) +
    glossRow('언제 나오나', escapeHtml(t.w)) +
    glossRow('AI에게 이렇게 말하기', glossSayBlock(t.say)) +
    (t.rel?.length ? glossRow('함께 볼 용어', `<div class="gloss-chips">${termButtons(t.rel)}</div>`) : '') +
    (mods.length ? glossRow('관련 교육 모듈', `<div class="gloss-chips">${mods.map(m =>
      `<a class="gloss-chip" href="/vibecoding/#m=${encodeURIComponent(m.id)}">${escapeHtml(m.id)} ${escapeHtml(m.t)}</a>`).join('')}</div>`) : '');
  bindGlossModal(t.say);
  if (!glossModal.classList.contains('active')) openModal(glossModal);
  glossModal.querySelector('.modal-card').scrollTop = 0;
}

function openError(e) {
  $id('glossModalBadge').textContent = `오류 메시지 · ${e.where}`;
  $id('glossModalTitle').textContent = e.t;
  $id('glossModalBody').innerHTML =
    glossRow('뜻', escapeHtml(e.d)) +
    glossRow('먼저 확인할 것', escapeHtml(e.check)) +
    glossRow('AI에게 이렇게 말하기', glossSayBlock(e.say)) +
    (e.rel?.length ? glossRow('관련 용어', `<div class="gloss-chips">${termButtons(e.rel)}</div>`) : '');
  bindGlossModal(e.say);
  if (!glossModal.classList.contains('active')) openModal(glossModal);
  glossModal.querySelector('.modal-card').scrollTop = 0;
}

function bindGlossModal(say) {
  const body = $id('glossModalBody');
  body.querySelector('[data-copy-say]')?.addEventListener('click', () => copyText(say, 'AI에게 보낼 문장을 복사했습니다.'));
  body.querySelectorAll('[data-open-term]').forEach(b => b.addEventListener('click', () => openTerm(TERM_BY_NAME[b.dataset.openTerm])));
}

// 인쇄용 용어표: 분류별 표로 모든 용어를 펼친다
function renderGlossPrint() {
  $id('glossPrint').innerHTML = '<h2>바이브코딩 용어 사전</h2>' + Object.entries(GROUPS).map(([k, label]) => `
    <h3>${escapeHtml(label)}</h3>
    <table><thead><tr><th>용어</th><th>뜻</th><th>AI에게 이렇게 말하기</th></tr></thead><tbody>
    ${TERMS.filter(t => t.g === k).map(t => `<tr><td>${escapeHtml(t.t)}</td><td>${escapeHtml(t.d)}</td><td>${escapeHtml(t.say)}</td></tr>`).join('')}
    </tbody></table>`).join('');
}

// 진단 결과 문장에 나온 용어를 찾는다
function termsInText(text) {
  const found = [];
  for (const t of TERMS) {
    if (t.noAuto) continue;
    const keys = [t.t, ...(t.alias || [])];
    if (keys.some(k => text.includes(k))) found.push(t.t);
  }
  return found;
}

function copyText(text, msg) {
  navigator.clipboard.writeText(text)
    .then(() => showToast(msg))
    .catch(() => showToast('복사하지 못했습니다. 직접 선택해 복사해 주세요.', 'error'));
}

// ==========================================
// 7. Event Listeners
// ==========================================
function setupEventListeners() {
  // 진단: 처음부터 / 이전 / 다시 진단 / 한 줄 설명 / 프롬프트 복사
  resetTreeBtn?.addEventListener('click', resetDiagnosis);
  prevStepBtn?.addEventListener('click', () => {
    if (state.step > 0) { state.step -= 1; renderQuestion(); }
  });

  restartWizardBtn?.addEventListener('click', () => {
    resetDiagnosis();
    questionBox.scrollIntoView({ behavior: 'smooth' });
  });

  diagNote?.addEventListener('input', () => {
    if (!state.diagnosis) return;
    state.diagnosis = diagnose(state.answers, diagNote.value);
    document.getElementById('diagPrompt').textContent = state.diagnosis.prompt;
  });

  document.getElementById('diagCopyBtn')?.addEventListener('click', () => {
    if (!state.diagnosis) return;
    navigator.clipboard.writeText(state.diagnosis.prompt)
      .then(() => showToast('시작 프롬프트를 복사했습니다.'))
      .catch(() => showToast('복사하지 못했습니다. 직접 선택해 복사해 주세요.', 'error'));
  });

  // Toggle Full Catalog Drawer
  toggleCatalogBtn?.addEventListener('click', () => {
    if (!fullCatalogSection) return;
    const isHidden = fullCatalogSection.style.display === 'none';
    fullCatalogSection.style.display = isHidden ? 'block' : 'none';
    toggleCatalogBtn.textContent = isHidden ? '도감 닫기' : '전체 도감';
    if (isHidden) {
      fullCatalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Copy Result Prompt from Modal
  copyPromptBtn?.addEventListener('click', () => {
    if (!modalPromptText) return;
    navigator.clipboard.writeText(modalPromptText.value);
    showToast('마스터 프롬프트를 클립보드에 복사했습니다.');
  });

  // Search Input in Catalog
  scenarioSearchInput?.addEventListener('input', (e) => {
    state.searchKeyword = e.target.value;
    renderCatalog();
  });

  // 용어·오류 사전: 탭 / 분류 / 검색 / 항목 / 인쇄
  $id('glossTabs').addEventListener('click', e => {
    const b = e.target.closest('button[data-tab]');
    if (!b) return;
    state.gloss.tab = b.dataset.tab;
    renderGlossary();
  });
  $id('glossGroups').addEventListener('click', e => {
    const b = e.target.closest('button[data-g]');
    if (!b) return;
    state.gloss.group = b.dataset.g;
    renderGlossary();
  });
  $id('glossSearch').addEventListener('input', e => {
    state.gloss.q = e.target.value.trim();
    renderGlossary();
  });
  $id('glossGrid').addEventListener('click', e => {
    const b = e.target.closest('.gloss-item');
    if (!b) return;
    if (b.dataset.term) openTerm(TERMS[Number(b.dataset.term)]);
    else if (b.dataset.err) openError(ERRORS[Number(b.dataset.err)]);
  });
  $id('diagTerms').addEventListener('click', e => {
    const b = e.target.closest('[data-open-term]');
    if (b) openTerm(TERM_BY_NAME[b.dataset.openTerm]);
  });
  $id('glossPrintBtn').addEventListener('click', () => {
    renderGlossPrint();
    document.body.classList.add('print-gloss');
    window.print();
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('print-gloss'));

  // Theme Toggle
  themeToggleBtn?.addEventListener('click', () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  // Modals Close
  document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

}

// Helpers
function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = type === 'error' ? 'toast toast-error' : 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('app_theme', theme);
  themeToggleBtn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  themeToggleBtn.title = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

window.addEventListener('DOMContentLoaded', initApp);
