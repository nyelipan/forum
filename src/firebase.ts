import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { db } from 'firebaseConfig';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
        try {
            const postDocRef = doc(db, 'posts', postId); // Ensure the collection name and ID are correct
            await deleteDoc(postDocRef);
            alert('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post: ', error);
            alert('Failed to delete post');
        }
    }
};

// Export Firebase authentication and Firestore database
export const auth = getAuth(app);
export const db = getFirestore(app);
