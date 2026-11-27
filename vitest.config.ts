import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const tokensSource = fileURLToPath(new URL('packages/tokens/src/index.ts', import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,tsx}', 'packages/*/scripts/**/*.ts', 'scripts/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.stories.tsx', 'packages/ui/src/foundations/**'],
      reporter: ['text', 'lcov', 'json-summary'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
    projects: [
      {
        test: {
          name: 'tokens',
          environment: 'node',
          include: ['packages/tokens/src/**/*.test.ts'],
          restoreMocks: true,
        },
      },
      {
        resolve: { alias: [{ find: /^@purplerbr\/tokens$/, replacement: tokensSource }] },
        test: {
          name: 'ui',
          environment: 'jsdom',
          include: ['packages/ui/src/**/*.test.{ts,tsx}', 'packages/ui/test/**/*.test.ts'],
          setupFiles: ['packages/ui/test/setup.ts'],
          restoreMocks: true,
        },
      },
      {
        test: {
          name: 'analytics',
          environment: 'jsdom',
          environmentOptions: { jsdom: { url: 'https://purpler.com.br/' } },
          include: ['packages/analytics/src/**/*.test.ts'],
          restoreMocks: true,
        },
      },
      {
        test: {
          name: 'repo',
          environment: 'node',
          include: ['tests/repo/**/*.test.ts'],
          restoreMocks: true,
        },
      },
    ],
  },
});
