import React, { useState } from 'react';

interface PostFormProps {
    onSubmit: (title: string, context: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({onSubmit}) => {
    const [title, setTitle] = useState('');
    const [context, setContext] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !context.trim()) return; // Simple validation
        onSubmit(title, context); // Submit the title and context
        setTitle(''); // Reset form
        setContext('');
    };

    return (
        <form onSubmit={handleSubmit} className='mb-4'>
            <div>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                    Title:
                </label>
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter post title'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                />
            </div>

            <div className='mt-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                    Content:
                </label>
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder='Enter post content'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24'
                />
            </div>

            <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4'
            >
                Submit Post
            </button>
        </form>
    );
};

export default PostForm;
