import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookText,
    Clock,
    Flame,
    Globe,
    LayoutGrid,
    MapPin,
    Swords,
    UserCircle,
    Users,
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

function NavGroup({
    title,
    items,
    icon: Icon,
}: {
    title: string;
    items: NavItem[];
    icon?: React.ElementType;
}) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel
                className="mb-2 flex items-center gap-2 text-xs font-black tracking-wider text-yellow-400/80 uppercase"
                style={{ fontFamily: 'Cinzel, serif' }}
            >
                {Icon && <Icon className="h-4 w-4 text-yellow-500" />}
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
                                className={`transition-all duration-200 ${isActive ? 'border-l-4 border-yellow-500 bg-yellow-600/20 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'hover:border-l-2 hover:border-yellow-600/50 hover:bg-yellow-600/10'} `}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <item.icon
                                            className={`transition-all duration-200 ${isActive ? 'scale-110 text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-yellow-200/60 group-hover:text-yellow-300'} `}
                                        />
                                    )}
                                    <span
                                        className={`font-semibold transition-all duration-200 ${isActive ? 'font-black text-yellow-100' : 'text-yellow-200/80'} `}
                                        style={{
                                            fontFamily: isActive
                                                ? 'Cinzel, serif'
                                                : 'inherit',
                                        }}
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

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r-2 border-yellow-900/30"
        >
            <SidebarHeader className="border-b-2 border-yellow-900/30 bg-gradient-to-b from-slate-900/50 to-transparent">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-yellow-600/10"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavGroup
                    title="Panel Principal"
                    items={dashboardNavItems}
                    icon={LayoutGrid}
                />
                <SidebarSeparator className="bg-yellow-900/30" />
                <NavGroup
                    title="Sistema Lore"
                    items={loreNavItems}
                    icon={BookText}
                />
                <SidebarSeparator className="bg-yellow-900/30" />
                <NavGroup title="TCG Cartas" items={tcgNavItems} icon={Flame} />
                <SidebarSeparator className="bg-yellow-900/30" />
                <NavGroup
                    title="Administración"
                    items={adminNavItems}
                    icon={UserCircle}
                />
            </SidebarContent>

            <SidebarFooter className="border-t-2 border-yellow-900/30">
                {footerNavItems.length > 0 && (
                    <NavFooter items={footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
