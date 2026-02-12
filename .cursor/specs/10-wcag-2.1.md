# Spec 10: WCAG 2.1 AA Compliance

## Objective

Make the Threat Intelligence Dashboard fully compliant with WCAG 2.1 Level AA guidelines. This spec addresses all Lighthouse accessibility audit failures and implements comprehensive accessibility patterns across the application.

## Dependencies

- Specs 01–09 completed
- Existing motion/react integration with `prefers-reduced-motion` support

---

## Lighthouse Audit Failures

The following issues were identified in the Lighthouse accessibility audit and must be fixed:

| Audit ID | Issue | Impact | Components Affected |
| --- | --- | --- | --- |
| `aria-progressbar-name` | Progress bars lack accessible names | Critical | ConfidenceBar |
| `color-contrast` | Text doesn't meet 4.5:1 contrast ratio | Serious | NavSection, PageHeader (Live feed) |
| `label` | Form checkboxes lack labels | Critical | TableHeader, TableRow |
| `select-name` | Select dropdowns lack labels | Critical | Toolbar (Select) |

---

## Part 1: Lighthouse Failures — Critical Fixes

### 1.1 ConfidenceBar Accessible Name

**File:** `src/components/ui/ConfidenceBar/ConfidenceBar.tsx`

**Issue:** The progress bar element has `role="progressbar"` but no accessible name.

**Fix:** Add `aria-label` that describes what the progress bar represents.

```tsx
<div
  className={`h-full rounded-sm transition-all duration-300 ease-out ${severityColors[effectiveSeverity]}`}
  style={{ width: `${clampedValue}%` }}
  role="progressbar"
  aria-valuenow={clampedValue}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Confidence: ${clampedValue}%`}
/>
```

### 1.2 Color Contrast — NavSection Labels

**File:** `src/components/layout/sidebar/NavSection.tsx`

**Issue:** Section labels use `text-text-tertiary` (#5c6170) on dark background (#0d0f14), contrast ratio 3.1:1. WCAG requires 4.5:1 for normal text.

**Fix:** Update `text-text-tertiary` to a lighter color that meets contrast requirements.

**File:** `src/styles/global.css`

Update the CSS variables for `--color-text-tertiary` in both dark and light modes:

```css
/* Dark mode */
:root,
[data-theme="dark"] {
  /* Change from #5c6170 to #848a99 (contrast ~4.6:1 on #0d0f14) */
  --color-text-tertiary: #848a99;
}

/* Light mode - verify this still meets contrast */
[data-theme="light"] {
  /* Verify #64748b meets 4.5:1 on light backgrounds */
  --color-text-tertiary: #64748b;
}
```

**Alternative approach:** If changing the global variable affects too many elements undesirably, create a new semantic variable specifically for small/decorative text:

```css
:root,
[data-theme="dark"] {
  --color-text-label: #9ca3af; /* Higher contrast for labels/captions */
}
```

Then update NavSection to use `text-text-label` instead of `text-text-tertiary`.

### 1.3 Color Contrast — Live Feed Indicator

**File:** `src/components/layout/PageHeader/PageHeader.tsx`

**Issue:** "Live feed" text uses `text-text-tertiary` on `bg-bg-surface` (#0f1117), contrast ratio 3.05:1.

**Fix:** Use the updated `text-text-tertiary` (same fix as 1.2), or use `text-text-secondary` if more prominence is acceptable.

```tsx
<span className="hidden md:flex items-center gap-1.5 text-xs text-text-secondary mr-2">
```

### 1.4 Form Labels — Table Checkboxes

**File:** `src/components/table/TableHeader/TableHeader.tsx`

**Issue:** The "select all" checkbox has no accessible label.

**Fix:** Add `aria-label` to the checkbox.

```tsx
<IndeterminateCheckbox
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onChange={onSelectAll}
  aria-label="Select all indicators"
/>
```

Update the `IndeterminateCheckbox` component to forward the `aria-label` prop:

```tsx
function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  'aria-label': ariaLabel,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange?: () => void;
  'aria-label'?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className="accent-augur-blue cursor-pointer"
    />
  );
}
```

**File:** `src/components/table/TableRow/TableRow.tsx`

**Issue:** Row selection checkboxes have no accessible labels.

**Fix:** Add `aria-label` that identifies which indicator is being selected.

```tsx
<input
  type="checkbox"
  checked={isSelected}
  onChange={handleCheckboxClick}
  aria-label={`Select indicator ${indicator.value}`}
  className="accent-augur-blue"
