import { expect, test, type Locator, type Page } from '@playwright/test';

// The reset theme.css must keep every utility the library relies on working in a real browser.
const tabKey = (browserName: string): string => (browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
const shot = (project: string, name: string): string =>
  `test-results/manual/${project}/theme-${name}.png`;

async function openStory(page: Page, id: string, globals = 'scheme:light'): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`);
  await page.locator('#storybook-root > *').first().waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

const styleOf = (locator: Locator, properties: readonly string[]): Promise<string[]> =>
  locator.evaluate(
    (element, names) => names.map((name) => getComputedStyle(element).getPropertyValue(name)),
    [...properties]
  );

test('the loading spinner spins, and stops with prefers-reduced-motion', async ({ page }, info) => {
  await openStory(page, 'atoms-button--loading');
  const spinner = page.getByRole('button', { name: 'Salvando produto' }).locator('svg');

  expect(await styleOf(spinner, ['animation-name', 'animation-iteration-count'])).toEqual([
    'spin',
    'infinite',
  ]);
  await page.screenshot({ path: shot(info.project.name, 'spinner') });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => styleOf(spinner, ['animation-name'])).toEqual(['none']);
});

test('button type, weight, radius and transition come from the tokens', async ({ page }) => {
  await openStory(page, 'atoms-button--all-variants');
  const medium = page.getByRole('button', { name: 'Publicar loja' }).nth(1);
  const large = page.getByRole('button', { name: 'Publicar loja' }).nth(2);

  const [family, weight, size, lineHeight, radius, easing, duration] = await styleOf(medium, [
    'font-family',
    'font-weight',
    'font-size',
    'line-height',
    'border-top-left-radius',
    'transition-timing-function',
    'transition-duration',
  ]);
  expect(family).toMatch(/^"?Figtree"?,/);
  expect([weight, size, lineHeight, radius]).toEqual(['600', '14px', '20px', '9999px']);
  expect([easing, duration]).toEqual(['cubic-bezier(0.2, 0, 0, 1)', '0.15s']);
  expect(await styleOf(large, ['font-size', 'line-height'])).toEqual(['16px', '24px']);
});

test('hover changes the primary background and Tab shows the 2px ring with offset', async ({
  page,
  browserName,
}, info) => {
  await openStory(page, 'atoms-button--default');
  const button = page.getByRole('button', { name: 'Comprar agora' });
  const [resting] = await styleOf(button, ['background-color']);

  await button.hover();
  await expect.poll(async () => (await styleOf(button, ['background-color']))[0]).not.toBe(resting);
  await page.mouse.move(0, 0);
  await expect.poll(async () => (await styleOf(button, ['background-color']))[0]).toBe(resting);

  await page.keyboard.press(tabKey(browserName));
  await expect(button).toBeFocused();
  expect(await styleOf(button, ['outline-style', 'outline-width', 'outline-offset'])).toEqual([
    'solid',
    '2px',
    '2px',
  ]);
  await page.screenshot({ path: shot(info.project.name, 'hover-focus') });
});

test('shadows, radii and display type render on the foundation pages', async ({ page }, info) => {
  await openStory(page, 'fundamentos-raios-elevacao--raios-elevacao');
  for (const step of ['xs', 'sm', 'md', 'lg', 'xl']) {
    const [shadow] = await styleOf(page.locator(`.shadow-${step}`).first(), ['box-shadow']);
    expect(shadow, `shadow-${step}`).not.toBe('none');
  }
  expect(
    await styleOf(page.locator('.rounded-button').first(), ['border-top-left-radius'])
  ).toEqual(['9999px']);
  await page.screenshot({ path: shot(info.project.name, 'shape'), fullPage: true });

  await openStory(page, 'fundamentos-tipografia--tipografia');
  const heading = page.getByRole('heading', { level: 1 });
  const [family, size, weight] = await styleOf(heading, [
    'font-family',
    'font-size',
    'font-weight',
  ]);
  expect(family).toMatch(/^"?Bricolage Grotesque"?,/);
  expect([size, weight]).toEqual(['36px', '700']);
});

test.describe('360px', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('a wide table is reached with Tab, shows the ring and scrolls with the arrow keys', async ({
    page,
    browserName,
  }, info) => {
    await openStory(page, 'fundamentos-cores--cores');
    // The section and its table share this name; the table's region is the inner one.
    const region = page.getByRole('region', { name: 'Contraste dos pares semânticos' }).last();
    await expect(region.getByRole('table')).toBeVisible();

    await expect(async () => {
      await page.keyboard.press(tabKey(browserName));
      await expect(region).toBeFocused({ timeout: 100 });
    }).toPass({ timeout: 10_000 });
    expect(await styleOf(region, ['outline-style', 'outline-width'])).toEqual(['solid', '2px']);
    for (let i = 0; i < 5; i += 1) await page.keyboard.press('ArrowRight');

    await expect.poll(() => region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await page.screenshot({ path: shot(info.project.name, 'table-scrolled-360') });
  });
});
