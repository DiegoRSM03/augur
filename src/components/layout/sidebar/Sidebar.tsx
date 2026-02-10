import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { CloseIcon } from '../../ui/icons';
import { SidebarContent } from './SidebarContent';

interface SidebarProps {
  isDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isDrawer = false, isOpen = false, onClose }: SidebarProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isDrawer && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isDrawer, isOpen]);

  if (!isDrawer) {
    return (
      <aside className="bg-bg-sidebar border-r border-border-subtle py-5 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            data-testid="sidebar-backdrop"
          />

          <motion.aside
            className="fixed left-0 top-0 h-full w-55 z-50 bg-bg-sidebar py-5 flex flex-col overflow-y-auto shadow-elevated"
            initial={{ x: -220 }}
            animate={{ x: 0 }}
            exit={{ x: -220 }}
            transition={{
              type: 'tween',
              duration: reducedMotion ? 0 : 0.25,
              ease: 'easeOut',
            }}
            role="dialog"
            aria-label="Navigation menu"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-3 p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors duration-150 cursor-pointer z-10"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>

            <SidebarContent onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
