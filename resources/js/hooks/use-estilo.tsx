import { useCallback, useEffect, useState } from 'react';

/**
 * El estilo visual de la web. Son dos, y conviven:
 *
 *  - 'forja'   — el de siempre: purpura, dorado y naranja.
 *  - 'taberna' — el del arte del juego: tinta, ocre, hueso y candil.
 *
 * Va en el atributo data-estilo del <html>, que el servidor ya escribe desde
 * la cookie para que no haya parpadeo, y ademas en localStorage por si la
 * cookie se pierde. Cambiar de estilo no toca ningun contenido: solo colores.
 */
export type Estilo = 'forja' | 'taberna';

const ESTILOS: Estilo[] = ['forja', 'taberna'];

export const NOMBRES: Record<Estilo, { titulo: string; descripcion: string }> = {
    forja: {
        titulo: 'Forja',
        descripcion: 'El de siempre: púrpura, oro y fuego.',
    },
    taberna: {
        titulo: 'Taberna',
        descripcion: 'El del arte del juego: tinta, ocre y luz de candil.',
    },
};

function guardarCookie(valor: Estilo) {
    if (typeof document === 'undefined') return;
    document.cookie = `estilo=${valor};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
}

function aplicar(valor: Estilo) {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.estilo = valor;
}

function leerGuardado(): Estilo {
    if (typeof window === 'undefined') return 'forja';

    const enElHtml = document.documentElement.dataset.estilo as Estilo | undefined;
    if (enElHtml && ESTILOS.includes(enElHtml)) return enElHtml;

    try {
        const v = localStorage.getItem('estilo') as Estilo | null;
        if (v && ESTILOS.includes(v)) return v;
    } catch {
        /* navegacion privada */
    }

    return 'forja';
}

/** Se llama al arrancar, por si el servidor no puso el atributo. */
export function initializeEstilo() {
    aplicar(leerGuardado());
}

export function useEstilo() {
    const [estilo, setEstilo] = useState<Estilo>('forja');

    useEffect(() => setEstilo(leerGuardado()), []);

    const cambiarEstilo = useCallback((valor: Estilo) => {
        setEstilo(valor);
        aplicar(valor);
        guardarCookie(valor);
        try {
            localStorage.setItem('estilo', valor);
        } catch {
            /* navegacion privada: se queda la cookie */
        }
    }, []);

    return { estilo, cambiarEstilo } as const;
}
