import { copyFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  // One entry per component folder, so every component has its own subpath and no list to maintain.
  entry: ['src/index.ts', 'src/{atoms,molecules,organisms,templates}/*/index.ts'],
  format: ['esm'],
  target: 'es2022',
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: false,
  onSuccess: () => {
    copyFileSync('src/styles.css', 'dist/styles.css');
    return Promise.resolve();
  },
});
