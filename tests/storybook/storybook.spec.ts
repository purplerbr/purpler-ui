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
  'atoms-button--long-word',
  'atoms-button--link-in-text',
] as const;
const FORM_STORIES = [
  'atoms-checkbox--all-variants',
  'atoms-input--all-variants',
  'atoms-label--all-variants',
  'atoms-radiogroup--all-variants',
  'molecules-formfield--all-variants',
  'molecules-select--all-variants',
  'molecules-alert--all-variants',
  'atoms-badge--all-variants',
] as const;
const CONTENT_STORIES = [
  'atoms-heading--all-variants',
  'atoms-list--all-variants',
  'atoms-list--inside-empty-state',
  'atoms-logo--all-variants',
  'molecules-accordion--all-variants',
  'molecules-card--all-variants',
  'atoms-text--all-variants',
  'templates-authlayout--default',
  'templates-authlayout--callback',
] as const;
const CONTACT_STORIES = [
  'atoms-floatingcontactlink--default',
  'atoms-floatingcontactlink--all-variants',
  'atoms-floatingcontactlink--on-marketing-page',
] as const;
const LANDING_STORIES = [
  'molecules-sheet--all-variants',
  'molecules-emptystate--all-variants',
  'organisms-marketingheader--all-variants',
  'organisms-marketingfooter--all-variants',
  'organisms-marketingfooter--with-action',
  'organisms-consentbanner--default',
  'organisms-consentbanner--reopened',
  'organisms-consentbanner--all-variants',
  'organisms-consentbanner--on-marketing-page',
  'organisms-pricingcard--all-variants',
  'organisms-pricingtable--all-variants',
  'templates-marketinglayout--default',
  'templates-marketinglayout--not-found',
] as const;
const TABLE_STORIES = [
  'organisms-datatable--all-variants',
  'organisms-datatable--with-filters',
  'organisms-datatable--empty',
] as const;
const LOADING_STORIES = [
  'atoms-spinner--all-variants',
  'atoms-spinner--page-loading',
  'atoms-skeleton--all-variants',
] as const;
const DASHBOARD_STORIES = [
  'templates-dashboardlayout--default',
  'templates-dashboardlayout--store-loading',
  'templates-dashboardlayout--long-store-name',
  'organisms-imageuploader--all-variants',
  'organisms-fileuploader--all-variants',
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

// `wholePage` covers a modal Sheet, which renders in a portal outside #storybook-root.
async function expectNoAxeViolations(page: Page, wholePage = false): Promise<void> {
  let found: string[] = [];
  // Storybook's a11y addon runs axe on render too; retry while that run holds the shared axe.
  await expect(async () => {
    const builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
    const results = await (wholePage ? builder : builder.include('#storybook-root')).analyze();
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
      ...LANDING_STORIES,
      ...CONTACT_STORIES,
      ...LOADING_STORIES,
      ...TABLE_STORIES,
      ...DASHBOARD_STORIES,
    ]) {
      test(`${id} in ${scheme} at ${String(width)}px renders with the brand fonts and no WCAG violations`, async ({
        page,
      }, info) => {
        await page.setViewportSize({ width, height: 900 });
        await openStory(page, id, `scheme:${scheme}`);

        expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(
          scheme === 'dark'
        );
        // Stories without body text (headings, the logo) never ask for Figtree.
        if (!['atoms-heading--all-variants', 'atoms-logo--all-variants'].includes(id))
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
      await openStory(page, 'atoms-badge--all-variants', `scheme:${scheme};store:${preset}`);
      await expectNoAxeViolations(page);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/${scheme}/store-${preset}-buttons.png`,
      });
    });
  }
}

test('the logo keeps the brand colors under a store theme and swaps them in dark', async ({
  page,
}) => {
  const fills = async (globals: string): Promise<string[]> => {
    await openStory(page, 'atoms-logo--default', globals);
    return page
      .locator('[data-slot="logo"] path')
      .evaluateAll((paths) => paths.map((path) => getComputedStyle(path).fill));
  };

  const light = await fills('scheme:light');
  expect(await fills('scheme:light;store:floresta')).toEqual(light);
  const dark = await fills('scheme:dark');
  expect(await fills('scheme:dark;store:grafite')).toEqual(dark);
  expect(dark).not.toEqual(light);
});

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

  const heightsOf = (name: string | RegExp) =>
    page
      .getByRole('button', { name, exact: true })
      .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
  for (const name of [
    'Publicar loja',
    'Ver detalhes',
    'Editar produto',
    'Cancelar',
    'Excluir produto',
    'Ver todos os pedidos',
  ]) {
    expect(await heightsOf(name), name).toEqual([32, 40, 48]);
  }
  for (const name of ['Indisponível', 'Salvando', /^Adicionar \(/]) {
    expect(await heightsOf(name), String(name)).toEqual(Array.from({ length: 6 }, () => 40));
  }
});

const LONG_LABELS = [
  ['long-label', /Doceria e Confeitaria/],
  ['long-word', /MinhaLojaDeRoupas/],
] as const;

for (const [story, name] of LONG_LABELS) {
  test(`${story} wraps inside the button and the viewport at 360px`, async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openStory(page, `atoms-button--${story}`, 'scheme:light');

    const box = await page.getByRole('button', { name }).evaluate((element) => {
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
      path: `test-results/screens/${info.project.name}/360/button-${story}.png`,
    });
  });
}

async function wrappedButtonBox(page: Page, name: RegExp) {
  return page.getByRole('button', { name }).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(element);
    const label = range.getBoundingClientRect();
    const spinner = element.querySelector('svg')?.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      lines: new Set([...range.getClientRects()].map(({ top }) => Math.round(top))).size,
      overflow: element.scrollWidth - element.clientWidth,
      inside: label.left >= rect.left && label.right <= rect.right && label.bottom <= rect.bottom,
      spinnerInside: spinner ? spinner.left >= rect.left && spinner.right <= rect.right : null,
      ring: { style: style.outlineStyle, width: style.outlineWidth, offset: style.outlineOffset },
      ringLeft: rect.left - 4,
      ringRight: rect.right + 4,
      radius: Number.parseFloat(style.borderTopLeftRadius),
      height: rect.height,
    };
  });
}

test('a wrapped three-line button shows the focus ring around the whole button', async ({
  page,
  browserName,
}, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'atoms-button--long-label', 'scheme:light');

  await page.keyboard.press(tabKey(browserName));

  await expect(page.getByRole('button', { name: /Doceria/ })).toBeFocused();
  const box = await wrappedButtonBox(page, /Doceria/);
  expect(box.lines).toBe(3);
  expect(box.ring).toEqual({ style: 'solid', width: '2px', offset: '2px' });
  expect(box.ringLeft).toBeGreaterThanOrEqual(0);
  expect(box.ringRight).toBeLessThanOrEqual(360);
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/360/button-long-label-focus.png`,
  });
});

for (const scheme of SCHEMES) {
  for (const store of ['purpler', 'rose']) {
    test(`a multi-line button is a rounded rectangle, not an ellipse (${scheme}, ${store})`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await openStory(page, 'atoms-button--long-label', `scheme:${scheme};store:${store}`);

      const box = await wrappedButtonBox(page, /Doceria/);
      expect(box.lines).toBeGreaterThanOrEqual(3);
      expect(box.radius).toBeLessThanOrEqual(24);
      expect(box.height).toBeGreaterThan(48);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/360/button-long-label-${scheme}-${store}.png`,
      });
    });
  }
}

test('a long label still wraps inside the button while loading, next to the spinner', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'atoms-button--long-label&args=loading:!true', 'scheme:light');
  const button = page.getByRole('button', { name: /Doceria/ });

  await expect(button).toHaveAttribute('aria-busy', 'true');
  const box = await wrappedButtonBox(page, /Doceria/);
  expect(box.lines).toBeGreaterThanOrEqual(2);
  expect(box.overflow).toBeLessThanOrEqual(0);
  expect(box.inside).toBe(true);
  expect(box.spinnerInside).toBe(true);
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/360/button-long-label-loading.png`,
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

test('the accordion opens with Enter, closes with Space and shows the focus outline', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'molecules-accordion--default', 'scheme:light');
  const question = page.getByText('Preciso ter CNPJ para abrir minha loja?');
  const answer = page.getByText(/Você pode começar com CPF/);

  await expect(answer).toBeHidden();
  await page.keyboard.press(tabKey(browserName));
  await expect(question).toBeFocused();
  expect(await question.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
    'solid'
  );
  await page.keyboard.press('Enter');
  await expect(answer).toBeVisible();
  await page.keyboard.press('Space');
  await expect(answer).toBeHidden();
});

test('the accordion question announces whether its answer is expanded', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'molecules-accordion--default', 'scheme:light');
  const name = 'Preciso ter CNPJ para abrir minha loja?';
  const question = page.locator('summary', { hasText: name });
  // Only Chromium exposes its accessibility tree to tests; WebKit maps the same native open state.
  const expanded = async (): Promise<unknown> => {
    if (browserName !== 'chromium')
      return question.evaluate((summary) => summary.parentElement?.hasAttribute('open'));
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    await cdp.detach();
    const node = nodes.find(
      ({ role, name: label }) => role?.value === 'DisclosureTriangle' && label?.value === name
    );
    return node?.properties?.find((property) => property.name === 'expanded')?.value.value;
  };

  await expect.poll(expanded).toBe(false);
  await question.click();
  await expect.poll(expanded).toBe(true);
  await question.click();
  await expect.poll(expanded).toBe(false);
});

