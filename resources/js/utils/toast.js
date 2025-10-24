// FILE: resources/js/utils/toast.js
// UPDATE dengan transition helper

import toast from 'react-hot-toast';

const defaultOptions = {
    duration: 4000, // ✅ Increase default duration
    position: 'top-right',
    style: {
        fontSize: '14px',
        fontWeight: '500',
        padding: '12px 20px',
        borderRadius: '8px',
        maxWidth: '400px',
    },
};

// ✅ ADD: Helper untuk dismiss dan show dengan delay
const dismissAndShow = (toastId, showFn, message, options = {}) => {
    if (toastId) {
        toast.dismiss(toastId);
    }
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const newToastId = showFn(message, options);
            resolve(newToastId);
        }, 150); // ✅ 150ms delay untuk smooth transition
    });
};

export const showSuccess = (message, options = {}) => {
    const id = options.id || `success-${Date.now()}`;
    
    if (toast.isActive && toast.isActive(id)) {
        toast.dismiss(id);
    }
    
    return toast.success(message, {
        ...defaultOptions,
        id,
        duration: 4000, // ✅ Longer duration
        style: { 
            ...defaultOptions.style,
            background: '#10b981', 
            color: '#fff',
        },
        iconTheme: { 
            primary: '#fff', 
            secondary: '#10b981' 
        },
        ...options,
    });
};

export const showError = (message, options = {}) => {
    const id = options.id || `error-${Date.now()}`;
    
    if (toast.isActive && toast.isActive(id)) {
        toast.dismiss(id);
    }
    
    return toast.error(message, {
        ...defaultOptions,
        id,
        duration: 5000, // ✅ Even longer for errors
        style: { 
            ...defaultOptions.style,
            background: '#ef4444', 
            color: '#fff',
        },
        iconTheme: { 
            primary: '#fff', 
            secondary: '#ef4444' 
        },
        ...options,
    });
};

export const showInfo = (message, options = {}) => {
    const id = options.id || `info-${Date.now()}`;
    
    if (toast.isActive && toast.isActive(id)) {
        toast.dismiss(id);
    }
    
    return toast(message, {
        ...defaultOptions,
        id,
        icon: 'ℹ️',
        style: { 
            ...defaultOptions.style,
            background: '#3b82f6', 
            color: '#fff',
        },
        ...options,
    });
};

export const showLoading = (message, options = {}) => {
    return toast.loading(message, {
        ...defaultOptions,
        duration: Infinity, // ✅ Loading toast shouldn't auto-dismiss
        style: { 
            ...defaultOptions.style,
            background: '#f59e0b', 
            color: '#fff',
        },
        ...options,
    });
};

// ✅ ADD: Smooth transition helper
export const showSuccessAfterLoading = async (loadingToastId, message, options = {}) => {
    return dismissAndShow(loadingToastId, showSuccess, message, options);
};

export const showErrorAfterLoading = async (loadingToastId, message, options = {}) => {
    return dismissAndShow(loadingToastId, showError, message, options);
};

export const dismissAll = () => {
    toast.dismiss();
};

export const dismiss = (toastId) => {
    toast.dismiss(toastId);
};