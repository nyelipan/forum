import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className='bg-gray-800 p-4'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link to='/' className='text-white text-2xl font-bold'>
                    KnowledgeHub
                </Link>
                <div className='flex space-x-6'>
                    <Link to='/home' className='text-white'>
                        Home
                    </Link>
                    <Link to='/forum' className='text-white'>
                        Forum
                    </Link>
                    <Link to='/profile' className='text-white'>
                        Profile
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
