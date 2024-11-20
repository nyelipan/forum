import './ui/login.css';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Checkbox } from '@/components/ui/checkbox';

import { auth } from '../firebase';
import { Button } from './ui/button';

interface LoginProps {
    onLogin: () => void;
}

// Example using a dark mode toggle (pseudo-code)
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
};

const Login: React.FC<LoginProps> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Trigger the onLogin event
            navigate('/home'); // Redirect to the home page after successful login
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div className='login-container'>
            <div className='login-panel'>
                <form onSubmit={handleLogin} className='space-y-4'>
                    <h2 className='login-h2'>Login</h2>
                    {error && (
                        <p className='text-red-500 text-center'>{error}</p>
                    )}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Email
                        </label>
                        <input
                            type='email'
                            placeholder='Email'
                            className='mt-1 block w-full p-3 border border-grey-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-grey-600 dark:text-white'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Password
                        </label>
                        <input
                            type='password'
                            placeholder='Password'
                            className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button type='submit' className='login-button'>
                        Login
                    </Button>
                </form>

                <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                    Don't have an account?
                </p>
                <Button
                    onClick={() => navigate('/signup')}
                    className='Signup-button'
                >
                    Sign up
                </Button>
            </div>
        </div>
    );
};

export default Login;
