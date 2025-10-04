import { usePage } from '@inertiajs/react';

export default function usePermission() {
    const { auth } = usePage().props;

    const can = (permission) => {
        return auth.user?.permissions?.includes(permission) || false;
    };

    const hasRole = (role) => {
        return auth.user?.roles?.includes(role) || false;
    };

    return { can, hasRole };
}