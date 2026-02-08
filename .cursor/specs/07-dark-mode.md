# Spec 07: Dark Mode with Smooth Transition

## Objective

Add a dark/light theme toggle with smooth CSS transitions. The current design becomes "dark mode" and we introduce a new "light mode" variant. Users can toggle between themes with their preference persisted and system preference respected.

## Dependencies

- Spec 01-06 completed (existing UI components)
- Framer Motion installed (`npm install motion`)
- Motion skill installed (recommended): `npx skills add https://github.com/jezweb/claude-skills --skill motion`

## Overview

### Theme Strategy

- **Dark Mode**: Current design (default for users with `prefers-color-scheme: dark` or no preference)
- **Light Mode**: New lighter variant derived from current palette
- **Persistence**: localStorage with system preference as fallback
- **Transition**: 200ms ease-out on all color properties

---

## Part 1: Theme Context & Provider

### File: `src/context/ThemeContext.tsx`

Create a context that manages theme state, persistence, and system preference detection.

**Requirements:**

- Export `ThemeProvider` component that wraps the app
- Export `useTheme` hook returning `{ theme, toggleTheme, setTheme }`
- `theme` is either `'light'` or `'dark'`
- On mount, check localStorage for `'ti-dashboard-theme'` key
- If no stored preference, check `window.matchMedia('(prefers-color-scheme: light)')`
- Default to `'dark'` if no preference detected
- When theme changes, set `data-theme` attribute on `document.documentElement`
- Persist changes to localStorage
- Use `mounted` state to prevent hydration mismatch (return null until mounted)

---

## Part 2: Theme Toggle Button

### File: `src/components/ui/ThemeToggle.tsx`

Create an animated toggle button that switches between sun and moon icons.

**Requirements:**

- Use Framer Motion's `AnimatePresence` for exit animations
- Moon icon (Lucide-style SVG) for dark mode
- Sun icon (Lucide-style SVG) for light mode
- Animation: rotate 90° + fade on enter/exit
- Respect `useReducedMotion` - set duration to 0 if user prefers reduced motion
- Button has `aria-label` describing the action (e.g., "Switch to light mode")
- Use `.theme-toggle` class for styling

**Icon Specs:**

- Size: 20x20
- Stroke width: 2
- Current color (inherits from button)

---

## Part 3: CSS Theme Variables

### Update: `src/styles/global.css`

Add smooth transitions and light mode color definitions.

**Global Transitions:**

- Apply to `*`, `*::before`, `*::after`
- Properties: `background-color`, `border-color`, `color`, `fill`, `stroke`, `box-shadow`
- Duration: 200ms ease-out
- Exclude inputs/textareas/selects (add `transition: none !important`)

**Theme Toggle Button Styles (`.theme-toggle`):**

- Size: 36x36px
- Border radius: 8px
- Border: 1px solid `--color-border`
- Background: `--color-surface`
- Color: `--color-text-secondary`
- Hover: background `--color-surface-hover`, color `--color-text-primary`

**Dark Mode Variables (`:root`, `[data-theme="dark"]`):**
Keep all existing colors as-is. These are the current design colors.

**Light Mode Variables (`[data-theme="light"]`):**

Background:

- `--color-bg`: #f8fafc
- `--color-surface`: #ffffff
- `--color-surface-hover`: #f1f5f9
- `--color-surface-active`: #e2e8f0

Border:

- `--color-border`: #e2e8f0
- `--color-border-hover`: #cbd5e1
- `--color-border-focus`: #3b82f6

Text:

- `--color-text-primary`: #0f172a
- `--color-text-secondary`: #475569
- `--color-text-tertiary`: #64748b
- `--color-text-muted`: #94a3b8

Severity (darkened for contrast on light bg):

- `--color-critical`: #dc2626, bg: rgba(220,38,38,0.08), border: rgba(220,38,38,0.25)
- `--color-high`: #ea580c, bg: rgba(234,88,12,0.08), border: rgba(234,88,12,0.25)
- `--color-medium`: #ca8a04, bg: rgba(202,138,4,0.08), border: rgba(202,138,4,0.25)
- `--color-low`: #16a34a, bg: rgba(22,163,74,0.08), border: rgba(22,163,74,0.25)

Type Colors (darkened):

