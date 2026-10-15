<template>
  <div class="container" style="padding-top:48px;max-width:760px">
    <h1>Find My School ❄️</h1>
    <p style="color:var(--ice-400)">Search any school, district, city or ZIP code. We match it to the district that makes the call — then show you that district's prediction.</p>
    <SearchBox />
    <div v-if="q" style="margin-top:24px">
      <h2 style="font-size:1.2rem">Results for “{{ q }}”</h2>
      <div v-if="loading" style="color:var(--ice-400)">Searching…</div>
      <div v-else-if="results.length === 0" style="color:var(--ice-400)">No matches yet — try a district or city name. The full 100,000+ school database lands in phase 2.</div>
      <div class="cards" style="margin-top:12px">
        <div class="card" v-for="r in results" :key="r.url">
          <h3><NuxtLink :to="r.url">{{ r.label }}</NuxtLink></h3>
          <p><span class="tag">{{ r.kind }}</span> {{ r.sub }}</p>
        </div>
      </div>
    </div>
    <div style="margin-top:40px">
      <h2 style="font-size:1.2rem">Popular right now</h2>
      <div class="cards">
        <div class="card" v-for="d in districts.filter(x=>x.indexed)" :key="d.slug">
          <h3><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">{{ d.name }}</NuxtLink></h3>
          <p>{{ d.stateCode }} · {{ d.students }} students</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { districts } from '~/data/locations';
useHead({ title: 'Find My School — School Snow Day Checker | SnowDayCall' });
const route = useRoute();
const q = computed(() => (route.query.q as string) || '');
const results = ref<any[]>([]);
const loading = ref(false);
watch(q, async (v) => {
  if (!v) { results.value = []; return; }
  loading.value = true;
  try {
    const r = await $fetch<{ results: any[] }>('/api/search', { query: { q: v } });
    results.value = r.results;
  } catch { results.value = []; }
  loading.value = false;
}, { immediate: true });
</script>
