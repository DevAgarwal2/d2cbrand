// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';


import netlify from '@astrojs/netlify';


// https://astro.build/config
export default defineConfig({
  site: 'https://www.shreeyamhandicraft.com',
  output: 'server',
  integrations: [tailwind(), react(), sitemap()],
  adapter: netlify()
});