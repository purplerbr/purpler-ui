import { cva } from 'class-variance-authority';

export const dashboardLayoutVariants = cva(
  'flex min-h-dvh flex-col bg-background font-sans text-foreground lg:flex-row'
);

// Top bar on small screens; from `lg` the same banner becomes the fixed sidebar.
export const dashboardSidebarVariants = cva([
  'sticky top-0 z-40 flex shrink-0 flex-col border-b border-sidebar-border bg-sidebar text-sidebar-foreground',
  'lg:h-dvh lg:w-64 lg:overflow-y-auto lg:border-r lg:border-b-0',
]);

// The current page also gets a bar in `sidebar-primary`, so it is not told by the background alone.
export const dashboardNavLinkVariants = cva([
  'relative flex min-h-11 items-center gap-3 rounded-md px-3 text-small font-semibold text-sidebar-foreground',
  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
  'aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground',
  'aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-2 aria-[current=page]:before:left-0',
  'aria-[current=page]:before:w-1 aria-[current=page]:before:rounded-full aria-[current=page]:before:bg-sidebar-primary',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring',
]);
