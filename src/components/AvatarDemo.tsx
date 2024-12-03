// src/components/AvatarDemo.tsx
'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/firebase'; // If using Firebase authentication

const AvatarDemo = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className='cursor-default'>
                    <AvatarImage
                        src='https://tse3.mm.bing.net/th/id/OIP.9OhVKKlwFGj9O2fbJWVNjgHaHa?w=172&h=180&c=7&r=0&o=5&pid=1.7'
                        alt='User Avatar'
                    />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => navigate('/Biodata')}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(handleLogout) => navigate('/')}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AvatarDemo;
