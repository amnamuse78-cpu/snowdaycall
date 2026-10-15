// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'SnowDayCall — Will School Be Closed Tomorrow?',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'SnowDayCall predicts school closures, delays and remote days by school district using live National Weather Service data. Don’t predict the snow — predict the superintendent.',
        },
        { name: 'theme-color', content: '#0b1026' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  css: ['~/assets/main.css'],

  nitro: {
    preset: 'cloudflare_module',
    prerender: {
      crawlLinks: false,
      routes: [
        '/',
        '/school-search/',
        '/school-closings/today/',
        '/school-closings/tomorrow/',
        '/school-delay-predictor/',
        '/snow-day-map/',
        '/accuracy/',
        '/how-it-works/',
        '/school-closings/new-york/',
        '/school-closings/michigan/',
        '/school-closings/ohio/',
        '/school-closings/massachusetts/',
        '/snow-day-calculator/boston-ma/',
        '/snow-day-calculator/buffalo-ny/',
        '/snow-day-calculator/chicago-il/',
        '/snow-day-calculator/detroit-mi/',
        '/snow-day-calculator/cleveland-oh/',
        '/snow-day-calculator/minneapolis-mn/',
        '/districts/massachusetts/boston-public-schools/',
        '/districts/new-york/buffalo-public-schools/',
        '/districts/ohio/cleveland-metropolitan-school-district/',
        '/guides/how-much-snow-does-it-take-to-cancel-school/',
        '/guides/how-do-schools-decide-snow-days/',
        '/guides/when-do-schools-announce-snow-days/',
        '/privacy/',
        '/terms/',
        '/contact/',
        '/disclaimer/',
      ],
    },
  },

  routeRules: {
    // SEO pages: cached SSR so Google always gets full HTML
    '/': { isr: 3600 },
    '/school-closings/**': { isr: 1800 },
    '/snow-day-calculator/**': { isr: 1800 },
    '/districts/**': { isr: 1800 },
    // Guides: static, rarely change
    '/guides/**': { static: true },
    // Tool pages: dynamic
    '/school-search': { ssr: true },
    // API: never cached at the edge blindly (KV handles it)
    '/api/**': { cors: true },
  },
});
