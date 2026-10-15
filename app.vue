<template>
  <div>
    <header class="site-header">
      <div class="container">
        <NuxtLink to="/" class="brand"><span class="snowflake">❄</span> SnowDayCall</NuxtLink>
        <nav class="nav">
          <NuxtLink to="/school-search/">Find My School</NuxtLink>
          <NuxtLink to="/snow-day-map/">Snow Day Map</NuxtLink>
          <NuxtLink to="/accuracy/">Accuracy</NuxtLink>
          <NuxtLink to="/how-it-works/">How It Works</NuxtLink>
        </nav>
      </div>
    </header>
    <main><NuxtPage /></main>
    <footer class="site-footer">
      <div class="container">
        <div>
          <strong style="color: var(--ice-100)">SnowDayCall</strong>
          <p style="max-width: 320px">Don't predict the snow — predict the superintendent. District-level school closure predictions from live National Weather Service data.</p>
        </div>
        <div>
          <NuxtLink to="/how-it-works/">How it works</NuxtLink>
          <NuxtLink to="/accuracy/">Accuracy</NuxtLink>
          <NuxtLink to="/school-search/">Find my school</NuxtLink>
          <NuxtLink to="/contact/">Contact</NuxtLink>
          <NuxtLink to="/privacy/">Privacy</NuxtLink>
          <NuxtLink to="/terms/">Terms</NuxtLink>
          <NuxtLink to="/disclaimer/">Disclaimer</NuxtLink>
        </div>
      </div>
      <p class="disclaimer">SnowDayCall provides estimates based on weather forecasts, not official school announcements. Always confirm with your school district. Not affiliated with any school district.</p>
    </footer>
  </div>
</template>
