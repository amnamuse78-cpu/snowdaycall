<template>
  <div class="prose">
    <h1>Our Accuracy — Published, Win or Lose 📊</h1>
    <p>
      A prediction site that hides its misses is just marketing. So here's our deal:
      <strong>every prediction we publish gets matched against the official district outcome</strong>,
      and the running score lives on this page.
    </p>
    <h2>Season 2026–27 (in progress)</h2>
    <div class="cards" style="margin:20px 0">
      <div class="card"><div class="risk">–</div><p>Predictions logged</p></div>
      <div class="card"><div class="risk">–</div><p>Outcomes verified</p></div>
      <div class="card"><div class="risk">–</div><p>Correct calls</p></div>
    </div>
    <p>
      The season hasn't started yet — the scoreboard above fills in as storms arrive and districts announce.
      We count a prediction "correct" when our highest-probability outcome matches the district's official call
      (closed / 2-hour delay / normal day).
    </p>
    <h2>How we keep score honest</h2>
    <ul>
      <li><strong>Locked predictions:</strong> every prediction is timestamped and stored before the district announces. No editing after the fact.</li>
      <li><strong>Official outcomes only:</strong> the "actual" column comes from the district's own announcement, never from rumors or social media.</li>
      <li><strong>All four outcomes count:</strong> delays and normal days are predictions too — a site that only brags about correct closure calls is cherry-picking.</li>
      <li><strong>Per-district breakdowns:</strong> each <NuxtLink to="/school-search/">district page</NuxtLink> carries its own decision history, so you can see exactly how we do on <em>your</em> district.</li>
    </ul>
    <h2>What "good" looks like</h2>
    <p>
      School-closure prediction is genuinely hard — a 2-inch forecast error or a 6 AM refreeze can flip a call.
      We aim to beat a coin flip by a wide margin and to be well-calibrated: when we say 70%, the outcome should
      land roughly 7 times in 10. If the numbers say otherwise, you'll see it here first — and we'll say what we're changing.
    </p>
    <p><NuxtLink to="/how-it-works/">How the model works →</NuxtLink> · <NuxtLink to="/school-search/">Check your district →</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Prediction Accuracy — Our Track Record | SnowDayCall',
  meta: [{ name: 'description', content: 'SnowDayCall publishes every prediction against the official district outcome. See our running accuracy score for the 2026–27 winter season.' }],
});
</script>