test('accordion items sharing a name keep only one open', async ({ page }) => {
  await openStory(page, 'molecules-accordion--one-at-a-time', 'scheme:light');

  await page.getByText('Preciso ter CNPJ para abrir minha loja?').click();
  await page.getByText('Posso usar o domínio da minha marca?').click();

  await expect(page.locator('details[open]')).toHaveCount(1);
  await expect(page.getByText(/Aponte o seu domínio/)).toBeVisible();
});

test('the accordion markup opens and closes with JavaScript off', async ({ page, browser }) => {
  await openStory(page, 'molecules-accordion--default', 'scheme:light');
  const html = await page.locator('#storybook-root').innerHTML();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJs = await context.newPage();

  await noJs.setContent(`<!doctype html><html lang="pt-BR"><body>${html}</body></html>`);
  const answer = noJs.getByText(/valor vai direto para ela/);
  expect(await answer.count()).toBe(1);
  await expect(answer).toBeHidden();
  await noJs.getByText('O dinheiro das vendas cai na minha conta?').click();
  await expect(answer).toBeVisible();
  await context.close();
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
    // About 30 stories in one test: it sat at the 30 s limit even on main, so it gets 90 s.
    test.slow();
    await page.setViewportSize({ width, height: 900 });
    for (const id of [
      ...FOUNDATIONS,
      'templates-authlayout--default',
      'atoms-logo--all-variants',
      'atoms-badge--all-variants',
      'molecules-accordion--all-variants',
      'atoms-list--inside-empty-state',
      ...LANDING_STORIES,
      ...LOADING_STORIES,
      ...BUTTON_STORIES,
      ...DASHBOARD_STORIES,
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

const focusedInside = (page: Page, selector: string): Promise<boolean> =>
  page.evaluate(
    (css) => document.querySelector(css)?.contains(document.activeElement) ?? false,
    selector
  );

test('the sheet opens with the keyboard, keeps Tab inside, closes on Esc and returns the focus', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'molecules-sheet--default', 'scheme:light');
  const trigger = page.getByRole('button', { name: 'Ver resumo do pedido' });

  await page.keyboard.press(tabKey(browserName));
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Resumo do pedido' });
  await expect(dialog).toBeVisible();
  for (let step = 0; step < 4; step += 1) {
    await page.keyboard.press(tabKey(browserName));
    expect(await focusedInside(page, '[role="dialog"]')).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

for (const width of AXE_WIDTHS) {
  for (const scheme of SCHEMES) {
    test(`the open sheet in ${scheme} at ${String(width)}px has no WCAG violations`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 800 });
      await openStory(page, 'molecules-sheet--open', `scheme:${scheme}`);

      await expect(page.getByRole('dialog', { name: 'Resumo do pedido' })).toBeVisible();
      await expectNoAxeViolations(page, true);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/${String(width)}/${scheme}/sheet-open.png`,
      });
    });
  }
}

test('the alert dialog opens with the keyboard on cancel, keeps Tab inside, ignores clicks outside and returns the focus', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'molecules-alertdialog--default', 'scheme:light');
  const trigger = page.getByRole('button', { name: 'Cancelar assinatura' });

  await page.keyboard.press(tabKey(browserName));
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('alertdialog', { name: 'Cancelar a assinatura?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Manter assinatura' })).toBeFocused();
  for (let step = 0; step < 4; step += 1) {
    await page.keyboard.press(tabKey(browserName));
    expect(await focusedInside(page, '[role="alertdialog"]')).toBe(true);
  }
  await page.mouse.click(5, 5);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

for (const scheme of SCHEMES) {
  test(`the loading alert dialog action in ${scheme} keeps the focus, ignores Enter and stays open with no WCAG violations`, async ({
    page,
    browserName,
  }) => {
    await openStory(page, 'molecules-alertdialog--loading', `scheme:${scheme}`);
    const dialog = page.getByRole('alertdialog', { name: 'Cancelar a assinatura?' });
    const action = dialog.getByRole('button', { name: 'Cancelar assinatura' });

    await expect(dialog.getByRole('button', { name: 'Manter assinatura' })).toBeFocused();
    await page.keyboard.press(tabKey(browserName));
    await expect(action).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(dialog).toBeVisible();
    await expect(action).toBeFocused();
    await expect(action).toHaveAttribute('aria-busy', 'true');
    await expectNoAxeViolations(page, true);
  });
}

for (const width of [360, 768, 1280]) {
  for (const scheme of SCHEMES) {
    for (const variant of ['destructive', 'primary']) {
      test(`the open ${variant} alert dialog in ${scheme} at ${String(width)}px fits the page with no WCAG violations`, async ({
        page,
      }, info) => {
        await page.setViewportSize({ width, height: 800 });
        await openStory(
          page,
          'molecules-alertdialog--open',
          `scheme:${scheme}&args=variant:${variant}`
        );

        await expect(page.getByRole('alertdialog')).toBeVisible();
        await expectNoAxeViolations(page, true);
        const box = await page.getByRole('alertdialog').boundingBox();
        expect(box && box.x >= 0 && box.x + box.width <= width).toBe(true);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
        ).toBeLessThanOrEqual(0);
        await page.screenshot({
          path: `test-results/screens/${info.project.name}/${String(width)}/${scheme}/alertdialog-open-${variant}.png`,
        });
      });
    }
  }
}

test('the header skip link shows on the first Tab and moves the focus to the main content', async ({
  page,
  browserName,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openStory(page, 'organisms-marketingheader--default', 'scheme:light');
  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });

  await page.keyboard.press(tabKey(browserName));
  await expect(skip).toBeFocused();
  expect((await skip.boundingBox())?.width).toBeGreaterThan(24);
  await page.screenshot({ path: `test-results/screens/${info.project.name}/header-skip-link.png` });
  await page.keyboard.press('Enter');
  await expect(page.locator('#conteudo')).toBeFocused();
});

test('at 1280px the header shows the nav in the bar, hides the menu button and marks the page', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openStory(page, 'organisms-marketingheader--current-page', 'scheme:light');
  const nav = page.getByRole('navigation', { name: 'Principal' });

  await expect(nav.getByRole('link', { name: 'Recursos' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Planos' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeHidden();
  const order: string[] = [];
  for (let step = 0; step < 7; step += 1) {
    await page.keyboard.press(tabKey(browserName));
    order.push(await page.evaluate(() => document.activeElement?.textContent ?? ''));
  }
  expect(order).toEqual([
    'Pular para o conteúdo',
    '',
    'Recursos',
    'Como funciona',
    'Planos',
    'Dúvidas',
    'Começar grátis',
  ]);
});

for (const scheme of SCHEMES) {
  test(`at 360px in ${scheme} the header menu opens in a sheet, closes on Esc and returns the focus`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openStory(page, 'organisms-marketingheader--current-page', `scheme:${scheme}`);
    const button = page.getByRole('button', { name: 'Abrir menu' });

    await expect(page.getByRole('banner').getByRole('link', { name: 'Recursos' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Começar grátis' })).toBeVisible();
    const box = await button.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    await button.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu.getByRole('link', { name: 'Planos' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expectNoAxeViolations(page, true);
    await page.screenshot({
      path: `test-results/screens/${info.project.name}/360/${scheme}/header-menu-open.png`,
    });
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
  });
}

test('following a link from the header menu closes it and moves to the section', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'templates-marketinglayout--default', 'scheme:light');

  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Dúvidas' }).click();

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page).toHaveURL(/#duvidas$/);
  await expect(page.getByRole('button', { name: 'Abrir menu' })).not.toBeFocused();
});

for (const width of [360, 1280]) {
  for (const scheme of SCHEMES) {
    test(`without JavaScript at ${String(width)}px in ${scheme} the header shows the logo, the CTA and the links`, async ({
      page,
      browser,
    }, info) => {
      await openStory(page, 'templates-marketinglayout--default', `scheme:${scheme}`);
      // The rendered page, styles included, served again to a context that cannot run scripts.
      const html = (await page.content()).replaceAll(/<script\b[\s\S]*?<\/script>/g, '');
      const origin = new URL(page.url()).origin;
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width, height: 900 },
      });
      const noJs = await context.newPage();
      await noJs.route(`${origin}/no-js.html`, (route) =>
        route.fulfill({ contentType: 'text/html', body: html })
      );
      await noJs.goto(`${origin}/no-js.html`);

      const banner = noJs.getByRole('banner');
      expect(await noJs.evaluate(() => matchMedia('(scripting: none)').matches)).toBe(true);
      await expect(banner.getByRole('img', { name: 'Purpler, página inicial' })).toBeVisible();
      await expect(banner.getByRole('link', { name: 'Começar grátis' })).toBeVisible();
      for (const label of ['Recursos', 'Planos', 'Dúvidas'])
        await expect(banner.getByRole('link', { name: label })).toBeVisible();
      await expect(banner.getByRole('button', { name: 'Abrir menu' })).toBeHidden();
      expect(
        await noJs.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      ).toBeLessThanOrEqual(0);
      await noJs.screenshot({
        path: `test-results/screens/${info.project.name}/${String(width)}/${scheme}/header-no-js.png`,
      });
      await banner.getByRole('link', { name: 'Dúvidas' }).click();
      await expect(noJs).toHaveURL(/#duvidas$/);
      await context.close();
    });
  }
}

test('at 360px the pricing table scrolls inside its focusable region, not the page', async ({
  page,
  browserName,
}, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'organisms-pricingtable--default', 'scheme:light');
  const region = page.getByRole('region', { name: 'Comparação dos planos da Purpler' });

  await page.keyboard.press(tabKey(browserName));
  await expect(region).toBeFocused();
  expect(await region.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('solid');
  expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  // WebKit sometimes drops the first arrow right after the focus moves; a person just presses again.
  await expect(async () => {
    await page.keyboard.press('ArrowRight');
    expect(await region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  }).toPass({ timeout: 5_000 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  ).toBeLessThanOrEqual(0);
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/360/pricing-table-focus.png`,
  });
});

test('every pricing card CTA is named by its text and described by its plan', async ({ page }) => {
  await openStory(page, 'organisms-pricingcard--all-variants', 'scheme:light');

  await expect(
    page.getByRole('link', { name: 'Assinar o Profissional' })
  ).toHaveAccessibleDescription('Profissional');
  await expect(page.getByText('Mais popular')).toBeVisible();
});

for (const width of AXE_WIDTHS) {
  test(`at ${String(width)}px a list inside the centered EmptyState starts its items at one edge`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await openStory(page, 'atoms-list--inside-empty-state', 'scheme:light');
    const list = page.getByRole('list');
    const lefts = await list
      .getByRole('listitem')
      .evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().left)));

    await expect(list.getByRole('listitem')).toHaveCount(3);
    expect(new Set(lefts).size).toBe(1);
    expect(await list.evaluate((element) => getComputedStyle(element).textAlign)).toBe('start');
    expect(
      await page.getByRole('heading').evaluate((element) => getComputedStyle(element).textAlign)
    ).toBe('center');
    await page.screenshot({
      path: `test-results/screens/${info.project.name}/${String(width)}/list-in-empty-state.png`,
    });
  });
}

