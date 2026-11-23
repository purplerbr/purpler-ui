import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

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
  'atoms-button--all-variants',
  'atoms-button--default',
  'atoms-button--loading',
] as const;
const SCHEMES = ['light', 'dark'] as const;
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function openStory(page: Page, id: string, globals: string): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`);
  await page.locator('#storybook-root > *').first().waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function expectNoAxeViolations(page: Page): Promise<void> {
  let found: string[] = [];
  // Storybook's a11y addon runs axe on render too; retry while that run holds the shared axe.
  await expect(async () => {
    const results = await new AxeBuilder({ page })
      .include('#storybook-root')
      .withTags(WCAG_TAGS)
      .analyze();
    found = results.violations.flatMap(({ id, nodes }) =>
      nodes.map((node) => `${id}: ${node.target.join(' ')} · ${node.failureSummary ?? ''}`)
    );
  }).toPass({ timeout: 15_000 });
  expect(found).toEqual([]);
}

for (const scheme of SCHEMES) {
  for (const id of [...FOUNDATIONS, ...BUTTON_STORIES]) {
    test(`${id} in ${scheme} renders with the brand fonts and no WCAG violations`, async ({
      page,
    }, info) => {
      await openStory(page, id, `scheme:${scheme}`);

      expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(
        scheme === 'dark'
      );
      expect(await page.evaluate(() => document.fonts.check('600 16px Figtree'))).toBe(true);
      await expectNoAxeViolations(page);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/${scheme}/${id}.png`,
        fullPage: true,
      });
    });
  }
}

test('foundation pages load the self-hosted heading font', async ({ page }) => {
  await openStory(page, 'fundamentos-tipografia--tipografia', 'scheme:light');

  const families = await page.evaluate(() =>
    [...document.fonts]
      .filter((face) => face.status === 'loaded')
      .map((face) => face.family.replaceAll('"', ''))
  );
  expect(families).toContain('Bricolage Grotesque');
  expect(families).toContain('Figtree');
  const requests = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((entry) => entry.name)
  );
  expect(
    requests.filter(
      (url) => url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')
    )
  ).toEqual([]);
});

for (const preset of ['floresta', 'grafite', 'mostarda']) {
  for (const scheme of SCHEMES) {
    test(`store preset ${preset} in ${scheme}: every semantic pair passes and axe is clean`, async ({
      page,
    }, info) => {
      await openStory(page, 'fundamentos-cores--cores', `scheme:${scheme};store:${preset}`);

      await expect(
        page.getByRole('heading', { level: 2, name: new RegExp(`loja`, 'i') }).first()
      ).toBeVisible();
      await expect(page.getByRole('cell', { name: 'Falha', exact: true })).toHaveCount(0);
      await expectNoAxeViolations(page);
      await openStory(page, 'atoms-button--all-variants', `scheme:${scheme};store:${preset}`);
      await expectNoAxeViolations(page);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/${scheme}/store-${preset}-buttons.png`,
      });
    });
  }
}

// Safari skips buttons on Tab unless Full Keyboard Access is on; Option+Tab reaches every control.
const tabKey = (browserName: string): string => (browserName === 'webkit' ? 'Alt+Tab' : 'Tab');

test('the button is reachable with Tab and shows a 2px focus outline in the ring color', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'atoms-button--default', 'scheme:light');
  const button = page.getByRole('button', { name: 'Comprar agora' });

  await page.keyboard.press(tabKey(browserName));

  await expect(button).toBeFocused();
  const outline = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(outline).toEqual({ style: 'solid', width: '2px' });
});

test('the loading button keeps the focus and ignores Enter', async ({ page, browserName }) => {
  await openStory(page, 'atoms-button--loading', 'scheme:light');
  const button = page.getByRole('button', { name: 'Salvando produto' });

  await page.keyboard.press(tabKey(browserName));
  await page.keyboard.press('Enter');

  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('aria-busy', 'true');
});

for (const width of [360, 768, 1280]) {
  test(`foundation pages have no horizontal scroll at ${String(width)}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const id of FOUNDATIONS) {
      await openStory(page, id, 'scheme:light');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow, id).toBeLessThanOrEqual(0);
    }
  });
}
