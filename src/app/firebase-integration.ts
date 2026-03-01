
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1mqawI-YL57DgIiTQtbAK97TBKpAEbCg",
  authDomain: "cts-ai-master.firebaseapp.com",
  projectId: "cts-ai-master",
  storageBucket: "cts-ai-master.firebasestorage.app",
  messagingSenderId: "643125743507",
  appId: "1:643125743507:web:8b468fd48b641bf539e266"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

