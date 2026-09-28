# VibeStack — 초보자를 위한 바이브코딩 프로젝트 빌더

질문 7~8개에 답해 만들 프로그램의 구조 단계와 만드는 방식을 판정하고 기술 조합을 고른 뒤, Antigravity · Claude Code · Cursor에 바로 붙여 넣을 **AI 마스터 프롬프트**를 받아가는 정적 웹앱입니다. 바이브코딩 용어 100개와 자주 보는 오류 메시지 26개도 풀이합니다. 빌드 도구 없이 Vanilla HTML/CSS/JS로 동작하며, Firebase는 Hosting만 쓰고, AI 과정 구성과 MCP 서버는 Cloudflare Worker 하나(`worker/`)가 맡습니다.

---

## 주요 기능

1. **바이브코딩 기술 조합 진단** (`diagnosis.js` 규칙 기반)
   - 만들 것, 사용자, 저장, 로그인, 외부 데이터, AI 기능, 망 환경, 제작 방식을 고르면 AI 바이브코딩 과정 보드의 두 축(구조 단계 S1~S5 × 만드는 방식)으로 판정합니다.
   - 고른 제작 방식이 조건에 맞지 않으면 이유와 대안 방식을 함께 보여 줍니다.
   - 추천 기술 조합, 주의할 점, 복사할 수 있는 시작 프롬프트, 관련 교육 모듈(`/vibecoding/#m=모듈ID`로 연결), 비슷한 실무 시나리오 4개를 보여 줍니다.
2. **전체 시나리오 도감** — 6개 트랙(공공·행정, 오피스, 데스크톱, 웹, 브라우저·크롤러, AI 에이전트)의 실무 시나리오 전체를 검색할 수 있습니다.
3. **바이브코딩 용어·오류 메시지 사전** (`glossary-data.js`)
   - 용어 100개를 10개 분류(언어·실행, 웹 기본, 데이터 형식, 연결·API, 저장·로그인, 배포, 버전관리, 개발 도구, AI 연결, 보안·운영)로 나눕니다.
   - 용어를 누르면 뜻, 언제 나오나, AI에게 이렇게 말하기(복사 가능), 함께 볼 용어, 관련 교육 모듈을 보여 줍니다.
   - 오류 메시지 26개는 어디서 보이나, 뜻, 먼저 확인할 것, AI에게 이렇게 말하기를 보여 줍니다.
   - 진단 결과에 나온 용어는 칩으로 연결되고, 용어표 인쇄 버튼으로 분류별 표를 인쇄할 수 있습니다.
4. **다크/라이트 테마** — 기본은 다크이며, 선택한 테마는 브라우저에 저장됩니다. 세 페이지가 같은 설정을 씁니다.
5. **AI 업무활용 교육과정 설계 보드 (`/curriculum/`)** — 상단 메뉴의 "AI 업무활용 과정"으로 이동하는 별도 페이지입니다.
   - 업무 영역(리서치·문서·콘텐츠·데이터·업무처리) × AI 활용 방법(L1 대화형 ~ L4 구축형) 매트릭스에 역량 모듈 79개(실습 예시 563개)를 배치합니다. 세로축은 난이도가 아니라 쓰는 방법입니다(L1 범용 AI 대화창 안에서, L2 대화창 밖 전용 AI 서비스, L3 AI가 짜준 코드 실행, L4 코딩에이전트로 구축).
   - 직무·난이도·망 환경(폐쇄망/외부망)·도구·검색어로 모듈을 거르고, 모듈마다 산출물, 공공·민간 적용 사례, 실습 예시를 보여줍니다.
   - L2 위임형 모듈은 대부분 외부망 전용이며, 폐쇄망에서 대신 쓸 모듈(로컬 챗 지식 베이스, L3·L4)로 이어지는 링크가 있습니다.
   - 과정표 빌더에 모듈을 담아 일차·오전/오후로 배치하고, 실습 예시를 골라 텍스트 복사·인쇄할 수 있습니다. 과정표는 그 브라우저에만 저장됩니다.

