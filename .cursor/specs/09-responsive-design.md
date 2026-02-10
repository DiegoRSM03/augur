# Spec 09: Responsive Design (Mobile-First)

## Objective

Make the Threat Intelligence Dashboard fully responsive across four breakpoints using a mobile-first approach. The current desktop layout remains the baseline; smaller screens progressively simplify layout, navigation, and data density.

## Dependencies

- Specs 01–08 completed
- Tailwind CSS v4 with custom theme breakpoints
- `motion/react` v12+ (existing)

---

## Breakpoints

| Name    | Range          | Tailwind prefix | Min-width trigger |
| ------- | -------------- | --------------- | ----------------- |
| mobile  | 0 – 480px      | _(base)_        | —                 |
| tablet  | 481 – 768px    | `sm:`           | 481px             |
| laptop  | 769 – 1024px   | `md:`           | 769px             |
| desktop | 1025 – 1440px+ | `lg:`           | 1025px            |

**Mobile-first**: base styles target mobile; `sm:`, `md:`, `lg:` prefixes layer on complexity.

---

## Overview

| Component   | Mobile (base)                        | Tablet (`sm:`)                       | Laptop (`md:`)            | Desktop (`lg:`)         |
| ----------- | ------------------------------------ | ------------------------------------ | ------------------------- | ----------------------- |
| Sidebar     | Hidden; hamburger + drawer overlay   | Hidden; hamburger + drawer overlay   | Visible in grid           | Visible in grid         |
| PageHeader  | Hamburger, title only, compact       | Hamburger, title + subtitle, buttons | Full layout, no hamburger | Full layout             |
| StatsRow    | 2-col grid, total spans 2            | 2-col grid, total spans 2            | 5-col grid                | 5-col grid              |
| Toolbar     | Search full-width, filters collapsed | Search full-width, filters collapsed | Inline search + filters   | Inline search + filters |
| DataTable   | Horizontal scroll, hide 2 columns    | Horizontal scroll, hide 1 column     | Full table                | Full table              |
| DetailPanel | Full-width overlay                   | Full-width overlay                   | 400px slide-in            | 400px slide-in          |
| Pagination  | Prev/Next only, compact info         | Prev/Next + limited page numbers     | Full pagination           | Full pagination         |

---

## Part 1: Breakpoint Infrastructure

### File: `src/styles/global.css`

Override Tailwind v4 default breakpoints in the existing `@theme` block:

```css
@theme {
  --spacing: 4px;
  --breakpoint-sm: 481px;
  --breakpoint-md: 769px;
  --breakpoint-lg: 1025px;
  --breakpoint-xl: 1441px;
}
```

These replace Tailwind's defaults so `sm:`, `md:`, `lg:`, `xl:` map to the project's breakpoint system.

### File: `src/hooks/useMediaQuery.ts` (new)

A simple, testable hook for JS-driven responsive behavior (sidebar toggle visibility, filter collapse logic).

**Requirements:**

- Signature: `useMediaQuery(query: string): boolean`
- Uses `window.matchMedia(query)` to evaluate the query.
- Listens for changes via the `change` event on the `MediaQueryList`.
- Returns `true` when the query matches, `false` otherwise.
- Cleans up listener on unmount.
- SSR-safe: default to `false` if `window` is undefined.

### File: `src/hooks/useBreakpoint.ts` (new)

A convenience hook built on `useMediaQuery` that exposes named breakpoint booleans.

**Requirements:**

- Returns: `{ isMobile: boolean; isTablet: boolean; isLaptop: boolean; isDesktop: boolean }`
- Definitions (min-width media queries):
  - `isMobile`: always `true` (base); effectively `!isTablet && !isLaptop && !isDesktop`
  - `isTablet`: `(min-width: 481px)` matches AND `(min-width: 769px)` does NOT
  - `isLaptop`: `(min-width: 769px)` matches AND `(min-width: 1025px)` does NOT
  - `isDesktop`: `(min-width: 1025px)` matches
- Internally use `useMediaQuery` for each threshold:
  - `const aboveSm = useMediaQuery('(min-width: 481px)')`
  - `const aboveMd = useMediaQuery('(min-width: 769px)')`
  - `const aboveLg = useMediaQuery('(min-width: 1025px)')`
- Derive:
  - `isMobile = !aboveSm`
  - `isTablet = aboveSm && !aboveMd`
  - `isLaptop = aboveMd && !aboveLg`
  - `isDesktop = aboveLg`

This hook is used when CSS-only responsive utilities aren't sufficient (e.g., conditionally rendering components, toggling state).

