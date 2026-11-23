import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  // vitest-axe 0.1 still augments the old global `Vi` namespace, so the matcher is typed here.
  interface Matchers<T> extends AxeMatchers {}
}