6. **AI 바이브코딩 교육과정 설계 보드 (`/vibecoding/`)** — 상단 메뉴의 "AI 바이브코딩 과정"으로 이동합니다.
   - 만드는 방식(챗 AI 결과물 · 앱 생성 서비스 · 에이전트 서비스 · 코딩에이전트) × 구조 단계(S1 로컬 실행 · S2 프론트엔드 배포 · S3 외부 데이터 연결 · S4 백엔드·DB·로그인 · S5 AI 기능 연결) 매트릭스에 역량 모듈 71개(실습 예시 498개)를 배치합니다.
   - 모듈 카드마다 구성도를 그립니다. 외부 서비스(LLM API·공개 API·클라우드 DB) · 박스 안(내 PC·서버·서비스 안) · 사용자·화면(아무 글·음성·파일) 3열에 번호 붙은 화살표로 요소 조합을 보여 줍니다.
   - 대상(입문자·현업·강사·전산·개발) 필터와 난이도, 폐쇄망 대안, 관련 바이브코딩 시나리오를 함께 보여줍니다.

---

## 파일 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 화면 마크업과 모달 |
| `style.css` | 디자인 시스템(ssjsite 애플 다크 톤: 토큰·타이포·컴포넌트, 애니메이션 없음) |
| `app.js` | 진단 화면, 시나리오 도감, 용어·오류 사전 화면 |
| `diagnosis.js` | 진단 질문과 판정 규칙(구조 단계·만드는 방식·기술 조합·주의점·프롬프트·관련 모듈·시나리오) |
| `glossary-data.js` | 바이브코딩 용어 100개·오류 메시지 26개 **원본 데이터** (직접 수정) |
| `curriculum/index.html` | AI 업무활용 교육과정 설계 보드 페이지 (`/curriculum/`) |
| `curriculum/board.js` | 두 교육과정 보드가 함께 쓰는 공용 엔진(매트릭스·필터·과정표 빌더) |
| `curriculum/ai-planner.js` | AI 과정 구성: 조건 입력, 프롬프트 조립, Worker `/ai` 호출, 응답 검사 |
| `curriculum/ai-config.js` | AI 과정 구성이 부르는 Worker 주소 |
| `curriculum/axes.js`, `vibecoding/axes.js` | 보드별 가로·세로축, 대상 직무 설정 (보드 화면과 MCP 서버가 함께 읽음) |
| `worker/` | Cloudflare Worker. `/mcp` 교육과정 데이터 MCP 서버(읽기 전용), `/ai` OpenRouter 중계 |
| `tests/mcp-worker.test.mjs` | MCP 서버 도구 검사 (`node tests/mcp-worker.test.mjs`) |
| `vibecoding/index.html` · `vibecoding.js` | AI 바이브코딩 교육과정 설계 보드 페이지(`/vibecoding/`)와 축 설정 |
| `vibecoding/data.js` | 바이브코딩 역량 모듈 71개(구성도 포함)·후보 6개·예시 과정 4개 **원본 데이터** (직접 수정) |
| `curriculum/curriculum.js` · `curriculum.css` | 보드 로직(매트릭스·필터·과정표 빌더)과 보드 전용 스타일. 토큰·헤더·버튼은 `style.css`를 같이 씀 |
| `curriculum/data.js` | 역량 모듈 79개·추가 후보 8개·예시 과정 4개 **원본 데이터** (직접 수정) |
| `docs/ai-curriculum-board.md` | 교육 설계 보드의 축·모듈 설계 기록 |
| `build-scenarios.js` | **시나리오와 의사결정 트리의 원본** (Node 스크립트) |
| `scenarios-data.js` | `build-scenarios.js`가 생성하는 파일. **직접 수정하지 마세요** |
| `firebase.json` / `.firebaserc` | Firebase Hosting 설정과 프로젝트 연결 (`ag-firebase-board-2026`) |
| `firestore.rules` | Firestore 보안 규칙 (사이트가 Firestore를 쓰지 않으므로 전부 차단) |
| `tests/firestore-rules.test.mjs` | 보안 규칙 에뮬레이터 테스트 (전부 차단되는지 11개 케이스) |
| `.github/workflows/` | Firebase Hosting 자동 배포 (main → 운영, PR → 미리보기) |
| `CLAUDE.md` | Claude Code 작업 규칙 (로컬·클라우드 세션 공용) |

### 교육과정 모듈 추가·수정

`curriculum/data.js`의 `MODULES` 배열을 직접 고칩니다. 필드는 파일 상단 주석에 정리되어 있습니다(`d` 업무 영역 `O·R·D·C·A·P`, `l` 수준 1~4, `g` 난이도 1~5, `n` 망 환경 `E·B·I`, `kw` 검색 키워드, L2 모듈의 `alt` 폐쇄망 대안). 모듈 이름은 업무 결과물 중심으로 짓고 도구·라이브러리 이름은 `s` 태그와 실습 예시에만 씁니다. 히어로의 숫자와 매트릭스는 데이터에서 자동으로 계산됩니다.

