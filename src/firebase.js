import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config from console.firebase.google.com
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "auracord.firebaseapp.com",
    projectId: "auracord",
    storageBucket: "auracord.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
