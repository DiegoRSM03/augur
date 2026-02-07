import type { Indicator } from '../../types/indicator';
import { Badge, Tag, ConfidenceBar } from '../ui';
import { formatRelativeTime, getTagColor, getTypeIcon, getTypeLabel } from '../../utils/formatters';

interface TableRowProps {
  indicator: Indicator;
  isSelected: boolean;
  isActive?: boolean;
  onSelect: (indicator: Indicator) => void;
  onClick: (id: string) => void;
}

/**
 * Table row component for displaying a single indicator
 * 
 * - isSelected: checkbox is checked (multi-select for export)
 * - isActive: row is highlighted because detail panel is open
 */
export function TableRow({
  indicator,
  isSelected,
  isActive = false,
  onSelect,
  onClick,
}: TableRowProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(indicator);
  };

  const handleRowClick = () => {
    onClick(indicator.id);
  };

  // Row is highlighted if selected (checkbox) OR active (detail panel open)
  const isHighlighted = isSelected || isActive;

  return (
    <tr
      className={`
        border-b border-border-subtle
        transition-colors duration-100
        cursor-pointer
        ${isHighlighted ? 'bg-augur-blue-dim' : 'hover:bg-bg-card-hover'}
      `}
      onClick={handleRowClick}
    >
      {/* Checkbox */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="accent-augur-blue"
        />
      </td>

      {/* Indicator value */}
      <td className="px-4 py-3">
        <span
          className={`
            font-mono text-[12.5px] font-medium text-augur-blue
            ${indicator.type === 'hash' ? 'text-[11px]' : ''}
          `}
        >
          {indicator.value}
        </span>
      </td>

      {/* Type */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase text-text-secondary tracking-wide whitespace-nowrap">
          {getTypeIcon(indicator.type)} {getTypeLabel(indicator.type)}
        </span>
      </td>

      {/* Severity */}
      <td className="px-4 py-3">
        <Badge severity={indicator.severity} />
      </td>

      {/* Confidence */}
      <td className="px-4 py-3">
        <ConfidenceBar value={indicator.confidence} severity={indicator.severity} />
      </td>

      {/* Source */}
      <td className="px-4 py-3">
        <span className="text-xs text-text-secondary">{indicator.source}</span>
      </td>

      {/* Tags */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {indicator.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} color={getTagColor(tag)}>
              {tag}
            </Tag>
          ))}
          {indicator.tags.length > 3 && (
            <Tag color="gray">+{indicator.tags.length - 3}</Tag>
          )}
        </div>
      </td>

      {/* Last Seen */}
      <td className="px-4 py-3">
        <span className="text-xs text-text-tertiary whitespace-nowrap">
          {formatRelativeTime(indicator.lastSeen)}
        </span>
      </td>
    </tr>
  );
}
