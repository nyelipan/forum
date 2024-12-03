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

// Toggle dark mode class on body
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
};

const Login: React.FC<LoginProps> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false); // Remember Me state
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);

            if (rememberMe) {
                // Optional: Set persistence for "Remember Me" (e.g., local persistence)
                // auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            }

            navigate('/home'); // Redirect to the home page after successful login
        } catch (err: any) {
            // Catch specific Firebase Auth errors
            const errorMessage =
                err.message ||
                'Failed to log in. Please check your credentials.';
            setError(errorMessage);
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

                    {/* Email Input */}
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

                    {/* Password Input */}
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

                    {/* Remember Me Checkbox */}
                    <div className='flex items-center'>
                        <Checkbox
                            id='remember-me'
                            onCheckedChange={(checked) =>
                                setRememberMe(!!checked)
                            }
                        />
                        <label
                            htmlFor='remember-me'
                            className='ml-2 block text-sm text-gray-900 dark:text-gray-300'
                        >
                            Remember Me
                        </label>
                    </div>

                    {/* Login Button */}
                    <Button type='submit' className='login-button'>
                        Login
                    </Button>
                </form>

                {/* Signup Redirect */}
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
