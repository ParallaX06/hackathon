// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  // Only connect to emulators once
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  
  if (!db._settings?.host?.includes('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
  
  if (!functions.customDomain) {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }
}

export default app;