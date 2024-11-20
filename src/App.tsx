import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useNavigate,
} from 'react-router-dom';

import { ThemeProvider } from '@/components/theme-provider'; // Assuming this is the correct path

import ForumList from './components/ForumList';
import HomePage from './components/HomePage';
import Login from './components/Login';
import { ModeToggle } from './components/mode-toggle';
import SetNicknameForm from './components/SetNicknameForm';
import SignUp from './components/SignUp';
import { auth } from './firebase'; // Ensure you're importing auth

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home'); // Navigate to home after successful login
        } catch (err) {
            console.error('Login failed', err.message);
        }
    };

    return <Login onLogin={handleLogin} />;
};

const App = () => {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <Router>
                <div className='theme-toggle-container'>
                    <ModeToggle />
                </div>
                <Routes>
                    <Route path='/' element={<LoginPage />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/home' element={<HomePage />} />
                    <Route path='/nickname' element={<SetNicknameForm />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
