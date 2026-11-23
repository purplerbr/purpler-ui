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
  'atoms-button--long-label',
  'atoms-button--link-in-text',
] as const;
const FORM_STORIES = ['atoms-checkbox--all-variants', 'molecules-alert--all-variants'] as const;
const CONTENT_STORIES = [
  'atoms-heading--all-variants',
  'molecules-card--all-variants',
  'atoms-text--all-variants',
  'templates-authlayout--default',
  'templates-authlayout--callback',
] as const;
const LOADING_STORIES = [
  'atoms-spinner--all-variants',
  'atoms-spinner--page-loading',
  'atoms-skeleton--all-variants',
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

// A story with only headings never asks for Figtree, so Chromium leaves it unloaded.
async function expectHeadingFont(page: Page): Promise<void> {
  const font = await page
    .getByRole('heading')
    .first()
    .evaluate((element) => {
      const { fontWeight } = getComputedStyle(element);
      return `${fontWeight} 16px "Bricolage Grotesque"`;
    });
  expect(await page.evaluate((spec) => document.fonts.check(spec), font)).toBe(true);
}

// axe at phone width too: tables that scroll sideways only exist there (scrollable-region-focusable).
const AXE_WIDTHS = [1280, 360] as const;

for (const width of AXE_WIDTHS) {
  for (const scheme of SCHEMES) {
    for (const id of [
      ...FOUNDATIONS,
      ...BUTTON_STORIES,
      ...FORM_STORIES,
      ...CONTENT_STORIES,
      ...LOADING_STORIES,
    ]) {
      test(`${id} in ${scheme} at ${String(width)}px renders with the brand fonts and no WCAG violations`, async ({
        page,
      }, info) => {
        await page.setViewportSize({ width, height: 900 });
        await openStory(page, id, `scheme:${scheme}`);

        expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(
          scheme === 'dark'
        );
        if (id !== 'atoms-heading--all-variants')
          expect(await page.evaluate(() => document.fonts.check('600 16px Figtree'))).toBe(true);
        if (id === 'atoms-heading--all-variants') await expectHeadingFont(page);
        await expectNoAxeViolations(page);
        await page.screenshot({
          path: `test-results/screens/${info.project.name}/${String(width)}/${scheme}/${id}.png`,
          fullPage: true,
        });
      });
    }
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

test('single-line buttons keep their fixed height in every size, with or without a border', async ({
  page,
}) => {
  await openStory(page, 'atoms-button--all-variants', 'scheme:light');

  for (const name of ['Publicar loja', 'Editar produto', 'Ver todos os pedidos']) {
    const heights = await page
      .getByRole('button', { name, exact: true })
      .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
    expect(heights, name).toEqual([32, 40, 48]);
  }
});

test('a long label wraps inside the button and the viewport at 360px', async ({ page }, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'atoms-button--long-label', 'scheme:light');
  const button = page.getByRole('button', { name: /Doceria e Confeitaria/ });

  const box = await button.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      overflow: element.scrollWidth - element.clientWidth,
      left: rect.left,
      right: rect.right,
      height: rect.height,
    };
  });
  expect(box.overflow).toBeLessThanOrEqual(0);
  expect(box.left).toBeGreaterThanOrEqual(0);
  expect(box.right).toBeLessThanOrEqual(360);
  expect(box.height).toBeGreaterThan(40);
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/360/button-long-label.png`,
  });
});

test('a link-variant button lines up with the text next to it', async ({ page }, info) => {
  await openStory(page, 'atoms-button--link-in-text', 'scheme:light');
  const text = page.getByText('Você ainda não recebeu pedidos hoje.');
  const link = page.getByRole('button', { name: 'Ver todos os pedidos' });

  const [textLeft, linkLeft, labelLeft] = await Promise.all([
    text.evaluate((element) => element.getBoundingClientRect().left),
    link.evaluate((element) => element.getBoundingClientRect().left),
    link.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect().left;
    }),
  ]);
  expect(linkLeft).toBe(textLeft);
  // WebKit puts the glyph box a few thousandths of a pixel in.
  expect(labelLeft).toBeCloseTo(textLeft, 1);
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/button-link-in-text.png`,
  });
});

test('the checkbox is reachable with Tab, toggles with Space and shows the focus outline', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'atoms-checkbox--default', 'scheme:light');
  const checkbox = page.getByRole('checkbox', { name: 'Li e aceito os termos de uso' });

  await page.keyboard.press(tabKey(browserName));
  await expect(checkbox).toBeFocused();
  const outline = await checkbox.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(outline).toEqual({ style: 'solid', width: '2px' });

  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await page.getByText('Li e aceito os termos de uso').click();
  await expect(checkbox).not.toBeChecked();
});

test('a page h1 focused by script (tabIndex -1) shows no focus ring', async ({ page }) => {
  await openStory(page, 'atoms-heading--page-title', 'scheme:light');
  const heading = page.getByRole('heading', { level: 1 });

  await heading.evaluate((element) => {
    element.tabIndex = -1;
    element.focus();
  });

  await expect(heading).toBeFocused();
  expect(await heading.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('none');
});

test('the loading button keeps the focus and ignores Enter', async ({ page, browserName }) => {
  await openStory(page, 'atoms-button--loading', 'scheme:light');
  const button = page.getByRole('button', { name: 'Salvando produto' });

  await page.keyboard.press(tabKey(browserName));
  await page.keyboard.press('Enter');

  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('aria-busy', 'true');
});

test('under reduced motion the spinner stops, shows its label and the skeleton stops pulsing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openStory(page, 'atoms-spinner--default', 'scheme:light');
  const status = page.getByRole('status');

  await expect(status.getByText('Carregando…')).toBeVisible();
  // toBeVisible accepts the 1px sr-only box, so check the label left it.
  expect((await status.getByText('Carregando…').boundingBox())?.width).toBeGreaterThan(1);
  expect(await status.locator('svg').evaluate((icon) => getComputedStyle(icon).animationName)).toBe(
    'none'
  );

  await openStory(page, 'atoms-skeleton--default', 'scheme:light');
  expect(
    await page
      .locator('[data-slot="skeleton"]')
      .evaluate((block) => getComputedStyle(block).animationName)
  ).toBe('none');
});

test('with motion allowed the spinner turns and keeps its label for screen readers only', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openStory(page, 'atoms-spinner--default', 'scheme:light');
  const status = page.getByRole('status');

  await expect(status).toHaveText('Carregando…');
  // sr-only clips the text to a 1px box, which Playwright still counts as visible.
  expect((await status.getByText('Carregando…').boundingBox())?.width).toBeLessThanOrEqual(1);
  expect(await status.locator('svg').evaluate((icon) => getComputedStyle(icon).animationName)).toBe(
    'spin'
  );
});

for (const width of [360, 768, 1280]) {
  test(`foundation pages and the auth layout have no horizontal scroll at ${String(width)}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    for (const id of [
      ...FOUNDATIONS,
      'templates-authlayout--default',
      ...LOADING_STORIES,
      ...BUTTON_STORIES,
    ]) {
      await openStory(page, id, 'scheme:light');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow, id).toBeLessThanOrEqual(0);
    }
    await page.screenshot({
      path: `test-results/screens/${info.project.name}/${String(width)}/auth-layout.png`,
      fullPage: true,
    });
  });
}
