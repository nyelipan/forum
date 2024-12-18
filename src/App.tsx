import './App.css';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useNavigate,
} from 'react-router-dom';

import { ThemeProvider } from '@/components/theme-provider'; // Adjust the import path as necessary

import { ModeToggle } from './components/mode-toggle';
import SetNicknameForm from './components/SetNicknameForm';
import { auth } from './firebase'; // Ensure you're importing auth
import Biodata from './pages/Biodata';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Settings from './pages/Settings';
import SignUp from './pages/SignUp';
import Sidebar from './Sidebar/Sidebar';

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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
                <div className='flex'>
                    <div className='main-content'>
                        <Routes>
                            <Route path='/' element={<LoginPage />} />
                            <Route path='/signup' element={<SignUp />} />
                            <Route
                                path='/home'
                                element={
                                    isAuthenticated ? (
                                        <HomePage />
                                    ) : (
                                        <LoginPage />
                                    )
                                }
                            />
                            <Route
                                path='/nickname'
                                element={
                                    isAuthenticated ? (
                                        <SetNicknameForm />
                                    ) : (
                                        <LoginPage />
                                    )
                                }
                            />
                            <Route
                                path='/settings'
                                element={
                                    isAuthenticated ? (
                                        <Settings />
                                    ) : (
                                        <LoginPage />
                                    )
                                }
                            />
                            <Route
                                path='/biodata'
                                element={
                                    isAuthenticated ? (
                                        <Biodata />
                                    ) : (
                                        <LoginPage />
                                    )
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </ThemeProvider>
        </Router>
    );
};

export default App;
