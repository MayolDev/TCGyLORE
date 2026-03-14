import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn, resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-xs font-medium tracking-wide text-muted-foreground/80">
                Sistema Lore TCG
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    'transition-all duration-200',
                                    isActive &&
                                        'border-l-2 border-primary bg-primary/10 shadow-[0_0_10px_rgba(var(--primary),0.2)]',
                                )}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <item.icon
                                            className={cn(
                                                'transition-all duration-200',
                                                isActive &&
                                                    'scale-110 text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.5)]',
                                            )}
                                        />
                                    )}
                                    <span
                                        className={cn(
                                            'transition-all duration-200',
                                            isActive &&
                                                'font-semibold text-primary',
                                        )}
                                    >
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
