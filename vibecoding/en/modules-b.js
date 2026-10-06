// English overlay for vibecoding/data.js (modules part B, candidates, presets). Keyed by id. See docs/translation-guide.md.

export const EN = {
  VG6: {
    t: 'Adding AI features with an app builder',
    st: 'Add AI features',
    desc: 'Use the service\'s built-in AI integration to add summarizing, classifying and generating features to your app, and check the cost and where the API key is stored.',
    fl: {
      box: 'Inside app builder',
      e: [
        'U:Any text > C:Generated app : input',
        'C:Generated app > C:AI integration : call',
        'C:AI integration > X:LLM API : service key',
        'X:LLM API > U:Summary, labels : result'
      ]
    },
    ex: [
      'Add a feature that summarizes and classifies input',
      'Save AI responses to the DB and view them as a list',
      'Check that AI calls happen on the server side',
      'Limit the number of calls per user',
      'Make the prompt editable on a settings screen',
      'Add a button so a person edits the AI result before confirming it',
      'Compare response quality using the same 10 inputs'
    ],
    out: 'An app with AI features',
    kw: ['AI features', 'LLM integration', 'summarize', 'classify', 'generative AI app'],
    pub: [
      { j: 'District office, civil affairs / Complaint analysis officer', c: 'Builds a prototype app that sorts incoming citizen complaints and suggests the responsible department.' },
      { j: 'Public agency, training team / Training officer', c: 'Builds an app that summarizes course reviews and shows points to improve.' }
    ],
    pri: [
      { j: 'Online store, customer service / Team lead', c: 'Builds a support app that classifies inquiries and saves draft replies.' },
      { j: 'HR startup / Planner', c: 'Builds a prototype app that summarizes interview notes into the evaluation sheet.' }
    ]
  },
  VG14: {
    t: 'App that turns any text or voice into a form draft',
    st: 'Text/voice to form',
    desc: 'Build an app where users paste or speak notes, emails or call details, and an external text model returns a draft with the blanks of a quote, official document or report form filled in. The model key is kept in the service\'s secrets, and voice is first converted to text with a speech-to-text (STT) model.',
    fl: {
      box: 'Inside app builder',
      e: [
        'U:Any text, voice > C:App screen : input',
        'C:App screen > C:Server function : text and form',
        'C:Server function > X:STT model : voice',
        'C:Server function > X:LLM API (key) : fill form',
        'X:LLM API (key) > C:Server function : filled fields',
        'C:App screen > U:Form draft, mail : output'
      ]
    },
    ex: [
      'Define the blank form fields (title, recipient, date, amount, etc.) in the app',
      'Fill quote fields from pasted notes',
      'Convert microphone input to text with an STT model, then fill the form',
      'Register an OpenRouter key in the service\'s secrets and choose a model',
      'Mark fields that could not be filled as "needs checking"',
      'Export the filled draft to print, copy or an email draft',
      'Add form types (official document, report, quote) as a selection menu'
    ],
    out: 'A form-draft app',
    kw: ['form filling', 'draft', 'STT', 'voice input', 'OpenRouter', 'quote', 'official document', 'structured output'],
    pub: [
      { j: 'District office, civil affairs / Civil servant', c: 'Builds an app that turns pasted phone consultation notes into a draft report on how a citizen complaint was handled.' },
      { j: 'Public agency, facilities team / Facilities officer', c: 'Pilots an app that fills a draft inspection report from on-site findings spoken aloud.' }
    ],
    pri: [
      { j: 'Interior design company / Sales rep', c: 'Pastes customer call notes and gets a draft quote and a follow-up email together.' },
      { j: 'Consulting firm / Manager', c: 'Converts meeting recordings to text and organizes them into a weekly report draft.' }
    ]
  },
  VG15: {
    t: 'Q&A app that answers from your own documents',
    st: 'Q&A on your documents',
    desc: 'Using the service\'s built-in features, build an app where you upload rules, notices and manuals, and questions are answered from the relevant passages with sources shown. Check where the uploaded documents are stored and who can see them.',
    fl: {
      box: 'Inside app builder',
      e: [
        'U:Rules, manuals > C:Document store : upload',
        'U:Question > C:Search function : send question',
        'C:Document store > C:Search function : relevant passages',
        'C:Search function > X:LLM API (key) : passages, question',
        'X:LLM API (key) > C:Search function : answer',
        'C:Search function > U:Sourced answer : display'
      ]
    },
    ex: [
      'Upload rule and notice PDFs to build a document list',
      'Ask the app to find relevant passages and answer from them',
      'Show the source passage and file name under each answer',
      'Set it to say "I don\'t know" for questions not covered by the documents',
      'Check whether documents are re-indexed after you change them',
      'Check where uploaded files are stored and who can access them',
      'Test answer quality with 20 frequently asked questions'
    ],
    out: 'A document-based Q&A app',
    kw: ['Q&A', 'chatbot', 'RAG', 'source citation', 'document search', 'FAQ'],
    pub: [
      { j: 'District office, civil affairs / Civil affairs officer', c: 'Uploads public guides on citizen requests to build a Q&A app for staff and checks the source passages with each answer.' },
      { j: 'Civil service training institute / Training operations', c: 'Uploads public course operation rules and pilots an app that answers trainee questions.' }
    ],
    pri: [
      { j: 'Franchise headquarters / Franchise support', c: 'Uploads the store operations manual to build an app that answers franchisee questions.' },
      { j: 'SaaS company / Customer support', c: 'Uploads help articles and uses the app as an answer search tool for support agents.' }
    ]
  },
  VN1: {
    t: 'Getting tool files from an agent and running them',
    st: 'Get and run tool files',
    desc: 'Describe a task to an agent service, receive a tool as an HTML or Python file, and run it on your PC. Also check the results of the agent running it in its own workspace.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Task description > C:Agent : delegate',
        'C:Agent > C:Test run : runs it',
        'C:Agent > X:My PC : HTML, Python file',
        'X:My PC > U:Run result : check'
      ]
    },
    ex: [
      'Get an HTML tool file from a task description',
      'Get a Python script that cleans up Excel files',
      'Check the run results in the agent\'s workspace',
      'Run the received file on your PC',
      'Send follow-up change requests',
      'Check the list of packages the received Python file needs',
      'Before running, look for delete or external-send actions in the received code'
    ],
    out: 'Tool files',
    kw: ['agent', 'Manus', 'Genspark', 'file generation', 'delegation'],
    pub: [
      { j: 'City hall, general affairs / General administration', c: 'Gets a list-cleanup tool from an agent and uses it for monthly Excel cleanup.' },
      { j: 'Public corporation, planning team / Planning officer', c: 'Gets a script that checks figures in reports and runs it in the department\'s shared folder.' }
    ],
    pri: [
      { j: 'Accounting firm / Office manager', c: 'Gets a script that organizes files by client and uses it for month-end work.' },
      { j: 'Small business / Owner', c: 'Gets an HTML tool for organizing sales and uses it on the store PC.' }
    ]
  },
  VN6: {
    t: 'Delegation instructions and review criteria for agents',
    st: 'Delegation and review',
    desc: 'Split the work you hand to an agent service into scope, deliverables, prohibited actions and review criteria, and check the results against a review checklist.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Scope, limits > C:Agent : instruct',
        'C:Agent > U:Deliverable : submit',
        'U:Review checklist > U:Deliverable : check',
        'U:Deliverable > C:Agent : request fixes'
      ]
    },
    ex: [
      'Delegation brief: goal, scope, deliverable format, deadline',
      'State what it must not do (log in, pay, delete)',
      'Write the review checklist first and compare results against it',
      'Set checkpoints for interim results',
      'Find the point of failure in the run log',
      'Give the same task to two services and compare results',
      'Ask for a source and check date on every result'
    ],
    out: 'Delegation brief, review checklist',
    kw: ['delegation', 'instructions', 'review', 'agent management', 'deliverable'],
    pub: [
      { j: 'Public agency, planning team / Planning officer', c: 'Distributes a brief template for delegating research and summary work across the department.' },
      { j: 'Civil service training institute / Course planning', c: 'Attaches a review checklist to agent exercises and uses it for assessment.' }
    ],
    pri: [
      { j: 'Consulting firm / Manager', c: 'Cuts junior review time with a research delegation brief and review checklist.' },
      { j: 'Marketing team / Team lead', c: 'Fixes the deliverable format for competitor research tasks so results are easy to compare.' }
    ]
  },
  VN7: {
    t: 'Getting Excel analysis results as chart and report files',
    st: 'Analysis as files',
    desc: 'Upload an Excel file and state the purpose of the analysis, and the agent uses Python in its workspace to build summary tables and charts and returns them as a report file. Compare the figures with the original, and get the analysis code too so you can run it again.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Excel file > C:Python analysis : upload',
        'C:Python analysis > C:Charts, report : create',
        'C:Charts, report > U:Report file : download',
        'C:Python analysis > U:Analysis code : also receive'
      ]
    },
    ex: [
      'Upload the file with the purpose, period and key columns written out',
      'Get monthly and per-department summary tables and charts',
      'Get the report as Word, PDF or HTML',
      'Compare totals and counts with the original Excel file',
      'Get the Python code used for the analysis as well',
      'Run the received code on your PC with next month\'s file',
      'Remove personal data columns before uploading'
    ],
    out: 'Analysis report file, analysis code',
    kw: ['data analysis', 'Excel analysis', 'charts', 'report', 'Manus', 'Genspark', 'Python'],
    pub: [
      { j: 'City hall, civil affairs / Complaint analysis officer', c: 'Gets a report on trends by complaint type from the monthly complaint log in Excel and checks the figures against the original.' },
      { j: 'Public agency, training team / Training officer', c: 'Gets a chart report by course from satisfaction survey results and uses it in the results report.' }
    ],
    pri: [
      { j: 'Online store operations / Operations staff', c: 'Gets a sales report by product and weekday from order history and reruns the code every month.' },
      { j: 'Manufacturer, quality team / Quality officer', c: 'Creates a chart report of defect rates by process from defect records.' }
    ]
  },
  VN2: {
    t: 'Building and publishing a research site with an agent service',
    st: 'Publish research site',
    desc: 'Give only a topic and let the agent handle everything from research to page layout and publishing, then review the facts and sources.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Topic > C:Agent : delegate',
        'X:Web sources > C:Agent : research',
        'C:Agent > X:Published URL : publish page',
        'X:Published URL > U:Source review : fact check'
      ]
    },
    ex: [
      'Build a research-based guide site from a topic',
      'Get the published link and request changes',
      'Review sources and figures',
      'Edit the wording to fit your organization\'s style',
      'Download the page as files and keep a copy',
      'Open the published page on a phone and check it',
      'Check the sources and usage terms of images on the generated site'
    ],
    out: 'A published guide site',
    kw: ['site generation', 'Genspark', 'Manus', 'publishing', 'research'],
    pub: [
      { j: 'District office, youth policy / Civil servant', c: 'Builds a guide site collecting youth support programs, reviews figures and sources, and publishes it.' },
      { j: 'Education office training center / Training officer', c: 'Builds a reference site by training topic and shares it with trainees.' }
    ],
    pri: [
      { j: 'Travel agency / Product planner', c: 'Builds a destination guide site and uses it in customer consultations.' },
      { j: 'Consulting firm / Consultant', c: 'Builds an industry trend summary site and gives clients the link.' }
    ]
  },
  VN8: {
    t: 'Creating slides and web documents to share by link',
    st: 'Slides and web docs',
    desc: 'Give a topic and materials, and the agent researches, structures and builds slides or a web document and gives you a share link. Download it as a PowerPoint file to fit your organization\'s template, and review the figures and sources.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Topic, materials > C:Research, layout : request',
        'X:Web sources > C:Research, layout : reference',
        'C:Research, layout > C:Slides : create',
        'C:Slides > U:Share link : publish',
        'C:Slides > U:PPTX file : download'
      ]
    },
    ex: [
      'Request slides with the topic, audience and length set',
      'Upload your own materials (reports, tables) and build only from them',
      'Get the share link and check who can view it',
      'Download as PowerPoint and apply your organization\'s template',
      'Review figures and sources slide by slide',
      'Get the same content as a web document too',
      'Ask again for slide text in short, plain, polite sentences'
    ],
    out: 'Presentation slides, share link',
    kw: ['slides', 'presentation', 'PPT', 'web document', 'Genspark', 'share link'],
    pub: [
      { j: 'District office, planning team / Planning officer', c: 'Uploads project progress data, gets a draft briefing deck and adapts it to the agency template.' },
      { j: 'Education office training center / Training officer', c: 'Creates intro slides for each training topic and shares them with instructors by link.' }
    ],
    pri: [
      { j: 'Consulting firm / Consultant', c: 'Gets a draft proposal deck from interview notes, reviews it and sends it to the client.' },
      { j: 'Startup / CEO', c: 'Creates a service intro deck as a link and shares it with investors.' }
    ]
  },
  VN9: {
    t: 'Moving an agent-built site to your own hosting address',
    st: 'Move to own address',
    desc: 'The publishing address of an agent service is tied to your account and plan. Download the site files, upload them to a hosting address you manage, and set a routine for later changes: get updated files and upload them again.',
    fl: {
      box: 'My PC',
      e: [
        'X:Agent service > C:Site files : download',
        'C:Site files > C:Edited copy : replace',
        'C:Edited copy > X:Static hosting : upload',
        'X:Static hosting > U:Browser view : my address'
      ]
    },
    ex: [
      'Download all files of the published site',
      'Check the file structure (HTML, images, scripts)',
      'Find images and libraries loaded from external addresses',
      'Upload to Netlify Drop or GitHub Pages',
      'After a change request, upload only the changed files again',
      'Switch the agent-side published address to private',
      'Check that the mobile view and all links work at the new address'
    ],
    out: 'Your own hosting address',
    kw: ['migration', 'deployment', 'hosting', 'download', 'published URL', 'Netlify', 'GitHub Pages'],
    pub: [
      { j: 'District office, youth policy / Civil servant', c: 'Moves an agent-built support program guide site to a hosting address under the agency account and runs it there.' },
      { j: 'Public agency, IT team / IT officer', c: 'Sets the procedure for downloading pages that departments built with agents and uploading them to the agency server.' }
    ],
    pri: [
      { j: 'Travel agency / Product planner', c: 'Moves the destination guide site to the company domain and keeps running it.' },
      { j: 'Solo founder / Owner', c: 'Moves the service intro site to GitHub Pages and keeps it without plan limits.' }
    ]
  },
  VN3: {
    t: 'Getting research and collection results as data files',
    st: 'Collected data files',
    desc: 'Hand web research and data collection to an agent, receive the results as CSV or JSON files, and use them as data that your own tools read.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Collection rules > C:Agent : delegate',
        'X:Websites > C:Agent : collect',
        'C:Agent > U:CSV, JSON : receive as file',
        'U:CSV, JSON > U:My tool : use as data'
      ]
    },
    ex: [
      'Get notices from several sites organized into a CSV',
      'Get a JSON file with field names and formats you specify',
      'Load the received data into an HTML tool to view it as tables and charts',
      'Add a source column and review it',
      'Criteria for moving to a coding agent when regular collection is needed',
      'Ask for blank values and duplicate rows to be marked separately',
      'Have the collection date and conditions written on the first line of the file'
    ],
    out: 'Collected data file',
    kw: ['data collection', 'delegated crawling', 'CSV', 'JSON', 'data file'],
    pub: [
      { j: 'Public agency, contracts team / Contracts officer', c: 'Gets notices for similar projects as a CSV, loads them into a comparison tool and reviews them.' },
      { j: 'City hall, economic policy / Civil servant', c: 'Gets the conditions of other local governments\' support programs as JSON and builds a comparison screen.' }
    ],
    pri: [
      { j: 'E-commerce company / Merchandiser', c: 'Gets competitor product data as a CSV and uses it in a price comparison tool.' },
      { j: 'Research firm / Researcher', c: 'Gets the list of organizations to survey as a data file and starts the analysis.' }
    ]
  },
  VN10: {
    t: 'Regular collection and summaries of notices and news',
    st: 'Notice and news feed',
    desc: 'Use the agent service\'s scheduled runs to collect notices and news from set sites at regular intervals and receive a summary list. Fix the fields so results come in the same format each time, and check for gaps and duplicates.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Collection rules > C:Scheduled run : set interval',
        'C:Scheduled run > X:Notice/news site : visit',
        'X:Notice/news site > C:Summarize, sort : original text',
        'C:Summarize, sort > U:Summary list : deliver',
        'C:Summarize, sort > U:CSV file : accumulate'
      ]
    },
    ex: [
      'Set the sites, search terms and period to collect',
      'Fix the result fields (title, organization, deadline, link)',
      'Schedule a run every Monday morning',
      'Remove items that overlap with previous results',
      'Open the original links and check for gaps and errors',
      'Get results as a CSV and accumulate them',
      'Criteria for moving sites that block collection to a coding agent'
    ],
    out: 'Regular collection summary list',
    kw: ['regular collection', 'monitoring', 'scheduled run', 'public notices', 'news summary', 'RSS', 'bids'],
    pub: [
      { j: 'Public agency, contracts team / Contracts officer', c: 'Collects bid notices for similar projects every week and receives them as a list sorted by deadline.' },
      { j: 'Provincial government, spokesperson\'s office / PR officer', c: 'Collects articles about provincial affairs daily and uses the summary list in the morning briefing.' }
    ],
    pri: [
      { j: 'Manufacturer, purchasing team / Buyer', c: 'Gets a daily summary of raw material news and uses it to respond to price changes.' },
      { j: 'Investment firm / Investment analyst', c: 'Collects government support notices in target industries weekly and builds a review list.' }
    ]
  },
  VN11: {
    t: 'Delegating browser tasks and handling login steps',
    st: 'Delegate browser tasks',
    desc: 'Delegate tasks where the agent operates a browser to search, enter data and download files. A person takes over the login, payment and submission steps, and you set criteria for moving repeated tasks to a script.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Task instruction > C:Virtual browser : delegate',
        'C:Virtual browser > X:Work website : search, enter',
        'X:Work website > C:Virtual browser : result page',
        'U:Staff member > C:Virtual browser : handles login',
        'C:Virtual browser > U:Downloaded files : download'
      ]
    },
    ex: [
      'Search several sites with the same conditions and collect the results',
      'Have a person type on the login screen and hand control back',
      'Instruct it to stop just before submitting or paying',
      'Check each step in the screen recording of the task',
      'Check the list of downloaded files and the naming rule',
      'Switch to a Playwright script if the same task repeats every week',
      'Get the results as a table and request missing sites again'
    ],
    out: 'Procedure for delegating browser tasks',
    kw: ['browser automation', 'computer use', 'login', 'web operation', 'delegation', 'Playwright'],
    pub: [
      { j: 'District office, tax department / Civil servant', c: 'Delegates searching and downloading tax reference material from several public sites and handles the logins in person.' },
      { j: 'Public agency, contracts team / Contracts officer', c: 'Delegates searches on the public procurement site and saving results, and a person checks the submission step.' }
    ],
    pri: [
      { j: 'E-commerce company / Merchandiser', c: 'Delegates visiting competitor product pages to collect prices and options.' },
      { j: 'Travel agency / Reservations staff', c: 'Delegates rate comparisons across several lodging sites and handles booking and payment in person.' }
    ]
  },
  VN4: {
    t: 'Limits of agent output and handing it over',
    st: 'Limits and handover',
    desc: 'It is hard to run a service that needs a DB, login or ongoing changes on agent service output. Learn how to take the code and move it to an app builder or a coding agent.',
    fl: {
      box: 'Agent workspace',
      e: [
        'C:Agent output > U:Limit check : DB, login',
        'C:Agent output > X:Code files : download',
        'X:Code files > X:App/coding AI : hand over'
      ]
    },
    ex: [
      'Check the structure and files of the output you received',
      'List the conditions that make a DB or login necessary',
      'Move the code to a repository',
      'Continue adding features with a coding agent',
      'Sort out who is responsible for running it and the cost',
      'List the external libraries and services the output uses',
      'After the handover, check that the same features still work'
    ],
    out: 'Handover plan',
    kw: ['handover', 'limitations', 'operations', 'maintenance', 'getting the code'],
    pub: [
      { j: 'District office, PR team / PR officer', c: 'An agent-built guide site needed an application feature, so it was handed over to the coding agent course.' },
      { j: 'Public agency, IT team / IT officer', c: 'Sets criteria for moving department-built output to the agency server.' }
    ],
    pri: [
      { j: 'Startup / CEO', c: 'Organizes the code and requirements of an agent prototype to hand it to an outsourced developer.' },
      { j: 'Training company / Instructor', c: 'Carries trainee output over as exercise material for the next course.' }
    ]
  },
  VN12: {
    t: 'Building a web app with a DB and login using an agent service',
    st: 'Web app, DB and login',
    desc: 'Use the agent service\'s web app builder to create an app with application, lookup and admin screens, a DB and login. Check which service stores the data, whether access rules are in place, and whether you can export the data.',
    fl: {
      box: 'Inside agent service',
      e: [
        'U:Requirements > C:Web app screen : build request',
        'C:Web app screen > C:Login, access : check',
        'C:Web app screen > X:Cloud DB : save',
        'X:Cloud DB > U:CSV file : export',
        'C:Web app screen > U:Browser view : published URL'
      ]
    },
    ex: [
      'Request application, list and admin screens written as requirements',
      'Check login and per-user data separation',
      'Check where the data is stored and under which account',
      'Test whether another account can see someone else\'s data',
      'Export the data as CSV',
      'Check whether the code can be downloaded and the conditions for moving it',
      'Check that admin-only screens are blocked for regular accounts'
    ],
    out: 'A web app with a DB and login',
    kw: ['web app', 'DB', 'login', 'full stack', 'Manus', 'data location', 'permissions'],
    pub: [
      { j: 'Civil service training institute / Training operations', c: 'Builds a prototype web app for training applications and approvals and checks where data is stored and who can access it.' },
      { j: 'District office, welfare department / Counselor', c: 'Builds a counseling booking web app and tests that personal data is not visible from other accounts.' }
    ],
    pri: [
      { j: 'Private academy / Director', c: 'Builds a web app for course enrollment and attendance, checks permissions per instructor, then puts it into use.' },
      { j: 'Startup / CEO', c: 'Builds a prototype web app for managing customer inquiries and checks whether data can be exported.' }
    ]
  },
  VN13: {
    t: 'Rules for files you upload to agents and for keeping results',
    st: 'Upload and retention',
    desc: 'Files you upload to an agent workspace and the results it creates stay on the service side, and others can see them through share links. Set rules for which files may be uploaded, how widely to share, and how to delete task history.',
    fl: {
      box: 'Inside agent service',
      e: [
        'U:Work files > C:Pseudonymization : before upload',
        'C:Pseudonymization > C:Workspace : upload',
        'C:Workspace > U:Share link : visibility',
        'C:Workspace > U:Agency storage : move results'
      ]
    },
    ex: [
      'List the files that may and may not be uploaded',
      'Remove personal data or replace it with pseudonyms before uploading',
      'Check the visibility of task share links',
      'Check how to delete task history and uploaded files',
      'Check the setting for whether your data is used for model training',
      'Move results to agency storage and then clean up the originals',
      'Decide whether to work in a shared department account or a personal account'
    ],
    out: 'Rules for data export and retention',
    kw: ['personal data', 'security', 'file upload', 'sharing scope', 'deletion', 'pseudonymization', 'data retention'],
    pub: [
      { j: 'Public agency, information security team / Security officer', c: 'Sets data classification levels allowed for upload to agent services and informs departments.' },
      { j: 'City hall, audit office / Auditor', c: 'Checks the visibility of agent task share links in each department.' }
    ],
    pri: [
      { j: 'Law firm / Office manager', c: 'Sets a rule to upload only public case law, never case files, and uses it for research work.' },
      { j: 'Hospital, management support / Staff', c: 'Sets a procedure to upload only statistics files with patient data pseudonymized.' }
    ]
  },
  VN5: {
    t: 'Connecting agent services to external tools and connectors',
    st: 'Tools and connectors',
    desc: 'Use the agent service\'s connectors to link external tools such as email, documents and calendars, hand over research, organizing and writing as one chain, and manage the scope of permissions.',
    fl: {
      box: 'Agent workspace',
      e: [
        'U:Repetitive task > C:Agent : delegate',
        'X:Mail/docs/events > C:Agent : read via connector',
        'C:Agent > X:Mail/docs/events : write',
        'C:Agent > U:Result report : check permissions'
      ]
    },
    ex: [
      'Connect email, Drive and Notion connectors',
      'Get a draft report from the connected materials',
      'Connector permission scope and how to disconnect',
      'Set repeated runs at fixed times',
      'Understand when to connect through an MCP server if no connector exists',
      'Decide for each connector whether to allow read only or also write',
      'Pull meeting dates from connected email and get them as a table'
    ],
    out: 'Connected agent tasks',
    kw: ['connectors', 'integration', 'MCP', 'agent', 'automation'],
    pub: [
      { j: 'Provincial government, governor\'s office / Scheduling officer', c: 'Uses calendar and email connectors to get a weekly schedule summary and a list of materials to prepare.' },
      { j: 'Public agency, planning team / Planning officer', c: 'Connects Drive documents and has meeting prep packs drafted automatically.' }
    ],
    pri: [
      { j: 'Sales team / Team lead', c: 'Gets a daily list of follow-ups per customer through CRM and email connectors.' },
      { j: 'Freelancer / Translator', c: 'Connects manuscripts in Drive and produces glossary-based draft translations.' }
    ]
  },
  VN14: {
    t: 'Building a web app with AI features using an agent service',
    st: 'Web app with AI',
    desc: 'Have an agent service build a web app with AI features such as summarizing, classifying and drafting forms. Check that AI calls happen on the server side, which account is billed for usage, and that the key is not exposed in the page code.',
    fl: {
      box: 'Inside agent service',
      e: [
        'U:Any text > C:Web app screen : input',
        'C:Web app screen > C:Server function : call',
        'C:Server function > X:LLM API (key) : request',
        'X:LLM API (key) > C:Server function : result',
        'C:Web app screen > U:Form draft : output'
      ]
    },
    ex: [
      'Request a web app that fills a form draft from input text',
      'Request a web app that sorts inquiries by type',
      'Check that AI calls happen on the server side',
      'Check the browser source for an exposed key',
      'Check which account is billed for usage and its limit',
      'Make the prompt editable on an admin screen',
      'Check result quality with 10 sample inputs'
    ],
    out: 'A web app with AI features',
    kw: ['AI web app', 'LLM integration', 'summarize', 'classify', 'draft generation', 'usage', 'key exposure'],
    pub: [
      { j: 'District office, civil affairs / Civil affairs officer', c: 'Builds a prototype web app that returns the type of a citizen complaint and a draft reply, and checks for key exposure.' },
      { j: 'Public agency, training team / Training officer', c: 'Builds a web app that classifies improvement requests in course reviews and uses it in course evaluation.' }
    ],
    pri: [
      { j: 'Interior design company / Sales rep', c: 'Builds a web app that fills a quote draft from consultation notes and shares it with the sales team.' },
      { j: 'Online store, customer service / Team lead', c: 'Builds a web app for inquiry classification and draft replies and sets a usage limit.' }
    ]
  },
  VN15: {
    t: 'Saving repetitive work as agent task instructions',
    st: 'Save task instructions',
    desc: 'Bundle work you always hand over in the same format into task instructions, reference files and an output template, save them, and load them in new tasks. When results change, update the instructions and keep a version.',
    fl: {
      box: 'Inside agent service',
      e: [
        'U:Brief, template > C:Task guide : save',
        'U:Reference files > C:Task guide : attach',
        'C:Task guide > C:New task : load',
        'C:New task > U:Uniform results : deliver'
      ]
    },
    ex: [
      'Pick one repetitive task and write out its brief and template',
      'Attach reference files (rules, sample documents) to the instructions',
      'Fix the output format as a table or file type',
      'Run three new tasks with the saved instructions and compare',
      'Reflect the parts where results differed in the instructions',
      'Share the instructions with teammates and decide who can edit',
      'Write prohibited actions and review criteria separately in the instructions'
    ],
    out: 'Agent task instructions',
    kw: ['task instructions', 'template', 'repetitive work', 'knowledge', 'project', 'reuse', 'output format'],
    pub: [
      { j: 'Provincial government, spokesperson\'s office / Press officer', c: 'Saves instructions and sample documents for drafting press releases so the format stays the same when staff change.' },
      { j: 'Civil service training institute / Course planning', c: 'Saves instructions for course result reports so every course gets a report draft in the same template.' }
    ],
    pri: [
      { j: 'Consulting firm / Manager', c: 'Saves market research report instructions so juniors receive research results in the same structure.' },
      { j: 'Marketing team / Content staff', c: 'Saves instructions and brand rules for weekly social media copy and reuses them.' }
    ]
  },
  VK1: {
    t: 'Single HTML tools and running a local server',
    st: 'Single HTML, localhost',
    desc: 'Build and run HTML, CSS and JS tools with a coding agent. Tell apart tools that open with a double-click (file://) from those that need a local server (python -m http.server, npx serve) because they load modules or files.',
    fl: {
      box: 'My PC',
      e: [
        'U:Tool description > C:Coding agent : instruct',
        'C:Coding agent > C:HTML, CSS, JS : create',
        'C:HTML, CSS, JS > C:Local server : http.server',
        'C:Local server > U:Browser view : localhost'
      ]
    },
    ex: [
      'Build a single HTML tool and open it with a double-click',
      'Check why modules and fetch are blocked under file://',
      'Start a local server with python -m http.server',
      'Start a local server with npx serve',
      'Read Excel and CSV files via file picker or drag and drop',
      'Print or output a PDF form',
      'Add a button that downloads the on-screen table as CSV'
    ],
    out: 'A web tool that runs locally',
    kw: ['HTML', 'CSS', 'JavaScript', 'local server', 'http.server', 'npx serve', 'file://', 'double-click'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Builds HTML work tools that run without installation and distributes them to air-gapped PCs.' },
      { j: 'District office, tax department / Civil servant', c: 'Builds an HTML tax calculation tool and uses it from a shared folder.' }
    ],
    pri: [
      { j: 'Logistics company, operations / Operations staff', c: 'Builds an HTML tool that reads order CSVs and creates dispatch schedules.' },
      { j: 'Training company / Instructor', c: 'Opens exercise examples on a local server to reduce differences between trainee PCs.' }
    ]
  },
  VK2: {
    t: 'Local script tools in Python and PowerShell',
    st: 'Local script tools',
    desc: 'Use a coding agent to write scripts for PC tasks such as organizing files, merging Excel files and processing PDFs, and package them as executables for distribution when needed.',
    fl: {
      box: 'My PC',
      e: [
        'U:Excel, PDF files > C:Python script : input',
        'C:Coding agent > C:Python script : create',
        'C:Python script > U:Output files : merge, convert',
        'C:Python script > U:exe file : package, share'
      ]
    },
    ex: [
      'Rename all files in a folder at once',
      'Script to merge multiple Excel files',
      'Extract tables from PDFs and merge PDFs',
      'Organize and back up documents with PowerShell',
      'Build an exe with PyInstaller',
      'Run it automatically every day with Task Scheduler',
      'Copy the original files to a backup folder before processing'
    ],
    out: 'Automation scripts, executables',
    kw: ['Python', 'PowerShell', 'CMD', 'script', 'automation', 'exe'],
    pub: [
      { j: 'Provincial government, planning and coordination / General administration', c: 'Builds a script that merges 20 Excel files from each bureau and uses it weekly.' },
      { j: 'District office, information disclosure team / Civil servant', c: 'Runs a script that converts hundreds of documents for public release at once.' }
    ],
    pri: [
      { j: 'Accounting firm / Audit assistant', c: 'Automatically sorts client supporting documents by vendor and month.' },
      { j: 'Manufacturer, quality team / Quality officer', c: 'Collects inspection result files and writes the daily report automatically.' }
    ]
  },
  VK16: {
    t: 'Assembling form documents automatically: filling Hangul, Word and Excel templates',
    st: 'Auto-assembled forms',
    desc: 'Keep the official documents, reports and summary sheets you make again and again as template files, and use a coding agent to build a script that reads an Excel list or input values and creates all the filled-in documents at once. It runs on your PC without internet.',
    fl: {
      box: 'My PC',
      e: [
        'U:Excel list > C:Python script : read',
        'C:Template file > C:Python script : blank positions',
        'C:Python script > C:Finished docs : fill and save',
        'C:Finished docs > U:HWPX, PDF files : batch output'
      ]
    },
    ex: [
      'Put placeholders (e.g. {{agency_name}}) in the template file',
      'Create one document for each row of the Excel list',
      'Open the XML inside an HWPX file (the Hangul word processor\'s open format) and replace text',
      'Add and fill rows in a table in a Word template',
      'Put values and formulas into an Excel summary template',
      'Convert the created documents to PDF in one batch',
      'Apply a file naming rule (date_agency_document)'
    ],
    out: 'Form document generation script',
    kw: ['HWPX', 'Hangul document', 'Word', 'Excel template', 'document automation', 'mail merge', 'template filling'],
    pub: [
      { j: 'City hall, general affairs / General administration', c: 'Creates 40 official requests for event cooperation to departments at once from an Excel list, cutting preparation time.' },
      { j: 'Provincial government, spokesperson\'s office / Press officer', c: 'Runs a script that fills the standard press release template with title, body and contact person and saves it as HWPX.' }
    ],
    pri: [
      { j: 'Training company / Operations staff', c: 'Generates certificates of completion and confirmation letters in bulk from the graduate list.' },
      { j: 'Interior design company / Sales rep', c: 'Fills the company quote template from an Excel list of items and sends it as a PDF.' }
    ]
  },
  VK3: {
    t: 'Automatic deployment linked to GitHub',
    st: 'GitHub auto deploy',
    desc: 'Connect your repository so that pushing deploys automatically, and for each proposed change (pull request) get a preview address to check before merging.',
    fl: {
      box: 'GitHub',
      e: [
        'X:My PC > C:Repository : push',
        'C:Repository > C:Auto deploy : Actions',
        'C:Auto deploy > U:Preview URL : per PR',
        'C:Auto deploy > U:Live URL : after merge'
      ]
    },
    ex: [
      'Connect a repository to Netlify or Cloudflare Pages',
      'Automatic deployment with Firebase Hosting and GitHub Actions',
      'Review changes at the pull request preview address',
      'Deployment history and rolling back to a previous version',
      'Connect your own domain and HTTPS',
      'Read the failed deployment log and pass it to the coding agent',
      'Keep settings separate for preview and production'
    ],
    out: 'Automatic deployment pipeline',
    kw: ['deployment', 'Netlify', 'Cloudflare', 'Firebase Hosting', 'Vercel', 'CI', 'preview'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Manages the department guide site in a repository and reviews each change on a preview before it goes live.' },
      { j: 'Education office training center / Training officer', c: 'Deploys the training material site automatically so changes go live as soon as instructors edit the content.' }
    ],
    pri: [
      { j: 'Marketing agency / Developer', c: 'Deploys client landing pages automatically and gets client approval through preview links.' },
      { j: 'Solo developer / Owner', c: 'Deploys the service site just by pushing to the repository.' }
    ]
  },
  VK14: {
    t: 'Mobile-friendly and installable web apps (PWA)',
    st: 'Mobile, installable',
    desc: 'Fit your web tool to phone screens and turn it into an installable web app that can be added to the home screen and used like an app.',
    fl: {
      box: 'Hosting server',
      e: [
        'C:HTML, CSS, JS > C:Manifest, SW : install settings',
        'C:Manifest, SW > U:Home screen : install as app',
        'U:Home screen > C:HTML, CSS, JS : open offline'
      ]
    },
    ex: [
      'Layout that fits phone screen width',
      'Manifest and icons for adding to the home screen',
      'Cache settings so it opens offline',
      'Use a field entry form on a phone',
      'Attach photos with the camera',
      'Check text and button sizes on a phone',
      'Store offline entries and send them once connected'
    ],
    out: 'An installable web app',
    kw: ['mobile', 'responsive', 'PWA', 'home screen', 'offline', 'field work'],
    pub: [
      { j: 'District office, roads department / Field officer', c: 'Installs a field inspection entry web app on the phone home screen and uses it on site.' },
      { j: 'Public health center / Visiting nurse', c: 'Builds a mobile entry screen for home visit records and enters them on site.' }
    ],
    pri: [
      { j: 'Construction company, site management / Safety officer', c: 'Turns the safety inspection checklist into a phone web app and uses it on site.' },
      { j: 'Retail operator / Store manager', c: 'Installs an inventory check web app on the store tablet.' }
    ]
  },
  VK4: {
    t: 'Deploying on an internal or air-gapped network',
    st: 'Internal deployment',
    desc: 'In organizations that cannot use external hosting services, deploy tools through a shared folder, an in-house web server or an internal Flask server, following the approval process for bringing files in. (Korean public agencies keep work PCs on an air-gapped network separated from the internet.)',
    fl: {
      box: 'Agency network',
      e: [
        'X:Internet PC > C:Approved files : bring-in process',
        'C:Approved files > C:Internal server : install',
        'C:Internal server > U:Staff browser : internal URL',
        'C:Approved files > U:Shared folder : distribute files'
      ]
    },
    ex: [
      'Put an HTML tool in a shared folder and distribute a shortcut',
      'Upload static files to an in-house web server (IIS, nginx)',
      'Let several people use it through an internal Flask server',
      'Bundle external libraries as files so it works without internet',
      'Approval process for bringing files in and version control',
      'Distribute access paths (shortcuts, bookmarks) to each department',
      'Make the tool start automatically after a server restart'
    ],
    out: 'A tool deployed on the internal network',
    kw: ['internal network', 'air-gapped network', 'in-house server', 'shared folder', 'IIS', 'file transfer approval', 'on-premises'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Uploads HTML tools built by staff to the in-house web server so all employees can use them.' },
      { j: 'City council secretariat / Proceedings officer', c: 'Puts a meeting minutes search tool on an internal server and runs it for all staff.' }
    ],
    pri: [
      { j: 'Defense contractor, IT team / Staff', c: 'Deploys work tools to an in-house server where sending data outside is blocked.' },
      { j: 'Hospital, IT team / Staff', c: 'Runs clinical support tools only on an internal network server.' }
    ]
  },
  VK5: {
    t: 'Connecting public APIs, RSS and internal APIs',
    st: 'Public API and RSS',
    desc: 'Load public APIs and RSS or XML feeds and organize them into screens and files. On an internal network, connect your agency\'s internal API or shared data files the same way.',
    fl: {
      box: 'My PC, server',
      e: [
        'X:Public API, RSS > C:HTML, JS : load',
        'X:Internal API > C:HTML, JS : internal network',
        'C:HTML, JS > U:Lists, tables : organize',
        'C:HTML, JS > U:CSV file : save'
      ]
    },
    ex: [
      'Load a public JSON API that needs no key',
      'Parse RSS or XML and build a list',
      'Fetch an API blocked by CORS with a Python script',
      'Caching the fetched data and the refresh interval',
      'Connect an internal agency API or shared files (internal network)',
      'Handle errors by response code from the public data API',
      'Store the received data as files by date'
    ],
    out: 'A data connection tool',
    kw: ['API', 'RSS', 'XML', 'JSON', 'public data', 'OpenAPI', 'fetch'],
    pub: [
      { j: 'Provincial government, spokesperson\'s office / PR officer', c: 'Collects ministry press release RSS feeds and receives them as a list every morning.' },
      { j: 'City hall, statistics team / Statistics officer', c: 'Regularly collects regional statistics through the public data API and saves them as tables.' }
    ],
    pri: [
      { j: 'Manufacturer, purchasing team / Buyer', c: 'Combines raw material price APIs and news RSS to get alerts on changes.' },
      { j: 'Investment firm / Investment analyst', c: 'Collects disclosure RSS feeds for companies of interest and creates a summary list.' }
    ]
  },
  VK6: {
    t: 'Wrapping APIs that need a key in a serverless function',
    st: 'Keys in serverless',
    desc: 'Instead of calling APIs that need a key directly from the browser, call them through a serverless function. Keep the key only in server-side secrets.',
    fl: {
      box: 'Serverless',
      e: [
        'U:Browser view > C:Serverless func : request, no key',
        'C:Secrets > C:Serverless func : API key',
        'C:Serverless func > X:Key-based API : request',
        'X:Key-based API > U:Browser view : result'
      ]
    },
    ex: [
      'Build an API relay function with Cloudflare Workers',
      'Build the same structure with Netlify Functions or Firebase Functions',
      'Register the key as a secret and remove it from the code',
      'Allowed domains and call limits',
      'Error and delay handling and caching',
      'Check call history and failure causes in the function logs',
      'Run the function locally before deploying'
    ],
    out: 'An API relay function',
    kw: ['serverless', 'Workers', 'Functions', 'proxy', 'API key', 'relay'],
    pub: [
      { j: 'City hall, IT team / IT officer', c: 'Hides a public API key in a serverless function so the guide page can call it safely.' },
      { j: 'Public corporation, data team / Analyst', c: 'Limits paid API calls in the function to manage costs.' }
    ],
    pri: [
      { j: 'Startup, development team / Developer', c: 'Moves map and payment API keys to the server side to prevent leaks.' },
      { j: 'Agency / Developer', c: 'Manages external API calls from client sites through a single function.' }
    ]
  },
  VK17: {
    t: 'Scraping and automating web pages on a schedule',
    st: 'Web scraping and bots',
    desc: 'Build scripts that read lists and tables from web pages without an API, or handle repetitive data entry automatically, and run them at set times. Check the terms of use, login requirements and request intervals first.',
    fl: {
      box: 'My PC',
      e: [
        'C:Task Scheduler > C:Scraper script : run daily',
        'C:Scraper script > X:Target web page : open, read',
        'X:Target web page > C:Scraper script : lists, tables',
        'C:Scraper script > U:CSV file : save',
        'C:Scraper script > U:Mail, messenger : new post alert'
      ]
    },
    ex: [
      'Read a notice list page and save it as CSV',
      'Collect table data while paging through several pages',
      'Enter Excel values automatically into a repetitive entry screen',
      'Save screenshots in folders by date',
      'Send an email or messenger alert when a new post appears',
      'Run it daily with Task Scheduler or GitHub Actions',
      'Check the terms of use, robots.txt and request intervals'
    ],
    out: 'Scraping and automation scripts',
    kw: ['crawling', 'scraping', 'Playwright', 'Selenium', 'auto entry', 'scheduled run', 'collection bot'],
    pub: [
      { j: 'Public agency, contracts team / Contracts officer', c: 'Collects bid notice lists from several agencies every morning and gets only relevant notices by email.' },
      { j: 'District office, IT team / IT officer', c: 'Handles repetitive data entry in an internal work system with a script and reduces entry errors.' }
    ],
    pri: [
      { j: 'E-commerce company / Merchandiser', c: 'Collects competitor price pages daily and checks changes in a table.' },
      { j: 'Real estate agency / Owner', c: 'Collects new listings from property sites and receives them as a list every morning.' }
    ]
  },
  VK15: {
    t: 'Using Google Sheets and Apps Script as storage',
    st: 'Google Sheets storage',
    desc: 'Use Google Sheets as storage instead of a DB and build entry and lookup screens as an Apps Script web app. It is the quickest way for beginners to build a tool several people can use.',
    fl: {
      box: 'Google account',
      e: [
        'U:Entry screen > C:Apps Script : submit',
        'C:Apps Script > C:Google Sheets : add row',
        'C:Google Sheets > C:Apps Script : look up',
        'C:Apps Script > U:Lookup screen : display'
      ]
    },
    ex: [
      'Entry form web app that writes to a sheet',
      'Screen to look up and search sheet data',
      'Email alert on submission',
      'Access settings (within the organization, link sharing)',
      'Criteria for moving to a DB as the data grows',
      'Check lookup speed as the number of rows grows',
      'Validate the input format of phone numbers and dates'
    ],
    out: 'A sheet-based web app',
    kw: ['Apps Script', 'Google Sheets', 'spreadsheet as DB', 'web app', 'form'],
    pub: [
      { j: 'Community service center / Civil servant', c: 'Builds a web app that takes program applications into a sheet and manages the participant list.' },
      { j: 'Education office / School supervisor', c: 'Collects submission status from each school in a sheet and provides a lookup screen.' }
    ],
    pri: [
      { j: 'Club organizer / Treasurer', c: 'Builds a web app that manages membership fees and attendance in a sheet.' },
      { j: 'Small business / Owner', c: 'Takes reservation requests into a sheet and gets email alerts.' }
    ]
  },
  VK7: {
    t: 'Adding a DB and login with Supabase or Firebase',
    st: 'Supabase, Firebase DB',
    desc: 'Use a coding agent to design and add DB tables and login, and write access rules and security rule tests as well.',
    fl: {
      box: 'Hosting server',
      e: [
        'U:Login > X:Auth : authenticate',
        'U:Entry screen > C:HTML, JS : input',
        'C:HTML, JS > X:DB : save, look up',
        'X:Access rules > X:DB : own data only'
      ]
    },
    ex: [
      'Design the data structure (tables, collections)',
      'Add email and Google login',
      'Write Supabase RLS or Firebase security rules',
      'Block impersonation and tampering with rule tests (emulator)',
      'Real-time list updates',
      'Admin screen and data export',
      'Try to access other users\' data with a test account'
    ],
    out: 'A web service with a DB and login',
    kw: ['Supabase', 'Firebase', 'Firestore', 'PostgreSQL', 'RLS', 'login', 'security rules'],
    pub: [
      { j: 'Civil service training institute / Training operations', c: 'Builds a system for training applications, evaluations and result lookups and verifies the access rules with tests.' },
      { j: 'District office, welfare department / Counselor', c: 'Builds and runs a system for counseling bookings and staff assignment.' }
    ],
    pri: [
      { j: 'SME, HR team / Recruiter', c: 'Builds an application intake and evaluation system on Supabase.' },
      { j: 'Training company / Operations staff', c: 'Runs a course inquiry and enrollment system on Firebase.' }
    ]
  },
  VK8: {
    t: 'Internal network web apps with Flask and SQLite',
    st: 'Flask, SQLite intranet',
    desc: 'Where external services are not allowed, build a web app with entry, search and export using Flask and SQLite, and run it on an internal server. It is the DB-stage alternative for agencies on air-gapped networks.',
    fl: {
      box: 'Agency server',
      e: [
        'U:Staff browser > C:Flask app : enter, search',
        'C:Flask app > C:SQLite : save',
        'C:SQLite > C:Flask app : look up',
        'C:Flask app > U:Excel export : download'
      ]
    },
    ex: [
      'HTML entry form to Flask to SQLite storage',
      'Search, filters and Excel export',
      'Simple login and admin permissions',
      'Backups and logs',
      'Run it as a service on an internal server',
      'Change the table structure when entry fields grow',
      'Import an Excel list in one go'
    ],
    out: 'An internal network web app',
    kw: ['Flask', 'SQLite', 'internal network', 'air-gapped network', 'web app', 'Python server'],
    pub: [
      { j: 'City hall, general affairs / General administration and coordination', c: 'Runs a web app for entering and viewing department work status on an internal server.' },
      { j: 'Public agency, IT team / IT officer', c: 'Builds a department request system on the internal network without an external DB service.' }
    ],
    pri: [
      { j: 'Manufacturer, production management / Production manager', c: 'Runs a web app for equipment inspection records on the factory\'s internal server.' },
      { j: 'Research institute / Research administration', c: 'Uses a web app for looking up lab records only on the internal network.' }
    ]
  },
  VK9: {
    t: 'Serverless full stack with Cloudflare Workers and D1',
    st: 'Workers, D1 full stack',
    desc: 'Build an application, evaluation and lookup system with functions and an SQL DB without managing servers, and run it within the free tier.',
    fl: {
      box: 'Cloudflare',
      e: [
        'U:Application form > C:Pages : visit',
        'C:Pages > C:Workers function : API call',
        'C:Workers function > C:D1 DB : SQL',
        'C:D1 DB > U:Lookup screen : result'
      ]
    },
    ex: [
      'Design the Workers API and D1 tables',
      'Connect the Pages front end to the API',
      'Admin authentication and access restrictions',
      'Check free tier limits and pricing',
      'Check logs and set up error alerts',
      'Run Workers and D1 on the local development server',
      'Export and back up D1 data'
    ],
    out: 'A serverless web service',
    kw: ['serverless', 'Workers', 'D1', 'SQL', 'Cloudflare', 'full stack'],
    pub: [
      { j: 'Public agency, training team / Training officer', c: 'Builds a training satisfaction survey system as serverless and runs it within the free tier.' },
      { j: 'City hall, PR team / Events officer', c: 'Runs an event registration and prize draw system for a limited period.' }
    ],
    pri: [
      { j: 'Startup / Solo developer', c: 'Builds the service back end as serverless to keep initial costs low.' },
      { j: 'Event company / Operations staff', c: 'Deploys a registration system for each event repeatedly from a template.' }
    ]
  },
  VK10: {
    t: 'Adding an LLM API through a server',
    st: 'LLM API via server',
    desc: 'Add summarizing, classifying and generating features to a web tool, but keep the LLM API key in a serverless function or back end and have the browser call only that server.',
    fl: {
      box: 'Server, function',
      e: [
        'U:Any text > C:HTML, JS : input',
        'C:HTML, JS > C:Serverless func : request',
        'C:Serverless func > X:LLM API (key) : call with key',
        'X:LLM API (key) > U:Summary, draft : result'
      ]
    },
    ex: [
      'Check why the key is exposed when the browser calls the API directly',
      'Relay LLM calls through a serverless function',
      'Screen where text appears as the response streams in',
      'Limit calls and costs per user',
      'Keep the prompt and model name in settings',
      'Build a sample set for checking response quality',
      'Retry and show a message when a response fails or times out'
    ],
    out: 'A web service with AI features',
    kw: ['LLM API', 'Claude API', 'Gemini API', 'streaming', 'generative AI', 'server relay'],
    pub: [
      { j: 'District office, civil affairs / Civil affairs officer', c: 'Adds a draft reply feature for citizen complaints through a server so it runs without exposing the key.' },
      { j: 'Public agency, training team / Training officer', c: 'Adds a course review summary feature to the training system.' }
    ],
    pri: [
      { j: 'Online store, customer service / Team lead', c: 'Adds inquiry classification and draft replies to the support tool.' },
      { j: 'SaaS company / Developer', c: 'Runs the in-product AI summary feature with call limits.' }
    ]
  },
  VK11: {
    t: 'Context injection and RAG: answering from your own data',
    st: 'Context injection, RAG',
    desc: 'Pick the material that fits a question and put it in the prompt so the AI answers from your data. Start with context injection of SQL query results, RSS, XML and documents, extend to retrieval (RAG), and use local models on air-gapped networks.',
    fl: {
      box: 'My server',
      e: [
        'U:Question > C:Retriever : input',
        'C:Documents, DB > C:Retriever : relevant parts',
        'C:Retriever > X:LLM : question + sources',
        'X:LLM > U:Sourced answer : result'
      ]
    },
    ex: [
      'Turn SQL query results into a table and put it in the prompt',
      'Put the latest RSS or XML list in and have it summarized',
      'Split documents into chunks and insert only the relevant parts',
      'Show sources and block answers without evidence',
      'Set up an air-gapped version with a local LLM and embeddings (반입)',
      'Build an answer accuracy checklist from sample questions',
      'Show the data update date with each answer'
    ],
    out: 'Q&A based on your own data',
    kw: ['context injection', 'RAG', 'retrieval-augmented generation', 'SQL', 'RSS', 'embeddings', 'local LLM'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Splits rule documents into chunks for a local model and builds a Q&A tool with sources.' },
      { j: 'City hall, statistics team / Statistics officer', c: 'Builds a tool that answers plain-language questions with statistics by feeding in DB query results.' }
    ],
    pri: [
      { j: 'Insurance company, contact center / Agent support', c: 'Builds a support assistant that answers based on policy terms.' },
      { j: 'Manufacturer, technical support / Engineer', c: 'Deploys a Q&A tool based on product manuals inside the company.' }
    ]
  },
  VK12: {
    t: 'Connecting MCP and building MCP servers',
    st: 'Connect and build MCP',
    desc: 'Connect existing MCP servers to a coding agent to use files, DBs and external services as tools, and build your own MCP server that opens up agency data. Tell apart the stdio type for local use and the Streamable HTTP type for remote access.',
    fl: {
      box: 'My PC',
      e: [
        'C:Coding agent > C:MCP server : tool call',
        'C:MCP server > X:DB, files, apps : query, act',
        'X:DB, files, apps > C:MCP server : result',
        'C:MCP server > U:Task result : report'
      ]
    },
    ex: [
      'Connect an existing MCP server and check its permissions',
      'Compare with context injection by file, without MCP',
      'Build a local MCP server using stdio',
      'Build a remote MCP server using Streamable HTTP',
      'Expose DB lookup and document search tools through MCP',
      'Write tool descriptions and check the call log',
      'Give the MCP server read-only access only'
    ],
    out: 'An MCP server',
    kw: ['MCP', 'Model Context Protocol', 'stdio', 'Streamable HTTP', 'tool integration', 'agent'],
    pub: [
      { j: 'Public agency, IT team / IT officer', c: 'Opens rule search and statistics lookup through an MCP server for internal agents to use.' },
      { j: 'City hall, audit office / Auditor', c: 'Connects the audit case DB through MCP so an agent can look up similar cases.' }
    ],
    pri: [
      { j: 'Manufacturer, IT team / In-house developer', c: 'Builds an MCP server for ERP lookups and connects it to work agents.' },
      { j: 'SaaS company / Developer', c: 'Publishes the company\'s service API as a remote MCP server.' }
    ]
  },
  VK18: {
    t: 'Web tool that turns any text or voice into a form draft',
    st: 'Text/voice to form',
    desc: 'Build an HTML, CSS and JS tool that takes pasted text or voice, uses an external text model to fill the blanks of a quote, official document or report form, and outputs a draft and an email. The key stays only in a serverless function, and on air-gapped networks you switch to a local LLM and local speech-to-text (STT).',
    fl: {
      box: 'Hosting server',
      e: [
        'U:Any text, voice > C:HTML, CSS, JS : paste, record',
        'C:HTML, CSS, JS > C:Serverless func : text and form',
        'C:Serverless func > X:STT model : voice',
        'C:Serverless func > X:LLM API (key) : request with key',
        'X:LLM API (key) > C:Serverless func : JSON result',
        'C:HTML, CSS, JS > U:Form draft, mail : fill and output'
      ]
    },
    ex: [
      'Define the blank form as a list of JSON fields',
      'Build a paste input box and a microphone record button',
      'Convert voice to text with an STT model (Whisper, etc.)',
      'Keep the OpenRouter key as a secret in a serverless function and relay calls',
      'Make the model answer only in JSON and validate the format',
      'Output the filled draft to the form screen, print or an email draft',
      'Set up an air-gapped version with an Ollama local LLM and local STT (반입)'
    ],
    out: 'A web tool that generates form drafts',
    kw: ['form filling', 'structured output', 'JSON', 'STT', 'OpenRouter', 'serverless', 'local LLM', 'draft'],
    pub: [
      { j: 'District office, contracts team / Contracts officer', c: 'Runs a tool on an internal server that turns pasted notes from vendor calls into a draft official request for quotation.' },
      { j: 'Public agency, IT team / IT officer', c: 'Builds a tool on the air-gapped network that uses a local LLM to turn meeting audio into a draft results report.' }
    ],
    pri: [
      { j: 'Equipment installer / Sales rep', c: 'Speaks on-site call details aloud and creates a draft quote and a customer email together.' },
      { j: 'Law office / Office manager', c: 'Fills the case intake form from consultation notes and passes it to the lawyer in charge.' }
    ]
  },
};

