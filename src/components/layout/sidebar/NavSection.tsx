import { NavItem } from './NavItem';
import type { NavSection } from './navConfig';

interface NavSectionProps {
  section: NavSection;
  startIndex: number;
  onNavigate?: () => void;
}

export function NavSection({ section, startIndex, onNavigate }: NavSectionProps) {
  return (
    <div className="mb-2">
      {section.label && (
        <div className="py-3 px-5 pb-2 text-[10px] font-semibold uppercase tracking-[1.2px] text-text-tertiary">
          {section.label}
        </div>
      )}
      {section.items.map((item, index) => (
        <NavItem key={index} item={item} globalIndex={startIndex + index} onNavigate={onNavigate} />
      ))}
    </div>
  );
}
