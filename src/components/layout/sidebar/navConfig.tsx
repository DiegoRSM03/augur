import {
  ActorsIcon,
  AnalyticsIcon,
  CampaignsIcon,
  DashboardIcon,
  EventsIcon,
  IntegrationsIcon,
  InvestigateIcon,
  ReportsIcon,
  ThreatIcon,
} from '../../ui/icons/nav';

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
