# Threat Intelligence Dashboard

> A production-ready threat intelligence dashboard built with React, TypeScript, and Tailwind CSS.

**Live Demo:** [https://augur-production-6d6c.up.railway.app](https://augur-production-6d6c.up.railway.app)

![Dashboard Preview](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-blue) ![Vitest](https://img.shields.io/badge/Vitest-2.1-green) ![CI/CD](https://img.shields.io/badge/CI%2FCD-Railway-purple)

---

## Overview

This project is my submission for the Augur Security Frontend Engineering take-home assessment. The goal was to build a **Threat Intelligence Dashboard** that displays, filters, and explores threat indicators (malicious IPs, domains, file hashes, URLs).

Rather than diving straight into code, I took a **Spec-Driven Development (SDD)** approach to break down the problem, plan the architecture, and execute systematically. This README documents my process, decisions, and the final result.

---

## Features

- **Dashboard Layout** — Responsive sidebar navigation, page header, stats row, data table, and slide-in detail panel
- **Data Table** — Paginated display of 500 threat indicators with column sorting
- **Advanced Filtering** — Real-time search with debouncing + severity/type dropdown filters
- **Detail Panel** — Click any row to view full indicator details in a slide-in panel
- **Multi-Select & Export** — Select multiple indicators across pages and export to CSV
- **Add Indicator** — Modal form with auto-detection of indicator type, validation, and duplicate detection
- **State Management** — Comprehensive loading, error, and empty states throughout
- **Unit Tests** — Key components and hooks tested with Vitest + React Testing Library
- **CI/CD Pipeline** — GitHub Actions workflow with linting, testing, and auto-deploy to Railway

---

## Tech Stack

| Category   | Technology                     |
| ---------- | ------------------------------ |
| Framework  | React 18 + TypeScript          |
| Styling    | Tailwind CSS 4                 |
| Build Tool | Vite 6                         |
| Testing    | Vitest + React Testing Library |
| API        | Express.js (mock server)       |
| Deployment | Railway                        |
| CI/CD      | GitHub Actions                 |

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

## Development Approach: Spec-Driven Development

### Why SDD?

When I received this assignment, I could have jumped straight into coding. Instead, I chose a **Spec-Driven Development** approach for several reasons:

1. **Clarity before code** — Writing specs forced me to fully understand requirements before implementation
2. **Systematic execution** — Each spec became a focused, testable unit of work
3. **AI-assisted development** — Well-defined specs work exceptionally well with AI coding assistants
4. **Documentation as a byproduct** — The specs serve as living documentation of the system

### Why Not Spec-Kit?

I evaluated [Spec-Kit](https://github.com/github/spec-kit) (GitHub's spec-driven tool) but decided against it for this project:

- **Spec-Kit is Ruby-based** — Designed for Ruby/Rails projects, not JavaScript/TypeScript
- **Overkill for this scope** — Spec-Kit shines for large, multi-team projects with complex API contracts
- **Different purpose** — Spec-Kit focuses on API specification validation; I needed implementation specs

Instead, I created lightweight Markdown specs in `.cursor/specs/` that could guide both human and AI development.

### The Specs

I divided the project into 6 sequential specs, each building on the previous:

```
.cursor/specs/
├── 01-foundation.md              # Design tokens, API client, hooks, UI primitives
├── 02-layout-shell.md            # AppLayout, Sidebar, PageHeader
├── 03-dashboard-core.md          # StatsRow, Toolbar, DataTable, Pagination
├── 04-detail-panel.md            # DetailPanel, loading/error/empty states
├── 05-indicators-export.md       # Multi-select, CSV export, confirmation modal
├── 06-add-indicator.md           # Add indicator modal with validation
├── 07-dark-mode.md               # Add light/dark mode toggle
├── 08-animate-dashboard-stats.md # Animate dashboard bars, numbers and sidebar items
└── 09-responsive-design.md       # Make the whole dashboard application responsive
```

Each spec included:

- **Objective** — What we're building and why
- **Dependencies** — What must exist before starting
- **Detailed requirements** — Component structure, props, behavior
- **Acceptance criteria** — How to verify completion
- **Test requirements** — What to test and how

### Cursor Rules

To maintain consistency across the codebase, I created project-specific Cursor rules:

```
.cursor/rules/
├── project-overview.mdc   # Tech stack, structure, conventions
├── react-components.mdc   # Component patterns, TypeScript conventions
└── testing-vitest.mdc     # Testing best practices with Vitest
```

These rules ensured that whether I was writing code manually or with AI assistance, the output remained consistent and followed best practices.

---

## Architecture

### Component Structure

```
src/components/
├── dashboard/     # Dashboard-specific components (StatsRow, Toolbar, Pagination)
├── detail/        # Detail panel for viewing indicator info
├── export/        # Export modal and CSV generation
├── indicator/     # Add indicator modal
├── layout/        # App shell (Sidebar, Header, Layout)
├── table/         # Data table components
└── ui/            # Reusable UI primitives (Badge, Button, Input, etc.)
```

### Custom Hooks

```
src/hooks/
├── useIndicators.ts      # Fetch paginated indicators with filters
├── useStats.ts           # Fetch dashboard statistics
├── useDebounce.ts        # Debounce search input
├── useSelection.ts       # Multi-select state management
├── useLocalIndicators.ts # In-memory storage for new indicators
└── useToast.ts           # Toast notification system
```

### Design System

All design tokens are extracted from `design-reference.html` and implemented as CSS variables:

- **Colors** — Semantic color palette (background, surface, border, text, severity colors)
- **Typography** — DM Sans for UI, JetBrains Mono for technical data
- **Spacing** — Consistent spacing scale
- **Components** — Badges, tags, buttons, inputs, confidence bars, skeletons

---

## Key Implementation Decisions

### 1. State Management: React Context vs. External Library

**Decision:** Used React's built-in `useState` and `useContext`

**Rationale:** For an application of this scope, React's native state management is sufficient. Adding Redux or Zustand would introduce unnecessary complexity without meaningful benefits.

### 2. Styling: Tailwind CSS

**Decision:** Tailwind CSS with custom design tokens

**Rationale:** Tailwind's utility-first approach allowed rapid implementation while maintaining design consistency. Custom CSS variables bridge the gap between the design spec and Tailwind utilities.

### 3. API Client: Fetch with Custom Hooks

**Decision:** Plain `fetch` wrapped in custom hooks

**Rationale:** No need for React Query or SWR for this use case. The custom hooks (`useIndicators`, `useStats`) provide clean abstractions with loading/error states.

### 4. Testing Strategy: Unit Tests for Key Components

**Decision:** Focus on testing UI primitives and critical business logic

**Rationale:** Given time constraints, I prioritized testing:

- UI components (Badge, Button, ConfidenceBar, Tag)
- Complex components (Pagination, TableRow, ExportModal)
- Form components (Slider, TagInput)

### 5. Export: Client-Side CSV Generation

**Decision:** Generate CSV in the browser, no server involvement

**Rationale:** For a dataset of this size (max hundreds of indicators), client-side generation is fast and avoids unnecessary server round-trips.

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

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:

1. **On every push/PR to main:**

   - Installs dependencies
   - Runs ESLint
   - Runs Vitest tests
   - Builds the production bundle

2. **On push to main (after tests pass):**
   - Deploys to Railway automatically

```yaml
# .github/workflows/deploy.yml
name: CI/CD
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]
```

---

## What I'd Do With More Time

1. **Accessibility Audit** — Full WCAG 2.1 compliance review
2. **Performance Optimization** — Virtual scrolling for large datasets
3. **Real-time Updates** — WebSocket integration for live indicator feeds
4. **Advanced Filtering** — Date range filters, saved filter presets

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

## Project Structure

```
├── .cursor/
│   ├── rules/              # Cursor AI rules for consistency
│   └── specs/              # Spec-driven development specs
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
├── design-reference.html   # Visual design spec
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Contact

Built by a developer who believes in **planning before coding** and **specs before implementation**.
