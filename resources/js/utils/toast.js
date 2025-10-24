import toast from 'react-hot-toast';

const defaultOptions = {
    duration: 4000,
    position: 'top-right',
    style: {
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '8px',
        maxWidth: '400px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
};

// Helper to prevent duplicate toasts
const createToastWithId = (showFn, message, options = {}) => {
    const id = options.id || `toast-${Date.now()}`;
    
    // Dismiss existing toast with same ID
    toast.dismiss(id);
    
    return showFn(message, {
        ...defaultOptions,
        id,
        ...options,
    });
};

// Success Toast
export const showSuccess = (message, options = {}) => {
    return createToastWithId(toast.success, message, {
        duration: 3500,
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

// Error Toast
export const showError = (message, options = {}) => {
    return createToastWithId(toast.error, message, {
        duration: 5000,
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

// Info Toast
export const showInfo = (message, options = {}) => {
    return createToastWithId(toast, message, {
        duration: 4000,
        icon: 'ℹ️',
        style: { 
            ...defaultOptions.style,
            background: '#3b82f6', 
            color: '#fff',
        },
        ...options,
    });
};

// Warning Toast
export const showWarning = (message, options = {}) => {
    return createToastWithId(toast, message, {
        duration: 4500,
        icon: '⚠️',
        style: { 
            ...defaultOptions.style,
            background: '#f59e0b', 
            color: '#fff',
        },
        ...options,
    });
};

// Loading Toast
export const showLoading = (message, options = {}) => {
    const id = options.id || `loading-${Date.now()}`;
    
    return toast.loading(message, {
        ...defaultOptions,
        id,
        duration: Infinity,
        style: { 
            ...defaultOptions.style,
            background: '#6366f1', 
            color: '#fff',
        },
        ...options,
    });
};

// Transition helper with proper timing
const dismissAndShow = (toastId, showFn, message, options = {}) => {
    return new Promise((resolve) => {
        // Dismiss the loading toast
        if (toastId) {
            toast.dismiss(toastId);
        }
        
        // Wait for dismiss animation to complete
        setTimeout(() => {
            const newToastId = showFn(message, {
                ...options,
                id: `transition-${Date.now()}`, // Ensure unique ID
            });
            resolve(newToastId);
        }, 200); // 200ms for smooth transition
    });
};

// Success after loading
export const showSuccessAfterLoading = async (loadingToastId, message, options = {}) => {
    return dismissAndShow(loadingToastId, showSuccess, message, options);
};

// Error after loading
export const showErrorAfterLoading = async (loadingToastId, message, options = {}) => {
    return dismissAndShow(loadingToastId, showError, message, options);
};

// Info after loading
export const showInfoAfterLoading = async (loadingToastId, message, options = {}) => {
    return dismissAndShow(loadingToastId, showInfo, message, options);
};

// Dismiss utilities
export const dismiss = (toastId) => {
    toast.dismiss(toastId);
};

export const dismissAll = () => {
    toast.dismiss();
};

// Promise-based toast (for async operations)
export const showPromise = (promise, messages, options = {}) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading || 'Loading...',
            success: messages.success || 'Success!',
            error: messages.error || 'Error occurred',
        },
        {
            ...defaultOptions,
            ...options,
            style: {
                ...defaultOptions.style,
                ...options.style,
            },
        }
    );
};

// Custom toast with custom icon
export const showCustom = (message, options = {}) => {
    const id = options.id || `custom-${Date.now()}`;
    
    toast.dismiss(id);
    
    return toast(message, {
        ...defaultOptions,
        id,
        duration: options.duration || 5000,
        position: options.position || 'top-right',
        icon: options.icon || '🔔',
        style: {
            ...defaultOptions.style,
            background: options.background || '#8b5cf6',
            color: '#fff',
            ...options.style,
        },
        ...options,
    });
};

export default {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    loading: showLoading,
    successAfterLoading: showSuccessAfterLoading,
    errorAfterLoading: showErrorAfterLoading,
    infoAfterLoading: showInfoAfterLoading,
    promise: showPromise,
    custom: showCustom,
    dismiss,
    dismissAll,
};