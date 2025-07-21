import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyAQA9um406WnbF88lR_o6gDG0fqzOGr1Zo",
  authDomain: "bmgh-78bbc.firebaseapp.com",
  projectId: "bmgh-78bbc",
  storageBucket: "bmgh-78bbc.firebasestorage.app",
  messagingSenderId: "314722937675",
  appId: "1:314722937675:web:101436f24bec23823416ce",
  measurementId: "G-8NTF6YBW7L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore

export { app, auth, analytics, db }; // ✅ Export db