### 용어·오류 메시지 추가·수정

`glossary-data.js`의 `TERMS`·`ERRORS` 배열을 직접 고칩니다. 필드는 파일 상단 주석에 있습니다. `rel`에는 다른 용어의 `t` 값을, `m`에는 `vibecoding/data.js`의 모듈 id를 적습니다. `alias`는 진단 결과 문장에서 용어를 찾을 때 씁니다.

### 시나리오 추가·수정

`build-scenarios.js`의 `SCENARIOS` 배열을 수정한 뒤 다시 생성합니다. 도감 제목과 히어로의 숫자는 데이터 개수에서 자동으로 계산됩니다.

```bash
node build-scenarios.js
```

---

## AI 과정 구성 (Worker `/ai` → OpenRouter)

두 교육과정 보드의 [AI로 과정 구성]은 기관·직무·기간·망 환경·수준·업무 문제를 받아 과정표 초안을 만듭니다. 브라우저는 Cloudflare Worker의 `/ai`만 부르고, Worker가 OpenRouter 키로 모델을 부릅니다. 키는 브라우저로 내려오지 않습니다.

- 1차 호출: 설계 규칙, 예시 과정, 조건에 맞춰 거른 모듈 목록(한 줄씩), 조건을 넣고 일차·오전·오후 배치를 JSON으로 받습니다. 코드가 모듈 id·망 환경·일수를 검사하고 틀리면 한 번 다시 묻습니다.
- 2차 호출: 고른 모듈의 실습 예시만 넣고 모듈별 예시 2~3개와 맞춤 실습 한 줄을 받습니다.
- `/ai`가 응답하지 않으면 [프롬프트 복사]로 다른 챗 AI에서 구성하고 응답 JSON을 붙여 넣어 같은 검사를 거칩니다.
- `/ai` 보호: 허용한 사이트 주소(운영·PR 미리보기·로컬)에서 온 요청만 받고, 모델은 Worker 설정으로 고정하며, 요청 크기와 출력 길이에 상한을 둡니다. IP당 분당 호출 수 제한(`AI_LIMITER`)도 둡니다.

처음 한 번 준비:

1. OpenRouter에서 API 키를 만들고 키 설정에서 **크레딧 한도**(예: 월 10달러)를 겁니다.
2. GitHub 저장소 Settings → Secrets and variables → Actions에 `OPENROUTER_API_KEY`로 키를 등록합니다. Worker를 배포할 때 워크플로가 Worker 비밀값으로 넣습니다. 등록한 뒤 Actions 탭에서 **Deploy Cloudflare Worker → Run workflow**를 한 번 누릅니다. (Cloudflare 대시보드 Worker 설정의 Variables and Secrets에 직접 넣어도 됩니다.)
3. 모델을 바꾸려면 `worker/wrangler.toml`의 `OPENROUTER_MODEL`을 고치고 `main`에 머지합니다.

## MCP 서버 (교육과정 데이터)

다른 사람이 Claude·ChatGPT·Cursor 같은 AI 앱에서 두 보드의 모듈, 실습 예시, 예시 과정, 용어 사전을 불러 쓸 수 있도록 원격 MCP 서버를 둡니다. Cloudflare Worker 하나에서 `/mcp` 경로로 동작하며 읽기 전용입니다. 데이터는 배포할 때 사이트와 같은 파일(`curriculum/data.js` 등)을 묶어 넣으므로 따로 관리할 복사본이 없습니다.

| 도구 | 하는 일 |
|---|---|
| `design_course` | 사용자 요청 문장("조달청 3일 AI 과정, 내부망")을 그대로 받아 기간·인터넷 사용 여부·경험·목표·직무·주제를 읽고 과정을 한 번에 설계(교육 내용·실습 과제·표·과정표 링크, 해석 결과 `understood`) |
| `search_modules` | 관련도 순 모듈 검색. 보드·열·행·난이도·직무·도구·망 환경으로 거르기 |
| `get_module` | 모듈 상세(실습 예시·사례·폐쇄망 대안·다음 단계). `ids`로 여러 개를 한 번에 |
| `find_practices` | 실습 예시·공공·민간 사례를 주제로 검색 |
| `get_design_guide` | 축 기준(L1~L4, S1~S5), 난이도·망 표기, 과정 배치 원칙, 수준 정의 |
| `get_matrix` | 보드 축 정의와 칸별 모듈 목록 |
| `list_presets` | 예시 과정 배치 |
| `check_course` | 과정표 초안 검사(없는 id, 망 환경, 중복, 빈 칸, 일수)와 보드 링크 |
| `lookup_term` | 바이브코딩 용어·오류 메시지 사전 |
| `recommend_stack` | 메인 페이지와 같은 규칙으로 스택 진단 |

MCP를 쓰는 사람은 사이트 용어(L1, S1, 모듈 id)를 모르는 상태에서 묻습니다. 그래서 과정 설계는 `design_course`가 요청 문장을 그대로 받아 한 번에 끝내고, 결과는 용어를 풀어 쓴 문장으로 돌려줍니다. `design_course`, `check_course`, `list_presets`가 돌려주는 `board_url`(`/curriculum/#plan=R1,D1;O6/D2;A1&name=과정이름`)을 열면 그 과정표가 보드 빌더에 담깁니다. 일차는 `/`, 오전·오후는 `;`, 모듈은 `,`로 나눕니다.

처음 한 번 배포 준비:

1. Cloudflare 무료 계정을 만들고, 대시보드 **My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" 템플릿**으로 토큰을 만듭니다.
2. GitHub 저장소 Settings → Secrets and variables → Actions에 `CLOUDFLARE_API_TOKEN`(방금 만든 토큰), `CLOUDFLARE_ACCOUNT_ID`(Cloudflare 대시보드 오른쪽의 Account ID)를 등록합니다.
3. Actions 탭에서 **Deploy Cloudflare Worker → Run workflow**를 누릅니다. 이후에는 `main`에서 데이터 파일이 바뀌면 자동으로 다시 배포됩니다.
4. 배포되면 주소는 `https://vibestack.<계정 하위 도메인>.workers.dev/mcp`입니다.

사용하는 쪽은 AI 앱의 커넥터(원격 MCP 서버) 추가 화면에 위 주소를 넣습니다. 접근을 제한하려면 Worker에 비밀값을 넣습니다(`cd worker && npx wrangler secret put MCP_TOKEN`). 그러면 `Authorization: Bearer <키>` 헤더나 주소 끝 `?key=<키>`가 있는 요청만 받습니다.

로컬 확인: `cd worker && npx wrangler dev`로 띄우고 `http://127.0.0.1:8787/mcp`에 MCP 클라이언트로 연결합니다. 도구 검사는 `node tests/mcp-worker.test.mjs`입니다.

## 로컬 실행

ES 모듈을 쓰므로 `index.html`을 파일로 직접 열면 동작하지 않습니다. 정적 서버로 여세요.

```bash
npx serve .
```

---

## Firestore 보안 규칙

예전에는 프롬프트 공유 갤러리가 `vibestacks` 컬렉션을 썼지만 갤러리를 없앴습니다. 지금 사이트는 Firestore와 Authentication을 쓰지 않고, `firestore.rules`는 모든 읽기·쓰기를 막습니다. 예전 데이터는 DB에 남아 있지만 사이트에서 읽지 않습니다.

규칙을 바꾸면 에뮬레이터 테스트를 먼저 통과시킵니다(Java 21 필요). 테스트는 `demo-` 프로젝트 ID로만 실행되며 운영 DB에는 접속하지 않습니다.

```bash
firebase emulators:exec --only firestore --project demo-vibestack "node tests/firestore-rules.test.mjs"
```

---

## 배포

### 자동 배포 (GitHub Actions)

- `main` 브랜치에 push → Firebase Hosting 운영 채널에 배포
- PR 생성·갱신 → 미리보기 채널에 배포하고 URL을 PR 코멘트로 남김

처음 한 번, 배포용 서비스 계정 키를 저장소 Secret `FIREBASE_SERVICE_ACCOUNT_AG_FIREBASE_BOARD_2026`으로 등록해야 합니다. Secret이 없으면 워크플로는 경고만 남기고 배포를 건너뜁니다. 서비스 계정 생성과 Secret 등록은 Firebase CLI가 한 번에 처리합니다.

```bash
firebase init hosting:github
```

저장소를 물으면 `cdsassj00/vibestack`을 입력하고, 워크플로 파일을 덮어쓸지 물으면 **No**를 고릅니다(이미 이 저장소에 들어 있습니다). 등록이 끝나면 GitHub의 **Actions → Deploy to Firebase Hosting on merge → Run workflow**로 바로 배포할 수 있습니다.

### 수동 배포

Firestore 보안 규칙은 자동 배포 대상이 아니므로 바꿀 때마다 직접 배포합니다.

```bash
firebase deploy --only firestore:rules
```

Hosting을 수동으로 배포하려면 `firebase deploy --only hosting`을 실행합니다.
