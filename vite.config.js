import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
  plugins: [ svelte({ preprocess: sveltePreprocess() }) ],
  server: {
    open: '/test/index.html'
  },
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      name: 'LunaAnnotorious',
      formats: ['umd'],
      fileName: () => 'luna-annotorious.js'
    },
    rollupOptions: {
      external: ['openseadragon'],
      output: {
        assetFileNames: "luna-annotorious.[ext]"
      }
    }
  }
});