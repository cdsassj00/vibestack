// ==========================================================================
// VibeStack 실무 바이브코딩 시나리오 & 5단계 의사결정 트리 (자동 생성 정본)
// 총 29대 핵심 실무 기술조합 카드 (공공/민간 아이디어 탑재)
// ==========================================================================

export const VIBE_SCENARIOS = [
  {
    "id": "gov-hwpx-automation",
    "track": "gov",
    "trackName": "공공·행정 문서",
    "badge": "🏛️ 공공 표준 서식",
    "title": "🏛️ 공공기관 HWPX 표준 기안문·보고서 자동 조립기",
    "summary": "정부·공공 표준 계층(□/ㅇ/-/*)과 2x6 정보표를 100% 준수하는 보고서를 파이썬으로 자동 생성",
    "publicIdeas": [
      "온나라 전자결재 공문서 계층체계(□/ㅇ/-/*) 규격 100% 일치 자동 기안문 생성기",
      "지자체 보조금 정산 검사 결과 보고서 및 증빙 표 일괄 자동 조립",
      "국정감사·시의회 요구자료 20개 부서 데이터 취합 후 단일 HWPX 보고서로 병합",
      "공공기관 연간 경영평가 보고서 증빙서류 일련번호 자동 인덱싱"
    ],
    "privateIdeas": [
      "방위산업체·공공 조달 납품업체의 정부 규격 완료보고서 자동 생성 솔루션",
      "관공서 연구용역 과업 착수·중간·최종 보고서 한글(HWPX) 표준 템플릿 일괄 채우기",
      "공공기관 입찰 제안요청서(RFP) 요구조건 대비 제안서 목차 자동 정합기"
    ],
    "techStack": [
      "Python",
      "zipfile/xml.etree",
      "HWPX Open Format",
      "CustomTkinter"
    ],
    "pros": [
      "한글 프로그램(HWP) 라이선스가 없는 PC나 리눅스 서버에서도 순수 파이썬 XML 직조작으로 생성",
      "공공기관 표준 폰트(휴먼명조, 휴먼고딕) 및 행간, 글자크기 오차 0mm 보장",
      "수백 명의 대상자별 개별 공문서 및 통지서를 10초 만에 일괄 대량 발급"
    ],
    "combos": [
      "gov-press-release-hwpx",
      "gov-local-llm-rag",
      "office-pdf-toolkit",
      "desktop-customtkinter-exe"
    ],
    "comboGuide": "보고서 본문 자동 생성 후, 결재권자 보고용 보도자료 요약본과 PDF 일괄 변환 파이프라인으로 연결하세요.",
    "cliCommand": "pip install lxml pyyaml\npython generate_hwpx.py --template=report",
    "promptTemplate": "당신은 대한민국 공공기관 표준 공문서 및 HWPX 전문 개발자입니다.\n[목표]: {PROJECT_NAME}을(를) 위한 공공 표준 보고서 자동 생성 스크립트를 작성합니다.\n[요구 규격]:\n1. HWPX(한글 오픈 오피스 XML) 컨테이너의 zip 압축 구조(Contents/section0.xml)를 직접 조작.\n2. 기후에너지환경부/행정안전부 공문서 규격인 □(대제목, 휴먼고딕 16pt, 볼드) -> ㅇ(중제목, 15pt) -> -(소제목, 14pt) -> *(세부내용, 13pt) 계층 체계 엄격 준수.\n3. 문서 말미에 담당부서, 직급, 성명, 연락처가 포함된 2x6 표준 표 자동 렌더링.\n4. XML 특수문자(&, <, >, \", ') 이스케이프 완벽 처리."
  },
  {
    "id": "gov-press-release-hwpx",
    "track": "gov",
    "trackName": "공공·행정 문서",
    "badge": "📰 부처 보도자료",
    "title": "📰 중앙부처·지자체 표준 보도자료 HWPX 자동 조립기",
    "summary": "상단 엠블럼, 보도시점 박스, 메인 헤드라인 박스, 휴먼명조 본문, 인용구, 2x6 부서표 완벽 구현",
    "publicIdeas": [
      "정책 발표·신규 사업 런칭 시 기자단 배포용 표준 보도자료 30초 완성기",
      "지자체 축제·문화행사 개최 홍보 보도자료 및 붙임 행사 일정표 자동 조립",
      "재난·기후 위기 긴급 대피요령 및 지원 대책 긴급 브리핑 배포문 자동 작성"
    ],
    "privateIdeas": [
      "관공서 전담 홍보대행사의 부처 출입기자단 타깃 맞춤 보도자료 작성 툴",
      "ESG 공공 협약 체결 기업의 공공기관 공동 보도자료 양식 100% 준수 솔루션",
      "스타트업 정부지원사업 선정 및 연구성과 발표용 공식 보도문 생성기"
    ],
    "techStack": [
      "Python",
      "XML DOM",
      "HWPX Template",
      "PyInstaller"
    ],
    "pros": [
      "정부부처 출입기자단이 가장 선호하는 정통 정부 엠블럼 & 보도시점 박스 탑재",
      "기관장/장관 인용구(따옴표 강조 박스) 및 붙임 자료 목록 자동 정렬",
      "보도자료 생성 즉시 사내 홍보게시판 및 출입기자단 메일 발송 연동 가능"
    ],
    "combos": [
      "gov-hwpx-automation",
      "office-email-alert",
      "agent-whisper-meeting",
      "office-pdf-toolkit"
    ],
    "comboGuide": "회의록 음성 전사(Whisper)에서 도출된 핵심 정책 포인트를 보도자료 템플릿에 자동 주입하세요.",
    "cliCommand": "python press_release_builder.py --title=\"신규 정책 발표\"",
    "promptTemplate": "당신은 정부부처 대변인실 및 홍보담당관실 전문 보도자료 엔지니어입니다.\n[목표]: {PROJECT_NAME} 표준 정부 보도자료 HWPX 문서를 자동 빌드합니다.\n[필수 서식]:\n1. 최상단: 배포일시, 보도시점(예: \"조간부터 보도하여 주시기 바랍니다\"), 담당부서(과장/사무관 연락처).\n2. 제목부: 음영 박스 내 볼드 고딕 제목 + 핵심 서브타이틀 2~3줄.\n3. 본문: \"□ 추진 배경\" -> \"□ 주요 핵심 성과\" -> \"□ 향후 계획\" 체계.\n4. 기관장 따옴표 공식 인용문 박스 및 [붙임] 참고자료 목록 배치."
  },
  {
    "id": "gov-local-llm-rag",
    "track": "gov",
    "trackName": "공공·행정 문서",
    "badge": "🔒 100% 폐쇄망 AI",
    "title": "🔒 폐쇄망 온디바이스 로컬 AI (Ollama + 공공 규정 RAG)",
    "summary": "인터넷 연결이 차단된 행정망 PC에서 국가기밀·개인정보 유출 없이 지방조례 및 행정지침을 질의응답",
    "publicIdeas": [
      "사내 폐쇄망 PC에서 지자체 조례·규칙 위반 여부 자동 스크리닝 Q&A",
      "복지 보조금 지급 기준 매뉴얼 기반 신임 주무관 실시간 업무 편람 도우미",
      "공문서 내 주민등록번호, 계좌번호 등 개인정보 외부 유출 방지 로컬 마스킹",
      "국가기밀 및 국방 연구보고서 내부 지식 아카이브 폐쇄망 검색 챗봇"
    ],
    "privateIdeas": [
      "방위산업체·원전·항공 등 국가보안시설 내부 설계도면 보안 규격 검색",
      "금융사 내부 회계 규정 및 감사 컴플라이언스 오프라인 질의응답 봇",
      "대형 병원 환자 EMR 진료기록 외부 통신 차단 온프레미스 AI 분석"
    ],
    "techStack": [
      "Python",
      "Ollama (EEVE-Korean / Llama3)",
      "ChromaDB",
      "LangChain"
    ],
    "pros": [
      "외부 인터넷 선을 완전히 뽑은 격리 PC에서도 초당 30토큰 고속 추론",
      "사내 규정집(PDF/HWPX/DOCX)을 로컬 벡터 DB에 저장하여 거짓말(할루시네이션) 0%",
      "정부 클라우드 보안인증(CSAP) 심사 없이 현장 PC에 즉시 설치 운용 가능"
    ],
    "combos": [
      "gov-hwpx-automation",
      "desktop-customtkinter-exe",
      "office-pdf-toolkit",
      "gov-press-release-hwpx"
    ],
    "comboGuide": "로컬 RAG 검색 결과를 공공 표준 HWPX 서식 생성기로 전달하여 결재용 보고서를 1초 만에 완성하세요.",
    "cliCommand": "ollama run eeve-korean:10.8b\npython local_rag.py --docs=\"./laws\"",
    "promptTemplate": "당신은 폐쇄망 보안 환경 전용 온디바이스 로컬 AI 아키텍트입니다.\n[목표]: {PROJECT_NAME} 환경에서 동작하는 오프라인 규정 검색 및 답변 시스템을 구축합니다.\n[구현 지침]:\n1. 외부 인터넷 통신(HTTP API)을 완전히 배제하고 localhost Ollama 서버와 통신.\n2. 행정규칙/지방조례 텍스트를 문맥(Chunk) 단위로 분할하여 로컬 ChromaDB에 임베딩 저장.\n3. 질문 인입 시 유사 조항 상위 3개를 추출하고, 해당 조항의 조·항·호 출처를 정확히 명시하여 답변.\n4. 규정에 없는 내용은 \"관련 규정에 명시되어 있지 않습니다\"라고 답변하도록 프롬프트 제어."
  },
  {
    "id": "gov-procurement-monitor",
    "track": "gov",
    "trackName": "공공·행정 문서",
    "badge": "💼 조달·입찰 자동화",
    "title": "💼 조달청 나라장터(G2B) 입찰공고 실시간 감시 & 적격성 판정기",
    "summary": "조달청 나라장터 신규 공고를 10분마다 모니터링하여 참가 자격 조건 충족 여부를 자동 판정하고 알림",
    "publicIdeas": [
      "타 기관 유사 용역 사업 발주 현황 모니터링 및 예정가격 추이 분석",
      "산하기관 중복 발주 사전 점검 및 공공 소프트웨어 분리발주 대상 필터링",
      "지자체 관내 중소기업 제한 경쟁 입찰공고 실시간 통계 대시보드"
    ],
    "privateIdeas": [
      "SI/건설/제조 기업의 타깃 키워드 신규 입찰공고 실시간 카카오톡 알림",
      "경쟁사 투찰 이력 및 낙찰 하한가 투찰율 역대 통계 기반 투찰가 시뮬레이션",
      "제안서 제출 마감일 D-Day 관리 및 필수 제출 증빙서류 누락 자동 체크"
    ],
    "techStack": [
      "Python",
      "공공데이터포털 API",
      "Playwright",
      "SQLite",
      "Telegram Bot"
    ],
    "pros": [
      "수작업으로 하루 3번씩 나라장터를 검색할 필요 없이 키워드 매칭 즉시 스마트폰 알림",
      "실적 제한, 지역 제한(서울/경기 등), 신용평가등급 등 필수 참가 자격 사전 필터링",
      "낙찰 결과 공고 시 투찰 1순위 업체 및 낙찰금액 통계 자동 엑셀 저장"
    ],
    "combos": [
      "office-email-alert",
      "office-excel-merge",
      "agent-gemini-multimodal",
      "gov-hwpx-automation"
    ],
    "comboGuide": "공고문 PDF를 Gemini 멀티모달 AI로 분석하여 제안요청서 핵심 과업 범위를 3줄 요약하세요.",
    "cliCommand": "python g2b_crawler.py --keywords=\"인공지능,데이터,클라우드\"",
    "promptTemplate": "당신은 공공조달(G2B 나라장터) 데이터 수집 및 자동 입찰 분석 전문가입니다.\n[목표]: {PROJECT_NAME} 맞춤형 나라장터 신규 입찰공고 모니터링 및 자격 스크리닝 시스템을 구축합니다.\n[핵심 기능]:\n1. 조달청 공공데이터 Open API 또는 나라장터 웹 수집으로 10분 단위 신규 공고 조회.\n2. 사전에 정의된 관심 키워드(품명, 과업명) 및 사업금액 범위(예: 5천만~5억원) 필터링.\n3. 입찰 참가 자격(소프트웨어사업자, 중소기업확인서, 지역제한) 부합 여부 1차 자동 판정.\n4. 신규 적합 공고 발견 시 텔레그램 봇 또는 이메일로 공고명, 금액, 마감일시, 직링크 전송."
  },
  {
    "id": "gov-duty-scheduler",
    "track": "gov",
    "trackName": "공공·행정 문서",
    "badge": "📅 당직 명령 최적화",
    "title": "📅 공공기관 당직명령부 & 휴일 근무 자동 편성기",
    "summary": "공무원/공무직 당직 근무, 휴일/평일 배분, 연차·출장·육아 제외 조건을 반영한 최적 스케줄링",
    "publicIdeas": [
      "구청/시청 본청 및 동주민센터 일직·숙직 근무자 자동 공평 배분",
      "임산부, 영유아 양육자, 장기 출장자 당직 자동 제외 및 대직자 1초 교체",
      "당직명령 공문서(HWPX) 자동 결재 기안 및 당직 전날 모바일 안내 문자 발송"
    ],
    "privateIdeas": [
      "24시간 전산 관제센터 엔지니어 야간 교대 스케줄표 자동 편성",
      "종합병원 간호사 3교대(데이/이브닝/나이트) 듀티표 AI 최적화",
      "대형 빌딩 시설관리 기전실 주간/당직/비번/휴무 순환표 생성"
    ],
    "techStack": [
      "Python",
      "Pandas",
      "Google OR-Tools (선형계획법)",
      "CustomTkinter"
    ],
    "pros": [
      "사람이 며칠 밤새 고민하던 복잡한 당직표를 수학적 최적화 알고리즘으로 1초 만에 공평 편성",
      "주말/공휴일 근무 횟수가 특정인에게 편중되지 않도록 연간 누적 점수 반영",
      "버튼 클릭 한 번으로 공공 표준 당직명령부 서식(HWPX/Excel)으로 출력"
    ],
    "combos": [
      "gov-hwpx-automation",
      "office-excel-merge",
      "desktop-customtkinter-exe",
      "office-email-alert"
    ],
    "comboGuide": "편성된 당직표를 HWPX 표준 공문서로 렌더링하여 온나라 전자결재에 바로 첨부하세요.",
    "cliCommand": "python scheduler.py --month=2026-10 --staff=members.csv",
    "promptTemplate": "당신은 제약 조건 최적화 및 공공 근무 스케줄링 엔지니어입니다.\n[목표]: {PROJECT_NAME}을(를) 위한 당직 및 교대근무 자동 편성 시스템을 구축합니다.\n[제약 조건]:\n1. 필수 제약: 숙직 후 다음 날 비번 보장, 동일 인원 연속 당직 금지, 제외 신청자(휴가/출장) 배제.\n2. 최적화 목표: 공휴일/주말 당직 횟수 직원 간 편차 최소화, 성별/직급별 당직 조 편성 기준 준수.\n3. 결과물: 월간 당직 캘린더, 직원별 당직 횟수 통계표, 공공 표준 HWPX 당직명령부 출력."
  },
  {
    "id": "gov-subsidy-checker",
    "track": "gov",
    "trackName": "공공·행정 문서",
    "badge": "🔍 보조금 이상 탐지",
    "title": "🔍 공공 복지급여·보조금 중복 수급 및 부정수급 탐지 엔진",
    "summary": "주민등록 세대원 대사, 타 지원사업 수혜 이력 교차 검증을 통해 부정수급 후보군을 자동 색출",
    "publicIdeas": [
      "지자체 청년수당, 구직지원금 타 부처 사업과 중복 수혜 여부 엑셀 대사",
      "농업직불금 수령자와 토지대장 실제 경작자 불일치 의심 데이터 필터링",
      "바우처 카드 결제 내역 중 심야 시간대 또는 비인가 업종 이상 결제 탐지"
    ],
    "privateIdeas": [
      "사내 복지포인트 및 체력단련비 영수증 타 직원과 중복 청구 검증",
      "보험사 실손보험 청구서 중 동일 진료일자 타 보험사 중복 청구 자동 색출",
      "학술 연구과제 참여 연구원 인건비 참여율(100% 초과) 합산 검증"
    ],
    "techStack": [
      "Python",
      "Pandas",
      "NetworkX (관계망 분석)",
      "OpenPyXL"
    ],
    "pros": [
      "수십만 건의 수혜자 데이터를 수초 만에 주민번호/가구원 단위로 교차 검증",
      "의심 지수(Risk Score)를 자동 산출하여 감사 대상 우선순위 리스트 제공",
      "부정수급 환수 통지서 및 소명 요청서 양식 일괄 자동 생성"
    ],
    "combos": [
      "gov-hwpx-automation",
      "office-excel-merge",
      "desktop-customtkinter-exe",
      "office-pdf-toolkit"
    ],
    "comboGuide": "탐지된 부정수급 의심자 명단을 HWPX 소명요청서 발송 엔진과 파이프라인으로 연결하세요.",
    "cliCommand": "python audit_check.py --master=subsidies.xlsx --target=applicants.xlsx",
    "promptTemplate": "당신은 공공 보조금 감사 및 이상 거래 탐지(Fraud Detection) 분석가입니다.\n[목표]: {PROJECT_NAME} 보조금 중복 수급 및 부정 의심 건을 자동 검출하는 스크립트를 작성합니다.\n[검증 로직]:\n1. 수혜자 고유 식별값(주민번호 해시 등) 기준으로 타 사업 수혜 이력과의 교집합(Inner Join) 탐색.\n2. 동일 주소지 세대원 합산 소득 기준 초과 여부 및 지원금 한도 초과 검산.\n3. 의심 유형별(중복수혜, 자격상실후수령, 한도초과) 플래그를 생성하고 환수 예정액 계산.\n4. 감사관 전용 요약 리포트 시트 및 현장 실사 대상자 목록을 엑셀로 내보내기."
  },
  {
    "id": "gov-tax-delinquency",
    "track": "gov",
    "trackName": "공공·행정 문서",
    "badge": "🧾 체납 관리 자동화",
    "title": "🧾 지방세·과태료 체납 관리 & 독촉 고지서 자동 생성기",
    "summary": "체납액 구간별 통계, 번호판 영치 대상 차량 자동 추출, 우편 발송용 라벨 스티커 엑셀 일괄 생성",
    "publicIdeas": [
      "주정차 위반 과태료 장기 체납자 재산 압류 예고 통지서 일괄 출력",
      "자동차세 3회 이상 체납 차량 번호판 영치 단속반 현장용 엑셀 명단 추출",
      "우체국 e-그린우편 규격에 맞춘 수신자 주소 라벨 및 바코드 자동 정렬"
    ],
    "privateIdeas": [
      "아파트 단지 관리비 3개월 이상 장기 연체 세대 독촉 내용증명 자동 작성",
      "사설 유료주차장 미납 차량 차적 조회 및 주차요금 정산 안내문 자동 발송",
      "B2B 미수금 거래처 만기일 도래 알림 및 입금 독촉 공문 자동 생성"
    ],
    "techStack": [
      "Python",
      "Pandas",
      "OpenPyXL",
      "ReportLab (PDF 라벨)"
    ],
    "pros": [
      "세무과 주무관이 수작업으로 며칠씩 걸리던 체납자 분류 및 고지서 인쇄를 단 1분 만에 완료",
      "우체국 우편 규격(우편번호 5자리, 바코드)에 100% 맞는 출력물 PDF 자동 렌더링",
      "체납액 납부 시 실시간 수납 데이터와 대사하여 독촉 중단 처리"
    ],
    "combos": [
      "gov-hwpx-automation",
      "office-excel-merge",
      "office-email-alert",
      "desktop-customtkinter-exe"
    ],
    "comboGuide": "체납 명단 추출 후 우편 발송 라벨과 문자 안내 메시지를 원클릭으로 동시 생성하세요.",
    "cliCommand": "python tax_delinquent.py --min-amount=300000 --output=labels.pdf",
    "promptTemplate": "당신은 지방세 및 행정 과태료 수납 관리 자동화 엔지니어입니다.\n[목표]: {PROJECT_NAME} 체납자 관리 및 우편 독촉 고지서 발송 시스템을 구축합니다.\n[요구사항]:\n1. 체납 데이터셋에서 체납 기간(일수), 누적 체납액, 체납 건수를 기준으로 대상자 필터링.\n2. 우체국 표준 규격(A4 14칸 라벨지)에 맞추어 수신자 성명, 주소, 우편번호를 배치하는 PDF 생성.\n3. 고액·상습 체납자(1,000만원 이상)는 번호판 영치 및 재산 압류 명단으로 별도 분리.\n4. 체납액 납부 가상계좌 번호가 올바르게 매칭되었는지 유효성 검증."
  },
  {
    "id": "office-excel-merge",
    "track": "office",
    "trackName": "직장인 실무·오피스",
    "badge": "📊 엑셀 대량 병합",
    "title": "📊 수십 개 지점 엑셀 파일 초고속 병합 & 이상치 검증 툴",
    "summary": "서식이 조금씩 다른 수십 개 엑셀 파일을 수초 만에 표준 양식으로 통합하고 오류 데이터를 자동 검출",
    "publicIdeas": [
      "관내 25개 동주민센터 복지 지원금 신청 명단 엑셀 자동 통합 및 주민번호 검증",
      "시군구 산하 공공기관 예산 집행 지출 결의서 대사 및 비목별 합산",
      "전국 초중고등학교 시설물 정기점검 체크리스트 수천 개 파일 일괄 취합"
    ],
    "privateIdeas": [
      "전국 100개 프랜차이즈 가맹점 일일 매출 엑셀 통합 및 누락 지점 자동 알림",
      "네이버/쿠팡/11번가 주문 내역 엑셀 양식 단일 통합 송장 파일로 변환",
      "인사팀 월말 전 사원 근태/초과근무 시간 합산 및 급여 테이블 매칭"
    ],
    "techStack": [
      "Python",
      "Pandas",
      "OpenPyXL",
      "CustomTkinter"
    ],
    "pros": [
      "100개 엑셀 파일 수작업 복사-붙여넣기(4시간)를 단 5초 만에 완전 자동화",
      "칼럼 순서가 뒤바뀌어 있거나 빈 행이 있어도 헤더 이름을 똑똑하게 인식하여 정렬",
      "음수 금액, 중복 데이터, 비정상 전화번호 등 오류 행을 노란색 음영으로 자동 표시"
    ],
    "combos": [
      "desktop-customtkinter-exe",
      "office-pdf-toolkit",
      "office-email-alert",
      "gov-hwpx-automation"
    ],
    "comboGuide": "엑셀 병합 결과를 CustomTkinter GUI로 감싸 .exe 파일로 만들면 비개발자 팀원도 즉시 사용합니다.",
    "cliCommand": "pip install pandas openpyxl\npython merge_excel.py --input=\"./data\" --output=\"merged.xlsx\"",
    "promptTemplate": "당신은 파이썬 판다스(Pandas) 기반 대용량 데이터 전처리 및 업무 자동화 전문가입니다.\n[목표]: {PROJECT_NAME}을(를) 위한 엑셀 파일 일괄 병합 및 이상치 정제 스크립트를 작성합니다.\n[요구사항]:\n1. 지정된 폴더 내 모든 .xlsx, .xls 파일을 고속 로드(openpyxl/calamine 엔진).\n2. 지점별로 컬럼 순서가 다르거나 일부 컬럼이 누락된 경우 헤더 명칭 기준으로 유연하게 매핑.\n3. 결측치, 음수 값, 정규식에 어긋나는 전화번호/사업자번호를 검출하여 별도 '오류검증' 시트에 하이라이트.\n4. 최종 결과물을 '취합완료_날짜.xlsx'로 저장하고 처리 요약 통계를 콘솔에 출력."
  },
  {
    "id": "office-pdf-toolkit",
    "track": "office",
    "trackName": "직장인 실무·오피스",
    "badge": "📑 PDF 표 데이터 추출",
    "title": "📑 대용량 PDF 문서 표(Table) 데이터 인식 & 엑셀 변환 툴",
    "summary": "스캔된 종이 문서나 수백 페이지 전자문서에서 표 데이터를 감지하여 엑셀 시트로 완벽 추출",
    "publicIdeas": [
      "공문서 첨부 영수증/정산서 스캔 PDF에서 지출 금액 표 자동 추출",
      "조달청 물품 구매 규격서 내 부품 품목 및 수량 표 엑셀 변환",
      "지자체 관보 공고문 내 토지 수용 보상 내역 표 데이터화"
    ],
    "privateIdeas": [
      "매월 수백 건의 세금계산서/인보이스 PDF 대량 파싱 및 회계 ERP 자동 업로드",
      "은행 금융거래 확인서 및 통장 거래내역 PDF를 엑셀 데이터로 즉시 복원",
      "부동산 등기부등본 표제부/갑구/을구 소유권 및 근저당 표 추출"
    ],
    "techStack": [
      "Python",
      "PyMuPDF (fitz)",
      "pdfplumber",
      "OpenPyXL"
    ],
    "pros": [
      "복사 붙여넣기가 안 되는 깨진 PDF에서도 정밀한 좌표 기반 표 구조 복원",
      "수천 페이지 대용량 문서도 메모리 누수 없이 페이지별 초고속 분할 및 병합",
      "외부 유출 없이 100% 로컬 PC에서 동작하여 기밀 계약서 처리 안심 보장"
    ],
    "combos": [
      "office-excel-merge",
      "desktop-customtkinter-exe",
      "agent-gemini-multimodal",
      "gov-hwpx-automation"
    ],
    "comboGuide": "정형 표는 pdfplumber로 추출하고, 복잡한 비정형 계약서는 Gemini 멀티모달 AI로 분석하세요.",
    "cliCommand": "pip install pymupdf pdfplumber openpyxl\npython pdf_table_extractor.py",
    "promptTemplate": "당신은 PDF 문서 구조 파싱 및 OCR 데이터 추출 엔지니어입니다.\n[목표]: {PROJECT_NAME} 문서 내 표 데이터를 정확히 감지하여 엑셀 파일로 변환합니다.\n[구현 내용]:\n1. pdfplumber를 사용하여 문서 내 테이블 테두리 선(Line) 및 셀 텍스트를 감지.\n2. 줄바꿈이 포함된 다중 행 셀 데이터를 깔끔하게 공백 하나로 정제.\n3. 추출된 데이터를 Pandas DataFrame으로 변환 후 '추출결과.xlsx'로 내보내기.\n4. 표가 없는 일반 텍스트 문서는 PyMuPDF(fitz)로 텍스트만 초고속 추출."
  },
  {
    "id": "office-bookmarklet-f12",
    "track": "office",
    "trackName": "직장인 실무·오피스",
    "badge": "🚀 완전 무설치 매크로",
    "title": "⚡ F12 콘솔 & 북마클릿(Bookmarklet) 원클릭 브라우저 매크로",
    "summary": "프로그램 설치 권한이 없는 PC에서도 즐겨찾기 클릭 한 번으로 웹 화면 입력/복사 자동화",
    "publicIdeas": [
      "설치 차단된 사내망/인트라넷(새올/온나라)에서 반복 입력 폼 원클릭 채우기",
      "웹 화면에 띄워진 수백 건의 민원 목록 표를 엑셀 클립보드로 즉시 복사",
      "매일 반복되는 출퇴근 등록 버튼 자동 클릭 및 잔여 연차 시간 팝업 표시"
    ],
    "privateIdeas": [
      "사내 ERP 결재 화면에서 자주 쓰는 결재선 원클릭 자동 지정",
      "쇼핑몰 파트너 센터에서 고객 배송지 주소를 원클릭으로 엑셀 양식 복사",
      "채용 포털 이력서 열람 화면에서 지원자 주요 학력/경력만 추출해 클립보드 복사"
    ],
    "techStack": [
      "Vanilla JavaScript",
      "DOM Manipulation",
      "Bookmarklet URI",
      "Clipboard API"
    ],
    "pros": [
      "보안 프로그램으로 .exe 실행이나 파이썬 설치가 막힌 PC에서도 100% 실행 가능",
      "브라우저 상단 북마크바에 마우스로 끌어다 놓기만 하면 설치 끝",
      "웹 테이블 데이터를 탭(\\t)과 엔터(\\n)로 포맷팅하여 엑셀에 Ctrl+V 즉시 가능"
    ],
    "combos": [
      "office-excel-merge",
      "agent-browser-playwright",
      "office-email-alert"
    ],
    "comboGuide": "단순 반복 업무는 북마클릿으로 즉시 처리하고, 대량 정기 수집은 Playwright 크롤러로 이원화하세요.",
    "cliCommand": "# 설치 불필요: 브라우저 북마크 URL 란에 javascript:(코드) 등록",
    "promptTemplate": "당신은 브라우저 DOM 자동화 및 북마클릿(Bookmarklet) 개발 전문가입니다.\n[목표]: {PROJECT_NAME}을(를) 위한 단일 즉시실행함수(IIFE) 북마클릿을 작성합니다.\n[요구사항]:\n1. javascript:(function(){ ... })(); 구조의 한 줄 압축 스크립트 작성.\n2. 대상 웹페이지의 특정 테이블(table, tr, td)을 탐색하여 텍스트를 탭과 줄바꿈으로 파싱.\n3. navigator.clipboard.writeText를 호출하여 사용자의 클립보드에 복사.\n4. 완료 시 화면 우측 상단에 세련된 다크모드 플로팅 토스트(Toast) 팝업을 3초간 띄우기."
  },
  {
    "id": "office-email-alert",
    "track": "office",
    "trackName": "직장인 실무·오피스",
    "badge": "📬 스마트 알림 발송",
    "title": "📬 조건부 자동 이메일 발송 & 메신저(슬랙/잔디/카톡) 웹훅 알림",
    "summary": "특정 기한 도래, 재고 부족, 이상치 발생 시 개인화된 안내 메일 및 사내 메신저 알림 일괄 발송",
    "publicIdeas": [
      "민원 처리 마감 기한 D-3 도래 시 담당 주무관에게 카카오 알림톡/메일 자동 발송",
      "공공 임대주택 임대료 납부 기한 및 재계약 안내문 수혜자별 개인화 메일 발송",
      "당직 근무자에게 당직 전날 모바일 알림톡 및 인수인계 체크리스트 전송"
    ],
    "privateIdeas": [
      "정기 구독 고객 결제 만료 7일 전 개인화 할인 쿠폰 메일 자동 발송",
      "서버 장애 또는 재고 품절 발생 시 사내 슬랙(Slack)/잔디 긴급 웹훅 호출",
      "학원생 출결 및 모의고사 성적표 학부모 맞춤 PDF 첨부 메일 일괄 발송"
    ],
    "techStack": [
      "Python",
      "smtplib / email",
      "Requests (Webhook)",
      "Jinja2 Template"
    ],
    "pros": [
      "사내 Exchange/Outlook 또는 사내 SMTP 서버와 완벽 연동",
      "수신자 1,000명에게 각자 이름과 첨부파일(PDF)이 매칭된 맞춤 메일 1분 컷 발송",
      "스팸 분류 방지를 위한 발송 지연 시간(Rate Limit) 및 성공/실패 로그 기록"
    ],
    "combos": [
      "office-excel-merge",
      "gov-press-release-hwpx",
      "agent-mcp-server",
      "desktop-customtkinter-exe"
    ],
    "comboGuide": "엑셀 명단 검증 후 유효한 수신자에게만 개인화 PDF를 첨부하여 자동 발송하는 파이프라인을 만드세요.",
    "cliCommand": "python send_alerts.py --config=smtp.json --list=recipients.xlsx",
    "promptTemplate": "당신은 업무 커뮤니케이션 자동화 및 웹훅 알림 시스템 엔지니어입니다.\n[목표]: {PROJECT_NAME} 맞춤형 조건부 이메일 및 메신저 알림 발송기를 작성합니다.\n[요구사항]:\n1. 엑셀 수신자 명단(이름, 이메일, 마감일, 금액 등)을 읽어 Jinja2 기반 세련된 HTML 메일 렌더링.\n2. smtplib.SMTP_SSL 보안 연결을 통해 발송하고 수신자별 개별 첨부파일 자동 링크.\n3. 중요 긴급 알림은 슬랙/잔디 Webhook URL로 JSON 메시지 실시간 전송.\n4. 발송 결과를 timestamp, 성공여부, 에러메시지와 함께 history.csv에 기록."
  },
  {
    "id": "office-csv-cleaner",
    "track": "office",
    "trackName": "직장인 실무·오피스",
    "badge": "🔤 한글 인코딩 복구",
    "title": "🔤 공공데이터 CSV 한글 깨짐(CP949/EUC-KR) 자동 복구 및 정제기",
    "summary": "공공데이터포털, 오래된 행정망에서 내려받은 깨진 CSV 파일을 감지하여 UTF-8-SIG로 일괄 변환",
    "publicIdeas": [
      "공공데이터포털(data.go.kr) 다운로드 파일의 외계어 한글 깨짐 1초 복구",
      "전국 시내버스 노선 정류장 승하차 승객 통계 CSV 대용량 정규화",
      "기상청 기상 관측 시계열 데이터 결측치 보정 및 표준 날짜 포맷 변환"
    ],
    "privateIdeas": [
      "구글 설문지 응답 CSV를 사내 ERP에 업로드할 때 한글 깨짐 방지 인코딩 변환",
      "이커머스 결제 로그 CSV에서 BOM(Byte Order Mark) 제거 및 필드 구분자 정리",
      "물류 창고 재고 실사 바코드 스캔 CSV 데이터 공백 및 특수문자 제거"
    ],
    "techStack": [
      "Python",
      "chardet (인코딩 자동 감지)",
      "Pandas",
      "CLI Batch"
    ],
    "pros": [
      "파일을 열어보지 않아도 CP949, EUC-KR, UTF-8, UTF-16을 100% 자동 감지",
      "엑셀에서 바로 더블클릭해도 한글이 깨지지 않는 UTF-8-SIG 표준으로 변환",
      "기가바이트 단위의 대용량 CSV도 메모리 부족 없이 청크(Chunk) 단위 고속 처리"
    ],
    "combos": [
      "office-excel-merge",
      "desktop-customtkinter-exe",
      "web-survey-analytics"
    ],
    "comboGuide": "깨진 CSV를 먼저 정제한 뒤 엑셀 병합 툴로 전달하면 인코딩 충돌이 원천 차단됩니다.",
    "cliCommand": "pip install chardet\npython fix_encoding.py --dir=\"./raw_csv\"",
    "promptTemplate": "당신은 한글 문자 인코딩(Encoding) 및 대용량 텍스트 정제 전문가입니다.\n[목표]: {PROJECT_NAME}을(를) 위한 한글 CSV 인코딩 자동 판별 및 복구 도구를 작성합니다.\n[요구사항]:\n1. chardet/charset_normalizer를 사용하여 원본 파일의 인코딩을 신뢰도 99%로 판별.\n2. 손상된 바이트가 있어도 에러로 중단되지 않고 errors='replace' 또는 정규식으로 복구.\n3. 엑셀 호환을 위해 'utf-8-sig'로 인코딩하여 저장.\n4. 폴더 내 수백 개 CSV를 일괄 처리하는 다중 프로세싱(multiprocessing) 지원."
  },
  {
    "id": "office-image-watermark",
    "track": "office",
    "trackName": "직장인 실무·오피스",
    "badge": "📸 현장 사진 증빙 정리",
    "title": "📸 현장 증빙 사진 일괄 리사이징 & 타임스탬프 워터마크 자동 각인기",
    "summary": "공사 현장, 단속 증빙, 실태조사 사진 수천 장에 촬영일시와 위치 좌표를 워터마크로 찍고 보고서용 압축",
    "publicIdeas": [
      "도로 파손 및 시설물 보수 공사 전/후 현장 사진에 촬영 일시·공사명 일괄 각인",
      "불법 주정차 단속 현장 사진 정리 및 개인정보(차량번호판) 자동 블러 처리",
      "재난 피해 현장 증빙 사진의 GPS EXIF 메타데이터를 추출해 지도 좌표 매핑"
    ],
    "privateIdeas": [
      "건설/플랜트 감리 보고서 제출용 시공 사진 일괄 규격화 및 워터마크 합성",
      "부동산 중개업소 매물 사진에 회사 로고 워터마크 및 해상도 일괄 최적화",
      "쇼핑몰 상품 상세페이지 사진의 용량 압축(WebP 변환) 및 저작권 표기"
    ],
    "techStack": [
      "Python",
      "Pillow (PIL)",
      "piexif (EXIF 분석)",
      "CustomTkinter"
    ],
    "pros": [
      "스마트폰으로 촬영한 원본 사진의 숨은 EXIF 데이터(촬영일시/위치)를 자동 추출하여 사진 우하단에 각인",
      "장당 10MB가 넘는 고해상도 사진 500장을 보고서 첨부용 500KB로 1분 만에 일괄 압축",
      "원클릭 GUI 드래그 앤 드롭으로 컴맹 동료도 쉽게 사용 가능"
    ],
    "combos": [
      "desktop-customtkinter-exe",
      "gov-hwpx-automation",
      "office-pdf-toolkit"
    ],
    "comboGuide": "정리된 현장 사진을 공공 표준 HWPX 서식이나 PDF 보고서 표 안에 자동 배치하세요.",
    "cliCommand": "python photo_watermark.py --input=\"./photos\" --text=\"시공완료\"",
    "promptTemplate": "당신은 이미지 프로세싱 및 EXIF 메타데이터 자동화 엔지니어입니다.\n[목표]: {PROJECT_NAME} 대량 현장 사진의 워터마크 각인 및 일괄 최적화 도구를 구축합니다.\n[기능 목록]:\n1. 폴더 내 이미지(JPG, PNG, HEIC)의 EXIF 메타데이터에서 실제 촬영 일시(DateTimeOriginal) 추출.\n2. 우측 하단에 반투명 검정 배경 박스와 함께 흰색 폰트로 촬영 일시 및 사업명 워터마크 렌더링.\n3. 화질 손실을 최소화하며 파일 용량을 70% 압축(품질 85, 최적화 저장).\n4. 처리 진행률을 CustomTkinter UI에 실시간 표시."
  },
  {
    "id": "desktop-customtkinter-exe",
    "track": "desktop",
    "trackName": "PC 독립 프로그램",
    "badge": "⭐ 초보자 강추 GUI",
    "title": "💻 파이썬 CustomTkinter 모던 윈도우 앱 (.exe 단일 파일)",
    "summary": "다크모드 지원 세련된 윈도우 프로그램을 만들고, 파이썬이 없는 PC에서도 더블클릭 실행되도록 패키징",
    "publicIdeas": [
      "공공기관 인터넷 차단 폐쇄망 PC 전용 파일 포맷 변환 및 암호화 도구",
      "동주민센터 민원실 비치용 순번 안내 및 터치스크린 키오스크 단말 소프트웨어",
      "시군구청 당직실 전용 관내 비상 연락망 및 행동 매뉴얼 검색 유틸리티"
    ],
    "privateIdeas": [
      "비개발자 동료들에게 배포하는 드래그 앤 드롭 엑셀 병합 전용 단독 툴킷",
      "공장 생산 라인 바코드 스캐너 연동 시리얼 번호 출력 데스크톱 프로그램",
      "오프라인 매장 고객 접수 및 대기 순번 관리 프로그램"
    ],
    "techStack": [
      "Python",
      "CustomTkinter",
      "PyInstaller",
      "SQLite"
    ],
    "pros": [
      "파이썬이나 라이브러리 설치가 필요 없는 1개의 깔끔한 .exe 파일로 배포",
      "파일 드래그 앤 드롭, 세련된 다크모드/라이트모드, 반응형 레이아웃 기본 지원",
      "멀티스레딩(threading) 탑재로 대용량 작업 중에도 UI가 멈추거나 튕기지 않음"
    ],
    "combos": [
      "office-excel-merge",
      "office-pdf-toolkit",
      "gov-hwpx-automation",
      "agent-gemini-multimodal"
    ],
    "comboGuide": "파이썬으로 만든 엑셀/PDF 처리 엔진에 CustomTkinter GUI 스킨을 씌워 완성도를 높이세요.",
    "cliCommand": "pip install customtkinter pyinstaller\npyinstaller --onefile --noconsole --name=\"MyOfficeTool\" app.py",
    "promptTemplate": "당신은 윈도우 데스크톱 GUI 및 PyInstaller 배포 전문가입니다.\n[목표]: {PROJECT_NAME} 윈도우 전용 독립 실행 프로그램(.exe)을 만듭니다.\n[기술 스택]: Python, CustomTkinter (모던 테마), PyInstaller\n[필수 구현]:\n1. CustomTkinter 기반 파일 선택창, 진행률 바(Progressbar), 실행 로그 텍스트박스 배치.\n2. 백그라운드 처리 시 UI '응답 없음'을 방지하기 위해 threading.Thread 비동기 작업 분리.\n3. 작업 완료 시 시스템 비프음 및 알림 팝업 출력.\n4. PyInstaller 빌드를 위한 build.bat 스크립트 작성 (--onefile --noconsole)."
  },
  {
    "id": "desktop-electron-cross",
    "track": "desktop",
    "trackName": "PC 독립 프로그램",
    "badge": "🎨 화려한 웹 그래픽",
    "title": "🖥️ Electron 웹 기술 기반 크로스플랫폼 PC 소프트웨어",
    "summary": "HTML, CSS, JS의 강력한 UI 디자인과 차트를 그대로 PC 데스크톱 앱으로 패키징",
    "publicIdeas": [
      "지자체 스마트시티 통합 관제센터 대형 모니터용 대시보드 데스크톱 앱",
      "국립 박물관·과학관 인터랙티브 디지털 전시 안내 키오스크 프로그램",
      "도서관 좌석 예약 및 도서 검색 전용 터치스크린 프로그램"
    ],
    "privateIdeas": [
      "주식/가상화폐 실시간 시세 차트 뷰어 및 멀티 윈도우 트레이딩 스테이션",
      "디자이너를 위한 로컬 폰트 및 그래픽 에셋 프리뷰어 유틸리티",
      "원격 화상 회의 화면 녹화 및 실시간 타임라인 북마크 프로그램"
    ],
    "techStack": [
      "Electron",
      "Node.js",
      "Vanilla JS / React",
      "electron-builder"
    ],
    "pros": [
      "웹에서 만든 화려한 애니메이션, SVG 그래픽, 다크 글래스모피즘을 100% PC 앱으로 이식",
      "윈도우(시계 옆 시스템 트레이 상주), 글로벌 단축키(Alt+Space), 푸시 알림 연동",
      "윈도우(.exe 인스톨러)와 맥(.dmg) 버전을 코드 한 번으로 동시 빌드"
    ],
    "combos": [
      "web-firebase-fullstack",
      "agent-browser-playwright",
      "desktop-customtkinter-exe",
      "agent-gemini-multimodal"
    ],
    "comboGuide": "웹 서비스로 만든 관리자 대시보드를 Electron으로 감싸 VIP 전용 데스크톱 클라이언트로 확장하세요.",
    "cliCommand": "npx create-electron-app my-app\nnpm run make",
    "promptTemplate": "당신은 일렉트론(Electron) 크로스플랫폼 데스크톱 애플리케이션 아키텍트입니다.\n[목표]: {PROJECT_NAME} 데스크톱 전용 설치형 프로그램을 구축합니다.\n[요구사항]:\n1. Main Process와 Renderer Process 간 안전한 ContextBridge(preload.js) IPC 통신 구현.\n2. 시스템 트레이 상주 아이콘 지원 및 창 닫기 시 트레이로 최소화 옵션.\n3. 로컬 파일 시스템 직접 읽기/쓰기 권한 제어.\n4. electron-builder를 이용한 윈도우 단일 설치 파일(Setup.exe) 빌드 설정."
  },
  {
    "id": "desktop-tauri-fast",
    "track": "desktop",
    "trackName": "PC 독립 프로그램",
    "badge": "🦀 10MB 미만 초경량",
    "title": "🦀 Rust Tauri 초경량 초고속 차세대 데스크톱 앱",
    "summary": "설치 파일 10MB 미만, 메모리 30MB 이하로 노후 PC에서도 날아다니는 고성능 독립 프로그램",
    "publicIdeas": [
      "공공기관 저사양 윈도우 PC에서도 버벅임 없이 0.1초 만에 켜지는 파일 탐색기",
      "현장 조사 공무원을 위한 오프라인 실태조사 태블릿 초경량 입력기",
      "공공 전산망 백그라운드 보안 점검 및 위협 감시 초경량 데몬 프로그램"
    ],
    "privateIdeas": [
      "개발자/게이머를 위한 초경량 시스템 하드웨어 리소스 모니터링 오버레이",
      "윈도우 부팅 시 바로 뜨는 초고속 퀵 메모 및 클립보드 히스토리 매니저",
      "로컬 마크다운 문서 고속 렌더링 및 기술 문서 뷰어"
    ],
    "techStack": [
      "Rust",
      "Tauri v2",
      "HTML5 / Vanilla JS",
      "WebView2"
    ],
    "pros": [
      "Electron 대비 메모리 사용량 1/10 (30MB 미만), 설치 파일 용량 1/15 (8MB 미만)",
      "Rust 언어의 완벽한 메모리 안전성과 해킹/역공학 방지 바이너리 컴파일",
      "운영체제 기본 WebView2를 재사용하여 압도적인 배터리 절감 효과"
    ],
    "combos": [
      "desktop-electron-cross",
      "web-cloudflare-pages",
      "office-excel-merge",
      "desktop-customtkinter-exe"
    ],
    "comboGuide": "초경량 Tauri 클라이언트로 데이터를 수집하고, Cloudflare Pages로 초고속 동기화하세요.",
    "cliCommand": "npm create tauri-app@latest\nnpm run tauri build",
    "promptTemplate": "당신은 Rust Tauri 기반 고성능 데스크톱 앱 전문가입니다.\n[목표]: {PROJECT_NAME} 초경량 데스크톱 프로그램을 제작합니다.\n[아키텍처]:\n1. 프론트엔드는 가벼운 HTML/CSS/JS로 구성하고, 백엔드는 Rust Tauri command로 처리.\n2. Rust 측에서 고속 로컬 파일 입출력 및 데이터 처리를 담당하고 프론트로 직렬화 전송.\n3. 시스템 트레이, 글로벌 단축키, 창 투명도(Vibrancy) 효과 적용.\n4. 최종 릴리즈 빌드 시 용량을 10MB 미만으로 최적화."
  },
  {
    "id": "desktop-pyside-qt",
    "track": "desktop",
    "trackName": "PC 독립 프로그램",
    "badge": "⚙️ 엔지니어링 전문가용",
    "title": "⚙️ PySide6 (Qt) 전문가용 데이터 시각화 & 대용량 제어 프로그램",
    "summary": "복잡한 멀티 윈도우, 하드웨어 계측 장비 연동, 실시간 2D/3D 과학 그래프 렌더링에 최적화",
    "publicIdeas": [
      "산림청 산불 감시 센서 및 CCTV 실시간 시계열 모니터링 소프트웨어",
      "국토지리정보원 공간정보(GIS) 수치지도 레이어 오버레이 뷰어",
      "환경부 하천 수질 및 대기질 측정망 실시간 텔레메트리 관제 프로그램"
    ],
    "privateIdeas": [
      "반도체/디스플레이 제조 공정 장비 계측 데이터 실시간 그래프 분석기",
      "자율주행 테스트 차량 LiDAR/카메라 로그 시각화 플레이어",
      "바이오 헬스케어 연구실 유전자 시퀀싱 데이터 시각화 툴킷"
    ],
    "techStack": [
      "Python",
      "PySide6 (Qt for Python)",
      "PyQtGraph (고속 렌더링)",
      "NumPy"
    ],
    "pros": [
      "초당 60프레임 이상의 초고속 실시간 대용량 데이터 그래프 플로팅 지원",
      "도킹 가능한 패널, 탭 뷰, 메뉴바, 단축키 등 완성형 엔터프라이즈 데스크톱 UX",
      "C++ Qt 엔진의 강력한 성능을 파이썬의 쉬운 문법으로 온전히 활용"
    ],
    "combos": [
      "desktop-customtkinter-exe",
      "office-excel-merge",
      "gov-local-llm-rag"
    ],
    "comboGuide": "간단한 도구는 CustomTkinter로, 대규모 복합 계측 툴은 PySide6로 선택하세요.",
    "cliCommand": "pip install pyside6 pyqtgraph numpy\npython main_qt.py",
    "promptTemplate": "당신은 PySide6(Qt) 엔터프라이즈 GUI 개발자입니다.\n[목표]: {PROJECT_NAME} 고성능 데이터 시각화 데스크톱 프로그램을 구축합니다.\n[요구사항]:\n1. QMainWindow를 상속받아 세련된 QDarkStyleSheet 테마 적용.\n2. PyQtGraph를 사용하여 초당 수만 개의 시계열 데이터 포인트를 렉 없이 실시간 플로팅.\n3. QThread와 Signal/Slot 패턴을 통해 데이터 수집 스레드와 UI 스레드 완벽 분리.\n4. 분석 데이터를 CSV 및 고해상도 이미지(SVG/PNG)로 내보내는 기능 구현."
  },
  {
    "id": "web-firebase-fullstack",
    "track": "web",
    "trackName": "클라우드 웹 & DB",
    "badge": "🔥 서버리스 10분 배포",
    "title": "🔥 Firebase 풀스택 실시간 웹 서비스 (Auth + Firestore + CDN)",
    "summary": "서버 구축 지식 없이도 구글 로그인, 실시간 NoSQL 데이터베이스, 무료 전 세계 배포를 완성",
    "publicIdeas": [
      "주민 참여 예산제 제안 공모 및 실시간 주민 온라인 투표 시스템",
      "지자체 공공 체육시설 및 회의실 대관 실시간 예약 현황 게시판",
      "지역 내 소외계층 대상 자원봉사자 모집 및 활동 시간 인증 보관소"
    ],
    "privateIdeas": [
      "사내 소모임/동호회 모임 관리 및 회비 결산 실시간 투명 게시판",
      "소상공인 네일샵/미용실/필라테스 고객 실시간 예약 접수 웹페이지",
      "SaaS 제품 사용자 기능 요청 투표 및 실시간 개발 로드맵 공유 보드"
    ],
    "techStack": [
      "Vanilla JS / React",
      "Firebase Auth",
      "Cloud Firestore",
      "Firebase Hosting"
    ],
    "pros": [
      "복잡한 리눅스 서버 설정이나 백엔드 코드 없이 순수 자바스크립트 SDK로 10분 만에 웹 서비스 완성",
      "데이터가 변경되는 즉시 화면이 새로고침 없이 실시간 갱신되는 onSnapshot 리스너",
      "구글 로그인, 이메일 로그인 및 전 세계 초고속 글로벌 CDN 무료 호스팅 제공"
    ],
    "combos": [
      "agent-gemini-multimodal",
      "web-supabase-react",
      "office-bookmarklet-f12",
      "desktop-electron-cross"
    ],
    "comboGuide": "Firebase 웹 서비스에 Gemini 2.0 AI 챗봇을 결합하면 사용자 질문에 실시간 답변하는 스마트 포털이 완성됩니다.",
    "cliCommand": "npm install -g firebase-tools\nfirebase login\nfirebase deploy --only hosting",
    "promptTemplate": "당신은 구글 파이어베이스(Firebase) 풀스택 웹 개발 전문가입니다.\n[목표]: {PROJECT_NAME} 서버리스 웹 애플리케이션을 단일 HTML 파일 또는 모던 스택으로 구축합니다.\n[필수 구현]:\n1. Firebase Modular SDK(v10+)를 사용하여 Google 로그인(signInWithPopup) 및 인증 상태 추적(onAuthStateChanged).\n2. Cloud Firestore 컬렉션에 실시간 데이터 추가(addDoc), 쿼리(query, orderBy), 실시간 동기화(onSnapshot).\n3. 세련된 글래스모피즘(Glassmorphism) 다크 테마 UI와 카드형 게시판 레이아웃.\n4. firebase.json 및 firestore.rules 보안 규칙 최적화."
  },
  {
    "id": "web-supabase-react",
    "track": "web",
    "trackName": "클라우드 웹 & DB",
    "badge": "⚡ 정통 SQL 관계형 DB",
    "title": "⚡ Supabase PostgreSQL 기반 엔터프라이즈 모던 웹 서비스",
    "summary": "엔터프라이즈급 관계형 DB(PostgreSQL)와 Row Level Security(행 단위 보안)를 품은 강력한 웹 플랫폼",
    "publicIdeas": [
      "지자체 청년 취업 멘토-멘티 매칭 및 이력 관리 다대다(N:M) 관계형 플랫폼",
      "지역 소상공인 상권 분석 공공데이터 오픈 포털 및 복잡한 SQL 집계 대시보드",
      "공공 연구기관 학술 논문 및 연구 과제 아카이빙 복합 검색 포털"
    ],
    "privateIdeas": [
      "B2B 고객사 관리(CRM) 및 계약/매출 이력 추적 엔터프라이즈 대시보드",
      "유료 회원제 지식 콘텐츠 및 커뮤니티 플랫폼 (Stripe 결제 연동)",
      "프리랜서 외주 프로젝트 마일스톤 관리 및 정산 시스템 SaaS"
    ],
    "techStack": [
      "React / Next.js",
      "Supabase (PostgreSQL)",
      "Row Level Security",
      "Vercel"
    ],
    "pros": [
      "외래키, 조인(JOIN), 트랜잭션을 지원하는 정통 오픈소스 PostgreSQL의 무한한 확장성",
      "로그인한 사용자가 본인 데이터만 수정할 수 있도록 DB 엔진 차원에서 보장하는 RLS 보안",
      "대용량 파일 업로드(Supabase Storage)와 서버리스 엣지 함수(Edge Functions) 기본 탑재"
    ],
    "combos": [
      "web-firebase-fullstack",
      "web-cloudflare-pages",
      "agent-gemini-multimodal",
      "desktop-electron-cross"
    ],
    "comboGuide": "복잡한 관계형 데이터는 Supabase에 보관하고, Vercel로 원클릭 배포하여 완벽한 풀스택을 완성하세요.",
    "cliCommand": "npm create vite@latest my-app -- --template react\nnpm install @supabase/supabase-js",
    "promptTemplate": "당신은 수파베이스(Supabase) & React 풀스택 엔지니어입니다.\n[목표]: {PROJECT_NAME} 관계형 데이터베이스 기반 모던 웹 서비스를 구축합니다.\n[요구사항]:\n1. Supabase PostgreSQL 스키마 설계 (테이블 간 Foreign Key 관계 정의).\n2. Row Level Security(RLS) 정책을 작성하여 사용자별 데이터 격리 및 관리자 권한 분리.\n3. @supabase/supabase-js 클라이언트를 사용한 CRUD 작업 및 실시간 테이블 구독(channel).\n4. Tailwind CSS 또는 세련된 바닐라 CSS 기반의 반응형 엔터프라이즈 대시보드 UI 구현."
  },
  {
    "id": "web-cloudflare-pages",
    "track": "web",
    "trackName": "클라우드 웹 & DB",
    "badge": "☁️ 글로벌 엣지 0ms",
    "title": "☁️ Cloudflare Pages + D1 전 세계 0ms 응답 서버리스 웹사이트",
    "summary": "트래픽이 폭증해도 서버 다운과 비용 걱정이 없는 초고속 엣지 SQLite 데이터베이스 풀스택",
    "publicIdeas": [
      "태풍/폭설/산불 등 재난 발생 시 동시접속 100만 명을 견디는 긴급 대피소 안내 웹",
      "지자체 대표 관광 축제 실시간 주차장 잔여 대수 안내 모바일 웹",
      "공공데이터 실시간 날씨/미세먼지 예보 전국민 대상 초고속 배포 포털"
    ],
    "privateIdeas": [
      "넷플릭스급 트래픽 폭증에도 송신비용(Egress) 0원인 신제품 런칭 랜딩페이지",
      "전 세계 글로벌 고객을 위한 초고속 로딩 다국어 문서 검색 포털",
      "서버리스 SQLite(D1) 기반 가벼운 개인 포트폴리오 및 기술 블로그"
    ],
    "techStack": [
      "Cloudflare Pages",
      "Cloudflare D1 (SQLite)",
      "Wrangler CLI",
      "Hono.js"
    ],
    "pros": [
      "전 세계 300개 도시 엣지 데이터센터에서 사용자에게 가장 가까운 곳에서 0ms 수준으로 즉시 응답",
      "AWS S3와 달리 데이터 다운로드(Egress) 트래픽 비용이 완전 무료(R2 스토리지 연동)",
      "Git Push 한 번으로 빌드부터 글로벌 배포까지 1분 만에 완료"
    ],
    "combos": [
      "desktop-tauri-fast",
      "web-firebase-fullstack",
      "agent-mcp-server",
      "agent-browser-playwright"
    ],
    "comboGuide": "Tauri 데스크톱 앱의 글로벌 백엔드 API를 Cloudflare Workers + D1으로 연결하세요.",
    "cliCommand": "npm create cloudflare@latest\nnpx wrangler d1 create my-db\nnpx wrangler pages deploy",
    "promptTemplate": "당신은 클라우드플레어(Cloudflare) 엣지 컴퓨팅 전문가입니다.\n[목표]: {PROJECT_NAME} 초고속 글로벌 서버리스 풀스택을 구축합니다.\n[아키텍처]:\n1. Cloudflare Pages + Functions (또는 초경량 Hono.js 웹 프레임워크) 결합.\n2. Cloudflare D1 (분산 SQLite) 데이터베이스 스키마 생성 및 SQL 쿼리 바인딩.\n3. 전 세계 엣지 캐싱 헤더 최적화(Cache-Control: s-maxage=3600).\n4. wrangler.toml 설정 파일 작성 및 자동 배포 파이프라인 수립."
  },
  {
    "id": "web-survey-analytics",
    "track": "web",
    "trackName": "클라우드 웹 & DB",
    "badge": "📈 실시간 여론조사",
    "title": "📈 대국민/고객 설문조사 & 실시간 통계 차트 대시보드",
    "summary": "중복 응답 방지, 조건부 분기 질문, 실시간 인터랙티브 차트(Chart.js)가 완비된 설문 플랫폼",
    "publicIdeas": [
      "시정 만족도 대국민 실시간 설문 및 연령별·지역별 차트 즉시 공개",
      "공공기관 고객만족도(PCSI) 자체 평가 수렴 및 부서별 비교 통계",
      "주민 자치 프로그램 신규 개설 선호도 투표 및 워드클라우드 시각화"
    ],
    "privateIdeas": [
      "신제품 출시 전 타깃 고객 사전 수요 조사 및 NPS(순고객추천지수) 산출",
      "웨비나/컨퍼런스 종료 직후 참가자 실시간 만족도 설문 및 후기 수집",
      "사내 조직문화 진단 및 익명 설문조사 대시보드"
    ],
    "techStack": [
      "Vanilla JS / React",
      "Chart.js",
      "Firebase / Supabase",
      "CSV Export"
    ],
    "pros": [
      "설문 제출 즉시 결과 차트가 실시간 애니메이션과 함께 갱신",
      "IP 및 브라우저 핑거프린팅을 통한 중복 응답 원천 차단",
      "응답 데이터를 원클릭으로 정제된 엑셀(CSV) 파일로 다운로드"
    ],
    "combos": [
      "web-firebase-fullstack",
      "office-excel-merge",
      "agent-gemini-multimodal"
    ],
    "comboGuide": "설문 응답의 주관식 서술형 피드백을 Gemini 2.0 AI로 감정 분석하여 3줄 요약 보고서를 만드세요.",
    "cliCommand": "npm install chart.js\npython -m http.server 8080",
    "promptTemplate": "당신은 대규모 설문조사 및 데이터 시각화 웹 애플리케이션 엔지니어입니다.\n[목표]: {PROJECT_NAME} 실시간 인터랙티브 설문 대시보드를 제작합니다.\n[기능 구현]:\n1. 객관식, 다중선택, 5점 척도, 주관식 서술형 질문 폼 렌더링.\n2. 응답 완료 즉시 Firestore/Supabase에 기록하고 Chart.js 도넛/바 차트로 실시간 동기화.\n3. 관리자 모드에서 응답자 필터링(연령대, 성별) 및 엑셀 다운로드 기능.\n4. 모바일 화면에서도 깨짐 없는 완벽한 반응형 글래스모피즘 디자인."
  },
  {
    "id": "agent-browser-playwright",
    "track": "browser",
    "trackName": "브라우저 & 크롤러",
    "badge": "🕷️ 차단 우회 크롤러",
    "title": "🕷️ Playwright 헤드리스 브라우저 지능형 수집 봇 & 화면 캡처",
    "summary": "2단계 인증, 자바스크립트 렌더링, 캡차 차단을 뚫고 실제 사람처럼 마우스를 움직여 데이터를 수집",
    "publicIdeas": [
      "전국 240여 개 지자체 고시·공고 게시판의 보조금 지원 사업 매일 자동 전수 수집",
      "복지로/워크넷 등 정부 복지 채용 포털의 신규 공고 수집 및 담당자 이메일 스크랩",
      "공공 포털 화면의 주기적 스크린샷 캡처를 통한 사이트 장애 및 위변조 실시간 감시"
    ],
    "privateIdeas": [
      "이커머스(네이버쇼핑/쿠팡) 경쟁사 상품 가격 및 품절 여부 5분 주기 실시간 감시",
      "네이버 부동산 관할 지역 급매물 등록 시 즉시 텔레그램 알림 발송 봇",
      "항공사 특가 항공권 및 호텔 빈 방 취소분 감지 실시간 예약 알림기"
    ],
    "techStack": [
      "Python / Node.js",
      "Playwright",
      "BeautifulSoup4",
      "StorageState"
    ],
    "pros": [
      "단순 HTML 파싱으로 막히는 최신 리액트/뷰 웹사이트도 100% 완벽하게 화면 렌더링 후 수집",
      "로그인 세션(쿠키 및 로컬 스토리지)을 저장하여 2단계 인증을 매번 거치지 않고 우회",
      "주기적인 크론(cron) 배치로 매일 아침 8시 자동 실행 후 엑셀 리포트 생성"
    ],
    "combos": [
      "office-excel-merge",
      "office-email-alert",
      "agent-mcp-server",
      "gov-procurement-monitor"
    ],
    "comboGuide": "수집된 비정형 웹 데이터를 파이썬 엑셀 툴로 정제한 뒤, 이상 징후 발생 시 이메일로 즉시 보고하세요.",
    "cliCommand": "pip install playwright\nplaywright install chromium\npython bot.py",
    "promptTemplate": "당신은 웹 크롤링 및 브라우저 자동화(Playwright) 수석 엔지니어입니다.\n[목표]: {PROJECT_NAME} 사이트의 동적 데이터를 안전하게 수집하는 스크래퍼를 구축합니다.\n[요구사항]:\n1. Playwright async API를 사용하여 Chromium 브라우저를 백그라운드(Headless) 구동.\n2. 무한 스크롤(Infinite Scroll) 및 동적 AJAX 로딩을 대기(waitForSelector)하는 안정적 로직.\n3. 봇 탐지 차단 방지를 위한 브라우저 핑거프린트 스푸핑 및 랜덤 대기(Random Delay) 적용.\n4. 로그인 쿠키 상태(StorageState)를 로컬 JSON으로 저장하여 재인증 없이 세션 유지.\n5. 수집 결과를 타임스탬프와 함께 SQLite 또는 엑셀로 자동 내보내기."
  },
  {
    "id": "agent-selenium-automation",
    "track": "browser",
    "trackName": "브라우저 & 크롤러",
    "badge": "🏛️ 사내 인트라넷 매크로",
    "title": "🏛️ Selenium 전통 행정망/공공기관 보안 사이트 자동 조작 봇",
    "summary": "보안 플러그인, 액티브X 잔재, 팝업창이 난무하는 전통 사내 인트라넷과 금융 포털 작업 자동화",
    "publicIdeas": [
      "홈택스 전자세금계산서 수백 건 일괄 대량 발급 및 상태 조회 자동화",
      "4대 사회보험 정보연계센터 직원 입사/퇴사 자격 취득·상실 신고 자동 접수",
      "지방세 위택스(Wetax) 납부내역 전산 일괄 조회 및 영수증 다운로드"
    ],
    "privateIdeas": [
      "쇼핑몰 B2B 사입 포털 대량 발주 및 가상계좌 입금 확인 매크로",
      "물류 화물 운송사 전산망에 배차 정보 및 송장 번호 일괄 자동 입력",
      "시중은행 기업 인터넷뱅킹 계좌 이체내역 자동 스크래핑 및 ERP 전표 분개"
    ],
    "techStack": [
      "Python",
      "Selenium",
      "WebDriver Manager",
      "PyAutoGUI"
    ],
    "pros": [
      "오래된 엔터프라이즈 웹사이트의 alert/confirm 팝업창 및 iframe 중첩 완벽 제어",
      "키보드/마우스 하드웨어 레벨 이벤트(PyAutoGUI)를 결합하여 키보드 보안 프로그램 우회",
      "작업 과정을 화면 녹화하거나 실패 시 스크린샷을 자동 저장하여 사후 감사 소명 가능"
    ],
    "combos": [
      "office-excel-merge",
      "desktop-customtkinter-exe",
      "office-email-alert"
    ],
    "comboGuide": "엑셀 명단을 읽어와 셀레니움으로 사내 전산망에 자동 입력하고 결과를 다시 엑셀로 피드백하세요.",
    "cliCommand": "pip install selenium webdriver-manager pyautogui\npython legacy_bot.py",
    "promptTemplate": "당신은 공공 및 금융 레거시 웹사이트 자동화(Selenium) 엔지니어입니다.\n[목표]: {PROJECT_NAME} 반복 업무를 처리하는 안정적인 셀레니움 자동화 봇을 구축합니다.\n[요구사항]:\n1. WebDriverWait과 expected_conditions를 사용한 명시적 대기(Explicit Wait)로 로딩 지연 대응.\n2. 여러 개의 브라우저 탭 및 팝업 윈도우 핸들(window_handles) 전환 처리.\n3. iframe 내부에 위치한 폼 요소 탐색(switch_to.frame).\n4. 예외 발생 시 현재 화면 스크린샷을 찍어 logs/error_시간.png로 저장하고 재시도(Retry) 로직 수행."
  },
  {
    "id": "agent-rss-news-digest",
    "track": "browser",
    "trackName": "브라우저 & 크롤러",
    "badge": "📰 뉴스 자동 브리핑",
    "title": "📰 정부 부처 보도자료 & 언론사 뉴스 실시간 수집 및 모닝 브리핑 봇",
    "summary": "주요 언론사와 정부 부처 RSS/피드를 30분마다 탐색하여 우리 기관 관련 이슈를 요약 보고",
    "publicIdeas": [
      "우리 부처/지자체 관련 조간·석간 신문 기사 스크랩 자동 생성 및 대변인실 보고",
      "국회 의안정보시스템 신규 법안 발의 현황 실시간 감시 및 소관 상임위 알림",
      "지역 사회 주요 민원 키워드 언론 보도 동향 실시간 모니터링"
    ],
    "privateIdeas": [
      "업계 경쟁사 신제품 출시 및 특허 출원 뉴스 매일 아침 사내 슬랙 브리핑",
      "가상화폐/주식 주요 종목 글로벌 외신 속보 실시간 텔레그램 번역 알림",
      "원자재 가격 변동 및 환율 이슈 모니터링 구매팀 뉴스레터 자동 발송"
    ],
    "techStack": [
      "Python",
      "feedparser",
      "BeautifulSoup4",
      "Gemini 2.0 Flash",
      "Slack Webhook"
    ],
    "pros": [
      "수십 개 언론사 사이트를 일일이 들어갈 필요 없이 RSS 표준 피드로 1초 만에 최신 기사 수집",
      "Gemini AI가 중복된 어뷰징 기사를 제거하고 진짜 중요한 핵심 팩트만 3줄 요약",
      "매일 아침 8시 정각에 카카오톡, 잔디, 슬랙 메신저로 자동 딜리버리"
    ],
    "combos": [
      "gov-press-release-hwpx",
      "office-email-alert",
      "agent-gemini-multimodal"
    ],
    "comboGuide": "수집된 아침 뉴스를 분석하여 우리 기관의 대응 보도자료 초안을 즉시 생성하도록 연결하세요.",
    "cliCommand": "python news_digest.py --keywords=\"인공지능,디지털정부,클라우드\"",
    "promptTemplate": "당신은 실시간 뉴스 모니터링 및 AI 다이제스트 브리핑 엔지니어입니다.\n[목표]: {PROJECT_NAME} 맞춤형 실시간 뉴스 모니터링 및 자동 요약 봇을 구축합니다.\n[구현 내용]:\n1. feedparser를 사용하여 주요 언론사 및 정부 브리핑 RSS 피드를 30분 주기로 폴링.\n2. 지정된 핵심 키워드(포함어, 제외어) 필터링 및 유사 기사 클러스터링(중복 제거).\n3. Gemini Flash API를 호출하여 기사 본문을 [배경], [핵심 내용], [시사점] 3줄로 압축 요약.\n4. 완성된 모닝 브리핑 텍스트를 마크다운 규격으로 사내 메신저(슬랙/잔디/텔레그램)에 전송."
  },
  {
    "id": "agent-mcp-server",
    "track": "agent",
    "trackName": "AI 에이전트 & MCP",
    "badge": "🔌 사내 AI 도구 확장",
    "title": "🔌 커스텀 MCP(Model Context Protocol) 서버 & 사내 시스템 도구화",
    "summary": "Claude Code, Antigravity 등 AI 코딩 에이전트에게 사내 DB 조회, 파일 수정 권한을 부여하는 표준 규격",
    "publicIdeas": [
      "AI에게 자연어로 \"지난달 A시 복지 예산 잔액 알려줘\"라고 하면 내부 DB를 직접 쿼리해 답변",
      "행정망 온나라 공문서 검색 API를 MCP 도구로 등록하여 보고서 작성 시 과거 공문 자동 회수",
      "지자체 시설물 센서 이상 징후를 AI 에이전트가 직접 모니터링하고 원클릭 복구 스크립트 실행"
    ],
    "privateIdeas": [
      "AI 코딩 도구에게 회사 슬랙 메시지 발송, 지라(Jira) 티켓 생성, 노션 문서 생성 권한 부여",
      "사내 ERP 결제 내역 조회 및 회계 감사 이상 데이터 자동 검증 도구 연동",
      "개발팀 신규 코드 커밋 시 사내 보안 룰에 맞는지 AI 에이전트가 자동 검사하는 도구 세트"
    ],
    "techStack": [
      "Node.js / Python",
      "@modelcontextprotocol/sdk",
      "JSON-RPC 2.0",
      "Stdio"
    ],
    "pros": [
      "Anthropic, Google Antigravity 등 글로벌 최신 AI 에이전트가 공식 지원하는 2026 차세대 오픈 표준",
      "자연어 명령만으로 AI가 직접 파이썬 스크립트를 실행하고 DB 데이터를 안전하게 조회",
      "민감한 DB 비밀번호나 토큰을 외부에 노출하지 않고 로컬 PC 안에서 안전하게 권한 격리"
    ],
    "combos": [
      "agent-gemini-multimodal",
      "agent-browser-playwright",
      "web-cloudflare-pages",
      "gov-local-llm-rag"
    ],
    "comboGuide": "커스텀 MCP 서버를 만들어두면 Antigravity나 Claude Code 안에서 사내 모든 시스템을 말로 조작할 수 있습니다.",
    "cliCommand": "npm install @modelcontextprotocol/sdk\nnode server.js",
    "promptTemplate": "당신은 모델 컨텍스트 프로토콜(MCP, Model Context Protocol) 서버 개발 전문가입니다.\n[목표]: {PROJECT_NAME} 시스템을 AI 에이전트가 호출할 수 있는 커스텀 MCP 서버로 구현합니다.\n[요구사항]:\n1. @modelcontextprotocol/sdk를 사용하여 StdioServerTransport 기반 표준 서버 구현.\n2. 에이전트가 호출 가능한 Tools 리스트 정의 (이름, 설명, JSON Schema 파라미터).\n3. 실제 실행 핸들러(CallToolRequestSchema)에서 파라미터 유효성 검증 및 비즈니스 로직 실행.\n4. AI가 이해하기 쉬운 구조화된 텍스트 및 JSON 형태로 반환값 작성.\n5. antigravity_mcp_config.json에 즉시 등록할 수 있는 JSON 설정 스니펫 제공."
  },
  {
    "id": "agent-gemini-multimodal",
    "track": "agent",
    "trackName": "AI 에이전트 & MCP",
    "badge": "🧠 200만 토큰 AI",
    "title": "🧠 Gemini 2.0 Flash 대용량 멀티모달(수백장 PDF·영상·음성) 분석기",
    "summary": "200만 토큰의 초대형 문맥 창으로 수백 페이지 계약서, 장시간 오디오 회의록, 이미지를 한 번에 분석",
    "publicIdeas": [
      "500페이지 국정감사 회의록을 통째로 입력하여 핵심 쟁점 및 의원별 질의를 3줄 요약",
      "공공기관 보조금 신청 첨부서류 수백 건을 일괄 업로드하여 제출 누락 서류 자동 감지",
      "도로 파손 및 불법 현수막 단속 사진을 분석하여 위험도 자동 등급 판정"
    ],
    "privateIdeas": [
      "수십 장의 복잡한 해외 영문 계약서를 분석하여 독소조항 및 법률 리스크 자동 추출",
      "1시간짜리 신제품 기획 회의 녹음 오디오를 업로드하여 결정사항 및 할 일(Action Item) 도출",
      "건설/플랜트 시공 현장 사진을 분석하여 안전모 미착용 등 안전 규정 위반 자동 탐지"
    ],
    "techStack": [
      "JavaScript / Python",
      "@google/genai SDK",
      "gemini-2.0-flash",
      "Streaming API"
    ],
    "pros": [
      "문서 분할(Chunking) 없이 1,000페이지 문서를 통째로 AI에 밀어 넣어도 문맥을 완벽 이해",
      "텍스트뿐만 아니라 스캔 영수증 이미지, 음성 회의록, 현장 동영상까지 동시 입력 가능",
      "답변이 완성될 때까지 기다리지 않고 첫 글자부터 타이핑되듯 흘러나오는 스트리밍(Streaming) 지원"
    ],
    "combos": [
      "web-firebase-fullstack",
      "office-pdf-toolkit",
      "gov-hwpx-automation",
      "agent-whisper-meeting"
    ],
    "comboGuide": "PDF 툴킷으로 추출한 비정형 문서 텍스트와 이미지를 Gemini 2.0 멀티모달 API에 전달하여 지능형 보고서를 작성하세요.",
    "cliCommand": "npm install @google/genai\nnode analyze.js --file=\"contract.pdf\"",
    "promptTemplate": "당신은 구글 제미나이(Google Gemini 2.0) 멀티모달 애플리케이션 아키텍트입니다.\n[목표]: {PROJECT_NAME} 대용량 문서 및 멀티모달 분석 파이프라인을 구축합니다.\n[요구사항]:\n1. 최신 Google Gen AI SDK를 사용하여 gemini-2.0-flash 모델 호출.\n2. 대용량 PDF 문서 또는 이미지를 인라인 base64 또는 Files API로 업로드.\n3. System Instruction을 지정하여 사실 기반 분석, 환각 금지, 표 형태 정돈 출력 명령.\n4. generateContentStream을 사용하여 사용자 화면에 실시간 타자 효과(Streaming) 렌더링."
  },
  {
    "id": "agent-whisper-meeting",
    "track": "agent",
    "trackName": "AI 에이전트 & MCP",
    "badge": "🎙️ 회의록 자동화",
    "title": "🎙️ 오프라인 회의 음성 녹음 자동 전사(STT) & 회의록 자동 생성기",
    "summary": "인터넷 연결 없이 로컬 PC에서 녹음 음성을 완벽한 텍스트로 변환하고 화자 분리 및 요약문 생성",
    "publicIdeas": [
      "지자체 의회 본회의 발언 전수 텍스트화 및 의원별 찬반 토론 요약록 생성",
      "주민 공청회 찬반 의견 수렴 녹음 파일의 주요 쟁점별 자동 분류 보고서 작성",
      "공무원 징계위원회 및 고충처리위원회 비공개 녹음의 보안 유지 로컬 텍스트화"
    ],
    "privateIdeas": [
      "사내 주간 전략 회의 음성을 텍스트로 변환하고 부서별 실행 과제(To-Do) 자동 도출",
      "고객센터 인바운드 통화 녹음 파일 전수 텍스트화 및 불만 키워드 이상 감지",
      "유튜브/팟캐스트 인터뷰 오디오의 자막(.srt) 자동 생성 및 블로그 포스팅용 변환"
    ],
    "techStack": [
      "Python",
      "faster-whisper",
      "PyAnnote (화자분리)",
      "Ollama / Gemini"
    ],
    "pros": [
      "보안이 중요한 내부 회의 음성을 외부 클라우드에 업로드하지 않고 100% 로컬 PC에서 변환",
      "OpenAI Whisper 대비 4배 빠른 faster-whisper CTranslate2 고속 엔진 탑재",
      "화자 1, 화자 2 등 참석자별 발언 분리 및 공공 표준 회의록 양식으로 자동 조립"
    ],
    "combos": [
      "gov-hwpx-automation",
      "gov-press-release-hwpx",
      "desktop-customtkinter-exe",
      "agent-gemini-multimodal"
    ],
    "comboGuide": "음성 전사된 회의 텍스트를 공공 표준 HWPX 서식 조립기에 주입하면 1초 만에 결재용 회의록이 완성됩니다.",
    "cliCommand": "pip install faster-whisper\npython transcribe.py --audio=\"meeting.mp3\"",
    "promptTemplate": "당신은 음성 인식(STT) 및 지능형 회의록 생성 엔지니어입니다.\n[목표]: {PROJECT_NAME} 음성 녹음 파일로부터 고품질 회의록을 자동 작성하는 파이프라인을 구축합니다.\n[파이프라인]:\n1. faster-whisper (large-v3 또는 medium 모델)를 이용해 음성 파일 텍스트 전사(한국어 전용).\n2. 타임스탬프 기반 문장 정렬 및 잡음/추임새 필터링.\n3. LLM(Gemini 또는 로컬 Ollama)을 거쳐 4대 핵심 구조로 요약:\n   - [회의 개요]: 일시, 장소, 참석자, 주요 안건\n   - [안건별 논의 내용]: 쟁점 및 참석자별 의견\n   - [최종 의결 사항]: 합의된 결론\n   - [향후 조치 계획 (Action Items)]: 담당자 및 완료 목표일\n4. 완성된 회의록을 공공 표준 HWPX 또는 엑셀 문서로 내보내기."
  },
  {
    "id": "agent-rag-vector-search",
    "track": "agent",
    "trackName": "AI 에이전트 & MCP",
    "badge": "📚 거짓말 0% 사내 챗봇",
    "title": "📚 사내 규정·업무 매뉴얼 기반 RAG(검색 증강) 챗봇",
    "summary": "기관 내부 PDF, HWPX, 노션 문서를 벡터화하여 정확한 출처 페이지와 함께 답변하는 지식 챗봇",
    "publicIdeas": [
      "시민 대상 24시간 복지 혜택 안내 챗봇 (지자체 복지 가이드북 기반)",
      "민원 업무 편람 기반 신임 공무원 업무 절차 및 서식 안내 도우미",
      "공공기관 정보공개 청구 심사 기준 및 비공개 대상 정보 판정 가이드 챗봇"
    ],
    "privateIdeas": [
      "복잡한 B2B IT 솔루션 기술 매뉴얼 기반 고객지원(CS) 1차 응대 챗봇",
      "사내 인사 취업규칙, 경조사비 지급 규정, 연차 계산 안내 사내 챗봇",
      "제조사 기계 장비 고장 코드별 트러블슈팅 매뉴얼 즉시 검색 챗봇"
    ],
    "techStack": [
      "Python / TypeScript",
      "LangChain / LlamaIndex",
      "ChromaDB / Pinecone",
      "Gemini / Claude"
    ],
    "pros": [
      "AI가 거짓말(환각)을 지어내지 않고 오직 업로드된 사내 문서에 근거해서만 답변",
      "답변 하단에 [근거 문서]: \"2026_복지업무편람.pdf 제45페이지\"와 같이 정확한 출처 표기",
      "문서가 업데이트되면 해당 파일만 다시 임베딩하여 항상 최신 규정 유지"
    ],
    "combos": [
      "gov-local-llm-rag",
      "agent-gemini-multimodal",
      "web-firebase-fullstack",
      "desktop-customtkinter-exe"
    ],
    "comboGuide": "사내 보안망용은 Ollama 로컬 RAG로, 대외 대민 서비스용은 Cloud RAG로 이원화하세요.",
    "cliCommand": "pip install langchain chromadb\npython build_rag.py --docs=\"./manuals\"",
    "promptTemplate": "당신은 검색 증강 생성(RAG, Retrieval-Augmented Generation) 시스템 엔지니어입니다.\n[목표]: {PROJECT_NAME} 사내 규정 기반의 무결점 질의응답 챗봇을 구현합니다.\n[요구사항]:\n1. 내부 문서(PDF/HWPX/DOCX)를 텍스트 추출 후 의미 단위(Semantic Chunk)로 분할.\n2. 텍스트 임베딩을 거쳐 ChromaDB에 메타데이터(파일명, 페이지 번호)와 함께 인덱싱.\n3. 검색 질의 시 코사인 유사도 기반 상위 3개 청크를 Context로 주입.\n4. 시스템 프롬프트: \"주어진 Context에 없는 내용은 절대로 추측하지 말고 '규정에 명시되어 있지 않습니다'라고 답변할 것. 모든 문장에 출처 표기 필수.\""
  },
  {
    "id": "agent-remotion-video",
    "track": "agent",
    "trackName": "AI 에이전트 & MCP",
    "badge": "🎬 코드 기반 영상 제작",
    "title": "🎬 리액트(Remotion) 코드 기반 데이터 숏폼 영상 자동 렌더링 엔진",
    "summary": "영상 편집기 없이 React 코드와 데이터(JSON/CSV)만으로 유튜브 쇼츠, 인스타 릴스 영상을 대량 생성",
    "publicIdeas": [
      "이번 주 주요 시정 소식 및 재난 안전 수칙 카드뉴스 숏폼 영상 자동 렌더링",
      "공공데이터 통계(미세먼지, 기상 특보, 물가 동향) 인포그래픽 애니메이션 영상",
      "공공기관 채용 공고 및 청년 정책 요약 9:16 모바일 세로형 쇼츠 영상 제작"
    ],
    "privateIdeas": [
      "일일 주식 시황 및 부동산 급매물 브리핑 틱톡/릴스/쇼츠 자동 생성",
      "이커머스 베스트셀러 상품 소개 및 리뷰 요약 홍보 영상 일괄 제작",
      "온라인 강의 핵심 하이라이트 자막 클립 자동 컷 편집 및 쇼츠 발행"
    ],
    "techStack": [
      "React",
      "Remotion",
      "Node.js",
      "FFmpeg"
    ],
    "pros": [
      "프리미어 프로 같은 무거운 편집 툴 없이 리액트 컴포넌트(JSX)로 영상 레이아웃과 자막 제작",
      "데이터베이스의 데이터가 바뀌면 서버에서 영상이 1분 만에 MP4로 자동 렌더링",
      "동일한 디자인 템플릿에 데이터만 갈아 끼워 하루 100개의 쇼츠 영상을 대량 자동 생산"
    ],
    "combos": [
      "agent-rss-news-digest",
      "office-excel-merge",
      "agent-gemini-multimodal"
    ],
    "comboGuide": "RSS로 수집한 아침 뉴스를 Gemini로 3줄 요약한 뒤, Remotion 렌더러로 전달해 쇼츠 영상을 자동 발행하세요.",
    "cliCommand": "npx remotion init\nnpx remotion render src/index.ts MyComp out.mp4",
    "promptTemplate": "당신은 리모션(Remotion) 기반 프로그래밍 방식 비디오 제작 전문가입니다.\n[목표]: {PROJECT_NAME} 9:16 세로형 숏폼 비디오 컴포지션을 구축합니다.\n[요구사항]:\n1. Remotion Composition (1080x1920, 30fps, 15초 분량) 설정.\n2. interpolate 및 spring 애니메이션을 사용한 역동적인 텍스트 자막 타이틀 인/아웃 효과.\n3. 데이터 props(제목, 요약 3문장, 배경 이미지)를 받아 동적으로 화면 구성.\n4. npx remotion render CLI 명령어로 헤드리스 서버에서 무인 MP4 일괄 렌더링."
  }
];

