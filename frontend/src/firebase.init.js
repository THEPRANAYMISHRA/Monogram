// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZKW0ArMFH953lrZuAAal8kqwM47dqUq8",
    authDomain: "twitter-9a704.firebaseapp.com",
    projectId: "twitter-9a704",
    storageBucket: "twitter-9a704.appspot.com",
    messagingSenderId: "531306582787",
    appId: "1:531306582787:web:36ec5f092eebc3384d4f36",
    measurementId: "G-C1E4TKCPP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);