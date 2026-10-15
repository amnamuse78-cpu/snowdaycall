<template>
  <div class="container" style="padding-top:48px;max-width:820px">
    <h1>School Delay Predictor ⏰</h1>
    <p style="color:var(--ice-400)">
      The 2-hour delay is the most common surprise of winter — not closed, not normal, just… late.
      Districts use delays when roads need a few more hours: refreeze, light overnight snow, or extreme cold that lifts by 9 AM.
    </p>
    <div class="cards" style="margin:24px 0">
      <div class="card" v-for="d in districts.filter(x=>x.indexed)" :key="d.slug">
        <h3><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">{{ d.shortName }}</NuxtLink></h3>
        <div class="risk" :style="{color: riskColor(live[d.slug]?.delay)}">{{ live[d.slug]?.delay ?? '–' }}%</div>
        <p>chance of a 2-hour delay tomorrow</p>
      </div>
    </div>
    <h2>When do districts choose a delay instead of closing?</h2>
    <div class="card" style="margin-bottom:12px" v-for="s in scenarios" :key="s.t">
      <h3>{{ s.t }}</h3><p>{{ s.d }}</p>
    </div>
    <p style="margin-top:24px"><NuxtLink to="/school-search/">Check your district's delay odds →</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { districts } from '~/data/locations';
useHead({
  title: 'School Delay Predictor — 2-Hour Delay Odds by District | SnowDayCall',
  meta: [{ name: 'description', content: 'Will school be delayed tomorrow? Live 2-hour delay predictions by district, plus when districts choose delays over closures.' }],
});
const live = ref<Record<string, any>>({});
onMounted(async () => {
  for (const d of districts.filter(x => x.indexed)) {
    try { live.value[d.slug] = await $fetch(`/api/prediction/${d.slug}`); } catch {}
  }
});
const riskColor = (v?: number) => v == null ? 'var(--ice-400)' : v >= 40 ? 'var(--orange)' : 'var(--green)';
const scenarios = [
  { t: '🌡️ Overnight refreeze', d: 'Wet roads freeze after midnight. By 9 AM the sun has done the plows’ job — so school starts late instead of canceling.' },
  { t: '❄️ Light overnight snow (1–3")', d: 'Enough to slow buses, not enough to justify a full closure. The classic delay scenario.' },
  { t: '🥶 Extreme morning cold', d: 'Wind chills below thresholds at 6 AM often lift by mid-morning. Districts delay rather than lose the whole day.' },
  { t: '🌅 Storm ending at dawn', d: 'Snow stops at 5 AM but roads aren’t clear yet. Two extra hours lets plows finish the routes.' },
];
</script>
