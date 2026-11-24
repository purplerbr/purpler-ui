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
  'organisms-pricingcard--all-variants',
  'organisms-pricingtable--all-variants',
  'templates-marketinglayout--default',
  'templates-marketinglayout--not-found',
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
async function isCovered(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const link = document.querySelector('[data-slot="floating-contact-link"]');
    if (!link) return false;
    const { x, y, width, height } = link.getBoundingClientRect();
    return !link.contains(document.elementFromPoint(x + width / 2, y + height / 2));
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
for (const id of ['organisms-pricingtable--default', 'organisms-pricingcard--all-variants']) {
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
