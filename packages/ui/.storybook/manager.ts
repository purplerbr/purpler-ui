import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Purpler UI',
    brandImage: './brand/logo-cor-claro.svg',
    brandTarget: '_self',
  }),
});
