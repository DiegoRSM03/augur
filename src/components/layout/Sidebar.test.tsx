import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

// Mock motion/react for predictable rendering
vi.mock('motion/react', () => ({
  motion: {
    a: ({ children, initial: _i, animate: _a, transition: _t, ...props }: Record<string, unknown>) => (
      <a {...props}>{children as React.ReactNode}</a>
    ),
    div: ({ children, initial: _i, animate: _a, exit: _e, transition: _t, ...props }: Record<string, unknown>) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
    aside: ({ children, initial: _i, animate: _a, exit: _e, transition: _t, ...props }: Record<string, unknown>) => (
      <aside {...props}>{children as React.ReactNode}</aside>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders static sidebar with navigation items when isDrawer is false', () => {
    render(<Sidebar isDrawer={false} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Augur Events')).toBeInTheDocument();
    expect(screen.getByText('Threat Indicators')).toBeInTheDocument();
  });

  it('renders nothing when isDrawer is true and isOpen is false', () => {
    const { container } = render(<Sidebar isDrawer={true} isOpen={false} />);
    // AnimatePresence children should not render
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('renders drawer with navigation when isDrawer is true and isOpen is true', () => {
    render(<Sidebar isDrawer={true} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders backdrop when drawer is open', () => {
    render(<Sidebar isDrawer={true} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('sidebar-backdrop')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<Sidebar isDrawer={true} isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('sidebar-backdrop'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Sidebar isDrawer={true} isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders section labels', () => {
    render(<Sidebar isDrawer={false} />);
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
