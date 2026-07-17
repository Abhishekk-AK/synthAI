// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "synthai-5a48d.firebaseapp.com",
  projectId: "synthai-5a48d",
  storageBucket: "synthai-5a48d.firebasestorage.app",
  messagingSenderId: "740534461157",
  appId: "1:740534461157:web:1f9e5b01c54807589f6a0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()