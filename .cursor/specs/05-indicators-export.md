# Spec 05: Indicator Export

> Multi-select indicators + CSV export with confirmation modal

## Overview

Enable users to select multiple indicators across pagination and export them as a CSV file. Includes a confirmation modal where users can review and adjust their selection before downloading.

## Prerequisites

- [ ] Spec 01 (Foundation) completed
- [ ] Spec 02 (Layout Shell) completed
- [ ] Spec 03 (Dashboard Core) completed
- [ ] Spec 04 (Detail Panel) completed

## Behavior Summary

| User Action                    | Result                              |
| ------------------------------ | ----------------------------------- |
| Click **checkbox** on row      | Toggle indicator selection          |
| Click **anywhere else** on row | Open detail sidebar                 |
| Click **header checkbox**      | Select/deselect all on current page |
| Navigate to different page     | Selections persist in memory        |
| Click **Export** button        | Open confirmation modal             |

## Tasks

### 1. Fix Header Checkbox (Select All)

Update src/components/table/TableHeader.tsx:

- [ ] Header checkbox selects/deselects ALL indicators on current page
- [ ] Checkbox shows indeterminate state when some (but not all) are selected
- [ ] Checkbox is checked when all current page indicators are selected

### 2. Selection State Management

Update src/App.tsx or create src/hooks/useSelection.ts:

- [ ] State: selectedIds: Set<string> — persists across pagination
- [ ] Actions: toggleSelection(id), selectAll(ids), deselectAll(ids), clearSelection()
- [ ] Derive: selectedCount, isAllCurrentPageSelected, isSomeSelected

### 3. Row Click Behavior

Update src/components/table/TableRow.tsx:

- [ ] Checkbox click → toggle selection (stop propagation)
- [ ] Row click (not checkbox) → open detail sidebar
- [ ] Selected rows show highlight style (existing)

### 4. Selection Count Badge

Update src/components/dashboard/Toolbar.tsx:

- [ ] Show badge: "{n} selected" when selectedCount > 0
- [ ] Position: in toolbar, near filters or before "Clear filters"
- [ ] Style: use existing badge/tag styling from design system

### 5. Export Button Integration

Update src/components/layout/PageHeader.tsx:

- [ ] Existing "Export" button triggers export flow
- [ ] Button is always visible (exports selected if any, or could show tooltip "Select indicators to export")
- [ ] When clicked with selections → open confirmation modal
- [ ] When clicked without selections → show toast "No indicators selected"

### 6. Confirmation Modal Component

Create src/components/export/ExportModal.tsx:

Structure:

- [ ] Header: "Export Indicators" + close button (✕)
- [ ] Subheader: "Review your selection before exporting"
- [ ] Body: Scrollable checkbox list of selected indicators
- [ ] Each item shows: checkbox, indicator value, severity badge, source
- [ ] User can uncheck items to exclude from export
- [ ] Footer: "Cancel" button + "Export CSV" primary button
- [ ] Footer also shows count: "Exporting {n} indicators"

Props:
interface ExportModalProps {
indicators: Indicator[];
onClose: () => void;
onExport: (selectedIds: string[]) => void;
}

Styling (from design-reference.html):

- [ ] Modal overlay: bg-modal-overlay with backdrop blur
- [ ] Modal: bg-modal, border, shadow-modal, max-width 600px
- [ ] Border radius: radius-xl (12px)
- [ ] Padding: header 20px 24px, body 24px, footer 20px 24px

### 7. CSV Generation Utility

Create src/utils/exportCsv.ts:

function exportIndicatorsToCsv(indicators: Indicator[]): void

- [ ] Columns: id, value, type, severity, source, confidence, firstSeen, lastSeen, tags
- [ ] Tags column: join array with semicolon (;) to avoid CSV comma conflicts
- [ ] Properly escape values containing commas or quotes
- [ ] Generate filename: indicators-export-{timestamp}.csv
- [ ] Trigger browser download

### 8. Toast Notification Component

Create src/components/ui/Toast.tsx:

- [ ] Props: message, type (success/error/info), duration
- [ ] Auto-dismiss after duration (default 3s)
- [ ] Position: bottom-right of screen
- [ ] Style: matches design system (bg-card, border, shadow)
- [ ] Success icon for export complete

