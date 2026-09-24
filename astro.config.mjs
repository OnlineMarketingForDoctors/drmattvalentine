import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';

// Vercel reads no .env from the repo, so the public values default here.
// Either can still be overridden by a PUBLIC_SANITY_* environment variable.
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

export default defineConfig({
  site: 'https://drmattvalentine.com.au',
  // Every internal URL ends in a slash. Astro then serves /about/ and
  // redirects /about to it, so there is one canonical form per page.
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto', format: 'directory' },
  integrations: [
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID || 'p6evl32l',
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2025-01-01',
      useCdn: false, // a static build must not bake in stale CDN content
    }),
  ],
});
