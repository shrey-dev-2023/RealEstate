// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries




const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "estate-3c233.firebaseapp.com",
	projectId: "estate-3c233",
	storageBucket: "estate-3c233.appspot.com",
	messagingSenderId: "284851691288",
	appId: "1:284851691288:web:7488988ff2a7f461dc886d",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);