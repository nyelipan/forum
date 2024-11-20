import { useHistory } from 'react-router-dom'; // Or useNextRouter if you're using Next.js

import { Button } from '@/components/ui/button'; // Your button component or use any button
import { auth } from '@/firebase'; // Make sure to import Firebase auth

const Header = () => {
    const history = useHistory(); // If you're using React Router

    const handleLogout = async () => {
        try {
            await auth.signOut();
            // Redirect user after logout (e.g., back to login page)
            history.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className='relative w-full p-4'>
            {/* Your header content (like title, logo, etc.) */}

            {/* Logout button positioned at the top right */}
            <Button
                onClick={handleLogout}
                className='absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
            >
                Logout
            </Button>
        </header>
    );
};

export default Header;
