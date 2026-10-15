<template>
  <div class="prose">
    <h1>How SnowDayCall Works ⚙️</h1>
    <p>
      Everyone predicts the snow. We predict the <strong>superintendent</strong> — the person who actually
      decides whether your school opens. Here's the full pipeline, no black boxes.
    </p>
    <h2>1. Live weather, from the source</h2>
    <p>
      We pull forecast data from the <strong>National Weather Service</strong> — the same data meteorologists use —
      for your district's exact location: snowfall amounts, storm timing, temperature, wind, ice risk and active
      weather alerts. Forecasts refresh every 2 hours normally, hourly when snow is expected within 24 hours,
      and every 30–60 minutes during active storms.
    </p>
    <h2>2. The decision model</h2>
    <p>Our model (v1) scores what actually drives closure decisions:</p>
    <ul>
      <li><strong>Snowfall (S-curve):</strong> the base probability rises steeply between 2 and 6 inches — the band where most real decisions flip.</li>
      <li><strong>Storm timing:</strong> overnight snow hits harder than daytime snow, because plows run out of road before 5 AM.</li>
      <li><strong>Temperature:</strong> extreme cold and refreeze risk push the odds up; above-freezing temps pull them down.</li>
      <li><strong>Wind:</strong> blowing snow and whiteouts close schools with modest totals.</li>
      <li><strong>Ice:</strong> the biggest single factor — districts close for ice far faster than for snow.</li>
      <li><strong>NWS alerts:</strong> a Winter Storm Warning is a strong signal that districts are already leaning toward closure.</li>
    </ul>
    <p>Every point has a reason, and every reason is shown on your district's page. If we can't explain it, we don't ship it.</p>
    <h2>3. Four outcomes, not two</h2>
    <p>
      School isn't just open-or-closed. We predict <strong>closed</strong>, <strong>2-hour delay</strong> and
      <strong>normal day</strong> as separate probabilities — because the delay is the most common surprise, and the most useful thing to know.
    </p>
    <h2>4. Community + official reality check</h2>
    <p>
      Thousands of parents, students and teachers vote on what their district will do — the community call runs
      alongside our model. Then the district announces, and we log the official outcome against our prediction.
      That running record is published on <NuxtLink to="/accuracy/">the accuracy page</NuxtLink> and on every district page.
    </p>
    <h2>What we're not</h2>
    <p>
      We are not an official announcement service. Our numbers are <em>estimates</em> based on forecasts, which change.
      Always confirm with your district. <NuxtLink to="/disclaimer/">Read the full disclaimer</NuxtLink>.
    </p>
    <p><NuxtLink to="/school-search/">Check your district now →</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'How It Works — The SnowDayCall Prediction Model | SnowDayCall',
  meta: [{ name: 'description', content: 'How SnowDayCall predicts school closures: live NWS data, an explainable decision model, community votes and published accuracy.' }],
});
</script>
