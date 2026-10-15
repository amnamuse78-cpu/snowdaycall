import { districts } from '~/data/locations';
import { predictFor } from '../utils/weather';

/**
 * Cloudflare Cron Trigger handler (wrangler: triggers.crons).
 * Refreshes predictions for indexed districts and warms the KV cache,
 * so visitors always get a fast, recent number.
 *
 * Cadence lives in wrangler.jsonc. Phase 2: storm-aware cadence
 * (30–60 min when a warning is active) via a second trigger.
 */
export default defineNitroPlugin((nitroApp) => {
  // @ts-ignore — cloudflare:scheduled is only present on Workers
  nitroApp.hooks.hook('cloudflare:scheduled', async (event: any) => {
    const kv = event.context?.env?.CACHE as KVNamespace | undefined;
    const db = event.context?.env?.DB as D1Database | undefined;
    const today = new Date().toISOString().slice(0, 10);

    for (const d of districts.filter((x) => x.indexed)) {
      try {
        const result = await predictFor(d.lat, d.lon);
        const payload = { district: d.name, slug: d.slug, ...result };
        if (kv) await kv.put(`pred:${d.slug}:${today}`, JSON.stringify(payload), { expirationTtl: 7200 });
        if (db) {
          await db
            .prepare(
              'INSERT INTO predictions (district_id, forecast_date, closed_probability, delay_probability, normal_probability, confidence, model_version, weather_snapshot) VALUES ((SELECT id FROM districts WHERE slug = ?), ?, ?, ?, ?, ?, ?, ?)'
            )
            .bind(d.slug, today, result.closed, result.delay, result.normal, result.confidence, result.modelVersion, JSON.stringify(result.inputs))
            .run();
        }
      } catch (e) {
        console.error(`cron: prediction failed for ${d.slug}`, e);
      }
    }
  });
});
