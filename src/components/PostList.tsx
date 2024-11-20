import React, { useState } from 'react';
import { AiOutlineCopy, AiOutlineLike } from 'react-icons/ai'; // Ensure correct icon import
import { FaReply } from 'react-icons/fa';

import { Progress } from '@radix-ui/react-progress';

interface Reply {
    id: string;
    content: string;
    createdBy: string;
    createdAt: any; // Timestamp
}

interface Post {
    id: string;
    title: string;
    context: string;
    createdBy: string;
    createdAt: any; // Timestamp
    likes: number;
    replies: Reply[]; // Added replies to the post
}

interface PostListProps {
    posts: Post[];
    onLikeClick: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({posts, onLikeClick}) => {
    const [likedPosts, setLikedPosts] = useState<string[]>([]);
    const [replyText, setReplyText] = useState<string>('');
    const [replies, setReplies] = useState<{[key: string]: string}>({}); // State to handle replies for each post

    const handleLikeClick = (postId: string) => {
        if (likedPosts.includes(postId)) {
            setLikedPosts(likedPosts.filter((id) => id !== postId));
        } else {
            setLikedPosts([...likedPosts, postId]);
        }
    };

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Text copied to clipboard!');
        });
    };

    const handleReplyClick = (postId: string) => {
        // Add the reply to the list of replies for that specific post
        if (replyText.trim() === '') return; // Ignore empty replies

        const newReply = {
            id: Math.random().toString(36).substr(2, 9), // Generate random id for the reply
            content: replyText,
            createdBy: 'User', // Replace with the actual user
            createdAt: new Date(),
        };

        setReplies((prevReplies) => {
            const updatedReplies = {
                ...prevReplies,
                [postId]: [...(prevReplies[postId] || []), newReply],
            };
            return updatedReplies;
        });

        setReplyText(''); // Reset reply text after submission
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
                        {/* Like/Unlike Button */}
                        <button
                            onClick={() => handleLikeClick(post.id)}
                            className='flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md'
                        >
                            <AiOutlineLike />

                            {likedPosts.includes(post.id) ? 'Unlike' : 'Like'}
                        </button>

                        {/* Copy Button */}
                        <button
                            onClick={() => handleCopyClick(post.context)}
                            className='flex items-center gap-2 bg-stone-700 hover:bg-teal-700 text-white px-4 py-2 rounded-md'
                        >
                            <AiOutlineCopy />
                            Copy
                        </button>
                    </div>

                    {/* Reply Form */}
                    <div className='mt-4'>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className='w-full p-2 border rounded-md'
                            placeholder='Write a reply...'
                        />
                        <button
                            onClick={() => handleReplyClick(post.id)}
                            className='flex items-center gap-2 bg-emerald-700 hover:bg-green-600 text-white px-4 py-1 rounded-md'
                        >
                            <FaReply />
                            Reply
                            <Progress value={33} />
                        </button>
                    </div>

                    {/* Reply List */}
                    <div className='mt-4'>
                        {replies[post.id]?.length > 0 ? (
                            replies[post.id].map((reply: Reply) => (
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
