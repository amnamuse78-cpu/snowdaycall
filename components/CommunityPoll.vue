<template>
  <div>
    <h3 style="font-size:.95rem;margin:18px 0 6px">Community Call</h3>
    <p style="color:var(--ice-400);font-size:.85rem;margin:0 0 8px">What do you think {{ districtShort }} will do?</p>
    <div class="poll">
      <button :class="{ active: voted === 'closed' }" @click="vote('closed')">Closed</button>
      <button :class="{ active: voted === 'delay' }" @click="vote('delay')">Delay</button>
      <button :class="{ active: voted === 'normal' }" @click="vote('normal')">Normal</button>
    </div>
    <p class="poll-results">{{ votesText }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ districtSlug: string; districtShort: string }>();
const voted = ref<string | null>(null);
// Demo baseline; real counts come from /api/vote at launch.
const base = ref({ closed: 72, delay: 18, normal: 10, total: 1284 });
const votesText = computed(() =>
  voted.value
    ? `Thanks for voting! Community says: ${base.value.closed}% closed · ${base.value.total.toLocaleString()} votes`
    : `Community says: ${base.value.closed}% closed · ${base.value.total.toLocaleString()} votes`
);
async function vote(v: string) {
  voted.value = v;
  try {
    await $fetch('/api/vote', { method: 'POST', body: { district: props.districtSlug, vote: v } });
  } catch { /* offline-safe: vote recorded locally for now */ }
}
</script>
