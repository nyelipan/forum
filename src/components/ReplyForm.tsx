import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

import { auth, db } from '../firebase';

interface ReplyFormProps {
    postId: string;
    onClose: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({postId, onClose}) => {
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Ensure the reply text is not empty
        if (replyText.trim() === '') return;

        // Ensure the user is authenticated
        if (!auth.currentUser) {
            console.error('User is not authenticated');
            return;
        }

        try {
            // Prepare the new reply object
            const newReply = {
                text: replyText,
                createdAt: serverTimestamp(),
                userId: auth.currentUser?.uid,
                userNickname: auth.currentUser?.displayName,
            };

            // Add the reply to Firestore under the specific postId
            await addDoc(collection(db, 'posts', postId, 'replies'), newReply);

            // Clear the reply text input after submission
            setReplyText('');

            // Close the reply form after successful submission
            onClose();
            console.log('Reply submitted successfully');
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
            <div className='flex justify-end'>
                <button
                    type='submit'
                    className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2'
                >
                    Submit Reply
                </button>
                <button
                    type='button'
                    onClick={onClose}
                    className='bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md'
                >
                    Close
                </button>
            </div>
        </form>
    );
};

export default ReplyForm;
