/**
 * 화면 언어 선택 (한국어 기본, 영어는 ?lang=en 또는 저장한 선택)
 * 데이터 파일은 한국어가 원본이고, 영어는 *.en.js 덮어쓰기 파일에 id별로 둔다(docs/translation-guide.md).
 * Worker도 데이터 파일을 읽으므로 이 파일은 브라우저에서만 import한다.
 */
const KEY = 'app_lang';

function detect() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'ko') { localStorage.setItem(KEY, q); return q; }
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'ko';
  } catch (e) {
    return 'ko';
  }
}

export const LANG = detect();
export const EN = LANG === 'en';

// 한국어 문자열과 영어 문자열 중 현재 언어 쪽을 고른다
export const L = (ko, en) => (EN ? en : ko);

// 언어를 바꾸고 다시 연다. 주소의 lang 값도 맞춘다
export function setLang(lang) {
  try { localStorage.setItem(KEY, lang); } catch (e) { /* 저장 못 해도 주소로 바뀐다 */ }
  const u = new URL(location.href);
  if (lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
  location.href = u.toString();
}

// data-i18n="키" 가 붙은 요소의 글자를 사전으로 바꾼다. data-i18n-attr="title,aria-label" 이면 그 속성도 바꾼다
export function applyDict(dict, root = document) {
  if (!EN) return;
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const v = dict[el.getAttribute('data-i18n')];
    if (v == null) return;
    const attrs = (el.getAttribute('data-i18n-attr') || '').split(',').filter(Boolean);
    if (attrs.length) attrs.forEach(a => el.setAttribute(a, v));
    else el.innerHTML = v;
  });
}

// 헤더의 언어 전환 버튼 (한국어 화면에서는 EN, 영어 화면에서는 한국어)
export function mountLangButton(before) {
  if (!before) return;
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn btn-secondary btn-sm lang-btn';
  b.textContent = EN ? '한국어' : 'EN';
  b.title = EN ? '한국어로 보기' : 'View in English';
  b.setAttribute('lang', EN ? 'ko' : 'en');
  b.addEventListener('click', () => setLang(EN ? 'ko' : 'en'));
  before.before(b);
}
