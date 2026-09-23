/**
 * 바이브코딩 기술 조합 진단 — 규칙 기반
 * 질문 답변을 AI 바이브코딩 교육과정 보드의 두 축(만드는 방식 × 구조 단계)으로 판정하고
 * 기술 조합, 주의할 점, 시작 프롬프트, 관련 교육 모듈, 관련 시나리오를 만든다.
 * 화면 렌더링은 app.js가 맡는다.
 */

export const STAGES = {
  1: ['로컬 실행', '내 PC에서 열어 씁니다.'],
  2: ['프론트엔드 배포', '주소로 공유합니다.'],
  3: ['외부 데이터 연결', '공개 API·키 필요한 API·내부 시스템 데이터를 불러옵니다.'],
  4: ['백엔드·DB·로그인', '여러 사람이 저장하고 조회합니다.'],
  5: ['AI 기능 연결', 'LLM·RAG·MCP를 붙입니다.']
};

export const METHODS = {
  C: ['챗 AI 결과물', 'ChatGPT·Claude·Gemini의 캔버스·아티팩트로 바로 만듭니다.'],
  G: ['앱 생성 서비스', 'Lovable·Replit·Bolt·v0·Base44 같은 서비스에 화면과 기능을 설명해 만듭니다.'],
  N: ['에이전트 서비스', 'Manus·Genspark 같은 에이전트에 작업을 맡기고 결과물을 받습니다.'],
  K: ['코딩에이전트', 'Claude Code·Codex·Antigravity·Cursor로 내 폴더에서 코드를 만들고 고칩니다.']
};

