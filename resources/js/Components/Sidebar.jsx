import { useState } from 'react';
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
  Bars3Icon
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
            className={`fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white flex flex-col transition-all duration-300 ease-in-out 
                ${isCollapsed ? 'w-30' : 'w-64'}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-indigo-600 px-4 h-16">
                {!isCollapsed && (
                    <h1 className="text-lg font-bold text-indigo-50 tracking-wide transition-opacity duration-300">
                        UMKM POS
                    </h1>
                )}
                <button
                    onClick={() => onToggleCollapse(!isCollapsed)}
                    className="p-1 rounded-md hover:bg-indigo-100 text-indigo-50 transition"
                >
                    <Bars3Icon className="h-5 w-5" />
                </button>
            </div>

            {/* User Info */}
            <div className={`flex items-center gap-3 p-4 border-b border-gray-100 transition-all duration-300
                ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {user?.name?.[0]?.toUpperCase()}
                </div>
                {!isCollapsed && (
                    <div className="transition-opacity duration-300">
                        <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0] || 'User'}</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-6 custom-scrollbar">
                {navigationGroups.map((group) => (
                    <div key={group.title}>
                        {!isCollapsed && (
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{group.title}</p>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                if (!hasPermission(item)) return null;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out group
                                            ${active
                                                ? 'bg-indigo-50 text-indigo-700 before:content-[""] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-indigo-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600 hover:translate-x-1'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}

                                        {/* Tooltip saat collapse */}
                                        {isCollapsed && (
                                            <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
                    © {new Date().getFullYear()} UMKM POS v1.0
                </div>
            )}
        </aside>
    );
}
