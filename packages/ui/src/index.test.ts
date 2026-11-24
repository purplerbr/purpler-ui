import { describe, expect, it } from 'vitest';
import * as ui from './index';

describe('@purplerbr/ui public API', () => {
  it('exports the components and utilities that apps import from the root', () => {
    expect(Object.keys(ui).sort()).toEqual([
      'Accordion',
      'AccordionContent',
      'AccordionItem',
      'AccordionTrigger',
      'Alert',
      'AlertDescription',
      'AlertTitle',
      'AuthLayout',
      'Badge',
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
      'accordionContentVariants',
      'accordionItemVariants',
      'accordionTriggerVariants',
      'accordionVariants',
      'alertVariants',
      'authLayoutVariants',
      'badgeVariants',
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
