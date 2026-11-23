/** Short, calm transitions; `prefers-reduced-motion` turns them off in `@purplerbr/ui/styles.css`. */
export const motion = {
  duration: {
    instant: '80ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;
