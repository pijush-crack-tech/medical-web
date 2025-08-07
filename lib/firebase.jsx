// Create a new file: lib/firebase.js
// This file connects our app to Firebase

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Your Firebase settings (like your app's ID card)
const firebaseConfig = {
  apiKey: "AIzaSyAd0z_CRojPf6Jjio7vzu_WKhovTISwO2M",
  authDomain: "medical-higher-study.firebaseapp.com",
  projectId: "medical-higher-study",
  storageBucket: "medical-higher-study.firebasestorage.app",
  messagingSenderId: "264959280799",
  appId: "1:264959280799:web:d0e7acd9cbd318318d04aa"
};

// Start Firebase
const app = initializeApp(firebaseConfig);

// Set up authentication (login system)
export const auth = getAuth(app);

// Set up Google login
export const googleProvider = new GoogleAuthProvider();

// Set up Facebook login
export const facebookProvider = new FacebookAuthProvider();

// This makes Google ask which account to use every time
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// This makes Facebook ask for email permission
facebookProvider.addScope('email');