import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { ChevronIcon } from '../icons';

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  allowCustom?: boolean;
  error?: boolean;
}


/**
 * Combobox component - dropdown with custom input support.
 *
 * Features:
 * - Dropdown with predefined options
 * - Text input for custom values (when allowCustom is true)
 * - Filters options as user types
 * - Keyboard navigation (arrow keys, enter, escape)
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select or type...',
  allowCustom = true,
  error = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on input
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // If custom values are allowed, keep the typed value
        // Otherwise, revert to the last selected value
        if (!allowCustom && !options.includes(inputValue)) {
          setInputValue(value);
        } else if (inputValue !== value) {
          onChange(inputValue);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [allowCustom, inputValue, options, value, onChange]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleOptionSelect = useCallback(
    (option: string) => {
      setInputValue(option);
      onChange(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          } else if (allowCustom && inputValue.trim()) {
            onChange(inputValue.trim());
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setInputValue(value);
          inputRef.current?.blur();
          break;
        case 'Tab':
          if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          } else if (allowCustom && inputValue.trim() && inputValue !== value) {
            onChange(inputValue.trim());
          }
          setIsOpen(false);
          break;
      }
    },
    [
      filteredOptions,
      highlightedIndex,
      handleOptionSelect,
      allowCustom,
      inputValue,
      onChange,
      value,
      isOpen,
    ]
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {/* Input with dropdown toggle */}
      <div
        className={`
          flex items-center
          bg-bg-input
          border rounded-md
          transition-all duration-150 ease-in-out
          ${isOpen ? 'border-augur-blue shadow-[0_0_0_2px_rgba(99,131,255,0.15)]' : ''}
          ${error ? 'border-severity-critical' : 'border-border'}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            flex-1
            bg-transparent
            text-text-primary
            font-sans text-sm
            py-1.5 pl-3 pr-2
            outline-none
            placeholder:text-text-tertiary
          "
        />
        <button
          type="button"
          onClick={toggleDropdown}
          className="px-2 py-1.5 hover:bg-bg-card rounded-r-md transition-colors"
          tabIndex={-1}
        >
          <ChevronIcon isOpen={isOpen} className="w-4 h-4 text-text-tertiary" />
        </button>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div
          className="
            absolute z-50 w-full mt-1
            bg-bg-modal
            border border-border
            rounded-md
            shadow-lg
            max-h-[200px] overflow-y-auto
          "
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  w-full text-left
                  px-3 py-2
                  text-sm
                  transition-colors
                  ${
                    index === highlightedIndex
                      ? 'bg-bg-card text-text-primary'
                      : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'
                  }
                  ${option === value ? 'text-augur-blue font-medium' : ''}
                `}
              >
                {option}
              </button>
            ))
          ) : allowCustom && inputValue.trim() ? (
            <div className="px-3 py-2 text-sm text-text-tertiary">
              Press Enter to use "{inputValue}"
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-text-tertiary">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}
