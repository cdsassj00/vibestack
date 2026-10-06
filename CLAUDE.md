# VibeStack

AI 강사용 지침 사이트. 바이브코딩 스택 추천(`/`), AI 바이브코딩 교육과정 설계 보드(`/vibecoding/`), AI 업무활용 교육과정 설계 보드(`/curriculum/`) 세 페이지로 되어 있고, 헤더의 서비스 선택 메뉴(`.site-switch`)로 오간다. 빌드 도구 없는 정적 웹앱(Vanilla HTML/CSS/JS, ES 모듈)이고 Firebase는 Hosting만 쓴다(Firestore 규칙은 전부 차단). AI 과정 구성(`/ai`, OpenRouter 중계)과 MCP 서버(`/mcp`)는 Cloudflare Worker 하나(`worker/`)가 맡는다. 응답과 UI 문구는 한국어로 쓴다.

## 명령

- 로컬 실행: `npx serve .` (ES 모듈이라 `file://`로 열면 동작하지 않는다)
- Worker 검사: `node tests/mcp-worker.test.mjs`(MCP 도구), `node tests/ai-worker.test.mjs`(/ai 중계). 로컬 실행: `cd worker && npx wrangler dev`
- 시나리오 데이터 재생성: `node build-scenarios.js` → `scenarios-data.js` 갱신
- 보안 규칙 테스트(Java 21 필요): `firebase emulators:exec --only firestore --project demo-vibestack "node tests/firestore-rules.test.mjs"`

## 배포

- `main`에 push하면 GitHub Actions가 Firebase Hosting 운영 채널에 자동 배포한다.
- PR을 열면 미리보기 채널에 배포되고 URL이 PR 코멘트로 달린다.
- `firestore.rules`는 자동 배포 대상이 아니다. 바꾸면 `firebase deploy --only firestore:rules`를 수동으로 실행해야 한다.

## 코드 규칙

