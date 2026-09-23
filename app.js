/**
 * VibeStack - 종합 바이브코딩 아키텍처 내비게이터 & 프롬프트 허브
 * Firebase Cloud Firestore & Authentication 연동
 */
import { VIBE_SCENARIOS, DECISION_TREE_V2 } from './scenarios-data.js';
import { db, auth } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  increment, 
  arrayUnion 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// ==========================================
// 1. App State
// ==========================================
let state = {
  currentUser: null,
  activeTrack: 'all',
  currentTreeNodeKey: 'start',
  treeHistory: ['시작'],
  currentResultScenario: null,
  communityPrompts: [],
  communitySort: 'latest',
  searchKeyword: '',
  theme: localStorage.getItem('app_theme') || 'dark',
  authTabMode: 'login'
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
const communityGrid = document.getElementById('communityGrid');
const communitySortSelect = document.getElementById('communitySortSelect');

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
const saveToCommunityBtn = document.getElementById('saveToCommunityBtn');

const sharePromptModal = document.getElementById('sharePromptModal');
const authModal = document.getElementById('authModal');
const openShareModalBtn = document.getElementById('openShareModalBtn');
const authContainer = document.getElementById('authContainer');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const sharePromptForm = document.getElementById('sharePromptForm');

// ==========================================
// 3. Application Initialization
// ==========================================
function initApp() {
  applyTheme(state.theme);
  renderDecisionNode('start');
  setupEventListeners();
  renderCatalog();

  // Firebase Auth 리스너
  onAuthStateChanged(auth, (user) => {
    if (user) {
      state.currentUser = {
        uid: user.uid,
        displayName: user.displayName || (user.isAnonymous ? '게스트 개발자' : '익명 사용자'),
        email: user.email,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous
      };
    } else {
      state.currentUser = null;
    }
    renderAuthStatus();
  });

  // Firestore 실시간 커뮤니티 프롬프트 동기화
  subscribeCommunityPrompts();
}

function renderAuthStatus() {
  if (state.currentUser) {
    authContainer.innerHTML = `
      <div class="user-profile-badge">
        <span class="avatar">${state.currentUser.displayName.charAt(0)}</span>
        <span class="username">${escapeHtml(state.currentUser.displayName)}</span>
        <button id="logoutBtn" class="btn btn-ghost" style="padding: 4px 10px; font-size: 0.78rem;">로그아웃</button>
      </div>
    `;
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  } else {
    authContainer.innerHTML = `
      <button id="openAuthModalBtn" class="btn btn-secondary">
        🔑 로그인
      </button>
    `;
    document.getElementById('openAuthModalBtn')?.addEventListener('click', () => openModal(authModal));
  }
}

async function handleLogout() {
  await signOut(auth);
  showToast('👋 로그아웃되었습니다.');
}

// ==========================================
// 4. Interactive Wizard & Combo Deck Engine
// ==========================================
function renderDecisionNode(nodeKey) {
  const node = DECISION_TREE_V2[nodeKey];
  if (!node) return;

  state.currentTreeNodeKey = nodeKey;
  questionBox.style.display = 'block';
  comboDeckBox.style.display = 'none';

  // Progress & Step
  if (progressFill) progressFill.style.width = `${node.progress || 33}%`;
  if (stepIndicator) stepIndicator.textContent = node.step || '단계 1';
  if (decisionQuestion) decisionQuestion.textContent = node.question;
  if (decisionDesc) decisionDesc.textContent = node.desc;

  // Options Render (2열 YES/NO 또는 널찍한 버튼)
  if (node.type === 'yn') {
    decisionOptionsGrid.className = 'wizard-options-grid yn-grid';
    decisionOptionsGrid.innerHTML = node.options.map((opt, idx) => `
      <button class="wizard-card-btn ${opt.type === 'yes' ? 'type-yes' : 'type-no'}" data-index="${idx}">
        <div class="yn-badge-chip ${opt.type === 'yes' ? 'chip-yes' : 'chip-no'}">
          ${opt.type === 'yes' ? '👍 YES (예)' : '👎 NO (아니오)'}
        </div>
        <div class="btn-title">${escapeHtml(opt.label || opt.text)}</div>
        <div class="btn-subtitle">${escapeHtml(opt.subLabel || '')}</div>
      </button>
    `).join('');
  } else {
    decisionOptionsGrid.className = 'wizard-options-grid';
    decisionOptionsGrid.innerHTML = node.options.map((opt, idx) => `
      <button class="wizard-card-btn" data-index="${idx}">
        <div class="btn-title" style="justify-content: space-between; width: 100%;">
          <span>${escapeHtml(opt.label || opt.text)}</span>
          <span style="font-size: 1.1rem; color: var(--primary);">➔</span>
        </div>
        ${opt.subLabel ? `<div class="btn-subtitle">${escapeHtml(opt.subLabel)}</div>` : ''}
      </button>
    `).join('');
  }

  decisionOptionsGrid.querySelectorAll('.wizard-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      handleOptionSelect(node.options[idx]);
    });
  });

  renderTreeHistory();
}

