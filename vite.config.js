import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

import path from 'path';

export default defineConfig({
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    },
  },
  plugins: [
    svelte({ preprocess: sveltePreprocess() }), 
    splitVendorChunkPlugin()
  ],
  server: {
    open: '/public/index.html',
    proxy: {
      '/api': 'http://localhost'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['openseadragon', 'pixi.js']
        }
      }
    }
  }
})