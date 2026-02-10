import { NavSection } from './NavSection';
import { navSections } from './navConfig';
import { AugurLogo } from '../../ui/icons';

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  let runningIndex = 0;
  const sectionStartIndices = navSections.map((section) => {
    const start = runningIndex;
    runningIndex += section.items.length;
    return start;
  });

  return (
    <>
      <div className="px-2 pb-6">
        <div className="flex items-center gap-3 px-3 rounded-lg bg-[#0d0f14]">
          <AugurLogo />
          <span className="font-sans text-[18px] font-bold tracking-[3px] uppercase text-white">
            Augur
          </span>
        </div>
      </div>

      <nav className="flex-1">
        {navSections.map((section, index) => (
          <NavSection
            key={index}
            section={section}
            startIndex={sectionStartIndices[index] ?? 0}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </>
  );
}
