// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8c0m48FB1ZvCY5YYKysPEIb38ZiNpvP8",
  authDomain: "bus-tracker-3e573.firebaseapp.com",
  databaseURL: "https://bus-tracker-3e573-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bus-tracker-3e573",
  storageBucket: "bus-tracker-3e573.firebasestorage.app",
  messagingSenderId: "387919592090",
  appId: "1:387919592090:web:e959d51c051cd0be90fd23",
  measurementId: "G-JLYY4LG0P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);