Create src/hooks/useToast.ts:

- [ ] showToast(message, type) function
- [ ] Manages toast queue/state

### 9. Export Flow Integration

Update src/App.tsx:

- [ ] State: isExportModalOpen: boolean
- [ ] When Export clicked → if selections exist, open modal
- [ ] When modal confirms → generate CSV, download, close modal, show toast, clear selections
- [ ] Toast message: "Successfully exported {n} indicators"

### 10. Unit Tests

- [ ] src/hooks/useSelection.test.ts — toggle, selectAll, persistence
- [ ] src/utils/exportCsv.test.ts — CSV generation, escaping
- [ ] src/components/export/ExportModal.test.tsx — render, uncheck, export

## Files to Create

src/hooks/useSelection.ts
src/hooks/useSelection.test.ts
src/hooks/useToast.ts
src/components/export/ExportModal.tsx
src/components/export/index.ts
src/components/ui/Toast.tsx
src/utils/exportCsv.ts
src/utils/exportCsv.test.ts

## Files to Modify

src/App.tsx (selection state, modal state, export flow)
src/components/table/TableHeader.tsx (select all checkbox)
src/components/table/TableRow.tsx (checkbox click vs row click)
src/components/dashboard/Toolbar.tsx (selection count badge)
src/components/layout/PageHeader.tsx (export button handler)
src/components/ui/index.ts (add Toast export)

## Design Specs

### Selection Badge (Toolbar)

Background: augur-blue-dim
Color: augur-blue
Font: 12px, font-weight 600
Padding: 4px 10px
Border-radius: radius-pill

### Export Modal

Overlay: rgba(0, 0, 0, 0.7) + backdrop-filter: blur(4px)
Modal: bg-modal (#141820), border-default, shadow-modal
Max-width: 600px
Max-height: 70vh (body scrollable)
Header: 16px font-weight 700
Checkbox list item height: ~40px
Item: indicator value (mono, augur-blue), severity badge, source (text-secondary)

### Toast Notification

Position: fixed, bottom: 24px, right: 24px
Background: bg-card
Border: border-default
Shadow: shadow-elevated
Padding: 12px 16px
Border-radius: radius-lg
Icon: green checkmark for success
Auto-dismiss: 3 seconds

## State Flow Diagram

User selects indicators (checkbox clicks)
↓
Selection stored in Set<string> (persists across pages)
↓
Toolbar shows "{n} selected" badge
↓
User clicks "Export" button
↓
┌─────────────────────────────────────┐
│ ExportModal opens │
│ - Shows checkbox list │
│ - User can uncheck items │
│ - "Export CSV" button │
└─────────────────────────────────────┘
↓
User clicks "Export CSV"
↓
CSV generated and downloaded
↓
Modal closes → Toast appears → Selections cleared

## CSV Output Format

id,value,type,severity,source,confidence,firstSeen,lastSeen,tags
uuid-1,185.220.101.34,ip,critical,AbuseIPDB,94,2025-11-08T14:22:00.000Z,2026-02-03T19:45:00.000Z,tor-exit;botnet
uuid-2,malware-c2.storm-412.ru,domain,critical,VirusTotal,91,2025-10-15T08:30:00.000Z,2026-02-03T18:20:00.000Z,c2;malware

## Verification

- [ ] Header checkbox selects all on current page
- [ ] Header checkbox shows indeterminate when partially selected
- [ ] Clicking checkbox toggles selection without opening sidebar
- [ ] Clicking row (not checkbox) opens sidebar
- [ ] Selections persist when navigating pages
- [ ] Toolbar shows selection count badge
- [ ] Export button opens modal when indicators selected
- [ ] Export button shows toast when nothing selected
- [ ] Modal displays all selected indicators with checkboxes
- [ ] User can uncheck items in modal
- [ ] Export generates valid CSV with all columns
- [ ] CSV downloads with timestamped filename
- [ ] Modal closes after export
- [ ] Toast notification appears
- [ ] Selections are cleared after export
- [ ] All tests pass
- [ ] No TypeScript/ESLint errors

## References

- design-reference.html — lines 733-756 for modal CSS
- design-reference.html — lines 901-936 for toast/notification patterns
- src/types/indicator.ts — Indicator interface for CSV columns
