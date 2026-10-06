// English overlay for scenarios-data.js. Keyed by scenario id / decision-tree node id. Only human-readable text fields. See docs/translation-guide.md.

export const SCENARIOS_EN = {
  'gov-hwpx-automation': {
    trackName: 'Public sector documents',
    badge: 'Government standard format',
    title: 'HWPX standard draft and report builder for public agencies',
    summary: 'Python script that generates reports in the Korean government heading hierarchy (□/ㅇ/-/*) with a 2x6 contact table, saved as HWPX (the open XML format of the Hangul word processor, the standard document format in Korean government)',
    publicIdeas: [
      'Draft generator that follows the heading hierarchy (□/ㅇ/-/*) of the On-Nara e-approval system (the Korean government\'s document system)',
      'Batch-build local government subsidy settlement audit reports with their evidence tables',
      'Collect data from 20 departments for a parliamentary audit or city council request and merge it into one HWPX report',
      'Automatic serial numbering of evidence files for a public agency\'s annual performance evaluation report'
    ],
    privateIdeas: [
      'Automatic completion reports in government format for defense contractors and public procurement suppliers',
      'Fill standard Hangul (HWPX) templates for kickoff, interim and final reports of government research contracts',
      'Match a proposal\'s table of contents against the requirements in a public tender RFP'
    ],
    techStack: ['Python', 'zipfile/xml.etree', 'HWPX Open Format', 'CustomTkinter'],
    pros: [
      'Builds files by editing the XML directly in Python, so it runs on PCs or Linux servers without a Hangul (HWP) license',
      'Applies the standard government fonts (Human Myeongjo, Human Gothic), line spacing and font sizes',
      'Issues individual official letters and notices for hundreds of recipients in one batch within seconds'
    ],
    comboGuide: 'After generating the report body, connect it to a press release summary for the approver and a batch PDF conversion pipeline.',
    cliCommand: 'pip install lxml pyyaml\npython generate_hwpx.py --template=report',
    promptTemplate: 'You are a developer who specializes in Korean public agency official documents and the HWPX format.\n[Goal]: Write a script that automatically generates a government-standard report for {PROJECT_NAME}.\n[Required specs]:\n1. Edit the zip structure of the HWPX container (Hangul open office XML, Contents/section0.xml) directly.\n2. Strictly follow the heading hierarchy of the Ministry of Climate, Energy and Environment / Ministry of the Interior and Safety document standard: □ (main heading, Human Gothic 16pt, bold) -> ㅇ (section heading, 15pt) -> - (subheading, 14pt) -> * (details, 13pt).\n3. Render a standard 2x6 table at the end of the document with department, position, name and phone number.\n4. Escape XML special characters (&, <, >, ", \').'
  },
  'gov-press-release-hwpx': {
    trackName: 'Public sector documents',
    badge: 'Ministry press release',
    title: 'HWPX press release builder for ministries and local governments',
    summary: 'Builds the standard Korean government press release layout: emblem, release-time box, headline box, Myeongjo body text, quotes and a 2x6 department table',
    publicIdeas: [
      'Standard press release for reporters on a policy announcement or new program, ready in under a minute',
      'Press release and attached event schedule for a local festival or cultural event',
      'Emergency briefing on evacuation steps and support measures during a disaster or climate event'
    ],
    privateIdeas: [
      'Press release tool for PR agencies that handle government clients and ministry press corps',
      'Joint press release template for companies signing ESG agreements with public agencies',
      'Official announcement generator for startups selected for government programs or reporting research results'
    ],
    techStack: ['Python', 'XML DOM', 'HWPX Template', 'PyInstaller'],
    pros: [
      'Includes the government emblem and release-time box that ministry press corps expect',
      'Places the agency head\'s quote box and the list of attachments in order',
      'Can be linked to post on the internal PR board and email the press corps right after the release is generated'
    ],
    comboGuide: 'Feed key policy points from a meeting transcript (Whisper) into the press release template.',
    cliCommand: 'python press_release_builder.py --title="New policy announcement"',
    promptTemplate: 'You are a press release engineer for a government ministry\'s spokesperson and PR office.\n[Goal]: Build a standard government press release for {PROJECT_NAME} as an HWPX document.\n[Required format]:\n1. Top: distribution date, embargo time (e.g. "For release in morning papers"), responsible department (contact for director and officer).\n2. Title block: bold Gothic title in a shaded box + 2-3 lines of key subtitle.\n3. Body: "□ Background" -> "□ Key results" -> "□ Next steps".\n4. A quote box with the agency head\'s official statement and a list of [Attachments].'
  },
  'gov-local-llm-rag': {
    trackName: 'Public sector documents',
    badge: 'Air-gapped AI',
    title: 'On-device local AI for air-gapped networks (Ollama + regulation RAG)',
    summary: 'Answers questions on local ordinances and administrative guidelines on government administrative network PCs with no internet access, without leaking classified or personal data',
    publicIdeas: [
      'Q&A that screens for conflicts with local ordinances and rules on an air-gapped PC (Korean public agencies keep work PCs on a network separated from the internet)',
      'Desk manual assistant for new officers based on welfare subsidy eligibility rules',
      'Local masking that stops personal data such as resident registration and bank account numbers from leaving official documents',
      'Air-gapped search chatbot for classified and defense research report archives'
    ],
    privateIdeas: [
      'Search security specs in internal design drawings at defense, nuclear and aerospace facilities',
      'Offline Q&A bot for a financial firm\'s internal accounting rules and audit compliance',
      'On-premises AI analysis of hospital patient EMR records with outside traffic blocked'
    ],
    techStack: ['Python', 'Ollama (EEVE-Korean / Llama3)', 'ChromaDB', 'LangChain'],
    pros: [
      'Runs inference at about 30 tokens per second on a PC fully cut off from the internet',
      'Stores internal rulebooks (PDF/HWPX/DOCX) in a local vector DB to reduce hallucinations',
      'Can be installed on site PCs without a government cloud security certification (CSAP) review'
    ],
    comboGuide: 'Send the local RAG search results to the HWPX standard format builder to produce a report for approval.',
    cliCommand: 'ollama run eeve-korean:10.8b\npython local_rag.py --docs="./laws"',
    promptTemplate: 'You are an architect for on-device local AI in air-gapped, high-security environments.\n[Goal]: Build an offline regulation search and answer system that runs in {PROJECT_NAME}.\n[Implementation]:\n1. Exclude all external internet calls (HTTP API) and talk only to a localhost Ollama server.\n2. Split administrative rules and local ordinances into chunks and store their embeddings in a local ChromaDB.\n3. For each question, retrieve the top 3 similar provisions and cite the article, paragraph and item numbers exactly.\n4. Control the prompt so that content not in the rules gets the answer "This is not stated in the relevant rules."'
  },
  'gov-procurement-monitor': {
    trackName: 'Public sector documents',
    badge: 'Procurement and bids',
    title: 'Real-time G2B tender monitor and eligibility checker',
    summary: 'Checks new notices on Korea\'s public procurement portal (KONEPS/G2B) every 10 minutes, decides whether you meet the entry conditions and sends an alert',
    publicIdeas: [
      'Track similar service contracts issued by other agencies and analyze estimated price trends',
      'Check for duplicate orders across affiliated agencies and filter public software projects that must be ordered separately',
      'Real-time dashboard of tenders limited to small businesses in the local area'
    ],
    privateIdeas: [
      'Real-time KakaoTalk alerts on new tenders matching target keywords for IT, construction and manufacturing firms',
      'Bid price simulation based on competitors\' bid history and past winning bid ratios',
      'Deadline tracking for proposal submission and checks for missing required documents'
    ],
    techStack: ['Python', 'Korea public data portal API', 'Playwright', 'SQLite', 'Telegram Bot'],
    pros: [
      'No need to search the portal by hand three times a day: you get a phone alert as soon as a keyword matches',
      'Filters entry conditions in advance: past performance, regional limits (Seoul, Gyeonggi and others), credit rating',
      'When results are announced, saves the top bidder and winning amount to Excel'
    ],
    comboGuide: 'Analyze the notice PDF with Gemini multimodal AI and summarize the RFP\'s core scope in three lines.',
    cliCommand: 'python g2b_crawler.py --keywords="AI,data,cloud"',
    promptTemplate: 'You are an expert in collecting public procurement (G2B / KONEPS) data and analyzing bids.\n[Goal]: Build a system that monitors new G2B tender notices and screens eligibility for {PROJECT_NAME}.\n[Core features]:\n1. Query new notices every 10 minutes through the Public Procurement Service Open API on Korea\'s public data portal (data.go.kr) or by scraping the G2B site.\n2. Filter by predefined keywords (item name, project name) and budget range (e.g. KRW 50 million to 500 million).\n3. Make a first automatic check of entry conditions (software business registration, SME certificate, regional limits).\n4. When a matching notice appears, send the title, amount, deadline and direct link via Telegram bot or email.'
  },
  'gov-duty-scheduler': {
    trackName: 'Public sector documents',
    badge: 'Duty roster optimization',
    title: 'Duty roster and holiday shift scheduler for public agencies',
    summary: 'Optimal scheduling of night and holiday duty for civil servants and public employees, splitting weekday and holiday shifts and excluding leave, business trips and childcare',
    publicIdeas: [
      'Fair automatic assignment of day and night duty at city hall, district office and community center staff',
      'Automatic exclusion of pregnant staff, parents of young children and staff on long trips, with instant substitute swaps',
      'Draft the duty order as an official HWPX document for e-approval and send a mobile reminder the day before'
    ],
    privateIdeas: [
      'Night shift schedule for engineers at a 24-hour IT operations center',
      'AI-optimized three-shift (day, evening, night) duty table for hospital nurses',
      'Rotation table (day, on-call, off, rest) for building facility management staff'
    ],
    techStack: ['Python', 'Pandas', 'Google OR-Tools (linear programming)', 'CustomTkinter'],
    pros: [
      'Builds a fair duty table in about a second with a mathematical optimizer, replacing days of manual work',
      'Uses yearly cumulative scores so weekend and holiday shifts are not concentrated on a few people',
      'Exports to the standard government duty order format (HWPX/Excel) with one click'
    ],
    comboGuide: 'Render the finished duty table as a standard HWPX official document and attach it to an On-Nara e-approval draft.',
    cliCommand: 'python scheduler.py --month=2026-10 --staff=members.csv',
    promptTemplate: 'You are an engineer for constraint optimization and public sector shift scheduling.\n[Goal]: Build an automatic duty and shift scheduling system for {PROJECT_NAME}.\n[Constraints]:\n1. Hard constraints: a day off after a night shift, no consecutive duty for the same person, exclude people who requested leave or are on business trips.\n2. Optimization goals: minimize the gap between staff in holiday and weekend duty counts, follow rules for team composition by gender and rank.\n3. Outputs: monthly duty calendar, duty count statistics per person, and the standard government duty order in HWPX.'
  },
  'gov-subsidy-checker': {
    trackName: 'Public sector documents',
    badge: 'Subsidy anomaly detection',
    title: 'Duplicate and fraudulent welfare benefit and subsidy detector',
    summary: 'Finds likely fraud cases by matching household members in resident registration data and cross-checking benefits received from other programs',
    publicIdeas: [
      'Excel matching to find local youth allowances and job-seeking grants also received from other ministries\' programs',
      'Filter cases where farm direct-payment recipients do not match the actual farmer in the land register',
      'Detect voucher card payments made late at night or at unauthorized business types'
    ],
    privateIdeas: [
      'Check employee welfare point and fitness expense receipts for duplicate claims by other staff',
      'Find health insurance claims for the same treatment date filed with another insurer',
      'Check total participation rates of researchers across research projects (over 100%)'
    ],
    techStack: ['Python', 'Pandas', 'NetworkX (network analysis)', 'OpenPyXL'],
    pros: [
      'Cross-checks hundreds of thousands of beneficiary records by resident number and household in seconds',
      'Calculates a risk score and gives a priority list of audit targets',
      'Generates recovery notices and explanation request forms in one batch'
    ],
    comboGuide: 'Connect the list of suspected cases to the HWPX explanation request sender as a pipeline.',
    cliCommand: 'python audit_check.py --master=subsidies.xlsx --target=applicants.xlsx',
    promptTemplate: 'You are an analyst for public subsidy audits and fraud detection.\n[Goal]: Write a script that detects duplicate subsidy payments and suspected fraud for {PROJECT_NAME}.\n[Checks]:\n1. Find the overlap (inner join) with benefit history from other programs using a unique beneficiary key (such as a hashed resident number).\n2. Check whether combined household income at the same address exceeds the limit and whether support exceeds the cap.\n3. Flag each suspected type (duplicate benefit, payment after losing eligibility, over the cap) and calculate the amount to recover.\n4. Export a summary sheet for auditors and a list of people for on-site checks to Excel.'
  },
  'gov-tax-delinquency': {
    trackName: 'Public sector documents',
    badge: 'Arrears management',
    title: 'Local tax and fine arrears manager and reminder notice generator',
    summary: 'Statistics by arrears amount, a list of vehicles for license plate seizure, and mailing label sheets generated in one batch',
    publicIdeas: [
      'Batch-print notices of planned property seizure for people with long-unpaid parking fines',
      'Field list in Excel of vehicles with three or more unpaid car tax bills, for license plate seizure teams',
      'Address labels and barcodes arranged to Korea Post\'s e-Green Mail format'
    ],
    privateIdeas: [
      'Formal demand letters for apartment households more than three months behind on maintenance fees',
      'Look up owners of vehicles with unpaid private parking fees and send payment notices',
      'Due-date alerts for B2B receivables and formal payment reminder letters'
    ],
    techStack: ['Python', 'Pandas', 'OpenPyXL', 'ReportLab (PDF labels)'],
    pros: [
      'Sorting delinquent taxpayers and printing notices, which took tax officers days, now takes about a minute',
      'Renders print-ready PDFs that match Korea Post formats (5-digit postal code, barcode)',
      'Matches against real-time payment data and stops reminders once arrears are paid'
    ],
    comboGuide: 'After extracting the arrears list, generate mailing labels and text message notices together with one click.',
    cliCommand: 'python tax_delinquent.py --min-amount=300000 --output=labels.pdf',
    promptTemplate: 'You are an engineer who automates collection of local taxes and administrative fines.\n[Goal]: Build a system for {PROJECT_NAME} that manages delinquent payers and sends reminder notices by mail.\n[Requirements]:\n1. Filter people in the arrears dataset by days overdue, total amount owed and number of unpaid bills.\n2. Generate a PDF that places name, address and postal code on Korea Post standard label sheets (A4, 14 labels).\n3. Put high-value and repeat delinquents (KRW 10 million or more) on a separate list for plate seizure and property seizure.\n4. Validate that each person is matched to the correct virtual account number for payment.'
  },
  'office-excel-merge': {
    trackName: 'Office work',
    badge: 'Bulk Excel merge',
    title: 'Batch merge and error check tool for Excel files from many branches',
    summary: 'Combines dozens of Excel files with slightly different layouts into one standard format in seconds and flags bad data',
    publicIdeas: [
      'Merge welfare grant application lists from 25 community centers and validate resident numbers',
      'Reconcile spending resolutions of affiliated public agencies and total them by budget item',
      'Collect thousands of school facility inspection checklist files nationwide in one batch'
    ],
    privateIdeas: [
      'Merge daily sales files from 100 franchise stores and alert on stores that did not submit',
      'Convert order exports from Naver, Coupang and 11st (Korean online marketplaces) into one shipping file',
      'Total month-end attendance and overtime hours for all staff and match them to the payroll table'
    ],
    techStack: ['Python', 'Pandas', 'OpenPyXL', 'CustomTkinter'],
    pros: [
      'Replaces about four hours of copying and pasting 100 Excel files with a few seconds of automation',
      'Matches columns by header name even when column order differs or there are blank rows',
      'Highlights error rows in yellow: negative amounts, duplicates, invalid phone numbers'
    ],
    comboGuide: 'Wrap the merge script in a CustomTkinter GUI and build an .exe so non-developer teammates can use it right away.',
    cliCommand: 'pip install pandas openpyxl\npython merge_excel.py --input="./data" --output="merged.xlsx"',
    promptTemplate: 'You are an expert in large-scale data cleaning and work automation with Python Pandas.\n[Goal]: Write a script that merges Excel files and cleans outliers for {PROJECT_NAME}.\n[Requirements]:\n1. Load all .xlsx and .xls files in a given folder quickly (openpyxl/calamine engine).\n2. When column order differs by branch or some columns are missing, map columns by header name.\n3. Detect missing values, negative values and phone or business registration numbers that fail a regex, and highlight them on a separate \'Validation errors\' sheet.\n4. Save the result as \'merged_DATE.xlsx\' and print summary statistics to the console.'
  },
  'office-pdf-toolkit': {
    trackName: 'Office work',
    badge: 'PDF table extraction',
    title: 'Table detection and Excel export tool for large PDF documents',
    summary: 'Detects tables in scanned paper documents or electronic documents hundreds of pages long and exports them to Excel sheets',
    publicIdeas: [
      'Extract spending tables from scanned receipts and settlement PDFs attached to official documents',
      'Convert item and quantity tables in Public Procurement Service purchase specs to Excel',
      'Turn land expropriation compensation tables in local government gazette notices into data'
    ],
    privateIdeas: [
      'Parse hundreds of tax invoice and invoice PDFs each month and upload them to the accounting ERP',
      'Turn bank statement and transaction history PDFs back into Excel data',
      'Extract ownership and mortgage tables from Korean property register certificates'
    ],
    techStack: ['Python', 'PyMuPDF (fitz)', 'pdfplumber', 'OpenPyXL'],
    pros: [
      'Rebuilds table structure from coordinates even in broken PDFs that do not allow copy and paste',
      'Splits and merges documents of thousands of pages page by page without memory leaks',
      'Runs only on the local PC with nothing sent out, so it can handle confidential contracts'
    ],
    comboGuide: 'Extract structured tables with pdfplumber, and analyze complex unstructured contracts with Gemini multimodal AI.',
    cliCommand: 'pip install pymupdf pdfplumber openpyxl\npython pdf_table_extractor.py',
    promptTemplate: 'You are an engineer for PDF structure parsing and OCR data extraction.\n[Goal]: Detect tables in {PROJECT_NAME} documents accurately and convert them to an Excel file.\n[Implementation]:\n1. Use pdfplumber to detect table border lines and cell text.\n2. Clean multi-line cell text by joining lines with a single space.\n3. Convert the extracted data to a Pandas DataFrame and export it as \'extracted.xlsx\'.\n4. For plain text documents without tables, extract only the text with PyMuPDF (fitz).'
  },
  'office-bookmarklet-f12': {
    trackName: 'Office work',
    badge: 'No-install macro',
    title: 'One-click browser macros with the F12 console and bookmarklets',
    summary: 'Automates typing and copying on web pages with one bookmark click, even on PCs where you cannot install programs',
    publicIdeas: [
      'Fill repeated forms with one click on locked-down internal intranets (Saeol, On-Nara: Korean government administration systems)',
      'Copy a table of hundreds of citizen requests shown on a web page straight to the clipboard for Excel',
      'Click the daily check-in button automatically and show remaining leave hours in a popup'
    ],
    privateIdeas: [
      'Set a frequently used approval line with one click on the company ERP approval screen',
      'Copy customer shipping addresses from an online store\'s partner center into an Excel format with one click',
      'Copy only key education and career details from the resume screen of a job portal'
    ],
    techStack: ['Vanilla JavaScript', 'DOM Manipulation', 'Bookmarklet URI', 'Clipboard API'],
    pros: [
      'Runs in the browser alone, even on PCs where security software blocks .exe files and Python installs',
      'Install by dragging it to the bookmarks bar',
      'Formats web table data with tabs (\\t) and line breaks (\\n) so you can paste it into Excel with Ctrl+V'
    ],
    comboGuide: 'Handle simple repeated tasks with bookmarklets and large scheduled collection with a Playwright crawler.',
    cliCommand: '# No install needed: register javascript:(code) in the URL field of a browser bookmark',
    promptTemplate: 'You are an expert in browser DOM automation and bookmarklet development.\n[Goal]: Write a single IIFE bookmarklet for {PROJECT_NAME}.\n[Requirements]:\n1. Write a one-line minified script in the form javascript:(function(){ ... })();.\n2. Find the target table (table, tr, td) on the web page and parse its text with tabs and line breaks.\n3. Call navigator.clipboard.writeText to copy it to the user\'s clipboard.\n4. When done, show a dark-mode floating toast in the top right corner for 3 seconds.'
  },
  'office-email-alert': {
    trackName: 'Office work',
    badge: 'Automatic notifications',
    title: 'Conditional email sender and messenger (Slack, Jandi, KakaoTalk) webhook alerts',
    summary: 'Sends personalized emails and internal messenger alerts in bulk when a deadline nears, stock runs low or an anomaly occurs',
    publicIdeas: [
      'Send a KakaoTalk notification or email to the officer in charge three days before a citizen request deadline',
      'Personalized emails to public rental housing tenants about rent due dates and contract renewal',
      'Send the duty officer a mobile alert and a handover checklist the day before their shift'
    ],
    privateIdeas: [
      'Personalized discount coupon email seven days before a subscription payment expires',
      'Urgent Slack or Jandi (a Korean team messenger) webhook call when a server fails or stock runs out',
      'Bulk emails to parents with each student\'s attendance and mock exam report attached as PDF'
    ],
    techStack: ['Python', 'smtplib / email', 'Requests (Webhook)', 'Jinja2 Template'],
    pros: [
      'Works with company Exchange/Outlook or an internal SMTP server',
      'Sends 1,000 recipients a custom email with their own name and PDF attachment in about a minute',
      'Adds send delays (rate limit) to avoid spam filters and logs successes and failures'
    ],
    comboGuide: 'Build a pipeline that checks the Excel list first and then emails a personalized PDF only to valid recipients.',
    cliCommand: 'python send_alerts.py --config=smtp.json --list=recipients.xlsx',
    promptTemplate: 'You are an engineer for work communication automation and webhook notification systems.\n[Goal]: Write a conditional email and messenger alert sender for {PROJECT_NAME}.\n[Requirements]:\n1. Read the Excel recipient list (name, email, due date, amount and so on) and render clean HTML emails with Jinja2.\n2. Send over a secure smtplib.SMTP_SSL connection and attach each recipient\'s own file.\n3. Send urgent alerts as JSON messages to a Slack or Jandi webhook URL in real time.\n4. Log each send to history.csv with timestamp, success flag and error message.'
  },
  'office-csv-cleaner': {
    trackName: 'Office work',
    badge: 'Korean encoding repair',
    title: 'Repair and clean public data CSVs with broken Korean text (CP949/EUC-KR)',
    summary: 'Detects broken CSV files downloaded from Korea\'s public data portal or older government systems and converts them to UTF-8-SIG in one batch',
    publicIdeas: [
      'Repair garbled Korean text in files downloaded from Korea\'s public data portal (data.go.kr) in seconds',
      'Normalize large CSVs of city bus boarding and alighting statistics by route and stop',
      'Fill gaps in weather observation time series and convert dates to a standard format'
    ],
    privateIdeas: [
      'Convert encoding of Google Forms response CSVs so Korean text does not break when uploaded to the ERP',
      'Remove the BOM (byte order mark) and clean field separators in e-commerce payment log CSVs',
      'Strip blanks and special characters from warehouse inventory barcode scan CSVs'
    ],
    techStack: ['Python', 'chardet (encoding detection)', 'Pandas', 'CLI Batch'],
    pros: [
      'Detects CP949, EUC-KR, UTF-8 and UTF-16 without opening the file',
      'Converts to UTF-8-SIG so Korean text shows correctly when you double-click the file in Excel',
      'Processes gigabyte-sized CSVs in chunks without running out of memory'
    ],
    comboGuide: 'Clean broken CSVs first and then pass them to the Excel merge tool to avoid encoding conflicts.',
    cliCommand: 'pip install chardet\npython fix_encoding.py --dir="./raw_csv"',
    promptTemplate: 'You are an expert in Korean character encoding and large-scale text cleaning.\n[Goal]: Write a tool for {PROJECT_NAME} that detects and repairs the encoding of Korean CSV files.\n[Requirements]:\n1. Use chardet/charset_normalizer to detect the source encoding with 99% confidence.\n2. Do not stop on damaged bytes; recover with errors=\'replace\' or a regex.\n3. Save with \'utf-8-sig\' encoding for Excel compatibility.\n4. Support multiprocessing to handle hundreds of CSVs in a folder in one batch.'
  },
  'office-image-watermark': {
    trackName: 'Office work',
    badge: 'Site photo records',
    title: 'Batch resize and timestamp watermark tool for site evidence photos',
    summary: 'Stamps the date, time and GPS coordinates on thousands of construction, enforcement and survey photos and compresses them for reports',
    publicIdeas: [
      'Stamp date, time and project name on before and after photos of road and facility repairs',
      'Organize illegal parking enforcement photos and blur license plates (personal data) automatically',
      'Extract GPS EXIF metadata from disaster damage photos and map the coordinates'
    ],
    privateIdeas: [
      'Standardize and watermark construction photos for supervision reports on building and plant projects',
      'Add a company logo watermark and optimize resolution for real estate listing photos',
      'Compress online store product photos (WebP conversion) and add a copyright notice'
    ],
    techStack: ['Python', 'Pillow (PIL)', 'piexif (EXIF analysis)', 'CustomTkinter'],
    pros: [
      'Reads hidden EXIF data (date taken, location) from smartphone photos and stamps it in the bottom right corner',
      'Compresses 500 high-resolution photos of over 10MB each to about 500KB each for reports in about a minute',
      'One-click drag-and-drop GUI that colleagues with little computer experience can use'
    ],
    comboGuide: 'Place the organized site photos into tables in a standard HWPX document or a PDF report.',
    cliCommand: 'python photo_watermark.py --input="./photos" --text="Work completed"',
    promptTemplate: 'You are an engineer for image processing and EXIF metadata automation.\n[Goal]: Build a tool that watermarks and optimizes large numbers of site photos for {PROJECT_NAME}.\n[Features]:\n1. Extract the actual date taken (DateTimeOriginal) from the EXIF metadata of images (JPG, PNG, HEIC) in a folder.\n2. Render a watermark with the date and project name in white text on a semi-transparent black box in the bottom right corner.\n3. Reduce file size by about 70% with minimal quality loss (quality 85, optimized save).\n4. Show progress in real time in a CustomTkinter UI.'
  },
  'desktop-customtkinter-exe': {
    trackName: 'Desktop programs',
    badge: 'Recommended for beginners',
    title: 'Modern Windows app with Python CustomTkinter (single .exe file)',
    summary: 'Builds a clean Windows program with dark mode and packages it so it runs by double-click on PCs without Python',
    publicIdeas: [
      'File format conversion and encryption tool for air-gapped public agency PCs (work PCs kept on a network separated from the internet)',
      'Queue number display and touchscreen kiosk software for a community center service desk',
      'Search tool for the local emergency contact list and response manual in a city or district duty office'
    ],
    privateIdeas: [
      'Standalone drag-and-drop Excel merge tool to share with non-developer colleagues',
      'Desktop program that prints serial numbers from a barcode scanner on a factory line',
      'Customer check-in and waiting number program for a physical store'
    ],
    techStack: ['Python', 'CustomTkinter', 'PyInstaller', 'SQLite'],
    pros: [
      'Ships as one .exe file with no Python or library install needed',
      'File drag and drop, dark and light mode, and responsive layout out of the box',
      'Uses threading so the UI does not freeze or crash during large jobs'
    ],
    comboGuide: 'Put a CustomTkinter GUI on top of your Python Excel or PDF engine to finish it as a usable tool.',
    cliCommand: 'pip install customtkinter pyinstaller\npyinstaller --onefile --noconsole --name="MyOfficeTool" app.py',
    promptTemplate: 'You are an expert in Windows desktop GUIs and PyInstaller packaging.\n[Goal]: Build a standalone Windows program (.exe) for {PROJECT_NAME}.\n[Tech stack]: Python, CustomTkinter (modern theme), PyInstaller\n[Must implement]:\n1. A CustomTkinter file picker, progress bar and log text box.\n2. Run background work in a separate threading.Thread so the UI does not show \'Not responding\'.\n3. Play a system beep and show a popup when the job is done.\n4. Write a build.bat script for the PyInstaller build (--onefile --noconsole).'
  },
  'desktop-electron-cross': {
    trackName: 'Desktop programs',
    badge: 'Rich web graphics',
    title: 'Cross-platform desktop software built on Electron web technology',
    summary: 'Packages screens and charts built with HTML, CSS and JS as a desktop app',
    publicIdeas: [
      'Desktop dashboard app for the large monitors of a local government smart city control center',
      'Interactive digital exhibit kiosk program for a national museum or science center',
      'Touchscreen program for library seat booking and book search'
    ],
    privateIdeas: [
      'Real-time stock and crypto chart viewer and multi-window trading station',
      'Local font and graphic asset previewer for designers',
      'Video meeting screen recorder with live timeline bookmarks'
    ],
    techStack: ['Electron', 'Node.js', 'Vanilla JS / React', 'electron-builder'],
    pros: [
      'Brings web animations, SVG graphics and dark theme screens into a desktop app as they are',
      'Supports the Windows system tray, global shortcuts (Alt+Space) and push notifications',
      'Builds Windows (.exe installer) and Mac (.dmg) versions from the same code'
    ],
    comboGuide: 'Wrap an admin dashboard built as a web service in Electron to offer a desktop client for key users.',
    cliCommand: 'npx create-electron-app my-app\nnpm run make',
    promptTemplate: 'You are an architect for cross-platform Electron desktop applications.\n[Goal]: Build an installable desktop program for {PROJECT_NAME}.\n[Requirements]:\n1. Implement secure IPC between the main process and renderer process through ContextBridge (preload.js).\n2. Support a system tray icon and an option to minimize to the tray when the window is closed.\n3. Control permissions for reading and writing the local file system.\n4. Configure electron-builder to build a single Windows installer (Setup.exe).'
  },
  'desktop-tauri-fast': {
    trackName: 'Desktop programs',
    badge: 'Under 10MB',
    title: 'Lightweight desktop app with Rust Tauri',
    summary: 'Standalone program with an installer under 10MB and memory use under 30MB that runs well on old PCs',
    publicIdeas: [
      'File explorer that opens quickly without lag on low-spec Windows PCs in public agencies',
      'Lightweight offline data entry app on tablets for officers doing field surveys',
      'Lightweight background daemon for security checks and threat monitoring on government networks'
    ],
    privateIdeas: [
      'Lightweight hardware resource monitoring overlay for developers and gamers',
      'Quick memo and clipboard history manager that opens at Windows startup',
      'Fast local Markdown renderer and technical document viewer'
    ],
    techStack: ['Rust', 'Tauri v2', 'HTML5 / Vanilla JS', 'WebView2'],
    pros: [
      'About 1/10 the memory of Electron (under 30MB) and about 1/15 the installer size (under 8MB)',
      'Rust memory safety and a compiled binary that is hard to reverse engineer',
      'Reuses the operating system\'s WebView2, so install size and memory use stay small'
    ],
    comboGuide: 'Collect data with a lightweight Tauri client and sync it with Cloudflare Pages.',
    cliCommand: 'npm create tauri-app@latest\nnpm run tauri build',
    promptTemplate: 'You are an expert in high-performance desktop apps with Rust Tauri.\n[Goal]: Build a lightweight desktop program for {PROJECT_NAME}.\n[Architecture]:\n1. Build the front end with plain HTML/CSS/JS and handle the back end with Rust Tauri commands.\n2. Let Rust handle fast local file I/O and data processing and send serialized results to the front end.\n3. Add a system tray, global shortcuts and window transparency (vibrancy).\n4. Keep the final release build under 10MB.'
  },
  'desktop-pyside-qt': {
    trackName: 'Desktop programs',
    badge: 'For engineering experts',
    title: 'Professional data visualization and control program with PySide6 (Qt)',
    summary: 'Suited to complex multi-window apps, connecting to measurement hardware and drawing real-time 2D/3D scientific graphs',
    publicIdeas: [
      'Real-time time-series monitoring software for forest fire sensors and CCTV at the Korea Forest Service',
      'Viewer that overlays digital map layers (GIS) from the National Geographic Information Institute',
      'Real-time telemetry control program for river water quality and air quality monitoring networks of the Ministry of Environment'
    ],
    privateIdeas: [
      'Real-time graph analyzer for measurement data from semiconductor and display process equipment',
      'Player that visualizes LiDAR and camera logs from autonomous driving test vehicles',
      'Visualization toolkit for gene sequencing data in a biotech or healthcare lab'
    ],
    techStack: ['Python', 'PySide6 (Qt for Python)', 'PyQtGraph (fast rendering)', 'NumPy'],
    pros: [
      'Shows large real-time data graphs at 60 frames per second or more',
      'Full enterprise desktop UX: dockable panels, tab views, menu bar and shortcuts',
      'Uses the performance of the C++ Qt engine with Python syntax'
    ],
    comboGuide: 'Choose CustomTkinter for simple tools and PySide6 for large, complex measurement tools.',
    cliCommand: 'pip install pyside6 pyqtgraph numpy\npython main_qt.py',
    promptTemplate: 'You are an enterprise GUI developer with PySide6 (Qt).\n[Goal]: Build a high-performance data visualization desktop program for {PROJECT_NAME}.\n[Requirements]:\n1. Subclass QMainWindow and apply the QDarkStyleSheet theme.\n2. Use PyQtGraph to plot tens of thousands of time-series points per second in real time without lag.\n3. Separate the data collection thread from the UI thread with QThread and the signal/slot pattern.\n4. Export analysis data to CSV and high-resolution images (SVG/PNG).'
  },
  'web-firebase-fullstack': {
    trackName: 'Cloud web and DB',
    badge: 'Serverless, deploy in minutes',
    title: 'Full-stack real-time web service with Firebase (Auth + Firestore + CDN)',
    summary: 'Google login, a real-time NoSQL database and free global hosting without knowing how to set up a server',
    publicIdeas: [
      'Participatory budgeting: residents submit proposals and vote online in real time',
      'Real-time booking board for local government sports facilities and meeting rooms',
      'Volunteer recruitment for vulnerable residents with a record of verified volunteer hours'
    ],
    privateIdeas: [
      'Real-time board for company clubs to manage meetings and settle membership fees openly',
      'Online booking page for small businesses such as nail salons, hair salons and Pilates studios',
      'Feature request voting and public development roadmap board for a SaaS product'
    ],
    techStack: ['Vanilla JS / React', 'Firebase Auth', 'Cloud Firestore', 'Firebase Hosting'],
    pros: [
      'Builds a web service in minutes with the plain JavaScript SDK, without Linux server setup or back-end code',
      'onSnapshot listeners update the screen as soon as data changes, without a page reload',
      'Provides Google login, email login and free hosting on a global CDN'
    ],
    comboGuide: 'Add a Gemini 2.0 AI chatbot to the Firebase web service to build a portal that answers user questions in real time.',
    cliCommand: 'npm install -g firebase-tools\nfirebase login\nfirebase deploy --only hosting',
    promptTemplate: 'You are an expert in full-stack web development with Google Firebase.\n[Goal]: Build a serverless web application for {PROJECT_NAME} as a single HTML file or with a modern stack.\n[Must implement]:\n1. Google login (signInWithPopup) and auth state tracking (onAuthStateChanged) with the Firebase Modular SDK (v10+).\n2. Add data to a Cloud Firestore collection (addDoc), query it (query, orderBy) and sync it in real time (onSnapshot).\n3. A dark theme UI with a glassmorphism style and a card-based board layout.\n4. Tune firebase.json and the firestore.rules security rules.'
  },
  'web-supabase-react': {
    trackName: 'Cloud web and DB',
    badge: 'Relational SQL database',
    title: 'Modern enterprise web service on Supabase PostgreSQL',
    summary: 'Web platform with an enterprise-grade relational database (PostgreSQL) and Row Level Security',
    publicIdeas: [
      'Many-to-many platform that matches young job seekers with mentors and tracks their history for a local government',
      'Open portal of public data for small business district analysis with complex SQL dashboards',
      'Combined search portal for papers and research projects of public research institutes'
    ],
    privateIdeas: [
      'Enterprise dashboard for B2B customer management (CRM) and contract and sales history',
      'Paid membership platform for knowledge content and community (with Stripe payments)',
      'SaaS for freelance project milestones and payment settlement'
    ],
    techStack: ['React / Next.js', 'Supabase (PostgreSQL)', 'Row Level Security', 'Vercel'],
    pros: [
      'Scales on open-source PostgreSQL with foreign keys, joins and transactions',
      'RLS enforces in the database engine that logged-in users can change only their own data',
      'Includes large file uploads (Supabase Storage) and serverless Edge Functions'
    ],
    comboGuide: 'Keep complex relational data in Supabase and deploy with Vercel to complete the full stack.',
    cliCommand: 'npm create vite@latest my-app -- --template react\nnpm install @supabase/supabase-js',
    promptTemplate: 'You are a full-stack engineer working with Supabase and React.\n[Goal]: Build a modern web service on a relational database for {PROJECT_NAME}.\n[Requirements]:\n1. Design the Supabase PostgreSQL schema (define foreign key relations between tables).\n2. Write Row Level Security (RLS) policies to isolate each user\'s data and separate admin rights.\n3. Implement CRUD and real-time table subscriptions (channel) with the @supabase/supabase-js client.\n4. Build a responsive enterprise dashboard UI with Tailwind CSS or clean vanilla CSS.'
  },
  'web-cloudflare-pages': {
    trackName: 'Cloud web and DB',
    badge: 'Global edge network',
    title: 'Serverless website on Cloudflare Pages + D1 with fast global response',
    summary: 'Full stack on an edge SQLite database that stays up and stays cheap during traffic spikes',
    publicIdeas: [
      'Emergency shelter guide site that handles a million concurrent users during typhoons, heavy snow or wildfires',
      'Mobile site showing free parking spaces in real time during a major local tourism festival',
      'Nationwide portal for real-time weather and fine dust forecasts from public data'
    ],
    privateIdeas: [
      'Product launch landing page with no egress fees even during heavy traffic spikes',
      'Multilingual document search portal for customers around the world',
      'Lightweight personal portfolio and tech blog on serverless SQLite (D1)'
    ],
    techStack: ['Cloudflare Pages', 'Cloudflare D1 (SQLite)', 'Wrangler CLI', 'Hono.js'],
    pros: [
      'Responds from the closest of edge data centers in about 300 cities, with very low latency',
      'Unlike AWS S3, data download (egress) traffic is free (with R2 storage)',
      'One git push builds and deploys globally in about a minute'
    ],
    comboGuide: 'Connect the global back-end API of a Tauri desktop app to Cloudflare Workers + D1.',
    cliCommand: 'npm create cloudflare@latest\nnpx wrangler d1 create my-db\nnpx wrangler pages deploy',
    promptTemplate: 'You are an expert in edge computing with Cloudflare.\n[Goal]: Build a global serverless full stack for {PROJECT_NAME}.\n[Architecture]:\n1. Combine Cloudflare Pages + Functions (or the lightweight Hono.js web framework).\n2. Create the Cloudflare D1 (distributed SQLite) schema and bind SQL queries.\n3. Tune edge caching headers worldwide (Cache-Control: s-maxage=3600).\n4. Write the wrangler.toml configuration and set up an automatic deployment pipeline.'
  },
  'web-survey-analytics': {
    trackName: 'Cloud web and DB',
    badge: 'Real-time polling',
    title: 'Public or customer survey with a real-time statistics chart dashboard',
    summary: 'Survey platform with duplicate-response prevention, conditional branching questions and interactive real-time charts (Chart.js)',
    publicIdeas: [
      'Real-time citizen satisfaction survey on city policy with charts by age and area published right away',
      'Collect a public agency\'s own customer satisfaction (PCSI) results and compare them by department',
      'Vote on new community programs and show the results as a word cloud'
    ],
    privateIdeas: [
      'Demand survey of target customers before a product launch and NPS (Net Promoter Score) calculation',
      'Real-time satisfaction survey and feedback collection right after a webinar or conference',
      'Dashboard for an anonymous internal culture survey'
    ],
    techStack: ['Vanilla JS / React', 'Chart.js', 'Firebase / Supabase', 'CSV Export'],
    pros: [
      'Result charts update in real time as soon as a response is submitted',
      'Blocks duplicate responses with IP and browser fingerprinting',
      'Downloads response data as a clean Excel (CSV) file with one click'
    ],
    comboGuide: 'Run sentiment analysis on open-ended answers with Gemini 2.0 AI and produce a three-line summary report.',
    cliCommand: 'npm install chart.js\npython -m http.server 8080',
    promptTemplate: 'You are an engineer for large-scale survey and data visualization web applications.\n[Goal]: Build a real-time interactive survey dashboard for {PROJECT_NAME}.\n[Features]:\n1. Render forms for single choice, multiple choice, 5-point scale and open-ended questions.\n2. Save each response to Firestore/Supabase right away and sync Chart.js donut and bar charts in real time.\n3. In admin mode, filter respondents (age group, gender) and download to Excel.\n4. Responsive design that also works on mobile screens.'
  },
  'agent-browser-playwright': {
    trackName: 'Browser and crawlers',
    badge: 'Block-resistant crawler',
    title: 'Playwright headless browser collection bot and screen capture',
    summary: 'Collects data through two-factor login, JavaScript rendering and CAPTCHA blocks by moving the mouse like a real person',
    publicIdeas: [
      'Collect subsidy program notices every day from the bulletin boards of about 240 local governments',
      'Collect new notices from government welfare and job portals (such as Bokjiro and Worknet) and the contact emails in them',
      'Take regular screenshots of public portals to detect outages and defacement in real time'
    ],
    privateIdeas: [
      'Check competitors\' prices and stock on e-commerce sites (Naver Shopping, Coupang) every five minutes',
      'Bot that sends a Telegram alert when a bargain property in your area is listed on Naver Real Estate',
      'Real-time alerts for airline fare deals and canceled hotel rooms'
    ],
    techStack: ['Python / Node.js', 'Playwright', 'BeautifulSoup4', 'StorageState'],
    pros: [
      'Collects from modern React and Vue sites after rendering, where plain HTML parsing fails',
      'Saves the login session (cookies and local storage) so you do not go through two-factor login every time',
      'Runs as a cron batch every morning at 8 and generates an Excel report'
    ],
    comboGuide: 'Clean the collected unstructured web data with the Python Excel tool, then report anomalies by email right away.',
    cliCommand: 'pip install playwright\nplaywright install chromium\npython bot.py',
    promptTemplate: 'You are a lead engineer for web crawling and browser automation with Playwright.\n[Goal]: Build a scraper that safely collects dynamic data from the {PROJECT_NAME} site.\n[Requirements]:\n1. Run a Chromium browser in the background (headless) with the Playwright async API.\n2. Reliable logic that waits (waitForSelector) for infinite scroll and dynamic AJAX loading.\n3. Spoof the browser fingerprint and add random delays to avoid bot detection.\n4. Save the login cookie state (StorageState) to a local JSON file to keep the session without logging in again.\n5. Export the results with timestamps to SQLite or Excel.'
  },
  'agent-selenium-automation': {
    trackName: 'Browser and crawlers',
    badge: 'Intranet macro',
    title: 'Selenium bot for legacy government and public agency security sites',
    summary: 'Automates work on legacy intranets and financial portals full of security plugins, old ActiveX remnants and popups',
    publicIdeas: [
      'Issue hundreds of electronic tax invoices on Hometax (Korea\'s National Tax Service site) and check their status',
      'File employee hire and exit reports for the four social insurances through the national insurance portal',
      'Look up local tax payment history on Wetax (Korea\'s local tax site) and download receipts in one batch'
    ],
    privateIdeas: [
      'Macro for bulk orders on a B2B wholesale portal and checking virtual account deposits',
      'Enter dispatch details and tracking numbers into a freight carrier\'s system in one batch',
      'Scrape transfer history from corporate internet banking and post journal entries to the ERP'
    ],
    techStack: ['Python', 'Selenium', 'WebDriver Manager', 'PyAutoGUI'],
    pros: [
      'Handles alert and confirm popups and nested iframes on old enterprise websites',
      'Combines hardware-level keyboard and mouse events (PyAutoGUI) to work around keyboard security software',
      'Records the screen or saves screenshots on failure so you can explain each step in a later audit'
    ],
    comboGuide: 'Read an Excel list, enter it into the internal system with Selenium, and write the results back to Excel.',
    cliCommand: 'pip install selenium webdriver-manager pyautogui\npython legacy_bot.py',
    promptTemplate: 'You are an engineer who automates legacy public sector and financial websites with Selenium.\n[Goal]: Build a reliable Selenium bot that handles the repeated tasks of {PROJECT_NAME}.\n[Requirements]:\n1. Handle slow loading with explicit waits using WebDriverWait and expected_conditions.\n2. Switch between multiple browser tabs and popup windows (window_handles).\n3. Find form elements inside iframes (switch_to.frame).\n4. On an exception, save a screenshot of the current screen as logs/error_TIME.png and run retry logic.'
  },
  'agent-rss-news-digest': {
    trackName: 'Browser and crawlers',
    badge: 'Automatic news briefing',
    title: 'Real-time collection of ministry press releases and news with a morning briefing bot',
    summary: 'Checks RSS feeds of major news outlets and ministries every 30 minutes and reports issues related to your organization',
    publicIdeas: [
      'Clip morning and evening newspaper articles about your ministry or local government and report them to the spokesperson\'s office',
      'Watch new bills in the National Assembly bill information system in real time and alert the relevant standing committee',
      'Monitor press coverage of major local complaint keywords in real time'
    ],
    privateIdeas: [
      'Morning Slack briefing on competitors\' product launches and patent filings',
      'Real-time translated Telegram alerts on breaking foreign news about major stocks and crypto',
      'Automatic newsletter for the purchasing team on raw material prices and exchange rates'
    ],
    techStack: ['Python', 'feedparser', 'BeautifulSoup4', 'Gemini 2.0 Flash', 'Slack Webhook'],
    pros: [
      'Collects the latest articles through standard RSS feeds without visiting dozens of news sites one by one',
      'Gemini AI removes duplicate and clickbait articles and summarizes the key facts in three lines',
      'Delivers the briefing every morning at 8 to KakaoTalk, Jandi or Slack'
    ],
    comboGuide: 'Analyze the morning news and connect it to generate a draft response press release for your organization.',
    cliCommand: 'python news_digest.py --keywords="AI,digital government,cloud"',
    promptTemplate: 'You are an engineer for real-time news monitoring and AI digest briefings.\n[Goal]: Build a real-time news monitoring and summary bot for {PROJECT_NAME}.\n[Implementation]:\n1. Poll RSS feeds of major news outlets and government briefings every 30 minutes with feedparser.\n2. Filter by key words (include, exclude) and cluster similar articles to remove duplicates.\n3. Call the Gemini Flash API to compress each article into three lines: [Background], [Key points], [Implications].\n4. Send the finished morning briefing in Markdown to the internal messenger (Slack/Jandi/Telegram).'
  },
  'agent-mcp-server': {
    trackName: 'AI agents and MCP',
    badge: 'Internal AI tools',
    title: 'Custom MCP (Model Context Protocol) server that turns internal systems into tools',
    summary: 'Standard protocol that lets AI coding agents such as Claude Code and Antigravity query internal databases and edit files',
    publicIdeas: [
      'Ask the AI in plain language, "What is the remaining welfare budget for City A last month?", and it queries the internal DB directly',
      'Register the On-Nara official document search API (the Korean government\'s document system) as an MCP tool to pull past documents when writing reports',
      'An AI agent monitors facility sensor anomalies for a local government and runs a recovery script with one click'
    ],
    privateIdeas: [
      'Let an AI coding tool send Slack messages, create Jira tickets and create Notion pages',
      'Connect a tool that queries ERP payment records and checks for anomalies in accounting audits',
      'Tool set where an AI agent checks each new commit against internal security rules'
    ],
    techStack: ['Node.js / Python', '@modelcontextprotocol/sdk', 'JSON-RPC 2.0', 'Stdio'],
    pros: [
      'An open standard for connecting AI tools, supported by current AI agents from Anthropic, Google Antigravity and others',
      'The AI runs Python scripts and queries DB data safely from plain language commands',
      'Keeps sensitive DB passwords and tokens on the local PC and isolates permissions there'
    ],
    comboGuide: 'Once you build a custom MCP server, you can operate internal systems by talking to Antigravity or Claude Code.',
    cliCommand: 'npm install @modelcontextprotocol/sdk\nnode server.js',
    promptTemplate: 'You are an expert in building Model Context Protocol (MCP) servers.\n[Goal]: Implement the {PROJECT_NAME} system as a custom MCP server that AI agents can call.\n[Requirements]:\n1. Implement a standard server on StdioServerTransport with @modelcontextprotocol/sdk.\n2. Define the list of tools the agent can call (name, description, JSON Schema parameters).\n3. In the handler (CallToolRequestSchema), validate parameters and run the business logic.\n4. Return structured text and JSON that the AI can understand easily.\n5. Provide a JSON config snippet that can be added to antigravity_mcp_config.json right away.'
  },
  'agent-gemini-multimodal': {
    trackName: 'AI agents and MCP',
    badge: '2M-token AI',
    title: 'Large multimodal analyzer with Gemini 2.0 Flash (hundreds of PDF pages, video, audio)',
    summary: 'Analyzes contracts hundreds of pages long, long meeting recordings and images at once with a 2-million-token context window',
    publicIdeas: [
      'Load a 500-page parliamentary audit transcript and summarize key issues and each member\'s questions in three lines',
      'Upload hundreds of attachments to subsidy applications and detect missing documents',
      'Analyze photos of road damage and illegal banners and assign a risk grade'
    ],
    privateIdeas: [
      'Analyze dozens of pages of complex English contracts and extract unfavorable clauses and legal risks',
      'Upload a one-hour product planning meeting recording and list decisions and action items',
      'Analyze construction and plant site photos to detect safety violations such as missing hard hats'
    ],
    techStack: ['JavaScript / Python', '@google/genai SDK', 'gemini-2.0-flash', 'Streaming API'],
    pros: [
      'Analyzes a 1,000-page document in one pass with its full context, without chunking',
      'Accepts scanned receipt images, meeting audio and site videos along with text',
      'Supports streaming: the answer appears as it is typed, without waiting for it to finish'
    ],
    comboGuide: 'Send the unstructured text and images extracted with the PDF toolkit to the Gemini 2.0 multimodal API to write an analysis report.',
    cliCommand: 'npm install @google/genai\nnode analyze.js --file="contract.pdf"',
    promptTemplate: 'You are an architect for multimodal applications with Google Gemini 2.0.\n[Goal]: Build a large document and multimodal analysis pipeline for {PROJECT_NAME}.\n[Requirements]:\n1. Call the gemini-2.0-flash model with the latest Google Gen AI SDK.\n2. Upload large PDF documents or images as inline base64 or through the Files API.\n3. Set a system instruction for fact-based analysis, no hallucination and tidy table output.\n4. Use generateContentStream to render the answer on screen in real time as it streams.'
  },
  'agent-whisper-meeting': {
    trackName: 'AI agents and MCP',
    badge: 'Meeting minutes',
    title: 'Offline speech-to-text (STT) for meeting recordings and minutes generator',
    summary: 'Converts recordings to text on a local PC without internet, separates speakers and writes a summary',
    publicIdeas: [
      'Transcribe all statements in local council plenary sessions and summarize each member\'s arguments for and against',
      'Sort recordings of public hearings by key issue and write a report',
      'Transcribe closed disciplinary and grievance committee recordings locally to keep them confidential'
    ],
    privateIdeas: [
      'Transcribe weekly strategy meetings and list to-dos for each department',
      'Transcribe all inbound call center recordings and detect spikes in complaint keywords',
      'Generate subtitles (.srt) for YouTube and podcast interviews and convert them into blog posts'
    ],
    techStack: ['Python', 'faster-whisper', 'PyAnnote (speaker diarization)', 'Ollama / Gemini'],
    pros: [
      'Converts sensitive internal meeting audio on the local PC without uploading it to an outside cloud',
      'Uses the faster-whisper CTranslate2 engine, about four times faster than OpenAI Whisper',
      'Separates statements by speaker (Speaker 1, Speaker 2) and builds minutes in the standard government format'
    ],
    comboGuide: 'Feed the transcribed meeting text into the standard HWPX document builder to produce minutes ready for approval.',
    cliCommand: 'pip install faster-whisper\npython transcribe.py --audio="meeting.mp3"',
    promptTemplate: 'You are an engineer for speech recognition (STT) and meeting minutes generation.\n[Goal]: Build a pipeline that writes high-quality minutes from {PROJECT_NAME} audio recordings.\n[Pipeline]:\n1. Transcribe audio files with faster-whisper (large-v3 or medium model), Korean only.\n2. Align sentences by timestamp and filter out noise and filler words.\n3. Summarize with an LLM (Gemini or local Ollama) into four sections:\n   - [Meeting overview]: date and time, place, attendees, main agenda\n   - [Discussion by agenda item]: issues and each attendee\'s views\n   - [Decisions]: agreed conclusions\n   - [Action items]: owner and target date\n4. Export the minutes as a standard government HWPX file or an Excel document.'
  },
  'agent-rag-vector-search': {
    trackName: 'AI agents and MCP',
    badge: 'Source-grounded chatbot',
    title: 'RAG (retrieval-augmented generation) chatbot on internal rules and work manuals',
    summary: 'Knowledge chatbot that turns internal PDF, HWPX and Notion documents into vectors and answers with the exact source page',
    publicIdeas: [
      '24-hour chatbot that explains welfare benefits to citizens (based on a local government welfare guidebook)',
      'Assistant that explains procedures and forms to new officers based on the citizen request handbook',
      'Chatbot that guides review of freedom of information requests and what may be withheld'
    ],
    privateIdeas: [
      'First-line customer support chatbot based on technical manuals for a complex B2B IT product',
      'Internal chatbot on employment rules, family event allowances and leave calculation',
      'Chatbot that searches troubleshooting manuals by machine fault code for a manufacturer'
    ],
    techStack: [
      'Python / TypeScript',
      'LangChain / LlamaIndex',
      'ChromaDB / Pinecone',
      'Gemini / Claude'
    ],
    pros: [
      'Answers only from the uploaded internal documents, which reduces made-up answers (hallucinations)',
      'Cites the exact source under each answer, such as [Source]: "2026_welfare_handbook.pdf, page 45"',
      'When a document changes, re-embeds only that file so the rules stay current'
    ],
    comboGuide: 'Use local Ollama RAG on the internal secure network and cloud RAG for public-facing services.',
    cliCommand: 'pip install langchain chromadb\npython build_rag.py --docs="./manuals"',
    promptTemplate: 'You are an engineer for retrieval-augmented generation (RAG) systems.\n[Goal]: Build a reliable Q&A chatbot on the internal rules of {PROJECT_NAME}.\n[Requirements]:\n1. Extract text from internal documents (PDF/HWPX/DOCX) and split it into semantic chunks.\n2. Embed the text and index it in ChromaDB with metadata (file name, page number).\n3. For each query, inject the top 3 chunks by cosine similarity as context.\n4. System prompt: "Never guess anything that is not in the given context; answer \'This is not stated in the rules.\' Cite a source for every sentence."'
  },
  'agent-remotion-video': {
    trackName: 'AI agents and MCP',
    badge: 'Video from code',
    title: 'Short data video rendering engine built on React code (Remotion)',
    summary: 'Generates YouTube Shorts and Instagram Reels in bulk from React code and data (JSON/CSV), without a video editor',
    publicIdeas: [
      'Render short card-news videos on this week\'s city news and disaster safety tips',
      'Animated infographic videos of public data statistics (fine dust, weather warnings, prices)',
      'Vertical 9:16 Shorts that summarize public agency job openings and youth policies'
    ],
    privateIdeas: [
      'Generate daily TikTok, Reels and Shorts briefings on the stock market and bargain properties',
      'Produce promo videos of best-selling products with review summaries in one batch',
      'Cut highlight clips with subtitles from online lectures and publish them as Shorts'
    ],
    techStack: ['React', 'Remotion', 'Node.js', 'FFmpeg'],
    pros: [
      'Builds video layout and subtitles with React components (JSX), without heavy editors like Premiere Pro',
      'When data in the database changes, the server renders a new MP4 in about a minute',
      'Swaps data into the same design template to produce 100 Shorts a day'
    ],
    comboGuide: 'Summarize the morning news collected via RSS in three lines with Gemini, then pass it to the Remotion renderer to publish Shorts.',
    cliCommand: 'npx remotion init\nnpx remotion render src/index.ts MyComp out.mp4',
    promptTemplate: 'You are an expert in programmatic video production with Remotion.\n[Goal]: Build a vertical 9:16 short video composition for {PROJECT_NAME}.\n[Requirements]:\n1. Set up a Remotion composition (1080x1920, 30fps, 15 seconds).\n2. Animate subtitle titles in and out with interpolate and spring.\n3. Build the screen from data props (title, three summary sentences, background image).\n4. Batch-render MP4 files unattended on a headless server with the npx remotion render CLI command.'
  }
};

