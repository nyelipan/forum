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
import { Link, useNavigate } from 'react-router-dom';

import { CarouselDemo } from '@/components/CarouselDemo';
import ParentComponent from '@/components/ParentComponent';
import SearchBar from '@/components/ui/searchBar/searchBar';
import Sidebar from '@/Sidebar/Sidebar';

import AvatarDemo from '../components/AvatarDemo';
import PostForm from '../components/Forum/PostForm';
import PostList from '../components/Forum/PostList';
import { NavigationMenuDemo } from '../components/ui/NavigationMenuDemo';
import { db } from '../firebase';

interface Post {
    id: string;
    title: string;
    context: string;
    createdAt: Date;
    createdBy: string;
    userId: string;
    likes: number;
    replies: Reply[];
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigate = useNavigate();

    const handleDeletePost = async (postId: string) => {
        try {
            const postRef = doc(db, 'posts', postId);
            await deleteDoc(postRef);
        } catch (error) {
            console.error('Error deleting post:', error);
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

        const authInstance = getAuth();
        const unsubscribeAuth = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                setUserName(user.displayName || user.email);
                setCurrentUserId(user.uid);
            } else {
                setUserName(null);
                setCurrentUserId(null);
            }
        });

        return () => {
            unsubscribePosts();
            unsubscribeAuth();
        };
    }, []);

    const handlePostSubmit = async (title: string, context: string) => {
        try {
            const authInstance = getAuth();
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

    const handleReplyClick = async (postId: string, replyContent: string) => {
        try {
            const authInstance = getAuth();
            const currentUser = authInstance.currentUser;

            if (!currentUser) {
                console.error('User not authenticated');
                return;
            }

            const newReply = {
                content: replyContent,
                createdAt: new Date(),
                creatorId: currentUser.uid,
                userEmail: currentUser.email,
            };

            await addDoc(collection(db, 'posts', postId, 'replies'), newReply);

            setReplies((prevReplies) => ({
                ...prevReplies,
                [postId]: [...(prevReplies[postId] || []), newReply],
            }));
        } catch (error) {
            console.error('Error adding reply: ', error);
        }
    };

    const handleDeleteReply = async (postId: string, replyId: string) => {
        try {
            await deleteDoc(doc(db, 'posts', postId, 'replies', replyId));
            setReplies((prevReplies) => {
                const updatedReplies = {...prevReplies};
                delete updatedReplies[postId];
                return updatedReplies;
            });
        } catch (error) {
            console.error('Error deleting reply: ', error);
        }
    };

    const handleCopyClick = (postId: string) => {
        console.log('Copy link clicked for post:', postId);
    };

    return (
        <>
            <div
                className={`flex ${
                    isSidebarOpen ? 'ml-[sidebar-width]' : 'ml-0'
                } transition-all duration-300`}
            >
                {/* Sidebar Component */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main
                    className={`
                flex-1
                ${isSidebarOpen ? 'w-[calc(100%-sidebar-width)]' : 'w-full'}
                transition-all duration-300
            `}
                >
                    <div className='mr-1'>
                        {/* Header Section with logo and navigation */}
                        <header className='flex justify-between items-center p- rounded-xl bg-gray-800 shadow-lg'>
                            {/* Logo Section */}
                            <div className='flex items-center'>
                                <Link to='/home'>
                                    <img
                                        src='/images/logo.png'
                                        alt='Logo'
                                        className='w-59 h-40 mr-4'
                                    />{' '}
                                </Link>
                            </div>

                            {/* User Greeting */}
                            <div className='text-right flex items-center space-x-1'>
                                <div className=' mr-5 text-black text-xl font-bold '>
                                    {userName
                                        ? `Welcome, ${userName}!`
                                        : 'Welcome to the Forum!'}
                                    <div className='flex-center'>
                                        <ParentComponent />
                                    </div>
                                </div>

                                {/* Avatar */}
                                <div className=' flex items-right '>
                                    <AvatarDemo />
                                </div>
                            </div>
                        </header>
                        <div>
                            <NavigationMenuDemo />
                        </div>

                        <div className='flex items-center z-10'>
                            {/* Center the Carousel */}
                            <div className='flex justify-center w-full'>
                                <CarouselDemo />
                            </div>
                        </div>
                        {/* Post Form Component */}
                        <PostForm onSubmit={handlePostSubmit} />

                        {/* Loading State */}
                        <div className='post-wrapper'></div>
                        {loading ? (
                            <div className=' text-center text-gray-600'>
                                Loading...
                            </div>
                        ) : (
                            <PostList
                                posts={posts}
                                onLikeClick={handleLikeClick}
                                onReplyClick={handleReplyClick}
                                onDeleteClick={handleDeletePost}
                                onCopyClick={handleCopyClick}
                                handleDeleteReply={handleDeleteReply}
                                currentUserId={currentUserId}
                                replies={replies}
                            />
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default HomePage;