export const QUESTIONS = [
  {
    key: 'what', q: '무엇을 만듭니까?', desc: '가장 가까운 것을 하나 고릅니다.',
    options: [
      { v: 'web', label: '웹 화면 도구', sub: '계산기, 신청·조회 화면, 대시보드, 체크리스트' },
      { v: 'file', label: '문서·엑셀 파일 처리', sub: '엑셀 병합, PDF 표 추출, HWPX 조립, 파일 일괄 변환' },
      { v: 'collect', label: '데이터 수집·알림', sub: '공고·뉴스 수집, 조건 감시, 메일·메신저 알림' },
      { v: 'chat', label: 'AI 챗봇·질의응답', sub: '규정 질의응답, 문서 요약, 회의록 정리' },
      { v: 'desktop', label: '설치형 PC 프로그램', sub: '브라우저 없이 창으로 뜨는 .exe 프로그램' }
    ]
  },
  {
    key: 'who', q: '누가 씁니까?', desc: '사용자 범위에 따라 배포 방식이 달라집니다.',
    options: [
      { v: 'me', label: '나 혼자', sub: '내 PC에서 실행합니다.' },
      { v: 'team', label: '부서·기관 내부', sub: '동료에게 주소나 파일로 공유합니다.' },
      { v: 'public', label: '외부 공개', sub: '국민·고객 누구나 접속합니다.' }
    ]
  },
  {
    key: 'store', q: '입력한 데이터를 저장합니까?', desc: '저장 위치가 백엔드 필요 여부를 정합니다.',
    options: [
      { v: 'none', label: '저장하지 않음', sub: '계산·변환 결과만 보여 주거나 파일로 내려받습니다.' },
      { v: 'local', label: '내 브라우저·PC에만 저장', sub: '다른 사람은 내 데이터를 볼 수 없습니다.' },
      { v: 'shared', label: '여러 사람이 함께 저장·조회', sub: '신청 목록, 게시글, 공동 작업 데이터' }
    ]
  },
  {
    key: 'login', q: '로그인이 필요합니까?', desc: '사람마다 볼 수 있는 데이터가 다르면 로그인이 필요합니다.',
    when: a => a.who !== 'me',
    options: [
      { v: 'yes', label: '필요함', sub: '사용자별 권한, 내 신청 내역 보기, 관리자 화면' },
      { v: 'no', label: '필요 없음', sub: '누구나 같은 화면을 봅니다.' }
    ]
  },
  {
    key: 'data', q: '외부 데이터를 불러옵니까?', desc: '데이터 출처에 따라 키 보관 방식이 달라집니다.',
    options: [
      { v: 'none', label: '불러오지 않음', sub: '사용자가 입력하거나 파일을 올립니다.' },
      { v: 'open', label: '키 없는 공개 데이터', sub: '공개 JSON·CSV, RSS, 공개 웹페이지' },
      { v: 'key', label: '인증키가 필요한 API', sub: '공공데이터포털, 지도·날씨 API, 유료 API' },
      { v: 'internal', label: '기관 내부 시스템·DB', sub: '내부 API, 업무 시스템 DB, 사내 파일 서버' }
    ]
  },
  {
    key: 'ai', q: 'AI 기능을 넣습니까?', desc: '만든 도구 안에서 LLM을 부르는 기능을 말합니다.',
    options: [
      { v: 'none', label: '넣지 않음', sub: '규칙대로 동작하는 도구입니다.' },
      { v: 'gen', label: '요약·분류·생성', sub: '입력 글 요약, 민원 분류, 초안 작성' },
      { v: 'docs', label: '내 문서를 근거로 답하기', sub: '규정·매뉴얼·보고서를 찾아 근거와 함께 답합니다.' },
      { v: 'tools', label: 'AI가 도구·시스템을 호출', sub: 'MCP로 DB 조회, 파일 작업, 내부 시스템 호출' }
    ],
    filter: (a, o) => !(a.what === 'chat' && o.v === 'none')
  },
  {
    key: 'net', q: '어떤 망에서 씁니까?', desc: '폐쇄망이면 외부 서비스 대신 기관 안에서 동작하는 도구로 바꿉니다.',
    options: [
      { v: 'ext', label: '외부망(인터넷 가능)', sub: '클라우드 서비스와 외부 API를 쓸 수 있습니다.' },
      { v: 'closed', label: '폐쇄망·내부망', sub: '인터넷이 막혀 있거나 외부 서비스 반입이 제한됩니다.' }
    ]
  },
  {
    key: 'method', q: '어떤 방식으로 만들 생각입니까?', desc: '조건에 맞지 않으면 결과에서 다른 방식을 함께 안내합니다.',
    options: [
      { v: 'C', label: '챗 AI 결과물', sub: 'ChatGPT·Claude·Gemini 캔버스·아티팩트' },
      { v: 'G', label: '앱 생성 서비스', sub: 'Lovable·Replit·Bolt·v0·Base44' },
      { v: 'N', label: '에이전트 서비스', sub: 'Manus·Genspark' },
      { v: 'K', label: '코딩에이전트', sub: 'Claude Code·Codex·Antigravity·Cursor' },
      { v: 'auto', label: '아직 정하지 않음', sub: '조건에 맞는 방식을 추천받습니다.' }
    ]
  }
];

export function activeQuestions(a) {
  return QUESTIONS.filter(q => !q.when || q.when(a));
}

const WHAT_LABEL = { web: '웹 화면 도구', file: '문서·엑셀 파일 처리 도구', collect: '데이터 수집·알림 도구', chat: 'AI 질의응답 도구', desktop: '설치형 PC 프로그램' };
const WHO_LABEL = { me: '나 혼자', team: '부서·기관 내부 사용자', public: '외부 공개 사용자' };

// 구조 단계: 조건마다 필요한 단계 중 가장 높은 단계
function stageOf(a) {
  const shared = a.store === 'shared' || a.login === 'yes';
  const deployed = a.who !== 'me' && ['web', 'chat'].includes(a.what);
  const need = {
    1: true,
    2: deployed,
    3: a.data !== 'none',
    4: shared,
    5: a.ai !== 'none'
  };
  const stage = Math.max(...Object.keys(need).filter(k => need[k]).map(Number));
  return { stage, need };
}

