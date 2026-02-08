# Spec 08: Animated Dashboard Stats

## Objective

Add smooth, performant animations to the dashboard: count-up numbers in stat cards, staggered card entrance, optional severity progress bars in stat cards, and subtle table row entrance. Animations run on initial load and whenever stats or table data changes. Use Framer Motion; respect reduced motion.

## Dependencies

- Spec 01–07 completed (StatsRow, StatCard, DataTable, TableRow, motion installed)
- Framer Motion (`motion`) already in project

## Overview

### Animation Summary

| Element             | Animation                             | When                               |
| ------------------- | ------------------------------------- | ---------------------------------- |
| Stat cards          | Staggered entrance (fade + slight y)  | On stats load / stats change       |
| Stat card numbers   | Count-up from 0 to value              | On stats load / stats change       |
| Severity stat cards | Thin progress bar fills (value/total) | On stats load / stats change       |
| Table rows          | Staggered fade + slight y             | On data load / page or data change |

### Timing

- Count-up: fixed **800ms** duration.
- Stat card stagger: **100ms** delay between cards (0, 100, 200, 300, 400 ms).
- Table row stagger: **40ms** between rows, duration **150ms** (keep table snappy).
- Respect `prefers-reduced-motion`: no or instant animations when reduced.

---

## Part 1: Count-Up Hook

### File: `src/hooks/useCountUp.ts`

Create a hook that animates a number from a previous value (or 0) to the current value over a fixed duration.

**Requirements:**

- Signature: `useCountUp(value: number, options?: { duration?: number; enabled?: boolean })`
- Return: `displayValue: number` (rounded for display).
- When `value` or `duration` changes, animate from current `displayValue` to new `value` over `duration` ms.
- Use a `useEffect` + `requestAnimationFrame` loop that interpolates from start to end over `duration` ms. No Framer Motion `animate()` — rAF is simpler and more testable with fake timers.
- `enabled`: when false, set `displayValue = value` immediately (for reduced motion).
- Default `duration`: 800.
- On first mount, animate from 0 to `value` if `enabled`; otherwise set `displayValue = value` immediately.
- Ensure cleanup on unmount (cancel any pending rAF).

---

## Part 2: StatCard with Count-Up and Progress Bar

### File: `src/components/dashboard/StatCard.tsx`

**Updates:**

1. **Count-up**

   - Only apply count-up when `typeof value === 'number'`; when `value` is a string, display it as-is (no animation).
   - Use `useCountUp(value, { duration: 800, enabled: !reducedMotion })`.
   - Display `displayValue` (formatted with `toLocaleString()`) instead of raw `value`.
   - Get reduced motion from Framer Motion's `useReducedMotion`.

2. **Progress bar (severity cards only)**

   - New optional prop: `total?: number`. When `total` is provided and `variant` is a severity (critical/high/medium/low), render a thin bar showing proportion.
   - Bar: height 4px, full width, border-radius 2px. Track div has `overflow: hidden` and `border-radius: 2px`. Inner fill div uses severity color as background.
   - Animate fill using `motion.div` with `initial={{ scaleX: 0 }}` and `animate={{ scaleX: value/total }}` with `transformOrigin: 'left'`. The `overflow: hidden` on the track ensures border-radius isn't distorted by the scale transform. Duration ~400ms, only when `total > 0`.

3. **No layout shift**
   - Progress bar lives below subtitle; reserve space so layout doesn’t jump.

**Props interface (add):**

- `total?: number` — used for progress bar and only when variant is severity.

---

## Part 3: StatsRow with Staggered Entrance

### File: `src/components/dashboard/StatsRow.tsx`

**Requirements:**

1. **Staggered card entrance**

   - Refactor StatCards to be driven by a config array so stagger delay can use the array index. Each card wrapped in `motion.div` with:
     - `initial`: opacity 0, y 8.
     - `animate`: opacity 1, y 0.
     - `transition`: delay by index (0, 0.1, 0.2, 0.3, 0.4 seconds), duration 0.25s, ease out.
   - When `stats` change (new fetch), re-run entrance (e.g. key the list by a stable "stats version" or `JSON.stringify(stats)` so animation runs again).

2. **Pass `total` into severity StatCards**

   - For Critical, High, Medium, Low cards, pass `total={stats.total}` so the new progress bar shows proportion.

