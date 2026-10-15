<template>
  <div class="container" style="padding-top:48px">
    <h1>Snow Day Map 🗺️</h1>
    <p style="color:var(--ice-400);max-width:720px">
      Every district we track, color-coded by closure probability. Green means sleep easy — red means set two alarms.
      The full interactive storm map (all 50 states) arrives in January.
    </p>
    <table class="dir-table">
      <thead><tr><th>District</th><th>City</th><th>Closed</th><th>Delay</th><th>Risk</th></tr></thead>
      <tbody>
        <tr v-for="d in districts.filter(x=>x.indexed)" :key="d.slug">
          <td><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">{{ d.name }}</NuxtLink></td>
          <td>{{ cityOf(d) }}</td>
          <td><strong :style="{color: riskColor(live[d.slug]?.closed)}">{{ live[d.slug]?.closed ?? '–' }}%</strong></td>
          <td>{{ live[d.slug]?.delay ?? '–' }}%</td>
          <td><span class="tag" :style="tagStyle(live[d.slug]?.closed)">{{ riskLabel(live[d.slug]?.closed) }}</span></td>
        </tr>
      </tbody>
    </table>
    <p class="updated" v-if="updatedAt">Updated {{ updatedAt }} · National Weather Service data</p>
  </div>
</template>

<script setup lang="ts">
import { districts, cities } from '~/data/locations';
useHead({
  title: 'Snow Day Map — Live Closure Risk by District | SnowDayCall',
  meta: [{ name: 'description', content: 'Live snow-day risk map: closure probabilities by school district, updated from National Weather Service data.' }],
});
const live = ref<Record<string, any>>({});
const updatedAt = ref('');
onMounted(async () => {
  for (const d of districts.filter(x => x.indexed)) {
    try {
      const r: any = await $fetch(`/api/prediction/${d.slug}`);
      live.value[d.slug] = r;
      updatedAt.value = new Date(r.updatedAt).toLocaleTimeString();
    } catch {}
  }
});
const cityOf = (d: any) => cities.find(c => c.slug === d.citySlug)?.name ?? '';
const riskColor = (v?: number) => v == null ? 'var(--ice-400)' : v >= 70 ? 'var(--red)' : v >= 40 ? 'var(--orange)' : 'var(--green)';
const riskLabel = (v?: number) => v == null ? '…' : v >= 70 ? 'High' : v >= 40 ? 'Watch' : 'Low';
const tagStyle = (v?: number) => v != null && v >= 70 ? 'background:rgba(255,107,107,.15);color:var(--red);border:1px solid var(--red)' : v != null && v >= 40 ? 'background:rgba(255,169,77,.15);color:var(--orange);border:1px solid var(--orange)' : '';
</script>
