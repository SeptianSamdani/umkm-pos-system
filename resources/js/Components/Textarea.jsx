import { forwardRef, useState } from 'react';

const Textarea = forwardRef(({
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    placeholder,
    required = false,
    disabled = false,
    rows = 4,
    maxLength,
    showCharCount = false,
    className = '',
    helperText,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseClasses = "block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200 resize-none";
    const errorClasses = "border-red-300 focus:border-red-500 focus:ring-red-500";
    const normalClasses = "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";
    
    const focusClasses = isFocused ? "ring-2 ring-indigo-500 ring-opacity-20" : "";

    const handleFocus = (e) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const charCount = value?.length || 0;

    return (
        <div className={className}>
            {label && (
                <div className="flex items-center justify-between mb-2">
                    <label 
                        htmlFor={name}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {showCharCount && maxLength && (
                        <span className={`text-xs ${
                            charCount > maxLength ? 'text-red-600' : 'text-gray-500'
                        }`}>
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
            )}
            
            <div className={`relative rounded-lg ${focusClasses}`}>
                <textarea
                    ref={ref}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                    maxLength={maxLength}
                    className={`
                        ${baseClasses}
                        ${error ? errorClasses : normalClasses}
                        ${isFocused ? 'border-indigo-500' : ''}
                        pr-10
                    `}
                    {...props}
                />
            </div>

            {(error || helperText) && (
                <div className="mt-1">
                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    {helperText && !error && (
                        <p className="text-sm text-gray-500">
                            {helperText}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;