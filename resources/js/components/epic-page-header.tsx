import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus, type LucideIcon } from 'lucide-react';

interface EpicPageHeaderProps {
    title: string;
    description: string;
    icon?: string;
    createLink?: string;
    createLabel?: string;
    CreateIcon?: LucideIcon;
}

export default function EpicPageHeader({
    title,
    description,
    icon = '',
    createLink,
    createLabel = 'Crear',
    CreateIcon = Plus,
}: EpicPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1
                    className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent uppercase drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
                    {title}
                </h1>
                <p className="mt-2 text-base font-semibold text-yellow-200/70">
                    {icon && <span className="mr-2">{icon}</span>}
                    {description}
                </p>
            </div>
            {createLink && (
                <Button
                    variant="magical"
                    size="lg"
                    asChild
                    className="border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 font-black text-white shadow-xl shadow-orange-500/50 hover:from-yellow-500 hover:to-red-500"
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
                    <Link href={createLink}>
                        <CreateIcon className="mr-2 h-5 w-5" />
                        {createLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
}
