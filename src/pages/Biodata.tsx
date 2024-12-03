import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';

import AvatarDemo from '@/components/AvatarDemo'; // Import the AvatarDemo component
import { Button } from '@/components/ui/button'; // ShadCN Button component
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card'; // ShadCN Card components
import { Input } from '@/components/ui/input'; // ShadCN Input component
import { db, storage } from '@/firebase'; // Import Firebase Firestore and Storage
import { useAuth } from '@/hooks/useAuth'; // Firebase auth hook for user authentication
import { Label } from '@radix-ui/react-dropdown-menu'; // ShadCN Label component

const Biodata = () => {
    const user = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [displayName, setDisplayName] = useState(
        user ? user.displayName : '',
    );
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(user?.photoURL || ''); // Store current avatar URL
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null); // Store the image file for upload

    // Load user data from Firestore
    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setDisplayName(userData.displayName || user.displayName);
                    setBio(userData.bio || '');
                    setAvatar(userData.avatar || user.photoURL); // Load avatar from Firestore
                }
                setLoading(false);
            }
        };

        loadUserData();
    }, [user]);

    // Handle profile picture upload
    const handleAvatarUpload = async () => {
        if (!imageFile) return;

        const storageRef = ref(storage, `avatars/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
                console.error('Error uploading avatar: ', error);
            },
            async () => {
                const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref(),
                );

                await updateDoc(doc(db, 'users', user.uid), {
                    avatar: downloadURL,
                });

                await updateProfile(user, {
                    photoURL: downloadURL,
                });

                setAvatar(downloadURL); // Set avatar in state to update UI
            },
        );
    };

    const handleSave = async () => {
        if (user) {
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    displayName,
                    bio,
                    avatar,
                });

                await updateProfile(user, {
                    displayName,
                });

                setEditMode(false); // Switch back to view mode
            } catch (error) {
                console.error('Error updating profile: ', error);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='w-full h-screen bg-gradient-to-b from-gray-100 to-gray-300'>
            {/* Header with Logo and Avatar */}
            <header className='flex justify-between items-center p-4 bg-gray-800 shadow-lg'>
                <div className='text-white font-bold text-lg'>
                    <a href='/home'>My Profile</a>
                </div>
                <AvatarDemo
                    avatarUrl={avatar || 'https://via.placeholder.com/150'}
                    onAvatarClick={handleAvatarUpload}
                />
            </header>

            {/* Main Content */}
            <main className='p-4'>
                <div className='max-w-4xl mx-auto'>
                    {/* Profile Section */}
                    <Card className='shadow-lg'>
                        <CardHeader className='p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white'>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <h1 className='text-2xl font-bold'>
                                        {editMode
                                            ? 'Edit Your Profile'
                                            : `Welcome, ${displayName}`}
                                    </h1>
                                    {!editMode && (
                                        <p className='text-sm text-white/90'>
                                            Email:{' '}
                                            {user
                                                ? user.email
                                                : 'guest@example.com'}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant='secondary'
                                    onClick={() => setEditMode(!editMode)}
                                >
                                    {editMode ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className='p-6'>
                            {editMode ? (
                                <div className='space-y-4'>
                                    <div>
                                        <Label htmlFor='displayName'>
                                            Display Name
                                        </Label>
                                        <Input
                                            id='displayName'
                                            value={displayName}
                                            onChange={(e) =>
                                                setDisplayName(e.target.value)
                                            }
                                            className='w-full mt-1'
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='bio'>Bio</Label>
                                        <Input
                                            id='bio'
                                            value={bio}
                                            onChange={(e) =>
                                                setBio(e.target.value)
                                            }
                                            className='w-full mt-1'
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='avatar'>
                                            Profile Picture
                                        </Label>
                                        <Input
                                            type='file'
                                            accept='image/*'
                                            onChange={(e) =>
                                                setImageFile(e.target.files[0])
                                            }
                                            className='w-full mt-1'
                                        />
                                        {imageFile && (
                                            <Button
                                                onClick={handleAvatarUpload}
                                                className='mt-4'
                                            >
                                                Upload Avatar
                                            </Button>
                                        )}
                                    </div>
                                    <Button
                                        onClick={handleSave}
                                        className='w-full'
                                    >
                                        Save
                                    </Button>
                                </div>
                            ) : (
                                <div className='mt-4'>
                                    <h2 className='text-xl font-semibold text-gray-800'>
                                        Bio
                                    </h2>
                                    <p className='text-gray-600 mt-2'>
                                        {bio ||
                                            'This user has not added a bio yet.'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className='p-6'>
                            {user && (
                                <div className='flex justify-end'>
                                    <a
                                        href={`/profile/${user.displayName}`}
                                        className='text-blue-500 hover:underline'
                                    >
                                        View {user.displayName}'s Profile
                                    </a>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Biodata;
