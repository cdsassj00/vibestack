/**
 * English text for the rule-based diagnosis (diagnosis.js).
 * Pure data module (no DOM). Same keys as the Korean text in diagnosis.js.
 * Logic stays in diagnosis.js; this file only holds strings.
 */

const art = w => (/^[aeiou]/i.test(w) ? 'an' : 'a');

export default {
  stages: {
    1: ['Run locally', 'You open it on your own PC.'],
    2: ['Deploy front end', 'You share it with a web address.'],
    3: ['Connect external data', 'You load data from public APIs, APIs that need a key, or internal systems.'],
    4: ['Back end, DB, login', 'Many people save and look up data.'],
    5: ['Add AI features', 'You connect an LLM, RAG or MCP.']
  },

  methods: {
    C: ['Chat AI output', 'You build it directly in the canvas or artifacts of ChatGPT, Claude or Gemini.'],
    G: ['App builders', 'You describe the screens and features to a service such as Lovable, Replit, Bolt, v0 or Base44.'],
    N: ['Agent services', 'You hand the task to an agent such as Manus or Genspark and receive the result.'],
    K: ['Coding agents', 'You create and edit code in your own folder with Claude Code, Codex, Antigravity or Cursor.']
  },

  // key -> { q, desc, options: { value: [label, sub] } }
  questions: {
    what: {
      q: 'What are you building?', desc: 'Pick the closest one.',
      options: {
        web: ['Web tool', 'Calculators, request and lookup pages, dashboards, checklists'],
        file: ['Document and Excel file processing', 'Merge Excel files, extract PDF tables, assemble HWPX files, batch-convert files'],
        collect: ['Data collection and alerts', 'Collect notices and news, watch for conditions, send email or messenger alerts'],
        chat: ['AI chatbot and Q&A', 'Answer questions on regulations, summarize documents, organize meeting notes'],
        desktop: ['Installable PC program', 'An .exe program that opens in its own window, without a browser']
      }
    },
    who: {
      q: 'Who will use it?', desc: 'How you deploy it depends on who uses it.',
      options: {
        me: ['Just me', 'It runs on your own PC.'],
        team: ['My team or organization', 'You share it with colleagues as a link or a file.'],
        public: ['The public', 'Anyone, such as citizens or customers, can open it.']
      }
    },
    store: {
      q: 'Does it save the data people enter?', desc: 'Where data is stored decides whether you need a back end.',
      options: {
        none: ['Nothing is saved', 'It only shows results or lets you download a file.'],
        local: ['Only in my browser or PC', 'Other people cannot see your data.'],
        shared: ['Shared by many people', 'Request lists, posts, shared work data']
      }
    },
    login: {
      q: 'Do people need to log in?', desc: 'If each person should see different data, you need login.',
      options: {
        yes: ['Yes', 'Per-user permissions, viewing your own requests, admin pages'],
        no: ['No', 'Everyone sees the same screen.']
      }
    },
    data: {
      q: 'Does it load external data?', desc: 'Where the data comes from decides how you keep API keys.',
      options: {
        none: ['No', 'Users type in data or upload files.'],
        open: ['Public data without a key', 'Public JSON or CSV, RSS, public web pages'],
        key: ['API that needs a key', 'Korea\'s public data portal (data.go.kr), map and weather APIs, paid APIs'],
        internal: ['Internal systems or DB', 'Internal APIs, business system databases, internal file servers']
      }
    },
    ai: {
      q: 'Does it include AI features?', desc: 'This means the tool itself calls an LLM.',
      options: {
        none: ['No AI', 'The tool follows fixed rules.'],
        gen: ['Summarize, classify, generate', 'Summarize text, sort citizen requests, write drafts'],
        docs: ['Answer from my documents', 'It finds regulations, manuals or reports and answers with sources.'],
        tools: ['AI calls tools and systems', 'Query a DB, work with files, call internal systems through MCP']
      }
    },
    net: {
      q: 'Which network will it run on?',
      desc: 'Korean public agencies often keep work PCs on an air-gapped network, separated from the internet. There you use tools that run inside your organization instead of external services.',
      options: {
        ext: ['Internet-connected network', 'You can use cloud services and external APIs.'],
        closed: ['Air-gapped or internal network', 'Internet access is blocked, or bringing in external services is restricted.']
      }
    },
    method: {
      q: 'How do you plan to build it?', desc: 'If your choice does not fit your answers, the result also suggests another method.',
      options: {
        C: ['Chat AI output', 'ChatGPT, Claude, Gemini canvas and artifacts'],
        G: ['App builders', 'Lovable, Replit, Bolt, v0, Base44'],
        N: ['Agent services', 'Manus, Genspark'],
        K: ['Coding agents', 'Claude Code, Codex, Antigravity, Cursor'],
        auto: ['Not decided yet', 'Get a recommendation that fits your answers.']
      }
    }
  },

  what: { web: 'web tool', file: 'document and Excel file processing tool', collect: 'data collection and alert tool', chat: 'AI Q&A tool', desktop: 'installable PC program' },
  who: { me: 'just me', team: 'people inside my team or organization', public: 'the public' },

  reasons: {
    closed: 'On an air-gapped network you cannot use external chat AI, app builders or agent services. Build with a coding tool your organization allows, or build the code online and bring it in with security approval.',
    tools: 'Connecting or building MCP means working with code directly, which is the job of coding agents.',
    internal: 'External services cannot reach your organization\'s internal systems.',
    desktop: 'An installable program has to be built and packaged as files, which is hard to finish inside a browser-based service.',
    gFile: 'App builders make web apps, so they do not fit scripts that process files on your PC or run on a schedule.',
    cShared: 'Chat AI output cannot easily add shared storage and login for many users.',
    nShared: 'Agent service output is hard to run with a DB and login, and you have to move it to code to keep improving it.',
    cCollect: 'Scheduled runs and sending alerts cannot run inside a chat AI window.',
    gDocs: 'To answer from your own documents, you need to handle document splitting and search yourself, so a coding agent fits better.'
  },

  stack: {
    label: { screen: 'Screen and run', deploy: 'Deploy', schedule: 'Schedule', run: 'Run', data: 'Data', store: 'Storage', storeLogin: 'Storage and login', ai: 'AI' },
    base: {
      web: 'Start with a single HTML, CSS and JavaScript file, and split it into folders as the screens grow.',
      file: 'A Python script (pandas, openpyxl, pdfplumber). Use VBA if it all happens inside Excel, or PowerShell for Windows file tasks.',
      collect: 'A Python script (Requests, feedparser, BeautifulSoup). Use Playwright for sites that need login.',
      chat: 'An HTML and JavaScript chat page plus one server that calls the LLM.',
      desktop: 'Build an .exe with Python CustomTkinter and PyInstaller. Use Tauri if you need a small installer.'
    },
    deployMe: 'Run it on your own PC.',
    deployShare: 'Share the .exe or script through a shared folder. Include usage notes and a version number.',
    scheduleClosed: 'Run it at set times with Windows Task Scheduler or cron on an internal server.',
    scheduleExt: 'Use Task Scheduler on your PC, or GitHub Actions scheduled runs if you do not want a server.',
    runLocal: 'Open it with a local server (python -m http.server or npx serve). Double-clicking the file can block fetch and modules.',
    deployG: 'Create a web address with the service\'s publish feature, and connect a domain if needed.',
    deployClosed: 'Put it on an internal web server (IIS, Nginx) or a shared server on the internal network.',
    deployExt: 'Push it to GitHub and connect Netlify, Cloudflare Pages or Firebase Hosting so every push deploys it.',
    dataOpen: 'Load it with fetch. If CORS blocks it, load it through a serverless function.',
    dataKeyClosed: 'Keep the key on your organization\'s server and have that server call the API.',
    dataKeyExt: 'Keep the key in a serverless function (Cloudflare Workers, Netlify Functions), and have the browser call only that function.',
    dataInternal: 'Use the internal API if there is one. Otherwise query the DB from a server (such as Flask) with a read-only account.',
    storeLocalWeb: 'Browser localStorage. Add export and import buttons.',
    storeLocalFile: 'Save to a local file or a SQLite file.',
    dbClosed: 'Flask + SQLite (or your organization\'s DB). For login, first check whether you can use your organization\'s accounts.',
    dbG: 'Turn on the DB and login the service provides (mostly based on Supabase), and check the permission settings.',
    dbLogin: 'Firebase (Auth + Firestore) or Supabase (Auth + Postgres + RLS).',
    dbSimple: 'Google Sheets + Apps Script for simple requests and lists. Firebase or Supabase when the data grows.',
    aiGenClosed: 'Call an in-house LLM API or a local model in Ollama or LM Studio from the server.',
    aiGenExt: 'Call the Gemini, OpenAI or Claude API from a server (serverless function), and keep keys out of the browser.',
    aiDocs: 'With a few documents, put them straight into the prompt (context injection). With many, use RAG, which splits the documents and searches them (ChromaDB or similar). ',
    aiDocsClosed: 'Use Ollama or an in-house LLM as the model.',
    aiTools: 'Look for an existing MCP server and connect it first. Build one if none exists. Use stdio for your own PC only, Streamable HTTP for many users.'
  },

  warn: {
    key: 'Do not put API keys in HTML or JS files. Anyone can read browser code.',
    rules: 'Do not publish the address before turning on Firestore security rules or Supabase RLS.',
    privacy: 'If you collect personal information, first decide what you collect, how long you keep it and the consent wording.',
    internal: 'Do not write to the production DB. Start with a read-only account or a copy of the DB.',
    cdn: 'CDNs are blocked on an air-gapped network. Keep libraries and fonts as local files.',
    exe: 'Antivirus software may block an unsigned .exe. Check with your organization\'s security team before you distribute it.',
    collect: 'Check the site\'s terms of use and robots.txt, and space out requests. If there is an API, use it first.',
    ai: 'Show sources or evidence with AI answers, and include a step where a person checks them.',
    C: 'Chat AI forgets the start of a long conversation. Save finished files separately and keep versions.',
    GN: 'Check the service plan and credit limits. For a tool you will keep improving, download the code and keep it on GitHub.',
    K: 'Commit with Git before each task so you can undo code the AI got wrong.'
  },

  prompt: {
    intro: w => `I want to build ${art(w)} ${w}.`,
    goal: n => `What I want to do: ${n}`,
    cond: '[Requirements]',
    who: w => `- Users: ${w}`,
    net: closed => `- Network: ${closed ? 'air-gapped (no external CDN or external API)' : 'internet-connected'}`,
    stage: (s, name) => `- Structure stage: ${s} of 5, ${name}`,
    stack: '[Tech stack]',
    work: '[How to work]',
    plan: 'Before writing any code, show me the feature list, screen layout, folder structure and a step-by-step plan. I will confirm before you continue.',
    step: 'Build one step at a time, and for each step tell me how to run it and what to check.',
    key: 'Keep API keys in a separate file such as .env or in server environment variables, and keep them out of browser code and Git.',
    rules: 'Write the storage access rules (who can read and write what) together with the code.',
    plain: 'I am not a developer, so please explain technical terms briefly.',
    agent: 'Write the working rules in CLAUDE.md (or AGENTS.md) and follow them every time.'
  }
};