- 세 페이지의 헤더 구조(브랜드 · `.site-switch` · 섹션 링크 · 테마 버튼)를 같게 유지한다. 서비스 선택 메뉴 항목·주소·이름은 `shared/site-nav.js` 한 파일에만 둔다. 세 페이지는 빈 `<nav class="site-switch" data-site-nav="현재 id">`와 이 스크립트만 두고, 강의안 지도(별도 저장소 `cdsassj00/ai-lecure`, Vercel https://ai-lecture-iota.vercel.app/, `kg/map_template.html`)는 같은 파일을 운영 주소로 불러온다(기본 링크를 nav 안에 남겨 둠). 메뉴를 바꾸면 이 파일만 고쳐 배포한다. 항목마다 긴 이름·짧은 이름과 영어 이름을 둔다(`?lang=en`이면 영어). 항목이 많아 모든 폭에서 짧은 이름만 보이고(긴 이름은 링크 `title`), 640px 이하에서는 메뉴가 한 줄을 유지한 채 옆으로 밀린다.
- `browser/`(브라우저 능력 사전)와 `motion/`(모션·영상 능력 사전)은 Netlify(browser-senses-lab·browser-motion-lab)에서 옮겨 온 정적 사이트다. 빌드 없이 HTML을 직접 고친다. 페이지 사이 링크는 `/browser/...` 절대 주소이고, 확장자 없는 주소(`/browser/stack/br-001`)는 `firebase.json`의 `cleanUrls`로 열린다. `browser/libs/`는 오프라인 실습용 라이브러리·모델 파일이다(대부분 CDN 대체 경로가 있지만 `libs/ffmpeg`는 영상 자르기 실습에 꼭 필요). 이 두 사이트는 이 저장소가 원본이므로 Claude 채팅이나 Netlify에 따로 올리지 않는다.
- 세 페이지 헤더 맨 위(`.app-header` 첫 자식)에 https://cdsa.kr 로 가는 골드 배너 `.cdsa-banner`(높이 `--banner-h` 34px)를 둔다. 헤더가 고정이라 스크롤해도 보인다. 본문 위 여백·`scroll-margin`·고정 위치(`top`)는 `--header-h`만 쓰지 말고 `calc(var(--header-h) + var(--banner-h) + …)`로 계산한다. 배너 색은 `--banner-*` 토큰에 둔다.
- 두 교육과정 보드는 `curriculum/board.js` 공용 엔진을 쓴다. 보드별 축·대상은 `curriculum/axes.js`, `vibecoding/axes.js`에서만 바꾼다(보드 화면과 MCP 서버가 함께 읽는다). 데이터 연결·저장 키는 `curriculum/curriculum.js`, `vibecoding/vibecoding.js`에 둔다.
- `worker/`는 Cloudflare Worker다(`/mcp` 교육과정 데이터 MCP 서버, 읽기 전용). 데이터 파일을 직접 import해 배포할 때 묶으므로 데이터·축 파일은 DOM 없이 import되는 순수 모듈로 유지한다. 도구를 바꾸면 `node tests/mcp-worker.test.mjs`를 통과시킨다. MCP 사용자는 사이트 용어를 모른다. 과정 설계는 `design_course`가 요청 문장을 그대로 받아 한 번에 끝내게 하고(해석 규칙은 `parseRequest`), 도구 설명·결과는 L1·S1 같은 표기를 풀어 쓴다. 출력은 들여쓰기 없는 JSON으로 짧게 유지한다. `main`에서 Worker·데이터 파일이 바뀌면 GitHub Actions가 Worker를 배포한다(Secret `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
- AI 과정 구성은 `curriculum/ai-planner.js`(프롬프트 조립·응답 검사·대화상자)와 `curriculum/ai-config.js`(Worker 주소)에 두고, 모델 호출은 Worker `/ai`(`worker/src/ai.js`)가 OpenRouter로 중계한다. OpenRouter 키는 Worker 비밀값 `OPENROUTER_API_KEY`에만 두고 코드·브라우저에 넣지 않는다. 모델 이름은 `worker/wrangler.toml`의 `OPENROUTER_MODEL`에서 바꾼다. `/ai`는 허용한 사이트 주소에서 온 요청만 받는다. 모델이 고른 모듈 id·망 환경·일수는 `checkPlan()`으로 검사한 뒤에만 과정표에 넣는다. 프롬프트 복사·응답 붙여넣기 대체 경로를 유지한다.
- 교육과정 데이터는 `curriculum/data.js`, `vibecoding/data.js`를 직접 고친다(생성 파일 아님). 보드 스타일은 `curriculum/curriculum.css`에 두되 색은 `style.css` 토큰에서만 가져온다.
- AI 업무활용 보드의 세로축은 난이도가 아니라 방법이다(난이도는 `g`). L1·L2는 기능이 아니라 쓰는 화면으로 나눈다. ChatGPT·Gemini·Claude·기관 LLM 챗과 로컬 LLM 대화창(Ollama·LM Studio·Msty) 안의 기능(딥리서치·에이전트 모드·프로젝트·커넥터·지식 베이스)은 L1, 다른 주소나 앱을 여는 전용 서비스(NotebookLM·Gamma·Genspark·전사 앱·브라우저 에이전트·오피스 내장 AI)는 L2, AI가 준 코드를 붙여 넣어 실행하고 실행 방법을 익히는 것(코드를 직접 짜지 않음. 코랩·API·Ollama 호출 포함)은 L3, 코딩에이전트로 구축은 L4. 행 이름(대화형·위임형·제작형·구축형)은 유지한다.
- 역량 모듈은 칸당 2~3개, 모듈당 실습 예시 5~8개, 공공·민간 적용 사례 2건씩을 기준으로 한다. 도구가 바뀌어도 이름이 유지되도록 모듈을 짓고, 기능·라이브러리 단위로 쪼개지 않는다. L2 모듈에는 폐쇄망 대안 `alt`(외부망 필요가 아닌 모듈)를 단다.
- 모듈 이름이 12자를 넘으면 매트릭스 칸에 보일 짧은 이름 `st`(12자 안팎)를 단다. 매트릭스는 기본 [간단히] 보기에서 `st`만, [자세히] 보기에서 전체 이름·예시 수·도구를 보여 준다.
- AI 바이브코딩 모듈에는 구성도 `fl`(외부 X · 박스 안 C · 사용자·화면 U 3열, 화살표 3~6개)을 단다. 형식은 `vibecoding/data.js` 머리 주석을 따른다.
- 메인 페이지 진단 규칙은 `diagnosis.js`에 둔다. 모듈 id는 `vibecoding/data.js`, 시나리오 id는 `build-scenarios.js`와 맞춘다. 보드 페이지는 `#m=모듈ID`로 들어오면 해당 모듈을 열고, `#plan=일차/일차&name=`(오전·오후 `;`, 모듈 `,`)으로 들어오면 과정표에 담는다(MCP `board_url`).
- `scenarios-data.js`는 생성 파일이다. 직접 고치지 말고 `build-scenarios.js`를 수정한 뒤 재생성한다.
- 메인 페이지의 용어·오류 메시지 사전 데이터는 `glossary-data.js`를 직접 고친다. `rel`은 다른 용어의 `t` 값, `m`은 `vibecoding/data.js` 모듈 id와 맞춘다. 용어 설명도 합니다체로 짧게 쓰고 비유를 쓰지 않는다.
- `index.html`의 id·class는 `app.js`가 참조한다. 마크업을 바꾸면 `app.js`의 `getElementById`와 템플릿 클래스를 함께 맞춘다.
- 데이터 파일에서 온 문자열도 속성값까지 포함해 `escapeHtml()`을 거쳐 `innerHTML`에 넣는다.
- `firestore.rules`를 바꾸면 에뮬레이터 테스트를 먼저 통과시킨다. 다시 Firestore를 쓰게 되면 규칙과 테스트를 새로 설계한다.

## 디자인 규칙 (ssjsite 애플 다크 톤)

- 색·타이포는 `style.css` 상단 `:root` 토큰만 쓴다. 배경은 순수 블랙, 표면은 surf → tint → tint2 무채색 계단, 텍스트는 ink/body/mut/faint 4단계, 액센트는 iOS 블루와 골드 포인트.
- 애니메이션을 넣지 않는다. keyframes, 스크롤 리빌, 카운트업, 호버 시 이동·확대 효과를 쓰지 않고, 호버는 색·테두리 변화만 준다.
- UI에 이모지를 쓰지 않는다. 필요하면 `app.js`의 `ICONS`(SVG 라인 아이콘)나 색 칩, 색 점으로 표현한다.
- 문구는 합니다체로 짧고 담백하게 쓴다. 느낌표와 과장 표현(완벽, 100%, 초고속, 압도적, 차세대 등)을 피한다.
- 제목과 설명에 비유·은유·문학적 표현을 쓰지 않는다(예: "칸으로 설계합니다", "질문 다섯 개로 설계합니다"). 제목은 기능이나 대상을 그대로 적는다(예: "생성형 AI 교육과정 설계 보드", "업무 영역 × AI 활용 방법 매트릭스").
- 라이트 모드(`[data-theme="light"]`)와 모바일(640px 이하)도 함께 확인한다.