- `--color-type-ip`: #2563eb
- `--color-type-domain`: #7c3aed
- `--color-type-hash`: #db2777
- `--color-type-url`: #0891b2

Accent:

- `--color-accent`: #2563eb
- `--color-accent-hover`: #1d4ed8
- `--color-accent-bg`: rgba(37,99,235,0.08)

Confidence:

- `--color-confidence-track`: #e2e8f0
- `--color-confidence-fill`: #2563eb

Sidebar:

- `--color-sidebar-bg`: #ffffff
- `--color-sidebar-hover`: #f1f5f9
- `--color-sidebar-active`: #e2e8f0

Modal:

- `--color-overlay`: rgba(15,23,42,0.5)
- `--color-modal-bg`: #ffffff

Skeleton:

- `--color-skeleton`: #e2e8f0
- `--color-skeleton-shine`: #f1f5f9

Scrollbar:

- `--color-scrollbar-track`: #f1f5f9
- `--color-scrollbar-thumb`: #cbd5e1
- `--color-scrollbar-thumb-hover`: #94a3b8

---

## Part 4: Integration

### Update: `src/main.tsx`

Wrap the `<App />` component with `<ThemeProvider>`.

### Update: `src/components/layout/PageHeader.tsx`

Add `<ThemeToggle />` in the header actions area, positioned before the "Add Indicator" button.

### Update: `src/components/ui/index.ts`

Export `ThemeToggle` from the barrel file.

---

## Part 5: Component Audit

Verify all components use CSS variables instead of hardcoded colors:

1. Badge - severity colors
2. Tag - type colors
3. Button - accent, surface
4. Input/Select - surface, border
5. ConfidenceBar - confidence track/fill
6. Skeleton - skeleton colors
7. DataTable - surface, border
8. DetailPanel - surface, border
9. Sidebar - sidebar colors
10. Modals (Export, Add Indicator) - modal bg, overlay
11. Toast - surface, severity colors

If any component has hardcoded hex colors, update them to use the appropriate CSS variable.

---

## Part 6: Testing

### File: `src/components/ui/ThemeToggle.test.tsx`

Test cases:

- Renders toggle button
- Has accessible aria-label
- Toggles theme on click (dark → light → dark)
- Persists theme to localStorage

### File: `src/context/ThemeContext.test.tsx`

Test cases:

- Provides theme context to children
- toggleTheme switches between dark and light
- setTheme sets specific theme
- Throws error when useTheme is used outside provider

**Test Setup:**

- Mock localStorage (getItem, setItem, clear)
- Mock window.matchMedia to return { matches: false }
- Clear mocks and remove data-theme attribute in beforeEach

---

## Acceptance Criteria

- [ ] Theme toggle button appears next to "Add Indicator" button
- [ ] Clicking toggle switches between sun (light) and moon (dark) icons
- [ ] Icon transition is smooth (rotate + fade)
- [ ] All page colors transition smoothly (200ms ease-out)
- [ ] Theme persists across page refreshes (localStorage)
- [ ] First visit respects system preference (`prefers-color-scheme`)
- [ ] User choice overrides system preference
- [ ] All components render correctly in both themes
- [ ] Severity badges maintain readable contrast in light mode
- [ ] Confidence bars are visible in both themes
- [ ] Modals and overlays work in both themes
- [ ] Detail panel works in both themes
- [ ] Toast notifications work in both themes
- [ ] Reduced motion preference is respected
- [ ] All tests pass
- [ ] No accessibility contrast violations

---

## Files to Create

- `src/context/ThemeContext.tsx`
- `src/components/ui/ThemeToggle.tsx`
- `src/components/ui/ThemeToggle.test.tsx`
- `src/context/ThemeContext.test.tsx`

## Files to Modify

- `src/styles/global.css` (add light mode variables + transitions)
- `src/main.tsx` (wrap with ThemeProvider)
- `src/components/layout/PageHeader.tsx` (add ThemeToggle)
- `src/components/ui/index.ts` (export ThemeToggle)

---

## Dependencies to Install

bash
npm install motion

---

## Notes

- The current design becomes "dark mode" — no visual changes for existing users
- Light mode is the new addition
- Framer Motion is used only for the icon animation, not the color transitions
- CSS handles all color transitions for better performance
- The 200ms transition is fast enough to feel responsive but slow enough to be noticeable