test('a list without markers keeps its list and listitem roles in the accessibility tree', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'atoms-list--without-marker', 'scheme:light');
  const list = page.locator('[data-slot="list"]');
  expect(await list.evaluate((element) => getComputedStyle(element).listStyleType)).toBe('none');
  // WebKit hides its tree from tests and drops the implicit role here, so only the attribute counts.
  await expect(list).toHaveAttribute('role', 'list');
  if (browserName !== 'chromium') return;

  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  await cdp.detach();
  const roles = nodes
    .filter(({ ignored }) => !ignored)
    .map(({ role }) => String(role?.value))
    .filter((role) => role === 'list' || role === 'listitem');
  expect(roles).toEqual(['list', 'listitem', 'listitem', 'listitem']);
});

const CONTACT_NAME = 'Conversar pelo WhatsApp (abre em nova aba)';

type Box = { x: number; y: number; width: number; height: number };
const overlaps = (a: Box, b: Box): boolean =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
const contains = (outer: Box, inner: Box): boolean =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.height <= outer.y + outer.height;

// True when the topmost element at the link's center is not the link: something covers it.
// A modal sets pointer-events: none on the body, which hit testing skips, so restore it first.
async function isCovered(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const link = document.querySelector<HTMLElement>('[data-slot="floating-contact-link"]');
    if (!link) return false;
    const { x, y, width, height } = link.getBoundingClientRect();
    link.style.pointerEvents = 'auto';
    const covered = !link.contains(document.elementFromPoint(x + width / 2, y + height / 2));
    link.style.pointerEvents = '';
    return covered;
  });
}

