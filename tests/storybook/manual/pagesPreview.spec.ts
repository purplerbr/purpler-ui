import { expect, test, type Page } from '@playwright/test';

// Walks the published Storybook on GitHub Pages; runs only with PAGES_URL set (needs network).
const PAGES_URL = process.env.PAGES_URL ?? '';
const STORIES = [
  'fundamentos-marca--marca',
  'fundamentos-cores--cores',
  'fundamentos-tipografia--tipografia',
  'fundamentos-espacamento--espacamento',
  'fundamentos-raios-elevacao--raios-elevacao',
  'fundamentos-movimento--movimento',
  'fundamentos-icones--icones',
  'fundamentos-voz--voz',
  'atoms-button--default',
  'atoms-button--all-variants',
  'atoms-checkbox--all-variants',
  'molecules-alert--all-variants',
  'atoms-heading--all-variants',
  'molecules-card--all-variants',
  'atoms-text--all-variants',
  'templates-authlayout--default',
  'atoms-spinner--all-variants',
  'atoms-skeleton--all-variants',
] as const;
const COMPONENT_MATRIX = [
  'atoms-checkbox--all-variants',
  'molecules-alert--all-variants',
  'atoms-heading--all-variants',
  'molecules-card--all-variants',
  'atoms-text--all-variants',
  'templates-authlayout--default',
  'atoms-spinner--all-variants',
  'atoms-spinner--page-loading',
  'atoms-skeleton--all-variants',
] as const;
// WebKit lacks requestIdleCallback, which the Storybook manager calls; it is not the library's.
const KNOWN_ERROR = /requestIdleCallback/;
const MANAGER_LOAD = { timeout: 30_000 };

test.skip(PAGES_URL === '', 'PAGES_URL not set');
test.use({ viewport: { width: 1280, height: 900 } });

interface Problems {
  errors: string[];
  badRequests: string[];
}

/** Collects console errors and any request that fails, 4xx/5xx or leaves the Pages subfolder. */
function watch(page: Page): Problems {
  const { origin, pathname } = new URL(PAGES_URL);
  const root = pathname.split('/').slice(0, 2).join('/');
  const problems: Problems = { errors: [], badRequests: [] };
  page.on('pageerror', (error) => {
    if (!KNOWN_ERROR.test(error.message)) problems.errors.push(`pageerror: ${error.message}`);
  });
  page.on('console', (message) => {
    if (message.type() === 'error' && !KNOWN_ERROR.test(message.text()))
      problems.errors.push(`console: ${message.text()}`);
  });
  // The next goto cancels the a11y addon's lazy axe chunk; a missing asset still shows as 4xx below.
  page.on('requestfailed', (request) => {
    const reason = request.failure()?.errorText ?? '';
    if (!/cancelled|ERR_ABORTED/.test(reason))
      problems.badRequests.push(`failed (${reason}): ${request.url()}`);
  });
  page.on('response', (response) => {
    const url = new URL(response.url());
    if (response.status() >= 400) problems.badRequests.push(`${response.status()}: ${url.href}`);
    if (url.origin === origin && !url.pathname.startsWith(`${root}/`))
      problems.badRequests.push(`outside ${root}/: ${url.href}`);
  });
  return problems;
}

const shot = (project: string, name: string): string =>
  `test-results/pages-preview/${project}/${name}.png`;

test('loads every Foundations page and the Button from the subfolder without broken assets', async ({
  page,
}, info) => {
  const problems = watch(page);
  for (const id of STORIES) {
    await page.goto(`${PAGES_URL}?path=/story/${id}`);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.locator('#storybook-root > *').first()).toBeVisible(MANAGER_LOAD);
    await expect(page.locator(`[data-item-id="${id}"]`)).toBeVisible();
    await page.screenshot({ path: shot(info.project.name, id) });
  }
  expect(problems).toEqual({ errors: [], badRequests: [] });
});

test('switches between light and dark from the toolbar', async ({ page }, info) => {
  const problems = watch(page);
  await page.goto(`${PAGES_URL}?path=/story/atoms-button--default`);
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.getByRole('button', { name: 'Comprar agora' })).toBeVisible(MANAGER_LOAD);
  await expect(preview.locator('html')).not.toHaveClass(/\bdark\b/);

  await page.getByRole('button', { name: /^Tema claro ou escuro/ }).click();
  await page.getByRole('option', { name: 'Escuro' }).click();
  await expect(preview.locator('html')).toHaveClass(/\bdark\b/);
  await page.screenshot({ path: shot(info.project.name, 'toolbar-dark') });

  await page.getByRole('button', { name: /^Tema claro ou escuro/ }).click();
  await page.getByRole('option', { name: 'Claro' }).click();
  await expect(preview.locator('html')).not.toHaveClass(/\bdark\b/);
  await page.screenshot({ path: shot(info.project.name, 'toolbar-light') });
  expect(problems).toEqual({ errors: [], badRequests: [] });
});

test('renders the Checkbox, Alert, Heading, Card, Text, AuthLayout, Spinner and Skeleton in light and dark at phone and desktop width', async ({
  page,
}, info) => {
  const problems = watch(page);
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const scheme of ['light', 'dark']) {
      for (const id of COMPONENT_MATRIX) {
        await page.goto(`${PAGES_URL}iframe.html?id=${id}&viewMode=story&globals=scheme:${scheme}`);
        await expect(page.locator('#storybook-root > *').first()).toBeVisible(MANAGER_LOAD);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth
        );
        expect(overflow, `${id} ${scheme} ${String(width)}`).toBeLessThanOrEqual(0);
        await page.screenshot({
          path: shot(info.project.name, `${id}-${scheme}-${String(width)}`),
          fullPage: true,
        });
      }
    }
  }
  expect(problems).toEqual({ errors: [], badRequests: [] });
});

test('the published Checkbox takes Tab focus and toggles with Space', async ({
  page,
  browserName,
}, info) => {
  const problems = watch(page);
  await page.goto(`${PAGES_URL}iframe.html?id=atoms-checkbox--default&viewMode=story`);
  const checkbox = page.getByRole('checkbox', { name: 'Li e aceito os termos de uso' });
  await expect(checkbox).toBeVisible(MANAGER_LOAD);

  // Safari skips buttons on Tab unless Full Keyboard Access is on.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(checkbox).toBeFocused();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await page.screenshot({ path: shot(info.project.name, 'checkbox-focused-checked') });
  expect(await checkbox.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
    'solid'
  );
  expect(problems).toEqual({ errors: [], badRequests: [] });
});
