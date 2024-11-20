import '';

import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/firebase'; // Ensure Firebase is configured

// Post Form Component: Handles creating new posts
const PostForm = ({addNewPost}: any) => {
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');

    const handleSubmit = () => {
        addNewPost(postTitle, postContent);
        setPostTitle(''); // Clear input after posting
        setPostContent(''); // Clear input after posting
    };

    return (
        <div className='post-form'>
            <input
                type='text'
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder='Enter post title'
            />
            <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder='Enter post content'
            />
            <button onClick={handleSubmit}>Add Post</button>
        </div>
    );
};

// Reply Form Component: Handles adding replies to individual posts
const ReplyForm = ({postId, addReply}: any) => {
    const [replyContent, setReplyContent] = useState('');

    const handleSubmit = () => {
        addReply(postId, replyContent);
        setReplyContent(''); // Clear input after replying
    };

    return (
        <div className='reply-form'>
            <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder='Add a reply'
            />
            <button onClick={handleSubmit}>Reply</button>
        </div>
    );
};

// Main Forum Component: Displays posts and handles adding posts/replies
const Forum = () => {
    const [posts, setPosts] = useState<any[]>([]);

    // Fetch posts from Firestore
    useEffect(() => {
        const postsRef = collection(db, 'posts');
        const unsubscribe = onSnapshot(postsRef, (querySnapshot) => {
            const postsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    // Add new post to Firestore
    const addNewPost = async (title: string, content: string) => {
        try {
            const postsRef = collection(db, 'posts');
            await addDoc(postsRef, {
                title,
                content,
                userId: 'user123', // Replace with actual userId
                createdAt: new Date(),
            });
            alert('Post added successfully!');
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    // Add reply to a specific post
    const addReplyToPost = async (postId: string, replyContent: string) => {
        try {
            const repliesRef = collection(db, 'posts', postId, 'replies');
            await addDoc(repliesRef, {
                content: replyContent,
                userId: 'user123', // Replace with actual userId
                createdAt: new Date(),
            });
            alert('Reply added successfully!');
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    return (
        <div className='forum'>
            <h2>Forum</h2>

            {/* Post Form */}
            <PostForm addNewPost={addNewPost} />

            {/* Display Posts and Reply Forms */}
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className='post'>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>Posted By: {post.createdBy}</p>

                        {/* Reply Form for Each Post */}
                        <ReplyForm postId={post.id} addReply={addReplyToPost} />

                        {/* Display Replies */}
                        <div className='replies'>
                            {/* Here, you could fetch and display the replies for this post */}
                            {/* This could be done by fetching the 'replies' sub-collection */}
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default Forum;
