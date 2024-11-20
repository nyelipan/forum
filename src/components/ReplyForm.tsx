import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

import { auth, db } from '../firebase';

const ReplyForm = ({postId, onClose}) => {
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (replyText.trim() === '') return;

        try {
            // Add the reply to the 'replies' sub-collection of the post
            const newReply = {
                text: replyText,
                createdAt: serverTimestamp(),
                userId: auth.currentUser?.uid,
                userNickname: auth.currentUser?.displayName,
            };

            await addDoc(collection(db, 'posts', postId, 'replies'), newReply);
            setReplyText('');
            onClose(); // Close reply form after submission
        } catch (error) {
            console.error('Error adding reply: ', error);
        }
    };

    return (
        <form onSubmit={handleReplySubmit} className='mb-6'>
            <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder='Write your reply...'
                className='border border-gray-300 p-2 w-full mb-4 rounded-md'
                required
            />
            <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md'
            >
                Submit Reply
            </button>
            <button
                type='button'
                onClick={onClose}
                className='bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md ml-2'
            >
                Close
            </button>
        </form>
    );
};

export default ReplyForm;