for (const width of [360, 1280]) {
  test(`at ${String(width)}px the contact link sits in the corner with a 44px target`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 800 });
    await openStory(page, 'atoms-floatingcontactlink--default', 'scheme:light');
    const link = page.getByRole('link', { name: CONTACT_NAME });
    const box = await link.boundingBox();

    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(width - ((box?.x ?? 0) + (box?.width ?? 0))).toBeGreaterThanOrEqual(16);
    expect(800 - ((box?.y ?? 0) + (box?.height ?? 0))).toBeGreaterThanOrEqual(16);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const label = link.getByText('Conversar pelo WhatsApp', { exact: true });
    if (width === 360) await expect(label).toBeHidden();
    else await expect(label).toBeVisible();
    await page.screenshot({
      path: `test-results/screens/${info.project.name}/${String(width)}/floating-contact.png`,
    });
  });
}

// Desktop browsers report a zero safe area, so check the offsets the browser parsed for the link.
test('the contact link offsets add the safe-area insets to its 16px gap', async ({ page }) => {
  await openStory(page, 'atoms-floatingcontactlink--default', 'scheme:light');

  const offsets = await page.evaluate(() => {
    const link = document.querySelector('[data-slot="floating-contact-link"]');
    const found: Record<string, string> = {};
    const visit = (rules: CSSRuleList) => {
      for (const rule of rules) {
        if (rule instanceof CSSGroupingRule) visit(rule.cssRules);
        if (!(rule instanceof CSSStyleRule) || !link?.matches(rule.selectorText)) continue;
        for (const side of ['right', 'bottom']) {
          const value = rule.style.getPropertyValue(side);
          if (value) found[side] = value.replaceAll(' ', '');
        }
      }
    };
    for (const sheet of document.styleSheets) visit(sheet.cssRules);
    return found;
  });

  expect(offsets.right).toContain('env(safe-area-inset-right)');
  expect(offsets.bottom).toContain('env(safe-area-inset-bottom)');
});

test('the contact link is reachable with Tab and shows a 2px focus outline', async ({
  page,
  browserName,
}, info) => {
  await openStory(page, 'atoms-floatingcontactlink--default', 'scheme:dark');
  const link = page.getByRole('link', { name: CONTACT_NAME });

  await page.keyboard.press(tabKey(browserName));

  await expect(link).toBeFocused();
  const outline = await link.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(outline).toEqual({ style: 'solid', width: '2px' });
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/floating-contact-focus.png`,
  });
});

test('at 360px the contact link overlaps neither the header controls nor a focused footer link', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'atoms-floatingcontactlink--on-marketing-page', 'scheme:light');
  const contact = await page.getByRole('link', { name: CONTACT_NAME }).boundingBox();
  if (!contact) throw new Error('contact link not rendered');

  await page.keyboard.press(tabKey(browserName));
  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });
  await expect(skip).toBeFocused();
  for (const control of [
    skip,
    page.getByRole('button', { name: 'Abrir menu' }),
    page.getByRole('link', { name: 'Começar grátis' }),
  ]) {
    const box = await control.boundingBox();
    expect(box && overlaps(box, contact)).toBe(false);
  }
  // WCAG 2.4.11: a focused footer link is never fully hidden under the fixed link.
  const footer = page.getByRole('contentinfo');
  for (const target of await footer.getByRole('link').all()) {
    await target.focus();
    const box = await target.boundingBox();
    expect(box && contains(contact, box)).toBe(false);
  }
});

test('at 360px the open header menu covers the contact link and keeps it out of Tab', async ({
  page,
  browserName,
}, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'atoms-floatingcontactlink--on-marketing-page', 'scheme:light');

  expect(await isCovered(page)).toBe(false);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await expect(menu).toBeVisible();
  expect(await isCovered(page)).toBe(true);
  for (let step = 0; step < 4; step += 1) {
    await page.keyboard.press(tabKey(browserName));
    expect(await focusedInside(page, '[role="dialog"]')).toBe(true);
  }
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/360/floating-contact-menu-open.png`,
  });
});

for (const width of AXE_WIDTHS) {
  for (const scheme of SCHEMES) {
    test(`with a sheet open in ${scheme} at ${String(width)}px the contact link stays under it, with no WCAG violations`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 800 });
      await openStory(page, 'atoms-floatingcontactlink--with-sheet-open', `scheme:${scheme}`);

      await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
      expect(await isCovered(page)).toBe(true);
      await expectNoAxeViolations(page, true);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/${String(width)}/${scheme}/floating-contact-sheet-open.png`,
      });
    });
  }
}

for (const width of [360, 1280]) {
  test(`without JavaScript at ${String(width)}px the contact link shows and keeps its destination`, async ({
    page,
    browser,
  }, info) => {
    await openStory(page, 'atoms-floatingcontactlink--on-marketing-page', 'scheme:light');
    const html = (await page.content()).replaceAll(/<script\b[\s\S]*?<\/script>/g, '');
    const origin = new URL(page.url()).origin;
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 800 },
    });
    const noJs = await context.newPage();
    await noJs.route(`${origin}/no-js.html`, (route) =>
      route.fulfill({ contentType: 'text/html', body: html })
    );
    await noJs.goto(`${origin}/no-js.html`);

    const link = noJs.getByRole('link', { name: CONTACT_NAME });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '#conversar');
    await expect(link).toHaveAttribute('target', '_blank');
    await noJs.screenshot({
      path: `test-results/screens/${info.project.name}/${String(width)}/floating-contact-no-js.png`,
    });
    await context.close();
  });
}

// Storybook pads padded stories by 24 px, so drop it to test a true 360 px page.
for (const id of [
  'organisms-pricingtable--default',
  'organisms-pricingcard--all-variants',
  'molecules-formfield--all-variants',
  'molecules-select--all-variants',
  'atoms-radiogroup--all-variants',
  'organisms-datatable--with-filters',
  'organisms-imageuploader--all-variants',
  'organisms-fileuploader--all-variants',
]) {
  test(`${id} at a true 360px, without the story padding, has no page horizontal scroll`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openStory(page, id, 'scheme:light');
    await page.addStyleTag({ content: 'body { padding: 0 !important; margin: 0 !important; }' });

    expect(await page.evaluate(() => document.body.getBoundingClientRect().width)).toBe(360);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    ).toBeLessThanOrEqual(0);
  });
}

test('at a true 360px the pricing table keeps its row labels pinned while the plans scroll', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'organisms-pricingtable--default', 'scheme:light');
  await page.addStyleTag({ content: 'body { padding: 0 !important; margin: 0 !important; }' });
  const region = page.getByRole('region', { name: 'Comparação dos planos da Purpler' });
  const labelOffset = () =>
    region.evaluate((element) => {
      const label = element.querySelector('tbody th');
      return Math.round(
        (label?.getBoundingClientRect().left ?? -1) - element.getBoundingClientRect().left
      );
    });

  await page.keyboard.press(tabKey(browserName));
  await expect(region).toBeFocused();
  const before = await labelOffset();
  await expect(async () => {
    await page.keyboard.press('ArrowRight');
    expect(await region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  }).toPass({ timeout: 5_000 });
  expect(await labelOffset()).toBe(before);
});

const outlineOf = (locator: ReturnType<Page['locator']>) =>
  locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });

test('the input takes Tab, shows the focus outline and keeps the suffix out of the value', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'atoms-input--with-suffix', 'scheme:light');
  const input = page.getByRole('textbox', { name: 'Endereço da loja' });

  await page.keyboard.press(tabKey(browserName));
  await expect(input).toBeFocused();
  // With an addon the outline sits on the group, around the suffix too.
  expect(await outlineOf(page.locator('[data-slot="input-group"]'))).toEqual({
    style: 'solid',
    width: '2px',
  });
  await page.keyboard.type('docesdaana');

  await expect(input).toHaveValue('docesdaana');
  await expect(input).toHaveAccessibleDescription('.purpler.com.br');
});

test('a disabled input is skipped by Tab', async ({ page, browserName }) => {
  await openStory(page, 'atoms-input--disabled', 'scheme:light');

  await page.keyboard.press(tabKey(browserName));

  await expect(page.getByRole('textbox', { name: 'Nome da loja' })).not.toBeFocused();
  await expect(page.getByRole('textbox', { name: 'Nome da loja' })).toBeDisabled();
});

test('submitting the form with errors focuses the first field and links each message', async ({
  page,
  browserName,
}, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-formfield--validation-flow', 'scheme:light');
  const name = page.getByRole('textbox', { name: 'Nome da loja' });
  const slug = page.getByRole('textbox', { name: 'Endereço da loja' });

  await page.getByRole('button', { name: 'Criar loja' }).click();

  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAccessibleDescription('Informe o nome da loja.');
  await expect(slug).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('alert')).toHaveText([
    'Informe o nome da loja.',
    'Use ao menos 3 letras minúsculas, números ou hífen.',
  ]);
  expect(await outlineOf(name)).toEqual({ style: 'solid', width: '2px' });
  await expectNoAxeViolations(page);
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/360/formfield-errors.png`,
    fullPage: true,
  });

  await name.fill('Doces da Ana');
  await page.keyboard.press(tabKey(browserName));
  await expect(slug).toBeFocused();
  await page.keyboard.type('docesdaana');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(name).not.toHaveAttribute('aria-invalid');
  await expect(slug).toHaveAccessibleDescription(
    '.purpler.com.br Só letras minúsculas, números e hífen. Dá para trocar depois.'
  );
});

