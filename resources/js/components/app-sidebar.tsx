import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Globe, 
    BookText, 
    Users, 
    MapPin, 
    Clock, 
    Swords,
    UserCircle,
    Sparkles
} from 'lucide-react';
import AppLogo from './app-logo';

const dashboardNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const loreNavItems: NavItem[] = [
    {
        title: 'Mundos',
        href: '/admin/worlds',
        icon: Globe,
    },
    {
        title: 'Historias',
        href: '/admin/stories',
        icon: BookText,
    },
    {
        title: 'Personajes',
        href: '/admin/characters',
        icon: Users,
    },
    {
        title: 'Ubicaciones',
        href: '/admin/locations',
        icon: MapPin,
    },
    {
        title: 'Línea de Tiempo',
        href: '/admin/timeline-events',
        icon: Clock,
    },
];

const tcgNavItems: NavItem[] = [
    {
        title: 'Cartas TCG',
        href: '/admin/cards',
        icon: Swords,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Usuarios',
        href: '/admin/users',
        icon: UserCircle,
    },
];

const footerNavItems: NavItem[] = [];

function NavGroup({ title, items, icon: Icon }: { title: string; items: NavItem[]; icon?: React.ElementType }) {
    const page = usePage();
    
    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="flex items-center gap-2 text-muted-foreground/80 text-xs font-medium tracking-wide mb-1">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {title}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = page.url.startsWith(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={`
                                    transition-all duration-200 
                                    ${isActive ? 'bg-primary/10 border-l-2 border-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]' : ''}
                                `}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <item.icon 
                                            className={`
                                                transition-all duration-200
                                                ${isActive ? 'text-primary scale-110 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]' : ''}
                                            `}
                                        />
                                    )}
                                    <span className={`
                                        transition-all duration-200
                                        ${isActive ? 'font-semibold text-primary' : ''}
                                    `}>
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

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-primary/10">
            <SidebarHeader className="border-b border-primary/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-primary/5">
                            <Link href={dashboard()} prefetch>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                    <AppLogo />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavGroup title="Panel Principal" items={dashboardNavItems} icon={LayoutGrid} />
                <SidebarSeparator className="bg-primary/10" />
                <NavGroup title="Sistema Lore" items={loreNavItems} icon={BookText} />
                <SidebarSeparator className="bg-primary/10" />
                <NavGroup title="TCG Cartas" items={tcgNavItems} icon={Swords} />
                <SidebarSeparator className="bg-primary/10" />
                <NavGroup title="Administración" items={adminNavItems} icon={UserCircle} />
            </SidebarContent>

            <SidebarFooter className="border-t border-primary/10">
                {footerNavItems.length > 0 && <NavFooter items={footerNavItems} className="mt-auto" />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
