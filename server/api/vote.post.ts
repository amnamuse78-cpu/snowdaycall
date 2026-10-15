/** POST /api/vote — community prediction vote. Writes to D1 when bound. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const { district, vote } = body as { district?: string; vote?: string };
  if (!district || !['closed', 'delay', 'normal'].includes(vote || '')) {
    throw createError({ statusCode: 400, message: 'district and vote required' });
  }
  const db = (event.context as any).cloudflare?.env?.DB as D1Database | undefined;
  if (db) {
    const today = new Date().toISOString().slice(0, 10);
    await db
      .prepare('INSERT INTO community_votes (district_id, forecast_date, vote) VALUES ((SELECT id FROM districts WHERE slug = ?), ?, ?)')
      .bind(district, today, vote)
      .run();
  }
  return { ok: true };
});
