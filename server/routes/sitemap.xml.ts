const BASE = 'https://snowdaycall.com';

/** GET /sitemap.xml — the 24 indexable URLs. Nothing else goes in Google's index. */
export default defineEventHandler((event) => {
  const routes = [
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
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((r) => `  <url><loc>${BASE}${r}</loc><changefreq>daily</changefreq></url>`)
    .join('\n')}\n</urlset>`;
  setHeader(event, 'Content-Type', 'application/xml');
  return xml;
});
