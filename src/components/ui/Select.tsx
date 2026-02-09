import { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
}

/**
 * Chevron down icon for select dropdown
 */
function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="pointer-events-none"
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}

/**
 * Select dropdown component
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="relative inline-flex">
        <select
          ref={ref}
          className={`
            appearance-none
            bg-bg-input
            border border-border
            rounded-md
            text-text-primary
            font-sans text-sm
            py-1.5 pl-3 pr-8
            cursor-pointer
            outline-none
            transition-[border-color,box-shadow] duration-150 ease-in-out
            focus:border-augur-blue
            focus:shadow-[0_0_0_2px_rgba(99,131,255,0.15)]
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-[10px] top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
          <ChevronDown />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
