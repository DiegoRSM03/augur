type TagColor = 'red' | 'blue' | 'purple' | 'teal' | 'gray';

interface TagProps {
  color?: TagColor;
  children: React.ReactNode;
  className?: string;
}

const colorStyles: Record<TagColor, string> = {
  red: 'bg-tag-red text-tag-red-text border-tag-red-border',
  blue: 'bg-tag-blue text-tag-blue-text border-tag-blue-border',
  purple: 'bg-tag-purple text-tag-purple-text border-tag-purple-border',
  teal: 'bg-tag-teal text-tag-teal-text border-tag-teal-border',
  gray: 'bg-tag-gray text-tag-gray-text border-tag-gray-border',
};

/**
 * Tag component for displaying labels and categories
 */
export function Tag({ color = 'gray', children, className = '' }: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5
        rounded-sm
        text-xs font-medium
        border
        ${colorStyles[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
