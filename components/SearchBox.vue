<template>
  <div class="search-wrap">
    <div class="search-box">
      <input
        v-model="query"
        @input="onInput"
        @keydown.enter="goFirst"
        type="text"
        placeholder="Find your school — try a school, district, city or ZIP"
        aria-label="Search for your school, district, city or ZIP code"
      />
      <button class="btn-gold" @click="goFirst">Check</button>
    </div>
    <div v-if="results.length" class="suggestions">
      <button v-for="r in results" :key="r.url" @click="navigateTo(r.url)">
        <span class="kind">{{ r.kind }}</span>{{ r.label }}
      </button>
    </div>
    <p class="search-hint">Example: Lincoln Elementary School · Boston Public Schools · Buffalo · 14201</p>
  </div>
</template>

<script setup lang="ts">
import { districts, cities } from '~/data/locations';

const query = ref('');
const results = ref<{ kind: string; label: string; url: string }[]>([]);

function onInput() {
  const q = query.value.trim().toLowerCase();
  if (q.length < 2) {
    results.value = [];
    return;
  }
  const out: { kind: string; label: string; url: string }[] = [];
  for (const d of districts) {
    if (d.name.toLowerCase().includes(q) || d.slug.replace(/-/g, ' ').includes(q)) {
      out.push({ kind: 'District', label: d.name, url: `/districts/${d.stateSlug}/${d.slug}/` });
    }
  }
  for (const c of cities) {
    if (c.name.toLowerCase().includes(q) || c.slug.includes(q)) {
      out.push({ kind: 'City', label: `${c.name}, ${c.stateCode}`, url: `/snow-day-calculator/${c.slug}/` });
    }
  }
  // ZIP pattern → route to school search
  if (/^\d{5}$/.test(query.value.trim())) {
    out.unshift({ kind: 'ZIP', label: `${query.value.trim()} — see predictions`, url: `/school-search/?q=${query.value.trim()}` });
  }
  results.value = out.slice(0, 6);
}

function goFirst() {
  if (results.value.length) navigateTo(results.value[0].url);
  else if (query.value.trim()) navigateTo(`/school-search/?q=${encodeURIComponent(query.value.trim())}`);
}
</script>
