import { Toaster as Sonner } from 'sonner';
import { useEffect, useState } from 'react';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Detectar el tema del documento
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');

        // Observer para cambios de tema
        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <Sonner
            theme={theme}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                    success: 'group-[.toast]:border-green-500/30 group-[.toast]:bg-green-500/10',
                    error: 'group-[.toast]:border-red-500/30 group-[.toast]:bg-red-500/10',
                    warning: 'group-[.toast]:border-amber-500/30 group-[.toast]:bg-amber-500/10',
                    info: 'group-[.toast]:border-blue-500/30 group-[.toast]:bg-blue-500/10',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };

