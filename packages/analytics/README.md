# @purplerbr/analytics

GA4 e Meta Pixel da Purpler, com eventos tipados e a escolha do visitante. Sem dependências e sem React: o banner é o `ConsentBanner` da `@purplerbr/ui`. Decisão e limites na ADR 0015 do repositório de coordenação.

## Instalação

O pacote fica no GitHub Packages. Veja o [README do repositório](https://github.com/purplerbr/purpler-ui#consumo) para configurar o `.yarnrc.yml`.

```sh
yarn add @purplerbr/analytics@0.1.0
```

## Uso

```ts
import { createAnalytics } from '@purplerbr/analytics';

export const analytics = createAnalytics({
  hosts: ['purpler.com.br'],
  ga4Id: 'G-XXXXXXXXXX',
  metaPixelId: '0000000000000000',
});

analytics.start(); // depois de montar a página
analytics.track('page_view', { title: document.title });
```

- **Hosts:** fora da lista exata de `hosts`, nada carrega, nada é gravado e o `track` não faz nada. `isEnabled()` diz se o banner deve aparecer.
- **Carga:** `start()` injeta `https://www.googletagmanager.com/gtag/js?id=…` e `https://connect.facebook.net/en_US/fbevents.js` com o nonce da página, a menos que o visitante tenha recusado (ou o navegador mande o Global Privacy Control); nesse caso, apaga os cookies que tenham sobrado. O bootstrap (`dataLayer`, `gtag`, o stub do `fbq`) vem no bundle, sem script inline. Sem `metaPixelId`, o Pixel nunca inicia.
- **Forçado no código:** no GA4, Consent Mode com `ad_storage`, `ad_user_data` e `ad_personalization` sempre `denied`, `allow_google_signals: false`, `allow_ad_personalization_signals: false`, `cookie_domain: 'none'`, `cookie_flags: 'SameSite=Lax;Secure'` e `cookie_expires` de 13 meses; no Pixel, `autoConfig` desligado antes do `init` e nenhum dado no terceiro argumento do `init`.
- **Escolha:** `grant()` grava o "Ok" do aviso; `deny()` grava a recusa, manda `consent update`/`revoke`, apaga `_ga*`, `_fbp` e `_fbc` no host e nos domínios pai e recarrega a página que rodou as tags. A escolha fica no `localStorage` com `CONSENT_VERSION`: subir a versão pergunta de novo.
- **Eventos:** `track(nome, parâmetros)` só aceita o mapa de `AnalyticsEvents`; `toGa4` e `toPixel` mostram a tradução. Preço em centavos inteiros. Nunca ponha dado pessoal nos parâmetros (e-mail, nome, telefone, CPF, nem em hash).
