/**
 * Firebase 설정 및 초기화 모듈
 * 프로젝트: ag-firebase-board-2026 (Antigravity Firebase Board)
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// 실제 생성된 Firebase 실서버 프로젝트 설정 객체
export const firebaseConfig = {
  apiKey: "AIzaSyCjjQxWSN7Gjf8r6728tIKUNi7VUlOW_mE",
  authDomain: "ag-firebase-board-2026.firebaseapp.com",
  projectId: "ag-firebase-board-2026",
  storageBucket: "ag-firebase-board-2026.firebasestorage.app",
  messagingSenderId: "599802670094",
  appId: "1:599802670094:web:7d8424e7b78975cfd5e05f"
};

// Firebase SDK 초기화
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
