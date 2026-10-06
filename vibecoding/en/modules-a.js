// English overlay for vibecoding/data.js (modules part A). Keyed by module id. See docs/translation-guide.md.

export const EN = {
  VO1: {
    t: 'Setting up the work environment: folders, terminal, Node, Python', st: 'Work environment setup',
    desc: 'Set up the basic environment you need to run files made by coding agents and AI. Covers folder structure, terminal commands, installing runtimes and checking versions.',
    fl: {
      box: 'My PC',
      e: [
        'U:Terminal command > C:Node/Python : run',
        'X:Installer > C:Node/Python : install',
        'C:Node/Python > C:Work folder : create files',
        'C:Work folder > U:Output : check'
      ]
    },
    ex: [
      'Create a work folder and understand paths and file extensions',
      'Basic CMD and PowerShell commands (cd, dir, running a file)',
      'Install VS Code and use its built-in terminal',
      'Install Node.js and Python and check their versions',
      'What npm install and pip install actually do',
      'Bring installers and packages into an air-gapped PC (Korean public agencies keep work PCs on a network separated from the internet) (반입)',
      'Show hidden files and file extensions in File Explorer'
    ],
    out: 'A practice folder that runs',
    kw: ['terminal', 'command prompt', 'install', 'path', 'npm', 'pip', 'environment setup'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Standardizes the Node and Python install steps for trainee PCs before class and prepares packages to bring into the air-gapped network.' },
      { j: 'City hall, general affairs / General administration officer', c: 'Can now run tools made by a coding agent on their own and read the error messages.' }
    ],
    pri: [
      { j: 'Startup, operations team / Operations manager', c: 'Sets up their own PC to run in-house tools without a developer.' },
      { j: 'Training company / Instructor', c: 'Uses a checklist in the first session to bring every trainee\'s environment to the same state.' }
    ]
  },
  VO2: {
    t: 'Writing task briefs and rule files', st: 'Task briefs and rules',
    desc: 'Write a task brief that states the tool\'s purpose, inputs, outputs and acceptance criteria, and keep recurring rules in a rule file. When you do not know where to start, use a meta prompt that has the AI draft the brief first.',
    fl: {
      box: 'Coding AI workspace',
      e: [
        'U:What you need > C:Task brief : purpose, I/O',
        'C:Rule file > C:Coding AI : read every time',
        'C:Task brief > C:Coding AI : instruct',
        'C:Coding AI > U:Result : built to criteria'
      ]
    },
    ex: [
      'One-page requirements: purpose, users, input, output, checks',
      'Attach screen sketches or sample data to the brief',
      'Meta prompt: describe your situation and get a brief back',
      'Write design and security rules in a rule file (CLAUDE.md, AGENTS.md)',
      'Get a plan first, approve it, then let the agent run',
      'Split change requests into small steps',
      'End the brief with completion criteria and things not to do'
    ],
    out: 'Task brief template, rule file',
    kw: ['prompt', 'task brief', 'requirements', 'meta prompt', 'rule file', 'PRD'],
    pub: [
      { j: 'District office, planning team / Planning officer', c: 'Sums up a recurring request as one page of requirements, hands it to a coding agent and reviews the result.' },
      { j: 'Public agency, IT team / IT officer', c: 'Distributes the agency\'s security and design rules as a rule file so tools built by each department meet the same standard.' }
    ],
    pri: [
      { j: 'IT services company / Product planner', c: 'Turns planning documents into task briefs and cuts the time to build a prototype.' },
      { j: 'Marketing team / Content manager', c: 'Makes landing page requirements into a template and reuses it for each campaign.' }
    ]
  },
  VO5: {
    t: 'Reading errors and debugging',
    desc: 'Find errors with the browser developer tools and terminal output, then pass them to the AI with steps to reproduce so it can fix them.',
    fl: {
      box: 'My PC',
      e: [
        'C:Tool code > U:Error message : run fails',
        'U:Error message > X:AI : paste in full',
        'X:AI > C:Tool code : fix',
        'C:Tool code > U:Run again : check'
      ]
    },
    ex: [
      'Read red errors in the F12 Console',
      'Check failed requests and CORS errors in the Network tab',
      'Send the AI the error message, steps to reproduce and expected result together',
      'Understand why modules do not load when a page is opened via file://',
      'After a fix, check again with the same steps',
      'Read a terminal Traceback from the last line up',
      'Capture the screen before and after the error and mark what changed'
    ],
    out: 'Error report template',
    kw: ['debugging', 'error', 'bug', 'console', 'F12', 'CORS', 'developer tools'],
    pub: [
      { j: 'City hall, IT team / IT officer', c: 'Receives errors in staff-built tools as console captures with reproduction steps and finds the cause quickly.' },
      { j: 'Education office training institute / Training officer', c: 'Lists common errors in class and their fixes and adds them to the course materials.' }
    ],
    pri: [
      { j: 'Online store, operations team / Operations staff', c: 'When the order tool stops, finds the failed request in the Network tab and sends it to the vendor.' },
      { j: 'Startup / Solo developer', c: 'Uses an error report template to cut the number of fix rounds with the coding agent.' }
    ]
  },
  VO3: {
    t: 'Version control and rollback with Git and GitHub', st: 'Git version control',
    desc: 'Keep a change history of what you build, undo bad changes, and push to GitHub to connect it to deployment.',
    fl: {
      box: 'My PC',
      e: [
        'C:Work folder > C:Git history : commit',
        'C:Git history > X:GitHub : push',
        'X:GitHub > U:Live URL : auto deploy',
        'C:Git history > C:Work folder : roll back'
      ]
    },
    ex: [
      'Record changes with commits',
      'Make checkpoints before and after a coding agent works',
      'Undo a bad change',
      'Create a GitHub repository and push to it',
      'Review with branches and pull requests before merging',
      'Use an in-house Git server (internal network)',
      'Keep personal data and build files out of the repository with .gitignore'
    ],
    out: 'GitHub repository',
    kw: ['Git', 'GitHub', 'commit', 'rollback', 'branch', 'pull request', 'version control'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Gathers each department\'s work tools into repositories and tracks change history and owners.' },
      { j: 'City hall, data team / Data analyst', c: 'Commits every change to analysis scripts to trace why results changed.' }
    ],
    pri: [
      { j: 'Marketing agency / Developer', c: 'Keeps each client\'s landing page in a repository and reviews change requests on branches.' },
      { j: 'Training company / Instructor', c: 'Builds practice examples as step-by-step commits so trainees can go back to any step.' }
    ]
  },
  VO4: {
    t: 'Managing API keys and secrets',
    desc: 'Understand where an API key gets exposed, and learn to store it as an environment variable or a service secret. A key placed in front-end code can be seen by anyone.',
    fl: {
      box: 'Server/function',
      e: [
        'U:API key > C:Env variable : register',
        'C:Env variable > C:Server code : read',
        'C:Server code > X:External API : request with key',
        'U:Browser page > C:Server code : request, no key'
      ]
    },
    ex: [
      'Find exposed keys with the browser\'s view source',
      'Keep keys out of the repository with a .env file and .gitignore',
      'Register environment variables and secrets in the hosting service',
      'Tell keys that can be public from keys that cannot (e.g. Firebase web config)',
      'Steps to revoke and reissue a key after it leaks',
      'Set rate limits and usage alerts',
      'Keep a key register with each key\'s use, issuer and expiry date'
    ],
    out: 'Key storage checklist',
    kw: ['API key', 'secret', 'environment variable', 'env', 'security', 'exposure', 'secret'],
    pub: [
      { j: 'Public agency, information security team / Security officer', c: 'Checks the source of department-built web tools for exposed keys and guides staff through reissuing them.' },
      { j: 'City hall, IT team / IT officer', c: 'Moves public data API keys into server-side secrets to prevent quota overrun incidents.' }
    ],
    pri: [
      { j: 'Startup, development team / Developer', c: 'Sets secret management rules after a leaked LLM API key caused unexpected charges.' },
      { j: 'Web agency / Web publisher', c: 'Secures map and payment keys on client sites with domain restrictions and server-side storage.' }
    ]
  },
  VO8: {
    t: 'Checking results: test data and checklists', st: 'Checking results',
    desc: 'Decide the acceptance criteria for an AI-built tool first, then check it with test data that covers normal, edge and invalid inputs. After every change, check again with the same checklist.',
    fl: {
      box: 'My PC',
      e: [
        'U:Test checklist > C:Test data : write per item',
        'C:Test data > C:Built tool : input',
        'C:Built tool > C:Comparison : match expected',
        'C:Comparison > U:Test record : pass/fail'
      ]
    },
    ex: [
      'Make a test checklist with the expected result for each feature',
      'Prepare test data: normal, empty, edge values and wrong formats',
      'Create fake sample data with no personal information',
      'Compare the tool\'s results with results calculated by hand',
      'Check for broken Korean characters, date formats and large file inputs',
      'Ask the AI to write check items and test code',
      'After a change, check again with the same checklist'
    ],
    out: 'Test checklist, test data set',
    kw: ['acceptance testing', 'testing', 'checklist', 'test data', 'edge cases', 'sample data'],
    pub: [
      { j: 'City hall, IT team / IT officer', c: 'Checks tools built by staff with a test checklist and test data before deploying them.' },
      { j: 'District office, tax division / Tax officer', c: 'Compares a tax calculation tool against 20 manual calculations and finds errors.' }
    ],
    pri: [
      { j: 'Accounting firm / Office manager', c: 'Compares results on the same sample file after every change to the settlement tool to catch omissions.' },
      { j: 'Training company / Instructor', c: 'Attaches a test checklist to assignments so trainees can check their own results.' }
    ]
  },
  VO6: {
    t: 'Checking security, permissions and personal data', st: 'Security, permissions',
    desc: 'Before you publish a tool made with vibe coding, check its access rules, how it handles input and whether it stores personal data.',
    fl: {
      box: 'Pre-launch check',
      e: [
        'U:User input > C:Input check : escape',
        'C:Input check > X:DB : save',
        'C:Access rules > X:DB : limit read/write',
        'X:DB > U:Own data only : view'
      ]
    },
    ex: [
      'Find databases left open without access rules (security rules, RLS)',
      'Escape input values before putting them on the page',
      'Store as few personal data fields as possible',
      'Restrict access to admin features',
      'Have the AI run a security check and review the results',
      'Do a final check with a pre-launch checklist',
      'Keep internal paths, keys and DB details off error pages'
    ],
    out: 'Pre-launch security checklist',
    kw: ['security', 'permissions', 'RLS', 'security rules', 'XSS', 'personal data', 'audit'],
    pub: [
      { j: 'Public agency, information security team / Security officer', c: 'Checks the DB access rules of an application page built by staff and fixes them before launch.' },
      { j: 'District office, IT team / IT officer', c: 'Reduces the personal data fields a resident application tool stores and sets a retention period.' }
    ],
    pri: [
      { j: 'Startup / CTO', c: 'Checks the access rules of an MVP made with an app builder before release.' },
      { j: 'Security consultancy / Consultant', c: 'Turns check items for vibe-coded tools into a standard checklist for clients.' }
    ]
  },
  VO7: {
    t: 'Vibe coding project: from requirements to deployment', st: 'Vibe coding project',
    desc: 'Pick one real work problem and take it through requirements, choosing a structure stage, building, testing, deployment and a presentation.',
    fl: {
      box: 'Project',
      e: [
        'U:Work problem > C:Requirements : define',
        'C:Requirements > C:Build and test : pick stage',
        'C:Build and test > X:Deploy : publish',
        'X:Deploy > U:Demo and use : feedback'
      ]
    },
    ex: [
      'Problem statement and one-page requirements',
      'Choose a structure stage (local, deploy, DB, AI)',
      'Build and revise with a coding agent',
      'Test with normal, empty and invalid inputs',
      'Deploy and write a user guide',
      'Demo and peer feedback',
      'Turn the feedback into a list of second-round improvements'
    ],
    out: 'A deployed work tool, user guide',
    kw: ['project', 'capstone', 'PoC', 'demo', 'deployment'],
    pub: [
      { j: 'Education office, administrative support / General administration officer', c: 'Builds a training sign-up collection tool from requirements to deployment and uses it in the department.' },
      { j: 'Public agency, IT team / IT officer', c: 'Builds an internal regulation search tool as a project and tests it with real questions.' }
    ],
    pri: [
      { j: 'Manufacturer, production control team / Production manager', c: 'Builds an equipment inspection log tool and pilots it on the shop floor for a month.' },
      { j: 'Training company / Operations staff', c: 'Builds a course sign-up and attendance tool and cuts time spent on operations.' }
    ]
  },
  VO9: {
    t: 'Managing usage and cost: plans, tokens, free tiers', st: 'Usage and cost',
    desc: 'Understand how app builder credits, LLM API tokens and hosting or DB free tiers are counted, and estimate the monthly cost. Set usage alerts and caps to avoid unexpected charges.',
    fl: {
      box: 'Admin console',
      e: [
        'X:LLM API > C:Usage dashboard : token log',
        'X:Hosting/DB > C:Usage dashboard : request count',
        'C:Usage dashboard > C:Cost estimate : sum',
        'C:Cost estimate > U:Manager view : vs budget',
        'C:Usage dashboard > U:Email alert : cap reached'
      ]
    },
    ex: [
      'Make a table of each service\'s pricing (credits, tokens, requests)',
      'Calculate the tokens and cost to process one document',
      'Use cheaper and pricier models depending on task difficulty',
      'Check hosting and DB free tiers and overage charges',
      'Set a monthly cap and alert for each API key',
      'Estimate cost based on the number of trainees in a course',
      'Compare the cost of building a local LLM server with API costs (반입)'
    ],
    out: 'Monthly cost estimate',
    kw: ['cost', 'pricing', 'tokens', 'credits', 'free tier', 'usage', 'billing'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Splits LLM API usage by key for each department and sets monthly caps to stay within budget.' },
      { j: 'Civil service training institute / Training planner', c: 'Estimates service fees from the number of trainees in a vibe coding course to plan the budget.' }
    ],
    pri: [
      { j: 'Startup / CTO', c: 'Uses a cheaper model for summaries and a pricier one only for review to cut costs.' },
      { j: 'Solo developer / Owner', c: 'Sets free-tier overage alerts to avoid billing surprises in the early days of a service.' }
    ]
  },
  VC1: {
    t: 'Building single-file HTML tools with Artifacts and Canvas', st: 'Single-file HTML tools',
    desc: 'Build single-file HTML tools such as calculators, checklists and quizzes just by chatting, then save them as files and open them with a double-click.',
    fl: {
      box: 'Inside the chat AI',
      e: [
        'U:Tool description > C:Artifact : ask in chat',
        'C:Artifact > C:HTML file : save',
        'C:HTML file > U:Browser page : double-click',
        'U:Browser page > C:Artifact : request changes'
      ]
    },
    ex: [
      'Build a work calculator or checklist',
      'Training quizzes and timers',
      'Add and change features through repeated chat',
      'Save as an HTML file and run it with a double-click',
      'Keep input values with browser storage (localStorage)',
      'Compare the same request across three services',
      'Add a print button and fit the layout to A4'
    ],
    out: 'Single-file HTML tool',
    kw: ['Artifacts', 'Canvas', 'single HTML', 'mini app', 'calculator', 'beginner'],
    pub: [
      { j: 'District office, welfare division / Welfare officer', c: 'Builds a simple eligibility checker through chat that shows whether an applicant meets benefit criteria.' },
      { j: 'Public agency, training team / Training officer', c: 'Builds quiz and attendance tools on the spot for use during training.' }
    ],
    pri: [
      { j: 'Interior design firm / Sales rep', c: 'Uses a calculator that gives a quote from floor area and materials during consultations.' },
      { j: 'Startup, HR team / Recruiter', c: 'Builds an interview scoring tool and shares it with interviewers.' }
    ]
  },
  VC2: {
    t: 'Screen mockups and mini apps with AI Studio and Stitch', st: 'Mockups and mini apps',
    desc: 'Sketch a work screen first with a mockup tool, then use the app build feature to make a working mini app.',
    fl: {
      box: 'Mockup/app tool',
      e: [
        'U:Screen idea > C:Screen mockup : generate',
        'C:Screen mockup > C:Mini app : build as app',
        'X:Gemini > C:Mini app : generate features',
        'C:Mini app > U:Preview : check'
      ]
    },
    ex: [
      'Describe a work screen in words and get a mockup',
      'Get the mockup as HTML and CSS code',
      'Build a mini app with AI Studio\'s app builder',
      'Attach the mockup to a coding agent brief',
      'Compare mobile and desktop layouts',
      'Get three mockups and pick one with department input',
      'Save the mockup\'s colors and fonts as a list of rules'
    ],
    out: 'Screen mockup, mini app',
    kw: ['Stitch', 'AI Studio', 'mockup', 'wireframe', 'UI design', 'prototype'],
    pub: [
      { j: 'City hall, IT team / IT officer', c: 'Turns an improved citizen application screen into a mockup to agree requirements with the contractor.' },
      { j: 'Public corporation, planning team / Planning officer', c: 'Shows a mockup of a new service screen to gather internal feedback.' }
    ],
    pri: [
      { j: 'App company / Service planner', c: 'Makes mockups of new feature screens for user testing before development starts.' },
      { j: 'Solo founder / Owner', c: 'Gets a landing page mockup and builds the real page with a coding agent.' }
    ]
  },
  VC7: {
    t: 'Tools that read Excel or CSV and download a cleaned file', st: 'Excel/CSV cleanup tool',
    desc: 'Build a tool through chat that reads an uploaded file in the browser, cleans it and lets you download a new Excel or CSV file. Check that the file is processed only in your browser and never sent to a server.',
    fl: {
      box: 'Inside the chat AI',
      e: [
        'U:Excel file > C:HTML/CSS/JS : upload',
        'C:HTML/CSS/JS > C:File reader code : convert to table',
        'C:File reader code > C:HTML/CSS/JS : cleaned result',
        'C:HTML/CSS/JS > U:Cleaned file : download'
      ]
    },
    ex: [
      'Upload an Excel file and check column names and row count',
      'Merge several sheets into one table and download it',
      'Find and mark empty cells and duplicate rows',
      'Unify date and amount formats',
      'Split by department and download several files',
      'Show row counts before and after processing',
      'Save as HTML and run it again on your PC with the same file'
    ],
    out: 'HTML file-cleanup tool',
    kw: ['Excel', 'CSV', 'file upload', 'download', 'data cleanup', 'SheetJS', 'consolidation'],
    pub: [
      { j: 'District office, general affairs / General administration officer', c: 'Builds a tool through chat that merges the Excel files each department submits into one table, and uses it every month.' },
      { j: 'Public agency, training team / Training officer', c: 'Uses a tool that flags duplicates and empty cells in trainee lists to cut list-checking time.' }
    ],
    pri: [
      { j: 'Logistics company, operations team / Operations staff', c: 'Merges order files from each client, unifies formats and downloads a CSV for dispatch.' },
      { j: 'Private academy / Administrator', c: 'Uses a tool that merges each class\'s attendance Excel into a monthly summary file.' }
    ]
  },
  VC3: {
    t: 'Sharing and publishing chat output as a link', st: 'Share as a link',
    desc: 'Share results as a link with the chat service\'s share and publish features, and upload the HTML file to static hosting to get a web address.',
    fl: {
      box: 'Inside the chat AI',
      e: [
        'C:Artifact > X:Share link : publish',
        'C:Artifact > C:HTML file : download',
        'C:HTML file > X:Static hosting : upload',
        'X:Static hosting > U:Coworker browser : open by URL'
      ]
    },
    ex: [
      'Create a share link for an Artifact or Canvas',
      'Check the sharing scope (only me, anyone with the link, public)',
      'Deploy by dragging the HTML file onto Netlify Drop',
      'Upload to GitHub Pages for a fixed address',
      'Upload a revised version and keep the same address',
      'Show the author and last updated date on the shared page',
      'Turn the published address into a QR code for a notice'
    ],
    out: 'Share link, live URL',
    kw: ['sharing', 'publishing', 'link', 'Netlify Drop', 'GitHub Pages', 'deployment'],
    pub: [
      { j: 'Community service center / Officer', c: 'Makes a program information page and texts the link to residents.' },
      { j: 'Education office training institute / Training officer', c: 'Shares training materials as a page link so trainees can read them on their phones.' }
    ],
    pri: [
      { j: 'Cafe founder / Owner', c: 'Publishes a menu page and posts it in the shop as a QR code.' },
      { j: 'Club organizer / Treasurer', c: 'Shares an event schedule and sign-up page as a link.' }
    ]
  },
  VC8: {
    t: 'Making information pages and HTML slides', st: 'Info pages and slides',
    desc: 'Make event notices, project overviews and lecture slides as a single HTML page, check it on a phone screen, then share it. You send one link instead of a document file.',
    fl: {
      box: 'Inside the chat AI',
      e: [
        'U:Event materials > C:HTML/CSS/JS : paste',
        'C:HTML/CSS/JS > C:Share link : publish',
        'C:Share link > U:Phone screen : open via QR',
        'C:HTML/CSS/JS > U:PDF file : print to PDF'
      ]
    },
    ex: [
      'An event page with schedule, venue and contact',
      'A one-page project overview with table-of-contents links',
      'HTML slides you move through with the arrow keys',
      'Check text size and line breaks at phone width',
      'Write the organization\'s color and font rules in the brief',
      'Set up a separate layout for printing and saving as PDF',
      'Distribute with a share link and QR code'
    ],
    out: 'Information page, HTML slides',
    kw: ['information page', 'HTML slides', 'presentation', 'one-pager', 'QR', 'mobile'],
    pub: [
      { j: 'Community service center / Officer', c: 'Makes a page about resident programs and shares it by text message and QR code.' },
      { j: 'Civil service training institute / Instructor', c: 'Makes lecture slides in HTML so trainees can review them on their phones.' }
    ],
    pri: [
      { j: 'Training company / Instructor', c: 'Makes course materials as HTML slides and sends trainees a single link.' },
      { j: 'Cafe founder / Owner', c: 'Makes a page about a new menu and links it to the QR code in the shop.' }
    ]
  },
  VC9: {
    t: 'Exporting chat output as a single file for distribution', st: 'Export as one file',
    desc: 'Export the chat output code as one HTML file, make it open without external library addresses, and distribute it through shared folders, messengers or the internal bulletin board. Mark each revision with a version and date.',
    fl: {
      box: 'My PC',
      e: [
        'X:Chat AI service > C:HTML file : save code',
        'X:Library CDN > C:HTML file : embed in file',
        'C:HTML file > C:Shared folder : copy',
        'C:Shared folder > U:Staff PC screen : double-click'
      ]
    },
    ex: [
      'Save the output code as an HTML file',
      'Find external library (CDN) addresses and list them',
      'Put the libraries inside the file so it opens without the internet',
      'Disconnect from the internet, open the file and check it works',
      'Show the version, last updated date and owner at the bottom of the page',
      'Upload to a shared folder and share a shortcut',
      'Bring the file into an air-gapped PC (Korean public agencies keep work PCs on a network separated from the internet) (반입)'
    ],
    out: 'Single HTML file for distribution',
    kw: ['single file', 'HTML export', 'CDN', 'offline', 'distribution', 'shared folder', 'air-gapped transfer'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Turns a calculation tool made in chat into a file with no external addresses and distributes it on an internal network shared folder.' },
      { j: 'City hall, tax division / Tax officer', c: 'Adds a version label to a tax calculation tool so the whole team uses the same file.' }
    ],
    pri: [
      { j: 'Manufacturer, quality team / Quality officer', c: 'Makes an inspection log tool as a single file and uses it on shop-floor PCs with no internet.' },
      { j: 'Hospital, patient accounts / Billing staff', c: 'Distributes a payment guide tool as a file and dates each revision.' }
    ]
  },
  VC4: {
    t: 'Loading public data and CORS', st: 'Public data and CORS',
    desc: 'Load public JSON or CSV data that needs no key into chat output, and understand CORS, the browser rule that blocks requests to other sites.',
    fl: {
      box: 'Chat AI output',
      e: [
        'U:Search filters > C:HTML/JS : input',
        'C:HTML/JS > X:Public JSON/CSV : fetch',
        'X:Public JSON/CSV > C:HTML/JS : data',
        'C:HTML/JS > U:Table/chart : display'
      ]
    },
    ex: [
      'Load public JSON and show it as a table',
      'Upload a CSV file and make a chart',
      'Compare sites that give CORS errors with sites that work',
      'Take data by pasting or file upload instead',
      'When to move APIs that need a key to the next stage',
      'Download file data from Korea\'s public data portal (data.go.kr) and paste it in',
      'Show the reference date of the loaded data on screen'
    ],
    out: 'Data lookup tool',
    kw: ['fetch', 'JSON', 'CSV', 'CORS', 'public API', 'data loading'],
    pub: [
      { j: 'City hall, statistics team / Statistics officer', c: 'Builds a tool that makes regional charts from uploaded public statistics CSV files.' },
      { j: 'District office, planning team / Officer', c: 'Makes a project status table from public data files for use in reports.' }
    ],
    pri: [
      { j: 'Retailer / Merchandiser', c: 'Builds a tool that shows trend charts by product when you upload sales data CSV.' },
      { j: 'Training company / Instructor', c: 'Demonstrates CORS errors in class to explain why a server is needed.' }
    ]
  },
  VC10: {
    t: 'Showing location and statistics data as maps and charts', st: 'Maps and charts',
    desc: 'Upload a CSV with addresses, coordinates and figures to make a map view and chart screens. Map tiles load from outside, so compare cases where they are blocked inside the chat output with opening the saved file.',
    fl: {
      box: 'Inside the chat AI',
      e: [
        'U:CSV file > C:HTML/CSS/JS : upload',
        'X:Map tiles > C:HTML/CSS/JS : base map',
        'C:HTML/CSS/JS > U:Map/chart : display',
        'C:HTML/CSS/JS > U:Image file : save screen'
      ]
    },
    ex: [
      'Make a facility location map from a CSV with coordinates',
      'Show figures by region as bar and line charts',
      'Show details when a map marker is clicked',
      'Change the chart by district or neighborhood selection',
      'How to get coordinates when you only have addresses, and the limits',
      'Find the cause when map tiles do not appear',
      'Save the screen as an image to put in a report'
    ],
    out: 'Map and chart view',
    kw: ['map', 'chart', 'visualization', 'Leaflet', 'Chart.js', 'coordinates', 'public data'],
    pub: [
      { j: 'District office, welfare division / Welfare officer', c: 'Makes a map from a CSV of senior centers and welfare centers to guide people during consultations.' },
      { j: 'City hall, statistics team / Statistics officer', c: 'Turns population statistics by neighborhood into a chart view and captures it for reports.' }
    ],
    pri: [
      { j: 'Franchise headquarters / Store development manager', c: 'Shows franchise locations and sales on a map to review new store sites.' },
      { j: 'Real estate agency / Owner', c: 'Puts listing coordinates on a map and uses it as a customer consultation screen.' }
    ]
  },
  VC11: {
    t: 'Building a lookup screen first from an API response sample', st: 'Screens from samples',
    desc: 'APIs that need a key are hard to call directly inside chat output. Paste a response sample (JSON or XML) to build the lookup screen first, and mark the point where the real call will be handed to a coding agent or server stage.',
    fl: {
      box: 'Inside the chat AI',
      e: [
        'X:API spec > U:Response sample : copy',
        'U:Response sample > C:HTML/CSS/JS : paste',
        'C:HTML/CSS/JS > C:Call stub : separate',
        'C:HTML/CSS/JS > U:Lookup screen : display'
      ]
    },
    ex: [
      'Copy a response sample from an API spec on Korea\'s public data portal (data.go.kr)',
      'Paste a JSON or XML sample and get its field structure explained',
      'Build list and detail screens from the sample',
      'Separate the spot for the real call into a single function',
      'Understand why a key must not go into the output code',
      'Attach the finished screen and sample to a coding agent brief',
      'List the steps to fix things when field names differ between the sample and the real response'
    ],
    out: 'Sample-based lookup screen',
    kw: ['API response', 'JSON', 'XML', 'sample data', 'mockup', 'public data', 'screen design'],
    pub: [
      { j: 'City hall, transportation division / Officer', c: 'Builds a bus arrival screen from an API response sample first, then asks the IT team to connect it.' },
      { j: 'Public agency, contracts team / Contracts officer', c: 'Builds a list screen from a tender notice API sample to settle which fields are needed.' }
    ],
    pri: [
      { j: 'Travel startup / Product planner', c: 'Builds a search results screen from a flight API sample to agree requirements with developers.' },
      { j: 'Retailer / Merchandiser', c: 'Makes a lookup screen mockup from an inventory API sample for review before development.' }
    ]
  },
  VC5: {
    t: 'Storage limits of chat output and the next stage', st: 'Storage limits',
    desc: 'Chat output cannot create a shared database or login on its own. Learn how to get by with browser storage and file export, and decide when to move to an app builder or a coding agent.',
    fl: {
      box: 'Chat AI output',
      e: [
        'U:Input data > C:HTML/JS : input',
        'C:HTML/JS > C:Browser storage : localStorage',
        'C:HTML/JS > U:JSON file : export',
        'C:HTML/JS > X:Builder or agent : move shared DB'
      ]
    },
    ex: [
      'Check the scope of browser storage (your browser only)',
      'Move data with JSON export and import',
      'Connect an Apps Script web app that uses Google Sheets as storage',
      'List the conditions that make sharing and login necessary',
      'Choose the next stage: app builder or coding agent',
      'Download data saved in the browser as CSV',
      'Load the JSON file on another PC and continue working'
    ],
    out: 'Stage transition decision table',
    kw: ['storage', 'DB', 'login', 'limits', 'export', 'Google Sheets'],
    pub: [
      { j: 'District office, general affairs / General administration officer', c: 'Needed a supply request tool the whole department could use, so switched storage to Google Sheets.' },
      { j: 'Public agency, training team / Training officer', c: 'Moved on to the coding agent course once trainee submissions had to be collected.' }
    ],
    pri: [
      { j: 'Small business / Owner', c: 'Moved to an app builder because several staff needed to see booking records.' },
      { j: 'Training company / Instructor', c: 'Explains how to choose the next stage in the last session of the intro course.' }
    ]
  },
  VC12: {
    t: 'Collecting form input by email, file or online form', st: 'Collecting form input',
    desc: 'Learn ways to collect input from many people without a database. Compare sending input as an email body, downloading it as a file to submit, and passing it to Google Forms responses, then set a consolidation procedure.',
    fl: {
      box: 'Inside the chat AI',
      e: [
        'U:Input > C:Input form : fill in',
        'C:Input form > U:Email : create body',
        'C:Input form > U:Submission file : download',
        'C:Input form > X:Google Forms : send response',
        'U:Submission file > C:Merge screen : upload several'
      ]
    },
    ex: [
      'Make filling in the form create an email body',
      'Download the input as a JSON or CSV file and submit it',
      'A merge screen that combines several submitted files into one table',
      'Pass responses with a pre-filled Google Forms link',
      'Reduce bad submissions with required fields and format checks',
      'Cut down personal data fields',
      'List the number of users and frequency at which a DB becomes necessary'
    ],
    out: 'Input form and consolidation procedure',
    kw: ['input form', 'consolidation', 'email submission', 'mailto', 'Google Forms', 'file submission', 'no database'],
    pub: [
      { j: 'District office, general affairs / General administration officer', c: 'Makes a supply request form, receives submission files and merges them at once on the merge screen.' },
      { j: 'Education office / School supervisor', c: 'Receives status forms from each school by email and the officer in charge consolidates them.' }
    ],
    pri: [
      { j: 'Club organizer / Treasurer', c: 'Passes event sign-up forms to Google Forms responses and manages the list in a sheet.' },
      { j: 'Interior design firm / Sales rep', c: 'Receives consultation request forms by email and forwards them to the person who prepares quotes.' }
    ]
  },
  VC13: {
    t: 'Storage features of chat output and shared data scope', st: 'Storage and sharing',
    desc: 'Some chat services let their output store data. Tell apart storage only you see from storage everyone who opens the link sees, check which account and service keeps the data, and set rules for keeping personal data out.',
    fl: {
      box: 'Inside the chat service',
      e: [
        'U:Input value > C:HTML/CSS/JS : save',
        'C:HTML/CSS/JS > C:Personal storage : only me',
        'C:HTML/CSS/JS > C:Shared storage : everyone',
        'C:Shared storage > U:Other users : same data'
      ]
    },
    ex: [
      'Check which services offer storage for output and which do not',
      'Test the difference between personal and shared storage',
      'Open the link with another account and check what data is visible',
      'Compare browser storage (localStorage) with service storage',
      'How to export and delete stored data',
      'Set rules for keeping personal data and internal documents out',
      'Read the data retention clauses in the service terms'
    ],
    out: 'Storage method checklist',
    kw: ['storage', 'shared data', 'persistent storage', 'artifact storage', 'localStorage', 'data scope', 'personal data'],
    pub: [
      { j: 'Public agency, information security team / Security officer', c: 'Checks the shared storage scope of chat output built by staff and issues rules against entering personal data.' },
      { j: 'Civil service training institute / Training operations officer', c: 'Runs voting and feedback tools on shared storage during training and deletes the data afterwards.' }
    ],
    pri: [
      { j: 'Startup / Operations manager', c: 'Runs a team meeting voting tool on shared storage and documents where the data is kept.' },
      { j: 'Training company / Instructor', c: 'Makes an in-class quiz scoreboard on shared storage and uses numbers instead of trainee names.' }
    ]
  },
  VC6: {
    t: 'Tools that call AI inside the chat service', st: 'AI calls in chat',
    desc: 'Build tools that call AI from inside the output using a feature the chat service provides. Usage and conditions are tied to the service account, so this has limits for public use.',
    fl: {
      box: 'Inside the chat service',
      e: [
        'U:Any text > C:Artifact : input',
        'C:Artifact > X:Chat service AI : call on my account',
        'X:Chat service AI > C:Artifact : result',
        'C:Artifact > U:Summary/draft : display'
      ]
    },
    ex: [
      'An AI tool that summarizes and classifies input text',
      'A document draft generator with a choice of writing style',
      'Check whose account usage the tool runs on when shared',
      'When to move to a server-based setup for public use',
      'A tool that pulls a to-do list from meeting notes',
      'A tool that masks names and phone numbers in citizen complaints and summarizes them',
      'Show AI results in a table and add a copy button'
    ],
    out: 'Mini app with AI features',
    kw: ['AI app', 'artifact AI', 'canvas app', 'summarizer', 'generative AI app'],
    pub: [
      { j: 'City hall, civil affairs division / Civil complaints officer', c: 'Builds an internal tool that gives the type and a draft reply when you paste in a complaint.' },
      { j: 'Provincial government, spokesperson\'s office / Press officer', c: 'Shares a tool with the team that gives three social media captions for a press release.' }
    ],
    pri: [
      { j: 'Online store, customer service team / Support agent', c: 'Builds a support assistant that classifies inquiries and drafts replies.' },
      { j: 'Content agency / Writer', c: 'Uses a tool within the team that suggests titles from a proposal.' }
    ]
  },
  VC14: {
    t: 'Tools that turn any text into a draft in a set format', st: 'Any text to form draft',
    desc: 'Build a tool that sends pasted text or speech transcription to an external LLM API and returns a draft that fits a quote, official document or report format, plus an email text. External API calls and the microphone may be blocked inside the chat output, so download it as an HTML file and enter your key on your own PC.',
    fl: {
      box: 'Browser on my PC',
      e: [
        'U:Text or speech > C:HTML/CSS/JS : paste',
        'C:HTML/CSS/JS > X:LLM API (key) : with format',
        'X:LLM API (key) > C:HTML/CSS/JS : results by field',
        'C:HTML/CSS/JS > U:Form draft : fill and output',
        'C:HTML/CSS/JS > U:Email text : copy'
      ]
    },
    ex: [
      'Define the form fields (quote, official document, report) in JSON',
      'Write a prompt that splits pasted text into the fields',
      'Take input through speech-to-text (STT)',
      'Enter the OpenRouter key at run time and keep it out of the code',
      'Check whether external calls are blocked inside the output, and run it as a file',
      'Show the filled draft as a table and a print view',
      'Copy the email text or pass it to a mail app',
      'Flag empty fields and estimated values for checking'
    ],
    out: 'Form draft generator',
    kw: ['form conversion', 'draft generation', 'quote', 'official document', 'report template', 'OpenRouter', 'STT', 'voice input', 'email draft'],
    pub: [
      { j: 'District office, civil affairs division / Civil complaints officer', c: 'Pastes phone consultation notes to get a draft complaint handling report and a reply email.' },
      { j: 'City hall, general affairs / General administration officer', c: 'Feeds in dictated meeting remarks to fill the fields of an official document draft, then reviews it.' }
    ],
    pri: [
      { j: 'Interior design firm / Sales rep', c: 'Enters on-site consultation notes to get a draft quote with fields filled in and a customer email.' },
      { j: 'Facility maintenance company / Field technician', c: 'Speaks the work details to create a job completion report draft and sends it to the office.' }
    ]
  },
  VC15: {
    t: 'AI tools that extract fields from documents into a table', st: 'Fields to a table',
    desc: 'Use the AI call a chat service provides inside its output to extract set fields from documents such as notices, application forms and receipts and fill a table. Fix the output format as JSON so it moves straight into a table or file, and check extracted values against the original.',
    fl: {
      box: 'Inside the chat AI',
      e: [
        'U:Document/photo > C:HTML/CSS/JS : upload',
        'C:HTML/CSS/JS > C:Built-in AI call : field list',
        'C:Built-in AI call > C:HTML/CSS/JS : JSON result',
        'C:HTML/CSS/JS > U:Comparison table : fill and show',
        'C:HTML/CSS/JS > U:CSV file : download'
      ]
    },
    ex: [
      'Define the fields to extract and their formats (dates, amounts) in a table',
      'Write a prompt that fixes the output to JSON',
      'Put in several notices and make a comparison table',
      'Extract amount fields from photos of receipts and statements',
      'Leave fields blank when the value is not in the original',
      'Download the extracted table as CSV',
      'Check 10 samples against the originals'
    ],
    out: 'Field extraction table tool',
    kw: ['information extraction', 'structured output', 'JSON', 'table filling', 'document analysis', 'receipts', 'notices'],
    pub: [
      { j: 'City hall, economic policy division / Officer', c: 'Extracts eligibility, amount and deadline from several support program notices into a comparison table.' },
      { j: 'Public agency, accounting team / Accountant', c: 'Extracts amounts and dates from travel expense receipt photos to draft a settlement table.' }
    ],
    pri: [
      { j: 'Accounting firm / Office manager', c: 'Extracts items and amounts from client statements into a table for data entry.' },
      { j: 'Recruitment agency / Recruiter', c: 'Extracts experience and qualifications from resumes into a candidate comparison table.' }
    ]
  },
  VG1: {
    t: 'Building a first screen with an app builder', st: 'First screen',
    desc: 'Describe your requirements to get a working app screen, then download the generated code and run it on your own PC.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'U:Requirements > C:Generated app : describe',
        'C:Generated app > U:Preview : check',
        'U:Preview > C:Generated app : request changes',
        'C:Generated app > X:My PC : download code'
      ]
    },
    ex: [
      'Write the first prompt from a one-page requirements sheet',
      'Go back and forth on screen change requests',
      'Compare the same requirements in two services',
      'Export the generated code to GitHub',
      'Run it on your PC with npm install and npm run dev',
      'Ask for sample data instead of an empty screen',
      'Get the generated file structure and the role of key files explained'
    ],
    out: 'A working app screen',
    kw: ['app builder', 'Lovable', 'Replit', 'Bolt', 'v0', 'Base44', 'no-code'],
    pub: [
      { j: 'City hall, public relations team / Events officer', c: 'Makes a mockup of a festival sign-up screen to settle requirements before outsourcing.' },
      { j: 'Public agency, IT team / IT officer', c: 'Turns ideas for internal work apps into screens to gather feedback from staff.' }
    ],
    pri: [
      { j: 'Early-stage startup / Founder', c: 'Builds the service screens in one day and demos them at an investor meeting.' },
      { j: 'Marketing team / Events manager', c: 'Makes several versions of an event page mockup for the team to choose from.' }
    ]
  },
  VG8: {
    t: 'Moving screen mockups into an app builder', st: 'Mockups into apps',
    desc: 'Put screens made with a mockup tool or captured images into an app builder to turn them into working screens, then compare the result with the mockup and fix the differences.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'U:Mockup image > C:Generated screen : attach',
        'X:Mockup tool > C:Generated screen : import',
        'C:Generated screen > U:Preview : compare',
        'U:Preview > C:Generated screen : fix differences'
      ]
    },
    ex: [
      'Attach a mockup image to build the first screen',
      'Write color, font and spacing rules in the brief',
      'Compare the mockup and the result side by side',
      'Check the mobile layout separately',
      'Ask to fix shared elements (header, buttons) all at once',
      'Redesign a captured screen from an existing work system',
      'Ask for empty-list and error screens the mockup does not include'
    ],
    out: 'App screen that matches the mockup',
    kw: ['mockup', 'design handoff', 'Figma', 'Stitch', 'UI implementation'],
    pub: [
      { j: 'City hall, IT team / IT officer', c: 'Turns a contractor\'s mockup into app screens as a prototype for requirements discussions.' },
      { j: 'Public corporation, public relations team / Designer', c: 'Makes a campaign page mockup into a working screen for internal review.' }
    ],
    pri: [
      { j: 'Design agency / Designer', c: 'Delivers client-approved mockups as working prototypes right away.' },
      { j: 'Startup / Product planner', c: 'Turns screen specifications into app screens for user testing before development starts.' }
    ]
  },
  VG10: {
    t: 'Managing work in an app builder: plans, rollback, rules', st: 'Plans and rollback',
    desc: 'Instead of letting the app builder build right away, get a plan first, roll back with version history, and write design and terminology standards in the project rules. Also check how many credits each request uses.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'U:Requirements > C:Plan : ask for plan',
        'C:Project rules > C:Plan : apply standards',
        'C:Plan > C:Generated code : run once approved',
        'C:Generated code > U:Preview screen : display',
        'U:Preview screen > C:Generated code : roll back'
      ]
    },
    ex: [
      'Get the build order first in plan or chat mode',
      'Write design and terminology standards in project knowledge or rules',
      'Roll back to an earlier state from version history',
      'Ask for one feature at a time to narrow the scope of changes',
      'Select a screen element directly and ask for a partial change',
      'Check the credits used per request',
      'When the same error keeps coming back, summarize it and restart in a new chat'
    ],
    out: 'Project rules document, work log',
    kw: ['plan mode', 'rollback', 'project rules', 'credits', 'version history', 'project knowledge'],
    pub: [
      { j: 'Public corporation, planning team / Planning officer', c: 'While prototyping a new service, writes the organization\'s terms and color rules in the project rules to keep screens consistent.' },
      { j: 'Civil service training institute / Training planner', c: 'Adds steps for rolling back screens broken during practice with version history to the course materials.' }
    ],
    pri: [
      { j: 'Startup / Product planner', c: 'Reviews the plan first, then runs it, to use fewer credits.' },
      { j: 'Marketing team / Content manager', c: 'Puts brand rules into project knowledge to keep the copy tone the same on every page.' }
    ]
  },
  VG2: {
    t: 'Built-in publishing and connecting a domain', st: 'Publishing and domains',
    desc: 'Create an address with the service\'s built-in publish feature and set the visibility, domain and rollback to earlier versions.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'C:Generated app > C:Publish feature : publish',
        'C:Publish feature > X:Service URL : make public',
        'X:Domain > X:Service URL : connect',
        'X:Service URL > U:Users : visit'
      ]
    },
    ex: [
      'Create a public address with the publish button',
      'Set public or private and access restrictions',
      'Connect your own domain',
      'Roll back to an earlier version',
      'Check publishing limits for each pricing plan',
      'Get a colleague to review via the preview address before publishing',
      'Show the operating organization, contact and last updated date in the published app'
    ],
    out: 'Published app address',
    kw: ['publishing', 'publish', 'domain', 'deployment', 'visibility'],
    pub: [
      { j: 'District office, culture and sports division / Events officer', c: 'Publishes an event information app and connects a subdomain of the agency.' },
      { j: 'Public corporation, public relations team / PR officer', c: 'Makes a campaign page public only for the campaign period and sets it to private afterwards.' }
    ],
    pri: [
      { j: 'Solo founder / Owner', c: 'Publishes a service introduction app and connects the company domain.' },
      { j: 'Marketing agency / Account executive', c: 'Publishes a campaign app for each client and rolls back to the pre-change version when needed.' }
    ]
  },
  VG7: {
    t: 'Comparing and choosing app builders', st: 'Choosing a builder',
    desc: 'Try several app builders with the same requirements and compare the output, code ownership, DB, pricing and publishing terms to pick the right service for the course and the organization.',
    fl: {
      box: 'Comparison exercise',
      e: [
        'U:Same brief > C:Service A : input',
        'U:Same brief > C:Service B : input',
        'C:Service A > U:Comparison table : results, cost',
        'C:Service B > U:Comparison table : results, cost'
      ]
    },
    ex: [
      'Compare three services with the same one-page requirements',
      'Code export and GitHub integration',
      'Compare built-in DB and login options',
      'Compare pricing plans and usage limits',
      'Make a selection criteria table for training use',
      'Compare text size and color contrast in the generated output',
      'Check the service terms for where data is stored'
    ],
    out: 'Service comparison table',
    kw: ['comparison', 'selection criteria', 'pricing', 'code ownership', 'service selection'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Compares app builders for staff training on security and pricing criteria and picks one.' },
      { j: 'Civil service training institute / Training planner', c: 'Sums up the services to use in each course in a comparison table and gives it to instructors.' }
    ],
    pri: [
      { j: 'Startup / CTO', c: 'Picks a service for building the MVP based on code ownership and scalability.' },
      { j: 'Training company / Curriculum manager', c: 'Maintains a comparison table of recommended services for intro and intermediate courses.' }
    ]
  },
  VG11: {
    t: 'Running a published app: mobile checks, link previews, visitor stats', st: 'Running the app',
    desc: 'Check the published app on a phone, set the title and image shown when the link is shared, and review visit records. Collect user feedback and apply it in the next round of changes.',
    fl: {
      box: 'Service hosting',
      e: [
        'C:Published app > U:Phone screen : visit',
        'C:Published app > U:Messenger link : link preview',
        'C:Published app > X:Visitor stats : visit log',
        'U:Phone screen > C:Feedback form : send feedback',
        'C:Feedback form > C:Published app : apply changes'
      ]
    },
    ex: [
      'Check the published app on phone and tablet screens',
      'Set the title, description and preview image shown when the link is shared',
      'Tidy up the favicon and page title',
      'Distribute the published address as a QR code',
      'Connect a visitor statistics tool and add a privacy notice',
      'Attach a feedback form at the bottom of the app',
      'Turn the feedback into a list of change requests'
    ],
    out: 'Operations checklist',
    kw: ['mobile', 'link preview', 'OG image', 'QR', 'visitor statistics', 'feedback'],
    pub: [
      { j: 'Community service center / Officer', c: 'Checks a resident information app on a phone and posts it on the notice board as a QR code.' },
      { j: 'Public corporation, public relations team / PR officer', c: 'Sets the link preview image for a campaign app and checks its effect by visit counts.' }
    ],
    pri: [
      { j: 'Cafe founder / Owner', c: 'Sets the menu app so a photo of the shop appears when the link is sent by messenger.' },
      { j: 'Training company / Operations staff', c: 'Attaches a feedback form to a course information app to collect trainee requests.' }
    ]
  },
  VG3: {
    t: 'External API integration and secrets in app builders', st: 'APIs and secrets',
    desc: 'Attach external data with the service\'s API integration feature and put the key in the service\'s secret store. Check whether the service creates a server function that hides the key.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'U:Lookup screen > C:Server function : request',
        'C:Secret store > C:Server function : key',
        'C:Server function > X:External API : request with key',
        'X:External API > U:Lookup screen : result'
      ]
    },
    ex: [
      'Ask for a public data API integration',
      'Register the key as a service secret',
      'Check whether the generated code exposes the key to the browser',
      'Check whether a server function (Edge Function) was created',
      'Add rate limits and error handling',
      'Attach an API response example and ask for a screen layout',
      'Set a message to show when the API does not respond'
    ],
    out: 'App with external data attached',
    kw: ['API integration', 'secrets', 'server function', 'Edge Function', 'public data'],
    pub: [
      { j: 'City hall, transportation division / Officer', c: 'Builds an information app with a bus arrival API and checks whether the key is exposed.' },
      { j: 'District office, environment division / Officer', c: 'Makes an alert screen for each school with a fine dust API and shares it with the education office.' }
    ],
    pri: [
      { j: 'Travel startup / Product planner', c: 'Builds a trip planning app prototype with weather and exchange rate APIs.' },
      { j: 'Real estate agency / Owner', c: 'Builds a listing comparison screen with the public real estate transaction price API.' }
    ]
  },
  VG9: {
    t: 'Connecting spreadsheet data to an app builder', st: 'Spreadsheet connection',
    desc: 'Connect the Google Sheets or Excel data you already use to screens made with an app builder to create lookup, search and filter screens.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'X:Google Sheets > C:Generated app : connect',
        'U:Search filters > C:Generated app : input',
        'C:Generated app > U:List/filter view : display'
      ]
    },
    ex: [
      'Connect Google Sheets as the data source',
      'Upload an Excel file as the initial data',
      'Build search, filter and sort screens',
      'Check how often sheet changes appear on screen',
      'Set visibility and hide personal data columns',
      'Clean up sheet column names to reduce connection errors',
      'Set sheet edit permissions and app read permissions separately'
    ],
    out: 'Lookup app connected to a sheet',
    kw: ['Google Sheets', 'Excel', 'data connection', 'lookup screen', 'spreadsheet'],
    pub: [
      { j: 'District office, welfare division / Welfare officer', c: 'Connects a sheet of welfare facilities to build a search screen for residents.' },
      { j: 'Education office / School supervisor', c: 'Shares a lookup app connected to a sheet of program status by school with the officers in charge.' }
    ],
    pri: [
      { j: 'Real estate agency / Owner', c: 'Builds a listing search screen for customers connected to the listings sheet.' },
      { j: 'Private academy / Director', c: 'Connects the class timetable sheet to build a lookup screen for parents.' }
    ]
  },
  VG12: {
    t: 'Sending app events as email and messenger alerts', st: 'Email and chat alerts',
    desc: 'Send an email or messenger alert when an app event happens, such as a new application or a status change. Keep the sending service key in secrets, and check sending limits and recipient consent.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'U:Application form > C:Server function : submit',
        'C:Secrets > C:Server function : provide key',
        'C:Server function > X:Email API : send request',
        'C:Server function > X:Messenger hook : send alert'
      ]
    },
    ex: [
      'Email the officer in charge when an application comes in',
      'Register the email service key as a secret',
      'Send messenger alerts with Slack or Teams webhooks',
      'Combine sheet logging and alerts with an automation service (Make, Zapier)',
      'Put the application number and a confirmation link in the alert text',
      'Check the daily sending limit and whether mail lands in spam',
      'Add consent items and an unsubscribe link'
    ],
    out: 'App with alerts connected',
    kw: ['alerts', 'email sending', 'webhook', 'Slack', 'automation', 'Make', 'Zapier'],
    pub: [
      { j: 'District office, culture and sports division / Events officer', c: 'Sets up a messenger alert to the officer in charge when an event application comes in.' },
      { j: 'Education office / School supervisor', c: 'Sets a confirmation email to go out automatically when each school finishes submitting.' }
    ],
    pri: [
      { j: 'Private academy / Director', c: 'Sends a messenger alert to the instructor when a consultation booking comes in.' },
      { j: 'Online store, operations team / Operations staff', c: 'Sends an email alert to the person in charge when stock drops below a threshold.' }
    ]
  },
  VG4: {
    t: 'Generating full-stack apps with a DB and login', st: 'Full-stack app',
    desc: 'Build an app with application, record and admin screens using the DB and login the service connects, and check that the access rules are set correctly.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'U:Login > C:Generated app : authenticate',
        'C:Generated app > X:Supabase DB : save',
        'X:Access rules > X:Supabase DB : own data only',
        'X:Supabase DB > U:App/admin screen : view'
      ]
    },
    ex: [
      'Build an app with application, list and admin screens',
      'Connect Supabase or Firebase and check the tables',
      'Login and separating data per user',
      'Check access rules (RLS, security rules)',
      'Data export and backup',
      'Separate screens that work without login from screens that need it',
      'An admin feature to add and delete test data'
    ],
    out: 'App with a DB and login',
    kw: ['full stack', 'DB', 'login', 'Supabase', 'Firebase', 'RLS', 'admin'],
    pub: [
      { j: 'Civil service training institute / Training operations officer', c: 'Builds an app for training applications, approvals and downloading the participant list, and pilots it.' },
      { j: 'District office, welfare division / Counselor', c: 'Builds an app for taking consultation bookings and assigning staff, and checks its access rules.' }
    ],
    pri: [
      { j: 'SME, HR team / Recruiter', c: 'Builds an app for receiving and scoring applications with separate permissions for each interviewer.' },
      { j: 'Private academy / Director', c: 'Builds an app for student attendance and counseling records and shares it with instructors.' }
    ]
  },
  VG5: {
    t: 'Checking a generated app and taking over its code', st: 'App check and handover',
    desc: 'Check the code, data and costs of an app made with a service, and if needed, download the code and keep managing it with a coding agent.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'C:Generated app > U:Checklist : code, data, cost',
        'C:Generated app > X:GitHub : export code',
        'X:GitHub > X:Coding agent : continue managing'
      ]
    },
    ex: [
      'Export the code and tidy up the repository',
      'Check where data and files are stored',
      'Estimate monthly cost and usage',
      'Continue making changes with a coding agent',
      'A migration plan in case the service shuts down or changes its pricing',
      'Clean up unused tables, functions and keys',
      'Write handover documents for the next person in charge'
    ],
    out: 'Handover checklist',
    kw: ['code handover', 'migration', 'cost', 'maintenance', 'vendor lock-in'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Takes over apps built by staff with a service and moves them to the agency\'s repository and servers.' },
      { j: 'City hall, audit office / Auditor', c: 'Reviews each department\'s use of external services and where their data is stored.' }
    ],
    pri: [
      { j: 'Startup / CTO', c: 'After the MVP, downloads the code and moves it to the development team\'s repository.' },
      { j: 'IT consultancy / Consultant', c: 'Sets up a maintenance plan for a client\'s vibe-coded apps.' }
    ]
  },
  VG13: {
    t: 'Work apps with role-based permissions and approval flows', st: 'Roles and approvals',
    desc: 'Build a work app that splits roles such as applicant, approver and admin, with statuses that move through received, under review, approved and rejected. Check that the access rules restrict the screens and data each role can see.',
    fl: {
      box: 'Inside the app builder',
      e: [
        'U:Applicant screen > C:Access rules : save request',
        'C:Access rules > X:Supabase DB : save by role',
        'X:Supabase DB > C:Access rules : read',
        'C:Access rules > U:Approver screen : pending list',
        'U:Approver screen > C:Access rules : approve/reject'
      ]
    },
    ex: [
      'Make a role table: applicant, approver, admin',
      'Design status values (received, under review, approved, rejected)',
      'Split menus and screens by role',
      'Set access rules so users cannot see other people\'s requests',
      'Keep a history of approvals and rejections and who handled them',
      'Check access with a test account for each role',
      'A list that shows only overdue items'
    ],
    out: 'Work app with roles and an approval flow',
    kw: ['roles', 'permissions', 'approval', 'sign-off', 'workflow', 'status management', 'RLS'],
    pub: [
      { j: 'District office, general affairs / General administration officer', c: 'Builds the flow of purchase request, team leader approval and handling by the purchasing officer as an app and pilots it.' },
      { j: 'Public agency, training team / Training officer', c: 'Sets up external instructor requests to be received only after department head approval and keeps a handling history.' }
    ],
    pri: [
      { j: 'SME, management support team / General affairs', c: 'Runs an app that handles leave and supply requests through role-based approval flows.' },
      { j: 'Construction company, site management team / Site administrator', c: 'Records work permit requests and safety manager approvals in an app.' }
    ]
  }
};
