// PostItem.tsx
import React from 'react';
import { AiOutlineCopy, AiOutlineLike } from 'react-icons/ai';
import { FaReply, FaTrash } from 'react-icons/fa';

import { Button } from '../ui/button'; // Ensure this is the correct path

interface PostItemProps {
    postId: string;
    title: string;
    context: string;
    createdBy: string;
    createdAt: any;
    likes: number;
    onLikeClick: (postId: string) => void;
    onReplyClick: (postId: string) => void;
    onCopyClick: (text: string) => void;
    onDeleteClick: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({
    postId,
    title,
    context,
    createdBy,
    createdAt,
    likes,
    onLikeClick,
    onReplyClick,
    onCopyClick,
    onDeleteClick,
}) => {
    return (
        <div className='border p-4 rounded-md shadow-md'>
            <h3 className='text-xl font-semibold'>{title}</h3>
            <p className='text-sm text-black-500'>
                Posted by: {createdBy} on {createdAt?.toDate().toLocaleString()}
            </p>
            <p className='my-2'>{context}</p>

            {/* Like Button */}
            <p className='text-sm text-gray-500'>
                {likes} {likes === 1 ? 'Like' : 'Likes'}
            </p>

            <div className='flex gap-4'>
                <Button
                    onClick={() => onReplyClick(postId)}
                    label='Reply'
                    icon={<FaReply />}
                />
                <Button
                    onClick={() => onLikeClick(postId)}
                    label='Like'
                    icon={<AiOutlineLike />}
                />
                <Button
                    onClick={() => onCopyClick(context)}
                    label='Copy'
                    icon={<AiOutlineCopy />}
                />
                <Button
                    onClick={() => onDeleteClick(postId)}
                    label='Delete'
                    icon={<FaTrash />}
                    className='text-red-700'
                />
            </div>
        </div>
    );
};

export default PostItem;
