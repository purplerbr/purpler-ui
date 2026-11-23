import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const tokensSource = fileURLToPath(new URL('../../tokens/src/index.ts', import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  staticDirs: [{ from: '../src/assets/brand', to: '/brand' }],
  managerHead: (head) => `${head}<link rel="icon" type="image/svg+xml" href="./brand/favicon.svg">`,
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      // The tokens JS comes from source; the CSS comes from the built package, as in the apps.
      resolve: { alias: [{ find: /^@purplerbr\/tokens$/, replacement: tokensSource }] },
    }),
};

export default config;
