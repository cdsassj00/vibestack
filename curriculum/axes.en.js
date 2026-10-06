// English overlay for curriculum/axes.js. Same keys; only labels change. See docs/translation-guide.md.
export const AXES_EN = {
  courseName: 'Generative AI at Work curriculum',
  colAxisName: 'Work area',
  rowAxisName: 'AI method',
  base: { label: 'Foundations · projects' },
  cols: {
    O: ['Foundations', 'LLM basics, prompting, security, setup, projects'],
    R: ['Research', 'Finding information, comparing sources, document Q&A'],
    D: ['Documents', 'Drafts, reports, minutes, forms, summaries'],
    C: ['Content', 'Images, video, audio, slides, infographics'],
    A: ['Data', 'Excel, statistics, simulation, dashboards'],
    P: ['Workflow', 'Files, data entry, alerts, applications, system links']
  },
  rows: {
    1: ['Chat', 'Ask and delegate inside an AI chat', 'ChatGPT, Gemini, Claude, an in-house LLM chat, or a local LLM chat app (Ollama, LM Studio, Msty). Everything inside the chat window: attachments, projects, deep research, agent mode, connectors'],
    2: ['Delegate', 'Hand work to dedicated AI services', 'Purpose-built services outside the chat window: NotebookLM, transcription apps, Gamma, Genspark, Manus, browser agents, app builders, AI built into office suites. Most need the internet'],
    3: ['Code-run', 'Build tools with code the AI writes', 'Paste and run code the AI gives you and learn how to run it. VBA, Python, Colab, PowerShell, CMD, HTML/JS, Apps Script, calling AI models with an API key'],
    4: ['Build', 'Build agents and systems yourself', 'Coding agents, deployment (Netlify, Cloudflare, Supabase), RAG, MCP, local LLMs, delegated agents on an air-gapped network']
  },
  closedNote: { 2: 'On an air-gapped network most dedicated AI services are not available.' },
  tracks: { '공': 'All staff', '서': 'General administration', '정': 'Policy', '재': 'Planning · budget · finance', '홍': 'Communications · PR', '민': 'Citizen services · field work', '연': 'Research · R&D', '전': 'IT' }
};
