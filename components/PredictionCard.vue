<template>
  <div class="pred-card">
    <h2>{{ title }}</h2>
    <p class="district-line">{{ subtitle }}</p>
    <div class="outcomes">
      <div class="outcome closed"><div class="pct">🔴 {{ closed }}%</div><div class="lbl">Closed</div></div>
      <div class="outcome delay"><div class="pct">🟠 {{ delay }}%</div><div class="lbl">2-hr delay</div></div>
      <div class="outcome normal"><div class="pct">🟢 {{ normal }}%</div><div class="lbl">Normal day</div></div>
    </div>
    <h3 style="font-size:.95rem;margin:0 0 6px">Why?</h3>
    <ul class="why">
      <li v-for="f in factors" :key="f.label"><span>{{ f.icon }}</span><span>{{ f.text }}</span></li>
    </ul>
    <div class="meta-row">
      <span>Confidence: {{ confidence }}</span>
      <span>{{ knowBy }}</span>
    </div>
    <p class="updated">Updated {{ updatedAgo }} · National Weather Service data · Model v1</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  closed: number;
  delay: number;
  normal: number;
  factors: { icon: string; text: string }[];
  confidence: string;
  knowBy: string;
  updatedAgo: string;
}>();
</script>
