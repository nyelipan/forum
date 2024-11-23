import '../components/ui/login.css';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '../components/ui/button';
import { auth } from '../firebase';

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
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
