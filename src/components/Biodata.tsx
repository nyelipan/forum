// src/pages/Home.tsx or src/components/Home.tsx
import React from 'react';

import AvatarDemo from '@/components/AvatarDemo'; // Import the AvatarDemo component

import { CarouselDemo } from './CarouselDemo';

const Biodata = () => {
    return (
        <div className='w-full h-screen'>
            <header className='flex justify-between items-center p-4 bg-gray-800'>
                {/* Logo on the left */}
                <div className='text-white font-bold text-lg'>
                    <a href='/'>My Website</a>
                </div>

                {/* Avatar on the right - AvatarDemo as navigation menu */}
                <div className='flex items-center z-10'>
                    <AvatarDemo /> {/* Using the AvatarDemo component here */}
                </div>
            </header>
            {/* Main content of the homepage */}
            <main>
                <h1 className='text-3xl'>Welcome to Your Page</h1>
            </main>{' '}
            <div className='flex items-center z-10'>
                {/* Center the Carousel */}
                <div className='flex justify-center w-full'>
                    <CarouselDemo />
                </div>
            </div>
        </div>
    );
};

export default Biodata;
