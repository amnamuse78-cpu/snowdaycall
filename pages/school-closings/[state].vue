<template>
  <div class="container" style="padding-top:48px" v-if="state">
    <p style="color:var(--ice-600);font-size:.85rem"><NuxtLink to="/">Home</NuxtLink> · School closings</p>
    <h1>{{ state.name }} School Closings ❄️</h1>
    <p style="color:var(--ice-400);max-width:720px">{{ state.blurb }}</p>

    <section class="section" style="padding:24px 0">
      <h2>Highest snow-day risk right now</h2>
      <p class="lead">Live district predictions across {{ state.name }}.</p>
      <table class="dir-table">
        <thead><tr><th>District</th><th>Closed</th><th>Delay</th><th></th></tr></thead>
        <tbody>
          <tr v-for="d in stateDistricts" :key="d.slug">
            <td><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">{{ d.name }}</NuxtLink></td>
            <td><strong :style="{color: riskColor(live[d.slug]?.closed)}">{{ live[d.slug]?.closed ?? '–' }}%</strong></td>
            <td>{{ live[d.slug]?.delay ?? '–' }}%</td>
            <td><span class="tag" v-if="live[d.slug]">Live</span><span class="tag" v-else>…</span></td>
          </tr>
        </tbody>
      </table>
      <p class="updated" v-if="updatedAt">Updated {{ updatedAt }}</p>
    </section>

    <section class="section" style="padding-top:0">
      <h2>Cities we track in {{ state.name }}</h2>
      <div class="cards">
        <div class="card" v-for="c in stateCities" :key="c.slug">
          <h3><NuxtLink :to="`/snow-day-calculator/${c.slug}/`">{{ c.name }} snow day</NuxtLink></h3>
          <p>{{ c.blurb.slice(0, 120) }}…</p>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <h2>How {{ state.name }} districts decide</h2>
      <p style="color:var(--ice-200);line-height:1.75;max-width:720px">
        Every district in {{ state.name }} makes its own call — usually between 5:00 and 6:30 in the morning,
        sometimes the evening before a major storm. Superintendents weigh overnight snowfall, road conditions,
        temperature and timing. That is why two neighboring districts can reach different decisions on the same morning.
        <NuxtLink to="/guides/how-do-schools-decide-snow-days/">Learn how the decision works</NuxtLink>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { states, cities, districts } from '~/data/locations';
const route = useRoute();
const state = computed(() => states.find(s => s.slug === route.params.state));
if (!state.value) throw createError({ statusCode: 404, message: 'State not found' });

useHead({
  title: `${state.value.name} School Closings & Snow Day Forecast | SnowDayCall`,
  meta: [{ name: 'description', content: `Live ${state.value.name} school closing predictions by district — closure odds, delays and announcement timing from National Weather Service data.` }],
});

const stateCities = computed(() => cities.filter(c => state.value!.cities.includes(c.slug)));
const stateDistricts = computed(() => districts.filter(d => d.stateSlug === state.value!.slug));
const live = ref<Record<string, { closed: number; delay: number }>>({});
const updatedAt = ref('');

onMounted(async () => {
  for (const d of stateDistricts.value) {
    try {
      const r = await $fetch<{ closed: number; delay: number; updatedAt: string }>(`/api/prediction/${d.slug}`);
      live.value[d.slug] = r;
      updatedAt.value = new Date(r.updatedAt).toLocaleTimeString();
    } catch { /* show dashes */ }
  }
});

const riskColor = (v?: number) => v == null ? 'var(--ice-400)' : v >= 70 ? 'var(--red)' : v >= 40 ? 'var(--orange)' : 'var(--green)';
</script>
