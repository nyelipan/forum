import { getAuth } from 'firebase/auth';
import {
	addDoc,
	collection,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Progress } from '@/components/ui/progress';

import { auth, db } from '../firebase'; // Ensure these are correctly configured
import PostForm from './PostForm';
import PostList from './PostList';
import RepliesList from './RepliesList'; // If RepliesList is used later

// Define Post and Reply interfaces here if they're not imported
interface Post {
    id: string;
    title: string;
    context: string;
    createdAt: Date;
    createdBy: string;
    userId: string;
    likes: number;
}

interface Reply {
    id: string;
    content: string;
    userEmail: string;
    createdAt?: {seconds: number};
    creatorId: string;
}

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [replies, setReplies] = useState<{[key: string]: Reply[]}>({});
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState<string | null>(null); // Store user's name
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            setLoading(true);
            const postsData: Post[] = [];
            const repliesData: {[key: string]: Reply[]} = {};

            for (const docSnapshot of querySnapshot.docs) {
                const postId = docSnapshot.id;
                postsData.push({...docSnapshot.data(), id: postId} as Post);

                const repliesSnapshot = await getDocs(
                    collection(db, 'posts', postId, 'replies'),
                );

                const repliesList = repliesSnapshot.docs.map(
                    (doc) => doc.data() as Reply,
                );

                repliesData[postId] = repliesList;
            }

            setPosts(postsData);
            setReplies(repliesData);
            setLoading(false);
        });

        // Get current user and set userName for greeting
        const user = getAuth().currentUser;
        if (user) {
            setUserName(user.displayName || user.email);
        }

        return () => unsubscribe();
    }, []);

    // Post submission handler
    const handlePostSubmit = async (title: string, context: string) => {
        try {
            await addDoc(collection(db, 'posts'), {
                title,
                context,
                createdAt: new Date(),
                createdBy: auth.currentUser?.displayName,
                userId: auth.currentUser?.uid,
                likes: 0, // Initialize likes to 0
            });
        } catch (error) {
            console.error('Error adding post: ', error);
        }
    };

    // Like handler
    const handleLikeClick = async (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        const postRef = doc(db, 'posts', postId);
        try {
            await updateDoc(postRef, {
                likes: post.likes + 1, // Increment the likes in Firestore
            });

            // Update local state with the new like count
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    p.id === postId ? {...p, likes: p.likes + 1} : p,
                ),
            );
        } catch (error) {
            console.error('Error updating likes: ', error);
        }
    };

    // Placeholder for reply click handler
    const handleReplyClick = (postId: string) => {
        console.log('Reply clicked for post:', postId);
    };

    // Placeholder for copy click handler
    const handleCopyClick = (postId: string) => {
        console.log('Copy link clicked for post:', postId);
    };

    return (
        <div>
            {/* Greeting based on user */}
            <header className='mb-4'>
                <h1 className='text-2xl font-bold'>
                    {userName
                        ? `Welcome, ${userName}!`
                        : 'Welcome to the Forum!'}
                </h1>
            </header>

            {/* Post submission form */}
            <PostForm onSubmit={handlePostSubmit} />

            {/* Loader when data is loading */}
            {loading ? (
                <div className='text-center'>
                    <Progress value={50} />
                </div>
            ) : (
                <PostList
                    posts={posts}
                    onLikeClick={handleLikeClick}
                    onReplyClick={handleReplyClick}
                    onCopyClick={handleCopyClick}
                />
            )}
        </div>
    );
};

export default HomePage;