// 만드는 방식: 고른 방식이 조건에 맞는지 보고, 맞지 않으면 대안을 정한다
function methodOf(a, stage) {
  const reasons = [];
  if (a.net === 'closed') reasons.push('폐쇄망에서는 외부 챗·앱 생성·에이전트 서비스를 쓸 수 없습니다. 기관이 허용한 코딩 도구로 만들거나 외부망에서 만든 코드를 반입합니다.');
  if (a.ai === 'tools') reasons.push('MCP 연결·제작은 코드를 직접 다루는 코딩에이전트 영역입니다.');
  if (a.data === 'internal') reasons.push('기관 내부 시스템은 외부 서비스에서 접속할 수 없습니다.');
  if (a.what === 'desktop') reasons.push('설치형 프로그램은 파일을 빌드·패키징해야 해서 브라우저 안의 서비스로는 끝까지 만들기 어렵습니다.');
  if (['file', 'collect'].includes(a.what) && a.method === 'G') reasons.push('앱 생성 서비스는 웹앱을 만드는 서비스라 내 PC 파일 처리나 예약 실행 스크립트에는 맞지 않습니다.');
  if (a.method === 'C' && stage >= 4) reasons.push('챗 AI 결과물은 여러 사람이 함께 쓰는 저장소와 로그인을 붙이기 어렵습니다.');
  if (a.method === 'N' && stage >= 4) reasons.push('에이전트 서비스 결과물은 DB·로그인을 운영하기 어렵고, 계속 고치려면 코드로 옮겨야 합니다.');
  if (a.method === 'C' && a.what === 'collect') reasons.push('예약 실행과 알림 발송은 챗 AI 화면 안에서 돌릴 수 없습니다.');

  const forceK = a.net === 'closed' || a.ai === 'tools' || a.data === 'internal' || a.what === 'desktop';
  let rec;
  if (forceK) rec = 'K';
  else if (['file', 'collect'].includes(a.what)) rec = 'K';
  else if (stage <= 1 && a.who === 'me') rec = 'C';
  else if (stage <= 4 && a.who !== 'me' && a.ai !== 'docs') rec = 'G';
  else rec = 'K';

  if (a.method === 'auto') return { method: rec, chosen: null, fit: true, reasons: [] };
  let fit = !reasons.length || (a.method === 'K');
  if (a.method === 'G' && stage === 5 && a.ai === 'docs') { fit = false; reasons.push('내 문서를 근거로 답하게 하려면 문서 분할·검색 구조를 직접 다뤄야 해서 코딩에이전트가 맞습니다.'); }
  if (a.method === 'K') return { method: 'K', chosen: 'K', fit: true, reasons: [] };
  return fit ? { method: a.method, chosen: a.method, fit: true, reasons: [] } : { method: rec === a.method ? 'K' : rec, chosen: a.method, fit: false, reasons };
}

