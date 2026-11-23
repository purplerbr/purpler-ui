import { fontStack } from './fonts';

export type TextStyleName =
  | 'display'
  | 'title-1'
  | 'title-2'
  | 'title-3'
  | 'body-lg'
  | 'body'
  | 'small'
  | 'caption';

export interface TextStyle {
  family: 'heading' | 'body';
  weight: number;
  size: string;
  lineHeight: string;
  letterSpacing: string;
  uppercase: boolean;
}

const style = (
  family: TextStyle['family'],
  weight: number,
  size: string,
  lineHeight: string,
  letterSpacing = '0',
  uppercase = false
): TextStyle => ({ family, weight, size, lineHeight, letterSpacing, uppercase });

/** Bricolage only from 22 px up and in highlighted numbers; Figtree everywhere else. */
export const typography = {
  family: {
    heading: fontStack('bricolage-grotesque'),
    body: fontStack('figtree'),
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  scale: {
    display: style('heading', 800, '3rem', '3.25rem', '-0.02em'),
    'title-1': style('heading', 700, '2.25rem', '2.625rem', '-0.015em'),
    'title-2': style('heading', 700, '1.75rem', '2.125rem', '-0.01em'),
    'title-3': style('heading', 600, '1.375rem', '1.75rem'),
    'body-lg': style('body', 400, '1.125rem', '1.75rem'),
    body: style('body', 400, '1rem', '1.5rem'),
    small: style('body', 500, '0.875rem', '1.25rem'),
    caption: style('body', 600, '0.75rem', '1rem', '0.06em', true),
  } satisfies Record<TextStyleName, TextStyle>,
} as const;
