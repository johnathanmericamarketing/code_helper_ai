// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzHJ_TTNcwSuGNGfMh1mJ_xVI1PcMhuE0",
  authDomain: "code-helper-studio.firebaseapp.com",
  projectId: "code-helper-studio",
  storageBucket: "code-helper-studio.firebasestorage.app",
  messagingSenderId: "502657160656",
  appId: "1:502657160656:web:658a88c5722c8ab28ed5d5",
  measurementId: "G-80R9E2P221",
  // Realtime Database URL — used for live AI progress & deploy streaming
  databaseURL: "https://code-helper-studio-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);          // Realtime Database — ephemeral state
export const functions = getFunctions(app, 'us-central1');
export const auth = getAuth(app);
