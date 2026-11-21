/**
 * 개발 자료 사전 공용 화면 — 파이썬 라이브러리 · 자바스크립트 라이브러리 · API 세 페이지가 함께 쓴다.
 * 페이지마다 data 모듈(CATS, ITEMS, FLAG)을 불러와 분야·조건 필터, 검색, 카드 목록을 그린다.
 *
 * 항목 필드
 *   n 이름 · c 분야 키 · d 한두 문장 설명 · u 공공업무 쓰임새 [] · i 설치·준비 한 줄 · x 짧은 사용 예
 *   l 링크 [[이름, 주소]] · f 조건 키(FLAG의 키) · t 추가 태그 []
 *   (API) p 제공 기관 · how 키 받는 법 · lim 이용 한도·주의 · s 키 없이 바로 열어 보는 요청 주소
 */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = id => document.getElementById(id);
const EXT = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

export function mountRef({ CATS, ITEMS, FLAG }) {
  const F = { c: 'all', f: 'all', q: '' };

  function chips(el, entries, key) {
    el.innerHTML = entries.map(([k, v]) =>
      `<button type="button" class="gloss-chip" data-k="${esc(k)}" aria-pressed="${F[key] === k}">${esc(v)}</button>`).join('');
    el.onclick = e => {
      const b = e.target.closest('button[data-k]');
      if (!b) return;
      F[key] = b.dataset.k;
      chips(el, entries, key);
      render();
    };
  }

  const hay = it => [it.n, it.d, ...(it.u || []), it.i, it.x, it.p, ...(it.t || []), CATS[it.c]].join(' ').toLowerCase();

  function card(it) {
    const flag = FLAG.values[it.f];
    const tags = [`<span class="ref-tag t-blue">${esc(CATS[it.c])}</span>`]
      .concat(flag ? [`<span class="ref-tag ${flag[1]}">${esc(flag[0])}</span>`] : [])
      .concat((it.t || []).map(t => `<span class="ref-tag">${esc(t)}</span>`)).join('');
    const code = (label, text) => text
      ? `<div class="ref-k">${label}</div><div class="ref-code"><pre>${esc(text)}</pre><button type="button" class="ref-copy" data-copy="${esc(text)}">복사</button></div>`
      : '';
    return `<article class="ref-card">
      <div class="ref-head"><span class="ref-name">${esc(it.n)}</span>${it.p ? `<span class="ref-sub">${esc(it.p)}</span>` : ''}</div>
      <div class="ref-tags">${tags}</div>
      <p class="ref-desc">${esc(it.d)}</p>
      ${it.u?.length ? `<div class="ref-k">공공업무에서 이렇게 씁니다</div><ul class="ref-uses">${it.u.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${it.how ? `<p class="ref-meta"><b>키 받는 법</b> ${esc(it.how)}</p>` : ''}
      ${it.lim ? `<p class="ref-meta"><b>한도·주의</b> ${esc(it.lim)}</p>` : ''}
      ${code('설치·준비', it.i)}
      ${code(it.s ? '바로 열어 보는 요청' : '사용 예', it.s || it.x)}
      ${it.s && it.x ? code('사용 예', it.x) : ''}
      <div class="ref-links">${(it.l || []).map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}${EXT}</a>`).join('')}</div>
    </article>`;
  }

  function render() {
    const q = F.q.toLowerCase();
    const list = ITEMS.filter(it => (F.c === 'all' || it.c === F.c) && (F.f === 'all' || it.f === F.f) && (!q || hay(it).includes(q)));
    $('refCount').textContent = `${list.length}개`;
    $('refGrid').innerHTML = list.length ? list.map(card).join('') : '<p class="ref-empty">조건에 맞는 항목이 없습니다. 필터를 풀거나 다른 검색어를 넣어 보세요.</p>';
  }

  chips($('refCats'), [['all', '전체'], ...Object.entries(CATS)], 'c');
  $('refFlagLabel').textContent = FLAG.label;
  chips($('refFlags'), [['all', '전체'], ...Object.entries(FLAG.values).map(([k, v]) => [k, v[0]])], 'f');
  $('refSearch').addEventListener('input', e => { F.q = e.target.value.trim(); render(); });
  $('refGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    navigator.clipboard?.writeText(b.dataset.copy).then(() => { b.textContent = '복사됨'; setTimeout(() => { b.textContent = '복사'; }, 1200); });
  });
  $('refTotal').textContent = ITEMS.length;
  render();
}

// 테마 (VibeStack 공통 키 app_theme, 기본 다크)
const SUN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
const MOON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
export function mountTheme() {
  const btn = $('themeToggleBtn');
  const apply = t => {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('app_theme', t); } catch (e) { /* 저장 못 해도 화면은 바뀐다 */ }
    btn.innerHTML = t === 'dark' ? SUN : MOON;
    btn.title = t === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
  };
  let cur = 'dark';
  try { cur = localStorage.getItem('app_theme') || 'dark'; } catch (e) { /* 기본 다크 */ }
  apply(cur);
  btn.addEventListener('click', () => apply(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
}
