import * as React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing

import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';

export function CarouselDemo() {
    // Array of image URLs and corresponding routes
    const images = [
        {
            url: 'https://seaportal.deloitteresources.com/Rotating%20Banner/Navigating%20ESG%20reporting%20in%20the%20built%20environment%20for%20Armada%20Properties%20Brunei.png',
            route: '/page1', // Route to navigate when clicked
            text: 'ESG Reporting',
        },
        {
            url: 'https://seaportal.deloitteresources.com/Rotating%20Banner/SEA%20Innovation%20Festival%202024.jpg',
            route: '/page2',
            text: 'Innovation Festival 2024',
        },
        {
            url: 'https://seaportal.deloitteresources.com/Rotating%20Banner/dilemma.png?1732236712533',
            route: '/page3',
            text: 'Dilemma',
        },
        {
            url: 'https://via.placeholder.com/300?text=Image+5',
            route: '/page4',
            text: 'Placeholder Image',
        },
    ];

    return (
        <Carousel className='w-full max-w-sm'>
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className='p-1 relative group'>
                            <Card>
                                <CardContent className='flex aspect-square items-center justify-center p-6'>
                                    {/* The image itself is no longer clickable */}
                                    <img
                                        src={image.url}
                                        alt={`Slide ${index + 1}`}
                                        className='object-contain h-48 w-full rounded-md pointer-events-none' // Prevents the image itself from being clickable
                                    />

                                    {/* Partial hover overlay for bottom half */}
                                    <div className='absolute bottom-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                        {/* Wrap only the text with Link to make it clickable */}
                                        <Link
                                            to={image.route}
                                            className='text-white text-lg font-bold cursor-pointer block'
                                        >
                                            {image.text}
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
