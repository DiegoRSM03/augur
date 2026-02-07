# Spec 03: Dashboard Core

> Stats Row + Data Table + Filters + Pagination

## Overview

Build the main dashboard functionality — stats cards, data table with sorting, filter toolbar, and pagination. This is the core feature of the application.

## Prerequisites

- [ ] Spec 01 (Foundation) completed
- [ ] Spec 02 (Layout Shell) completed

## Tasks

### 1. Stats Components

Create src/components/dashboard/StatCard.tsx:

- [ ] Props: label, value, subtitle, variant (total/critical/high/medium/low)
- [ ] Value color based on variant
- [ ] Hover state (border color change)

Create src/components/dashboard/StatsRow.tsx:

- [ ] Fetch data using useStats hook
- [ ] 5-column grid of StatCards
- [ ] Loading state with Skeleton components
- [ ] Error state handling

### 2. Toolbar Component

Create src/components/dashboard/Toolbar.tsx:

- [ ] Search input with icon (260px width)
- [ ] Vertical divider
- [ ] Severity dropdown: All, Critical, High, Medium, Low
- [ ] Type dropdown: All, IP, Domain, Hash, URL
- [ ] Source dropdown: All, + sources from data
- [ ] "Clear filters" ghost button (right-aligned)
- [ ] Props: filters state + onChange handlers

### 3. Table Components

Create src/components/table/TableHeader.tsx:

- [ ] Column headers with sort indicators
- [ ] Click to toggle sort
- [ ] Columns: (checkbox), Indicator, Type, Severity, Confidence, Source, Tags, Last Seen

Create src/components/table/TableRow.tsx:

- [ ] Props: indicator, isSelected, onSelect
- [ ] Indicator value: mono font, augur-blue
- [ ] Type: icon prefix (⬡ IP, ◎ Domain, # Hash, 🔗 URL)
- [ ] Severity: Badge component
- [ ] Confidence: ConfidenceBar + value
- [ ] Tags: Tag components with color mapping
- [ ] Last Seen: relative time format
- [ ] Hover and selected states

Create src/components/table/DataTable.tsx:

- [ ] Fetch using useIndicators hook with filters
- [ ] Compose TableHeader + TableRow components
- [ ] Loading state: skeleton rows
- [ ] Empty state: icon + message + clear filters button
- [ ] Selected row tracking

### 4. Pagination Component

Create src/components/dashboard/Pagination.tsx:

- [ ] Left: "Showing X-Y of Z indicators"
- [ ] Right: prev button, page numbers, next button
- [ ] Ellipsis for large page ranges
- [ ] Active page highlighted
- [ ] Props: page, totalPages, total, limit, onPageChange

### 5. Utilities

Create src/utils/formatters.ts:

- [ ] formatRelativeTime(iso: string): string — "2 min ago", "1h ago", "3d ago"
- [ ] getTagColor(tag: string): TagColor — map tag names to colors
- [ ] getTypeIcon(type: IndicatorType): string — return icon character

Create src/utils/formatters.test.ts:

- [ ] Test formatRelativeTime with various inputs

### 6. App Integration

Update src/App.tsx:

- [ ] State: filters (search, severity, type)
- [ ] State: pagination (page)
- [ ] State: selectedIndicatorId
- [ ] State: sort (column, direction)
- [ ] Wire debounced search
- [ ] Compose: StatsRow → Toolbar → DataTable → Pagination

### 7. Barrel Exports

- [ ] Create src/components/dashboard/index.ts
- [ ] Create src/components/table/index.ts
- [ ] Create src/utils/index.ts

## Files to Create

src/components/dashboard/StatCard.tsx
src/components/dashboard/StatsRow.tsx
src/components/dashboard/Toolbar.tsx
src/components/dashboard/Pagination.tsx
src/components/dashboard/index.ts
src/components/table/TableHeader.tsx
src/components/table/TableRow.tsx
src/components/table/DataTable.tsx
src/components/table/index.ts
src/utils/formatters.ts
src/utils/formatters.test.ts
src/utils/index.ts

## Files to Modify

src/App.tsx

## Design Specs

Stats Row:

- Grid: repeat(5, 1fr), gap 12px
- Card padding: 16px 20px
- Label: 10.5px uppercase, letter-spacing 0.8px
- Value: 26px, font-weight 700

Table:

- Header: bg-elevated, 10.5px uppercase
- Row height: ~44px
- Indicator: font-mono, 12.5px, augur-blue
- Confidence bar: 60px wide, 4px height

Pagination:

- Button: 30x30px, border-radius 4px
- Info text: 12px, text-tertiary

## Verification

- [ ] Stats load and display correctly
- [ ] Filters update table results
- [ ] Search is debounced (300ms)
- [ ] Sorting works on columns
- [ ] Pagination navigates correctly
- [ ] Loading states show during fetches
- [ ] Empty state shows when no results
- [ ] Row selection highlights row
- [ ] npm test passes
- [ ] No TypeScript/ESLint errors

## References

- design-reference.html — lines 476-900 for CSS
- design-reference.html — lines 1134-1348 for HTML
- server/index.js — lines 32-67 for API filtering logic
