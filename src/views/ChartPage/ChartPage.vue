<template>
  <ion-page>
    <PageHeader text="Wykres (nie)trzeźwości" />

    <ion-content :fullscreen="true">
      <div id="container">

        <div v-if="!rows.length" class="empty">
          <p>Brak danych. Wróć do kalkulatora i kliknij „Pokaż wykres".</p>
          <ion-button 
            fill="solid" 
            @click="openCalculatorPage"
          >Otwórz Kalkulator</ion-button>
        </div>

        <div v-else class="chart-wrapper">
          <svg :viewBox="`0 0 ${W} ${H}`" width="100%" class="chart-svg">
            <!-- Siatka pozioma i etykiety Y -->
            <g v-for="tick in yTicks" :key="tick">
              <line
                :x1="PAD_L" :y1="yScale(tick)"
                :x2="W - PAD_R" :y2="yScale(tick)"
                stroke="#e0e0e0" stroke-width="1"
              />
              <text
                :x="PAD_L - 6" :y="yScale(tick) + 4"
                text-anchor="end" font-size="11" fill="#888"
              >{{ tick.toFixed(1) }}</text>
            </g>

            <!-- Strefa kolorów tła -->
            <rect :x="PAD_L" :y="yScale(2.0)" :width="W - PAD_L - PAD_R" :height="yScale(1.0) - yScale(2.0)" fill="rgba(235,59,90,0.08)" />
            <rect :x="PAD_L" :y="yScale(1.0)" :width="W - PAD_L - PAD_R" :height="yScale(0.5) - yScale(1.0)" fill="rgba(255,165,0,0.08)" />
            <rect :x="PAD_L" :y="yScale(0.5)" :width="W - PAD_L - PAD_R" :height="yScale(0.2) - yScale(0.5)" fill="rgba(var(--ion-color-tertiary-rgb),0.08)" />
            <rect :x="PAD_L" :y="yScale(0.2)" :width="W - PAD_L - PAD_R" :height="yScale(0) - yScale(0.2)" fill="rgba(45,211,111,0.08)" />

            <!-- Linia wykresu -->
            <polyline
              :points="linePoints"
              fill="none"
              stroke="var(--ion-color-primary)"
              stroke-width="2.5"
              stroke-linejoin="round"
              stroke-linecap="round"
            />

            <!-- Punkty -->
            <circle
              v-for="(row, i) in rows" :key="i"
              :cx="xScale(i)" :cy="yScale(row.bac)" r="3.5"
              :fill="dotColor(row.bac)"
            />

            <!-- Etykiety X (co 2h) -->
            <g v-for="(row, i) in rows" :key="'l' + i">
              <text
                v-if="i % 2 === 0"
                :x="xScale(i)" :y="H - PAD_B + 14"
                text-anchor="middle" font-size="10" fill="#888"
              >{{ row.label }}</text>
            </g>

            <!-- Osie -->
            <line :x1="PAD_L" :y1="PAD_T" :x2="PAD_L" :y2="H - PAD_B" stroke="#aaa" stroke-width="1.5" />
            <line :x1="PAD_L" :y1="H - PAD_B" :x2="W - PAD_R" :y2="H - PAD_B" stroke="#aaa" stroke-width="1.5" />

            <!-- Etykieta Y -->
            <text :x="10" :y="H / 2" text-anchor="middle" font-size="11" fill="#888"
              :transform="`rotate(-90, 10, ${H / 2})`">promile ‰</text>
          </svg>

          <!-- Legenda -->
          <div class="legend">
            <span class="leg leg-safe">0–0.2 ‰ bezpiecznie</span>
            <span class="leg leg-ok">0.2–0.5 ‰ po alkoholu</span>
            <span class="leg leg-warn">0.5–1.0 ‰ niemożliwe prowadzenie</span>
            <span class="leg leg-danger">1.0–2.0 ‰ ciężkie upojenie</span>
            <span class="leg leg-dark">&gt;2.0 ‰ zagrożenie życia</span>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonButton } from '@ionic/vue';
import PageHeader from '../../components/PageHeader.vue';
import { ref, computed } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';
import { useRouter } from 'vue-router'

const router = useRouter();

const openCalculatorPage = () => {
  router.push('/kalkulator');
};

const W = 340, H = 220;
const PAD_L = 36, PAD_R = 12, PAD_T = 12, PAD_B = 24;

const rows = ref([]);

onIonViewWillEnter(() => {
  try {
    rows.value = JSON.parse(history.state?.results ?? '[]');
  } catch {
    rows.value = [];
  }
});

const maxBac = computed(() => Math.max(...rows.value.map(r => r.bac), 0.5));

function yScale(val) {
  return PAD_T + (H - PAD_T - PAD_B) * (1 - val / (maxBac.value * 1.1));
}
function xScale(i) {
  return PAD_L + i * (W - PAD_L - PAD_R) / Math.max(rows.value.length - 1, 1);
}

const linePoints = computed(() =>
  rows.value.map((r, i) => `${xScale(i)},${yScale(r.bac)}`).join(' ')
);

const yTicks = computed(() => {
  const step = maxBac.value > 2 ? 0.5 : 0.2;
  const ticks = [];
  for (let v = 0; v <= maxBac.value * 1.1; v += step) ticks.push(Math.round(v * 10) / 10);
  return ticks;
});

function dotColor(bac) {
  if (bac < 0.2)  return 'var(--ion-color-success)';
  if (bac < 0.5)  return 'var(--ion-color-primary)';
  if (bac < 1.0)  return 'var(--ion-color-tertiary)';
  if (bac < 2.0)  return 'var(--ion-color-warning)';
  return 'var(--ion-color-danger)';
}
</script>

<style scoped>
#container {
  padding: 16px;
}

.empty {
  text-align: center;
  margin-top: 40px;
  color: var(--ion-color-medium);
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-svg {
  max-width: 100%;
  overflow: visible;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  font-size: 12px;
  align-self: flex-start;
}

text {
  font-size: 0.4rem;
}

.leg::before {
  content: '■ ';
}
.leg-safe   { color: var(--ion-color-success); }
.leg-ok     { color: var(--ion-color-primary); }
.leg-warn   { color: var(--ion-color-tertiary); }
.leg-danger { color: var(--ion-color-warning); }
.leg-dark   { color: var(--ion-color-danger); }
</style>
