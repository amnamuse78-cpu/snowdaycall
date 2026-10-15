/**
 * GET /api/official-status/:district — the district's actual announced status.
 * v1: always 'pending' until the outcome-reporting pipeline is live.
 * The morning-mode verdict plugs in here (community reports + manual logging).
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'district') || '';
  const db = (event.context as any).cloudflare?.env?.DB as D1Database | undefined;
  if (db) {
    const today = new Date().toISOString().slice(0, 10);
    const row = await db
      .prepare('SELECT actual_status, announcement_time, official_source FROM outcomes WHERE district_id = (SELECT id FROM districts WHERE slug = ?) AND date = ?')
      .bind(slug, today)
      .first<{ actual_status: string; announcement_time: string | null; official_source: string | null }>();
    if (row) return { status: row.actual_status, announcedAt: row.announcement_time, source: row.official_source };
  }
  return { status: 'pending', announcedAt: null, source: null };
});
