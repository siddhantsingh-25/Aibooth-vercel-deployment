// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC26w1jnX5FTcYPHmOIUDJ0VrtwKzaOi_w",
  authDomain: "aibooth-f3839.firebaseapp.com",
  projectId: "aibooth-f3839",
  storageBucket: "aibooth-f3839.appspot.com",
  messagingSenderId: "929443532",
  appId: "1:929443532:web:dd1f3e3ce3e72fd2415c69",
  measurementId: "G-2X1HPN7NKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
