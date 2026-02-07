# Spec 02: Layout Shell

> AppLayout + Sidebar + PageHeader

## Overview

Build the structural shell of the application — the grid layout with sidebar navigation and page header. Creates the container for dashboard content.

## Prerequisites

- [ ] Spec 01 (Foundation) completed

## Tasks

### 1. AppLayout Component

Create src/components/layout/AppLayout.tsx:

- [ ] CSS Grid: 220px sidebar + flexible main content
- [ ] Full viewport height (min-h-screen)
- [ ] Main area: flex column for header + scrollable content
- [ ] Props: children: React.ReactNode

### 2. Sidebar Component

Create src/components/layout/Sidebar.tsx:

Structure:

- [ ] Logo section: SVG icon + "AUGUR" text (uppercase, letter-spacing)
- [ ] Nav sections with optional labels
- [ ] Nav items with icon, text, optional badge

Nav Items (static, no routing):

[No label]

- Dashboard (active, badge: "3")
- Augur Events
- Investigate

Intelligence

- Threat Indicators
- Campaigns
- Actors

Reports

- Executive Reports
- Analytics

Settings

- Integrations

Styling:

- [ ] Sticky positioning, full height
- [ ] Active state: bg-sidebar-active, augur-blue text
- [ ] Hover state: bg-card, text-primary
- [ ] Section labels: 10px, uppercase, letter-spacing 1.2px
- [ ] Nav badge: red background, white text, pill shape

### 3. PageHeader Component

Create src/components/layout/PageHeader.tsx:

- [ ] Left: title (h1) + subtitle (p)
- [ ] Right: Live indicator (green dot + "Live feed") + Export button + Add Indicator button
- [ ] Sticky top positioning
- [ ] Border bottom, bg-surface
- [ ] Props: title: string, subtitle: string

### 4. Integration

- [ ] Create barrel export src/components/layout/index.ts
- [ ] Update src/App.tsx with layout shell
- [ ] Add placeholder content area for Spec 03

## Files to Create

src/components/layout/AppLayout.tsx
src/components/layout/Sidebar.tsx
src/components/layout/PageHeader.tsx
src/components/layout/index.ts

## Files to Modify

src/App.tsx

## Design Specs

Sidebar:

- --sidebar-width: 220px
- --bg-sidebar: #0d0f14
- --bg-sidebar-active: rgba(99, 131, 255, 0.12)
- Logo text: 18px, font-weight 700, letter-spacing 3px
- Nav item: padding 8px 20px, margin 1px 8px, border-radius 6px
- Nav icon: 18px, opacity 0.6 (1 when active)
- Section label: padding 12px 20px 8px, font-size 10px

PageHeader:

- --header-height: 56px
- Padding: 24px 32px
- Title: 20px, font-weight 700
- Subtitle: 12px, text-secondary

## Verification

- [ ] Layout displays correctly with sidebar + main area
- [ ] Sidebar matches design reference exactly
- [ ] PageHeader sticky behavior works
- [ ] Active nav item highlighted
- [ ] Hover states work
- [ ] No TypeScript/ESLint errors

## References

- design-reference.html — lines 147-275 for CSS
- design-reference.html — lines 1057-1131 for HTML structure