---

## Part 2: AppLayout + Sidebar (Drawer)

### File: `src/components/layout/AppLayout.tsx`

**Current**: `grid grid-cols-[220px_1fr] min-h-screen`

**Changes:**

1. **Responsive grid**:

   - Base (mobile/tablet): `grid-cols-1` — single column, sidebar not in grid flow.
   - `md:` (laptop+): `grid-cols-[220px_1fr]` — sidebar in grid.

2. **Sidebar state**:

   - Add local state: `const [sidebarOpen, setSidebarOpen] = useState(false)`.
   - Pass `sidebarOpen` and `onClose={() => setSidebarOpen(false)}` to `Sidebar`.
   - Pass `onMenuToggle={() => setSidebarOpen(prev => !prev)}` to `PageHeader`.
   - Use `useBreakpoint()` to determine if sidebar should be in drawer mode (`isMobile || isTablet`). When in drawer mode, sidebar renders as an overlay. When not, sidebar is a normal grid child and `sidebarOpen` state is ignored.

3. **Layout structure** (mobile/tablet):
   ```
   <div class="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-screen">
     <Sidebar isDrawer={isDrawerMode} isOpen={sidebarOpen} onClose={closeSidebar} />
     <main>...</main>
   </div>
   ```

### File: `src/components/layout/Sidebar.tsx`

**Current**: Static sidebar, `sticky top-0 h-screen`, `bg-bg-sidebar border-r`.

**New props:**

```ts
interface SidebarProps {
  isDrawer?: boolean // true on mobile/tablet
  isOpen?: boolean // drawer open state
  onClose?: () => void // close drawer callback
}
```

**Behavior:**

1. **Desktop/Laptop mode** (`isDrawer = false`):

   - Render exactly as today. No changes.

2. **Drawer mode** (`isDrawer = true`):

   - When `isOpen = false`: render nothing (or render off-screen with no visibility).
   - When `isOpen = true`:
     - Render a **backdrop** overlay: fixed full-screen, `bg-black/50`, `z-40`. Clicking it calls `onClose`.
     - Render the **sidebar drawer**: fixed, `left-0 top-0 h-full w-[220px]`, `z-50`, `bg-bg-sidebar`. Same content as the static sidebar.
     - Animate with `motion`: slide in from `x: -220` to `x: 0`, backdrop fades in.
     - Include a **close button** (X icon) in the drawer header area, top-right of the logo row.

3. **AnimatePresence**: Wrap the drawer + backdrop in `AnimatePresence` so exit animations play when `isOpen` becomes `false`.

4. **Body scroll lock**: When drawer is open, optionally prevent body scroll (set `overflow: hidden` on `<body>`). Clean up on close or unmount.

---

## Part 3: PageHeader

### File: `src/components/layout/PageHeader.tsx`

**New prop:**

```ts
interface PageHeaderProps {
  onMenuToggle?: () => void // hamburger click handler
}
```

**Responsive changes:**

1. **Padding**:

   - Base: `px-4 py-4`
   - `sm:`: `px-6 py-5`
   - `md:`: `px-8 py-6`

2. **Title**:

   - Base: `text-lg` (14px)
   - `sm:`: `text-xl` (16px)
   - `md:`: `text-2xl` (20px)

3. **Subtitle**:

   - Base: hidden (`hidden`)
   - `sm:`: visible (`sm:block`)

4. **Hamburger button**:

   - Base: visible, positioned as the first item in the left section. Standard 3-line hamburger icon, `w-8 h-8`, ghost button style.
   - `md:`: hidden (`md:hidden`)
   - Calls `onMenuToggle` on click.

5. **Action buttons**:
   - "Export" and "Add Indicator" buttons:
     - Base: hidden (`hidden`)
     - `sm:`: visible (`sm:inline-flex`)
   - Live feed indicator:
     - Base: hidden (`hidden`)
     - `md:`: visible (`md:inline-flex`)
   - ThemeToggle: always visible.

---

## Part 4: StatsRow

### File: `src/components/dashboard/StatsRow.tsx`

**Responsive grid:**

1. **Grid columns**:

   - Base: `grid-cols-2`
   - `md:`: `grid-cols-5`

2. **Total card span**:

   - Base: `col-span-2` (full width of the 2-col grid)
   - `md:`: `col-span-1` (normal single cell in 5-col grid)
   - Apply the span on the `motion.div` wrapper for the first card (index 0 / key `total`).

3. **Container padding**:

   - Base: `px-4 py-4`
   - `sm:`: `px-6 py-5`
   - `md:`: `px-8 py-5`