function handleOptionSelect(option) {
  const rawText = option.label || option.text || '선택';
  const historyText = rawText.split('(')[0].trim();
  state.treeHistory.push(historyText);

  // 최종 조합 덱이 준비된 경우
  if (option.cards && option.cards.length > 0) {
    showComboDeck(option);
  } else if (option.result) {
    // 단일 결과만 있는 경우에도 연관 시나리오 조합 덱 구성
    const fallbackCards = [option.result];
    const targetScenario = VIBE_SCENARIOS.find(s => s.id === option.result);
    if (targetScenario && targetScenario.combos) {
      fallbackCards.push(...targetScenario.combos);
    }
    showComboDeck({
      ...option,
      cards: fallbackCards,
      comboDeckTitle: option.comboDeckTitle || `✨ [${targetScenario?.title || '맞춤'}] 추천 프로젝트 조합`
    });
  } else if (option.next) {
    renderDecisionNode(option.next);
  }
}

function renderTreeHistory() {
  if (!treeHistory) return;
  treeHistory.innerHTML = state.treeHistory.map((item, idx) => {
    const isCurrent = idx === state.treeHistory.length - 1;
    return `<span class="history-item ${isCurrent ? 'current' : ''}">${escapeHtml(item)}</span>`;
  }).join(' ➔ ');
}

