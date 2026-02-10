import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../../context/ThemeContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
});

// Wrapper component with ThemeProvider
function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders toggle button', () => {
    renderWithProvider();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('theme-toggle');
  });

  it('has accessible aria-label', () => {
    renderWithProvider();

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('toggles theme on click (dark → light → dark)', async () => {
    renderWithProvider();

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await act(async () => {
      button.click();
    });

    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    await act(async () => {
      button.click();
    });

    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('persists theme to localStorage', async () => {
    renderWithProvider();

    const button = screen.getByRole('button');

    await act(async () => {
      button.click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('ti-dashboard-theme', 'light');
  });

  it('displays moon icon in dark mode', () => {
    renderWithProvider();

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector('path')).toBeInTheDocument();
  });

  it('displays sun icon in light mode', async () => {
    renderWithProvider();

    const button = screen.getByRole('button');

    await act(async () => {
      button.click();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector('circle')).toBeInTheDocument();
  });
});
