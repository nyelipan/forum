import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

import { db } from '../../firebase';
import { Button } from '../ui/button';

// Define Reply interface here
interface Reply {
    id: string;
    content: string;
    userEmail: string;
    createdAt?: {seconds: number};
    creatorId: string;
}

interface RepliesListProps {
    postId: string;
    postAuthorId: string;
    currentUserId: string;
    handleDeleteReply: (postId: string, replyId: string) => void;
}

const RepliesList: React.FC<RepliesListProps> = ({
    postId,
    postAuthorId,
    currentUserId,
    handleDeleteReply,
}) => {
    const [replies, setReplies] = useState<Reply[]>([]);

    useEffect(() => {
        const repliesQuery = query(
            collection(db, 'posts', postId, 'replies'),
            orderBy('createdAt', 'desc'),
        );

        const unsubscribe = onSnapshot(repliesQuery, (snapshot) => {
            const repliesData = snapshot.docs.map((doc) => {
                const data = doc.data(); // Get raw data from Firestore document
                return {
                    id: doc.id,
                    content: data.content,
                    userEmail: data.userEmail,
                    createdAt: data.createdAt, // Ensure createdAt is handled correctly
                    creatorId: data.creatorId,
                } as Reply; // Explicitly type it as a Reply
            });
            setReplies(repliesData);
        });

        return () => unsubscribe();
    }, [postId]);

    const formatDate = (seconds: number) => {
        return new Date(seconds * 1000).toLocaleString();
    };

    const handleDeleteClick = async (postId: string, replyId: string) => {
        try {
            // Delete the reply document from Firestore
            const replyDocRef = doc(db, 'posts', postId, 'replies', replyId);
            await deleteDoc(replyDocRef);
            console.log(`Reply ${replyId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting reply: ', error);
        }
    };

    return (
        <div>
            {replies.length === 0 ? (
                <p>No replies yet!</p>
            ) : (
                replies.map((reply) => (
                    <div key={reply.id} className='border-t pt-2 mt-2'>
                        <p className='text-white-800 dark:text-gray-50'>
                            {reply.content}
                        </p>
                        <small className='flex justify-between text-indigo-600 mt-1'>
                            <span>Replied by: {reply.userEmail}</span>
                            <span>
                                Replied on:{' '}
                                {reply.createdAt
                                    ? formatDate(reply.createdAt.seconds)
                                    : 'Unknown'}
                            </span>
                        </small>

                        {(currentUserId === reply.creatorId ||
                            currentUserId === postAuthorId) && (
                            <Button
                                className='text-red-500 hover:text-red-700 mt-2'
                                onClick={() =>
                                    handleDeleteClick(postId, reply.id)
                                } // Call the handleDeleteClick function
                            >
                                <FaTrash className='inline' /> Delete
                            </Button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default RepliesList;
