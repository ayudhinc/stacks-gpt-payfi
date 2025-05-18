import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true // Enable PostCSS (for Tailwind)
  }),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: true
    }),
    prerender: {
      handleHttpError: () => {
        // Ignore all 404s during prerendering
        return;
      }
    }
  }
};

export default config;
