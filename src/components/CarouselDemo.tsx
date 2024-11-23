import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';

export function CarouselDemo() {
    // Array of image URLs
    const images = [
        'https://seaportal.deloitteresources.com/Rotating%20Banner/Navigating%20ESG%20reporting%20in%20the%20built%20environment%20for%20Armada%20Properties%20Brunei.png', // Replace with your actual image URLs
        'https://seaportal.deloitteresources.com/Rotating%20Banner/SEA%20Innovation%20Festival%202024.jpg',

        'https://seaportal.deloitteresources.com/Rotating%20Banner/dilemma.png?1732236712533',
        'https://via.placeholder.com/300?text=Image+5',
    ];

    return (
        <Carousel className='w-full max-w-md'>
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className='p-1'>
                            <Card>
                                <CardContent className='flex aspect-square items-center justify-center p-6'>
                                    {/* Display the image */}
                                    <img
                                        src={image}
                                        alt={`Slide ${index + 1}`}
                                        className='object-contain h-48 w-full rounded-md'
                                    />
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
