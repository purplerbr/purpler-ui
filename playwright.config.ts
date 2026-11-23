import { defineConfig, devices } from '@playwright/test';

// Local validation of the Storybook pages in real browsers; it does not run in CI.
export default defineConfig({
  testDir: 'tests/storybook',
  outputDir: 'test-results',
  fullyParallel: true,
  // Some tests walk 14 stories with axe and full-page screenshots; WebKit needs more than 30 s.
  timeout: 90_000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:6006',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'yarn storybook',
    url: 'http://127.0.0.1:6006/iframe.html',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
