import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function WriterLayout({ children, breadcrumbs }: Props) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <div className="min-h-screen">
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <div className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                            <div className="mx-auto max-w-5xl px-8 py-4">
                                <Breadcrumbs breadcrumbs={breadcrumbs} />
                            </div>
                        </div>
                    )}
                    <div className="mx-auto max-w-5xl px-8 py-8">
                        {children}
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
