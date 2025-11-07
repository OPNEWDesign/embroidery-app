import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // <- this ensures assets load correctly on Vercel
  plugins: [react()],
});