// Radix moves the focus in a timeout and checks only while the arrow is down, as a person presses it.
async function holdArrowDown(page: Page): Promise<void> {
  const before = await page.evaluate(() => document.activeElement?.id);
  await page.keyboard.down('ArrowDown');
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).not.toBe(before);
  await page.keyboard.up('ArrowDown');
}

test('the plan cards take one Tab stop, move with the arrows and skip the disabled plan', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'atoms-radiogroup--card', 'scheme:light');
  const basic = page.getByRole('radio', { name: 'Básico' });
  const professional = page.getByRole('radio', { name: 'Profissional' });

  await page.keyboard.press(tabKey(browserName));
  await expect(basic).toBeFocused();
  expect(await outlineOf(page.locator('[data-slot="radio-group-field"]').first())).toEqual({
    style: 'solid',
    width: '2px',
  });

  await holdArrowDown(page);
  await expect(professional).toBeChecked();
  await holdArrowDown(page);
  await expect(basic).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Enterprise' })).toHaveAccessibleDescription(
    'Em breve R$ 149,99/mês · cursos em vídeo com marca d’água'
  );
});

test('a click anywhere on a plan card selects it, but not on the disabled one', async ({
  page,
}) => {
  await openStory(page, 'atoms-radiogroup--card', 'scheme:light');

  const card = (name: string) => page.locator('[data-slot="radio-group-field"]', { hasText: name });
  const professional = await card('Profissional').boundingBox();
  if (!professional) throw new Error('card not rendered');
  // Bottom-right corner: on the description, away from the circle and the label text.
  await page.mouse.click(
    professional.x + professional.width - 8,
    professional.y + professional.height - 8
  );
  await expect(page.getByRole('radio', { name: 'Profissional' })).toBeChecked();

  await card('Enterprise').click();
  await expect(page.getByRole('radio', { name: 'Enterprise' })).not.toBeChecked();
  await expect(page.getByRole('radio', { name: 'Profissional' })).toBeChecked();
});

const TOAST_BUTTONS = ['Neutro', 'Sucesso', 'Informação', 'Aviso', 'Erro', 'Com ação'] as const;

