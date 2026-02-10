import { useBreakpoint } from '../../../hooks/useBreakpoint';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

/**
 * Generate page numbers to display with ellipsis for large ranges
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    // Always show last page
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Pagination button component
 */
function PageButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`
        w-[30px] h-[30px]
        flex items-center justify-center
        border rounded-sm
        text-xs font-medium
        transition-colors duration-150
        ${
          active
            ? 'bg-augur-blue border-augur-blue text-white'
            : 'bg-transparent border-border text-text-secondary hover:bg-bg-card hover:border-border-hover'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/**
 * Generate a limited set of page numbers for tablet view
 */
function getTabletPageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [currentPage];

  if (currentPage < totalPages) {
    pages.push('ellipsis');
    pages.push(totalPages);
  }

  if (currentPage > 1) {
    pages.unshift(1);
    if (currentPage > 2) {
      pages.splice(1, 0, 'ellipsis');
    }
  }

  return pages;
}

/**
 * Pagination component for navigating through pages
 */
export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const { isMobile, isTablet } = useBreakpoint();
  const isCompact = isMobile || isTablet;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const visiblePages = isCompact
    ? getTabletPageNumbers(page, totalPages)
    : getPageNumbers(page, totalPages);

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 items-center sm:flex-row sm:justify-between px-4 py-3 sm:px-6 md:px-8 md:pb-5">
      {/* Info text */}
      <span className="text-[10px] sm:text-xs text-text-tertiary">
        {isMobile
          ? `Page ${page} of ${totalPages}`
          : `Showing ${startItem.toLocaleString()}-${endItem.toLocaleString()} of ${total.toLocaleString()} indicators`}
      </span>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <PageButton
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </PageButton>

        {/* Page numbers (hidden on mobile, limited on tablet, full on laptop+) */}
        {!isMobile &&
          visiblePages.map((pageNum, index) => {
            if (pageNum === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-[30px] h-[30px] flex items-center justify-center text-text-tertiary"
                >
                  …
                </span>
              );
            }

            return (
              <PageButton
                key={pageNum}
                active={pageNum === page}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </PageButton>
            );
          })}

        {/* Next button */}
        <PageButton
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </PageButton>
      </div>
    </div>
  );
}
