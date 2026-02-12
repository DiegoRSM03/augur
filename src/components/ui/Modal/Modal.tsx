import { createContext, useContext, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { CloseIcon } from '../icons';

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within a Modal');
  }
  return context;
}

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: 'sm' | 'md' | 'lg';
  'aria-labelledby'?: string;
}

const WIDTH_CLASSES = {
  sm: 'max-w-[480px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[600px]',
} as const;

function Modal({
  isOpen,
  onClose,
  children,
  width = 'md',
  'aria-labelledby': ariaLabelledby,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Store previously focused element and set initial focus
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus first focusable element in modal after render
      const timer = requestAnimationFrame(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        firstFocusable?.focus();
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [isOpen]);

  // Return focus when modal closes
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Handle Escape and Tab key for focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap: cycle focus within modal
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div
        className="
          fixed inset-0
          bg-modal-overlay
          backdrop-blur-xs
          flex items-center justify-center
          z-100
        "
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          className={`
            bg-bg-modal
            border border-border
            rounded-xl
            shadow-modal
            w-[90vw] ${WIDTH_CLASSES[width]}
            max-h-[85vh]
            flex flex-col
            overflow-hidden
            animate-modal-in
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledby}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  id?: string;
}

function ModalHeader({ title, subtitle, id }: ModalHeaderProps) {
  const { onClose } = useModalContext();

  return (
    <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between shrink-0">
      <div>
        <h2 id={id} className="text-base font-bold text-text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="
          p-1.5 rounded-md
          text-text-tertiary hover:text-text-primary
          hover:bg-bg-card
          transition-colors
          cursor-pointer
        "
        aria-label="Close modal"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

function ModalBody({ children, className = '' }: ModalBodyProps) {
  return (
    <div className={`flex-1 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}

interface ModalFooterProps {
  children: ReactNode;
}

function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="px-6 py-4 border-t border-border-subtle shrink-0">
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };
