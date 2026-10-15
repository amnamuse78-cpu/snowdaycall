<template>
  <div class="container" style="padding-top:48px">
    <h1>School Closings Tomorrow 🔮</h1>
    <p style="color:var(--ice-400);max-width:720px">
      <strong>These are predictions, not official announcements.</strong>
      Tomorrow's closure odds for the districts we track — the number parents actually want at 9 PM.
      Always confirm with your district in the morning.
    </p>
    <table class="dir-table">
      <thead><tr><th>District</th><th>Closed</th><th>Delay</th><th>You'll likely know by</th><th></th></tr></thead>
      <tbody>
        <tr v-for="d in districts.filter(x=>x.indexed)" :key="d.slug">
          <td><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">{{ d.name }}</NuxtLink></td>
          <td><strong :style="{color: riskColor(live[d.slug]?.closed)}">{{ live[d.slug]?.closed ?? '–' }}%</strong></td>
          <td>{{ live[d.slug]?.delay ?? '–' }}%</td>
          <td>{{ live[d.slug]?.knowBy?.split('(')[0] ?? '–' }}</td>
          <td><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">Details →</NuxtLink></td>
        </tr>
      </tbody>
    </table>
    <p class="updated" v-if="updatedAt">Updated {{ updatedAt }}</p>
    <div class="card" style="margin-top:24px">
      <h3>🔔 Don't stay up refreshing</h3>
      <p>Get an email the moment your district's closure odds pass 70%. <NuxtLink to="/school-search/">Set up an alert →</NuxtLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { districts } from '~/data/locations';
useHead({
  title: 'School Closings Tomorrow — Will School Be Closed? | SnowDayCall',
  meta: [{ name: 'description', content: "Will school be closed tomorrow? Live closure predictions by district, announcement timing estimates and threshold alerts." }],
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
const riskColor = (v?: number) => v == null ? 'var(--ice-400)' : v >= 70 ? 'var(--red)' : v >= 40 ? 'var(--orange)' : 'var(--green)';
</script>
