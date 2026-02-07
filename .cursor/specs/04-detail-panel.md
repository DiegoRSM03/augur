# Spec 04: Detail Panel & Polish

> Detail Panel + Loading/Error/Empty States + Testing + Final QA

## Overview

Complete the application with the slide-in detail panel, polish all states, add comprehensive tests, and perform final QA against the design reference.

## Prerequisites

- [ ] Spec 01 (Foundation) completed
- [ ] Spec 02 (Layout Shell) completed
- [ ] Spec 03 (Dashboard Core) completed

## Tasks

### 1. Detail Panel Component

Create src/components/detail/DetailPanel.tsx:

Structure:

- [ ] Header: "Indicator Details" title + close button
- [ ] Body sections:
  - Value (mono font, augur-blue, word-break)
  - Classification (severity badge + type label)
  - Confidence Score (larger bar 120px + percentage)
  - Tags (flex wrap)
  - Timeline (First Seen, Last Seen as formatted dates)
  - Source (provider name)
- [ ] Footer: "Investigate" secondary button + "Block" danger button
- [ ] Props: indicator: Indicator | null, onClose: () => void

Styling:

- [ ] Fixed position, right: 0, full height
- [ ] Width: 400px
- [ ] Shadow, border-left
- [ ] Slide-in animation (optional)

### 2. Panel Integration

Update src/App.tsx:

- [ ] Fetch full indicator when selectedIndicatorId changes
- [ ] Pass indicator to DetailPanel
- [ ] Close panel: onClose callback clears selection
- [ ] Close on Escape key press
- [ ] Optional: close on click outside

### 3. Loading States Audit

Ensure all async operations show loading:

- [ ] StatsRow: skeleton stat cards
- [ ] DataTable: 7-10 skeleton rows
- [ ] DetailPanel: skeleton sections when loading single indicator

### 4. Error States

- [ ] Stats fetch error: error message in stats area
- [ ] Indicators fetch error: error message with retry button
- [ ] Single indicator fetch error: error in detail panel

Create src/components/ui/ErrorState.tsx:

- [ ] Props: message, onRetry (optional)
- [ ] Icon + message + retry button

### 5. Empty States

- [ ] No results from filters: empty state with clear filters action
- [ ] Create src/components/ui/EmptyState.tsx

### 6. Unit Tests

Hooks:

- [ ] src/hooks/useIndicators.test.ts — fetch, filter, paginate
- [ ] src/hooks/useStats.test.ts — fetch stats

Components:

- [ ] src/components/ui/Tag.test.tsx
- [ ] src/components/ui/Button.test.tsx
- [ ] src/components/table/TableRow.test.tsx
- [ ] src/components/dashboard/Pagination.test.tsx

Utilities:

- [ ] Ensure src/utils/formatters.test.ts covers edge cases

### 7. Final QA Checklist

Visual accuracy:

- [ ] Colors match exactly
- [ ] Typography: DM Sans for UI, JetBrains Mono for data
- [ ] Spacing matches design tokens
- [ ] Border radii correct

Interactions:

- [ ] All hover states work
- [ ] Focus states visible (accessibility)
- [ ] Selected row highlighted correctly
- [ ] Transitions smooth (0.15s ease)

Technical:

- [ ] No console errors
- [ ] No TypeScript errors (npm run build)
- [ ] No ESLint errors (npm run lint)
- [ ] All tests pass (npm test)

### 8. Polish (Nice to Have)

- [ ] Keyboard: Escape closes detail panel
- [ ] Scrollbar styling matches design
- [ ] Table checkbox column (visual only)
- [ ] Smooth panel slide animation

## Files to Create

src/components/detail/DetailPanel.tsx
src/components/detail/index.ts
src/components/ui/ErrorState.tsx
src/components/ui/EmptyState.tsx
src/hooks/useIndicators.test.ts
src/hooks/useStats.test.ts
src/components/ui/Tag.test.tsx
src/components/ui/Button.test.tsx
src/components/table/TableRow.test.tsx
src/components/dashboard/Pagination.test.tsx

## Files to Modify

src/App.tsx
src/components/ui/index.ts (add ErrorState, EmptyState)

## Design Specs

Detail Panel:

- --detail-width: 400px
- Shadow: 0 4px 16px rgba(0,0,0,0.5)
- Header padding: 16px 20px
- Body padding: 20px
- Section label: 10px uppercase, letter-spacing 1px
- Value: 13px mono, augur-blue
- Confidence bar: 120px wide, 6px height

Timeline rows:

- Flex space-between
- Border-bottom subtle
- Label: 12px text-secondary
- Value: 12px font-weight 600

## Verification

- [ ] Detail panel opens on row click
- [ ] Detail panel closes on X click
- [ ] Detail panel closes on Escape
- [ ] All indicator data displays correctly
- [ ] Loading states appear during fetches
- [ ] Error states show with retry option
- [ ] Empty state shows when no results
- [ ] All tests pass
- [ ] Visual QA matches design reference
- [ ] No errors in console/TypeScript/ESLint

## References

- design-reference.html — lines 657-731 for panel CSS
- design-reference.html — lines 1351-1424 for panel HTML
- design-reference.html — lines 901-936 for states CSS
