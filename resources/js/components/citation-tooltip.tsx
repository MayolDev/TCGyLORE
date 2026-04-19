import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface CitationTooltipProps {
    pageNumber: string;
    context?: string;
}

export function CitationTooltip({ pageNumber, context }: CitationTooltipProps) {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <sup className="cite-number">{pageNumber}</sup>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-xs border-2 border-orange-500/50 bg-slate-900 text-yellow-200"
                >
                    <div className="space-y-1">
                        <p className="font-bold text-orange-400">
                            📖 Referencia: Página {pageNumber}
                        </p>
                        {context && (
                            <p className="text-sm text-yellow-200/80">
                                {context}
                            </p>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
