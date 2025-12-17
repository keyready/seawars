import { Button } from '@heroui/react';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { type ReactNode, useCallback } from 'react';

import './Carousel.css';

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
            <Button className="absolute bottom-2 left-2" onPress={scrollPrev}>
                {'<-'}
            </Button>
            <Button className="absolute bottom-2 right-2" onPress={scrollNext}>
                {'->'}
            </Button>
        </div>
    );
};
