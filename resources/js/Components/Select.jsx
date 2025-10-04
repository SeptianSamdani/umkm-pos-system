import { forwardRef } from 'react';

const Select = forwardRef(({ 
    className = '', 
    error,
    children,
    ...props 
}, ref) => {
    return (
        <div className="w-full">
            <select
                className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    error ? 'border-red-500' : ''
                } ${className}`}
                ref={ref}
                {...props}
            >
                {children}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

export default Select;