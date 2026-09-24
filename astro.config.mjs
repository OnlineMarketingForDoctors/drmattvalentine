import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://drmattvalentine.com.au',
  // Every internal URL ends in a slash. Astro then serves /about/ and
  // redirects /about to it, so there is one canonical form per page.
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto', format: 'directory' },
});
