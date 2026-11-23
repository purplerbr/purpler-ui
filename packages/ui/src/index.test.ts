import { describe, expect, it } from 'vitest';
import * as ui from './index';

describe('@purplerbr/ui public API', () => {
  it('exports the components and utilities that apps import from the root', () => {
    expect(Object.keys(ui).sort()).toEqual([
      'Alert',
      'AlertDescription',
      'AlertTitle',
      'Button',
      'Checkbox',
      'alertVariants',
      'buttonVariants',
      'checkboxFieldVariants',
      'checkboxVariants',
      'cn',
    ]);
  });
});
