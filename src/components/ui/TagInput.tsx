import { useState, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { Tag } from './Tag';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
}

// X icon for removing tags
const CloseIcon = () => (
  <svg
    className="w-3 h-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * TagInput component for entering multiple tags as chips.
 *
 * Features:
 * - Press Enter or comma to add a tag
 * - Click X to remove a tag
 * - Prevents duplicate tags
 * - Shows error state when error prop is true
 */
export function TagInput({
  tags,
  onChange,
  placeholder = 'Add tag...',
  error = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = useCallback(
    (value: string) => {
      const trimmed = value.trim().toLowerCase();

      // Don't add empty or duplicate tags
      if (!trimmed || tags.includes(trimmed)) {
        return;
      }

      onChange([...tags, trimmed]);
      setInputValue('');
    },
    [tags, onChange]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onChange(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
        // Remove last tag when backspace is pressed on empty input
        const lastTag = tags[tags.length - 1];
        if (lastTag) {
          removeTag(lastTag);
        }
      }
    },
    [inputValue, tags, addTag, removeTag]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // Filter out commas as they're used as delimiters
    const value = e.target.value.replace(',', '');
    setInputValue(value);
  }, []);

  const handleBlur = useCallback(() => {
    // Add tag on blur if there's a value
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  }, [inputValue, addTag]);

  return (
    <div
      className={`
        flex flex-wrap items-center gap-1.5
        min-h-[38px]
        bg-bg-input
        border rounded-md
        px-2 py-1.5
        transition-all duration-150 ease-in-out
        focus-within:border-augur-blue
        focus-within:shadow-[0_0_0_2px_rgba(99,131,255,0.15)]
        ${error ? 'border-severity-critical' : 'border-border'}
      `}
    >
      {/* Rendered tag chips */}
      {tags.map((tag) => (
        <Tag key={tag} color="blue" className="gap-1 pr-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-0.5 hover:text-severity-critical transition-colors"
            aria-label={`Remove ${tag} tag`}
          >
            <CloseIcon />
          </button>
        </Tag>
      ))}

      {/* Input field */}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="
          flex-1 min-w-[80px]
          bg-transparent
          text-text-primary
          font-sans text-sm
          outline-none
          placeholder:text-text-tertiary
        "
      />
    </div>
  );
}
