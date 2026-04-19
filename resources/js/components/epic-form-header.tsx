import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { X, type LucideIcon } from 'lucide-react';

interface EpicFormHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
    cancelLink: string;
}

export default function EpicFormHeader({
    icon: Icon,
    title,
    description,
    cancelLink,
}: EpicFormHeaderProps) {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h1
                    className="flex items-center gap-3 bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
                    <Icon className="h-8 w-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                    {title}
                </h1>
                <p className="mt-2 font-semibold text-yellow-200/70">
                    {description}
                </p>
            </div>
            <Button
                variant="outline"
                size="lg"
                asChild
                className="border-red-500/50 font-bold text-red-300 hover:bg-red-600/20 hover:text-red-200"
            >
                <Link href={cancelLink}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                </Link>
            </Button>
        </div>
    );
}
