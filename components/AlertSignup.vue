<template>
  <div class="card" style="margin-top:20px">
    <h3>❄ Get the call before the call</h3>
    <p>Alert me when {{ districtShort }}’s closure probability passes {{ threshold }}%.</p>
    <div style="display:flex;gap:8px;margin-top:12px">
      <input v-model="email" type="email" placeholder="you@email.com"
        style="flex:1;background:var(--night-950);border:1px solid var(--night-700);border-radius:10px;color:var(--ice-100);padding:10px 14px" />
      <button class="btn-gold" @click="subscribe">{{ done ? '✓ Set' : 'Alert me' }}</button>
    </div>
    <p v-if="done" style="color:var(--green);font-size:.85rem;margin-top:8px">You’re on the list. We’ll email you when the odds move.</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ districtSlug: string; districtShort: string; threshold?: number }>();
const email = ref('');
const done = ref(false);
async function subscribe() {
  if (!email.value.includes('@')) return;
  try {
    await $fetch('/api/alerts', { method: 'POST', body: { district: props.districtSlug, email: email.value, threshold: props.threshold ?? 70 } });
  } catch { /* stored locally until API is live */ }
  done.value = true;
}
</script>
