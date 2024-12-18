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

            // Handle remember me logic (optional persistence settings)
            if (rememberMe) {
                // auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            }

            navigate('/home'); // Redirect after login
        } catch (err: any) {
            const errorMessage =
                err.message ||
                'Failed to log in. Please check your credentials.';
            setError(errorMessage);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-panel'>
                <form onSubmit={handleLogin} className='space-y-6'>
                    <div className='logo-container'>
                        <img
                            src='images/logo.png'
                            alt='Logo'
                            className='logo'
                        />
                    </div>
                    <h2 className='login-h2'>Welcome Back,</h2>

                    {/* Error Message */}
                    {error && <p className='error-message'>{error}</p>}

                    {/* Email Input */}
                    <div>
                        <label className='form-label'>Email</label>
                        <input
                            type='email'
                            placeholder='Email'
                            className='input-field'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className='form-label'>Password</label>
                        <input
                            type='password'
                            placeholder='Password'
                            className='input-field'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Remember Me */}
                    <div className='flex items-center'>
                        <Checkbox
                            id='remember-me'
                            onCheckedChange={(checked) =>
                                setRememberMe(!!checked)
                            }
                        />
                        <label
                            htmlFor='remember-me'
                            className='remember-me-label'
                        >
                            Remember Me
                        </label>
                    </div>

                    {/* Login Button */}
                    <Button type='submit' className='login-button'>
                        Login
                    </Button>
                </form>

                {/* Signup Link */}
                <p className='signup-text'>
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/signup')}
                        className='signup-link'
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
