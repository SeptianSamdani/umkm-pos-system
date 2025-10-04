import { forwardRef } from 'react';

const Input = forwardRef(({ 
    type = 'text', 
    className = '', 
    error,
    ...props 
}, ref) => {
    return (
        <div className="w-full">
            <input
                type={type}
                className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    error ? 'border-red-500' : ''
                } ${className}`}
                ref={ref}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

export default Input;