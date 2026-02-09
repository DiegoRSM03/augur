# Threat Intelligence Dashboard

## Spec-Driven Development

Specs live in `.cursor/specs/` and are implemented sequentially (01 through 08).
Always read the relevant spec before implementing. Each spec lists prerequisites,
exact component structure, files to create/modify, and acceptance criteria.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + CSS variables from design-reference.html
- **Animation**: Framer Motion `motion` package (v12+), import from `motion/react`
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

## Code Quality Standards

### Engineering Philosophy

Write code as a Staff-level React/TypeScript frontend engineer. This means:

- **Clarity over cleverness.** Code should read like well-written prose. If a piece of logic needs a comment to explain _what_ it does, rename things until it doesn't. Reserve comments only for explaining _why_ a non-obvious decision was made.
- **Single Responsibility everywhere.** Each file, component, hook, and function does one thing. If you're naming something with "and" (e.g., `fetchDataAndTransform`), split it.
- **Composition over configuration.** Prefer small composable pieces over large components controlled by many props. A component with more than 5-6 props is a code smell — consider whether it should be split or composed differently.
- **No premature abstraction.** Don't extract something into a shared utility or component until it's used in at least 2 places. Duplication is far cheaper than the wrong abstraction.
- **Explicit over implicit.** Avoid magic strings, unexplained numbers, and hidden side effects. Use enums or const objects for string literals, named constants for numbers, and clearly named hooks for effects.

### File Organization

- **One component per file.** Never define multiple exported components in a single file. Small internal helper components (not used elsewhere) are fine but should be extracted the moment they grow beyond ~20 lines or become reusable.
- **Co-location principle.** Keep related code together: component, its types, its hook, its test, all in the same directory. Use barrel `index.ts` files for clean public APIs.
- **Named exports only.** Use named exports everywhere for better refactoring support and import clarity. The only exception is lazy-loaded route components that need `React.lazy()`.

### Component Architecture

- **Structure every component consistently:**
  1. Props interface (named, e.g., `StatCardProps`)
  2. Hook calls
  3. Derived/computed values
  4. Event handlers
  5. Early returns (loading, error, empty states)
  6. Main JSX return

- **Apply composition patterns actively:**
  - Use `children` and slot props to avoid prop drilling through intermediate layers.
  - Use compound components (e.g., `<DataTable> <DataTable.Header /> <DataTable.Row />`) when a parent and its children share implicit state.
  - Extract all non-trivial logic into custom hooks — components should be almost purely declarative JSX.
  - Separate data/logic concerns from presentation: hooks fetch and compute, components render.

- **Props discipline:**
  - Define Props as named interfaces, never inline.
  - Type event handlers explicitly: `React.MouseEvent<HTMLButtonElement>`.
  - Avoid boolean prop sprawl (`isLoading`, `isDisabled`, `isCompact`, `isOpen`...). If a component has 3+ boolean props, reconsider the API — consider a `variant` or `state` union type, or split into separate components.
  - Destructure props in the function signature.

### State Management

- Local state for UI-only concerns (open/closed, hover, form inputs).
- Lift state to the nearest common ancestor only when siblings need it.
- Context for truly global concerns (theme, auth, feature flags). Do NOT use Context as a general-purpose state bus — if you need to pass data through 2 levels, just pass it.
- Every Context must have a well-typed custom hook (e.g., `useAuth`, never raw `useContext(AuthContext)`).
- Keep state as close to where it's used as possible. Push state down, not up.

### Custom Hooks

- Name hooks by what they _provide_, not what they do internally: `useIndicators` not `useFetchIndicatorsFromApiAndCacheResult`.
- Every hook should have a clear, typed return value — prefer returning an object `{ data, isLoading, error }` over a tuple for anything with more than 2 values.
- Hooks must be pure consumers of state and effects. Never let a hook silently modify DOM or trigger navigation as a side effect.
- Extract hooks when a component has more than ~2 `useState` + ~1 `useEffect` related to the same concern.

