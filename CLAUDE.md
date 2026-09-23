# VibeStack

AI 강사용 지침 사이트. 바이브코딩 프로젝트 빌더(`/`)와 AI 교육과정 설계 보드(`/curriculum/`) 두 페이지로 되어 있고, 헤더의 서비스 선택 메뉴(`.site-switch`)로 오간다. 빌드 도구 없는 정적 웹앱(Vanilla HTML/CSS/JS, ES 모듈)과 Firebase(Hosting, Cloud Firestore, Authentication)로 구성된다. 응답과 UI 문구는 한국어로 쓴다.

## 명령

- 로컬 실행: `npx serve .` (ES 모듈이라 `file://`로 열면 동작하지 않는다)
- 시나리오 데이터 재생성: `node build-scenarios.js` → `scenarios-data.js` 갱신
- 보안 규칙 테스트(Java 21 필요): `firebase emulators:exec --only firestore --project demo-vibestack "node tests/firestore-rules.test.mjs"`

## 배포

- `main`에 push하면 GitHub Actions가 Firebase Hosting 운영 채널에 자동 배포한다.
- PR을 열면 미리보기 채널에 배포되고 URL이 PR 코멘트로 달린다.
- `firestore.rules`는 자동 배포 대상이 아니다. 바꾸면 `firebase deploy --only firestore:rules`를 수동으로 실행해야 한다.

## 코드 규칙

- 두 페이지의 헤더 구조(브랜드 · `.site-switch` · 섹션 링크 · 테마 버튼)를 같게 유지한다. 메뉴 항목을 바꾸면 `index.html`과 `curriculum/index.html`을 함께 고친다.
- 교육과정 데이터는 `curriculum/data.js`를 직접 고친다(생성 파일 아님). 보드 스타일은 `curriculum/curriculum.css`에 두되 색은 `style.css` 토큰에서만 가져온다.
- 역량 모듈은 칸당 2~3개, 모듈당 실습 예시 5~8개, 공공·민간 적용 사례 2건씩을 기준으로 한다. 도구가 바뀌어도 이름이 유지되도록 모듈을 짓고, 기능·라이브러리 단위로 쪼개지 않는다. L2 모듈에는 폐쇄망 대안 `alt`(외부망 필요가 아닌 모듈)를 단다.
- `scenarios-data.js`는 생성 파일이다. 직접 고치지 말고 `build-scenarios.js`를 수정한 뒤 재생성한다.
- `index.html`의 id·class는 `app.js`가 참조한다. 마크업을 바꾸면 `app.js`의 `getElementById`와 템플릿 클래스를 함께 맞춘다.
- Firestore에서 온 값은 속성값까지 포함해 `escapeHtml()`을 거쳐 `innerHTML`에 넣는다.
- `firestore.rules`를 바꾸면 에뮬레이터 테스트를 먼저 통과시킨다. 앱이 저장하는 필드를 바꾸면 규칙의 필드 목록·길이 제한과 `index.html`의 `maxlength`도 함께 맞춘다.

## 디자인 규칙 (ssjsite 애플 다크 톤)

- 색·타이포는 `style.css` 상단 `:root` 토큰만 쓴다. 배경은 순수 블랙, 표면은 surf → tint → tint2 무채색 계단, 텍스트는 ink/body/mut/faint 4단계, 액센트는 iOS 블루와 골드 포인트.
- 애니메이션을 넣지 않는다. keyframes, 스크롤 리빌, 카운트업, 호버 시 이동·확대 효과를 쓰지 않고, 호버는 색·테두리 변화만 준다.
- UI에 이모지를 쓰지 않는다. 필요하면 `app.js`의 `ICONS`(SVG 라인 아이콘)나 색 칩, 색 점으로 표현한다.
- 문구는 합니다체로 짧고 담백하게 쓴다. 느낌표와 과장 표현을 피한다.
- 라이트 모드(`[data-theme="light"]`)와 모바일(640px 이하)도 함께 확인한다.
