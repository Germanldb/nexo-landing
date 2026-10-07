import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  vite: {
    server: {
      proxy: {
        // Doc API: Vercel serverless en producción; en local usar `vercel dev` o dejar DOC_API_PASSWORD vacío.
        '/api/doc': {
          target: 'http://127.0.0.1:3099',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/doc/, '/doc'),
        },
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  },
});
