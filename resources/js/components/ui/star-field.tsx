import { useEffect, useState } from 'react';

interface Star {
    id: number;
    left: string;
    top: string;
    animationDelay: string;
    opacity?: number;
}

interface StarFieldProps {
    count?: number;
    className?: string;
    opacity?: boolean; // If true, random opacity is applied
}

export function StarField({ count = 30, className, opacity = false }: StarFieldProps) {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        // Generate stars only on the client to avoid hydration mismatch
        const newStars = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: opacity ? Math.random() * 0.7 + 0.3 : undefined,
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStars(newStars);
    }, [count, opacity]);

    if (stars.length === 0) {
        return null; // Don't render anything until client-side generation is done
    }

    return (
        <>
            {stars.map((star) => (
                <div
                    key={star.id}
                    className={`absolute rounded-full animate-twinkle ${className || ''}`}
                    style={{
                        left: star.left,
                        top: star.top,
                        animationDelay: star.animationDelay,
                        opacity: star.opacity,
                        boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)'
                    }}
                />
            ))}
        </>
    );
}
