// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCba-keUhu4ZsHSfHsj3PFxVEFUN9ruxN8",
  authDomain: "funcionario-kennedy.firebaseapp.com",
  projectId: "funcionario-kennedy",
  storageBucket: "funcionario-kennedy.firebasestorage.app",
  messagingSenderId: "374067722356",
  appId: "1:374067722356:web:dca14353c41a7bdb97b921",
  measurementId: "G-8W8B1JXFD9"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let analytics;

// Ensures Firebase is initialized only once
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

db = getFirestore(app);
storage = getStorage(app);

// Initialize Analytics if supported (runs only on client-side)
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, storage, analytics };

