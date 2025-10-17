// ========================================
// FILE: resources/js/Pages/Users/Index.jsx
// ========================================
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function UsersIndex({ users, filters, roles }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('users.index'), 
            { search, role: roleFilter },
            { preserveState: true }
        );
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(route('users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    const columns = [
        {
            label: 'Name',
            key: 'name',
            render: (user) => (
                <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            ),
        },
        {
            label: 'Phone',
            key: 'phone',
        },
        {
            label: 'Role',
            key: 'roles',
            render: (user) => (
                <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 capitalize">
                    {user.roles?.[0]?.name || 'No Role'}
                </span>
            ),
        },
        {
            label: 'Status',
            key: 'is_active',
            render: (user) => (
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        user.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {user.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Users Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage system users and their roles
                        </p>
                    </div>
                    <Link href={route('users.create')}>
                        <Button className="flex items-center gap-2">
                            <PlusIcon className="h-5 w-5" />
                            Add User
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-48"
                        >
                            <option value="">All Roles</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>
                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                </option>
                            ))}
                        </Select>
                        <Button type="submit">Search</Button>
                    </form>
                </Card>

                {/* Table */}
                <Card>
                    <Table
                        columns={columns}
                        data={users.data}
                        actions={(user) => (
                            <div className="flex items-center justify-end gap-2">
                                <Link href={route('users.edit', user.id)}>
                                    <button className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(user)}
                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    />
                    <Pagination links={users.links} />
                </Card>
            </div>

            {/* Delete Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                maxWidth="md"
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete "<strong>{userToDelete?.name}</strong>"?
                        This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}