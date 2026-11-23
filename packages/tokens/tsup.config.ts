import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'tsup';
import { renderFontsCss, renderThemeCss, renderTokensCss } from './src/css';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2022',
  platform: 'neutral',
  dts: true,
  clean: true,
  sourcemap: false,
  onSuccess: () => {
    mkdirSync('dist', { recursive: true });
    writeFileSync('dist/tokens.css', renderTokensCss());
    writeFileSync('dist/theme.css', renderThemeCss());
    writeFileSync('dist/fonts.css', renderFontsCss());
    cpSync('fonts', 'dist/fonts', { recursive: true });
    return Promise.resolve();
  },
});
