import { districts } from '~/data/locations';
import { predictFor } from '../../utils/weather';

/**
 * GET /api/prediction/:district — live district prediction.
 * KV-cached (30 min storm / 2 hr normal). Falls back to fresh compute.
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'district') || '';
  const district = districts.find((d) => d.slug === slug);
  if (!district) throw createError({ statusCode: 404, message: 'District not found' });

  const cacheKey = `pred:${slug}:${new Date().toISOString().slice(0, 10)}`;
  const kv = (event.context as any).cloudflare?.env?.CACHE as KVNamespace | undefined;

  if (kv) {
    try {
      const cached = await kv.get(cacheKey, 'json');
      if (cached) return { ...cached, cached: true };
    } catch { /* fall through */ }
  }

  try {
    const result = await predictFor(district.lat, district.lon);
    const payload = { district: district.name, slug, ...result, cached: false };
    if (kv) {
      try { await kv.put(cacheKey, JSON.stringify(payload), { expirationTtl: 1800 }); } catch { /* non-fatal */ }
    }
    return payload;
  } catch (e) {
    throw createError({ statusCode: 502, message: 'Weather data temporarily unavailable' });
  }
});
