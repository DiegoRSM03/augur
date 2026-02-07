import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

/**
 * Input component with optional leading icon
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className = '', ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary w-4 h-4">
            {icon}
          </div>
          <input
            ref={ref}
            className={`
              w-full
              bg-bg-input
              border border-border
              rounded-md
              text-text-primary
              font-sans text-sm
              py-1.5 pl-8 pr-3
              outline-none
              transition-all duration-150 ease-in-out
              placeholder:text-text-tertiary
              focus:border-augur-blue
              focus:shadow-[0_0_0_2px_rgba(99,131,255,0.15)]
              ${className}
            `}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={`
          w-full
          bg-bg-input
          border border-border
          rounded-md
          text-text-primary
          font-sans text-sm
          py-1.5 px-3
          outline-none
          transition-all duration-150 ease-in-out
          placeholder:text-text-tertiary
          focus:border-augur-blue
          focus:shadow-[0_0_0_2px_rgba(99,131,255,0.15)]
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
