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

export const AugurLogo = () => (
  <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
    <path d="M14 2L2 26h24L14 2z" stroke="#fff" strokeWidth="2" fill="none" />
    <path d="M14 10l-5 10h10l-5-10z" fill="#6383ff" opacity="0.3" />
  </svg>
);

export const navSections: NavSection[] = [
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

export type { NavItem, NavSection };
