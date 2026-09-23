# 🔥 Firebase Cloud Firestore & Auth 커뮤니티 게시판

Firebase 백엔드(Cloud Firestore, Firebase Authentication)와 Vanilla HTML, CSS, JavaScript로 제작된 모던 글래스모피즘(Glassmorphism) 커뮤니티 게시판입니다.

---

## 🌟 주요 기능

1. **Firebase Cloud Firestore 실시간 연동**
   - 게시글 CRUD (작성, 조회, 수정, 삭제)
   - 카테고리 필터링 (전체, 기술, 정보, 질문, 자유, 공지)
   - 실시간 다중 조건 검색 (제목, 본문, 작성자, #태그) 및 4단 정렬 (최신순, 조회순, 좋아요순, 댓글순)
   - 실시간 조회수 카운팅, 좋아요(Heart), 댓글 등록/삭제

2. **Firebase Authentication (사용자 인증)**
   - **Google 원클릭 소셜 로그인**
   - **이메일/비밀번호 회원가입 및 로그인**
   - **익명(게스트) 둘러보기 로그인**
   - 본인 작성 게시글 수정/삭제 권한 보호 및 사용자 아바타/프로필 뱃지 표시

3. **듀얼 모드 (데모 모드 & 실서버 모드)**
   - Firebase 설정 전에도 모든 UI와 기능을 브라우저 로컬 스토리지로 완벽하게 체험 가능
   - 상단 **[⚙️ Firebase 설정]** 버튼을 통해 본인의 Firebase Config를 입력하면 실시간으로 Cloud Firestore 및 Auth 서버로 전환

4. **프리미엄 UI/UX & 테마 시스템**
   - 앰비언트 글로우(Ambient Glow) 배경 애니메이션과 글래스모피즘 디자인
   - 다크 모드 / 라이트 모드 원클릭 토글
   - 반응형 그리드 & 리스트 뷰 전환

---

## 💻 Firebase CLI 안내

### 1. 현재 PC에 Firebase CLI 설치 여부
- 현재 시스템 PATH에 `firebase` 전역 명령어가 바로 등록되어 있지 않을 수 있습니다.
- 아래 명령어로 간편하게 전역 설치하거나 `npx`로 즉시 실행할 수 있습니다.

### 2. Firebase CLI 설치 및 로그인 명령어
```bash
# 1. Firebase CLI 전역 설치 (npm 필요)
npm install -g firebase-tools

# 또는 설치 없이 npx로 1회성 실행
npx firebase-tools --version

# 2. Firebase 구글 계정 로그인
firebase login

# 3. 프로젝트 초기화 (Hosting 및 Firestore)
firebase init

# 4. 정적 웹사이트 무료 호스팅 배포
firebase deploy
```

---

## 🚀 Firebase Console 프로젝트 연동 가이드

1. **[Firebase Console](https://console.firebase.google.com/)** 접속 후 **[프로젝트 추가]**
2. **Firestore Database 생성**:
   - 좌측 메뉴 > **Firestore Database** > **데이터베이스 만들기** (테스트 모드로 시작)
3. **Firebase Authentication 활성화**:
   - 좌측 메뉴 > **Authentication** > **시작하기**
   - **Google** 공급업체 사용 설정
   - **이메일/비밀번호** 공급업체 사용 설정
   - **익명(Anonymous)** 공급업체 사용 설정 (선택 사항)
4. **웹 앱 등록 및 설정값 복사**:
   - 프로젝트 개요 옆의 ⚙️ 설정 아이콘 > **프로젝트 설정** > 하단 **내 앱**에서 `</>` (웹) 아이콘 클릭
   - `firebaseConfig` 객체 복사
5. 브라우저에서 게시판 상단의 **[⚙️ Firebase 설정]** 버튼을 누르고 복사한 값을 붙여넣으면 즉시 실시간 연결 완료!

---

## 📂 파일 구조

- `index.html` : 웹 애플리케이션 메인 마크업 & 모달 UI
- `style.css` : 글래스모피즘 디자인 시스템 & 반응형 스타일시트
- `firebase-config.js` : Firebase v10 Modular SDK CDN 동적 로더 및 설정 관리자
- `app.js` : Firestore CRUD, Firebase Auth, 검색/정렬, 상태 관리 로직
- `firebase.json` : Firebase Hosting 배포 설정 파일
- `firestore.rules` : Firestore 데이터베이스 보안 규칙
