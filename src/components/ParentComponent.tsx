import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { db } from '@/firebase'; // Import the db instance

import SearchBar from './ui/searchBar/searchBar';

interface Post {
    id: string;
    title: string;
    content: string;
}

const ParentComponent: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    // Fetch posts from Firebase
    useEffect(() => {
        const fetchPosts = async () => {
            const querySnapshot = await getDocs(collection(db, 'posts')); // 'posts' collection
            const postsList: Post[] = [];
            querySnapshot.forEach((doc) => {
                postsList.push({id: doc.id, ...doc.data()} as Post);
            });
            setPosts(postsList); // Store posts in state
            setFilteredPosts(postsList); // Initially show all posts
        };
        fetchPosts();
    }, []);

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        setFilteredPosts(
            posts.filter((post) => {
                const title = post.title ? post.title.toLowerCase() : '';
                const content = post.content ? post.content.toLowerCase() : '';
                return (
                    title.includes(searchTerm.toLowerCase()) ||
                    content.includes(searchTerm.toLowerCase())
                );
            }),
        );
    };

    return (
        <div className='p-1 '>
            {/* Pass handleSearch to SearchBar */}
            <SearchBar placeholder='Search posts...' onSearch={handleSearch} />

            {/* Only show posts if searchTerm is not empty */}
            {searchTerm && (
                <div className='mt-4'>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div key={post.id} className='p-4 border-b'>
                                <h2 className='text-lg font-semibold'>
                                    {post.title}
                                </h2>
                                <p>{post.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>No posts found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ParentComponent;
