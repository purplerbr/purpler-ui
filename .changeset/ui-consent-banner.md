---
'@purplerbr/ui': minor
---

Add `ConsentBanner` (`@purplerbr/ui/consent-banner`): the cookie notice with a choice, fixed to the bottom of the page, a region named by its title, with the description, the privacy link and two buttons with the same weight ("Aceitar" by default, or "Ok", and "Recusar"). It does not block the page and moves the focus to its title only with `focusOnMount` (reopened from the footer). While open, it publishes its height in `--consent-banner-height` on `:root` (`CONSENT_BANNER_HEIGHT`): `styles.css` turns it into `scroll-padding-bottom` and a box after the page, and `FloatingContactLink` rises above the banner, so neither the keyboard focus nor the end of the page stays hidden under it. The app decides when to show it and what the choice does. `MarketingFooter` takes `action`, rendered after the links in the same nav, such as a "Gerenciar cookies" button.
