import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
	addDoc,
	collection,
	deleteDoc,
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

import AvatarDemo from '../components/AvatarDemo';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import RepliesList from '../components/RepliesList';
import ReplyForm from '../components/ReplyForm';
import { NavigationMenuDemo } from '../components/ui/NavigationMenuDemo';
import { auth, db } from '../firebase'; // Ensure these are correctly configured

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
    const [userName, setUserName] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleDeletePost = async (postId: string) => {
        try {
            // Delete post from Firestore
            await deleteDoc(doc(db, 'posts', postId));

            // Update local state to remove the deleted post
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postId),
            );
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
    };

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribePosts = onSnapshot(q, async (querySnapshot) => {
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

        // Handle auth state change
        const authInstance = getAuth(); // Use this auth instance consistently
        const unsubscribeAuth = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                setUserName(user.displayName || user.email);
                setCurrentUserId(user.uid);
            } else {
                setUserName(null);
                setCurrentUserId(null);
            }
        });

        // Cleanup subscriptions on unmount
        return () => {
            unsubscribePosts(); // Unsubscribe from Firestore updates
            unsubscribeAuth(); // Unsubscribe from auth listener
        };
    }, []); // Empty dependency array so the effect runs once

    const handlePostSubmit = async (title: string, context: string) => {
        try {
            const authInstance = getAuth(); // Retrieve current auth state
            const currentUser = authInstance.currentUser;

            if (!currentUser) {
                console.error('User not authenticated');
                return;
            }

            await addDoc(collection(db, 'posts'), {
                title,
                context,
                createdAt: new Date(),
                createdBy: currentUser.displayName,
                userId: currentUser.uid,
                likes: 0,
            });
        } catch (error) {
            console.error('Error adding post: ', error);
        }
    };

    const handleLikeClick = async (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        const postRef = doc(db, 'posts', postId);
        try {
            await updateDoc(postRef, {
                likes: post.likes + 1,
            });

            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    p.id === postId ? {...p, likes: p.likes + 1} : p,
                ),
            );
        } catch (error) {
            console.error('Error updating likes: ', error);
        }
    };

    const handleReplyClick = (postId: string) => {
        console.log('Reply clicked for post:', postId);
    };

    const handleCopyClick = (postId: string) => {
        console.log('Copy link clicked for post:', postId);
    };

    return (
        <div>
            <header className='flex justify-between items-center p-4'>
                <NavigationMenuDemo />
                <div className='text-white font-bold text-lg'></div>
                <div className='flex items-center'>
                    <AvatarDemo />
                </div>
            </header>

            <header className='mb-4'>
                <h1 className='text-2xl font-bold'>
                    {userName
                        ? `Welcome, ${userName}!`
                        : 'Welcome to the Forum!'}
                </h1>
            </header>

            <PostForm onSubmit={handlePostSubmit} />

            {loading ? (
                <div className='text-center'></div>
            ) : (
                <PostList
                    posts={posts}
                    onLikeClick={handleLikeClick}
                    onReplyClick={handleReplyClick}
                    onCopyClick={handleCopyClick}
                    onDeleteClick={handleDeletePost} // Pass the delete handler
                    currentUserId={currentUserId}
                />
            )}
        </div>
    );
};

export default HomePage;
