import { districts, cities } from '~/data/locations';

/** GET /api/search?q= — schools, districts, cities, ZIPs. D1-backed at scale; data-file now. */
export default defineEventHandler(async (event) => {
  const q = (getQuery(event).q as string || '').trim().toLowerCase();
  if (q.length < 2) return { results: [] };
  const results: { kind: string; label: string; sub: string; url: string }[] = [];

  for (const d of districts) {
    if (d.name.toLowerCase().includes(q)) {
      results.push({ kind: 'District', label: d.name, sub: `${d.stateCode} · ≈${d.students} students`, url: `/districts/${d.stateSlug}/${d.slug}/` });
    }
  }
  for (const c of cities) {
    if (c.name.toLowerCase().includes(q)) {
      results.push({ kind: 'City', label: `${c.name}, ${c.stateCode}`, sub: 'City snow-day outlook', url: `/snow-day-calculator/${c.slug}/` });
    }
  }
  // TODO Phase 2: query D1 schools table for school-name matches (100k+ schools, not indexed).
  return { results: results.slice(0, 10) };
});
