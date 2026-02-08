import { motion, useReducedMotion } from 'motion/react';

// Navigation item data structure
interface NavItem {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

// SVG Icons as components for cleaner code
const DashboardIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const EventsIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 2 7 12 12 22 7" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const InvestigateIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ThreatIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CampaignsIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
  </svg>
);

const ActorsIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const ReportsIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IntegrationsIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// Logo SVG
const AugurLogo = () => (
  <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
    <path d="M14 2L2 26h24L14 2z" stroke="#fff" strokeWidth="2" fill="none" />
    <path d="M14 10l-5 10h10l-5-10z" fill="#6383ff" opacity="0.3" />
  </svg>
);

// Navigation sections configuration
const navSections: NavSection[] = [
  {
    items: [
      { icon: <DashboardIcon />, label: 'Dashboard', active: true, badge: '3' },
      { icon: <EventsIcon />, label: 'Augur Events' },
      { icon: <InvestigateIcon />, label: 'Investigate' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { icon: <ThreatIcon />, label: 'Threat Indicators' },
      { icon: <CampaignsIcon />, label: 'Campaigns' },
      { icon: <ActorsIcon />, label: 'Actors' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { icon: <ReportsIcon />, label: 'Executive Reports' },
      { icon: <AnalyticsIcon />, label: 'Analytics' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { icon: <IntegrationsIcon />, label: 'Integrations' },
    ],
  },
];

function NavItemComponent({ item, globalIndex }: { item: NavItem; globalIndex: number }) {
  const reducedMotion = useReducedMotion();
  const baseClasses = 'flex items-center gap-3 py-2 px-5 mx-2 my-[1px] rounded-md text-[13px] font-medium cursor-pointer transition-all duration-150';
  const activeClasses = item.active
    ? 'bg-bg-sidebar-active text-augur-blue'
    : 'text-text-secondary hover:bg-bg-card hover:text-text-primary';
  const iconOpacity = item.active ? 'opacity-100' : 'opacity-60';

  return (
    <motion.a
      href="#"
      className={`${baseClasses} ${activeClasses}`}
      initial={reducedMotion ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: reducedMotion ? 0 : globalIndex * 0.05,
        duration: reducedMotion ? 0 : 0.25,
        ease: 'easeOut',
      }}
    >
      <span className={`flex-shrink-0 ${iconOpacity}`}>{item.icon}</span>
      {item.label}
      {item.badge && (
        <span className="ml-auto bg-severity-critical text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-pill min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </motion.a>
  );
}

function NavSectionComponent({ section, startIndex }: { section: NavSection; startIndex: number }) {
  return (
    <div className="mb-2">
      {section.label && (
        <div className="py-3 px-5 pb-2 text-[10px] font-semibold uppercase tracking-[1.2px] text-text-tertiary">
          {section.label}
        </div>
      )}
      {section.items.map((item, index) => (
        <NavItemComponent key={index} item={item} globalIndex={startIndex + index} />
      ))}
    </div>
  );
}

export function Sidebar() {
  // Pre-compute cumulative start indices for each section
  let runningIndex = 0;
  const sectionStartIndices = navSections.map((section) => {
    const start = runningIndex;
    runningIndex += section.items.length;
    return start;
  });

  return (
    <aside className="bg-bg-sidebar border-r border-border-subtle py-5 flex flex-col sticky top-0 h-screen overflow-y-auto">
      {/* Logo - wrapped in dark container to remain visible in light mode */}
      <div className="px-3 pb-6">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0d0f14]">
          <AugurLogo />
          <span className="font-sans text-[18px] font-bold tracking-[3px] uppercase text-white">
            Augur
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        {navSections.map((section, index) => (
          <NavSectionComponent
            key={index}
            section={section}
            startIndex={sectionStartIndices[index] ?? 0}
          />
        ))}
      </nav>
    </aside>
  );
}
