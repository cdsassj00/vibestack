/*
 * 서비스 선택 메뉴 공용 목록
 * VibeStack 세 페이지와 강의안 지도(별도 사이트)가 이 파일 하나를 불러 메뉴를 그린다.
 * 메뉴 항목·주소·이름을 바꿀 때는 이 파일만 고친다.
 *
 * 쓰는 법: <nav class="site-switch" aria-label="서비스 선택" data-site-nav="현재 항목 id">
 *          <script src="https://ag-firebase-board-2026.web.app/shared/site-nav.js" defer></script>
 *   - data-variant="plain" 이면 짧은 이름만 글자로 넣는다(강의안 지도처럼 .ss-full/.ss-short 스타일이 없는 곳).
 *   - 주소에 ?lang=en 이 있거나 <html lang="en"> 이면 영어 이름을 쓰고, 링크에도 lang=en 을 붙여 넘긴다.
 *     (VibeStack 페이지는 head의 짧은 스크립트가 저장한 언어 선택을 읽어 <html lang>을 먼저 맞춘다)
 *   - 다른 사이트는 이 파일을 못 불러올 때를 대비해 nav 안에 기본 링크를 둔다. 불러오면 이 목록으로 바뀐다.
 */
(function () {
  var HOME = 'https://ag-firebase-board-2026.web.app';
  // path가 있는 항목은 VibeStack 안의 주소, url은 다른 사이트 주소
  var ITEMS = [
    { id: 'stack', path: '/', ko: ['바이브코딩 스택', '스택 추천'], en: ['Vibe Coding Stack', 'Stack'] },
    { id: 'vibe', path: '/vibecoding/', ko: ['AI 바이브코딩 과정', '바이브 과정'], en: ['AI Vibe Coding Course', 'Vibe Course'] },
    { id: 'work', path: '/curriculum/', ko: ['AI 업무활용 과정', '업무 AI 과정'], en: ['AI at Work Course', 'Work AI'] },
    { id: 'lecture', url: 'https://ai-lecture-iota.vercel.app/', ko: ['강의안 지도', '강의안'], en: ['Lecture Map', 'Lectures'] },
    { id: 'browser', path: '/browser/stack/', ko: ['브라우저 능력 사전', '브라우저'], en: ['Browser Capabilities', 'Browser'] },
    { id: 'motion', path: '/motion/', ko: ['모션·영상 능력 사전', '모션'], en: ['Motion & Video Capabilities', 'Motion'] }
  ];

  var langParam = new URLSearchParams(location.search).get('lang') === 'en';
  var en = langParam || /^en/i.test(document.documentElement.lang || '');
  // 이 파일을 같은 주소에서 불러왔으면 VibeStack 안(운영·미리보기·로컬)이므로 상대 주소로 이동한다
  var me = document.currentScript;
  var inHome = !!me && new URL(me.src, location.href).origin === location.origin;

  function href(it) {
    var u = it.url || (inHome ? it.path : HOME + it.path);
    if (!en) return u;
    return u + (u.indexOf('?') < 0 ? '?' : '&') + 'lang=en';
  }

  function render(nav) {
    var cur = nav.getAttribute('data-site-nav');
    var plain = nav.getAttribute('data-variant') === 'plain';
    var frag = document.createDocumentFragment();
    ITEMS.forEach(function (it) {
      var name = en ? it.en : it.ko;
      var a = document.createElement('a');
      a.href = href(it);
      a.title = name[0];
      if (it.url) a.className = 'ss-ext';
      if (it.id === cur) a.setAttribute('aria-current', 'page');
      if (plain) {
        a.textContent = name[1];
      } else {
        var full = document.createElement('span');
        full.className = 'ss-full';
        full.textContent = name[0];
        var short = document.createElement('span');
        short.className = 'ss-short';
        short.textContent = name[1];
        a.appendChild(full);
        a.appendChild(short);
      }
      frag.appendChild(a);
    });
    nav.replaceChildren(frag);
  }

  function run() {
    document.querySelectorAll('nav[data-site-nav]').forEach(render);
  }

  window.SITE_NAV = ITEMS;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
