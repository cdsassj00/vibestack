/**
 * AI 업무활용 교육과정 설계 보드 — 업무 영역 × AI 활용 방법
 * 화면 동작은 ./board.js 공용 엔진이 맡고, 여기서는 축·직무·데이터 설정만 넘긴다.
 */
import { initBoard } from './board.js';
import { MODULES, CANDIDATES, PRESETS } from './data.js';

initBoard({
  modules: MODULES,
  candidates: CANDIDATES,
  presets: PRESETS,
  heroPreset: 'intro',
  storageKey: 'aiboard.v2',
  courseName: '생성형 AI 업무활용 교육과정',
  colAxisName: '업무 영역',
  rowAxisName: 'AI 활용 방법',
  base: { key: 'O', label: '공통 기반·프로젝트' },
  cols: {
    O: ['공통 기반', 'LLM 기본기·프롬프트·보안·개발환경·프로젝트'],
    R: ['리서치·지식검색', '정보 탐색, 근거 비교, 문서 검색·질의응답'],
    D: ['문서 작성·편집', '기안·보고·회의록·양식·요약'],
    C: ['콘텐츠 제작', '이미지·영상·음성·슬라이드·인포그래픽'],
    A: ['데이터 분석', 'Excel·통계·시뮬레이션·대시보드'],
    P: ['업무처리·연계', '파일·입력·알림·신청·시스템 연계']
  },
  colOrder: ['R', 'D', 'C', 'A', 'P'],
  rowPrefix: 'L',
  rows: {
    1: ['대화형', 'AI 대화창에서 묻고 맡기기', 'ChatGPT·Gemini·Claude, 기관·로컬 LLM 챗. 첨부·프로젝트·딥리서치·에이전트 모드·커넥터까지 대화창 안의 기능'],
    2: ['위임형', '전용 AI 서비스에 맡기기', 'NotebookLM·릴리스·다글로·Gamma·Genspark·Manus·브라우저 에이전트·앱 생성 서비스·오피스 내장 AI 등 대화창 밖의 목적별 서비스. 대부분 외부망 전용'],
    3: ['제작형', 'AI가 짜준 코드로 도구 만들기', 'VBA·Python·PowerShell·CMD·HTML·JS·Apps Script'],
    4: ['구축형', '에이전트·시스템을 직접 구축', '코딩에이전트, 배포(Netlify·Cloudflare·Supabase), RAG·MCP, 로컬 LLM, 폐쇄망 위임형 에이전트']
  },
  rowOrder: [1, 2, 3, 4],
  closedNote: { 2: '폐쇄망에서는 전용 AI 서비스 대부분을 쓸 수 없습니다.' },
  tracks: { '공': '전 직원 공통', '서': '서무·총괄', '정': '정책·제도', '재': '기획·예산·재무', '홍': '홍보·대변인', '민': '민원·현장', '연': '연구·R&D', '전': '정보화·전산' },
  universalTrack: '공',
  featured: ['ChatGPT', 'Claude', 'Gemini', 'NotebookLM', 'Perplexity', 'Genspark', 'Google AI Studio', 'Google Stitch', 'Lovable', 'VBA', 'Python', 'PowerShell', 'CMD', 'HTML·JS', 'Apps Script', 'Power Query', 'Netlify', 'Cloudflare', 'Vercel', 'Supabase', 'Firebase', 'Flask·SQLite', 'Ollama', 'LM Studio', 'OpenCode', 'RAG', 'MCP', 'HWPX', 'Whisper', 'n8n', 'Claude Code', 'Codex', 'Antigravity', 'Tauri']
});