### TypeScript

- **Strict mode, zero `any`.** Use `unknown` and narrow with type guards when the type is truly uncertain.
- Prefer `interface` for object shapes and component props. Use `type` for unions, intersections, and utility types.
- Use discriminated unions for state modeling instead of parallel booleans:

  ```ts
  // Bad
  { isLoading: boolean; isError: boolean; data: T | null }

  // Good
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }
  ```

- Use `as const` and `satisfies` where they improve type safety.
- Never use type assertions (`as`) to silence the compiler — fix the underlying type instead.

### Comments Policy

- **Delete comments that describe _what_ the code does.** The code itself should be that documentation.
- **Keep comments that explain _why_** a non-obvious decision was made (business rules, workarounds, performance tradeoffs).
- **Use JSDoc sparingly** — only on exported utility functions and shared hooks where the intent isn't self-evident from the signature.
- `// TODO:` comments must include context and a reason. Bare `// TODO: fix this` is not acceptable.

### Error Handling

- Never silently swallow errors. At minimum, log them; ideally, surface them to the user.
- Use error boundaries at route/panel level to prevent full-page crashes.
- API calls must always handle: loading, success, error, and empty states. No happy-path-only components.
- Type errors explicitly — prefer custom error types or discriminated unions over `catch (e: any)`.

### Performance Awareness

- Don't optimize prematurely, but don't be careless either.
- Memoize expensive computations with `useMemo` and callback references with `useCallback` only when there's a measurable reason (preventing re-renders of heavy subtrees, stabilizing deps for effects).
- Never memoize everything by default — it adds complexity and can actually hurt performance if the comparison cost exceeds the render cost.
- Virtualize lists only when row count justifies it (100+ items).
- Lazy-load route-level components. Don't lazy-load small UI primitives.

## Testing Standards (Vitest + RTL)

### Principles

- Test behavior from the user's perspective, never implementation details. Don't test internal state, hook return values in isolation (unless it's a complex shared hook), or CSS classes.
- Each test should read like a user story: "When I click the filter button, I see only critical indicators."
- AAA pattern: Arrange → Act → Assert, clearly separated.

### Query Priority

`getByRole` > `getByLabelText` > `getByText` > `getByTestId`. Only use `data-testid` as a last resort.

### Interactions and Async

- Always use `userEvent.setup()`, never `fireEvent`.
- Use `findByText` / `findByRole` (with implicit `waitFor`) for content that appears after async operations.
- Use `vi.mock()` for API calls. Never let tests hit a real server.

### Keep Tests DRY Without Sacrificing Readability

- Use `test.each` or `it.each` when multiple tests differ only by input/output values. The test name template should make each case's intent clear.
- Extract shared setup into factory functions (e.g., `renderIndicatorTable({ severity: 'critical' })`) rather than deeply nested `beforeEach` blocks.
- Every test must be understandable in isolation — a reader should never have to scroll to a `beforeEach` 50 lines away to understand what's happening.
- Co-locate test utilities with the tests that use them. Only promote to a shared `test-utils/` file when used across 3+ test files.

### What to Test

- User interactions and their visible outcomes.
- Conditional rendering (loading, error, empty, populated states).
- Accessibility: focus management, ARIA attributes, keyboard navigation.
- Edge cases: empty data, malformed responses, boundary values.

### What NOT to Test

- Styles or CSS classes.
- Internal component state.
- Third-party library behavior (Framer Motion animations, Tailwind classes).
- Implementation details that could change without affecting the user experience.

## Refactoring Rules

When modifying existing working code:

1. **Run the full test suite before touching anything.** Establish a green baseline.
2. **One refactor per commit.** Never mix refactoring with behavior changes.
3. **Run tests after every change.** If anything breaks, revert and rethink immediately.
4. **Don't introduce new dependencies** without explicit approval.
5. **Don't rename files or restructure folders in bulk** — propose the new structure first, then execute.
6. **Don't rewrite tests** — only refactor their structure while keeping assertions identical.
