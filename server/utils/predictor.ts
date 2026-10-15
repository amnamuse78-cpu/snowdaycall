/**
 * SnowDayCall prediction engine v1 (TypeScript port).
 * Same model as engine/snowday.js — snowfall S-curve + timing, temperature,
 * wind, ice and NWS-alert adjustments. Every point is explainable.
 */

export interface EngineInputs {
  snowIn: number;
  snowEvening: number;
  snowOvernight: number;
  snowMorning: number;
  minTempF: number | null;
  maxWindMph: number;
  iceExpected: boolean;
  nwsAlert: 'warning' | 'watch' | 'advisory' | 'none';
  popMax: number;
}

export interface Factor {
  label: string;
  points: number;
  detail: string;
  base?: boolean;
}

export interface Prediction {
  closed: number;
  delay: number;
  normal: number;
  confidence: 'High' | 'Medium' | 'Lower';
  factors: Factor[];
  knowBy: string;
  modelVersion: string;
}

const mmToIn = (mm: number) => mm / 25.4;
const cToF = (c: number) => (c * 9) / 5 + 32;
const kmhToMph = (kmh: number) => kmh / 1.609344;

function baseFromSnow(inches: number): number {
  return Math.round(100 / (1 + Math.exp(-(inches - 3.5) * 0.75)));
}

/** Split a base closure probability into closed / delay / normal outcomes. */
function splitOutcomes(closed: number, inputs: EngineInputs): { delay: number; normal: number } {
  // Delay share grows in the marginal band (30-60%) and with morning snow.
  let delay = Math.round(
    Math.min(30, Math.max(4, closed * 0.35 * (inputs.snowMorning > 1 ? 1.3 : 1)))
  );
  if (closed > 85) delay = Math.round(delay * 0.4);
  if (closed < 15) delay = Math.min(delay, 8);
  const normal = Math.max(0, 100 - closed - delay);
  return { delay, normal };
}

export function scoreSnowDay(inputs: EngineInputs): Prediction {
  const factors: Factor[] = [];
  let closed = baseFromSnow(inputs.snowIn || 0);
  factors.push({
    label: 'Forecast snowfall',
    points: closed,
    detail: `${(inputs.snowIn || 0).toFixed(1)}" expected in the decision window`,
    base: true,
  });

  const { snowEvening = 0, snowOvernight = 0, snowMorning = 0 } = inputs;
  const heaviest =
    snowOvernight >= snowMorning && snowOvernight >= snowEvening
      ? 'overnight'
      : snowMorning >= snowEvening
        ? 'morning'
        : 'evening';
  if ((inputs.snowIn || 0) > 0.5) {
    if (heaviest === 'overnight') {
      closed += 8;
      factors.push({ label: 'Storm timing', points: 8, detail: 'Heaviest snow falls overnight, before plows finish routes' });
    } else if (heaviest === 'morning') {
      closed += 5;
      factors.push({ label: 'Storm timing', points: 5, detail: 'Snow during the morning commute window' });
    } else {
      closed -= 5;
      factors.push({ label: 'Storm timing', points: -5, detail: 'Most snow falls during the day, after decisions are made' });
    }
  }

  const t = inputs.minTempF;
  if (typeof t === 'number') {
    if (t <= 20) {
      closed += 8;
      factors.push({ label: 'Temperature', points: 8, detail: `Extreme cold (${Math.round(t)}°F) — salt barely works, roads stay icy` });
    } else if (t <= 28) {
      closed += 4;
      factors.push({ label: 'Temperature', points: 4, detail: `Cold (${Math.round(t)}°F) — refreeze risk overnight` });
    } else if (t > 34 && (inputs.snowIn || 0) > 0) {
      closed -= 12;
      factors.push({ label: 'Temperature', points: -12, detail: `Above freezing (${Math.round(t)}°F) — snow likely melts on roads` });
    }
  }

  const w = inputs.maxWindMph;
  if (w >= 35) {
    closed += 10;
    factors.push({ label: 'Wind', points: 10, detail: `Gusts near ${Math.round(w)} mph — blowing snow, possible whiteouts` });
  } else if (w >= 25) {
    closed += 5;
    factors.push({ label: 'Wind', points: 5, detail: `Windy (${Math.round(w)} mph) — drifting snow on rural routes` });
  }

  if (inputs.iceExpected) {
    closed += 22;
    factors.push({ label: 'Ice risk', points: 22, detail: 'Freezing rain/ice expected — districts close for ice faster than snow' });
  }

  const alertPts = { warning: 12, watch: 6, advisory: 3, none: 0 } as const;
  const aPts = alertPts[inputs.nwsAlert] ?? 0;
  if (aPts > 0) {
    closed += aPts;
    const names = { warning: 'Winter Storm Warning', watch: 'Winter Storm Watch', advisory: 'Winter Weather Advisory' } as const;
    factors.push({ label: 'NWS alert', points: aPts, detail: `${names[inputs.nwsAlert as 'warning' | 'watch' | 'advisory']} active — districts take this seriously` });
  }

  closed = Math.max(2, Math.min(97, Math.round(closed)));
  const { delay, normal } = splitOutcomes(closed, inputs);

  const pop = inputs.popMax ?? 0;
  const confidence: Prediction['confidence'] = pop >= 80 ? 'High' : pop >= 50 ? 'Medium' : 'Lower';

  let knowBy: string;
  if (inputs.nwsAlert === 'warning') knowBy = 'Districts often decide by 8–9pm tonight';
  else if (heaviest === 'overnight') knowBy = 'Most districts decide by 9–10pm tonight';
  else knowBy = 'Most districts decide by 5–6am tomorrow';
  knowBy += ' (estimate — the official call is always the district’s)';

  return { closed, delay, normal, confidence, factors, knowBy, modelVersion: 'v1' };
}

export function verdictLabel(closed: number): string {
  if (closed < 15) return 'Very unlikely';
  if (closed < 35) return 'Unlikely';
  if (closed < 55) return 'Toss-up';
  if (closed < 75) return 'Likely';
  return 'Very likely';
}

export { mmToIn, cToF, kmhToMph };
