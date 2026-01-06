import { useEffect, useState } from 'react';

interface StarFieldProps {
    count: number;
    small?: boolean;
}

export function StarField({ count, small = false }: StarFieldProps) {
    const [stars, setStars] = useState<Array<{
        left: string;
        top: string;
        delay: string;
        opacity?: number;
    }>>([]);

    useEffect(() => {
        const newStars = Array.from({ length: count }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 3}s`,
            opacity: small ? Math.random() * 0.7 + 0.3 : undefined,
        }));
        setStars(newStars);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {stars.map((star, i) => (
                <div
                    key={i}
                    className={`absolute ${small ? 'w-1 h-1' : 'w-2 h-2'} bg-yellow-300 rounded-full animate-twinkle`}
                    style={{
                        left: star.left,
                        top: star.top,
                        animationDelay: star.delay,
                        boxShadow: small ? undefined : '0 0 10px rgba(251, 191, 36, 0.8)',
                        opacity: star.opacity
                    }}
                />
            ))}
        </>
    );
}
