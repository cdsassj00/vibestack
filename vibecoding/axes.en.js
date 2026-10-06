// English overlay for vibecoding/axes.js. Same keys; only labels change. See docs/translation-guide.md.
export const AXES_EN = {
  courseName: 'Generative AI Vibe Coding curriculum',
  colAxisName: 'Build method',
  rowAxisName: 'Structure stage',
  base: { label: 'Foundations · projects' },
  cols: {
    O: ['Foundations', 'Setup, instructions, Git, key management, security, projects'],
    C: ['Chat AI output', 'Build directly with artifacts and canvas'],
    G: ['App builders', 'Lovable, Replit, Bolt, v0, Base44, Firebase Studio'],
    N: ['Agent services', 'Hand tasks to Manus, Genspark and similar'],
    K: ['Coding agents', 'Claude Code, Codex, Antigravity, Cursor']
  },
  rows: {
    1: ['Run locally', 'Open and use on your own PC', 'Double-click an HTML file, python -m http.server, npx serve, local scripts'],
    2: ['Deploy front end', 'Share it at a web address', 'Netlify, Cloudflare Pages, GitHub Pages, Firebase Hosting, an internal-network server'],
    3: ['Connect external data', 'Public APIs, RSS, APIs that need a key', 'fetch, CORS, keeping keys in serverless functions'],
    4: ['Back end, DB, login', 'Many people save and look up data', 'Supabase, Firebase, Cloudflare D1, Google Sheets, Flask + SQLite'],
    5: ['Add AI features', 'Connect LLMs, RAG and MCP', 'LLM APIs through a server, context injection, RAG, using and building MCP']
  },
  tracks: { '공': 'Everyone', '초': 'Beginners (non-developers)', '현': 'Business staff', '강': 'Instructors · course designers', '전': 'IT staff', '개': 'Experienced developers' }
};
