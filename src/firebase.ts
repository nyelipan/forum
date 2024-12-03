// firebase.ts - This is where Firebase is initialized and exports are set up

import { initializeApp } from 'firebase/app';
import {
	browserLocalPersistence,
	getAuth,
	setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAoKL6R4YrCR2qLx9B-ABrF1tKIYuTiIAg',
    authDomain: 'project-testing-322e0.firebaseapp.com',
    projectId: 'project-testing-322e0',
    storageBucket: 'project-testing-322e0.firebasestorage.app',
    messagingSenderId: '913760217340',
    appId: '1:913760217340:web:ced9725617f3c56438cf79',
    measurementId: 'G-GXPF8GN6JB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase authentication and Firestore database
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
await setPersistence(auth, browserLocalPersistence);