for (const width of AXE_WIDTHS) {
  for (const scheme of SCHEMES) {
    test(`every toast type in ${scheme} at ${String(width)}px fits the screen with no WCAG violations`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await openStory(page, 'molecules-toaster--all-variants', `scheme:${scheme}`);

      for (const name of TOAST_BUTTONS) await page.getByRole('button', { name }).click();
      // Sonner keeps the three newest on screen and hides the rest until one closes.
      const toasts = page.locator('[data-sonner-toast][data-visible="true"]');
      await expect(toasts).toHaveCount(3);
      // axe samples colors, so wait for sonner's 400 ms enter and lift transitions to settle.
      await expect
        .poll(() =>
          page.evaluate(() =>
            document.getAnimations().every((animation) => animation.playState !== 'running')
          )
        )
        .toBe(true);
      await expect(page.getByText('Produto arquivado')).toBeVisible();

      for (const box of await toasts.evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().toJSON() as DOMRect)
      )) {
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.right).toBeLessThanOrEqual(width);
      }
      await expectNoAxeViolations(page);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/${String(width)}/${scheme}/toaster.png`,
      });
    });
  }
}

test('Alt+T moves the focus to the toasts, where Tab reaches the action', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'molecules-toaster--all-variants', 'scheme:light');
  await page.getByRole('button', { name: 'Com ação' }).click();
  await expect(page.getByText('Produto arquivado')).toBeVisible();

  await page.keyboard.press('Alt+KeyT');
  expect(await focusedInside(page, '[data-sonner-toaster]')).toBe(true);
  const undo = page.getByRole('button', { name: 'Desfazer' });
  for (
    let step = 0;
    step < 4 && !(await undo.evaluate((el) => el === document.activeElement));
    step += 1
  )
    await page.keyboard.press(tabKey(browserName));
  await expect(undo).toBeFocused();
  expect(await outlineOf(undo)).toEqual({ style: 'solid', width: '2px' });
  await page.keyboard.press('Enter');

  await expect(page.getByText('Produto restaurado')).toBeVisible();
});

const TABLE_STORY =
  '/iframe.html?id=organisms-datatable--with-filters&viewMode=story&globals=scheme:light';
const query = (page: Page): Record<string, string> => {
  const params = new URL(page.url()).searchParams;
  return Object.fromEntries(
    ['sort', 'order', 'page', 'status'].flatMap((key) => {
      const value = params.get(key);
      return value === null ? [] : [[key, value]];
    })
  );
};
const tableStatus = (page: Page) =>
  page.getByRole('navigation', { name: 'Paginação: Produtos' }).getByRole('status');

test('a shared table link opens sorted, filtered and paged; clicks and Back follow the URL', async ({
  page,
}) => {
  await page.goto(`${TABLE_STORY}&sort=price&order=desc&page=2&status=active`);
  const price = page.getByRole('columnheader', { name: 'Preço' });
  const name = page.getByRole('columnheader', { name: 'Produto' });

  await expect(price).toHaveAttribute('aria-sort', 'descending');
  await expect(tableStatus(page)).toHaveText('Página 2 de 2');
  await expect(page.getByRole('button', { name: 'Ativos' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.getByRole('cell', { name: 'Rascunho' })).toHaveCount(0);

  await name.getByRole('button').click();
  await expect(name).toHaveAttribute('aria-sort', 'ascending');
  expect(query(page)).toEqual({ sort: 'name', order: 'asc', status: 'active' });

  await page.getByRole('button', { name: 'Próxima página' }).click();
  await expect(tableStatus(page)).toHaveText('Página 2 de 2');
  expect(query(page)).toEqual({ sort: 'name', order: 'asc', status: 'active', page: '2' });

  await page.goBack();
  await expect(tableStatus(page)).toHaveText('Página 1 de 2');
  await page.goBack();
  await expect(price).toHaveAttribute('aria-sort', 'descending');
  await expect(tableStatus(page)).toHaveText('Página 2 de 2');
  await page.goForward();
  await expect(name).toHaveAttribute('aria-sort', 'ascending');
});

test('a table link with invalid params falls back to the defaults without a new history entry', async ({
  page,
}) => {
  await page.goto(`${TABLE_STORY}&sort=hack&order=up&page=-1&status=deleted`);

  await expect(page.getByRole('columnheader', { name: 'Preço' })).toHaveAttribute(
    'aria-sort',
    'none'
  );
  await expect(tableStatus(page)).toHaveText('Página 1 de 3');
  await expect.poll(() => query(page)).toEqual({});
  expect(new URL(page.url()).searchParams.get('id')).toBe('organisms-datatable--with-filters');
  expect(await page.evaluate(() => history.length)).toBe(2);
});

test('a percent-encoded table link opens sorted, and a reload keeps the state', async ({
  page,
}) => {
  await page.goto(`${TABLE_STORY}&sort=na%6De&order=desc&status=act%69ve`);
  const name = page.getByRole('columnheader', { name: 'Produto' });

  await expect(name).toHaveAttribute('aria-sort', 'descending');
  await expect(page.getByRole('button', { name: 'Ativos' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await page.getByRole('button', { name: 'Rascunhos' }).click();
  await expect.poll(() => query(page)).toEqual({ sort: 'name', order: 'desc', status: 'draft' });

  await page.reload();

  await expect(name).toHaveAttribute('aria-sort', 'descending');
  await expect(page.getByRole('button', { name: 'Rascunhos' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(query(page)).toEqual({ sort: 'name', order: 'desc', status: 'draft' });
});

test('the sort button takes Tab and Enter and shows the focus outline', async ({
  page,
  browserName,
}) => {
  await page.goto(TABLE_STORY);
  const sortByName = page.getByRole('columnheader', { name: 'Produto' }).getByRole('button');
  await expect(sortByName).toBeVisible();

  await sortByName.focus();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('columnheader', { name: 'Produto' })).toHaveAttribute(
    'aria-sort',
    'ascending'
  );
  await expect(sortByName).toBeFocused();
  expect(await outlineOf(sortByName)).toEqual({ style: 'solid', width: '2px' });
  await page.keyboard.press(tabKey(browserName));
  await expect(page.getByRole('columnheader', { name: 'Preço' }).getByRole('button')).toBeFocused();
});

test('at 360px the table scrolls inside its focusable region, not the page', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(TABLE_STORY);
  const region = page.getByRole('region', { name: 'Produtos' });
  await expect(region).toBeVisible();

  expect(await region.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  ).toBeLessThanOrEqual(0);
  await region.focus();
  // WebKit sometimes drops the first arrow right after the focus moves; a person just presses again.
  await expect(async () => {
    await page.keyboard.press('ArrowRight');
    expect(await region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  }).toPass({ timeout: 5_000 });
  await page.screenshot({ path: `test-results/screens/${info.project.name}/360/datatable.png` });
});

test('an end-aligned column lines its header up with the numbers below it', async ({ page }) => {
  await page.goto(TABLE_STORY);
  const header = page.getByRole('columnheader', { name: 'Preço' }).getByRole('button');
  await expect(header).toBeVisible();

  const headerRight = await header.evaluate((el) => el.getBoundingClientRect().right);
  const cellRights = await page
    .locator('[data-slot="data-table"] tbody td:last-child')
    .evaluateAll((cells) =>
      cells.map((cell) => {
        const range = document.createRange();
        range.selectNodeContents(cell.lastChild ?? cell);
        const rects = [...range.getClientRects()];
        return Math.max(...rects.map((rect) => rect.right));
      })
    );

  expect(cellRights.length).toBeGreaterThan(0);
  for (const right of cellRights) expect(right).toBeCloseTo(headerRight, 0);
});

test('at 1280px the dashboard sidebar stays fixed, marks the page and follows the tab order', async ({
  page,
  browserName,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 400 });
  await openStory(page, 'templates-dashboardlayout--default', 'scheme:light');
  const nav = page.getByRole('banner').getByRole('navigation', { name: 'Principal' });

  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeHidden();
  await expect(nav.getByRole('link', { name: 'Produtos' })).toHaveAttribute('aria-current', 'page');
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(nav.getByRole('group', { name: 'Catálogo' })).toBeVisible();
  const order: string[] = [];
  for (let step = 0; step < 11; step += 1) {
    await page.keyboard.press(tabKey(browserName));
    order.push(
      await page.evaluate(
        () =>
          document.activeElement?.getAttribute('aria-label') ??
          document.activeElement?.textContent ??
          ''
      )
    );
  }
  expect(order).toEqual([
    'Pular para o conteúdo',
    '',
    'Trocar de loja',
    'Início',
    'Pedidos',
    'Produtos',
    'Categorias',
    'Plano e uso',
    'Pagamentos',
    'Configurações',
    'Sair',
  ]);
  const sidebar = page.locator('[data-slot="dashboard-layout-sidebar"]');
  // A long page, so the content scrolls well past the sidebar's own height.
  await page.locator('#conteudo').evaluate((main) => {
    main.style.minHeight = '3000px';
    scrollTo(0, 1500);
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(1500);
  expect((await sidebar.boundingBox())?.y).toBe(0);
  await page.screenshot({ path: `test-results/screens/${info.project.name}/1280/dashboard.png` });
});

test('the dashboard skip link shows on the first Tab and moves the focus to the main content', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'templates-dashboardlayout--default', 'scheme:light');
  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });

  await page.keyboard.press(tabKey(browserName));
  await expect(skip).toBeFocused();
  expect((await skip.boundingBox())?.width).toBeGreaterThan(24);
  await page.keyboard.press('Enter');
  await expect(page.locator('#conteudo')).toBeFocused();
});

for (const width of [360, 768]) {
  for (const scheme of SCHEMES) {
    test(`at ${String(width)}px in ${scheme} the dashboard menu traps the focus, closes on Esc and returns it`, async ({
      page,
      browserName,
    }, info) => {
      await page.setViewportSize({ width, height: 800 });
      await openStory(page, 'templates-dashboardlayout--default', `scheme:${scheme}`);
      const button = page.getByRole('button', { name: 'Abrir menu' });

      await expect(page.getByRole('banner').getByRole('navigation')).toBeHidden();
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
      await page.keyboard.press(tabKey(browserName));
      await page.keyboard.press(tabKey(browserName));
      await expect(button).toBeFocused();
      await page.keyboard.press('Enter');
      const menu = page.getByRole('dialog', { name: 'Menu' });
      await expect(menu.getByText('Doceria e Confeitaria da Ana')).toBeVisible();
      await expect(menu.getByRole('link', { name: 'Produtos' })).toHaveAttribute(
        'aria-current',
        'page'
      );
      for (let step = 0; step < 14; step += 1) {
        await page.keyboard.press(tabKey(browserName));
        expect(await focusedInside(page, '[role="dialog"]')).toBe(true);
      }
      await expectNoAxeViolations(page, true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/${String(width)}/${scheme}/dashboard-menu-open.png`,
      });
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(button).toBeFocused();
    });
  }
}

