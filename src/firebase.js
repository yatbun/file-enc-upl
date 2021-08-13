// ----------------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------------
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
// ----------------------------------------------------------------------------

// Obtain firebase information from environment variables
const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export const store = app.firestore();
export const storage = app.storage();

export default app;
