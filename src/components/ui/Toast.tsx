import type { Toast as ToastData, ToastType } from '../../hooks/useToast';
import { CloseIcon } from './icons';

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

/**
 * Success checkmark icon
 */
function SuccessIcon() {
  return (
    <svg
      className="w-5 h-5 text-status-active"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/**
 * Error X icon
 */
function ErrorIcon() {
  return (
    <svg
      className="w-5 h-5 text-severity-critical"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

/**
 * Info icon
 */
function InfoIcon() {
  return (
    <svg
      className="w-5 h-5 text-augur-blue"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/**
 * Get icon component based on toast type
 */
function getIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'info':
    default:
      return <InfoIcon />;
  }
}

/**
 * Single toast notification component
 */
function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div
      className="
        flex items-center gap-3
        px-4 py-3
        bg-bg-card
        border border-border
        rounded-lg
        shadow-elevated
        animate-toast-in
      "
      role="alert"
    >
      {getIcon(toast.type)}
      <span className="text-sm text-text-primary">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-2 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

/**
 * Toast container component
 * 
 * Renders all active toasts in a fixed position at bottom-right of screen.
 */
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