test('following a link from the dashboard menu closes it without sending the focus back', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'templates-dashboardlayout--default', 'scheme:light');

  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Pedidos' }).click();

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page).toHaveURL(/#pedidos$/);
  // Neither the menu button nor the logo: the app moves the focus to the new page's h1.
  await expect(page.locator('body')).toBeFocused();
});

test('while the store loads, the dashboard announces it and hides the store slot', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openStory(page, 'templates-dashboardlayout--store-loading', 'scheme:light');

  await expect(page.getByRole('status')).toHaveText('Carregando a loja');
  await expect(page.getByText('Doceria e Confeitaria da Ana')).toHaveCount(0);
});

test('the store and account slots, rendered in the bar and in the menu, reach assistive tech once', async ({
  page,
}) => {
  const once = async (expected: number) => {
    await expect(page.getByRole('link', { name: 'Trocar de loja' })).toHaveCount(expected);
    await expect(page.getByRole('button', { name: 'Sair' })).toHaveCount(expected);
    await expect(page.getByRole('navigation', { name: 'Principal' })).toHaveCount(expected);
  };

  await page.setViewportSize({ width: 1280, height: 800 });
  await openStory(page, 'templates-dashboardlayout--default', 'scheme:light');
  await once(1);
  await page.setViewportSize({ width: 360, height: 800 });
  await once(0);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await once(1);
});

test('the open dashboard menu closes when the window grows to the sidebar width, focusing the logo', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 800 });
  await openStory(page, 'templates-dashboardlayout--default', 'scheme:light');

  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('link', { name: 'Purpler, início' })).toBeFocused();
  await expect(
    page.getByRole('banner').getByRole('navigation', { name: 'Principal' })
  ).toBeVisible();
});

test('a modifier click on a dashboard menu link keeps the menu open and the focus inside', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'templates-dashboardlayout--default', 'scheme:light');

  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await menu.getByRole('link', { name: 'Pedidos' }).click({ modifiers: ['ControlOrMeta'] });

  await expect(menu).toBeVisible();
  expect(await focusedInside(page, '[role="dialog"]')).toBe(true);
  expect(page.url()).not.toMatch(/#pedidos$/);
  for (const other of page.context().pages()) if (other !== page) await other.close();
});

const LONG_STORE_NAME = 'Doceria, Confeitaria e Padaria Artesanal da Ana Beatriz de Albuquerque';

for (const width of [360, 768]) {
  test(`at ${String(width)}px the dashboard top bar shows the current store, cut with an ellipsis`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 800 });
    await openStory(page, 'templates-dashboardlayout--long-store-name', 'scheme:light');
    const banner = page.getByRole('banner');
    const label = banner.locator('[data-slot="dashboard-layout-store-label"]');

    await expect(label).toBeVisible();
    await expect(label).toHaveText(`Loja atual: ${LONG_STORE_NAME}`);
    // At 768px this name fits; at 360px it must be cut, not wrap or push the menu button.
    expect(await label.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(width === 360);
    expect(await label.evaluate((el) => getComputedStyle(el).textOverflow)).toBe('ellipsis');
    for (const target of [
      banner.getByRole('button', { name: 'Abrir menu' }),
      banner.getByRole('link', { name: 'Purpler, início' }),
    ]) {
      const box = await target.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.x).toBeGreaterThanOrEqual(0);
    }
    const labelBox = await label.boundingBox();
    expect((labelBox?.x ?? 0) + (labelBox?.width ?? 0)).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await page.screenshot({
      path: `test-results/screens/${info.project.name}/${String(width)}/dashboard-store-label.png`,
    });

    await page.getByRole('button', { name: 'Abrir menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu.getByText(LONG_STORE_NAME)).toBeVisible();
    for (const target of [
      menu.getByRole('link', { name: 'Trocar de loja' }),
      menu.getByRole('button', { name: 'Sair' }),
    ])
      expect((await target.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  });
}

test('at 1280px the store label leaves the top bar and the sidebar shows the store', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openStory(page, 'templates-dashboardlayout--long-store-name', 'scheme:light');

  await expect(page.locator('[data-slot="dashboard-layout-store-label"]')).toBeHidden();
  await expect(
    page.getByRole('banner').getByText(LONG_STORE_NAME).filter({ visible: true })
  ).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('at 360px the loading store is announced once, from the top bar', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'templates-dashboardlayout--store-loading', 'scheme:light');

  await expect(page.getByRole('status')).toHaveText('Carregando a loja');
  await expect(
    page.locator('[data-slot="dashboard-layout-store-label"] [data-slot="skeleton"]')
  ).toBeVisible();
});

// The accessibility tree, not the DOM: the hidden sidebar copy and the inert banner behind the menu must not count.
const storeNameReadings = async (page: Page): Promise<number> =>
  (await page.locator('body').ariaSnapshot()).split(LONG_STORE_NAME).length - 1;

for (const width of [360, 768, 1280]) {
  test(`at ${String(width)}px screen readers get the store name once, with the menu closed or open`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await openStory(page, 'templates-dashboardlayout--long-store-name', 'scheme:light');

    await expect.poll(() => storeNameReadings(page)).toBe(1);
    if (width === 1280) return;
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    await expect.poll(() => storeNameReadings(page)).toBe(1);
  });
}

// Same weight (ADR 0015): the two buttons must look the same, read from the rendered styles.
test('ConsentBanner gives OK and Recusar the same computed style and size', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'organisms-consentbanner--on-marketing-page', 'scheme:light');
  const looks = await page
    .getByRole('region', { name: 'Cookies e privacidade' })
    .getByRole('button')
    .evaluateAll((buttons) =>
      buttons.map((button) => {
        const style = getComputedStyle(button);
        const { width, height } = button.getBoundingClientRect();
        return [
          style.backgroundColor,
          style.color,
          style.fontSize,
          style.fontWeight,
          style.borderRadius,
          style.borderWidth,
          style.padding,
          Math.round(width),
          Math.round(height),
        ].join(' | ');
      })
    );

  expect(looks).toHaveLength(2);
  expect(looks[0]).toBe(looks[1]);
});

// WCAG 2.4.11: the open banner hides neither the focus, the page end nor the floating link.
test('an open ConsentBanner keeps the focus, the page end and the floating link above it', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await openStory(page, 'organisms-consentbanner--on-marketing-page', 'scheme:light');
  const banner = page.getByRole('region', { name: 'Cookies e privacidade' });
  const top = async () => (await banner.boundingBox())?.y ?? 0;
  const bannerHeight = Math.ceil((await banner.boundingBox())?.height ?? 0);

  expect(bannerHeight).toBeGreaterThan(0);
  expect(
    await page.evaluate(() => ({
      variable: document.documentElement.style.getPropertyValue('--consent-banner-height'),
      scrollPadding: getComputedStyle(document.documentElement).scrollPaddingBottom,
      pageEnd: getComputedStyle(document.body, '::after').height,
    }))
  ).toEqual({
    variable: `${String(bannerHeight)}px`,
    scrollPadding: `${String(bannerHeight)}px`,
    pageEnd: `${String(bannerHeight)}px`,
  });

  const floating = page.getByRole('link', { name: /WhatsApp/ });
  const floatingBox = await floating.boundingBox();
  expect((floatingBox?.y ?? 0) + (floatingBox?.height ?? 0)).toBeLessThanOrEqual(await top());

  const lastLink = page.getByRole('contentinfo').getByRole('link').last();
  await lastLink.focus();
  const focused = await lastLink.boundingBox();
  expect((focused?.y ?? 0) + (focused?.height ?? 0)).toBeLessThanOrEqual(await top());

  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  const note = await page.getByText('© 2026 Purpler').boundingBox();
  expect((note?.y ?? 0) + (note?.height ?? 0)).toBeLessThanOrEqual(await top());
});

test('the select takes Tab, opens with Enter, picks with the arrows and returns the focus', async ({
  page,
  browserName,
}) => {
  await openStory(page, 'molecules-select--with-form-field', 'scheme:light');
  const trigger = page.getByRole('combobox', { name: 'Categoria' });

  await page.keyboard.press(tabKey(browserName));
  await expect(trigger).toBeFocused();
  expect(await outlineOf(trigger)).toEqual({ style: 'solid', width: '2px' });
  await page.keyboard.press('Enter');
  const listbox = page.getByRole('listbox');
  await expect(page.getByRole('option', { name: 'Bolos' })).toBeFocused();
  await expect(page.getByRole('option', { name: 'Bebidas' })).toHaveAttribute(
    'aria-disabled',
    'true'
  );
  await page.keyboard.press(tabKey(browserName));
  expect(await focusedInside(page, '[role="listbox"]')).toBe(true);
  // Radix moves the highlight on a timer, so wait for it before Enter.
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'Doces' })).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(listbox).toBeHidden();
  await expect(trigger).toHaveText('Doces');
  await expect(trigger).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(listbox).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(listbox).toBeHidden();
  await expect(trigger).toHaveText('Doces');
  await expect(trigger).toBeFocused();
});

test('the select “all” option comes first and can be picked back', async ({ page }) => {
  await openStory(page, 'molecules-select--all-option', 'scheme:light');
  const trigger = page.getByRole('combobox', { name: 'Filtrar por categoria' });
  await expect(trigger).toHaveText('Todas as categorias');

  await trigger.click();
  await page.getByRole('option', { name: 'Salgados' }).click();
  await expect(trigger).toHaveText('Salgados');
  await trigger.click();
  await expect(page.getByRole('option').first()).toHaveText('Todas as categorias');
  await page.getByRole('option', { name: 'Todas as categorias' }).click();

  await expect(trigger).toHaveText('Todas as categorias');
});

for (const width of AXE_WIDTHS) {
  for (const scheme of SCHEMES) {
    test(`the open select in ${scheme} at ${String(width)}px fits the viewport with no WCAG violations`, async ({
      page,
    }, info) => {
      // Radix hides the page while the list is open; Tab stays in the list (test above), so axe checks the list.
      await page.setViewportSize({ width, height: 800 });
      await openStory(page, 'molecules-select--with-error', `scheme:${scheme}`);
      await page.getByRole('combobox', { name: 'Categoria' }).click();

      const listbox = page.getByRole('listbox');
      await expect(listbox).toBeVisible();
      const box = await listbox.boundingBox();
      expect((box?.x ?? -1) >= 0 && (box?.x ?? 0) + (box?.width ?? 0) <= width).toBe(true);
      await expect(page.locator('#storybook-root')).toHaveAttribute('aria-hidden', 'true');
      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .include('[role="listbox"]')
        .analyze();
      expect(results.violations.map(({ id }) => id)).toEqual([]);
      await page.screenshot({
        path: `test-results/screens/${info.project.name}/${String(width)}/${scheme}/select-open.png`,
      });
    });
  }
}
test('the image uploader takes files, shows the progress, retries and reorders by drag and keyboard', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openStory(page, 'organisms-imageuploader--simulated-upload', 'scheme:light');
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  await page.locator('input[type="file"]').setInputFiles([
    { name: 'bolo.png', mimeType: 'image/png', buffer: png },
    { name: 'erro.png', mimeType: 'image/png', buffer: png },
    { name: 'logo.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') },
  ]);

  await expect(page.getByRole('alert').filter({ hasText: 'logo.svg' })).toHaveText(
    'logo.svg: tipo não aceito. Envie JPEG, PNG ou WEBP.'
  );
  await expect(page.getByRole('progressbar', { name: 'Enviando imagem 1' })).toBeVisible();
  const retry = page.getByRole('button', { name: 'Tentar de novo: imagem 2' });
  await expect(retry).toBeVisible();
  await expect(page.getByRole('img', { name: 'Imagem 1' })).toBeVisible();
  await expectNoAxeViolations(page);

  const tiles = page.getByRole('listitem').filter({ has: page.getByRole('img') });
  await tiles.nth(1).dragTo(tiles.nth(0));
  await expect(page.getByRole('button', { name: 'Tentar de novo: imagem 1' })).toBeVisible();
  await expect(tiles.nth(0)).toContainText('Capa');

  const right = page.getByRole('button', { name: 'Mover imagem 1 para a direita' });
  await right.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Tentar de novo: imagem 2' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mover imagem 2 para a esquerda' })).toBeFocused();
  await expect(page.getByText('Imagem 1 movida para a posição 2 de 2.')).toBeAttached();

  await page.getByRole('button', { name: 'Tentar de novo: imagem 2' }).click();
  await expect(page.getByRole('progressbar', { name: 'Enviando imagem 2' })).toBeVisible();
});
test('the file uploader takes files, shows the progress, retries, reorders and removes', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openStory(page, 'organisms-fileuploader--simulated-upload', 'scheme:light');
  const video = Buffer.from('mp4');
  await page.locator('input[type="file"]').setInputFiles([
    { name: 'aula-1.mp4', mimeType: 'video/mp4', buffer: video },
    { name: 'aula-erro.mp4', mimeType: 'video/mp4', buffer: video },
    { name: 'apostila.zip', mimeType: 'application/zip', buffer: video },
  ]);

  await expect(page.getByRole('alert').filter({ hasText: 'apostila.zip' })).toHaveText(
    'apostila.zip: tipo não aceito. Envie MP4.'
  );
  await expect(page.getByRole('progressbar', { name: 'Enviando aula-1.mp4' })).toBeVisible();
  const retry = page.getByRole('button', { name: 'Tentar de novo: aula-erro.mp4' });
  await expect(retry).toBeVisible();
  await expect(
    page.getByText('Não conseguimos enviar. Tente de novo.', { exact: true })
  ).toBeVisible();
  await expect(page.getByText('Enviado', { exact: true })).toBeVisible();
  await expectNoAxeViolations(page);

  const rows = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('button', { name: /^Remover/ }) });
  await rows.nth(1).dragTo(rows.nth(0));
  await expect(rows.nth(0)).toContainText('aula-erro.mp4');

  await page.getByRole('button', { name: 'Mover aula-erro.mp4 para baixo' }).focus();
  await page.keyboard.press('Enter');
  await expect(rows.nth(1)).toContainText('aula-erro.mp4');
  await expect(page.getByRole('button', { name: 'Mover aula-erro.mp4 para cima' })).toBeFocused();
  await expect(
    page.getByText('Arquivo aula-erro.mp4 movido para a posição 2 de 2.')
  ).toBeAttached();

  await retry.click();
  await expect(page.getByRole('progressbar', { name: 'Enviando aula-erro.mp4' })).toBeVisible();
  await expect(page.getByText('Enviado', { exact: true })).toHaveCount(2);

  await page.getByRole('button', { name: 'Remover aula-1.mp4' }).click();
  await expect(rows).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Adicionar vídeos' })).toBeFocused();
  await page.screenshot({
    path: `test-results/screens/${info.project.name}/file-uploader-flow.png`,
  });
});
