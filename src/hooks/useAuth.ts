// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';

import { auth } from '@/firebase'; // Firebase Auth instance

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser); // Firebase Auth listener
        return () => unsubscribe();
    }, []);

    return user;
};
