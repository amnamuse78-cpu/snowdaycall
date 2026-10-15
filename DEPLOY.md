# SnowDayCall — deploy guide (Cloudflare Workers)

Stack: Nuxt 3 (SSR) · TypeScript · Cloudflare Workers · D1 · KV · Cron Triggers · GitHub

## One-time setup (~15 minutes)

### 1. Cloudflare account
- Sign up at dash.cloudflare.com (free).
- Workers → create the resources below. All have generous free tiers.

### 2. Create D1 database
In Cloudflare dashboard: Workers & Pages → D1 → Create database → name it `snowdaycall`.
Then in a terminal with wrangler installed:
```bash
npx wrangler d1 execute snowdaycall --file=db/schema.sql --remote
npx wrangler d1 execute snowdaycall --remote --command "INSERT INTO states (code,name,slug) VALUES ('MA','Massachusetts','massachusetts'),('NY','New York','new-york'),('OH','Ohio','ohio'),('MI','Michigan','michigan'),('IL','Illinois','illinois'),('MN','Minnesota','minnesota')"
npx wrangler d1 execute snowdaycall --remote --command "INSERT INTO districts (name,state_code,slug,city_id,lat,lon,official_url,announce_policy,indexed) VALUES ('Boston Public Schools','MA','boston-public-schools',NULL,42.3601,-71.0589,'https://www.bostonpublicschools.org','Early morning',1),('Buffalo Public Schools','NY','buffalo-public-schools',NULL,42.8864,-78.8784,'https://www.buffaloschools.org','Early morning; lake-effect may trigger evening calls',1),('Cleveland Metropolitan School District','OH','cleveland-metropolitan-school-district',NULL,41.4993,-81.6944,'https://www.clevelandmetroschools.org','Early morning',1)"
```
Copy the database ID into `wrangler.jsonc` (`d1_databases[0].database_id`).

### 3. Create KV namespace
Workers & Pages → KV → Create namespace → name it `snowdaycall-cache`.
Copy the namespace ID into `wrangler.jsonc` (`kv_namespaces[0].id`).

### 4. Connect the GitHub repo
Workers & Pages → Create → Workers → **Import a repository** → select `snowdaycall`.
- Build command: `npm run build`
- The `wrangler.jsonc` in the repo wires D1, KV and the cron trigger automatically.

### 5. Custom domain
Workers → your worker → Settings → Domains & Routes → Add custom domain → `snowdaycall.com` (+ `www`).
Cloudflare issues SSL automatically. Point the domain's nameservers to Cloudflare (or add the DNS records Cloudflare shows you).

### 6. Cron trigger
Already declared in `wrangler.jsonc` (`0 */2 * * *` = every 2 hours).
During active storms, tighten it in the dashboard: Workers → Triggers → add `0 * * * *` (hourly) or `*/30 * * * *` (every 30 min). Loosen it back after the storm.

## What it costs
- Workers free: 100,000 requests/day. Paid ($5/mo): 10M requests/month included.
- D1 free: 5M row reads/day, 100K writes/day, 5 GB storage.
- KV free: 100K reads/day, 1K writes/day, 1 GB.
- Realistic bill at launch: **$0–5/month**. NWS weather data is free.

## After launch
1. Google Search Console → add property → submit `https://snowdaycall.com/sitemap.xml`.
2. Watch the 3 district pages for 4–8 weeks (CTR, time on page, alert signups) before expanding.
3. Morning outcome logging: when a district announces, record it in the `outcomes` table (dashboard or `wrangler d1 execute`) — that's the accuracy moat.