function stackOf(a, need, method) {
  const closed = a.net === 'closed';
  const rows = [];
  const base = {
    web: 'HTML·CSS·JavaScript 단일 파일로 시작하고, 화면이 늘어나면 폴더를 나눕니다.',
    file: 'Python(pandas·openpyxl·pdfplumber) 스크립트. 엑셀 안에서 끝나면 VBA, 윈도우 파일 작업이면 PowerShell.',
    collect: 'Python(Requests·feedparser·BeautifulSoup) 스크립트. 로그인 필요한 사이트는 Playwright.',
    chat: 'HTML·JavaScript 채팅 화면과 LLM을 부르는 서버 한 개.',
    desktop: 'Python CustomTkinter + PyInstaller로 .exe를 만듭니다. 가벼운 설치 파일이 필요하면 Tauri.'
  }[a.what];
  rows.push(['화면·실행', base]);

  if (a.what === 'desktop' || a.what === 'file') {
    rows.push(['배포', a.who === 'me' ? '내 PC에서 실행합니다.' : '실행 파일(.exe)이나 스크립트를 공유 폴더로 나눠 줍니다. 사용 설명과 버전 번호를 함께 둡니다.']);
  } else if (a.what === 'collect') {
    rows.push(['실행 주기', closed ? '윈도우 작업 스케줄러나 내부 서버 cron으로 정해진 시각에 실행합니다.' : '내 PC는 작업 스케줄러, 서버 없이 돌리려면 GitHub Actions 예약 실행.']);
  } else if (!need[2]) {
    rows.push(['실행', '로컬 서버로 엽니다(python -m http.server 또는 npx serve). 파일을 더블클릭하면 fetch와 모듈이 막힐 수 있습니다.']);
  } else if (method === 'G') {
    rows.push(['배포', '서비스의 게시 기능으로 주소를 만들고, 필요하면 도메인을 연결합니다.']);
  } else {
    rows.push(['배포', closed ? '기관 내부 웹서버(IIS·Nginx)나 내부망 공유 서버에 올립니다.' : 'GitHub에 올리고 Netlify·Cloudflare Pages·Firebase Hosting에 연결해 push할 때마다 배포합니다.']);
  }

  if (a.data === 'open') rows.push(['데이터', 'fetch로 불러옵니다. CORS로 막히면 서버리스 함수를 거쳐 불러옵니다.']);
  if (a.data === 'key') rows.push(['데이터', closed ? '기관 서버에서 키를 보관하고 API를 대신 호출합니다.' : '서버리스 함수(Cloudflare Workers·Netlify Functions)에 키를 두고, 브라우저는 그 함수만 부릅니다.']);
  if (a.data === 'internal') rows.push(['데이터', '내부 API가 있으면 그것을 쓰고, DB는 서버(Flask 등)에서 읽기 전용 계정으로 조회합니다.']);

  if (a.store === 'local') rows.push(['저장', a.what === 'web' || a.what === 'chat' ? '브라우저 localStorage. 내보내기·가져오기 버튼을 함께 둡니다.' : '로컬 파일이나 SQLite 파일에 저장합니다.']);
  if (need[4]) {
    let s;
    if (closed || a.data === 'internal') s = 'Flask + SQLite(또는 기관 DB). 로그인은 기관 계정 연동을 먼저 확인합니다.';
    else if (method === 'G') s = '서비스가 제공하는 DB·로그인(대부분 Supabase 기반)을 켜고 권한 설정을 확인합니다.';
    else if (a.login === 'yes') s = 'Firebase(Auth + Firestore) 또는 Supabase(Auth + Postgres + RLS).';
    else s = '간단한 신청·목록이면 구글 시트 + Apps Script, 데이터가 많아지면 Firebase·Supabase.';
    rows.push(['저장·로그인', s]);
  }

  if (a.ai === 'gen') rows.push(['AI', closed ? '기관 LLM API나 Ollama·LM Studio 로컬 모델을 서버에서 호출합니다.' : '서버(서버리스 함수)에서 Gemini·OpenAI·Claude API를 호출하고, 브라우저에는 키를 두지 않습니다.']);
  if (a.ai === 'docs') rows.push(['AI', '문서가 적으면 프롬프트에 그대로 넣는 컨텍스트 주입, 많으면 문서를 나눠 검색하는 RAG(ChromaDB 등). ' + (closed ? '모델은 Ollama나 기관 LLM.' : '')]);
  if (a.ai === 'tools') rows.push(['AI', '기존 MCP 서버를 먼저 찾아 연결하고, 없으면 만듭니다. 내 PC 전용이면 stdio, 여러 사람이 쓰면 Streamable HTTP.']);
  return rows.map(([k, v]) => [k, v.trim()]);
}

function warningsOf(a, need, method) {
  const w = [];
  if (a.data === 'key' || (a.ai !== 'none' && a.net === 'ext')) w.push('API 키를 HTML·JS 파일에 넣지 않습니다. 브라우저 코드는 누구나 볼 수 있습니다.');
  if (need[4] && a.net === 'ext') w.push('Firestore 보안 규칙이나 Supabase RLS를 켜지 않은 상태로 주소를 공개하지 않습니다.');
  if (a.who === 'public' && (a.login === 'yes' || a.store === 'shared')) w.push('개인정보를 받으면 수집 항목, 보관 기간, 동의 문구를 먼저 정합니다.');
  if (a.data === 'internal') w.push('운영 DB에 직접 쓰지 않습니다. 읽기 전용 계정이나 사본 DB로 시작합니다.');
  if (a.net === 'closed' && ['web', 'chat'].includes(a.what)) w.push('폐쇄망에서는 CDN이 막힙니다. 라이브러리와 글꼴을 파일로 함께 둡니다.');
  if (a.what === 'desktop') w.push('서명하지 않은 .exe는 백신이 막을 수 있습니다. 배포 전에 기관 보안 담당과 확인합니다.');
  if (a.what === 'collect') w.push('사이트 이용약관과 robots.txt를 확인하고, 요청 간격을 둡니다. API가 있으면 API를 먼저 씁니다.');
  if (a.ai !== 'none') w.push('AI 답변에는 출처나 근거를 함께 표시하고, 사람이 확인하는 단계를 둡니다.');
  if (method === 'C') w.push('챗 AI 결과물은 대화가 길어질수록 앞부분을 잊습니다. 완성된 파일은 따로 저장하고 버전을 나눕니다.');
  if (method === 'G' || method === 'N') w.push('서비스 요금제와 크레딧 한도를 확인합니다. 계속 고쳐 쓸 도구는 코드를 내려받아 GitHub에 보관합니다.');
  if (method === 'K') w.push('작업 전에 Git으로 커밋해 두면 AI가 잘못 고친 코드를 되돌릴 수 있습니다.');
  return w;
}

