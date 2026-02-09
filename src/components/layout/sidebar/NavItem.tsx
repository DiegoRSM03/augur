import { motion, useReducedMotion } from 'motion/react';
import type { NavItem } from './navConfig';

interface NavItemProps {
  item: NavItem;
  globalIndex: number;
  onNavigate?: () => void;
}

export function NavItem({ item, globalIndex, onNavigate }: NavItemProps) {
  const reducedMotion = useReducedMotion();
  const baseClasses = 'flex items-center gap-3 py-2 px-5 mx-2 my-[1px] rounded-md text-[13px] font-medium cursor-pointer transition-all duration-150';
  const activeClasses = item.active
    ? 'bg-bg-sidebar-active text-augur-blue'
    : 'text-text-secondary hover:bg-bg-card hover:text-text-primary';
  const iconOpacity = item.active ? 'opacity-100' : 'opacity-60';

  return (
    <motion.a
      href="#"
      className={`${baseClasses} ${activeClasses}`}
      initial={reducedMotion ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: reducedMotion ? 0 : globalIndex * 0.05,
        duration: reducedMotion ? 0 : 0.25,
        ease: 'easeOut',
      }}
      onClick={onNavigate}
    >
      <span className={`shrink-0 ${iconOpacity}`}>{item.icon}</span>
      {item.label}
      {item.badge && (
        <span className="ml-auto bg-severity-critical text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-pill min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </motion.a>
  );
}
