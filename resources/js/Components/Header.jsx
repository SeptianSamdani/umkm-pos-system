import { Menu, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { 
    UserCircleIcon, 
    UserIcon, 
    ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function Header({ user }) {
    return (
        <header className="fixed right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white text-gray-900 pl-64">
            <div className="flex h-full items-center justify-between px-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Welcome back, {user.name}!
                    </h2>
                    <p className="text-sm text-gray-900">
                        {user.roles?.[0] ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1) : 'User'}
                    </p>
                </div>

                {/* User Menu */}
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-50">
                        <UserCircleIcon className="h-8 w-8 text-gray-900" />
                        <span className="text-sm font-medium">{user.name}</span>
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="p-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href="/profile"
                                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                                                active ? 'bg-gray-100' : ''
                                            }`}
                                        >
                                            <UserIcon className="h-5 w-5" />
                                            Profile
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 ${
                                                active ? 'bg-red-50' : ''
                                            }`}
                                        >
                                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                            Logout
                                        </Link>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
}