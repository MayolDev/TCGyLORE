import { Link } from '@inertiajs/react';
import { Hammer, Layers, Swords } from 'lucide-react';

/**
 * La Biblioteca une Cartas, Mazos y Taller en una sola sección con pestañas.
 */
const TABS = [
    { key: 'cartas', titulo: 'Cartas', href: '/admin/cards', Icon: Swords },
    { key: 'mazos', titulo: 'Mazos', href: '/admin/decks', Icon: Layers },
    { key: 'taller', titulo: 'Taller', href: '/admin/cards-taller', Icon: Hammer },
] as const;

export default function LibraryTabs({ active }: { active: 'cartas' | 'mazos' | 'taller' }) {
    return (
        <div className="flex w-fit overflow-hidden rounded-lg border-2 border-yellow-500/40 bg-slate-900/70">
            {TABS.map(({ key, titulo, href, Icon }) => (
                <Link
                    key={key}
                    href={href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-black transition-colors ${
                        active === key
                            ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-inner'
                            : 'text-yellow-200/60 hover:bg-yellow-600/10 hover:text-yellow-200'
                    }`}
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
                    <Icon className="h-4 w-4" />
                    {titulo}
                </Link>
            ))}
        </div>
    );
}
