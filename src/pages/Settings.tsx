import { useState } from 'react';
import { FaCamera, FaSave } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import Sidebar from '@/Sidebar/Sidebar';
import { Switch } from '@headlessui/react'; // Using Headless UI for toggles

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState(false);

    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const handleSaveSettings = () => {
        // Logic to save the settings (could be an API call or Firestore update)
        console.log('Saving settings:', {
            notifications,
            profilePicture,
        });
    };

    // Function to handle profile picture upload
    const handleProfilePictureChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.files) {
            setProfilePicture(event.target.files[0]);
        }
    };

    return (
        <>
            <Sidebar />
            <div className='flex h-screen'>
                {/* Sidebar Panel */}
                <div className='w-full bg-gray-800 text-white p-6'>
                    <h1 className='text-3xl font-semibold mb-6 text-center'>
                        Profile Settings
                    </h1>

                    {/* Profile Picture Section */}
                    <section className='flex flex-col items-center mb-8'>
                        <div className='relative'>
                            <img
                                src={
                                    profilePicture
                                        ? URL.createObjectURL(profilePicture)
                                        : 'default-avatar.jpg'
                                }
                                alt='Profile'
                                className='w-32 h-32 rounded-full border-4 border-gray-300'
                            />
                            <label
                                htmlFor='profile-picture'
                                className='absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer'
                            >
                                <FaCamera />
                            </label>
                            <input
                                type='file'
                                id='profile-picture'
                                onChange={handleProfilePictureChange}
                                className='hidden'
                            />
                        </div>
                        <p className='text-sm text-gray-500 mt-2'>
                            Click to change your profile picture
                        </p>
                    </section>

                    {/* Notifications Section */}
                    <section className='mb-8'>
                        <h2 className='text-xl font-semibold mb-4'>
                            Notifications
                        </h2>
                        <div className='flex items-center justify-between mb-4'>
                            <span>Email Notifications</span>
                            <Switch
                                checked={notifications}
                                onChange={setNotifications}
                                className={`${
                                    notifications
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span
                                    className={`${
                                        notifications
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                            </Switch>
                        </div>
                    </section>

                    {/* Save Button */}
                    <div className='flex justify-center'>
                        <Button
                            className='bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-full flex items-center'
                            onClick={handleSaveSettings}
                        >
                            <FaSave className='mr-3' /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
