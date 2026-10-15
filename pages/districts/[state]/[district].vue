<template>
  <div class="container" style="padding-top:48px;max-width:820px" v-if="district">
    <p style="color:var(--ice-600);font-size:.85rem">
      <NuxtLink to="/">Home</NuxtLink> ·
      <NuxtLink :to="`/school-closings/${district.stateSlug}/`">{{ stateName }}</NuxtLink> ·
      <NuxtLink :to="`/snow-day-calculator/${district.citySlug}/`">{{ cityName }}</NuxtLink>
    </p>
    <h1>{{ district.name }} — Snow Day Prediction ❄️</h1>
    <p style="color:var(--ice-400)">{{ district.announceNote }}</p>

    <div v-if="pred" style="margin:24px 0">
      <PredictionCard
        :title="`${district.name} — tomorrow`"
        :subtitle="`Official announcements: ${district.officialUrl.replace('https://www.', '')}`"
        :closed="pred.closed" :delay="pred.delay" :normal="pred.normal"
        :factors="factorList" :confidence="pred.confidence" :know-by="pred.knowBy" :updated-ago="updatedAgo"
      />
    </div>
    <div v-else class="card" style="margin:24px 0"><p>Loading live prediction…</p></div>

    <div class="card" style="margin:20px 0">
      <h3>📢 Official status</h3>
      <p v-if="official.status === 'pending'">
        <strong style="color:var(--gold-300)">No official announcement yet.</strong>
        {{ district.name }} usually announces in the early morning.
        <a :href="district.officialUrl" target="_blank" rel="noopener">Check the district's official site →</a>
      </p>
      <p v-else>
        <strong style="text-transform:capitalize">{{ official.status }}</strong>
        <span v-if="official.announcedAt"> — announced at {{ official.announcedAt }}</span>
      </p>
    </div>

    <CommunityPoll :district-slug="district.slug" :district-short="district.shortName" />
    <AlertSignup :district-slug="district.slug" :district-short="district.shortName" />

    <section class="section" style="padding:32px 0 0">
      <h2>{{ district.shortName }} decision history</h2>
      <p class="lead">Our prediction vs. the actual call — the track record that keeps us honest.</p>
      <div v-if="history.length">
        <table class="dir-table">
          <thead><tr><th>Date</th><th>We predicted</th><th>Actual</th><th>Result</th></tr></thead>
          <tbody>
            <tr v-for="h in history" :key="h.date">
              <td>{{ h.date }}</td><td>{{ h.predicted }}%</td><td style="text-transform:capitalize">{{ h.actual }}</td>
              <td>{{ h.correct ? '✅' : '❌' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else style="color:var(--ice-400)">
        This district's decision log starts with the 2026–27 winter season. Every prediction we publish gets
        matched against the official outcome here — that running record is how we measure and improve.
        <NuxtLink to="/accuracy/">See how accuracy works →</NuxtLink>
      </p>
    </section>

    <section class="section" style="padding-bottom:0">
      <h2>About {{ district.name }}</h2>
      <p style="color:var(--ice-200);line-height:1.75">
        {{ district.name }} serves {{ district.students }} students. Like every district, its closure decisions
        weigh overnight snowfall, road conditions, temperature, wind and storm timing — not just the forecast total.
        Our model is tuned on how districts <em>actually behave</em>, which is why timing and ice carry as much
        weight as inches of snow.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { districts, states, cities } from '~/data/locations';
const route = useRoute();
const district = computed(() => districts.find(d => d.slug === route.params.district));
if (!district.value) throw createError({ statusCode: 404, message: 'District not found' });

useHead({
  title: `${district.value.name} Snow Day Prediction — Closed or Open Tomorrow? | SnowDayCall`,
  meta: [{ name: 'description', content: `${district.value.name} closure prediction: live odds of closed, delay or normal day, community vote, official status and decision history.` }],
});

const stateName = computed(() => states.find(s => s.slug === district.value!.stateSlug)?.name ?? '');
const cityName = computed(() => cities.find(c => c.slug === district.value!.citySlug)?.name ?? '');

const pred = ref<any>(null);
const official = ref({ status: 'pending', announcedAt: null as string | null });
const updatedAgo = ref('just now');
const history = ref<any[]>([]);

onMounted(async () => {
  try {
    const r: any = await $fetch(`/api/prediction/${district.value!.slug}`);
    pred.value = r;
    updatedAgo.value = 'a few minutes ago';
  } catch { /* static content still renders */ }
  try {
    official.value = await $fetch(`/api/official-status/${district.value!.slug}`);
  } catch { /* stays pending */ }
});

const factorList = computed(() => (pred.value?.factors || []).map((f: any) => ({
  icon: f.points >= 0 ? '▲' : '▼',
  text: `${f.label} (${f.points >= 0 ? '+' : ''}${f.points}): ${f.detail}`,
})));
</script>
