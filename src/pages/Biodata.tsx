// Biodata.tsx (same as you provided earlier)
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';

import AvatarDemo from '@/components/AvatarDemo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { db, storage } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/Sidebar/Sidebar';
import { Label } from '@radix-ui/react-dropdown-menu';

const Biodata = () => {
    const user = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [displayName, setDisplayName] = useState(
        user ? user.displayName : '',
    );
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(user?.photoURL || '');
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setDisplayName(userData.displayName || user.displayName);
                    setBio(userData.bio || '');
                    setAvatar(userData.avatar || user.photoURL);
                }
                setLoading(false);
            }
        };

        loadUserData();
    }, [user]);

    const handleAvatarUpload = async () => {
        if (!imageFile) return;

        const storageRef = ref(storage, `avatars/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            () => {},
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
                await updateProfile(user, {photoURL: downloadURL});
                setAvatar(downloadURL);
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
                await updateProfile(user, {displayName});
                setEditMode(false);
            } catch (error) {
                console.error('Error updating profile: ', error);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Sidebar />
            <div className='w-full h-screen bg-gradient-to-b from-gray-100 to-gray-300'>
                <header className='flex justify-between items-center p-4 bg-gray-800 shadow-lg'>
                    <div className='text-white font-bold text-lg'>
                        <a href='/home'>My Profile</a>
                    </div>
                    <AvatarDemo
                        avatarUrl={avatar || 'https://via.placeholder.com/150'}
                        onAvatarClick={handleAvatarUpload}
                    />
                </header>

                <main className='p-4'>
                    <div className='max-w-4xl mx-auto'>
                        <Card className='shadow-lg'>
                            <header className='p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white'>
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
                            </header>
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
                                                    setDisplayName(
                                                        e.target.value,
                                                    )
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
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className='text-lg font-semibold'>
                                            Bio
                                        </h2>
                                        <p>{bio}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className='p-6 bg-gray-200'>
                                {editMode && (
                                    <Button
                                        variant='primary'
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Biodata;
