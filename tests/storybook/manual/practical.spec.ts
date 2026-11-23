import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Frame, type Page } from '@playwright/test';

// Practical walk-through of the Storybook as a person uses it: toolbar, keyboard and viewports.
const FOUNDATIONS = [
  'fundamentos-marca--marca',
  'fundamentos-cores--cores',
  'fundamentos-tipografia--tipografia',
  'fundamentos-espacamento--espacamento',
  'fundamentos-raios-elevacao--raios-elevacao',
  'fundamentos-movimento--movimento',
  'fundamentos-icones--icones',
  'fundamentos-voz--voz',
] as const;
const BUTTON_STORIES = [
  'atoms-button--default',
  'atoms-button--all-variants',
  'atoms-button--loading',
  'atoms-button--disabled',
  'atoms-button--icon-only',
  'atoms-button--as-link',
] as const;
const PRESETS = [
  'oceano',
  'floresta',
  'terracota',
  'rose',
  'grafite',
  'lavanda',
  'cafe',
  'mostarda',
] as const;
const WIDTHS = [360, 768, 1280] as const;
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const tabKey = (browserName: string): string => (browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
const shot = (project: string, name: string): string =>
  `test-results/manual/${project}/${name}.png`;

// Errors of the Storybook manager itself (e.g. requestIdleCallback in WebKit) are not the library's.
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    const fromManager = message.location().url.includes('/sb-manager/');
    if (message.type() === 'error' && !fromManager) errors.push(`console: ${message.text()}`);
  });
  return errors;
}

