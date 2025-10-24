// resources/js/utils/toast.js
import toast from 'react-hot-toast';

export const showSuccess = (message, options = {}) => {
    const id = options.id;
    if (id && toast.isActive(id)) return id;
    return toast.success(message, {
        style: { background: '#10b981', color: '#fff', fontWeight: '500' },
        iconTheme: { primary: '#fff', secondary: '#10b981' },
        ...options,
    });
};

export const showError = (message, options = {}) => {
    const id = options.id;
    if (id && toast.isActive(id)) return id;
    return toast.error(message, {
        style: { background: '#ef4444', color: '#fff', fontWeight: '500' },
        iconTheme: { primary: '#fff', secondary: '#ef4444' },
        ...options,
    });
};

export const showInfo = (message, options = {}) => {
    const id = options.id;
    if (id && toast.isActive(id)) return id;
    return toast(message, {
        icon: 'ℹ️',
        style: { background: '#3b82f6', color: '#fff', fontWeight: '500' },
        ...options,
    });
};

export const showLoading = (message, options = {}) => {
    // don't force static id; return the toast id so caller can dismiss it
    return toast.loading(message, {
        style: { background: '#f59e0b', color: '#fff', fontWeight: '500' },
        ...options,
    });
};