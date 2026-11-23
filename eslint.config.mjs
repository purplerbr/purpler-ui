import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const NODE_APIS = {
  group: ['node:*'],
  message: 'Library code runs in browsers and workers: no Node APIs.',
};

export default defineConfig(
  {
    ignores: [
      '.yarn/',
      'coverage/',
      '**/dist/',
      'node_modules/',
      'playwright-report/',
      '**/storybook-static/',
      'test-results/',
      'packages/tokens/test/fixtures/',
    ],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { sonarjs },
    rules: {
      'no-console': 'error',
      'sonarjs/cognitive-complexity': ['error', 15],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: ['packages/ui/**/*.tsx'],
    extends: [jsxA11y.flatConfigs.strict, reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    rules: {
      // A scrollable region must take focus to be scrolled by keyboard (WCAG 2.1.1, axe scrollable-region-focusable).
      'jsx-a11y/no-noninteractive-tabindex': ['error', { tags: [], roles: ['tabpanel', 'region'] }],
    },
  },
  {
    files: ['packages/*/src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', '**/*.stories.tsx'],
    rules: { 'no-restricted-imports': ['error', { patterns: [NODE_APIS] }] },
  },
  storybook.configs['flat/recommended'],
  {
    // Declaration merging must repeat Vitest's type parameter, even though it is unused here.
    files: ['packages/ui/test/vitest-axe.d.ts'],
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
  {
    files: ['**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
  prettier
);