async function openStory(page: Page, id: string, globals = 'scheme:light'): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`);
  await page.locator('#storybook-root > *').first().waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function axeViolations(page: Page): Promise<string[]> {
  let found: string[] = [];
  // The a11y addon also runs axe on render; retry while that run holds the shared instance.
  await expect(async () => {
    const results = await new AxeBuilder({ page })
      .include('#storybook-root')
      .withTags(WCAG_TAGS)
      .analyze();
    found = results.violations.flatMap(({ id, nodes }) =>
      nodes.map((node) => `${id}: ${node.target.join(' ')}`)
    );
  }).toPass({ timeout: 15_000 });
  return found;
}

/** Records, on window, whether each click reached the page with its default action blocked. */
async function recordClicks(page: Page): Promise<void> {
  await page.evaluate(() => {
    const log: boolean[] = [];
    Object.assign(window, { clickLog: log });
    window.addEventListener('click', (event) => log.push(event.defaultPrevented));
  });
}

const clicks = (page: Page): Promise<boolean[]> =>
  page.evaluate(() => (window as unknown as { clickLog: boolean[] }).clickLog);

const previewFrame = (page: Page): Frame => {
  const frame = page.frame({ url: /iframe\.html/ });
  if (frame === null) throw new Error('Storybook preview iframe not found');
  return frame;
};

// A cold Storybook manager can take longer than 5 s to render under full parallel load.
const MANAGER_LOAD = { timeout: 20_000 };

test.describe('toolbar: theme and store preset from the Storybook UI', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('switches to dark and applies a store preset from the toolbar', async ({ page }, info) => {
    const errors = collectErrors(page);
    await page.goto('/?path=/story/atoms-button--default');
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.getByRole('button', { name: 'Comprar agora' })).toBeVisible(MANAGER_LOAD);
    const brandPrimary = await previewFrame(page).evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );

    await page.getByRole('button', { name: /^Tema claro ou escuro/ }).click();
    await page.getByRole('option', { name: 'Escuro' }).click();
    await expect(preview.locator('html')).toHaveClass(/\bdark\b/);

    await page.getByRole('button', { name: /^Marca Purpler ou preset/ }).click();
    await page.getByRole('option', { name: /Loja · Oceano/ }).click();
    await expect(preview.locator('#purpler-store-theme')).toHaveAttribute('data-store', 'oceano');
    const storePrimary = await previewFrame(page).evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );
    expect(storePrimary).not.toBe(brandPrimary);
    await page.screenshot({ path: shot(info.project.name, 'toolbar-dark-oceano') });

    await page.getByRole('button', { name: /^Marca Purpler ou preset/ }).click();
    await page.getByRole('option', { name: 'Purpler (marca)' }).click();
    await expect(preview.locator('#purpler-store-theme')).toHaveAttribute('data-store', 'purpler');
    expect(errors).toEqual([]);
  });

  const THEMED_DEFAULT = '/?path=/story/atoms-button--default&globals=scheme:dark;store:oceano';

  test('keeps the chosen theme after a reload', async ({ page }) => {
    const errors = collectErrors(page);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await page.goto(THEMED_DEFAULT);
    await expect(preview.getByRole('button', { name: 'Comprar agora' })).toBeVisible(MANAGER_LOAD);

    await page.reload();
    await expect(preview.locator('html')).toHaveClass(/\bdark\b/, MANAGER_LOAD);
    await expect(preview.locator('#purpler-store-theme')).toHaveAttribute('data-store', 'oceano');
    expect(errors).toEqual([]);
  });

  test('keeps the chosen theme after opening another story and going back', async ({ page }) => {
    const errors = collectErrors(page);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await page.goto(THEMED_DEFAULT);
    await expect(preview.getByRole('button', { name: 'Comprar agora' })).toBeVisible(MANAGER_LOAD);

    await page.getByRole('link', { name: 'Loading', exact: true }).click();
    await expect(preview.getByRole('button', { name: 'Salvando produto' })).toBeVisible(
      MANAGER_LOAD
    );
    await page.goBack();
    await expect(preview.getByRole('button', { name: 'Comprar agora' })).toBeVisible(MANAGER_LOAD);
    await expect(preview.locator('html')).toHaveClass(/\bdark\b/);
    await expect(preview.locator('#purpler-store-theme')).toHaveAttribute('data-store', 'oceano');
    expect(errors).toEqual([]);
  });
});

test.describe('Button keyboard in a real browser', () => {
  test('Default: Tab, Enter and Space activate it and the focus ring is visible', async ({
    page,
    browserName,
  }, info) => {
    await openStory(page, 'atoms-button--default');
    await recordClicks(page);
    const button = page.getByRole('button', { name: 'Comprar agora' });

    await page.keyboard.press(tabKey(browserName));
    await expect(button).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');

    expect(await clicks(page)).toEqual([false, false]);
    expect(await button.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
    await page.screenshot({ path: shot(info.project.name, 'button-focus') });
  });

  test('Loading: Enter, Space and click are blocked, focus stays, busy is announced', async ({
    page,
    browserName,
  }, info) => {
    await openStory(page, 'atoms-button--loading');
    await recordClicks(page);
    const button = page.getByRole('button', { name: 'Salvando produto' });

    await page.keyboard.press(tabKey(browserName));
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await button.dispatchEvent('click');

    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(await clicks(page)).toEqual([true, true, true]);
    await page.screenshot({ path: shot(info.project.name, 'button-loading-focus') });
  });

  test('Disabled: Tab skips it', async ({ page, browserName }) => {
    await openStory(page, 'atoms-button--disabled');

    await page.keyboard.press(tabKey(browserName));

    await expect(page.getByRole('button', { name: 'Publicar loja' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Publicar loja' })).not.toBeFocused();
  });

  test('AsLink: it is a link, reachable by Tab and followed with Enter', async ({
    page,
    browserName,
  }) => {
    await openStory(page, 'atoms-button--as-link');
    const link = page.getByRole('link', { name: 'Ver meus pedidos' });

    await page.keyboard.press(tabKey(browserName));
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#pedidos$/);
    await expect(page.getByRole('button')).toHaveCount(0);
  });

  test('focus ring stays visible in dark mode and with a store preset', async ({
    page,
    browserName,
  }, info) => {
    for (const globals of [
      'scheme:dark',
      'scheme:light;store:mostarda',
      'scheme:dark;store:rose',
    ]) {
      await openStory(page, 'atoms-button--default', globals);
      const button = page.getByRole('button', { name: 'Comprar agora' });
      await page.keyboard.press(tabKey(browserName));
      await expect(button).toBeFocused();
      const expected = await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--ring)';
        document.body.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      });

      // transition-colors animates outline-color, so read it once the transition ends.
      await expect
        .poll(() =>
          button.evaluate((el) => {
            const style = getComputedStyle(el);
            return {
              style: style.outlineStyle,
              width: style.outlineWidth,
              color: style.outlineColor,
            };
          })
        )
        .toEqual({ style: 'solid', width: '2px', color: expected });
      await page.screenshot({
        path: shot(info.project.name, `button-focus-${globals.replace(/[:;]/g, '-')}`),
      });
    }
  });
});

test.describe('every store preset in a real browser', () => {
  for (const preset of PRESETS) {
    for (const scheme of ['light', 'dark'] as const) {
      const globals = `scheme:${scheme};store:${preset}`;

      test(`${preset} ${scheme}: Cores has no failing pair and is axe-clean`, async ({ page }) => {
        const errors = collectErrors(page);
        await openStory(page, 'fundamentos-cores--cores', globals);

        await expect(page.locator('#purpler-store-theme')).toHaveAttribute('data-store', preset);
        await expect(page.getByRole('cell', { name: 'Falha', exact: true })).toHaveCount(0);
        expect(await axeViolations(page)).toEqual([]);
        expect(errors).toEqual([]);
      });

      test(`${preset} ${scheme}: every Button variant is axe-clean`, async ({ page }, info) => {
        const errors = collectErrors(page);
        await openStory(page, 'atoms-button--all-variants', globals);

        await expect(page.locator('#purpler-store-theme')).toHaveAttribute('data-store', preset);
        expect(await axeViolations(page)).toEqual([]);
        await page.screenshot({ path: shot(info.project.name, `preset-${preset}-${scheme}`) });
        expect(errors).toEqual([]);
      });
    }
  }
});

for (const width of WIDTHS) {
  test.describe(`${String(width)}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    // One test per story keeps each one well under the default 30 s timeout, even in WebKit.
    for (const scheme of ['light', 'dark'] as const) {
      for (const id of [...FOUNDATIONS, ...BUTTON_STORIES]) {
        test(`${id} in ${scheme}: no overflow, no errors, axe-clean`, async ({ page }, info) => {
          const errors = collectErrors(page);
          await openStory(page, id, `scheme:${scheme}`);
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth
          );

          expect.soft(overflow).toBeLessThanOrEqual(0);
          expect.soft(await axeViolations(page)).toEqual([]);
          await page.screenshot({
            path: shot(info.project.name, `${String(width)}/${scheme}/${id}`),
            fullPage: true,
          });
          expect(errors).toEqual([]);
        });
      }
    }
  });
}
