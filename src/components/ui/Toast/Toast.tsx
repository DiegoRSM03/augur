import type { Toast as ToastData, ToastType } from '../../../hooks/useToast';
import { CloseIcon, SuccessIcon, ErrorCircleIcon, InfoIcon } from '../icons';

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const TOAST_ICON_STYLES: Record<ToastType, string> = {
  success: 'text-status-active',
  error: 'text-severity-critical',
  info: 'text-augur-blue',
};

function getIcon(type: ToastType) {
  const className = `w-5 h-5 ${TOAST_ICON_STYLES[type]}`;
  switch (type) {
    case 'success':
      return <SuccessIcon className={className} />;
    case 'error':
      return <ErrorCircleIcon className={className} />;
    case 'info':
    default:
      return <InfoIcon className={className} />;
  }
}

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
