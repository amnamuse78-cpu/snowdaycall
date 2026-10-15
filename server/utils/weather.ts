import { scoreSnowDay, type EngineInputs } from '../utils/predictor';

const UA = 'SnowDayCall/1.0 (snowdaycall.com)';

async function nws(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/geo+json' } });
  if (!res.ok) throw new Error(`NWS ${res.status}`);
  return res.json();
}

interface NwsVal { validTime: string; value: number | null }

function parseValidTime(vt: string) {
  const [start, dur = ''] = vt.split('/');
  const m = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/.exec(dur);
  const hours = parseInt(m?.[1] || '0') * 24 + parseInt(m?.[2] || '0') + parseInt(m?.[3] || '0') / 60;
  return { start: new Date(start), hours: hours || 1 };
}

export async function fetchDistrictInputs(lat: number, lon: number): Promise<EngineInputs & { zone: string }> {
  const points = await nws(`https://api.weather.gov/points/${lat},${lon}`);
  const props = points.properties;
  const grid = await nws(props.forecastGridData);
  const zone: string = (props.forecastZone || '').split('/').pop() || '';
  let alert: EngineInputs['nwsAlert'] = 'none';
  try {
    const alerts = await nws(`https://api.weather.gov/alerts/active?zone=${zone}`);
    for (const f of alerts.features || []) {
      const ev = (f.properties?.event || '').toLowerCase();
      if (/blizzard warning|winter storm warning|ice storm warning/.test(ev)) { alert = 'warning'; break; }
      if (/winter storm watch/.test(ev)) alert = 'watch';
      else if (/winter weather advisory|wind chill/.test(ev) && alert === 'none') alert = 'advisory';
    }
  } catch { /* alerts optional */ }

  const g = grid.properties || {};
  const mmToIn = (mm: number) => mm / 25.4;
  const cToF = (c: number) => (c * 9) / 5 + 32;
  const kmhToMph = (k: number) => k / 1.609344;

  // Decision window: today 6pm → tomorrow 10am local (approx via first temp offset)
  const snow: NwsVal[] = g.snowfallAmount?.values || [];
  const temp: NwsVal[] = g.temperature?.values || [];
  const wind: NwsVal[] = g.windSpeed?.values || [];
  const gust: NwsVal[] = g.windGust?.values || [];
  const pop: NwsVal[] = g.probabilityOfPrecipitation?.values || [];
  const weather: any[] = g.weather?.values || [];

  // Simple approach: take values from "now" through +40h as the decision window.
  const now = Date.now();
  const end = now + 40 * 3600 * 1000;
  const inWin = (vt: string) => {
    const { start } = parseValidTime(vt);
    return start.getTime() >= now - 6 * 3600 * 1000 && start.getTime() <= end;
  };

  let snowIn = 0;
  for (const v of snow) if (v.value != null && inWin(v.validTime)) snowIn += mmToIn(v.value);
  let minTempF: number | null = null;
  for (const v of temp) if (v.value != null && inWin(v.validTime)) { const f = cToF(v.value); minTempF = minTempF == null ? f : Math.min(minTempF, f); }
  let maxWindMph = 0;
  for (const v of [...wind, ...gust]) if (v.value != null && inWin(v.validTime)) maxWindMph = Math.max(maxWindMph, kmhToMph(v.value));
  let popMax = 0;
  for (const v of pop) if (v.value != null && inWin(v.validTime)) popMax = Math.max(popMax, v.value);

  let iceExpected = false;
  outer: for (const v of weather) {
    if (!v.value || !inWin(v.validTime)) continue;
    for (const w of v.value) {
      const s = JSON.stringify(w).toLowerCase();
      if (s.includes('freezing') || s.includes('sleet') || (s.includes('ice') && s.includes('rain'))) { iceExpected = true; break outer; }
    }
  }

  return {
    snowIn: Math.round(snowIn * 10) / 10,
    snowEvening: 0, snowOvernight: Math.round(snowIn * 10) / 10, snowMorning: 0,
    minTempF: minTempF == null ? null : Math.round(minTempF),
    maxWindMph: Math.round(maxWindMph),
    iceExpected,
    nwsAlert: alert,
    popMax: Math.round(popMax),
    zone,
  };
}

export async function predictFor(lat: number, lon: number) {
  const inputs = await fetchDistrictInputs(lat, lon);
  return { inputs, ...scoreSnowDay(inputs), updatedAt: new Date().toISOString() };
}
