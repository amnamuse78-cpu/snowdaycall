/** POST /api/alerts — threshold alert signup. Writes to D1 when bound. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const { district, email, threshold } = body as { district?: string; email?: string; threshold?: number };
  if (!district || !email || !email.includes('@')) {
    throw createError({ statusCode: 400, message: 'district and valid email required' });
  }
  const db = (event.context as any).cloudflare?.env?.DB as D1Database | undefined;
  if (db) {
    await db
      .prepare(
        'INSERT OR IGNORE INTO alert_subscriptions (district_id, channel, address, threshold) VALUES ((SELECT id FROM districts WHERE slug = ?), ?, ?, ?)'
      )
      .bind(district, 'email', email.toLowerCase().trim(), threshold || 70)
      .run();
  }
  return { ok: true };
});