export const DECISION_TREE_EN = {
  start: {
    step: 'Step 1 / 5',
    title: 'Choose where it runs',
    question: 'Do you want to build this as a standalone window program instead of something that runs in a browser?',
    desc: 'Choose [YES] to open it in its own window on your computer without a browser, or [NO] to open it in a web browser such as Chrome or Edge.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - build it as a popup window or standalone program',
        subLabel: 'Your own window program that starts with a double-click (.exe) on the desktop'
      },
      {
        badge: 'NO',
        label: 'No - build it to run in a web browser window',
        subLabel: 'Open it by web address (URL) in Chrome or Edge, or from a browser bookmark'
      }
    ]
  },
  q2_desktop_sec: {
    step: 'Step 2 / 5',
    title: 'Check security and network environment',
    question: 'Must it run on an air-gapped internal network with no internet, or where data must never leave the organization?',
    desc: 'Checks whether this is an offline PC with no internet connection, as in public agencies, banks or research labs. Korean public agencies keep work PCs on a network separated from the internet.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - it must work in an offline or air-gapped secure environment',
        subLabel: 'All data is processed only on your PC, with no internet connection'
      },
      {
        badge: 'NO',
        label: 'No - normal internet access is available',
        subLabel: 'You can use external APIs, cloud updates and rich web technology'
      }
    ]
  },
  q2_browser_target: {
    step: 'Step 2 / 5',
    title: 'Share data online or not',
    question: 'Do several people need to save and share data together in real time through a website link (URL)?',
    desc: 'Checks whether you need a web service with sign-up, login, a board and a cloud database.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - several people need to save data together through a link (URL)',
        subLabel: 'Web service with free hosting, a database (DB) and login'
      },
      {
        badge: 'NO',
        label: 'No - I only need macros or tasks in my own browser',
        subLabel: 'Bookmark macros, web data collection bots, internal air-gapped AI and similar'
      }
    ]
  },
  q3_desktop_sec_task: {
    step: 'Step 3 / 5',
    title: 'Choose the main task on the air-gapped network',
    question: 'Which task takes the most time on your air-gapped PC?',
    desc: 'Choose the type of document or data you want to automate.',
    options: [
      {
        text: 'Merge dozens to hundreds of Excel/CSV files and check for outliers'
      },
      {
        text: 'Extract tables from scanned PDFs or electronic documents and split pages'
      },
      {
        text: 'Generate standard government reports in Hangul (HWP/HWPX, the Korean government document format) and build press releases'
      },
      {
        text: 'Detect duplicate welfare subsidy payments and manage local tax arrears notices'
      }
    ]
  },
  q3_desktop_open_engine: {
    step: 'Step 3 / 5',
    title: 'Choose the desktop program engine',
    question: 'What kind of standalone program do you want to build?',
    desc: 'Choose between Python (easiest), rich web design, or a lightweight native app.',
    options: [
      {
        text: 'Single-file program (.exe) with a modern dark mode on Python CustomTkinter'
      },
      {
        text: 'Electron desktop app that reuses web design graphics (HTML/CSS/JS)'
      },
      {
        text: 'High-performance Rust Tauri app: under 30MB memory, under 10MB executable'
      },
      {
        text: 'Professional PySide6 (Qt) app with complex multi-panel layouts and real-time graphs'
      }
    ]
  },
  q3_web_backend: {
    step: 'Step 3 / 5',
    title: 'Choose the web service back end and database',
    question: 'Which kind of database and back-end server do you prefer?',
    desc: 'Options range from Firebase, the easiest for beginners, to a full SQL database.',
    options: [
      {
        text: 'Firebase serverless (no server code, Google login, real-time Firestore DB)'
      },
      {
        text: 'Supabase (relational PostgreSQL DB + fine-grained access control)'
      },
      {
        text: 'Cloudflare Pages + D1 (fast responses from global edge + low-cost SQLite)'
      },
      {
        text: 'Interactive platform for real-time public or customer surveys with charts'
      }
    ]
  },
  q3_browser_macro: {
    step: 'Step 3 / 5',
    title: 'Choose a personal browser automation tool',
    question: 'How do you want to automate work in the browser?',
    desc: 'Options range from no-install bookmarklet macros to crawlers and AI agent extensions (MCP).',
    options: [
      {
        text: 'Automate ERP or web form entry with a bookmark click, no install (bookmarklet)'
      },
      {
        text: 'Playwright bot that gets past logins and blocks to capture pages and collect data'
      },
      {
        text: 'Automate legacy public or internal intranets with security software or ActiveX (Selenium)'
      },
      {
        text: 'Custom MCP server that gives AI coding tools (Claude/Antigravity) control of internal systems'
      }
    ]
  },
  q4_excel_deploy_mode: {
    step: 'Step 4 / 5',
    title: 'How to share with non-developer colleagues',
    question: 'When you share it, must it run by double-clicking an .exe without installing Python?',
    desc: 'Decide whether to build a single executable so non-developer teammates only need to drag and drop files.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - make it a single-window .exe program with drag and drop',
        subLabel: 'CustomTkinter UI + one-click PyInstaller packaging'
      },
      {
        badge: 'NO',
        label: 'No - a Python script that runs fast in my own terminal is enough',
        subLabel: 'In-memory Pandas processing and scheduled batch runs'
      }
    ]
  },
  q4_pdf_feature_mode: {
    step: 'Step 4 / 5',
    title: 'Extract PDF tables or not',
    question: 'Do you need to detect tables in the document body and export them to Excel (.xlsx)?',
    desc: 'Checks whether you need simple text search and page splitting, or accurate table conversion.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - detect tables in documents and convert them accurately to Excel (.xlsx)',
        subLabel: 'pdfplumber table detection + fast PyMuPDF parsing'
      },
      {
        badge: 'NO',
        label: 'No - the goal is splitting pages by keyword, merging documents and security',
        subLabel: 'Split and merge large PDFs with PyMuPDF'
      }
    ]
  },
  q4_gov_format_mode: {
    step: 'Step 4 / 5',
    title: 'Follow the public agency report format',
    question: 'Must it strictly follow the Korean government heading hierarchy (□/ㅇ/-/* and a 2x6 contact table)?',
    desc: 'Decide whether to edit the XML directly to produce the standard format used for audits and approval.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - it must follow the Korean government format (Human Myeongjo font, heading hierarchy)',
        subLabel: 'Direct editing of HWPX zipped XML + batch PDF conversion for approval'
      },
      {
        badge: 'NO',
        label: 'No - the main goal is a standard press release for reporters with an attached event table',
        subLabel: 'Standard press release with emblem, release-time box and 2x6 department table'
      }
    ]
  },
  q4_gov_audit_mode: {
    step: 'Step 4 / 5',
    title: 'Audit and mailing format for notices',
    question: 'Do you need to print Korea Post standard address labels (with barcodes) and reminder notices?',
    desc: 'Supports field lists for license plate seizure teams and PDF mailing labels.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - I need standard address label PDFs for mailing and printed reminder notices',
        subLabel: 'Matches Korea Post e-Green Mail format + plate seizure list of high-value delinquents'
      },
      {
        badge: 'NO',
        label: 'No - detecting duplicate welfare or subsidy payments comes first',
        subLabel: 'Household cross-matching + fraud risk scoring'
      }
    ]
  },
  q4_python_gui_feature: {
    step: 'Step 4 / 5',
    title: 'Progress display and background threads',
    question: 'Do you need a multi-threaded UI that does not freeze (\'Not responding\') during large jobs?',
    desc: 'Decide whether to combine a CustomTkinter progress bar with a background worker thread.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - a smooth progress bar with no freezing and dark mode are required',
        subLabel: 'Python threading + CustomTkinter modern theme'
      },
      {
        badge: 'NO',
        label: 'No - a simple single-window UI with buttons is enough',
        subLabel: 'The simplest, lightest standalone Python tool'
      }
    ]
  },
  q4_electron_feature: {
    step: 'Step 4 / 5',
    title: 'Use native operating system features',
    question: 'Do you need it to stay in the system tray (the icons next to the clock) and respond to global shortcuts?',
    desc: 'The app waits in the background and opens a popup window with one shortcut.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - keep a tray icon and open it instantly with a global shortcut',
        subLabel: 'Electron Tray and globalShortcut API'
      },
      {
        badge: 'NO',
        label: 'No - running as a normal desktop program window is fine',
        subLabel: 'Cross-platform packaging for Windows and Mac'
      }
    ]
  },
  q4_tauri_feature: {
    step: 'Step 4 / 5',
    title: 'Lightweight binary optimization',
    question: 'Is your goal minimal resource use: installer under 10MB and RAM under 30MB?',
    desc: 'Desktop build that combines Rust memory management with WebView2.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - I want an app under 10MB that runs well on low-spec PCs',
        subLabel: 'Rust Tauri + native performance'
      },
      {
        badge: 'NO',
        label: 'No - a native desktop build with normal performance is fine',
        subLabel: 'Stable Rust back end + HTML front end'
      }
    ]
  },
  q4_pyside_feature: {
    step: 'Step 4 / 5',
    title: 'Real-time charts',
    question: 'Do you need to plot tens of thousands of time-series points per second in real time without lag?',
    desc: 'Decide whether to combine the fast PyQtGraph rendering engine with dockable window panels.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - I need 60 FPS real-time visualization of large sensor or measurement data',
        subLabel: 'PySide6 + PyQtGraph GPU-accelerated rendering'
      },
      {
        badge: 'NO',
        label: 'No - static database management and multi-tab input screens are enough',
        subLabel: 'Standard Qt form layouts with SQLite'
      }
    ]
  },
  q4_firebase_frontend: {
    step: 'Step 4 / 5',
    title: 'Choose front-end complexity',
    question: 'Do you want to build the front end as a single index.html file, without an npm build?',
    desc: 'Vanilla JS lets you deploy right away with no learning curve; a modern framework makes maintenance easier.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - build it the easy way with vanilla HTML/CSS/JS and no build step (recommended)',
        subLabel: 'For beginners: opens directly in the browser and deploys to Firebase Hosting in seconds'
      },
      {
        badge: 'NO',
        label: 'No - use a component framework such as React or Vite',
        subLabel: 'Standard component architecture for modern web development'
      }
    ]
  },
  q4_supabase_stack: {
    step: 'Step 4 / 5',
    title: 'Choose a full-stack framework',
    question: 'Do you want to combine Next.js 15 server-side rendering (SSR) with Vercel deployment?',
    desc: 'Business web architecture that considers SEO and initial load speed.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - build it as a Next.js 15 + Supabase full stack',
        subLabel: 'Vercel deployment + SSR'
      },
      {
        badge: 'NO',
        label: 'No - use a lightweight Vite React SPA + Supabase',
        subLabel: 'Fast development and simple hosting'
      }
    ]
  },
  q4_cloudflare_stack: {
    step: 'Step 4 / 5',
    title: 'Extend with Cloudflare edge features',
    question: 'Do you want to add large file storage (R2) along with the serverless D1 database?',
    desc: 'Connects Cloudflare R2 storage, which has no egress fees, unlike AWS S3.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - set up the full package with D1 database + R2 storage',
        subLabel: 'Global edge full stack with no egress fees'
      },
      {
        badge: 'NO',
        label: 'No - start light with Pages + D1 SQLite DB only',
        subLabel: 'Serverless website that responds from the edge'
      }
    ]
  },
  q4_survey_stack: {
    step: 'Step 4 / 5',
    title: 'Public real-time charts and duplicate prevention',
    question: 'Should respondents see the real-time statistics chart right after they submit?',
    desc: 'Includes IP-based duplicate vote prevention and real-time animated donut and bar charts.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - show results as live animated charts right after each response',
        subLabel: 'Chart.js interactive charts + real-time totals'
      },
      {
        badge: 'NO',
        label: 'No - only admins see results and download them to Excel',
        subLabel: 'Private survey + admin-only dashboard'
      }
    ]
  },
  q4_macro_bookmarklet_type: {
    step: 'Step 4 / 5',
    title: 'How the bookmarklet macro works',
    question: 'Do you need to copy table data from a web page to the clipboard for Excel with one click?',
    desc: 'After copying, press Ctrl+V in Excel and the rows and columns are split by line breaks and tabs.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - I need one-click copy to the clipboard that pastes straight into Excel',
        subLabel: 'navigator.clipboard + a completion toast popup'
      },
      {
        badge: 'NO',
        label: 'No - the goal is filling repeated web forms and clicking automatically',
        subLabel: 'querySelector form fill and submit macro'
      }
    ]
  },
  q4_macro_crawler_type: {
    step: 'Step 4 / 5',
    title: 'Crawler sessions and login handling',
    question: 'Is it a complex site that needs two-factor login, CAPTCHA handling or a persistent session?',
    desc: 'A Playwright headless browser moves the mouse like a real person and saves cookies.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - saving the login session, capturing screens and getting past blocks are required',
        subLabel: 'Reuse saved auth state (StorageState) in Playwright'
      },
      {
        badge: 'NO',
        label: 'No - it is fast text scraping of large amounts of data from public pages',
        subLabel: 'Fast data collection with parallel requests'
      }
    ]
  },
  q4_macro_selenium_type: {
    step: 'Step 4 / 5',
    title: 'Keyboard and mouse control with security software',
    question: 'Does keyboard security software or ActiveX block typing in the browser?',
    desc: 'Decide whether to add hardware-level mouse and keyboard control with PyAutoGUI.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - add OS-level mouse and keyboard macros to work around keyboard security',
        subLabel: 'Selenium + PyAutoGUI screen automation'
      },
      {
        badge: 'NO',
        label: 'No - normal browser DOM clicks and form input are enough',
        subLabel: 'Reliable Selenium bot with explicit waits'
      }
    ]
  },
  q4_macro_mcp_type: {
    step: 'Step 4 / 5',
    title: 'Scope of MCP tool permissions',
    question: 'Will you let the AI agent edit local files on your PC and query the internal DB directly?',
    desc: 'With the Model Context Protocol, the AI works with real databases and files from plain language commands.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - grant local file CRUD and internal DB read and write access',
        subLabel: 'Full MCP tool set for Claude Code / Antigravity'
      },
      {
        badge: 'NO',
        label: 'No - limit it to read-only query tools',
        subLabel: 'Internal data analysis agent with tighter security'
      }
    ]
  },
  q5_excel_ai_need: {
    step: 'Step 5 / 5',
    title: 'Add AI analysis',
    question: 'Should AI detect outliers in the cleaned Excel data and write an analysis report?',
    desc: 'This is the last question (step 5). After you choose, you see four recommended project combinations.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - add AI outlier diagnosis and plain-language insight summaries (recommended)',
        subLabel: 'Goes beyond merging and also writes comments for management reports',
        comboDeckTitle: '[Step 5 done] Recommended set: bulk Excel merge and AI data analysis (4 picks)'
      },
      {
        badge: 'NO',
        label: 'No - a rule-based automation toolkit without AI',
        subLabel: 'Fast Pandas processing + one-click standalone .exe program',
        comboDeckTitle: '[Step 5 done] Recommended set: standalone Excel automation programs (4 picks)'
      }
    ]
  },
  q5_pdf_ai_need: {
    step: 'Step 5 / 5',
    title: 'Add AI OCR and multimodal analysis',
    question: 'Should AI (Gemini 2.0) read and summarize scanned unstructured PDFs or complex contracts?',
    desc: 'This is the last question (step 5). After you choose, you see four recommended project combinations.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - add analysis of 1,000-page documents with Gemini 2.0 multimodal AI',
        subLabel: 'Table extraction + AI screening of unfavorable contract clauses',
        comboDeckTitle: '[Step 5 done] Recommended set: AI document analysis and accurate PDF parsing (4 picks)'
      },
      {
        badge: 'NO',
        label: 'No - local offline document splitting and table extraction with PyMuPDF',
        subLabel: 'Fully isolated offline PDF toolkit; no data leaves the PC',
        comboDeckTitle: '[Step 5 done] Recommended set: offline PDF toolkit for air-gapped networks (4 picks)'
      }
    ]
  },
  q5_gov_ai_need: {
    step: 'Step 5 / 5',
    title: 'Add local AI for reviewing public regulations',
    question: 'Do you want to add a local AI (Ollama) that answers questions on laws and ordinances on an air-gapped PC with no internet?',
    desc: 'This is the last question (step 5). After you choose, you see four recommended project combinations.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - add on-device local AI for regulation review and automatic HWPX drafting',
        subLabel: 'High-security AI administration system that runs inside the PC without internet',
        comboDeckTitle: '[Step 5 done] Recommended set: air-gapped local AI and government report generation (4 picks)'
      },
      {
        badge: 'NO',
        label: 'No - accurate assembly of standard-format HWPX zipped XML and press releases',
        subLabel: 'Builder for the □/ㅇ/-/* heading hierarchy and the 2x6 department table',
        comboDeckTitle: '[Step 5 done] Recommended set: automatic assembly of standard government Hangul (HWPX) documents (4 picks)'
      }
    ]
  },
  q5_gov_audit_final: {
    step: 'Step 5 / 5',
    title: 'AI reports on audit results',
    question: 'Should AI turn anomaly detection and arrears statistics into explanation reports for the Board of Audit and Inspection or the council?',
    desc: 'This is the last question (step 5). After you choose, you see four recommended project combinations.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - AI analyzes fraud types and drafts an action plan report',
        subLabel: 'Anomaly detection algorithm + local or cloud AI for administrative reports',
        comboDeckTitle: '[Step 5 done] Recommended set: subsidy and arrears anomaly detection with AI reports (4 picks)'
      },
      {
        badge: 'NO',
        label: 'No - practical tools focused on Excel and standard label PDF output',
        subLabel: 'Exact mathematical cross-matching + Korea Post format labels',
        comboDeckTitle: '[Step 5 done] Recommended set: public tax and audit work automation (4 picks)'
      }
    ]
  },
  q5_desktop_ai_need: {
    step: 'Step 5 / 5',
    title: 'AI voice, vision and text features in the desktop app',
    question: 'Do you want to add a generative AI copilot inside the PC program you build?',
    desc: 'This is the last question (step 5). After you choose, you see four recommended project combinations.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - add a chat AI and an automatic document summary copilot',
        subLabel: 'CustomTkinter/Electron UI + Gemini 2.0 real-time streaming API',
        comboDeckTitle: '[Step 5 done] Recommended set: modern desktop programs with an AI copilot (4 picks)'
      },
      {
        badge: 'NO',
        label: 'No - a light, fast standalone utility program (.exe)',
        subLabel: 'Modern dark-mode app that runs by double-click even on PCs without Python',
        comboDeckTitle: '[Step 5 done] Recommended set: lightweight standalone programs (4 picks)'
      }
    ]
  },
  q5_web_ai_need: {
    step: 'Step 5 / 5',
    title: 'Real-time multimodal AI on the website',
    question: 'Do you want to add a Gemini AI where visitors upload files (PDF/images) and chat about them?',
    desc: 'This is the last question (step 5). After you choose, you see four recommended project combinations.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - add a Gemini 2.0 real-time streaming chatbot and multimodal analysis',
        subLabel: 'Firebase Hosting + Firestore real-time DB + Gemini chat AI',
        comboDeckTitle: '[Step 5 done] Firebase cloud + Gemini multimodal AI full stack (4 picks)'
      },
      {
        badge: 'NO',
        label: 'No - focus on Google login and a real-time shared data board',
        subLabel: 'Serverless cloud web app that beginners can deploy in minutes',
        comboDeckTitle: '[Step 5 done] Recommended set: serverless real-time cloud web services (4 picks)'
      }
    ]
  },
  q5_macro_ai_need: {
    step: 'Step 5 / 5',
    title: 'AI cleaning and reports for collected data',
    question: 'Should AI summarize large amounts of collected web data or task results into reports?',
    desc: 'This is the last question (step 5). After you choose, you see four recommended project combinations.',
    options: [
      {
        badge: 'YES',
        label: 'Yes - an AI agent (MCP/Gemini) also generates the data analysis report',
        subLabel: 'Pipeline of browser automation + LLM summaries + messenger alerts',
        comboDeckTitle: '[Step 5 done] Recommended set: work automation with AI agents (4 picks)'
      },
      {
        badge: 'NO',
        label: 'No - a fast macro that runs with one bookmark click, no install',
        subLabel: 'No-install automation that copies web page data to the clipboard for Excel',
        comboDeckTitle: '[Step 5 done] Recommended set: one-click no-install browser macros (4 picks)'
      }
    ]
  }
};
