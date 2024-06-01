// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-f0866.firebaseapp.com",
  projectId: "mern-estate-f0866",
  storageBucket: "mern-estate-f0866.appspot.com",
  messagingSenderId: "138254913100",
  appId: "1:138254913100:web:7865eb05a8b7193e6beee9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);