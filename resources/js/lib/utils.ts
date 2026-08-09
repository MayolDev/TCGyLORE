import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Convierte Markdown en texto plano para previews (tarjetas, tablas, popups).
 * Los campos largos se editan con el WYSIWYG que guarda Markdown; sin esto,
 * las vistas de listado enseñarían los asteriscos y almohadillas en crudo.
 */
export function stripMarkdown(md: string | null | undefined): string {
    if (!md) return '';
    return md
        .replace(/```[\s\S]*?```/g, ' ')          // bloques de código
        .replace(/`([^`]*)`/g, '$1')              // código inline
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')    // imágenes
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // enlaces → texto
        .replace(/^#{1,6}\s+/gm, '')              // encabezados
        .replace(/^>\s?/gm, '')                   // citas
        .replace(/^\s*[-*+]\s+/gm, '')            // viñetas
        .replace(/^\s*\d+\.\s+/gm, '')            // listas numeradas
        .replace(/^(\s*)([-*_]\s*){3,}$/gm, ' ')  // separadores
        .replace(/(\*\*\*|\*\*|\*|___|__|_|~~)/g, '') // énfasis
        .replace(/\s+/g, ' ')
        .trim();
}
