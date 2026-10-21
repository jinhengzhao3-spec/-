import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this project under /-/; keep local preview at the root.
  base: process.env.GITHUB_PAGES === 'true' ? '/-/' : '/',
});
