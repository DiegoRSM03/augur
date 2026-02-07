import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'default' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-augur-blue text-white border-augur-blue hover:brightness-110',
  secondary:
    'bg-transparent text-text-primary border-border hover:bg-bg-card hover:border-border-hover',
  ghost:
    'bg-transparent text-text-secondary border-transparent hover:bg-bg-card hover:text-text-primary',
  danger:
    'bg-severity-critical-bg text-severity-critical border-severity-critical-border hover:brightness-110',
};

const sizeStyles: Record<ButtonSize, string> = {
  default: 'px-3.5 py-1.5 text-sm',
  sm: 'px-2.5 py-1 text-xs',
};

/**
 * Button component with multiple variants and sizes
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'default', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-md
          font-sans font-semibold
          cursor-pointer
          transition-all duration-150 ease-in-out
          border
          whitespace-nowrap
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
