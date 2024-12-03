import { useState } from 'react';
import { FaSave } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Switch } from '@headlessui/react'; // Using Headless UI for toggles

const Settings: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');

    const handleSaveSettings = () => {
        // Logic to save the settings (could be an API call or Firestore update)
        console.log('Saving settings:', {
            userName,
            email,
            darkMode,
            notifications,
        });
    };

    return (
        <div className='p-4 max-w-3xl mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>Settings</h1>

            {/* Profile Section */}
            <section className='mb-8'>
                <h2 className='text-xl font-semibold mb-2'>Profile Settings</h2>
                <div className='mb-4'>
                    <label className='block text-gray-700'>User Name</label>
                    <input
                        type='text'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded mt-1'
                        placeholder='Enter your user name'
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700'>Email</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded mt-1'
                        placeholder='Enter your email'
                    />
                </div>
            </section>

            {/* Appearance Section */}
            <section className='mb-8'>
                <h2 className='text-xl font-semibold mb-2'>Appearance</h2>
                <div className='flex items-center justify-between mb-4'>
                    <span>Dark Mode</span>
                    <Switch
                        checked={darkMode}
                        onChange={setDarkMode}
                        className={`${
                            darkMode ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                        <span
                            className={`${
                                darkMode ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </div>
            </section>

            {/* Notifications Section */}
            <section className='mb-8'>
                <h2 className='text-xl font-semibold mb-2'>Notifications</h2>
                <div className='flex items-center justify-between mb-4'>
                    <span>Email Notifications</span>
                    <Switch
                        checked={notifications}
                        onChange={setNotifications}
                        className={`${
                            notifications ? 'bg-blue-600' : 'bg-gray-200'
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
            <Button
                className='bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded flex items-center'
                onClick={handleSaveSettings}
            >
                <FaSave className='mr-2' /> Save Settings
            </Button>
        </div>
    );
};

export default Settings;
