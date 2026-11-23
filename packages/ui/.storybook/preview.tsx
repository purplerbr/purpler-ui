import type { Decorator, Preview } from '@storybook/react-vite';
import { STORE_THEME_PRESETS } from '@purplerbr/tokens';
import { PURPLER_BRAND, applyTheme, schemeOf } from './theme';
import './preview.css';

const withTheme: Decorator = (Story, context) => {
  applyTheme(schemeOf(context.globals.scheme), context.globals.store);
  return (
    <div className="min-h-full bg-background p-6 text-foreground">
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    scheme: {
      description: 'Tema claro ou escuro',
      toolbar: {
        title: 'Tema',
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Claro', icon: 'sun' },
          { value: 'dark', title: 'Escuro', icon: 'moon' },
        ],
      },
    },
    store: {
      description: 'Marca Purpler ou preset de tema de loja',
      toolbar: {
        title: 'Marca',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: PURPLER_BRAND, title: 'Purpler (marca)' },
          ...STORE_THEME_PRESETS.map((preset) => ({
            value: preset.id,
            title: `Loja · ${preset.name}`,
            right: preset.description,
          })),
        ],
      },
    },
  },
  initialGlobals: { scheme: 'light', store: PURPLER_BRAND },
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    controls: { expanded: true },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Fundamentos',
          [
            'Marca',
            'Cores',
            'Tipografia',
            'Espaçamento',
            'Raios e elevação',
            'Movimento',
            'Ícones',
            'Voz',
          ],
          'Atoms',
          'Molecules',
          'Organisms',
          'Templates',
        ],
      },
    },
  },
};

export default preview;
