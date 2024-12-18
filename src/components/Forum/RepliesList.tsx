import '../ui/PostList.css';

import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	increment,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FaThumbsUp, FaTrash } from 'react-icons/fa';

import { db } from '../../firebase';
import { Button } from '../ui/button';

interface Reply {
    id: string;
    content: string;
    userEmail: string;
    createdAt?: {seconds: number};
    creatorId: string;
    likes: number;
    replies?: Reply[]; // Nested replies
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
    const [replyText, setReplyText] = useState<{[key: string]: string}>({});

    useEffect(() => {
        const repliesQuery = query(
            collection(db, 'posts', postId, 'replies'),
            orderBy('createdAt', 'desc'),
        );

        const unsubscribe = onSnapshot(repliesQuery, (snapshot) => {
            const repliesData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    content: data.content,
                    userEmail: data.userEmail,
                    createdAt: data.createdAt,
                    creatorId: data.creatorId,
                    likes: data.likes || 0, // Initialize likes if not present
                    replies: data.replies || [], // Initialize replies if not present
                } as Reply;
            });
            setReplies(repliesData);
        });

        return () => unsubscribe();
    }, [postId]);

    const formatDate = (seconds: number) => {
        return new Date(seconds * 1000).toLocaleString();
    };

    const handleLikeClick = async (replyId: string) => {
        const replyDocRef = doc(db, 'posts', postId, 'replies', replyId);
        await updateDoc(replyDocRef, {
            likes: increment(1),
        });
    };

    const handleReplySubmit = async (
        parentReplyId: string,
        content: string,
    ) => {
        if (!content.trim()) return;

        const parentReplyDocRef = doc(
            db,
            'posts',
            postId,
            'replies',
            parentReplyId,
        );
        const newReply = {
            content,
            userEmail: currentUserId || 'Anonymous',
            creatorId: currentUserId || 'Anonymous',
            createdAt: serverTimestamp(),
            likes: 0,
        };

        await addDoc(collection(parentReplyDocRef, 'replies'), newReply); // Add the new reply under the parent reply
        setReplyText((prev) => ({...prev, [parentReplyId]: ''})); // Clear reply input
    };

    const handleDeleteClick = async (postId: string, replyId: string) => {
        try {
            const replyDocRef = doc(db, 'posts', postId, 'replies', replyId);
            await deleteDoc(replyDocRef);
            console.log(`Reply ${replyId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting reply: ', error);
        }
    };

    const handleReplyChange = (replyId: string, value: string) => {
        setReplyText((prev) => ({
            ...prev,
            [replyId]: value,
        }));
    };

    const renderReplies = (replies: Reply[], level: number = 1) => {
        return replies.map((reply) => (
            <div key={reply.id} className={`reply-item pl-${level * 4}`}>
                <p className='reply-content'>{reply.content}</p>
                <small className='flex justify-between text-gray-500 mt-1'>
                    <span>Replied by: {reply.userEmail}</span>
                    <span>
                        Replied on:{' '}
                        {reply.createdAt
                            ? formatDate(reply.createdAt.seconds)
                            : 'Unknown'}
                    </span>
                </small>

                {/* Like and Reply Buttons */}
                <div className='mt-2 flex items-center space-x-4'>
                    <Button onClick={() => handleLikeClick(reply.id)}>
                        <FaThumbsUp /> {reply.likes}
                    </Button>

                    <Button
                        onClick={() =>
                            handleReplySubmit(
                                reply.id,
                                replyText[reply.id] || '',
                            )
                        }
                    >
                        Reply
                    </Button>

                    {(currentUserId === reply.creatorId ||
                        currentUserId === postAuthorId) && (
                        <Button
                            className='text-red-500 hover:text-red-700 mt-2'
                            onClick={() => handleDeleteClick(postId, reply.id)}
                        >
                            <FaTrash className='inline' /> Delete
                        </Button>
                    )}
                </div>

                {/* Input for reply to reply */}
                <div className='mt-2'>
                    <textarea
                        value={replyText[reply.id] || ''}
                        onChange={(e) =>
                            handleReplyChange(reply.id, e.target.value)
                        }
                        placeholder='Write your reply...'
                        className='w-full p-2 border rounded bg-white text-black border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                    />
                </div>

                {/* Render nested replies recursively */}
                {reply.replies && reply.replies.length > 0 && (
                    <div className='mt-2'>
                        {renderReplies(reply.replies, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className='reply-wrapper'>
            {replies.length === 0 ? (
                <p>No replies yet!</p>
            ) : (
                renderReplies(replies)
            )}
        </div>
    );
};

export default RepliesList;
