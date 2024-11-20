import { updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../firebase'; // Make sure this import is correct
import HomePage from './HomePage';

const SetNicknameForm = () => {
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const handleSetNickname = async () => {
        if (auth.currentUser) {
            try {
                await updateProfile(auth.currentUser, {
                    displayName: nickname,
                });
                alert('Nickname set successfully');
                navigate('/home');
            } catch (error) {
                console.error('Error setting nickname', error);
                alert('Error setting nickname');
            }
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSetNickname();
            }}
            className='p-4'
        >
            <h2 className='text-2xl font-bold mb-4'>Set Your Nickname</h2>
            <input
                type='text'
                placeholder='Enter your nickname'
                className='border p-2 w-full mb-2'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
            />
            <button
                type='submit'
                className='bg-blue-500 text-white py-2 px-4 rounded'
            >
                Submit
            </button>
        </form>
    );
};
export default SetNicknameForm;
