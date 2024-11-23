// ForumPost.tsx
import React from 'react';

import { auth, handleDeletePost } from '../firebase';

interface ForumPostProps {
    postId: string;
    postAuthorId: string;
    content: string;
    onDelete: (postId: string) => void; // Function to remove the post from the UI
}

const ForumPost: React.FC<ForumPostProps> = ({
    postId,
    postAuthorId,
    content,
    onDelete,
}) => {
    const currentUser = auth.currentUser;

    const handleDeleteClick = async () => {
        try {
            await handleDeletePost(postId); // Delete the post from Firestore
            onDelete(postId);
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
        // Update the UI by removing the post
    };

    return (
        <div className='forum-post'>
            <p>{content}</p>
            {/* Conditionally show the delete button only if the current user is the post's author */}
            {currentUser?.uid === postAuthorId && (
                <button onClick={handleDeleteClick} className='delete-button'>
                    Delete Post
                </button>
            )}
        </div>
    );
};

export default ForumPost;