export const DECISION_TREE_V2 = {
  "start": {
    "step": "1단계 / 5",
    "progress": 20,
    "type": "yn",
    "title": "🖥️ 실행 환경 선택",
    "question": "이 프로그램을 브라우저가 아닌 팝업과 같은 독립창 프로그램으로 만들겠습니까?",
    "desc": "브라우저 없이 내 컴퓨터에서 단독 창으로 띄우려면 [예 (YES)], 크롬/엣지 같은 웹브라우저에서 띄우려면 [아니오 (NO)]를 누르세요.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 팝업창 / 독립 프로그램으로 만들겠습니다",
        "subLabel": "바탕화면에서 더블클릭(.exe)으로 바로 실행되는 나만의 단독 창 프로그램",
        "next": "q2_desktop_sec"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 웹브라우저 창에서 실행되게 만들겠습니다",
        "subLabel": "크롬/엣지 인터넷 주소(URL)로 접속하거나 브라우저 즐겨찾기에서 실행",
        "next": "q2_browser_target"
      }
    ]
  },
  "q2_desktop_sec": {
    "step": "2단계 / 5",
    "progress": 40,
    "type": "yn",
    "title": "🔒 보안 및 네트워크 환경 확인",
    "question": "인터넷이 차단된 사내 폐쇄망이나 데이터 외부 유출이 엄격히 금지된 환경에서 구동해야 합니까?",
    "desc": "공공기관, 금융권, 연구소 등 인터넷 연결이 없는 오프라인 PC 환경인지 확인합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 100% 오프라인 / 폐쇄망 보안 환경이어야 합니다",
        "subLabel": "외부 인터넷 연결 없이 내 PC 안에서만 모든 데이터가 안전하게 처리",
        "next": "q3_desktop_sec_task"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 일반 인터넷 사용이 가능한 환경입니다",
        "subLabel": "외부 API 연동, 클라우드 업데이트, 화려한 웹 기술 활용 가능",
        "next": "q3_desktop_open_engine"
      }
    ]
  },
  "q2_browser_target": {
    "step": "2단계 / 5",
    "progress": 40,
    "type": "yn",
    "title": "🌐 데이터 온라인 공유 여부",
    "question": "웹사이트 링크(URL)를 통해 여러 사람이 데이터를 실시간으로 함께 저장하고 공유해야 합니까?",
    "desc": "회원가입, 로그인, 게시판, 클라우드 DB가 필요한 웹 서비스인지 확인합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 링크(URL)로 여러 사람과 데이터를 같이 저장해야 합니다",
        "subLabel": "무료 호스팅 배포 + 데이터베이스(DB) + 로그인 기능이 있는 웹 서비스",
        "next": "q3_web_backend"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 나 혼자 브라우저에서 매크로/작업만 하면 됩니다",
        "subLabel": "즐겨찾기 클릭 매크로, 웹 데이터 수집 봇, 사내 폐쇄망 AI 등",
        "next": "q3_browser_macro"
      }
    ]
  },
  "q3_desktop_sec_task": {
    "step": "3단계 / 5",
    "progress": 60,
    "type": "choice",
    "title": "📊 폐쇄망에서 주로 다룰 핵심 업무 선택",
    "question": "폐쇄망 PC에서 가장 시간을 많이 뺏기는 핵심 업무는 무엇입니까?",
    "desc": "자동화할 대상 문서 및 데이터 형태를 선택해주세요.",
    "options": [
      {
        "text": "📊 수십~수백 개 엑셀/CSV 파일 자동 병합 및 데이터 이상치 검증",
        "next": "q4_excel_deploy_mode"
      },
      {
        "text": "📑 스캔 PDF나 전자문서에서 표(Table) 데이터 추출 및 페이지 분리",
        "next": "q4_pdf_feature_mode"
      },
      {
        "text": "📄 공공 표준 한글(HWP/HWPX) 보고서 자동 생성 및 보도자료 조립",
        "next": "q4_gov_format_mode"
      },
      {
        "text": "🔍 복지 보조금 중복수급 탐지 및 지방세 체납 고지서 관리",
        "next": "q4_gov_audit_mode"
      }
    ]
  },
  "q3_desktop_open_engine": {
    "step": "3단계 / 5",
    "progress": 60,
    "type": "choice",
    "title": "💻 데스크톱 프로그램 기술 엔진 선택",
    "question": "어떤 특성을 가진 독립 프로그램을 만들고자 하십니까?",
    "desc": "가장 쉬운 파이썬, 화려한 웹 디자인, 초경량 네이티브 중 선택하세요.",
    "options": [
      {
        "text": "🐍 파이썬 CustomTkinter 기반 모던 다크모드 단일 실행 프로그램 (.exe)",
        "next": "q4_python_gui_feature"
      },
      {
        "text": "🖥️ 웹 디자인(HTML/CSS/JS)의 화려한 그래픽을 품은 Electron PC 앱",
        "next": "q4_electron_feature"
      },
      {
        "text": "🦀 메모리 30MB 이하, 실행 파일 10MB 미만의 극강 성능 Rust Tauri 앱",
        "next": "q4_tauri_feature"
      },
      {
        "text": "⚙️ 복잡한 멀티패널 & 초고속 실시간 그래프를 그리는 전문가용 PySide6 (Qt) 앱",
        "next": "q4_pyside_feature"
      }
    ]
  },
  "q3_web_backend": {
    "step": "3단계 / 5",
    "progress": 60,
    "type": "choice",
    "title": "🔥 웹 서비스 백엔드 & 데이터베이스 구조 선택",
    "question": "어떤 방식의 데이터베이스와 백엔드 서버를 선호하십니까?",
    "desc": "초보자에게 가장 쉬운 Firebase부터 정통 SQL까지 지원합니다.",
    "options": [
      {
        "text": "🔥 Firebase 서버리스 (서버 개발 0, 구글 로그인, 실시간 Firestore DB)",
        "next": "q4_firebase_frontend"
      },
      {
        "text": "⚡ Supabase (정통 PostgreSQL 관계형 DB + 고도화된 권한 관리)",
        "next": "q4_supabase_stack"
      },
      {
        "text": "☁️ Cloudflare Pages + D1 (전 세계 엣지 0ms 응답 + 초저비용 SQLite)",
        "next": "q4_cloudflare_stack"
      },
      {
        "text": "📈 대국민/고객 실시간 설문조사 & 차트 시각화 인터랙티브 플랫폼",
        "next": "q4_survey_stack"
      }
    ]
  },
  "q3_browser_macro": {
    "step": "3단계 / 5",
    "progress": 60,
    "type": "choice",
    "title": "⚡ 브라우저 개인 자동화 도구 선택",
    "question": "브라우저에서 어떤 방식으로 업무를 자동화하고 싶으십니까?",
    "desc": "설치 없는 북마클릿 매크로부터 지능형 크롤러, AI 에이전트 확장(MCP)까지 지원합니다.",
    "options": [
      {
        "text": "⚡ 프로그램 설치 없이 즐겨찾기 클릭으로 ERP/웹 입력 자동화 (북마클릿)",
        "next": "q4_macro_bookmarklet_type"
      },
      {
        "text": "🕷️ 로그인·차단을 뚫고 웹 화면을 캡처하고 데이터를 긁어오는 Playwright 수집 봇",
        "next": "q4_macro_crawler_type"
      },
      {
        "text": "🏛️ 보안 프로그램/액티브X가 깔린 전통 공공·사내 인트라넷 자동화 (Selenium)",
        "next": "q4_macro_selenium_type"
      },
      {
        "text": "🔌 AI 코딩 도구(Claude/Antigravity)에게 사내 제어 권한을 주는 커스텀 MCP 서버",
        "next": "q4_macro_mcp_type"
      }
    ]
  },
  "q4_excel_deploy_mode": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "👥 비개발자 동료 배포 방식",
    "question": "동료에게 전달할 때 파이썬 설치 없이 .exe 더블클릭만으로 실행되어야 합니까?",
    "desc": "비개발자 팀원이 파일만 드래그 앤 드롭하면 끝나도록 단일 실행 파일로 만들지 결정합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 드래그 앤 드롭이 되는 .exe 단일 창 프로그램으로 만들어주세요",
        "subLabel": "CustomTkinter UI + PyInstaller 원클릭 패키징",
        "next": "q5_excel_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 내 PC 터미널에서 빠르게 도는 파이썬 스크립트면 충분합니다",
        "subLabel": "Pandas 초고속 메모리 처리 및 자동 스케줄러 배치",
        "next": "q5_excel_ai_need"
      }
    ]
  },
  "q4_pdf_feature_mode": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "📑 PDF 표(Table) 데이터 추출 여부",
    "question": "문서 본문 내 표(Table) 데이터를 자동 인식하여 엑셀(.xlsx)로 추출해야 합니까?",
    "desc": "단순 텍스트 검색 및 페이지 분리인지, 정밀한 표 데이터 변환인지 확인합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 문서 내 표를 인식해 엑셀(.xlsx)로 정밀 변환해야 합니다",
        "subLabel": "pdfplumber 표 영역 감지 + PyMuPDF 고속 파싱 엔진",
        "next": "q5_pdf_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 키워드 페이지 분리 및 문서 병합/보안 관리가 목적입니다",
        "subLabel": "PyMuPDF 초고속 대용량 PDF 슬라이싱 및 병합",
        "next": "q5_pdf_ai_need"
      }
    ]
  },
  "q4_gov_format_mode": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "🏛️ 공공기관 표준 보고서 서식 준수",
    "question": "대한민국 정부·공공기관 표준 계층 체계(□/ㅇ/-/* 및 2x6 정보표)를 엄격히 준수해야 합니까?",
    "desc": "감사 및 결재에 즉시 사용 가능한 표준 양식으로 XML을 직조작할지 결정합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 대한민국 공공 표준 서식(휴먼명조, 계층 체계)을 완벽 준수해야 합니다",
        "subLabel": "HWPX 압축 XML 직접 조작 + 결재용 PDF 일괄 변환 파이프라인",
        "next": "q5_gov_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 기자단 배포용 표준 보도자료 및 붙임 행사표 조립이 주 목적입니다",
        "subLabel": "상단 엠블럼 + 보도시점 박스 + 2x6 부서표 표준 보도자료",
        "next": "q5_gov_ai_need"
      }
    ]
  },
  "q4_gov_audit_mode": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "🔍 감사 및 고지서 우편 발송 규격",
    "question": "우체국 표준 주소 라벨 스티커(바코드 포함) 출력 및 독촉장 자동 인쇄가 필요합니까?",
    "desc": "현장 영치 단속반용 명단 추출 및 우편 발송 라벨 PDF 자동 조립을 지원합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 우편 발송용 표준 주소 라벨 PDF 및 독촉 고지서 인쇄가 필요합니다",
        "subLabel": "우체국 e-그린우편 규격 매칭 + 고액 체납자 번호판 영치 리스트",
        "next": "q5_gov_audit_final"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 복지급여/보조금 중복수급 이상 데이터 감지가 최우선입니다",
        "subLabel": "세대원 교차 대사 + 부정수급 의심 위험도 스코어링",
        "next": "q5_gov_audit_final"
      }
    ]
  },
  "q4_python_gui_feature": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "💻 진행률 표시 및 비동기 스레딩",
    "question": "대용량 작업 중에도 창이 멈추지 않는(응답 없음 방지) 멀티스레딩 UI가 필요합니까?",
    "desc": "CustomTkinter 프로그레스 바와 백그라운드 워커 스레드를 결합할지 결정합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 응답 없음 없는 부드러운 진행률 바와 다크모드가 필수입니다",
        "subLabel": "Python threading + CustomTkinter 모던 테마",
        "next": "q5_desktop_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 간단하고 직관적인 단일 창 버튼 UI면 충분합니다",
        "subLabel": "가장 심플하고 가벼운 파이썬 단독 툴킷",
        "next": "q5_desktop_ai_need"
      }
    ]
  },
  "q4_electron_feature": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "🖥️ 운영체제 네이티브 기능 연동",
    "question": "시스템 트레이(시계 옆 아이콘) 상주 및 글로벌 단축키 제어가 필요합니까?",
    "desc": "백그라운드에서 항상 대기하다가 단축키 하나로 팝업창을 띄우는 기능입니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 트레이 아이콘 상주 및 글로벌 단축키로 즉시 띄우기 원합니다",
        "subLabel": "Electron Tray & globalShortcut API 완벽 지원",
        "next": "q5_desktop_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 일반 데스크톱 프로그램 창 형태로 실행되면 됩니다",
        "subLabel": "윈도우/맥 겸용 크로스플랫폼 패키징",
        "next": "q5_desktop_ai_need"
      }
    ]
  },
  "q4_tauri_feature": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "🦀 초경량 바이너리 최적화",
    "question": "설치 파일 10MB 미만, RAM 30MB 이하의 극강의 리소스 절약이 목표입니까?",
    "desc": "Rust의 무결점 메모리 관리와 웹뷰2를 결합한 차세대 데스크톱 빌드입니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 저사양 PC에서도 날아다니는 10MB 미만 초경량 앱을 원합니다",
        "subLabel": "Rust Tauri + 초고속 네이티브 성능",
        "next": "q5_desktop_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 일반적인 성능의 네이티브 데스크톱 빌드면 됩니다",
        "subLabel": "안정적인 Rust 백엔드 + HTML 프론트엔드",
        "next": "q5_desktop_ai_need"
      }
    ]
  },
  "q4_pyside_feature": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "⚙️ 초고속 실시간 차트 플로팅",
    "question": "초당 수만 개의 시계열 데이터를 렉 없이 실시간으로 그래프로 그려내야 합니까?",
    "desc": "PyQtGraph 고속 렌더링 엔진과 도킹 윈도우 패널을 결합할지 결정합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 대용량 센서/계측 데이터 60FPS 실시간 시각화가 필요합니다",
        "subLabel": "PySide6 + PyQtGraph GPU 가속 렌더링",
        "next": "q5_desktop_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 정적인 데이터베이스 관리 및 다중 탭 입력 화면이면 됩니다",
        "subLabel": "Qt 표준 폼 레이아웃 및 SQLite 연동",
        "next": "q5_desktop_ai_need"
      }
    ]
  },
  "q4_firebase_frontend": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "🎨 프론트엔드 개발 난이도 선택",
    "question": "복잡한 npm 빌드 없이, 단일 index.html 파일 하나로 프론트엔드를 완성하겠습니까?",
    "desc": "바닐라 JS를 쓰면 러닝커브 없이 즉시 배포 가능하며, 모던 프레임워크를 쓰면 유지보수가 쉽습니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 빌드 없는 바닐라 HTML/CSS/JS로 가장 쉽게 만들겠습니다 (강추)",
        "subLabel": "초보자 맞춤: 브라우저에서 바로 열리고 Firebase Hosting 1초 배포",
        "next": "q5_web_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - React 또는 Vite 컴포넌트 프레임워크를 사용하겠습니다",
        "subLabel": "모던 웹 개발 표준 컴포넌트 아키텍처",
        "next": "q5_web_ai_need"
      }
    ]
  },
  "q4_supabase_stack": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "⚡ 풀스택 프레임워크 선택",
    "question": "Next.js 15 서버 사이드 렌더링(SSR) 및 Vercel 배포를 함께 결합하겠습니까?",
    "desc": "SEO 최적화와 초고속 초기 로딩을 보장하는 기업용 웹 아키텍처입니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - Next.js 15 + Supabase 풀스택으로 완성하겠습니다",
        "subLabel": "Vercel 원클릭 배포 + 완벽한 SSR 지원",
        "next": "q5_web_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 가벼운 Vite React SPA + Supabase로 가겠습니다",
        "subLabel": "빠른 개발 속도와 단순한 호스팅 아키텍처",
        "next": "q5_web_ai_need"
      }
    ]
  },
  "q4_cloudflare_stack": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "☁️ Cloudflare 엣지 기능 확장",
    "question": "서버리스 D1 데이터베이스와 함께 대용량 파일 저장소(R2)까지 연동하겠습니까?",
    "desc": "AWS S3 대비 송신 비용(Egress)이 0원인 Cloudflare R2 스토리지 연동입니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - D1 데이터베이스 + R2 스토리지까지 풀 패키지로 구성합니다",
        "subLabel": "비용 0원 무제한 트래픽 글로벌 엣지 풀스택",
        "next": "q5_web_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - Pages + D1 SQLite DB만으로 가볍게 시작합니다",
        "subLabel": "0ms 응답 속도의 초고속 서버리스 웹사이트",
        "next": "q5_web_ai_need"
      }
    ]
  },
  "q4_survey_stack": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "📈 실시간 차트 공개 및 중복 방지",
    "question": "설문 응답자가 제출 즉시 실시간 통계 차트를 열람할 수 있도록 공개하겠습니까?",
    "desc": "IP 중복 투표 방지 및 실시간 도넛/막대 차트 애니메이션이 적용됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 응답 즉시 실시간 애니메이션 차트로 결과를 공개합니다",
        "subLabel": "Chart.js 인터랙티브 차트 + 실시간 집계",
        "next": "q5_web_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 관리자만 결과를 확인하고 엑셀로 다운로드합니다",
        "subLabel": "비공개 안전 설문 + 관리자 전용 대시보드",
        "next": "q5_web_ai_need"
      }
    ]
  },
  "q4_macro_bookmarklet_type": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "⚡ 북마클릿 매크로 동작 방식",
    "question": "웹 화면의 표 데이터를 클릭 한 번에 엑셀 클립보드 형태로 자동 복사해야 합니까?",
    "desc": "클립보드 복사 후 엑셀에서 바로 Ctrl+V 하면 줄바꿈과 탭이 완벽히 분리됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 엑셀에 바로 붙여넣는 클립보드 원클릭 복사가 필요합니다",
        "subLabel": "navigator.clipboard 연동 + 세련된 완료 토스트 팝업",
        "next": "q5_macro_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 웹페이지 반복 폼 자동 입력 및 클릭 매크로가 목적입니다",
        "subLabel": "querySelector 폼 자동 채우기 및 제출 매크로",
        "next": "q5_macro_ai_need"
      }
    ]
  },
  "q4_macro_crawler_type": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "🕷️ 크롤러 세션 유지 및 로그인 우회",
    "question": "2단계 인증이나 캡차(CAPTCHA), 세션 유지가 필요한 복잡한 사이트입니까?",
    "desc": "Playwright 헤드리스 브라우저로 실제 사람처럼 마우스를 움직이고 쿠키를 저장합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 로그인 세션 저장 및 화면 캡처, 차단 우회가 필수입니다",
        "subLabel": "Playwright 저장된 인증 상태(StorageState) 재사용",
        "next": "q5_macro_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 공개된 페이지의 대량 데이터 고속 텍스트 스크래핑입니다",
        "subLabel": "병렬 요청을 통한 초고속 데이터 수집",
        "next": "q5_macro_ai_need"
      }
    ]
  },
  "q4_macro_selenium_type": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "🏛️ 보안 프로그램 키보드/마우스 제어",
    "question": "키보드 보안 프로그램이나 액티브X로 인해 브라우저 입력이 차단되는 환경입니까?",
    "desc": "PyAutoGUI 하드웨어 레벨 마우스/키보드 제어 결합 여부를 결정합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 키보드 보안 우회를 위한 OS 레벨 마우스/키보드 매크로 결합",
        "subLabel": "Selenium + PyAutoGUI 강력한 하드웨어 우회",
        "next": "q5_macro_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 일반적인 브라우저 DOM 클릭 및 폼 입력이면 됩니다",
        "subLabel": "안정적인 명시적 대기(Explicit Wait) 셀레니움 봇",
        "next": "q5_macro_ai_need"
      }
    ]
  },
  "q4_macro_mcp_type": {
    "step": "4단계 / 5",
    "progress": 80,
    "type": "yn",
    "title": "🔌 MCP 도구 실행 권한 범위",
    "question": "AI 에이전트에게 내 PC 로컬 파일 수정 및 사내 DB 직접 쿼리 권한까지 주겠습니까?",
    "desc": "Model Context Protocol을 이용해 AI가 자연어 명령만으로 실제 DB와 파일을 다루게 합니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 로컬 파일 CRUD 및 사내 DB 조회/수정 권한을 부여합니다",
        "subLabel": "Claude Code / Antigravity 풀 파워 MCP 도구 세트",
        "next": "q5_macro_ai_need"
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 읽기 전용(Read-only) 안전 조회 도구로만 제한합니다",
        "subLabel": "보안성을 높인 안전한 사내 데이터 분석 에이전트",
        "next": "q5_macro_ai_need"
      }
    ]
  },
  "q5_excel_ai_need": {
    "step": "5단계 / 5",
    "progress": 100,
    "type": "yn",
    "title": "🤖 최신 AI 지능형 분석 기능 결합",
    "question": "엑셀 데이터 정리 결과에 대해 AI가 이상치를 감지하고 분석 보고서를 자동 작성하게 하겠습니까?",
    "desc": "마지막 5단계 질문입니다! 선택 시 최적의 추천 프로젝트 조합 덱(4선)이 즉시 완성됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - AI 이상치 진단 & 자연어 인사이트 요약 기능 결합 (강추)",
        "subLabel": "단순 병합을 넘어 경영진 보고용 코멘트까지 한 번에 자동 생성",
        "comboDeckTitle": "📊 [5단계 분석 완료] 엑셀 대량 병합 & AI 데이터 분석 추천 조합 (4선)",
        "cards": [
          "office-excel-merge",
          "desktop-customtkinter-exe",
          "agent-gemini-multimodal",
          "gov-hwpx-automation"
        ]
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - AI 없이 100% 규칙 기반의 초고속 무오차 자동화 툴킷",
        "subLabel": "Pandas 기반 빛의 속도 처리 + 원클릭 .exe 독립 프로그램",
        "comboDeckTitle": "📊 [5단계 분석 완료] 순수 초고속 엑셀 자동화 독립 프로그램 조합 (4선)",
        "cards": [
          "office-excel-merge",
          "desktop-customtkinter-exe",
          "office-pdf-toolkit",
          "office-email-alert"
        ]
      }
    ]
  },
  "q5_pdf_ai_need": {
    "step": "5단계 / 5",
    "progress": 100,
    "type": "yn",
    "title": "🤖 최신 AI OCR & 멀티모달 분석 결합",
    "question": "스캔된 비정형 PDF 문서나 복잡한 계약서를 AI(Gemini 2.0)가 직접 읽고 요약하게 하겠습니까?",
    "desc": "마지막 5단계 질문입니다! 선택 시 최적의 추천 프로젝트 조합 덱(4선)이 즉시 완성됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - Gemini 2.0 멀티모달 AI로 1,000페이지 문서 심층 분석 결합",
        "subLabel": "표 데이터 추출 + AI 계약서 독소조항 자동 스크리닝",
        "comboDeckTitle": "📑 [5단계 분석 완료] AI 문서 분석 & PDF 정밀 파싱 추천 조합 (4선)",
        "cards": [
          "office-pdf-toolkit",
          "agent-gemini-multimodal",
          "desktop-customtkinter-exe",
          "office-excel-merge"
        ]
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - PyMuPDF 기반 100% 로컬 오프라인 문서 분리 & 표 추출",
        "subLabel": "외부 유출 0% 보장의 완전 격리형 오프라인 PDF 툴킷",
        "comboDeckTitle": "📑 [5단계 분석 완료] 100% 폐쇄망 오프라인 PDF 툴킷 추천 조합 (4선)",
        "cards": [
          "office-pdf-toolkit",
          "desktop-customtkinter-exe",
          "office-excel-merge",
          "gov-hwpx-automation"
        ]
      }
    ]
  },
  "q5_gov_ai_need": {
    "step": "5단계 / 5",
    "progress": 100,
    "type": "yn",
    "title": "🤖 공공 규정 검토 로컬 AI 결합",
    "question": "인터넷 없는 폐쇄망 PC에서도 돌아가는 로컬 AI(Ollama) 법령/조례 자문 기능을 붙이겠습니까?",
    "desc": "마지막 5단계 질문입니다! 선택 시 최적의 추천 프로젝트 조합 덱(4선)이 즉시 완성됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 온디바이스 로컬 AI 기반 공공 규정 검토 & HWPX 자동작성 결합",
        "subLabel": "인터넷 없이 PC 내부에서 동작하는 최고 보안 AI 행정 시스템",
        "comboDeckTitle": "🏛️ [5단계 분석 완료] 폐쇄망 로컬 AI & 공공 보고서 생성 추천 조합 (4선)",
        "cards": [
          "gov-local-llm-rag",
          "gov-hwpx-automation",
          "gov-press-release-hwpx",
          "desktop-customtkinter-exe"
        ]
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 표준 서식 HWPX 압축 XML 정밀 조립 및 보도자료 생성",
        "subLabel": "□/ㅇ/-/* 계층 구조와 2x6 부서 정보표 100% 일치 서식 생성기",
        "comboDeckTitle": "🏛️ [5단계 분석 완료] 공공 표준 한글(HWPX) 자동 조립 추천 조합 (4선)",
        "cards": [
          "gov-hwpx-automation",
          "gov-press-release-hwpx",
          "office-pdf-toolkit",
          "desktop-customtkinter-exe"
        ]
      }
    ]
  },
  "q5_gov_audit_final": {
    "step": "5단계 / 5",
    "progress": 100,
    "type": "yn",
    "title": "🤖 감사 결과 AI 자동 보고서 작성",
    "question": "이상 탐지 및 체납 통계 분석 결과를 AI가 감사원/의회 제출용 소명 보고서로 자동 작성하게 하겠습니까?",
    "desc": "마지막 5단계 질문입니다! 선택 시 최적의 추천 프로젝트 조합 덱(4선)이 즉시 완성됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - AI가 부정수급 유형 분석 및 조치 계획 보고서 초안까지 자동 완성",
        "subLabel": "이상 탐지 알고리즘 + 로컬/클라우드 AI 행정 보고서 결합",
        "comboDeckTitle": "🔍 [5단계 분석 완료] 공공 보조금·체납 이상 탐지 & 지능형 보고서 조합 (4선)",
        "cards": [
          "gov-subsidy-checker",
          "gov-tax-delinquency",
          "gov-hwpx-automation",
          "agent-gemini-multimodal"
        ]
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 엑셀 및 표준 라벨 PDF 출력 중심의 순수 실무 도구",
        "subLabel": "오차 없는 수학적 교차 대사 + 우체국 규격 라벨 출력",
        "comboDeckTitle": "🧾 [5단계 분석 완료] 공공 세무·감사 실무 자동화 추천 조합 (4선)",
        "cards": [
          "gov-subsidy-checker",
          "gov-tax-delinquency",
          "office-excel-merge",
          "desktop-customtkinter-exe"
        ]
      }
    ]
  },
  "q5_desktop_ai_need": {
    "step": "5단계 / 5",
    "progress": 100,
    "type": "yn",
    "title": "🤖 데스크톱 앱 내 AI 음성/비전/텍스트 기능",
    "question": "만드실 PC 프로그램 안에 최신 생성형 AI 코파일럿 기능을 탑재하겠습니까?",
    "desc": "마지막 5단계 질문입니다! 선택 시 최적의 추천 프로젝트 조합 덱(4선)이 즉시 완성됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - 대화형 AI 챗봇 및 자동 문서 요약 코파일럿 탑재",
        "subLabel": "CustomTkinter/Electron UI + Gemini 2.0 실시간 스트리밍 API",
        "comboDeckTitle": "💻 [5단계 분석 완료] AI 코파일럿 탑재 모던 데스크톱 프로그램 조합 (4선)",
        "cards": [
          "desktop-customtkinter-exe",
          "agent-gemini-multimodal",
          "desktop-electron-cross",
          "desktop-tauri-fast"
        ]
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 가볍고 빠른 단독 유틸리티 프로그램 (.exe)",
        "subLabel": "파이썬 안 깔린 PC에서도 더블클릭 실행되는 모던 다크모드 앱",
        "comboDeckTitle": "💻 [5단계 분석 완료] 고성능 경량 독립 실행 프로그램 추천 조합 (4선)",
        "cards": [
          "desktop-customtkinter-exe",
          "desktop-tauri-fast",
          "desktop-electron-cross",
          "desktop-pyside-qt"
        ]
      }
    ]
  },
  "q5_web_ai_need": {
    "step": "5단계 / 5",
    "progress": 100,
    "type": "yn",
    "title": "🤖 웹사이트 내 실시간 AI 멀티모달 연동",
    "question": "웹 서비스에 방문자가 파일(PDF/이미지)을 올리고 대화하는 Gemini AI를 함께 붙이겠습니까?",
    "desc": "마지막 5단계 질문입니다! 선택 시 최적의 추천 프로젝트 조합 덱(4선)이 즉시 완성됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - Gemini 2.0 실시간 스트리밍 챗봇 & 멀티모달 분석 결합",
        "subLabel": "Firebase 호스팅 + Firestore 실시간 DB + Gemini 대화형 AI 완벽 풀세트",
        "comboDeckTitle": "🌐 [5단계 분석 완료] Firebase 클라우드 + Gemini 멀티모달 AI 풀스택 (4선)",
        "cards": [
          "web-firebase-fullstack",
          "agent-gemini-multimodal",
          "web-supabase-react",
          "web-cloudflare-pages"
        ]
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 구글 로그인과 실시간 데이터 공유 게시판에 집중",
        "subLabel": "초보자도 10분 만에 배포 가능한 서버리스 클라우드 웹 앱",
        "comboDeckTitle": "🌐 [5단계 분석 완료] 서버리스 실시간 클라우드 웹 서비스 추천 조합 (4선)",
        "cards": [
          "web-firebase-fullstack",
          "web-supabase-react",
          "web-cloudflare-pages",
          "web-survey-analytics"
        ]
      }
    ]
  },
  "q5_macro_ai_need": {
    "step": "5단계 / 5",
    "progress": 100,
    "type": "yn",
    "title": "🤖 수집 데이터 AI 자동 정제 & 리포트",
    "question": "자동 수집된 방대한 웹 데이터나 작업 결과를 AI가 자동으로 요약/보고서로 만들게 하겠습니까?",
    "desc": "마지막 5단계 질문입니다! 선택 시 최적의 추천 프로젝트 조합 덱(4선)이 즉시 완성됩니다.",
    "options": [
      {
        "type": "yes",
        "badge": "YES (예)",
        "label": "🟢 예 (YES) - AI 에이전트(MCP/Gemini)가 데이터 분석 보고서까지 일괄 생성",
        "subLabel": "브라우저 자동화 + LLM 자동 요약 + 메신저 자동 알림 스마트 파이프라인",
        "comboDeckTitle": "⚡ [5단계 분석 완료] AI 에이전트 지능형 업무 자동화 추천 조합 (4선)",
        "cards": [
          "agent-mcp-server",
          "agent-browser-playwright",
          "office-bookmarklet-f12",
          "agent-rss-news-digest"
        ]
      },
      {
        "type": "no",
        "badge": "NO (아니오)",
        "label": "🔵 아니오 (NO) - 설치 없이 즐겨찾기 클릭 한 번으로 끝나는 고속 매크로",
        "subLabel": "웹 화면 데이터를 엑셀 클립보드로 즉시 복사하는 무설치형 자동화",
        "comboDeckTitle": "⚡ [5단계 분석 완료] 원클릭 무설치 브라우저 매크로 추천 조합 (4선)",
        "cards": [
          "office-bookmarklet-f12",
          "agent-browser-playwright",
          "agent-selenium-automation",
          "office-excel-merge"
        ]
      }
    ]
  }
};
