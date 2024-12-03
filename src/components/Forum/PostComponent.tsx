import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react';

import { auth, db } from '@/firebase'; // Import the correct path for your Firebase setup

interface Post {
    id: string;
    title: string;
    content: string;
}

interface PostComponentProps {
    posts: Post[]; // Assume posts is an array of post objects with id, title, and content
}

// Post Deletion Function
const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
        try {
            const postDocRef = doc(db, 'posts', postId); // Ensure correct collection name
            await deleteDoc(postDocRef);
            alert('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post: ', error);
            alert('Failed to delete post');
        }
    }
};

const PostComponent: React.FC<PostComponentProps> = ({posts}) => {
    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className='post-item'>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <button
                            className='bg-red-500 text-white px-4 py-2 rounded'
                            onClick={() => handleDeletePost(post.id)}
                        >
                            Delete Post
                        </button>
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default PostComponent;