// 관련 교육 모듈(AI 바이브코딩 교육과정 보드 모듈 id)
function modulesOf(a, need, method) {
  const ids = ['VO1', 'VO2'];
  const add = (...x) => x.forEach(id => { if (id && !ids.includes(id)) ids.push(id); });
  if (method === 'K') {
    add(['web', 'chat'].includes(a.what) ? 'VK1' : 'VK2');
    if (need[2]) add(a.net === 'closed' ? 'VK4' : 'VK3');
    if (a.data === 'open' || a.data === 'internal') add('VK5');
    if (a.data === 'key') add('VK5', a.net === 'closed' ? 'VK8' : 'VK6');
    if (need[4]) add(a.net === 'closed' || a.data === 'internal' ? 'VK8' : (a.login === 'yes' ? 'VK7' : 'VK15'));
    if (a.ai === 'gen') add(a.net === 'closed' ? 'VK11' : 'VK10');
    if (a.ai === 'docs') add('VK11');
    if (a.ai === 'tools') add('VK12');
  } else if (method === 'C') {
    add('VC1');
    if (need[2]) add('VC3');
    if (need[3]) add('VC4');
    if (need[4]) add('VC5');
    if (need[5]) add('VC6');
  } else if (method === 'G') {
    add('VG1', 'VG7');
    if (need[2]) add('VG2');
    if (need[3]) add('VG3');
    if (need[4]) add('VG4', 'VG5');
    if (need[5]) add('VG6');
  } else if (method === 'N') {
    add('VN6', 'VN1');
    if (need[2]) add('VN2');
    if (need[3]) add('VN3');
    if (need[4]) add('VN4');
    if (need[5]) add('VN5');
  }
  add('VO5');
  if (need[2]) add('VO3');
  if (a.data === 'key' || a.ai !== 'none') add('VO4');
  if (need[4] || a.who === 'public') add('VO6');
  return ids;
}

// 관련 시나리오: 만들 것별 기본 목록에 조건별 가점을 더해 상위 4개
const SC_BASE = {
  web: ['web-firebase-fullstack', 'web-survey-analytics', 'web-cloudflare-pages', 'web-supabase-react', 'office-bookmarklet-f12'],
  file: ['office-excel-merge', 'office-pdf-toolkit', 'gov-hwpx-automation', 'office-csv-cleaner', 'gov-press-release-hwpx', 'office-image-watermark', 'gov-tax-delinquency'],
  collect: ['agent-rss-news-digest', 'gov-procurement-monitor', 'office-email-alert', 'agent-browser-playwright', 'agent-selenium-automation'],
  chat: ['agent-rag-vector-search', 'gov-local-llm-rag', 'agent-gemini-multimodal', 'agent-whisper-meeting', 'agent-mcp-server'],
  desktop: ['desktop-customtkinter-exe', 'desktop-tauri-fast', 'desktop-pyside-qt', 'desktop-electron-cross']
};
const SC_CLOUD = ['web-firebase-fullstack', 'web-supabase-react', 'web-cloudflare-pages', 'agent-gemini-multimodal'];

