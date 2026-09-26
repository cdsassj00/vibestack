/**
 * AI 과정 구성 설정 — Firebase AI Logic(Gemini Developer API)
 * 웹 설정값은 공개용 식별자라 코드에 둔다. Gemini API 키는 Firebase가 서버에서 관리하고 브라우저로 내려오지 않는다.
 * 콘솔 준비: Firebase 콘솔 > AI Logic > 시작하기 > Gemini Developer API 선택.
 * App Check(reCAPTCHA Enterprise)를 켜면 recaptchaSiteKey에 사이트 키를 넣는다. 비워 두면 App Check 없이 호출한다.
 */
export const AI_CONFIG = {
  sdk: '12.19.0',
  model: 'gemini-3.5-flash',
  recaptchaSiteKey: '',
  firebase: {
    apiKey: 'AIzaSyCjjQxWSN7Gjf8r6728tIKUNi7VUlOW_mE',
    authDomain: 'ag-firebase-board-2026.firebaseapp.com',
    projectId: 'ag-firebase-board-2026',
    storageBucket: 'ag-firebase-board-2026.firebasestorage.app',
    messagingSenderId: '599802670094',
    appId: '1:599802670094:web:7d8424e7b78975cfd5e05f'
  }
};