/>
```

### 1.5 Form Labels — Select Dropdowns

**File:** `src/components/ui/Select/Select.tsx`

**Issue:** Select elements have no associated labels.

**Fix:** Add an `aria-label` prop to the Select component.

```tsx
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
  'aria-label'?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, className = '', 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-label={ariaLabel}
        className={/* ... */}
        {...props}
      >
        {/* ... */}
      </select>
    );
  }
);
```

**File:** `src/components/dashboard/Toolbar/Toolbar.tsx`

**Fix:** Pass `aria-label` to each Select in FilterDropdowns.

```tsx
function FilterDropdowns({ /* ... */ }) {
  return (
    <>
      <Select
        options={severityOptions}
        value={filters.severity}
        onChange={(e) => onSeverityChange(e.target.value as Severity | '')}
        aria-label="Filter by severity"
      />
      <Select
        options={typeOptions}
        value={filters.type}
        onChange={(e) => onTypeChange(e.target.value as IndicatorType | '')}
        aria-label="Filter by indicator type"
      />
      <Select
        options={sourceOptions}
        value={filters.source}
        onChange={(e) => onSourceChange(e.target.value)}
        aria-label="Filter by source"
      />
    </>
  );
}
```

---

## Part 2: WCAG 2.1 — Perceivable (Guideline 1)

### 2.1 Text Alternatives (1.1)

**Requirement:** All non-text content must have text alternatives.

**Files to audit and fix:**

| Component | Issue | Fix |
| --- | --- | --- |
| All icon components | Decorative icons should be hidden from AT | Add `aria-hidden="true"` to decorative SVGs |
| Button icons with text | Icons next to labels are decorative | Already handled if button has text content |
| Icon-only buttons | Must have `aria-label` | Audit all icon-only buttons |

**File:** `src/components/ui/icons/*.tsx`

Add `aria-hidden="true"` to all icon SVGs by default (they're decorative when paired with text):

```tsx
export function SearchIcon({ className = '' }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      /* ... */
    >
      {/* ... */}
    </svg>
  );
}
```

### 2.2 Adaptable Content (1.3)

**1.3.1 Info and Relationships**

**Requirement:** Information, structure, and relationships conveyed visually must be programmatically determinable.

**Fixes needed:**

1. **Landmarks:** Ensure proper landmark regions exist.

**File:** `src/components/layout/AppLayout/AppLayout.tsx`

Verify semantic structure:
- `<aside>` for sidebar (already present)
- `<main>` for main content area (already present)
- `<nav>` for navigation (verify in Sidebar)
- `<header>` for page header (already present in PageHeader)

2. **Table structure:** Ensure data table uses proper semantic markup.

**File:** `src/components/table/DataTable/DataTable.tsx`

Add `<caption>` for table identification:

```tsx
<table className="w-full">
  <caption className="sr-only">Threat indicators data table</caption>
  <TableHeader /* ... */ />
  <tbody>
    {/* ... */}
  </tbody>
</table>
```

Add `scope="col"` to table headers:

**File:** `src/components/table/TableHeader/TableHeader.tsx`

```tsx
<th
  key={column.key}
  scope="col"
  className={/* ... */}
>
```

3. **Form groupings:** Group related form controls.

**File:** `src/components/dashboard/Toolbar/Toolbar.tsx`

Wrap filter dropdowns in a fieldset (visually hidden):

```tsx
<fieldset className="contents">
  <legend className="sr-only">Filter indicators</legend>
  <FilterDropdowns /* ... */ />
</fieldset>
```

**1.3.2 Meaningful Sequence**

Content order in DOM should match visual order. Verify that:
- Sidebar comes before main content (OK for reading order)
- Mobile drawer overlay doesn't break tab order

**1.3.4 Orientation (AA)**

Do not restrict display to a single orientation. The responsive design from Spec 09 handles this.

**1.3.5 Identify Input Purpose (AA)**

Add `autocomplete` attributes to form inputs where applicable.

**File:** `src/components/indicator/AddIndicatorModal/AddIndicatorModal.tsx`

```tsx
<Input
  name="indicator-value"
  autoComplete="off"
  /* ... */
