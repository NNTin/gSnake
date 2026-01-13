import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Declare process to avoid TypeScript errors since @types/node is not installed
declare const process: { env: Record<string, string | undefined> }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: process.env.VITE_BASE_PATH || '/',
})