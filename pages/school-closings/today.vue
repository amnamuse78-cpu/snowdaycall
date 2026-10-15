<template>
  <div class="container" style="padding-top:48px">
    <h1>School Closings Today 🏫</h1>
    <p style="color:var(--ice-400);max-width:720px">
      <strong>These are predictions, not official announcements.</strong>
      Below are today's closure odds for the districts we track, updated from live National Weather Service data.
      Always confirm with your district — <NuxtLink to="/disclaimer/">why we say this</NuxtLink>.
    </p>
    <table class="dir-table">
      <thead><tr><th>District</th><th>Closed</th><th>Delay</th><th>Official status</th><th></th></tr></thead>
      <tbody>
        <tr v-for="d in districts.filter(x=>x.indexed)" :key="d.slug">
          <td><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">{{ d.name }}</NuxtLink></td>
          <td><strong :style="{color: riskColor(live[d.slug]?.closed)}">{{ live[d.slug]?.closed ?? '–' }}%</strong></td>
          <td>{{ live[d.slug]?.delay ?? '–' }}%</td>
          <td>{{ official[d.slug] === 'pending' ? 'No announcement yet' : official[d.slug] }}</td>
          <td><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">Details →</NuxtLink></td>
        </tr>
      </tbody>
    </table>
    <p class="updated" v-if="updatedAt">Updated {{ updatedAt }}</p>
    <p style="color:var(--ice-600);font-size:.9rem;margin-top:24px">
      Looking for tomorrow? <NuxtLink to="/school-closings/tomorrow/">Tomorrow's predictions →</NuxtLink> ·
      Your district not listed? <NuxtLink to="/school-search/">Search it here →</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { districts } from '~/data/locations';
useHead({
  title: 'School Closings Today — Live Closure Predictions by District | SnowDayCall',
  meta: [{ name: 'description', content: "Today's school closing predictions by district — live closure and delay odds from National Weather Service data. Predictions, not official announcements." }],
});
const live = ref<Record<string, any>>({});
const official = ref<Record<string, string>>({});
const updatedAt = ref('');
onMounted(async () => {
  for (const d of districts.filter(x => x.indexed)) {
    try {
      const r: any = await $fetch(`/api/prediction/${d.slug}`);
      live.value[d.slug] = r;
      updatedAt.value = new Date(r.updatedAt).toLocaleTimeString();
    } catch {}
    try {
      const o: any = await $fetch(`/api/official-status/${d.slug}`);
      official.value[d.slug] = o.status;
    } catch { official.value[d.slug] = 'pending'; }
  }
});
const riskColor = (v?: number) => v == null ? 'var(--ice-400)' : v >= 70 ? 'var(--red)' : v >= 40 ? 'var(--orange)' : 'var(--green)';
</script>