/>
```

### 2.3 Distinguishable (1.4)

**1.4.1 Use of Color**

Color should not be the only visual means of conveying information.

**Audit needed:**
- Severity badges: Already use text labels + color
- Confidence bar: Shows numeric value + bar fill
- Status indicators: Add text or pattern backup

**File:** `src/components/layout/PageHeader/PageHeader.tsx` (LiveIndicator)

Add `aria-label` to explain the status:

```tsx
<span
  className="hidden md:flex items-center gap-1.5 text-xs text-text-secondary mr-2"
  aria-label="Live data feed active"
>
  <span
    className="w-1.5 h-1.5 rounded-full bg-status-active shadow-[0_0_6px_var(--tw-shadow-color)] shadow-status-active"
    aria-hidden="true"
  />
  Live feed
</span>
```

**1.4.3 Contrast (Minimum) — AA**

Already addressed in Part 1 (color contrast fixes).

**1.4.4 Resize Text**

Text must be resizable up to 200% without loss of content or functionality.

**Audit:** Test with browser zoom at 200%. Ensure no horizontal scrolling on desktop widths.

**1.4.10 Reflow (AA)**

Content must reflow to fit a 320px viewport without horizontal scrolling (except for data tables which may scroll).

**Already handled:** Spec 09 responsive design addresses this with mobile breakpoints.

**1.4.11 Non-text Contrast (AA)**

UI components and graphical objects must have 3:1 contrast against adjacent colors.

**Audit needed:**
- Focus indicators
- Form input borders
- Button outlines
- Confidence bar track vs fill

**File:** `src/styles/global.css`

Verify border colors meet 3:1:
- `--color-border: #262b38` on `--color-surface: #0f1117` = ~1.4:1 (may need improvement)

If borders don't meet contrast, increase to `#3a4154` or similar.

**1.4.12 Text Spacing (AA)**

Content must adapt to:
- Line height 1.5x font size
- Paragraph spacing 2x font size
- Letter spacing 0.12x font size
- Word spacing 0.16x font size

**File:** `src/styles/global.css`

The base `line-height: 1.5` is already set. Ensure no fixed heights prevent text expansion.

**1.4.13 Content on Hover or Focus (AA)**

Content appearing on hover/focus must be:
- Dismissible (Escape key)
- Hoverable (user can move to hover content)
- Persistent (remains until dismissed)

**Applies to:**
- Tooltips (if any)
- Dropdown menus

---

## Part 3: WCAG 2.1 — Operable (Guideline 2)

### 3.1 Keyboard Accessible (2.1)

**2.1.1 Keyboard**

All functionality must be operable via keyboard.

**Audit needed:**

| Component | Keyboard Behavior Required |
| --- | --- |
| DataTable rows | Enter/Space to select, arrow keys to navigate |
| Pagination | Arrow keys, Home/End for first/last |
| Modal dialogs | Tab trapping, Escape to close |
| Sidebar navigation | Arrow keys, Enter to activate |
| Dropdown filters | Arrow keys, Enter to select |
| Theme toggle | Space/Enter to toggle |

**File:** `src/components/table/TableRow/TableRow.tsx`

Add keyboard handler for row selection:

```tsx
<motion.tr
  tabIndex={0}
  onClick={handleRowClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick();
    }
  }}
  role="row"
  aria-selected={isSelected}
  /* ... */
>
```

**2.1.2 No Keyboard Trap**

Users must be able to navigate away from any component using only the keyboard.

**Verify:** Modal components properly release focus when closed.

**2.1.4 Character Key Shortcuts (A)**

If single-character shortcuts exist, provide way to turn off or remap. Currently no shortcuts exist.

### 3.2 Enough Time (2.2)

**2.2.1 Timing Adjustable**

No timed content exists. Not applicable.

**2.2.2 Pause, Stop, Hide**

Auto-updating content (if any) must be controllable.

**Audit:** If "Live feed" auto-refreshes data, provide pause mechanism.

### 3.3 Seizures and Physical Reactions (2.3)

**2.3.1 Three Flashes**

No content flashes more than 3 times per second. Animations are subtle and safe.

### 3.4 Navigable (2.4)

**2.4.1 Bypass Blocks**

Provide a mechanism to skip repeated content.

**File:** `src/components/layout/AppLayout/AppLayout.tsx`

Add skip link as first element:

```tsx
export function AppLayout() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-augur-blue focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-screen bg-bg">
        {/* ... */}
        <main id="main-content" className="flex flex-col overflow-hidden">
          {/* ... */}
        </main>
      </div>
    </>
  );
}
```

**2.4.2 Page Titled**

Page has descriptive title. ✓ Already set in `index.html`.

**2.4.3 Focus Order**

Focus order is logical and matches visual order.

