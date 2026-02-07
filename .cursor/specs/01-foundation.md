# Spec 01: Foundation

> Tailwind CSS + Design System + API Layer + Custom Hooks + UI Primitives

## Overview

Set up the foundational layers that all other components depend on. This spec must be completed before any other specs can begin.

## Tasks

### 1. Install & Configure Tailwind CSS

- [ ] Install dependencies: tailwindcss, postcss, autoprefixer
- [ ] Create tailwind.config.js with custom theme
- [ ] Create postcss.config.js
- [ ] Update src/styles/global.css with Tailwind directives
- [ ] Add Google Fonts to index.html: DM Sans (400-700), JetBrains Mono (400-600)

### 2. Design Tokens

Map tokens from design-reference.html to Tailwind config:

Colors:

- Backgrounds: root (#0a0c10), surface (#0f1117), elevated (#161a23), card (#1a1e28), card-hover (#1e2230), sidebar (#0d0f14), input (#12151c)
- Borders: subtle (#1e2230), default (#262b38), hover (#353b4d), focus (#6383ff)
- Text: primary (#e8eaf0), secondary (#8b90a0), tertiary (#5c6170), muted (#3e4352)
- Brand: augur-blue (#6383ff), augur-blue-dim (rgba(99,131,255,0.15))
- Severity: critical (#ff4757), high (#ff8c42), medium (#ffc542), low (#48c774)
- Tags: red, blue, purple, teal, gray (with bg, text, border variants)

Typography:

- font-sans: 'DM Sans', system-ui, sans-serif
- font-mono: 'JetBrains Mono', monospace

Border Radius: sm (4px), md (6px), lg (8px), xl (12px)

### 3. API Client

Create src/api/indicators.ts:

- [ ] fetchIndicators(filters: IndicatorFilters): Promise<PaginatedResponse<Indicator>>
- [ ] fetchIndicatorById(id: string): Promise<Indicator>
- [ ] fetchStats(): Promise<Stats>

Create src/types/stats.ts:

- [ ] Define Stats interface matching /api/stats response

### 4. Custom Hooks

Create in src/hooks/:

- [ ] useIndicators.ts — fetching with filters, pagination, loading, error states
- [ ] useStats.ts — fetch dashboard statistics
- [ ] useDebounce.ts — generic debounce hook (300ms default)

### 5. UI Primitive Components

Create in src/components/ui/:

| Component         | Variants/Props                                                |
| ----------------- | ------------------------------------------------------------- |
| Badge.tsx         | severity: critical, high, medium, low                         |
| Tag.tsx           | color: red, blue, purple, teal, gray                          |
| Button.tsx        | variant: primary, secondary, ghost, danger; size: default, sm |
| Input.tsx         | icon prop, placeholder, standard input props                  |
| Select.tsx        | options array, value, onChange                                |
| ConfidenceBar.tsx | value (0-100), severity for color                             |
| Skeleton.tsx      | className for sizing, shimmer animation                       |

- [ ] Create barrel export src/components/ui/index.ts

### 6. Unit Tests

- [ ] src/hooks/useDebounce.test.ts
- [ ] src/components/ui/Badge.test.tsx
- [ ] src/components/ui/ConfidenceBar.test.tsx

## Files to Create

tailwind.config.js
postcss.config.js
src/api/indicators.ts
src/types/stats.ts
src/hooks/useIndicators.ts
src/hooks/useStats.ts
src/hooks/useDebounce.ts
src/hooks/useDebounce.test.ts
src/components/ui/Badge.tsx
src/components/ui/Badge.test.tsx
src/components/ui/Tag.tsx
src/components/ui/Button.tsx
src/components/ui/Input.tsx
src/components/ui/Select.tsx
src/components/ui/ConfidenceBar.tsx
src/components/ui/ConfidenceBar.test.tsx
src/components/ui/Skeleton.tsx
src/components/ui/index.ts

## Files to Modify

index.html (add fonts)
src/styles/global.css (Tailwind directives)

## Verification

- [ ] npm run dev starts without errors
- [ ] Tailwind classes work in components
- [ ] npm test passes for new tests
- [ ] No TypeScript errors
- [ ] No ESLint errors

## References

- design-reference.html — lines 13-117 for CSS variables
- src/types/indicator.ts — existing type definitions
- server/index.js — API endpoint implementations
