import '../components/ui/signup.css';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/button';
import Header from '../components/ui/Header';
import { Input } from '../components/ui/input';
import { auth, db } from '../firebase'; // Make sure Firestore db is imported

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = userCredential.user;

            // Correctly update the displayName
            await updateProfile(user, {
                displayName: nickname, // Use updateProfile from Firebase Auth
            });

            // Store user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                nickname: nickname, // Store the user's nickname
                createdAt: new Date(), // You can also store when the account was created
            });

            navigate('/home');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='signup-container'>
            <div className='signup-panel'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white text-center'>
                    Signup
                </h2>
                {error && (
                    <p className='text-red-500 text-center mb-4'>{error}</p>
                )}

                <Input
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='border border-gray-300 p-2 w-full mb-4 rounded-md'
                    required
                />

                <Input
                    type='password'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='border border-gray-300 p-2 w-full mb-4 rounded-md'
                    required
                />

                <Input
                    type='text'
                    placeholder='Enter your nickname'
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className='border border-gray-300 p-2 w-full mb-4 rounded-md'
                    required
                />

                <Button
                    onClick={handleSignUp}
                    className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md'
                >
                    Sign Up
                </Button>

                <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                    Don't have an account?
                    <Button
                        onClick={() => navigate('/')}
                        className='Signup-button'
                    >
                        Back
                    </Button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