**Verify:**
- Modal focus traps work correctly
- Sidebar drawer doesn't disrupt focus order
- Detail panel focus management

**2.4.4 Link Purpose (In Context)**

Link text should describe purpose.

**Audit:** Sidebar navigation links should be descriptive.

**2.4.6 Headings and Labels (AA)**

Headings describe topic or purpose.

**File:** Verify heading hierarchy:
- `<h1>` for page title (PageHeader)
- `<h2>` for major sections (StatsRow, DataTable)
- No heading levels should be skipped

**File:** `src/components/dashboard/StatsRow/StatsRow.tsx`

Add section heading (visually hidden if needed):

```tsx
<section aria-labelledby="stats-heading">
  <h2 id="stats-heading" className="sr-only">Indicator Statistics</h2>
  {/* Stats cards */}
</section>
```

**File:** `src/components/table/DataTable/DataTable.tsx`

```tsx
<section aria-labelledby="indicators-heading">
  <h2 id="indicators-heading" className="sr-only">Threat Indicators</h2>
  {/* Table */}
</section>
```

**2.4.7 Focus Visible (AA)**

Focus indicators must be visible.

**File:** `src/styles/global.css`

Add visible focus styles for all interactive elements:

```css
@layer base {
  /* Visible focus ring for all interactive elements */
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Remove default outline when custom focus is applied */
  :focus:not(:focus-visible) {
    outline: none;
  }
}
```

Ensure all custom components also show focus:

**File:** `src/components/ui/Button/Button.tsx`

Verify focus-visible styles are present or add them.

### 3.5 Input Modalities (2.5)

**2.5.1 Pointer Gestures (A)**

Complex gestures should have single-pointer alternatives. No complex gestures exist.

**2.5.2 Pointer Cancellation (A)**

Actions should trigger on up-event (mouseup/touchend), not down. Native buttons handle this correctly.

**2.5.3 Label in Name (A)**

Accessible name must contain visible label text.

**Audit:** Buttons with icons + text — ensure `aria-label` if used includes visible text.

**2.5.4 Motion Actuation (A)**

No motion-triggered functions exist.

**2.5.5 Target Size (AAA — recommended for AA)**

Interactive elements should be at least 44x44 CSS pixels.

**Audit critical elements:**
- Checkbox inputs: Currently ~13x13px. Consider wrapper with larger hit area.
- Pagination buttons: Verify size.
- Filter toggle: Verify size on mobile.

**File:** `src/components/table/TableHeader/TableHeader.tsx`

Wrap checkbox in larger clickable area:

```tsx
<th
  key={column.key}
  className="px-4 py-3 text-left border-b border-border"
  style={{ width: column.width }}
>
  <label className="inline-flex items-center justify-center w-8 h-8 cursor-pointer">
    <IndeterminateCheckbox
      checked={allSelected}
      indeterminate={someSelected && !allSelected}
      onChange={onSelectAll}
      aria-label="Select all indicators"
    />
  </label>
</th>
```

---

## Part 4: WCAG 2.1 — Understandable (Guideline 3)

### 4.1 Readable (3.1)

**3.1.1 Language of Page**

HTML must have `lang` attribute. ✓ Already set: `<html lang="en">`.

**3.1.2 Language of Parts (AA)**

Parts in different languages should be marked. Not applicable (single language).

### 4.2 Predictable (3.2)

**3.2.1 On Focus**

Focus should not cause context change. ✓ No issues.

**3.2.2 On Input**

Input should not cause unexpected context change.

**Audit:** Filter dropdowns change table content — this is expected behavior. Ensure changes are announced.

Add live region for dynamic content updates:

**File:** `src/components/table/DataTable/DataTable.tsx`

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isLoading ? 'Loading indicators...' : `Showing ${indicators.length} indicators`}
</div>
```

**3.2.3 Consistent Navigation (AA)**

Navigation must be consistent across pages. ✓ Single-page app with consistent sidebar.

**3.2.4 Consistent Identification (AA)**

Components with same function must be identified consistently. ✓

### 4.3 Input Assistance (3.3)

**3.3.1 Error Identification**

Input errors must be described in text.

**File:** `src/components/indicator/AddIndicatorModal/AddIndicatorModal.tsx`

Ensure validation errors are:
- Associated with inputs via `aria-describedby`
- Announced to screen readers
- Visually distinct

```tsx
<div>
  <label htmlFor="indicator-value">Indicator Value</label>
  <Input
    id="indicator-value"
    aria-describedby={error ? 'indicator-error' : undefined}
    aria-invalid={!!error}
    /* ... */
  />
  {error && (
    <p id="indicator-error" className="text-sm text-severity-critical mt-1" role="alert">
      {error}
    </p>
  )}
