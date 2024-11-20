import { useEffect, useState } from 'react';

import { auth } from '../firebase'; // Firebase config

const Greeting = () => {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className='p-4'>
            {user ? (
                <h1 className='text-2xl font-bold'>
                    Hello, {user.displayName || 'User'}!
                </h1>
            ) : (
                <h1 className='text-2xl font-bold'>Hello Guest!</h1>
            )}
        </div>
    );
};

export default Greeting;