4. **Gap**:

   - Base: `gap-2`
   - `sm:`: `gap-3`

5. **Skeleton**: Update `StatsRowSkeleton` to match the same responsive grid classes.

---

## Part 5: Toolbar (Collapsible Filters)

### File: `src/components/dashboard/Toolbar.tsx`

**Changes:**

1. **Container padding**:

   - Base: `px-4 py-3`
   - `sm:`: `px-6 py-4`
   - `md:`: `px-8 py-4`

2. **Layout restructure** (mobile/tablet):

   On screens below `md:`, the toolbar renders in two sections:

   **Top row** (always visible):

   - Search input: `w-full` (no fixed width).
   - Filter toggle button (new): ghost button with a filter/funnel icon + "Filters" label. Shows the count of active filters as a badge if any are active. Visible only below `md:` (`md:hidden`).

   **Expandable row** (conditionally visible):

   - Controlled by local state: `const [filtersExpanded, setFiltersExpanded] = useState(false)`.
   - When expanded, renders filter dropdowns stacked in a `flex flex-wrap gap-2` row below the search.
   - Also contains the "Clear filters" button.
   - Animate expand/collapse: use `motion.div` with `AnimatePresence`, `initial={{ height: 0, opacity: 0 }}`, `animate={{ height: 'auto', opacity: 1 }}`, `exit={{ height: 0, opacity: 0 }}` with `overflow: hidden`.

3. **Layout** (laptop/desktop — `md:` and above):

   - Current horizontal layout: search (fixed `md:w-[260px]`) + divider + filter dropdowns inline + right-aligned actions.
   - Filter toggle button hidden (`md:hidden`).
   - Divider hidden below `md:` (`hidden md:block`).
   - Filter dropdowns always visible on `md:+`: wrapped in a container that's `hidden md:flex`.

4. **Search input width**:

   - Base: `w-full`
   - `md:`: `md:w-[260px]`

5. **Selection badge**: Always visible when `selectedCount > 0`, in the right-aligned section.

---

## Part 6: DataTable (Horizontal Scroll + Column Visibility)

### File: `src/components/table/DataTable.tsx`

**Changes:**

1. **Scroll wrapper**:

   - Wrap the `<table>` in a `<div className="overflow-x-auto">` to enable horizontal scrolling on small screens.

2. **Container padding**:

   - Base: `px-4 pt-3 pb-4`
   - `sm:`: `px-6 pt-4 pb-5`
   - `md:`: `px-8 pt-4 pb-6`

3. **Column visibility**:

   Define a column visibility system. Add a `visibleColumns` set or use CSS classes to hide columns at breakpoints.

   | Column     | Mobile (base) | Tablet (`sm:`) | Laptop+ (`md:`) |
   | ---------- | ------------- | -------------- | --------------- |
   | Checkbox   | visible       | visible        | visible         |
   | Indicator  | visible       | visible        | visible         |
   | Type       | visible       | visible        | visible         |
   | Severity   | visible       | visible        | visible         |
   | Confidence | visible       | visible        | visible         |
   | Source     | hidden        | visible        | visible         |
   | Tags       | hidden        | hidden         | visible         |
   | Last Seen  | visible       | visible        | visible         |

   **Implementation**: Use Tailwind responsive classes on `<th>` and `<td>` elements:

   - Source column: `hidden sm:table-cell`
   - Tags column: `hidden md:table-cell`

   This requires updating both `TableHeader.tsx` and `TableRow.tsx` to apply these classes to the respective cells.

### File: `src/components/table/TableHeader.tsx`

**Changes:**

- Add responsive visibility classes to the Source and Tags header cells:
  - Source `<th>`: add `hidden sm:table-cell`
  - Tags `<th>`: add `hidden md:table-cell`

### File: `src/components/table/TableRow.tsx`

**Changes:**

- Add matching responsive visibility classes to the Source and Tags data cells:
  - Source `<td>`: add `hidden sm:table-cell`
  - Tags `<td>`: add `hidden md:table-cell`

---

## Part 7: DetailPanel

### File: `src/components/detail/DetailPanel.tsx`

**Current**: Fixed `w-[400px]`, positioned as a flex child next to the table area.

**Changes:**

1. **Width**:

   - Base (mobile/tablet): `w-full` — panel takes full viewport width.
   - `md:` (laptop+): `w-[400px]` — current fixed width.