</div>
```

**3.3.2 Labels or Instructions**

Form inputs must have labels.

Already addressed in Part 1 (Lighthouse fixes).

**3.3.3 Error Suggestion (AA)**

Provide correction suggestions when input errors are detected.

**File:** `src/components/indicator/AddIndicatorModal/AddIndicatorModal.tsx`

Enhance error messages to include suggestions:
- "Invalid IP address. Expected format: 192.168.1.1"
- "Invalid domain. Expected format: example.com"

**3.3.4 Error Prevention — Legal, Financial, Data (AA)**

For important actions, provide confirmation or undo.

**Audit:** Delete operations should have confirmation dialogs.

---

## Part 5: WCAG 2.1 — Robust (Guideline 4)

### 5.1 Compatible (4.1)

**4.1.1 Parsing**

HTML must be valid. Run HTML validator on built output.

**4.1.2 Name, Role, Value**

All UI components must have programmatically determinable names and roles.

**Audit checklist:**

| Component | Role | Name | Value/State |
| --- | --- | --- | --- |
| Checkbox | checkbox (native) | aria-label | checked/unchecked |
| Select | combobox (native) | aria-label | selected option |
| Button | button (native) | text content or aria-label | pressed (if toggle) |
| Progress bar | progressbar | aria-label | aria-valuenow |
| Modal | dialog | aria-labelledby | aria-modal=true |
| Sidebar drawer | dialog or navigation | aria-label | open/closed |
| Table row | row | — | aria-selected (if selectable) |
| Expandable section | region | aria-labelledby | aria-expanded |

**4.1.3 Status Messages (AA)**

Status messages must be announced without receiving focus.

Add live regions for:
- Filter results count
- Export success/failure
- Form submission results

---

## Part 6: Screen Reader-Only Utilities

**File:** `src/styles/global.css`

Add `.sr-only` utility class if not already present (Tailwind includes this):

```css
@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .not-sr-only {
    position: static;
    width: auto;
    height: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
}
```

---

## Part 7: Modal Focus Management

**File:** `src/components/ui/Modal/Modal.tsx`

Ensure proper focus management:

1. **Focus trap:** Tab cycles within modal
2. **Initial focus:** First focusable element or specific element
3. **Return focus:** Focus returns to trigger element on close

```tsx
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
  returnFocusRef?: React.RefObject<HTMLElement>;
}

