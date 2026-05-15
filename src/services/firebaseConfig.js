/**
 * Firebase Configuration Template
 * ================================
 * Hướng dẫn setup:
 * 1. Tạo project Firebase tại https://console.firebase.google.com
 * 2. Bật Firestore Database (production mode)
 * 3. Bật Authentication → Email/Password
 * 4. Copy config từ Project Settings → Your apps → Web app
 * 5. Thay thế placeholder bên dưới bằng config thật
 * 6. Cài packages: npx expo install firebase
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3aeMeZCgCSjqucdhljGkD3rVSgu1rG2A",
  authDomain: "moodtracker-f8fb1.firebaseapp.com",
  projectId: "moodtracker-f8fb1",
  storageBucket: "moodtracker-f8fb1.firebasestorage.app",
  messagingSenderId: "695363971196",
  appId: "1:695363971196:web:a6f2f47d392ac4cf0481f9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
