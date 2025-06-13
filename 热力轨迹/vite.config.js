import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import sveltePreprocess from 'svelte-preprocess'
import { createHtmlPlugin } from 'vite-plugin-html'

const preprocess = sveltePreprocess({
  scss: {
    includePaths: ['src']
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({preprocess}), createHtmlPlugin()],
  base: './',
  resolve: {
    alias: { '@': resolve('src') }
  }
})
