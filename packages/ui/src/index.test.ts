import { describe, expect, it } from 'vitest';
import * as ui from './index';

describe('@purplerbr/ui public API', () => {
  it('exports the components and utilities that apps import from the root', () => {
    expect(Object.keys(ui).sort()).toEqual([
      'Alert',
      'AlertDescription',
      'AlertTitle',
      'AuthLayout',
      'Button',
      'Card',
      'CardContent',
      'CardDescription',
      'CardFooter',
      'CardHeader',
      'CardTitle',
      'Checkbox',
      'Heading',
      'Logo',
      'Skeleton',
      'Spinner',
      'Text',
      'alertVariants',
      'authLayoutVariants',
      'buttonVariants',
      'cardVariants',
      'checkboxFieldVariants',
      'checkboxVariants',
      'cn',
      'headingVariants',
      'logoVariants',
      'skeletonVariants',
      'spinnerLabelVariants',
      'spinnerVariants',
      'textVariants',
    ]);
  });
});