3. **Reduced motion**
   - Use `useReducedMotion()`. When true, set `initial` and `animate` to the same values (no opacity/y animation) and use delay 0.

---

## Part 4: Table Row Entrance

### File: `src/components/table/DataTable.tsx` (or TableRow)

**Requirements:**

1. **Subtle row animation**

   - Rows should animate in with a short stagger so the table doesn’t feel static, but stays fast.
   - Use `motion.tr` directly in `TableRow` (Framer Motion handles `<tr>` fine, no wrapper needed). Apply:
     - `initial`: opacity 0, y 4.
     - `animate`: opacity 1, y 0.
     - `transition`: delay `index * 0.04`, duration 0.15.
   - Add an `index` prop to `TableRow` for computing the stagger delay.

2. **When to animate**

   - On initial load when `data` first has length.
   - When `data` or `page` changes (new page or new filter result). Add a `page` prop to `DataTable` and use a key on the `<tbody>` so the list re-animates: e.g. `key={`${page}-${data[0]?.id ?? ''}`}` so each "view" of the table has one entrance.

3. **Reduced motion**

   - If reduced motion: no delay, duration 0 (or skip animation).

4. **Performance**
   - Keep stagger and duration small (e.g. 40ms, 150ms). No heavy layout or box-shadow animations.

---

## Part 5: Accessibility and Performance

### Reduced motion

- In every component that uses motion, call `useReducedMotion()` from `motion/react`.
- When true:
  - Count-up: `enabled: false` (show final number immediately).
  - Stat cards: no stagger, no opacity/y (show immediately).
  - Progress bar: optional instant fill or no animation.
  - Table rows: no stagger, no opacity/y (or duration 0).

### Performance

- Avoid animating large lists with heavy layout: table uses only opacity and small y.
- Don’t animate skeleton state; only animate final content (stats and table rows when data is present).

---

## Part 6: Testing

### File: `src/hooks/useCountUp.test.ts`

- Use `vi.useFakeTimers()` to control rAF timing.
- Renders to final value immediately when `enabled: false`.
- When `enabled: true`, over 800ms the displayed value moves from 0 toward the target. Use `vi.advanceTimersByTime(800)` and assert it reaches the target.
- When `value` changes, animation runs from previous to new value.

### File: `src/components/dashboard/StatCard.test.tsx` (update existing or add)

- Renders label and formatted value.
- When `total` is provided and variant is severity, a progress bar is present (e.g. by role or test id).
- When `total` is 0 or undefined, no progress bar (or bar not visible).

### Optional: StatsRow / DataTable

- Smoke test: StatsRow renders without error when stats load; DataTable renders rows without error. No need to assert animation keyframes in unit tests.

---

## Acceptance Criteria

- [ ] Stat card numbers count up from 0 (or previous value) to current value over 800ms.
- [ ] Stat cards appear with staggered entrance (100ms between cards), fade + slight y.
- [ ] Severity stat cards (Critical, High, Medium, Low) show a thin progress bar (value/total), bar fills on load/update.
- [ ] Table rows appear with a subtle stagger (40ms) and short animation (150ms), fade + slight y.
- [ ] Animations run on initial load and when stats or table data change (e.g. filters, page).
- [ ] When `prefers-reduced-motion: reduce`, all above animations are disabled or instant.
- [ ] No significant layout shift or performance regression; table remains responsive.
- [ ] Count-up and StatCard tests added/updated as specified.

---

## Files to Create

- `src/hooks/useCountUp.ts`
- `src/hooks/useCountUp.test.ts` (or `.test.tsx` if needed)

## Files to Modify

- `src/components/dashboard/StatCard.tsx` (count-up, progress bar, useReducedMotion)
- `src/components/dashboard/StatsRow.tsx` (staggered motion wrappers, pass `total`, useReducedMotion)
- `src/components/table/DataTable.tsx` (and/or TableRow.tsx) (row entrance, key for re-run, useReducedMotion)
- `src/components/dashboard/StatCard.test.tsx` (or create) (progress bar and value display)

---

## Notes

- Use Framer Motion only (no GSAP) for this spec.
- Count-up uses a single fixed duration (800ms) for all numbers.
- Stagger: 100ms for stats, 40ms for table rows.
- Progress bar in StatCard is optional visually when `total` is missing; only severity variants show it when `total` is passed.
