<template>
  <div>
    <section class="hero">
      <div class="container">
        <h1>Will You Have a <span class="gold">Snow Day</span> Tomorrow? ❄️</h1>
        <p class="sub">Search your school, district, city or ZIP code — we predict the district's decision, not just the snow.</p>
        <SearchBox />
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>How it works</h2>
        <p class="lead">Three steps. No account needed.</p>
        <div class="cards">
          <div class="card"><h3>1. Find your district</h3><p>Search any school, district, city or ZIP. We match it to the district that actually makes the call.</p></div>
          <div class="card"><h3>2. See the odds</h3><p>Live National Weather Service data runs through our model: snowfall, timing, ice, wind, temperature and alerts.</p></div>
          <div class="card"><h3>3. Compare &amp; verify</h3><p>See what the community thinks, get alerted when odds move, and check the official call in the morning.</p></div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <h2>Snow areas</h2>
        <p class="lead">Where the snow — and the decisions — happen.</p>
        <table class="dir-table">
          <thead><tr><th>State</th><th>Cities we track</th><th></th></tr></thead>
          <tbody>
            <tr v-for="s in states" :key="s.slug">
              <td><NuxtLink :to="`/school-closings/${s.slug}/`">{{ s.name }}</NuxtLink></td>
              <td>{{ s.cities.map(c => cityName(c)).join(', ') }}</td>
              <td><span class="tag exp">Live</span></td>
            </tr>
          </tbody>
        </table>
        <p style="color:var(--ice-600);font-size:.85rem">More states and cities unlock as the season progresses. <NuxtLink to="/school-search/">Search any US location</NuxtLink> — the tool works everywhere.</p>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <h2>Why SnowDayCall?</h2>
        <p class="lead">Everyone predicts the snow. We predict the superintendent.</p>
        <div class="cards">
          <div class="card"><h3>🎯 District-level</h3><p>Predictions for the district that makes the call — not a generic city number.</p></div>
          <div class="card"><h3>📊 Transparent accuracy</h3><p>Every prediction logged. Every outcome published. <NuxtLink to="/accuracy/">See the track record</NuxtLink>.</p></div>
          <div class="card"><h3>⏰ When will you know</h3><p>We estimate announcement timing so you're not refreshing at midnight.</p></div>
          <div class="card"><h3>🗳 Community call</h3><p>Vote with thousands of parents, students and teachers in your district.</p></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { states, cities } from '~/data/locations';

useHead({
  title: 'SnowDayCall — Will School Be Closed Tomorrow? | Snow Day Calculator & Predictor',
  meta: [
    { name: 'description', content: 'Will school be closed tomorrow? SnowDayCall predicts school closures, delays and remote days by district using live National Weather Service data.' },
  ],
});

const cityName = (slug: string) => cities.find(c => c.slug === slug)?.name ?? slug;
</script>
