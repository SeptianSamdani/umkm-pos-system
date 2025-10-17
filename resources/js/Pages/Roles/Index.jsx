// ========================================
// FILE: resources/js/Pages/Roles/Index.jsx
// ========================================
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function RolesIndex({ roles }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const handleDelete = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            router.delete(route('roles.destroy', roleToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setRoleToDelete(null);
                },
            });
        }
    };

    const isDefaultRole = (roleName) => {
        return ['owner', 'manager', 'cashier'].includes(roleName);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Roles Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Roles Management</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage roles and permissions
                        </p>
                    </div>
                    <Link href={route('roles.create')}>
                        <Button className="flex items-center gap-2">
                            <PlusIcon className="h-5 w-5" />
                            Add Role
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <Card key={role.id}>
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-indigo-100 p-3">
                                            <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold capitalize text-gray-900">
                                                {role.name}
                                            </h3>
                                            {isDefaultRole(role.name) && (
                                                <span className="text-xs text-gray-500">
                                                    Default Role
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Users</p>
                                        <p className="font-semibold text-gray-900">
                                            {role.users_count}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Permissions</p>
                                        <p className="font-semibold text-gray-900">
                                            {role.permissions_count}
                                        </p>
                                    </div>
                                </div>

                                {!isDefaultRole(role.name) && (
                                    <div className="flex gap-2 border-t pt-4">
                                        <Link
                                            href={route('roles.edit', role.id)}
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="secondary"
                                                className="flex w-full items-center justify-center gap-2"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(role)}
                                            className="flex items-center gap-2"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Delete Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                maxWidth="md"
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Delete Role</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete "
                        <strong>{roleToDelete?.name}</strong>" role?
                    </p>
                    {roleToDelete && roleToDelete.users_count > 0 && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3">
                            <p className="text-sm text-red-800">
                                ⚠️ This role has {roleToDelete.users_count} user(s). Cannot
                                delete!
                            </p>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            disabled={roleToDelete && roleToDelete.users_count > 0}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}