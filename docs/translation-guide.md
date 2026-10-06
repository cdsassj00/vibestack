# English translation guide (VibeStack)

The English version is for **overseas training managers and general users** who do not know the Korean public sector. Translate the meaning, not the words, and add short context where a Korean-specific idea would otherwise be unclear.

The Korean source stays the original. English text lives in separate overlay files keyed by the same ids, so the board, links (`#m=`, `#plan=`) and the MCP server keep working unchanged.

## Style

- Plain, concrete, short sentences. Present tense. Use "you" for instructions.
- No exclamation marks, no hype words (perfect, ultimate, blazing, revolutionary, 100%).
- No metaphors or literary phrasing in titles or descriptions. Titles name the function or the subject.
- Sentence case for titles ("Document drafting and summarizing", not "Document Drafting And Summarizing").
- US spelling. Use "AI", "LLM", "API" as is.
- Keep product and library names exactly (ChatGPT, Claude Code, NotebookLM, Supabase, Ollama, HWPX, VBA, Apps Script).
- Keep length close to the Korean. Short labels must stay short (matrix cell names `st`: 22 characters or fewer; flow-diagram node names: 16 characters or fewer).

## Korean context: how to carry it over

Keep the Korean examples (they are the point of the site) but make them understandable. Prefer a short clarifying phrase over a footnote.

| Korean | English to use |
|---|---|
| 폐쇄망, 내부망, 망분리 | air-gapped network / internal network (Korean public agencies keep work PCs on a network separated from the internet) — explain once per module at most, then just "air-gapped" |
| 외부망 | internet-connected network |
| 외부망 필요 | Internet required |
| 폐쇄망 대안 있음 | Air-gapped alternative available |
| 외부망 준비 후 폐쇄망 반입 | Prepare online, then bring into the air-gapped network |
| 반입 (승인) | bring in (with security approval) |
| 행정망 | government administrative network |
| 공공기관 | public agency / public institution |
| 지자체, 시청, 구청, 도청 | local government, city hall, district office, provincial government |
| 공문, 기안문 | official document, draft for approval |
| 공문체 | formal government writing style |
| 전자결재 (온나라) | e-approval system (On-Nara, the Korean government's document system) |
| 한글(HWP), HWPX | Hangul word processor (HWP), HWPX (its open XML format, the standard document format in Korean government) |
| 국가법령정보센터 | Korea's national law information portal |
| 공공데이터포털 | Korea's public data portal (data.go.kr) |
| 민원 | citizen requests / civil complaints |
| 서무 | general administration |
| 국정감사 | parliamentary audit |
| 보도자료 | press release |
| 클로바노트, 다글로 | Clova Note, Daglo (Korean speech-to-text apps) |
| 미리캔버스 | Miricanvas (a Korean design tool similar to Canva) |
| 한컴 어시스턴트 | Hancom Assistant (AI in the Hangul office suite) |
| 기관 LLM | in-house LLM (an agency's own AI chat) |
| 로컬 SLM / 로컬 LLM | local small language model / local LLM |

Board axes (keep these names consistent everywhere):

| Korean | English |
|---|---|
| AI 업무활용 교육과정 | AI at Work curriculum |
| 업무 영역: 공통 기반 · 리서치 · 문서 · 콘텐츠 · 데이터 · 업무처리 | Work area: Foundations · Research · Documents · Content · Data · Workflow |
| AI 활용 방법: 대화형 · 위임형 · 제작형 · 구축형 | AI method: Chat · Delegate · Code-run · Build |
| (설명) L1 범용 AI 대화창 안 · L2 전용 AI 서비스 · L3 AI가 짜 준 코드 실행 · L4 코딩에이전트로 구축 | L1 inside a general AI chat · L2 dedicated AI services · L3 running code the AI wrote · L4 building with coding agents |
| AI 바이브코딩 교육과정 | AI Vibe Coding curriculum |
| 만드는 방식: 공통 기반 · 챗 AI 결과물 · 앱 생성 서비스 · 에이전트 서비스 · 코딩에이전트 | Build method: Foundations · Chat AI output · App builders · Agent services · Coding agents |
| 구조 단계: 로컬 실행 · 프론트엔드 배포 · 외부 데이터 연결 · 백엔드·DB·로그인 · AI 기능 연결 | Structure stage: Run locally · Deploy front end · Connect external data · Back end, DB, login · Add AI features |
| 난이도: 입문 · 기초 · 중급 · 심화 · 프로젝트 | Level: Intro · Basic · Intermediate · Advanced · Project |
| 역량 모듈 | module |
| 실습 예시 | hands-on exercise |
| 산출물 | deliverable |
| 공공 적용 / 민간 적용 | Public sector use / Private sector use |
| 과정표 | course plan |
| 코딩에이전트 | coding agent |
| 바이브코딩 | vibe coding |

## Rules for data files

- Do not change ids, enum codes (`d`, `l`, `g`, `n`, `k`), `sc`, `alt`, numbers or array lengths. `ex`, `pub`, `pri` must keep the same number of items in the same order.
- Practice examples (`ex`) may end with the markers `(외부망)`, `(반입)`, `(신규)`. Keep these markers **exactly as written in Korean** at the end of the English text. The board turns them into translated tags.
- Flow diagrams (`fl`): keep the format `'X:node > C:node : label'` (letters X, C, U and the separators ` > ` and ` : ` stay the same).
- Case lines (`pub`/`pri`): `j` is "Organization / role" (e.g. "District office, civil affairs / Civil complaints officer"), `c` is one sentence.
- `kw`: 4–10 English search keywords.
- Output a JavaScript ES module with plain object literals, single quotes, 2-space indentation. Escape apostrophes (`don\'t`) or use double quotes for that string.
