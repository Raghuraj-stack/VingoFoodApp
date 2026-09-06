// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingofoodapp-23243.firebaseapp.com",
  projectId: "vingofoodapp-23243",
  storageBucket: "vingofoodapp-23243.firebasestorage.app",
  messagingSenderId: "205039991914",
  appId: "1:205039991914:web:1ba7509141fb1492761e13"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth()


