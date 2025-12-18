import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { type ReactNode, useCallback } from 'react';

import './Carousel.css';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { cn } from '@heroui/react';

interface CarouselProps {
    slides: ReactNode[];
}

export const Carousel = ({ slides }: CarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 3000, stopOnMouseEnter: true, stopOnInteraction: true }),
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="embla relative" ref={emblaRef}>
            <div className="embla__container">
                {slides.map((slide, index) => (
                    <div className="embla__slide" key={index}>
                        {slide}
                    </div>
                ))}
            </div>
            <button
                className={cn(
                    'h-[100px] duration-200 hover:bg-blue-300',
                    'absolute -left-2 top-1/2 -translate-y-1/2 rounded-xl active:bg-blue-400',
                )}
                onClick={scrollPrev}
            >
                <RiArrowLeftSLine size={56} className="text-blue-500" />
            </button>
            <button
                className={cn(
                    'h-[100px] duration-200 hover:bg-blue-300',
                    'absolute -right-2 top-1/2 -translate-y-1/2 rounded-xl active:bg-blue-400',
                )}
                onClick={scrollNext}
            >
                <RiArrowRightSLine size={56} className="text-blue-500" />
            </button>
        </div>
    );
};
