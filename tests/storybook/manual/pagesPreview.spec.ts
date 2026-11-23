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
