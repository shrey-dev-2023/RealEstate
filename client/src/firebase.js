// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtRTDazd8GVvZRN5ZdiTgr3EYnJthn9EM",
  authDomain: "realestate-93d83.firebaseapp.com",
  projectId: "realestate-93d83",
  storageBucket: "realestate-93d83.appspot.com",
  messagingSenderId: "888657580327",
  appId: "1:888657580327:web:e6cada4938c2c0e4911902",
  measurementId: "G-01DD6TK3EE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);