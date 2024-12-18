import '../ui/PostList.css';

import React, { useState } from 'react';

import { Button } from '../ui/button';
import RepliesList from './RepliesList'; // Import the RepliesList component

interface Reply {
    id: string;
    content: string;
    userEmail: string;
    createdBy?: string;
    creatorId: string;
    createdAt?: {seconds: number}; // Firebase timestamp
}

interface Post {
    id: string;
    title: string;
    context: string;
    createdBy: string;
    createdAt: {seconds: number}; // Firebase timestamp
    likes: number;
    replies: Reply[];
    userId: string; // To check if the post belongs to the current user
}

interface PostListProps {
    posts: Post[];
    onLikeClick: (postId: string) => void;
    onReplyClick: (postId: string, reply: string) => void;
    onDeleteClick: (postId: string) => void;
    currentUserId: string | null; // User ID for the logged-in user
    handleDeleteReply: (replyId: string) => void; // Function to handle reply deletion
}

const PostList: React.FC<PostListProps> = ({
    posts,
    onLikeClick,
    onReplyClick,
    onDeleteClick,
    currentUserId,
    handleDeleteReply,
}) => {
    const [replyText, setReplyText] = useState<{[key: string]: string}>({});

    const handleReplyChange = (postId: string, value: string) => {
        setReplyText((prev) => ({
            ...prev,
            [postId]: value,
        }));
    };

    const handleReplySubmit = (postId: string) => {
        if (!replyText[postId]?.trim()) return; // Ignore empty replies
        onReplyClick(postId, replyText[postId]);
        setReplyText((prev) => ({...prev, [postId]: ''})); // Clear reply input after submission
    };

    return (
        <div className='grid grid-cols-1 gap-6'>
            {posts.length === 0 ? (
                <div className='text-center text-gray-500 dark:text-gray-400'>
                    No posts yet!
                </div>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.id}
                        className='post-item bg-dark dark:bg-gray-900 p-6 rounded-lg shadow-lg'
                    >
                        {/* Post Title */}
                        <h2 className='text-3xl font-bold text-white-700 dark:text-indigo-700'>
                            {post.title}
                        </h2>

                        {/* Post Context */}
                        <p className='text-white-600 dark:text-gray-300 mt-2'>
                            {post.context}
                        </p>

                        {/* Post Details */}
                        <small className='flex justify-between text-grey-600 dark:text-indigo-400 mt-2'>
                            <span>Posted by: {post.createdBy}</span>
                            <span>
                                Posted on:{' '}
                                {post.createdAt
                                    ? new Date(
                                          post.createdAt.seconds * 1000,
                                      ).toLocaleString()
                                    : 'Unknown'}
                            </span>
                        </small>

                        <div className='mt-4 flex justify-between items-center'>
                            <div className='flex items-center'>
                                {/* Like button */}
                                <Button
                                    onClick={() => onLikeClick(post.id)}
                                    className='text-indigo-800 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-800'
                                >
                                    👍 {post.likes}
                                </Button>

                                {/* Reply button */}
                                <Button
                                    onClick={() => handleReplySubmit(post.id)}
                                    className='ml-2 text-indigo-800 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-800'
                                >
                                    💬 Reply
                                </Button>
                            </div>

                            {/* Show delete button only for the post creator */}
                            {currentUserId === post.userId && (
                                <Button
                                    onClick={() => onDeleteClick(post.id)}
                                    className='text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500'
                                >
                                    🗑️ Delete
                                </Button>
                            )}
                        </div>

                        {/* Input for new reply */}
                        <div className='mt-4'>
                            <textarea
                                value={replyText[post.id] || ''}
                                onChange={(e) =>
                                    handleReplyChange(post.id, e.target.value)
                                }
                                placeholder='Write your reply...'
                                className='w-full p-2 border rounded bg-white text-black border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                            />
                        </div>

                        {/* Replies List */}
                        <RepliesList
                            postId={post.id}
                            postAuthorId={post.userId}
                            currentUserId={currentUserId}
                            handleDeleteReply={handleDeleteReply}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default PostList;
