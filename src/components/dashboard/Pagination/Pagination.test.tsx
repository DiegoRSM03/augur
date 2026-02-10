import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

// Mock useBreakpoint to return desktop mode by default
vi.mock('../../../hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: true,
  }),
}));

describe('Pagination', () => {
  const defaultProps = {
    page: 1,
    totalPages: 10,
    total: 200,
    limit: 20,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination info correctly', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/Showing 1-20 of 200 indicators/)).toBeInTheDocument();
  });

  it('renders correct info for middle pages', () => {
    render(<Pagination {...defaultProps} page={5} />);
    expect(screen.getByText(/Showing 81-100 of 200 indicators/)).toBeInTheDocument();
  });

  it('renders correct info for last page with partial results', () => {
    render(<Pagination {...defaultProps} page={10} total={195} />);
    expect(screen.getByText(/Showing 181-195 of 195 indicators/)).toBeInTheDocument();
  });

  it('calls onPageChange when page button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when next button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('›'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when previous button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} page={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('‹'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} page={1} />);

    const prevButton = screen.getByText('‹');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} page={10} />);

    const nextButton = screen.getByText('›');
    expect(nextButton).toBeDisabled();
  });

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} page={3} />);

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-augur-blue');
    expect(currentPageButton).toHaveClass('text-white');
  });

  it('shows ellipsis for large page ranges', () => {
    render(<Pagination {...defaultProps} page={5} totalPages={20} />);

    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('shows all pages when totalPages <= 7', () => {
    render(<Pagination {...defaultProps} totalPages={5} total={100} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('returns null when totalPages is 0', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={0} total={0} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('formats large numbers with locale separators', () => {
    render(
      <Pagination
        {...defaultProps}
        page={1}
        total={10000}
        totalPages={500}
        limit={20}
      />
    );
    expect(screen.getByText(/10,000/)).toBeInTheDocument();
  });

  it('shows first and last page with ellipsis in middle', () => {
    render(<Pagination {...defaultProps} page={10} totalPages={100} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles single page correctly', () => {
    render(<Pagination {...defaultProps} page={1} totalPages={1} total={15} />);

    expect(screen.getByText(/Showing 1-15 of 15 indicators/)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('‹')).toBeDisabled();
    expect(screen.getByText('›')).toBeDisabled();
  });
});