function scenariosOf(a) {
  const score = {};
  const bump = (ids, n) => ids.forEach(id => { score[id] = (score[id] || 0) + n; });
  const base = SC_BASE[a.what] || [];
  base.forEach((id, i) => { score[id] = 10 - i; });
  if (a.net === 'closed') { bump(SC_CLOUD, -20); bump(['gov-local-llm-rag', 'agent-selenium-automation', 'desktop-customtkinter-exe'], 6); }
  if (a.who === 'me' && a.what === 'web' && a.store !== 'shared') { bump(SC_CLOUD, -3); bump(['office-bookmarklet-f12'], 8); }
  if (a.store === 'shared' && a.net === 'ext') bump(['web-firebase-fullstack', 'web-supabase-react', 'web-survey-analytics'], 5);
  if (a.data === 'key') bump(['gov-procurement-monitor'], 5);
  if (a.data === 'open') bump(['agent-rss-news-digest'], 4);
  if (a.ai === 'gen') bump(['agent-rss-news-digest', 'agent-whisper-meeting', 'agent-gemini-multimodal'], 4);
  if (a.ai === 'docs') bump([a.net === 'closed' ? 'gov-local-llm-rag' : 'agent-rag-vector-search'], 8);
  if (a.ai === 'tools') bump(['agent-mcp-server'], 12);
  return Object.entries(score).filter(([, v]) => v > 0).sort((x, y) => y[1] - x[1]).slice(0, 4).map(([id]) => id);
}

// 받침 여부에 따라 을/를을 붙인다
function objParticle(word) {
  const c = word.charCodeAt(word.length - 1);
  const hasFinal = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
  return word + (hasFinal ? '을' : '를');
}

function promptOf(a, stage, method, stack, note) {
  const lines = [];
  lines.push(`${objParticle(WHAT_LABEL[a.what])} 만듭니다.`);
  if (note) lines.push(`하려는 일: ${note}`);
  lines.push('');
  lines.push('[조건]');
  lines.push(`- 사용자: ${WHO_LABEL[a.who]}`);
  lines.push(`- 망 환경: ${a.net === 'closed' ? '폐쇄망(외부 CDN·외부 API 사용 불가)' : '외부망'}`);
  lines.push(`- 구조 단계: S${stage} ${STAGES[stage][0]}`);
  lines.push('');
  lines.push('[기술 조합]');
  stack.forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
  lines.push('');
  lines.push('[작업 방식]');
  lines.push('1. 코드를 쓰기 전에 기능 목록, 화면 구성, 폴더 구조, 단계별 계획을 먼저 보여 주세요. 확인한 뒤 진행합니다.');
  lines.push('2. 한 번에 한 단계씩 만들고, 단계마다 실행 방법과 확인할 점을 알려 주세요.');
  if (a.data === 'key' || a.ai !== 'none') lines.push('3. API 키는 .env 같은 별도 파일이나 서버 환경변수에 두고, 브라우저 코드와 Git에 올리지 않게 해 주세요.');
  if (stage >= 4) lines.push(`${a.data === 'key' || a.ai !== 'none' ? 4 : 3}. 저장소 권한 규칙(누가 무엇을 읽고 쓰는지)을 코드와 함께 작성해 주세요.`);
  lines.push('');
  lines.push('제가 개발자가 아니므로 용어는 짧게 풀어서 설명해 주세요.');
  if (method === 'K') lines.push('작업 규칙은 CLAUDE.md(또는 AGENTS.md)에 정리해 두고 매번 따라 주세요.');
  return lines.join('\n');
}

export function diagnose(answers, note = '') {
  const a = { login: 'no', ...answers };
  const { stage, need } = stageOf(a);
  const m = methodOf(a, stage);
  const stack = stackOf(a, need, m.method);
  return {
    stage,
    stageName: STAGES[stage][0],
    stageDesc: STAGES[stage][1],
    need,
    method: m.method,
    methodName: METHODS[m.method][0],
    methodDesc: METHODS[m.method][1],
    chosen: m.chosen,
    fit: m.fit,
    reasons: m.reasons,
    stack,
    warnings: warningsOf(a, need, m.method),
    modules: modulesOf(a, need, m.method),
    scenarios: scenariosOf(a),
    prompt: promptOf(a, stage, m.method, stack, note.trim())
  };
}

export function answerLabel(key, v) {
  const q = QUESTIONS.find(x => x.key === key);
  return q?.options.find(o => o.v === v)?.label || v;
}
