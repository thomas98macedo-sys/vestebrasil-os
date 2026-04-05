import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";

// ╔══════════════════════════════════════════════════╗
// ║  THOMAS: COLE AQUI A SUA CONFIG DO FIREBASE     ║
// ║  (Passo a passo no README)                       ║
// ╚══════════════════════════════════════════════════╝
const firebaseConfig = {
  apiKey: "AIzaSyAQ15Zp01-cYsnvz7KzRi-EzZO2nghvgTA",
  authDomain: "vestebrasil-4521e.firebaseapp.com",
  projectId: "vestebrasil-4521e",
  storageBucket: "vestebrasil-4521e.firebasestorage.app",
  messagingSenderId: "225003532312",
  appId: "1:225003532312:web:9f9f9487c1d0f06e49d36d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Document reference - all shared data lives in one document
const DATA_DOC = doc(db, "vestebrasil", "shared_data");

// ─── REAL-TIME LISTENER ───
// Calls callback whenever ANY user changes data
export function subscribeToData(callback) {
  return onSnapshot(DATA_DOC, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      // First time - initialize with empty data
      callback(null);
    }
  }, (error) => {
    console.error("Firebase listener error:", error);
  });
}

// ─── SAVE DATA ───
// Merges changes (doesn't overwrite everything)
export async function saveData(updates) {
  try {
    await setDoc(DATA_DOC, updates, { merge: true });
  } catch (error) {
    console.error("Firebase save error:", error);
  }
}

// ─── LOAD DATA ───
export async function loadData() {
  try {
    const snapshot = await getDoc(DATA_DOC);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error("Firebase load error:", error);
    return null;
  }
}

export { db };