// --------------------------------------------------------------------------
// 질문 완료 시: 다양한 추천 조합 카드 덱 쇼케이스
// --------------------------------------------------------------------------
function showComboDeck(option) {
  questionBox.style.display = 'none';
  comboDeckBox.style.display = 'block';

  if (comboDeckTitle) {
    comboDeckTitle.textContent = option.comboDeckTitle || '✨ 선택하신 조건으로 만들 수 있는 추천 프로젝트 조합';
  }

  const cardIds = option.cards || [];
  const scenarios = cardIds.map(id => VIBE_SCENARIOS.find(s => s.id === id)).filter(Boolean);

  if (scenarios.length === 0) {
    comboDeckGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        추천 조합을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </div>
    `;
    return;
  }

  // 3~4개의 완성 프로젝트 카드 그리드 렌더링
  comboDeckGrid.innerHTML = scenarios.map((s, idx) => `
    <article class="project-combo-card" data-id="${s.id}">
      <div>
        <div class="card-top-row">
          <span class="card-badge-pill">${escapeHtml(s.badge || (idx === 0 ? '🏆 최적 매칭' : '✨ 추천 조합'))}</span>
          <span class="card-track-name">${escapeHtml(s.trackName)}</span>
        </div>
        <h3 class="card-project-title">${escapeHtml(s.title)}</h3>
        <p class="card-project-summary">${escapeHtml(s.summary)}</p>

        <!-- 공공 & 민간 서비스 아이디어 미니 쇼케이스 -->
        <div class="card-ideas-summary">
          <div class="idea-row">
            <span class="idea-tag-chip tag-chip-gov">🏛️ 공공</span>
            <span class="idea-text-mini">${escapeHtml(s.publicIdeas ? s.publicIdeas[0] : '행정 업무 자동화')}</span>
          </div>
          <div class="idea-row">
            <span class="idea-tag-chip tag-chip-biz">🏢 민간</span>
            <span class="idea-text-mini">${escapeHtml(s.privateIdeas ? s.privateIdeas[0] : '기업 실무 데이터 처리')}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="card-tech-pills">
          ${s.techStack.map(t => `<span class="tech-pill-mini">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="card-action-bar">
          <span style="font-size: 0.78rem; color: var(--text-dim);">클릭하여 구현 사례 & 프롬프트 보기</span>
          <span class="btn-open-detail">세부 내용 & 프롬프트 ➔</span>
        </div>
      </div>
    </article>
  `).join('');

  // 각 조합 카드 클릭 이벤트 -> 세부 개발 내용 모달 열기!
  comboDeckGrid.querySelectorAll('.project-combo-card').forEach(card => {
    card.addEventListener('click', () => {
      const scenarioId = card.getAttribute('data-id');
      const selected = VIBE_SCENARIOS.find(s => s.id === scenarioId);
      if (selected) {
        openProjectDetailModal(selected);
      }
    });
  });

  comboDeckBox.scrollIntoView({ behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// 카드 클릭 시: 세부 개발 내용 및 AI 마스터 프롬프트 모달
// --------------------------------------------------------------------------
function openProjectDetailModal(scenario) {
  state.currentResultScenario = scenario;

  modalTrackBadge.textContent = `[${scenario.trackName}]`;
  modalProjectTitle.textContent = scenario.title;
  modalProjectSummary.textContent = scenario.summary;

  // 공공 & 민간 구현 아이디어 목록 렌더링
  if (modalGovIdeas) {
    const govList = scenario.publicIdeas || ['온나라 및 행정 업무 서식 자동화', '지자체 데이터 취합 및 이상치 검증'];
    modalGovIdeas.innerHTML = govList.map(item => `
      <li>
        <span class="bullet-icon">🏛️</span>
        <span>${escapeHtml(item)}</span>
      </li>
    `).join('');
  }

  if (modalBizIdeas) {
    const bizList = scenario.privateIdeas || ['기업 ERP 전표 및 주문서 대량 병합', 'B2B 고객 관리 및 실시간 알림 파이프라인'];
    modalBizIdeas.innerHTML = bizList.map(item => `
      <li>
        <span class="bullet-icon">🏢</span>
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
        <button class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;">상세보기 ➔</button>
      </div>
    </article>
  `).join('');

  catalogGrid.querySelectorAll('.catalog-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const item = VIBE_SCENARIOS.find(s => s.id === id);
      if (item) openScenarioDetailModal(item);
    });
  });
}

function openScenarioDetailModal(item) {
  document.getElementById('detailModalTitle').textContent = item.title;
  const promptVal = item.promptTemplate.replace('{PROJECT_NAME}', '나의 프로젝트');

  document.getElementById('detailModalBody').innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <span class="track-badge ${item.track}">${escapeHtml(item.trackName)}</span>
      </div>
      <p style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 14px;">${escapeHtml(item.summary)}</p>
      
      <div class="tech-tags-list" style="margin-bottom: 18px;">
        ${item.techStack.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
      </div>

      <h4 class="panel-title">⚡ 핵심 장점 및 도입 효과</h4>
      <ul class="reason-list" style="margin-bottom: 20px;">
        ${item.pros.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
      </ul>

      <h4 class="panel-title">💻 빠른 셋업 CLI 명령어</h4>
      <pre class="code-snippet">${escapeHtml(item.cliCommand || '설정 필요 없음')}</pre>

      <div style="display: flex; justify-content: space-between; align-items: center; margin: 24px 0 8px 0;">
        <h4 class="panel-title" style="margin: 0;">🤖 코딩 에이전트 마스터 프롬프트</h4>
        <button class="btn btn-primary" id="modalCopyPromptBtn" style="padding: 6px 14px; font-size: 0.82rem;">
          📋 프롬프트 복사
        </button>
      </div>
      <textarea class="prompt-output-box" id="modalPromptText" readonly style="height: 240px;">${escapeHtml(promptVal)}</textarea>
    </div>
  `;

  document.getElementById('modalCopyPromptBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(promptVal);
    showToast('📋 마스터 프롬프트가 클립보드에 복사되었습니다!');
  });

  openModal(promptDetailModal);
}

// ==========================================
// 6. Firestore Community Live Feed
// ==========================================
function subscribeCommunityPrompts() {
  try {
    const q = query(collection(db, 'vibestacks'), orderBy('createdAt', 'desc'));
    
    onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          ...d,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.createdAt || new Date().toISOString())
        });
      });

      state.communityPrompts = list;
      renderCommunityPrompts();
    }, (error) => {
      console.warn('Firestore 수신 상태:', error);
    });
  } catch (e) {
    console.error('Firestore 에러:', e);
  }
}

function renderCommunityPrompts() {
  let list = [...state.communityPrompts];

  if (state.communitySort === 'likes') {
    list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (state.communitySort === 'comments') {
    list.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
  }

  if (list.length === 0) {
    communityGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">
        등록된 커스텀 프롬프트가 없습니다. 상단 [💾 프롬프트 등록/공유] 버튼으로 첫 번째 지침을 공유해보세요!
      </div>
    `;
    return;
  }

  communityGrid.innerHTML = list.map(item => `
    <article class="community-card" data-id="${item.id}">
      <div>
        <div class="card-header-row">
          <span class="track-badge ${item.category || 'web'}">${escapeHtml((item.category || 'CUSTOM').toUpperCase())}</span>
          <span style="font-size: 0.8rem; color: var(--text-dim);">${formatDate(item.createdAt)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <p class="card-desc">${escapeHtml(item.summary)}</p>
        <div style="font-size: 0.82rem; color: var(--accent-cyan); margin-bottom: 14px;">
          🛠️ ${escapeHtml(item.techStack || '')}
        </div>
      </div>

      <div class="card-footer-row">
        <span style="font-size: 0.84rem; font-weight: 600; color: var(--text-muted);">
          👤 ${escapeHtml(item.author || '익명')}
        </span>
        <div style="display: flex; gap: 12px; font-size: 0.85rem; color: var(--text-dim);">
          <span>❤️ ${item.likes || 0}</span>
          <span>💬 ${(item.comments && item.comments.length) || 0}</span>
        </div>
      </div>
    </article>
  `).join('');

  communityGrid.querySelectorAll('.community-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const item = state.communityPrompts.find(p => p.id === id);
      if (item) openCommunityDetailModal(item);
    });
  });
}

function openCommunityDetailModal(item) {
  document.getElementById('detailModalTitle').textContent = `🔥 ${item.title}`;
  const comments = item.comments || [];

  document.getElementById('detailModalBody').innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.86rem; color: var(--text-dim);">
        <span>작성자: <strong>${escapeHtml(item.author || '익명')}</strong></span>
        <span>${formatDate(item.createdAt)}</span>
      </div>

      <p style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 14px;">${escapeHtml(item.summary)}</p>
      <div style="font-size: 0.88rem; color: var(--accent-cyan); margin-bottom: 16px;">
        <strong>스택:</strong> ${escapeHtml(item.techStack)}
      </div>

      ${item.cliCommand ? `
        <h4 class="panel-title">💻 CLI 명령어</h4>
        <pre class="code-snippet">${escapeHtml(item.cliCommand)}</pre>
      ` : ''}

      <div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 0 8px 0;">
        <h4 class="panel-title" style="margin: 0;">🤖 마스터 프롬프트 전문</h4>
        <button class="btn btn-primary" id="commCopyBtn" style="padding: 6px 14px; font-size: 0.82rem;">
          📋 복사하기
        </button>
      </div>
      <textarea class="prompt-output-box" id="commPromptBox" readonly style="height: 220px;">${escapeHtml(item.prompt)}</textarea>

      <div style="margin: 18px 0; display: flex; gap: 10px;">
        <button class="btn btn-secondary" id="commLikeBtn">
          ❤️ 추천해요 (${item.likes || 0})
        </button>
      </div>

      <div style="border-top: 1px solid var(--border-glass); padding-top: 18px; margin-top: 20px;">
        <h4 class="panel-title">💬 사용 후기 & 댓글 (${comments.length})</h4>
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <input type="text" id="commCommentInput" class="form-input" placeholder="이 프롬프트에 대한 피드백을 남겨주세요..." style="flex: 1;">
          <button class="btn btn-primary" id="commCommentSubmitBtn">등록</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${comments.map(c => `
            <div style="background: var(--bg-surface); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">${escapeHtml(c.author)}</div>
              <div style="font-size: 0.9rem; color: var(--text-muted);">${escapeHtml(c.text)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('commCopyBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(item.prompt);
    showToast('📋 프롬프트가 복사되었습니다!');
  });

  document.getElementById('commLikeBtn')?.addEventListener('click', async () => {
    const docRef = doc(db, 'vibestacks', item.id);
    await updateDoc(docRef, { likes: increment(1) });
    item.likes = (item.likes || 0) + 1;
    document.getElementById('commLikeBtn').textContent = `❤️ 추천해요 (${item.likes})`;
    showToast('❤️ 추천이 반영되었습니다.');
  });

  document.getElementById('commCommentSubmitBtn')?.addEventListener('click', async () => {
    const text = document.getElementById('commCommentInput').value.trim();
    if (!text) return;
    const authorName = state.currentUser ? state.currentUser.displayName : '익명';
    const newComment = { author: authorName, text: text, createdAt: new Date().toISOString() };
    
    const docRef = doc(db, 'vibestacks', item.id);
    await updateDoc(docRef, { comments: arrayUnion(newComment) });
    showToast('💬 댓글이 등록되었습니다.');
    closeModal(promptDetailModal);
  });

  openModal(promptDetailModal);
}

// ==========================================
// 7. Event Listeners
// ==========================================
function setupEventListeners() {
  // Reset / Restart Wizard
  resetTreeBtn?.addEventListener('click', () => {
    state.treeHistory = ['시작'];
    renderDecisionNode('start');
  });

  restartWizardBtn?.addEventListener('click', () => {
    state.treeHistory = ['시작'];
    renderDecisionNode('start');
    questionBox.scrollIntoView({ behavior: 'smooth' });
  });

  // Toggle Full Catalog Drawer
  toggleCatalogBtn?.addEventListener('click', () => {
    if (!fullCatalogSection) return;
    const isHidden = fullCatalogSection.style.display === 'none';
    fullCatalogSection.style.display = isHidden ? 'block' : 'none';
    toggleCatalogBtn.textContent = isHidden ? '❌ 도감 접기' : '📚 전체 도감';
    if (isHidden) {
      fullCatalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Copy Result Prompt from Modal
  copyPromptBtn?.addEventListener('click', () => {
    if (!modalPromptText) return;
    navigator.clipboard.writeText(modalPromptText.value);
    showToast('📋 마스터 프롬프트가 클립보드에 복사되었습니다!');
  });

  // Save Result to Community
  saveToCommunityBtn?.addEventListener('click', () => {
    if (!state.currentResultScenario) return;
    closeModal(detailModal);
    document.getElementById('shareTitle').value = state.currentResultScenario.title;
    document.getElementById('shareCategory').value = state.currentResultScenario.track;
    document.getElementById('shareTechStack').value = state.currentResultScenario.techStack.join(', ');
    document.getElementById('shareSummary').value = state.currentResultScenario.summary;
    document.getElementById('sharePromptContent').value = modalPromptText.value;
    document.getElementById('shareCliCommand').value = state.currentResultScenario.cliCommand;
    openModal(sharePromptModal);
  });

  // Search Input in Catalog
  scenarioSearchInput?.addEventListener('input', (e) => {
    state.searchKeyword = e.target.value;
    renderCatalog();
  });

  // Community Sort
  communitySortSelect?.addEventListener('change', (e) => {
    state.communitySort = e.target.value;
    renderCommunityPrompts();
  });

  // Modals Open
  openShareModalBtn?.addEventListener('click', () => openModal(sharePromptModal));
  openCliGuideModalBtn?.addEventListener('click', () => {
    if (cliGuideModal) openModal(cliGuideModal);
  });

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

  // Share Form Submit
  sharePromptForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('shareTitle').value.trim();
    const category = document.getElementById('shareCategory').value;
    const techStack = document.getElementById('shareTechStack').value.trim();
    const summary = document.getElementById('shareSummary').value.trim();
    const prompt = document.getElementById('sharePromptContent').value.trim();
    const cliCommand = document.getElementById('shareCliCommand').value.trim();

    try {
      await addDoc(collection(db, 'vibestacks'), {
        title,
        category,
        techStack,
        summary,
        prompt,
        cliCommand,
        author: state.currentUser ? state.currentUser.displayName : '익명',
        authorId: state.currentUser ? state.currentUser.uid : null,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp()
      });
      showToast('🎉 Firestore에 프롬프트가 성공적으로 등록되었습니다!');
      closeModal(sharePromptModal);
      sharePromptForm.reset();
    } catch (err) {
      showToast(`저장 실패: ${err.message}`, 'error');
    }
  });

  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // Google Login
  document.getElementById('googleLoginBtn')?.addEventListener('click', async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      showToast(`🎉 ${result.user.displayName || '사용자'}님 환영합니다!`);
      closeModal(authModal);
    } catch (e) {
      showToast(`로그인 오류: ${e.message}`, 'error');
    }
  });

  // Guest Login
  document.getElementById('guestLoginBtn')?.addEventListener('click', async () => {
    try {
      await signInAnonymously(auth);
      showToast('👤 게스트로 로그인되었습니다.');
      closeModal(authModal);
    } catch (e) {
      showToast(`게스트 로그인 오류: ${e.message}`, 'error');
    }
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

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
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
  themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function formatDate(dStr) {
  if (!dStr) return '';
  const d = new Date(dStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

window.addEventListener('DOMContentLoaded', initApp);
