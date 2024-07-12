import {initializeApp, getApps } from "@firebase/app";

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    //measurementId: process.env.MEASUREMENT_ID_FB_,
};

// Initialize Firebase
let firebaseClient = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebaseClient;