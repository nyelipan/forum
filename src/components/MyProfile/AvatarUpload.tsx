import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';

import { db, storage } from '@/firebase'; // Firebase storage

import { Button } from '../ui/button'; // Tailwind UI Components
import { Input } from '../ui/input';

interface AvatarUploadProps {
    userUid: string;
    currentAvatar: string;
    onAvatarUpdated: (newAvatarUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
    userUid,
    currentAvatar,
    onAvatarUpdated,
}) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleUpload = async () => {
        if (!imageFile) return;

        setLoading(true);
        const storageRef = ref(storage, `avatars/${userUid}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // You can add a progress bar if needed
            },
            (error) => {
                console.error('Error uploading avatar:', error);
                setLoading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref,
                );
                await updateDoc(doc(db, 'users', userUid), {
                    avatar: downloadURL,
                });

                // Update the user profile photo in Firebase Authentication
                await updateProfile(userUid, {photoURL: downloadURL});

                onAvatarUpdated(downloadURL); // Pass the new avatar URL to parent component
                setLoading(false);
            },
        );
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center'>
                <img
                    src={currentAvatar || 'https://via.placeholder.com/150'}
                    alt='Avatar'
                    className='w-20 h-20 rounded-full object-cover'
                />
                <Input
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='ml-4'
                />
            </div>
            {imageFile && (
                <Button
                    onClick={handleUpload}
                    disabled={loading}
                    className='mt-2'
                >
                    {loading ? 'Uploading...' : 'Upload Avatar'}
                </Button>
            )}
        </div>
    );
};

export default AvatarUpload;
