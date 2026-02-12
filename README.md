# Threat Intelligence Dashboard

> A production-ready threat intelligence dashboard built with React, TypeScript, and Tailwind CSS.

**Live Demo:** [https://augur-production-6d6c.up.railway.app](https://augur-production-6d6c.up.railway.app)

![Dashboard Preview](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-blue) ![Vitest](https://img.shields.io/badge/Vitest-2.1-green) ![CI/CD](https://img.shields.io/badge/CI%2FCD-Railway-purple)

---

## Features

### Core

| Feature                | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Dashboard Layout**   | Sidebar navigation, page header, stats row, data table, and slide-in detail panel |
| **Data Table**         | Paginated display of 500 threat indicators with column sorting                    |
| **Advanced Filtering** | Real-time search with debouncing + severity/type dropdown filters                 |
| **Detail Panel**       | Click any row to view full indicator details in a slide-in panel                  |
| **State Management**   | Comprehensive loading, error, and empty states throughout                         |
| **Unit Tests**         | Key components and hooks tested with Vitest + React Testing Library               |
| **CI/CD Pipeline**     | GitHub Actions workflow with linting, testing, and auto-deploy to Railway         |

### Bonus

| Feature               | Description                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **Indicator Export**  | Multi-select with persistent selection across pages, CSV generation with proper escaping |
| **Add Indicator**     | Modal form with type auto-detection, tag chips, confidence slider, duplicate detection   |
| **Dark Mode**         | Theme toggle with localStorage persistence and smooth transitions                        |
| **Animated Stats**    | Count-up animations, progress bars, staggered entrances using Motion                     |
| **Responsive Design** | Mobile-first breakpoints, sidebar drawer, collapsible toolbar filters                    |

---

## Tech Stack

| Category   | Technology                     |
| ---------- | ------------------------------ |
| Framework  | React 18 + TypeScript          |
| Styling    | Tailwind CSS 4                 |
| Animation  | Motion (Framer Motion v12)     |
| Build Tool | Vite 6                         |
| Testing    | Vitest + React Testing Library |
| API        | Express.js (mock server)       |
| Deployment | Railway                        |
| CI/CD      | GitHub Actions                 |

---

## Architecture

### Component Structure

```
src/components/
├── dashboard/     # StatsRow, Toolbar, Pagination
├── detail/        # Detail panel for viewing indicator info
├── export/        # Export modal and CSV generation
├── indicator/     # Add indicator modal
├── layout/        # App shell (Sidebar, Header, Layout)
├── table/         # Data table components
└── ui/            # Reusable primitives (Badge, Button, Input, Modal, etc.)
```

### Custom Hooks

```
src/hooks/
├── useIndicators/      # Fetch paginated indicators with filters
├── useStats/           # Fetch dashboard statistics
├── useDebounce/        # Debounce search input
├── useSelection/       # Multi-select state management
├── useLocalIndicators/ # In-memory storage for new indicators
├── useMediaQuery/      # Responsive breakpoint detection
└── useToast/           # Toast notification system
```

### Design System

All design tokens are extracted from `design-reference.html` and implemented as CSS variables:

- **Colors** — Semantic palette (background, surface, border, text, severity)
- **Typography** — DM Sans for UI, JetBrains Mono for technical data
- **Spacing** — Consistent spacing scale
- **Components** — Badges, tags, buttons, inputs, confidence bars, skeletons

---

## API Documentation

Base URL: `http://localhost:3001` (proxied to `/api` in dev)

| Endpoint              | Method | Description              |
| --------------------- | ------ | ------------------------ |
| `/api/indicators`     | GET    | Paginated indicator list |
| `/api/indicators/:id` | GET    | Single indicator details |
| `/api/stats`          | GET    | Summary statistics       |

### Query Parameters

| Parameter  | Type   | Default | Description                                 |
| ---------- | ------ | ------- | ------------------------------------------- |
| `page`     | number | 1       | Page number                                 |
| `limit`    | number | 20      | Items per page (max 100)                    |
| `severity` | string | —       | Filter: `critical`, `high`, `medium`, `low` |
| `type`     | string | —       | Filter: `ip`, `domain`, `hash`, `url`       |
| `search`   | string | —       | Partial match on value, source, or tags     |

---

## Project Structure

```
├── .cursor/
│   ├── rules/              # Project conventions and patterns
│   └── specs/              # Implementation specifications
├── .github/
│   └── workflows/          # CI/CD pipeline
├── server/
│   ├── index.js            # Express API server
│   └── data.js             # Mock data generator
├── src/
│   ├── api/                # API client functions
│   ├── components/         # React components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom hooks
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── CLAUDE.md               # AI assistant instructions
├── design-reference.html   # Visual design spec
└── vite.config.ts
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development (React + API)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Development runs on:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001` (proxied to `/api`)

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- Badge.test.tsx
```

---

## CI/CD Pipeline

The GitHub Actions workflow:

1. **On every push/PR to main:**
   - Installs dependencies
   - Runs ESLint
   - Runs Vitest tests
   - Builds the production bundle

2. **On push to main (after tests pass):**
   - Deploys to Railway automatically

---

## Implementation Decisions

### State Management

React's built-in `useState` and `useContext`. For this scope, external libraries like Redux would add complexity without meaningful benefits.

### Styling

Tailwind CSS with custom design tokens. CSS variables bridge the design spec and Tailwind utilities.

### API Client

Plain `fetch` wrapped in custom hooks. The hooks (`useIndicators`, `useStats`) provide clean abstractions with loading/error states.

### Testing Strategy

Focused on UI primitives and critical business logic: Badge, Button, ConfidenceBar, Pagination, TableRow, ExportModal, form components.

### Export

Client-side CSV generation. For datasets of this size, browser-side generation is fast and avoids server round-trips.

---

## Development Approach

This project uses **Spec-Driven Development** — breaking down the problem into sequential specifications before implementation.

### Specs

```
.cursor/specs/
├── 01-foundation.md              # Design tokens, API client, hooks, UI primitives
├── 02-layout-shell.md            # AppLayout, Sidebar, PageHeader
├── 03-dashboard-core.md          # StatsRow, Toolbar, DataTable, Pagination
├── 04-detail-panel.md            # DetailPanel with all states
├── 05-indicators-export.md       # Multi-select, CSV export
├── 06-add-indicator.md           # Add indicator modal with validation
├── 07-dark-mode.md               # Light/dark mode toggle
├── 08-animate-dashboard-stats.md # Animated stats and transitions
└── 09-responsive-design.md       # Mobile-first responsive layout
```

Each spec includes objectives, dependencies, component structure, acceptance criteria, and test requirements.

### Project Rules

Conventions are documented in `.cursor/rules/` and `CLAUDE.md` to maintain consistency:

- Component patterns and TypeScript conventions
- Testing best practices
- Code quality standards

---

## Future Improvements

- **Performance** — Virtual scrolling for large datasets
- **Real-time** — WebSocket integration for live indicator feeds
- **Filtering** — Date range filters, saved filter presets
