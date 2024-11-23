import { User } from 'lucide-react';
import React, { useState } from 'react';
import { AiOutlineCopy, AiOutlineLike } from 'react-icons/ai';
import { FaHandMiddleFinger, FaReply, FaTrash } from 'react-icons/fa';

import { Progress } from '@radix-ui/react-progress';

interface Reply {
    id: string;
    content: string;
    createdBy: string;
    createdAt: any;
}

interface Post {
    id: string;
    title: string;
    context: string;
    createdBy: string;
    createdAt: any; // Keeping it as 'any' because of Firebase timestamp, but consider using a better type
    likes: number;
    replies: Reply[];
    userId: string; // To check if the post belongs to the current user
}

interface PostListProps {
    posts: Post[];
    onLikeClick: (postId: string) => void;
    onReplyClick: (postId: string, replyContent: string) => void;
    onCopyClick: (postId: string) => void;
    onDeleteClick: (postId: string) => void;
    currentUserId: string | null; // User ID for the logged-in user
}

const PostList: React.FC<PostListProps> = ({
    posts,
    onLikeClick,
    onReplyClick,
    onCopyClick,
    onDeleteClick,
    currentUserId,
}) => {
    const [replyText, setReplyText] = useState<{[key: string]: string}>({}); // Store reply text per post

    // Handle reply text change for each post
    const handleReplyChange = (postId: string, value: string) => {
        setReplyText((prev) => ({
            ...prev,
            [postId]: value,
        }));
    };

    // Handle reply submission
    const handleReplyClick = (postId: string) => {
        if (!replyText[postId]?.trim()) return; // Ignore empty replies
        onReplyClick(postId, replyText[postId]);
        setReplyText((prev) => ({...prev, [postId]: ''})); // Clear reply input after submission
    };

    return (
        <div>
            {posts.map((post) => (
                <div
                    key={post.id}
                    className='border p-4 rounded-md shadow-md my-4'
                >
                    <h3 className='text-xl font-semibold'>{post.title}</h3>
                    <p className='text-sm text-gray-500'>
                        Posted by: {post.createdBy} on{' '}
                        {post.createdAt.toDate().toLocaleString()}
                    </p>
                    <p className='my-2'>{post.context}</p>
                    <p className='text-sm text-gray-500'>
                        {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                    </p>

                    <div className='flex gap-4 mt-2'>
                        {/* Like Button */}
                        <button
                            onClick={() => onLikeClick(post.id)}
                            className='flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md'
                        >
                            <AiOutlineLike />
                            {post.likes === 0 ? 'Like' : 'Unlike'}
                        </button>

                        {/* Copy Button */}
                        <button
                            onClick={() => onCopyClick(post.id)}
                            className='flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md'
                        >
                            <AiOutlineCopy />
                            Copy
                        </button>

                        {/* Delete Button - Only show if current user is the owner */}
                        {currentUserId === post.userId && (
                            <button
                                onClick={() => onDeleteClick(post.id)}
                                className='flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md'
                            >
                                <FaTrash />
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    <div className='mt-4'>
                        <textarea
                            value={replyText[post.id] || ''} // Ensure the reply input is unique per post
                            onChange={(e) =>
                                handleReplyChange(post.id, e.target.value)
                            }
                            className='w-full p-2 border rounded-md'
                            placeholder='Write a reply...'
                        />
                        <button
                            onClick={() => handleReplyClick(post.id)}
                            className='flex items-center gap-2 bg-emerald-700 hover:bg-green-600 text-white px-4 py-1 rounded-md'
                        >
                            <FaHandMiddleFinger />
                            Reply
                        </button>
                    </div>

                    {/* Reply List */}
                    <div className='mt-4'>
                        {(post.replies?.length ?? 0) > 0 ? (
                            post.replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className='border p-2 rounded-md mt-2'
                                >
                                    <p className='text-sm font-semibold'>
                                        {reply.createdBy} said:
                                    </p>
                                    <p>{reply.content}</p>
                                    <p className='text-xs text-gray-400'>
                                        {reply.createdAt.toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className='text-sm text-gray-500'>
                                No replies yet.
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;