export const CANDIDATES_EN = {
  VX1: { t: 'Building Chrome extensions', why: 'A way to add buttons and auto-fill to the screens of work websites. It goes one step beyond bookmarklets and covers how to distribute inside an organization.' },
  VX2: { t: 'Building mobile apps (Expo, Capacitor)', why: 'Packages a web tool as an app for app stores. Agencies with field work have asked for it.' },
  VX3: { t: 'Payment and booking service integration', why: 'In high demand in courses for small businesses. Includes payment key management and refund handling.' },
  VX4: { t: 'Test automation and screen checks', why: 'Uses Playwright to check screens automatically and find what broke after a coding agent\'s changes. For advanced courses for IT staff.' },
  VX5: { t: 'Organization single sign-on (SSO) integration', why: 'A way to let people log in with their agency account. Needed when running services on the internal network.' },
  VX6: { t: 'Splitting work across multiple agents', why: 'A way to assign planning, building and checking to several coding agents. For advanced courses on large projects.' }
};

export const PRESETS_EN = {
  intro: 'Vibe coding intro: building work tools (1 day)',
  nocode: 'Work apps built with services, no code (1 day)',
  fullstack: 'Full stack with coding agents in practice (2 days)',
  ai: 'Advanced AI integration: LLM, RAG, MCP (2 days, for IT staff)'
};
