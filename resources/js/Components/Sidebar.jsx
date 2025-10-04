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
    TagIcon
} from '@heroicons/react/24/outline';

export default function Sidebar({ user }) {
    const navigation = [
        { 
            name: 'Dashboard', 
            href: '/dashboard', 
            icon: HomeIcon,
            permission: null 
        },
        { 
            name: 'Products', 
            href: '/products', 
            icon: CubeIcon,
            permission: 'view products' 
        },
        { 
            name: 'Categories', 
            href: '/categories', 
            icon: TagIcon,
            permission: 'view products' 
        },
        { 
            name: 'Sales', 
            href: '/sales', 
            icon: ShoppingBagIcon,
            permission: 'view sales' 
        },
        { 
            name: 'Purchases', 
            href: '/purchases', 
            icon: TruckIcon,
            permission: 'view purchases' 
        },
        { 
            name: 'Customers', 
            href: '/customers', 
            icon: UserGroupIcon,
            permission: 'view customers' 
        },
        { 
            name: 'Suppliers', 
            href: '/suppliers', 
            icon: TruckIcon,
            permission: 'view suppliers' 
        },
        { 
            name: 'Stock Logs', 
            href: '/stock-logs', 
            icon: DocumentTextIcon,
            permission: 'view stock logs' 
        },
        { 
            name: 'Reports', 
            href: '/reports/sales', 
            icon: ChartBarIcon,
            permission: 'view reports' 
        },
        { 
            name: 'Settings', 
            href: '/settings', 
            icon: Cog6ToothIcon,
            permission: 'manage settings' 
        },
    ];

    const hasPermission = (permission) => {
        if (!permission) return true;
        return user?.permissions?.includes(permission);
    };

    const isActive = (href) => {
        return window.location.pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b border-gray-200">
                <h1 className="text-2xl font-bold text-indigo-600">POS System</h1>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 p-4">
                {navigation.map((item) => {
                    if (!hasPermission(item.permission)) return null;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isActive(item.href)
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}