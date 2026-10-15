<template>
  <div class="container" style="padding-top:48px;max-width:820px" v-if="city">
    <p style="color:var(--ice-600);font-size:.85rem"><NuxtLink to="/">Home</NuxtLink> · <NuxtLink :to="`/school-closings/${city.stateSlug}/`">{{ city.state }}</NuxtLink></p>
    <h1>Will {{ city.name }} Schools Close Tomorrow? ❄️</h1>
    <p style="color:var(--ice-400)">{{ city.blurb }}</p>

    <div v-if="pred" style="margin:24px 0">
      <PredictionCard
        :title="`${city.name} snow-day outlook`"
        :subtitle="`Aggregated across ${city.name} area districts`"
        :closed="pred.closed" :delay="pred.delay" :normal="pred.normal"
        :factors="factorList" :confidence="pred.confidence" :know-by="pred.knowBy" :updated-ago="updatedAgo"
      />
    </div>
    <div v-else class="card" style="margin:24px 0"><p>Loading live prediction…</p></div>

    <section class="section" style="padding:24px 0">
      <h2>Districts in and around {{ city.name }}</h2>
      <p class="lead">The city forecast is one number — the decision belongs to each district. Pick yours:</p>
      <div class="cards">
        <div class="card" v-for="d in city.districts" :key="d.name">
          <h3><NuxtLink v-if="d.slug" :to="`/districts/${d.stateSlug}/${d.slug}/`">{{ d.name }}</NuxtLink><span v-else>{{ d.name }}</span></h3>
          <p>{{ d.note }}</p>
          <p v-if="d.slug" style="margin-top:8px"><NuxtLink :to="`/districts/${d.stateSlug}/${d.slug}/`">See {{ d.name }} prediction →</NuxtLink></p>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <h2>{{ city.name }} snow-day FAQ</h2>
      <div class="card" v-for="f in city.faq" :key="f.q" style="margin-bottom:12px">
        <h3>{{ f.q }}</h3><p>{{ f.a }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { cities } from '~/data/locations';
const route = useRoute();
const city = computed(() => cities.find(c => c.slug === route.params.city));
if (!city.value) throw createError({ statusCode: 404, message: 'City not found' });

useHead({
  title: `${city.value.name} Snow Day Calculator & School Closings | SnowDayCall`,
  meta: [{ name: 'description', content: `Will ${city.value.name} schools close tomorrow? Live snow-day prediction, district breakdown and FAQs from National Weather Service data.` }],
});

const pred = ref<any>(null);
const updatedAgo = ref('just now');
onMounted(async () => {
  // City outlook = prediction at city center; districts get their own pages.
  try {
    const first = city.value!.districts.find(d => d.slug);
    const slug = first ? first.slug : null;
    const url = slug ? `/api/prediction/${slug}` : null;
    if (url) {
      const r: any = await $fetch(url);
      pred.value = r;
      updatedAgo.value = 'a few minutes ago';
    }
  } catch { /* static content still renders */ }
});

const factorList = computed(() => (pred.value?.factors || []).slice(0, 5).map((f: any) => ({
  icon: f.points >= 0 ? '▲' : '▼',
  text: `${f.label}: ${f.detail}`,
})));
</script>