2. **Positioning** (mobile/tablet):

   - Render as a **fixed overlay**: `fixed inset-0 z-30`.
   - Background: `bg-bg-surface` (full-screen, no backdrop needed since it covers everything).
   - Include a visible **back/close button** in the header for easy dismissal.

3. **Positioning** (laptop+):

   - Current behavior: flex child that pushes table content, or fixed right panel depending on current implementation. No change from existing behavior.

4. **Animation**:

   - Base: slide in from the right (`x: '100%'` → `x: 0`) with `motion.div`.
   - Laptop+: same slide-in animation, narrower width.

5. **Body padding**:
   - Base: `p-4`
   - `sm:`: `p-5`

---

## Part 8: Pagination

### File: `src/components/dashboard/Pagination.tsx`

**Changes:**

1. **Container padding**:

   - Base: `px-4 py-3`
   - `sm:`: `px-6 py-3`
   - `md:`: `px-8 py-3 pb-5`

2. **Layout**:

   - Base: `flex flex-col gap-2 items-center` (stack info above controls) or `flex items-center justify-between` with smaller text.
   - `sm:`: `flex items-center justify-between` (current horizontal layout).

3. **Page number buttons**:

   - Base: Show only prev/next arrows. Hide individual page number buttons. Display "Page X of Y" in the info text.
   - `sm:`: Show prev/next + current page + ellipsis + last page (limit to 3-4 visible buttons).
   - `md:`: Full pagination as currently implemented.

   **Implementation**: Use `useBreakpoint()` to determine how many page buttons to render, or use responsive CSS classes (`hidden sm:flex`, `hidden md:flex`) on the numbered button groups.

4. **Info text**:
   - Base: `text-[10px]` — shortened: "Page X of Y" or "X–Y of Z"
   - `sm:`: `text-xs` — current format: "Showing X-Y of Z indicators"

---

## Part 9: Testing

### File: `src/hooks/useMediaQuery.test.ts` (new)

**Requirements:**

- Mock `window.matchMedia` to return controlled `matches` values.
- Test that the hook returns `true` when the media query matches.
- Test that the hook returns `false` when the media query does not match.
- Test that the hook updates when the media query match state changes (simulate `change` event on `MediaQueryList`).
- Test cleanup: listener is removed on unmount.

**Mock setup:**

```ts
function createMatchMedia(matches: boolean) {
  return (query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })
}
```

### File: `src/hooks/useBreakpoint.test.ts` (new)

**Requirements:**

- Mock `useMediaQuery` (vi.mock the module).
- Test all four states:
  - `isMobile = true` when no breakpoint matches (all false).
  - `isTablet = true` when `aboveSm` matches but `aboveMd` does not.
  - `isLaptop = true` when `aboveMd` matches but `aboveLg` does not.
  - `isDesktop = true` when `aboveLg` matches.
- Verify only one boolean is `true` at a time.

### File: `src/components/layout/Sidebar.test.tsx` (new or update existing)

**Requirements:**

- Test static mode: sidebar renders navigation items when `isDrawer = false`.
- Test drawer mode closed: nothing renders (or is hidden) when `isDrawer = true` and `isOpen = false`.
- Test drawer mode open: sidebar content + backdrop render when `isDrawer = true` and `isOpen = true`.
- Test backdrop click calls `onClose`.
- Test close button click calls `onClose`.

### File: `src/components/layout/PageHeader.test.tsx` (new or update existing)

**Requirements:**

