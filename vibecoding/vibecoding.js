/**
 * AI 바이브코딩 교육과정 설계 보드 — 만드는 방식 × 구조 단계
 * 화면 동작은 /curriculum/board.js 공용 엔진이 맡고, 여기서는 축·대상·데이터 설정만 넘긴다.
 */
import { initBoard } from '../curriculum/board.js';
import { VIBE_SCENARIOS } from '../scenarios-data.js';
import { MODULES, CANDIDATES, PRESETS } from './data.js';

const scenarioTitle = Object.fromEntries(VIBE_SCENARIOS.map(s => [s.id, s.title]));

initBoard({
  modules: MODULES,
  candidates: CANDIDATES,
  presets: PRESETS,
  heroPreset: 'intro',
  storageKey: 'vibeboard.v1',
  courseName: '생성형 AI 바이브코딩 교육과정',
  colAxisName: '만드는 방식',
  rowAxisName: '구조 단계',
  base: { key: 'O', label: '공통 기반·프로젝트' },
  cols: {
    O: ['공통 기반', '개발환경·작업 지시·Git·키 관리·보안·프로젝트'],
    C: ['챗 AI 결과물', '아티팩트·캔버스로 바로 만들기'],
    G: ['앱 생성 서비스', 'Lovable·Replit·Bolt·v0·Base44·Firebase Studio'],
    N: ['에이전트 서비스', 'Manus·Genspark 등에 맡기기'],
    K: ['코딩에이전트', 'Claude Code·Codex·Antigravity·Cursor']
  },
  colOrder: ['C', 'G', 'N', 'K'],
  rowPrefix: 'S',
  rows: {
    1: ['로컬 실행', '내 PC에서 열어 쓰기', 'HTML 더블클릭, python -m http.server, npx serve, 로컬 스크립트'],
    2: ['프론트엔드 배포', '주소로 공유하기', 'Netlify, Cloudflare Pages, GitHub Pages, Firebase Hosting, 내부망 서버'],
    3: ['외부 데이터 연결', '공개 API·RSS·키 필요한 API', 'fetch, CORS, 서버리스 함수로 키 보관'],
    4: ['백엔드·DB·로그인', '여러 사람이 저장·조회', 'Supabase, Firebase, Cloudflare D1, 구글 시트, Flask·SQLite'],
    5: ['AI 기능 연결', 'LLM·RAG·MCP 붙이기', '서버 경유 LLM API, 컨텍스트 주입, RAG, MCP 사용·제작']
  },
  rowOrder: [1, 2, 3, 4, 5],
  tracks: { '공': '전체 공통', '초': '입문자(비개발)', '현': '현업 담당자', '강': '강사·교육 설계자', '전': '전산·IT 담당', '개': '개발 경험자' },
  universalTrack: '공',
  featured: ['Claude 아티팩트', 'ChatGPT 캔버스', 'Gemini 캔버스', 'Google AI Studio', 'Google Stitch', 'Lovable', 'Replit', 'Bolt', 'v0', 'Base44', 'Firebase Studio', 'Manus', 'Genspark', 'Claude Code', 'Codex', 'Antigravity', 'Cursor', 'HTML·JS', 'Python', 'PowerShell', 'GitHub', 'Netlify', 'Cloudflare', 'Vercel', 'Supabase', 'Firebase', 'Apps Script', 'Flask·SQLite', 'MCP', 'RAG', 'Ollama'],
  related: m => (m.sc || []).map(id => scenarioTitle[id]).filter(Boolean)
});
