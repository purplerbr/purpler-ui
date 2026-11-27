---
'@purplerbr/ui': minor
---

Add `ConsentBanner` (`@purplerbr/ui/consent-banner`): the cookie notice with a choice, fixed to the bottom of the page, a region named by its title, with the description, the privacy link and two buttons with the same weight ("Aceitar" by default, or "Ok", and "Recusar"). It does not block the page and moves the focus to its title only with `focusOnMount` (reopened from the footer). The app decides when to show it and what the choice does. `MarketingFooter` takes `action`, rendered after the links in the same nav, such as a "Gerenciar cookies" button.