- Hamburger button renders and calls `onMenuToggle` on click.
- Title always renders.
- Subtitle has the CSS class `hidden sm:block` (i.e., it's present in DOM with responsive visibility).

### File: `src/components/dashboard/Toolbar.test.tsx` (new or update existing)

**Requirements:**

- Filter toggle button renders (it will have `md:hidden` class but is in the DOM).
- Clicking filter toggle expands filter section (filter dropdowns become visible).
- Clicking again collapses it.
- Search input is always visible.
- When filters are active, filter toggle button shows active count badge.

### File: `src/components/table/DataTable.test.tsx` (update existing)

**Requirements:**

- Table is wrapped in a scrollable container (has `overflow-x-auto` class).
- Source column header/cells have `hidden sm:table-cell` class.
- Tags column header/cells have `hidden md:table-cell` class.

### File: `src/components/dashboard/Pagination.test.tsx` (update existing)

**Requirements:**

- Test that page info text and controls always render.
- Verify mobile-specific elements are present (prev/next buttons are always in DOM).

---

## Acceptance Criteria

- [ ] Custom breakpoints defined: `sm: 481px`, `md: 769px`, `lg: 1025px`, `xl: 1441px`.
- [ ] `useMediaQuery` and `useBreakpoint` hooks created and tested.
- [ ] **Sidebar**: Hidden on mobile/tablet with hamburger toggle in PageHeader; opens as animated drawer overlay with backdrop; closes on backdrop click, close button, or navigation; visible in grid on laptop+.
- [ ] **PageHeader**: Responsive padding (`px-4` → `px-6` → `px-8`), hamburger visible below `md:`, subtitle hidden on mobile, action buttons hidden on mobile.
- [ ] **StatsRow**: 2-col grid on mobile/tablet (total card spans 2 cols), 5-col grid on laptop+. Responsive padding and gap.
- [ ] **Toolbar**: Search full-width on mobile/tablet, filter dropdowns behind animated collapsible toggle below `md:`, inline on `md:+`.
- [ ] **DataTable**: Wrapped in `overflow-x-auto` for horizontal scroll. Source column hidden below `sm:`, Tags column hidden below `md:`.
- [ ] **DetailPanel**: Full-width overlay on mobile/tablet, 400px slide-in on laptop+.
- [ ] **Pagination**: Prev/next only on mobile, progressive page buttons on tablet, full on laptop+. Responsive padding.
- [ ] No horizontal overflow or layout breakage at any viewport width from 320px to 1440px+.
- [ ] Existing animations (stat card stagger, table row entrance, detail panel slide-in) continue to work at all breakpoints.
- [ ] Reduced motion preferences still respected at all breakpoints.
- [ ] All new hooks and responsive behaviors tested.
- [ ] All existing tests continue to pass.

---

## Files to Create

| File                                     | Purpose                           |
| ---------------------------------------- | --------------------------------- |
| `src/hooks/useMediaQuery.ts`             | Reusable media query hook         |
| `src/hooks/useMediaQuery.test.ts`        | Tests for useMediaQuery           |
| `src/hooks/useBreakpoint.ts`             | Named breakpoint booleans hook    |
| `src/hooks/useBreakpoint.test.ts`        | Tests for useBreakpoint           |
| `src/components/layout/Sidebar.test.tsx` | Tests for sidebar drawer behavior |

## Files to Modify

| File                                           | Changes                                                      |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `src/styles/global.css`                        | Custom breakpoints in `@theme`                               |
| `src/components/layout/AppLayout.tsx`          | Responsive grid, sidebar state, pass props                   |
| `src/components/layout/Sidebar.tsx`            | Drawer mode: overlay, backdrop, animation, close button      |
| `src/components/layout/PageHeader.tsx`         | Hamburger button, responsive padding/title/actions           |
| `src/components/dashboard/StatsRow.tsx`        | Responsive grid cols, padding, total card span               |
| `src/components/dashboard/Toolbar.tsx`         | Collapsible filters, full-width search, filter toggle button |
| `src/components/table/DataTable.tsx`           | Scroll wrapper, responsive padding                           |
| `src/components/table/TableHeader.tsx`         | Column visibility classes                                    |
| `src/components/table/TableRow.tsx`            | Column visibility classes                                    |
| `src/components/detail/DetailPanel.tsx`        | Responsive width, full-screen overlay on mobile              |
| `src/components/dashboard/Pagination.tsx`      | Responsive layout, conditional page buttons                  |
| `src/components/layout/PageHeader.test.tsx`    | Add/update tests for hamburger and responsive elements       |
| `src/components/dashboard/Toolbar.test.tsx`    | Add/update tests for filter toggle                           |
| `src/components/table/DataTable.test.tsx`      | Add/update tests for scroll wrapper and column visibility    |
| `src/components/dashboard/Pagination.test.tsx` | Add/update tests for responsive pagination                   |

---

## Notes

- **Mobile-first**: All base Tailwind classes target mobile. Use `sm:`, `md:`, `lg:` to layer on larger-screen styles.
- **CSS vs JS**: Prefer Tailwind responsive prefixes (CSS) for visual changes (padding, grid, visibility). Use `useBreakpoint` only when component logic or conditional rendering is needed (sidebar drawer mode, pagination button count, filter collapse state awareness).
- **No new dependencies**: Use only existing packages (Tailwind, motion/react).
- **Drawer close on nav**: When a navigation link is clicked in the sidebar drawer, close the drawer automatically.
- **Minimum supported width**: 320px. No content should overflow or be inaccessible at this width.
- **Performance**: Avoid re-renders caused by breakpoint changes propagating unnecessarily. The `useBreakpoint` hook should only be called in components that genuinely need JS-driven responsive logic.
