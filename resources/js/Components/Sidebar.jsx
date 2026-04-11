import { Link } from '@inertiajs/react';
import {
    HomeIcon,
    ShoppingBagIcon,
    CubeIcon,
    UserGroupIcon,
    TruckIcon,
    DocumentTextIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    TagIcon,
    ShieldCheckIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar({ user, isCollapsed, onToggleCollapse }) {

    const navigationGroups = [
        {
            title: 'Main',
            items: [
                { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
                { name: 'POS', href: '/pos', icon: ShoppingBagIcon, permission: 'create sales' },
            ],
        },
        {
            title: 'Inventory',
            items: [
                { name: 'Products', href: '/products', icon: CubeIcon, permission: 'view products' },
                { name: 'Categories', href: '/categories', icon: TagIcon, permission: 'view products' },
                { name: 'Stock Logs', href: '/stock-logs', icon: DocumentTextIcon, permission: 'view stock logs' },
            ],
        },
        {
            title: 'Sales & Purchase',
            items: [
                { name: 'Sales', href: '/sales', icon: ShoppingBagIcon, permission: 'view sales' },
                { name: 'Purchases', href: '/purchases', icon: TruckIcon, permission: 'view purchases' },
                { name: 'Reports', href: '/reports/sales', icon: ChartBarIcon, permission: 'view reports' },
            ],
        },
        {
            title: 'People',
            items: [
                { name: 'Customers', href: '/customers', icon: UserGroupIcon, permission: 'view customers' },
                { name: 'Suppliers', href: '/suppliers', icon: TruckIcon, permission: 'view suppliers' },
                { name: 'Users', href: '/users', icon: UserGroupIcon, permission: 'manage users' },
                { name: 'Roles', href: '/roles', icon: ShieldCheckIcon, permission: 'manage roles', requiredRole: 'owner' },
            ],
        },
        {
            title: 'System',
            items: [
                { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, permission: 'manage settings' },
            ],
        },
    ];

    const hasPermission = (item) => {
        if (!item.permission) return true;
        if (item.requiredRole && !user?.roles?.includes(item.requiredRole)) return false;
        return !!user?.permissions?.includes(item.permission);
    };

    const isActive = (href) => window.location.pathname.startsWith(href);

    return (
        <aside
            className={`fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white flex flex-col
                transition-[width] duration-300 ease-in-out overflow-hidden
                ${isCollapsed ? 'w-[72px]' : 'w-64'}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-indigo-700 bg-indigo-600 px-3 h-16 shrink-0">
                {/* Logo - fade out saat collapse */}
                <span className={`text-lg font-bold text-white tracking-wide whitespace-nowrap
                    transition-[opacity,width] duration-200
                    ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                    UMKM POS
                </span>

                {/* Toggle Button */}
                <button
                    onClick={onToggleCollapse}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className={`shrink-0 rounded-md p-1.5 text-indigo-100 hover:bg-indigo-700 hover:text-white
                        active:scale-90 transition-all duration-150
                        ${isCollapsed ? 'mx-auto' : ''}`}
                >
                    {isCollapsed
                        ? <ChevronDoubleRightIcon className="h-5 w-5" />
                        : <ChevronDoubleLeftIcon className="h-5 w-5" />
                    }
                </button>
            </div>

            {/* User Info */}
            <div className={`flex items-center gap-3 p-3 border-b border-gray-100 shrink-0
                transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                {/* Avatar */}
                <div className="shrink-0 h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center
                    text-indigo-600 font-semibold text-sm">
                    {user?.name?.[0]?.toUpperCase()}
                </div>

                {/* Name & Role - fade out saat collapse */}
                <div className={`overflow-hidden transition-[opacity,width] duration-200 whitespace-nowrap
                    ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0] || 'User'}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 custom-scrollbar">
                {navigationGroups.map((group) => {
                    const visibleItems = group.items.filter(hasPermission);
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={group.title} className="mb-4">
                            {/* Group Label */}
                            <div className={`px-4 mb-1 transition-[opacity,height] duration-200 overflow-hidden
                                ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-5'}`}>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {group.title}
                                </p>
                            </div>

                            {/* Divider saat collapse sebagai pengganti label */}
                            {isCollapsed && (
                                <div className="mx-3 mb-2 border-t border-gray-100" />
                            )}

                            <div className="space-y-0.5 px-2">
                                {visibleItems.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`relative flex items-center rounded-lg px-2 py-2 text-sm font-medium
                                                transition-all duration-150 ease-in-out group
                                                ${isCollapsed ? 'justify-center' : 'gap-3'}
                                                ${active
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                                                }`}
                                        >
                                            {/* Active indicator bar */}
                                            {active && (
                                                <span className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-indigo-600" />
                                            )}

                                            {/* Icon */}
                                            <item.icon className={`shrink-0 h-5 w-5 transition-transform duration-150
                                                ${!active && 'group-hover:scale-110'}`}
                                            />

                                            {/* Label - fade out saat collapse */}
                                            <span className={`whitespace-nowrap transition-[opacity,width] duration-200
                                                ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                                                {item.name}
                                            </span>

                                            {/* Tooltip saat collapsed */}
                                            {isCollapsed && (
                                                <span className="pointer-events-none absolute left-full ml-3 z-50
                                                    rounded-md bg-gray-900 px-2 py-1 text-xs text-white whitespace-nowrap
                                                    opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
                                                    transition-all duration-150 shadow-lg">
                                                    {item.name}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className={`border-t border-gray-100 shrink-0 overflow-hidden
                transition-[opacity,height,padding] duration-200
                ${isCollapsed ? 'opacity-0 h-0 py-0' : 'opacity-100 h-auto py-3 px-4'}`}>
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} UMKM POS v1.0</p>
            </div>
        </aside>
    );
}