export function Modal({ isOpen, onClose, children, initialFocusRef, returnFocusRef }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus initial element or first focusable
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        modalRef.current?.focus();
      }
    } else {
      // Return focus
      const returnEl = returnFocusRef?.current || previousActiveElement.current;
      returnEl?.focus();
    }
  }, [isOpen, initialFocusRef, returnFocusRef]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      /* ... */
    >
      {children}
    </div>
  );
}
```

---

## Part 8: Testing

### 8.1 Automated Testing

**File:** `src/components/ui/ConfidenceBar/ConfidenceBar.test.tsx`

```tsx
it('has accessible name for progress bar', () => {
  render(<ConfidenceBar value={75} />);
  const progressbar = screen.getByRole('progressbar');
  expect(progressbar).toHaveAccessibleName('Confidence: 75%');
});
```

**File:** `src/components/table/TableHeader/TableHeader.test.tsx`

```tsx
it('checkbox has accessible label', () => {
  render(<TableHeader /* ... */ />);
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).toHaveAccessibleName('Select all indicators');
});
```

**File:** `src/components/dashboard/Toolbar/Toolbar.test.tsx`

```tsx
it('select dropdowns have accessible labels', () => {
  render(<Toolbar /* ... */ />);
  expect(screen.getByLabelText('Filter by severity')).toBeInTheDocument();
  expect(screen.getByLabelText('Filter by indicator type')).toBeInTheDocument();
  expect(screen.getByLabelText('Filter by source')).toBeInTheDocument();
});
```

### 8.2 Manual Testing Checklist

Run these manual tests with keyboard and screen reader:

- [ ] Tab through entire page — focus order is logical
- [ ] All interactive elements receive visible focus
- [ ] Skip link works and skips to main content
- [ ] Modal traps focus correctly
- [ ] Escape closes modals and dropdowns
- [ ] All form controls have accessible labels (announced by screen reader)
- [ ] Table structure is announced correctly (rows, columns, headers)
- [ ] Severity/status information is conveyed beyond just color
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced (aria-live regions)
- [ ] Page works at 200% zoom without horizontal scrolling
- [ ] Reduced motion preference is respected

### 8.3 Lighthouse Re-audit

After implementing fixes, run Lighthouse accessibility audit and verify:
- Score: 100
- All previously failing audits pass
- No new issues introduced

---

## Acceptance Criteria

### Lighthouse Fixes
- [ ] `aria-progressbar-name`: ConfidenceBar has `aria-label="Confidence: X%"`
- [ ] `color-contrast`: All text meets 4.5:1 contrast ratio (or 3:1 for large text)
- [ ] `label`: All checkboxes have associated labels via `aria-label`
- [ ] `select-name`: All Select dropdowns have `aria-label`

### Perceivable
- [ ] All decorative icons have `aria-hidden="true"`
- [ ] Icon-only buttons have `aria-label`
- [ ] Table has `<caption>` and headers have `scope="col"`
- [ ] Landmarks are properly defined (`<main>`, `<nav>`, `<aside>`, `<header>`)
- [ ] Form inputs have proper `autocomplete` where applicable

### Operable
- [ ] Skip link present and functional
- [ ] All functionality keyboard accessible
- [ ] Focus visible on all interactive elements
- [ ] Modal focus trapping works correctly
- [ ] Escape key closes modals/drawers
- [ ] Section headings exist (h2 for major sections)

### Understandable
- [ ] Form errors associated with inputs via `aria-describedby`
- [ ] Error messages include suggestions for correction
- [ ] Dynamic content changes announced via `aria-live`

### Robust
- [ ] All components have proper ARIA roles, names, and values
- [ ] HTML validates without errors
- [ ] Status messages use appropriate live regions

---

## Files to Create

| File | Purpose |
| --- | --- |
| None | This spec modifies existing files only |

## Files to Modify

| File | Changes |
| --- | --- |
| `src/styles/global.css` | Update `--color-text-tertiary`, add focus styles, verify `.sr-only` |
| `src/components/ui/ConfidenceBar/ConfidenceBar.tsx` | Add `aria-label` to progressbar |
| `src/components/ui/Select/Select.tsx` | Add `aria-label` prop |
| `src/components/ui/Modal/Modal.tsx` | Add focus trap, return focus logic |
| `src/components/ui/icons/*.tsx` | Add `aria-hidden="true"` to all icons |
| `src/components/layout/AppLayout/AppLayout.tsx` | Add skip link |
| `src/components/layout/PageHeader/PageHeader.tsx` | Update LiveIndicator contrast and aria |
| `src/components/layout/sidebar/NavSection.tsx` | Verify contrast (handled via CSS var change) |
| `src/components/table/TableHeader/TableHeader.tsx` | Add checkbox labels, `scope="col"`, larger hit area |
| `src/components/table/TableRow/TableRow.tsx` | Add checkbox labels, keyboard handlers, `aria-selected` |
| `src/components/table/DataTable/DataTable.tsx` | Add `<caption>`, section heading, live region |
| `src/components/dashboard/Toolbar/Toolbar.tsx` | Add `aria-label` to Selects, fieldset wrapper |
| `src/components/dashboard/StatsRow/StatsRow.tsx` | Add section heading |
| `src/components/indicator/AddIndicatorModal/AddIndicatorModal.tsx` | Add `aria-describedby`, `aria-invalid`, enhanced errors |
| `src/components/ui/ConfidenceBar/ConfidenceBar.test.tsx` | Add accessibility tests |
| `src/components/table/TableHeader/TableHeader.test.tsx` | Add accessibility tests |
| `src/components/dashboard/Toolbar/Toolbar.test.tsx` | Add accessibility tests |

---

## Notes

- **Color contrast changes may affect visual design.** Review with design stakeholder if `--color-text-tertiary` update is too prominent.
- **Alternative:** Create new variable `--color-text-label` specifically for nav labels to preserve tertiary color elsewhere.
- **Screen reader testing:** Test with VoiceOver (macOS), NVDA or JAWS (Windows), and optionally Orca (Linux).
- **Browser support:** Focus-visible is well-supported but may need polyfill for older browsers.
- **No new dependencies** — all changes use native HTML/ARIA patterns.
- **Reduced motion:** Already supported via Spec 08 `useReducedMotion` hook.
