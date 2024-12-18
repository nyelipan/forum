import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

import { auth, db } from '@/firebase';

interface PostFormProps {
    onSubmit: (title: string, content: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({onSubmit}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(''); // State for form validation error
    const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure title and content are not empty
        if (!title.trim() || !content.trim()) {
            setError('Both title and content are required');
            return; // Do not submit if either field is empty
        }

        // Ensure the user is authenticated
        if (!auth.currentUser) {
            console.error('User is not authenticated');
            return;
        }

        try {
            // Create a new post with the authenticated user's ID
            const newPost = {
                title,
                content,
                userId: auth.currentUser.uid, // Store the user ID with the post
                createdAt: serverTimestamp(),
            };

            // Add the post to Firestore under the user-specific posts collection
            await addDoc(
                collection(db, 'users', auth.currentUser.uid, 'posts'),
                newPost,
            );

            // Reset form fields after submission
            setTitle('');
            setContent('');
            setError(''); // Clear any previous error

            console.log('Post submitted successfully');

            // Call the onSubmit prop to handle post submission
            onSubmit(title, content);
        } catch (error) {
            console.error('Error adding post: ', error);
        }
    };

    return (
        <div className='w-full max-w-lg mx-auto mt-8 p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105'>
            {/* Button to toggle form visibility */}
            <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className='w-full bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 transition-all duration-300 ease-in-out transform hover:scale-105'
            >
                {isFormVisible ? 'Hide Post Form' : 'Show Post Form'}
            </button>

            {/* Conditionally render the form with animation */}
            {isFormVisible && (
                <form
                    onSubmit={handleSubmit}
                    className='transition-opacity duration-500 ease-in-out opacity-100'
                    style={{opacity: isFormVisible ? 1 : 0}} // Fade in/out when toggled
                >
                    {error && (
                        <p className='text-red-500 text-sm mb-2'>{error}</p>
                    )}
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>
                            Title:
                        </label>
                        <input
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Enter post title'
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>
                            Content:
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder='Enter post content'
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 h-32 resize-none'
                        />
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 transition-all duration-300 ease-in-out transform hover:scale-105'
                    >
                        Submit Post
                    </button>
                </form>
            )}
        </div>
    );
};

export default PostForm;
