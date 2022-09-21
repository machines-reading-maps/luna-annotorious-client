import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

import path from 'path';

export default defineConfig({
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    }
  },
  plugins: [
    svelte({ preprocess: sveltePreprocess() }), 
    splitVendorChunkPlugin()
  ],
  server: {
    open: '/',
    proxy: {
      '/api': 'http://localhost'
      // '/api': {
      //   target: 'http://localhost:3000',
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // }
    }
  },
  build: {
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          vendor: ['openseadragon', 'pixi.js', 'yjs', 'nanoid', 'deep-equal']
        }
      }
    }
  }
})