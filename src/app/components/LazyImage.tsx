import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner/Spinner';

interface LazyImageProps {
    src: string;
    alt: string;
    placeholder: string;
    retryLimit?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, placeholder, retryLimit = 3 }) => {
    const [shouldLoad, setShouldLoad] = useState<boolean>(false);
    const [hasStoppedScrolling, setHasStoppedScrolling] = useState<boolean>(true);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [retryCount, setRetryCount] = useState<number>(0);
    const imageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = imageRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleScroll = () => {
            setHasStoppedScrolling(false);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                setHasStoppedScrolling(true);
            }, 1000);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    useEffect(() => {
        if (shouldLoad && hasStoppedScrolling && !hasLoaded && !error) {
            const loadImage = () => {
                const img = new Image();
                img.src = src;
                img.alt = alt;

                img.onload = () => {
                    setHasLoaded(true);
                    setError(false);
                };

                img.onerror = () => {
                    if (retryCount < retryLimit) {
                        setRetryCount((prev) => prev + 1);
                        // Exponential backoff
                        setTimeout(loadImage, Math.pow(2, retryCount) * 2000);
                    } else {
                        setError(true);
                    }
                };
            };

            loadImage();
        }
    }, [shouldLoad, hasStoppedScrolling, hasLoaded, error, retryCount, src, alt, retryLimit]);

    return (
        <div 
            ref={imageRef} 
            className="lazy-image-container"
            style={{ 
                minHeight: '200px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
            }}
        >
            {hasLoaded ? (
                <img
                    src={src}
                    alt={alt}
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'var(--transition-normal)'
                    }}
                />
            ) : (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--color-text-tertiary)'
                }}>
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default LazyImage;
