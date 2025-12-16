import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    rounded?: 'full' | 'xl' | 'lg' | 'md'; // Allow override but default to 'full' for modernization
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    rounded = 'lg', // Defaulting to lg as per user request
    className = '',
    children,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {

    const baseStyles = "inline-flex items-center justify-center transition-all font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-background hover:opacity-90 shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-primary hover:bg-input",
        outline: "border border-border bg-transparent text-zinc-500 hover:text-primary hover:border-zinc-400 hover:bg-surface",
        ghost: "bg-transparent text-zinc-500 hover:text-primary hover:bg-input/50",
        danger: "bg-red-500/10 text-red-600 hover:bg-red-500/20"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2",
        icon: "h-9 w-9 p-0 flex items-center justify-center"
    };

    const roundedStyles = {
        full: "rounded-full",
        xl: "rounded-xl",
        lg: "rounded-lg",
        md: "rounded-md"
    };

    const loadingSpinner = (
        <svg className="animate-spin -ml-1 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    return (
        <button
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${roundedStyles[rounded]}
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <span className="mr-2">{loadingSpinner}</span>}
            {!isLoading && leftIcon && <span className={`flex items-center justify-center ${size === 'icon' ? '' : ''}`}>{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className={`flex items-center justify-center ${size === 'icon' ? '' : ''}`}>{rightIcon}</span>}
        </button>
    );
};

export default Button;
