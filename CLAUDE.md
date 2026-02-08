# Threat Intelligence Dashboard

## Spec-Driven Development

Specs live in `.cursor/specs/` and are implemented sequentially (01 through 08).
Always read the relevant spec before implementing. Each spec lists prerequisites,
exact component structure, files to create/modify, and acceptance criteria.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + CSS variables from design-reference.html
- **Animation**: Framer Motion (`motion` package v12+), import from `motion/react`
- **State**: React state + Context (no external state management)
- **Testing**: Vitest + React Testing Library
- **API**: Express mock server at localhost:3001, proxied to /api

## Project Structure

```
src/
├── api/              # Typed fetch wrappers
├── components/
│   ├── layout/       # AppLayout, Sidebar, PageHeader
│   ├── dashboard/    # StatsRow, StatCard, Toolbar, Pagination
│   ├── table/        # DataTable, TableRow, TableHeader
│   ├── detail/       # DetailPanel
│   └── ui/           # Badge, Tag, Button, Input, ConfidenceBar, Skeleton
├── hooks/            # useIndicators, useStats, useDebounce, useSelection, etc.
├── styles/           # global.css with design tokens
├── types/            # TypeScript interfaces (indicator.ts)
└── utils/            # formatters, exportCsv, detectIndicatorType
```

## API Endpoints

- `GET /api/indicators` — Paginated list (page, limit, severity, type, search)
- `GET /api/indicators/:id` — Single indicator details
- `GET /api/stats` — Summary statistics (total, critical, high, medium, low)

## Key Types (src/types/indicator.ts)

- `Indicator`: id, value, type, severity, source, firstSeen, lastSeen, tags, confidence
- `IndicatorType`: 'ip' | 'domain' | 'hash' | 'url'
- `Severity`: 'critical' | 'high' | 'medium' | 'low'
- `PaginatedResponse<T>`: data, total, page, totalPages

## Design Tokens

- **Fonts**: DM Sans (UI), JetBrains Mono (technical data)
- **Severity**: critical=#ff4757, high=#ff8c42, medium=#ffc542, low=#48c774
- **Brand**: augur-blue=#6383ff
- **Backgrounds**: root=#0a0c10, surface=#0f1117, card=#1a1e28
- Open `design-reference.html` for full reference

## Conventions

- Strict TypeScript: no `any`, use `unknown` if truly unknown
- Colocate tests: `Component.tsx` + `Component.test.tsx`
- Extract reusable logic into custom hooks
- Handle loading, error, and empty states for all async operations
- Debounce search inputs (300ms)

## Component Patterns

- Structure: Props interface -> hooks -> derived values -> handlers -> JSX
- Define Props as named interfaces (not inline)
- Use types from `src/types/indicator.ts`
- Local state for UI, lift to ancestor when shared, Context for global
- Type event handlers: `React.MouseEvent<HTMLButtonElement>`

## Testing Standards (Vitest + RTL)

- AAA pattern: Arrange, Act, Assert
- Query priority: getByRole > getByLabelText > getByText > getByTestId
- Use `userEvent.setup()` for interactions
- Use `vi.mock()` for API calls, `findByText` for async content
- Test behavior from user perspective, not implementation details
