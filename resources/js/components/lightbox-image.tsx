import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Imagen que se expande a pantalla completa al hacer clic. Clic fuera o
 * Escape para cerrar. Se usa en las tarjetas de los listados y en las
 * imágenes del contenido Markdown.
 */
export default function LightboxImage({
    src,
    alt = '',
    className = '',
    style,
}: {
    src: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
}) {
    const [abierta, setAbierta] = useState(false);

    useEffect(() => {
        if (!abierta) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setAbierta(false);
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [abierta]);

    return (
        <>
            <img
                src={src}
                alt={alt}
                style={style}
                className={`cursor-zoom-in ${className}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAbierta(true);
                }}
            />
            {abierta &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex cursor-zoom-out items-center justify-center bg-slate-950/90 p-6 backdrop-blur-sm"
                        onClick={() => setAbierta(false)}
                    >
                        <img
                            src={src}
                            alt={alt}
                            className="max-h-full max-w-full rounded-lg border-2 border-amber-500/50 object-contain shadow-[0_0_60px_rgba(251,191,36,0.35)]"
                        />
                        <button
                            type="button"
                            title="Cerrar"
                            className="absolute top-4 right-4 rounded-full border-2 border-yellow-500/50 bg-slate-900/90 px-3.5 py-1.5 text-xl font-black text-yellow-200 hover:bg-slate-800"
                            onClick={() => setAbierta(false)}
                        >
                            ✕
                        </button>
                    </div>,
                    document.body,
                )}
        </>
    );
}
