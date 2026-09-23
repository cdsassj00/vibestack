# VibeStack — 초보자를 위한 바이브코딩 프로젝트 빌더

쉬운 질문 다섯 개로 만들고 싶은 프로그램에 맞는 기술 스택을 고르고, Antigravity · Claude Code · Cursor에 바로 붙여 넣을 **AI 마스터 프롬프트**를 받아가는 정적 웹앱입니다. 빌드 도구 없이 Vanilla HTML/CSS/JS로 동작하며, 공유 갤러리는 Firebase(Cloud Firestore · Authentication)로 운영합니다.

---

## 주요 기능

1. **5단계 스택 진단 위저드**
   - 실행 형태 → 용도 → 기능 순서로 YES/NO·선택형 질문에 답하면 추천 조합 카드 4장을 보여줍니다.
   - 카드를 누르면 공공·민간 구현 아이디어, 권장 스택과 이유, 셋업 CLI 명령어, 마스터 프롬프트를 확인하고 복사할 수 있습니다.
2. **전체 시나리오 도감** — 6개 트랙(공공·행정, 오피스, 데스크톱, 웹, 브라우저·크롤러, AI 에이전트)의 실무 시나리오 전체를 검색할 수 있습니다.
3. **실시간 프롬프트 공유 갤러리** — Firestore에 저장된 프롬프트가 실시간으로 반영되며, 추천(좋아요)과 댓글을 남길 수 있습니다.
4. **로그인** — Google, 이메일/비밀번호(회원가입 포함), 게스트(익명) 로그인을 지원합니다. 로그인하지 않아도 공유는 가능합니다.
5. **다크/라이트 테마** — 기본은 다크이며, 선택한 테마는 브라우저에 저장됩니다. 두 페이지가 같은 설정을 씁니다.
6. **AI 교육과정 설계 보드 (`/curriculum/`)** — 상단 메뉴의 "AI 교육과정"으로 이동하는 별도 페이지입니다.
   - 업무 영역(리서치·문서·콘텐츠·데이터·업무처리) × AI 활용 수준(L1 대화형 ~ L4 구축형) 매트릭스에 역량 모듈 34개를 배치합니다.
   - 직무·망 환경(폐쇄망/외부망)·도구·검색어로 모듈을 거르고, 모듈마다 공공·민간 적용 사례와 실습 예시를 보여줍니다.
   - 과정표 빌더에 모듈을 담아 일차·오전/오후로 배치하고, 실습 예시를 골라 텍스트 복사·인쇄할 수 있습니다. 과정표는 그 브라우저에만 저장됩니다.

---

## 파일 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 화면 마크업과 모달 |
| `style.css` | 디자인 시스템(ssjsite 애플 다크 톤: 토큰·타이포·컴포넌트, 애니메이션 없음) |
| `app.js` | 위저드, 도감, Firestore 갤러리, Firebase Auth 로직 |
| `curriculum/index.html` | AI 교육과정 설계 보드 페이지 (`/curriculum/`) |
| `curriculum/curriculum.js` · `curriculum.css` | 보드 로직(매트릭스·필터·과정표 빌더)과 보드 전용 스타일. 토큰·헤더·버튼은 `style.css`를 같이 씀 |
| `curriculum/data.js` | 역량 모듈 34개·추가 후보 14개·예시 과정 2개 **원본 데이터** (직접 수정) |
| `docs/ai-curriculum-board.md` | 교육 설계 보드의 축·모듈 설계 기록 |
| `build-scenarios.js` | **시나리오와 의사결정 트리의 원본** (Node 스크립트) |
| `scenarios-data.js` | `build-scenarios.js`가 생성하는 파일. **직접 수정하지 마세요** |
| `firebase-config.js` | Firebase 웹 앱 설정과 SDK 초기화 |
| `firebase.json` / `.firebaserc` | Firebase Hosting 설정과 프로젝트 연결 (`ag-firebase-board-2026`) |
| `firestore.rules` | Firestore 보안 규칙 |
| `tests/firestore-rules.test.mjs` | 보안 규칙 에뮬레이터 테스트 (30개 케이스) |
| `.github/workflows/` | Firebase Hosting 자동 배포 (main → 운영, PR → 미리보기) |
| `CLAUDE.md` | Claude Code 작업 규칙 (로컬·클라우드 세션 공용) |

### 교육과정 모듈 추가·수정

`curriculum/data.js`의 `MODULES` 배열을 직접 고칩니다. 필드는 파일 상단 주석에 정리되어 있습니다(`d` 업무 영역 `O·R·D·C·A·P`, `l` 수준 1~4, `n` 망 환경 `E·B·I`). 히어로의 숫자와 매트릭스는 데이터에서 자동으로 계산됩니다.

### 시나리오 추가·수정

`build-scenarios.js`의 `SCENARIOS` 배열이나 `DECISION_TREE_V2`를 수정한 뒤 다시 생성합니다. 도감 제목과 히어로의 숫자는 데이터 개수에서 자동으로 계산됩니다.

```bash
node build-scenarios.js
```

---

## 로컬 실행

ES 모듈을 쓰므로 `index.html`을 파일로 직접 열면 동작하지 않습니다. 정적 서버로 여세요.

```bash
npx serve .
```

---

## Firestore 데이터와 보안 규칙

갤러리는 `vibestacks` 컬렉션 하나를 사용합니다.

| 필드 | 설명 |
|---|---|
| `title`, `category`, `techStack`, `summary`, `prompt`, `cliCommand` | 공유 글 본문 (`category`는 `office`·`desktop`·`gov`·`web`·`browser`·`agent` 중 하나) |
| `author`, `authorId` | 작성자 표시 이름과 uid (비로그인 작성 시 `authorId`는 `null`) |
| `likes`, `comments` | 추천 수와 댓글 배열 |
| `createdAt` | 서버 시각 |

`firestore.rules`의 핵심 규칙:

- **읽기**: 누구나 가능
- **작성**: 비로그인도 가능하지만 필드 목록·길이·카테고리를 검증하고, `authorId`는 본인 uid(비로그인은 `null`)만 허용
- **추천**: `likes`를 정확히 +1 하는 변경만 허용
- **댓글**: 기존 댓글은 그대로 두고 맨 뒤에 1개 추가하는 변경만 허용
- **본문 수정·삭제**: 로그인한 작성자 본인만 가능

규칙을 바꾸면 에뮬레이터 테스트를 먼저 통과시킵니다(Java 21 필요). 테스트는 `demo-` 프로젝트 ID로만 실행되며 운영 DB에는 접속하지 않습니다.

```bash
firebase emulators:exec --only firestore --project demo-vibestack "node tests/firestore-rules.test.mjs"
```

---

## Firebase 콘솔 설정

1. **Firestore Database** — 데이터베이스를 만든 뒤 보안 규칙은 이 저장소의 `firestore.rules`로 배포합니다.
2. **Authentication > 로그인 방법** — Google, 이메일/비밀번호, 익명을 사용 설정합니다. 꺼져 있으면 해당 로그인 버튼이 "콘솔에서 이 로그인 방식이 꺼져 있습니다" 안내를 띄웁니다.
3. **Authentication > 설정 > 승인된 도메인** — 배포 도메인(`*.web.app` 등)과 `localhost`가 등록되어 있어야 Google 로그인이 동작합니다.

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
