<template>
  <ion-page>
    <PageHeader text="Kalkulator promili" />

    <ion-content :fullscreen="true">
      <div id="container">

        <ion-list lines="full" class="form-list">

          <ion-item>
            <ion-label position="stacked">Alkohol mocny – ilość (ml)</ion-label>
            <ion-input 
              :value="strongAmount"
              @ionInput="strongAmount = Number($event.detail.value)"
              type="number" 
              min="0" 
              step="25" 
              placeholder="np. 100" 
            />
            <ion-range 
              :value="strongAmount"
              @ionChange="strongAmount = Number($event.detail.value)"
              aria-label="ilość alkoholu mocnego"
              min="0"
              max="2000"
              step="25"
              pin="true"
            ></ion-range>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Alkohol mocny – moc (%)</ion-label>
            <ion-radio-group 
              :value="strongStrength" 
              @ionChange="strongStrength = Number($event.detail.value)"
            >
              <ion-radio :value="25">Likier [25%]</ion-radio><br />
              <ion-radio :value="40">Wódka [40%]</ion-radio><br />
              <ion-radio :value="45">Whiskey [45%]</ion-radio><br />
              <ion-radio :value="62">Bimber [62%]</ion-radio><br />
              <ion-radio :value="96">Spirytus [96%]</ion-radio>
            </ion-radio-group>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Alkohol słaby – ilość (ml)</ion-label>
            <ion-input v-model.number="weakAmount" type="number" min="0" step="100" placeholder="np. 500" />
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Alkohol słaby – moc (%)</ion-label>
            <ion-input v-model.number="weakStrength" type="number" min="0" max="100" placeholder="np. 5" />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Czas rozpoczęcia picia</ion-label>
            <ion-input v-model="startTime" type="time" />
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Czas zakończenia picia</ion-label>
            <ion-input v-model="endTime" type="time" />
          </ion-item>

          <ion-item>
            <ion-label>Czy jadłeś przed/podczas picia?</ion-label>
            <ion-toggle v-model="ate" slot="end" />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Odporność na alkohol</ion-label>
            <ion-select v-model="tolerance" interface="popover">
              <ion-select-option value="low">Niska</ion-select-option>
              <ion-select-option value="medium">Średnia</ion-select-option>
              <ion-select-option value="high">Wysoka</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Waga ciała (kg)</ion-label>
            <ion-input v-model.number="bodyWeight" type="number" min="0" step="1" placeholder="np. 75kg" />
          </ion-item>

        </ion-list>

        <div v-if="results.length" class="results">
          <h3>Poziom promili w czasie:</h3>
          <ion-list lines="full">
            <ion-item v-for="row in results" :key="row.label">
              <ion-label>{{ row.label }}</ion-label>
              <ion-badge slot="end" :color="badgeColor(row.bac)">{{ row.bac.toFixed(2) }} ‰</ion-badge>
            </ion-item>
          </ion-list>
          <p class="disclaimer">⚠️ Wyniki są orientacyjne. Nie prowadź pojazdu po spożyciu alkoholu.</p>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonContent, IonList, IonItem, IonLabel, IonInput,
  IonToggle, IonSelect, IonSelectOption, IonButton, IonBadge,
  IonHeader, IonToolbar, IonTitle, IonPicker, IonPickerColumn, 
  IonPickerColumnOption, IonRadio, IonRadioGroup, IonRange
} from '@ionic/vue';
import PageHeader from '../../components/PageHeader.vue';
import { ref } from 'vue';
import { computed } from 'vue';

const strongAmount   = ref(0);
const strongStrength = ref(40);
const weakAmount     = ref(0);
const weakStrength   = ref(5);
const startTime      = ref('20:00');
const endTime        = ref('22:00');
const ate            = ref(false);
const tolerance      = ref('medium');
const bodyWeight     = ref(75);

// Współczynnik Widmarka: 0.7 dla mężczyzn, używamy uproszczonego modelu
// Zakładamy wagę 75 kg i płeć męską jako wartość bazową.
// Odporność wpływa na zakładaną wagę/współczynnik dystrybucji (r):
const TOLERANCE_R = { low: 0.55, medium: 0.68, high: 0.78 };
const ELIMINATION  = 0.15;  // promili/h – standardowa szybkość eliminacji alkoholu

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// kalkuluj na żywo wyniki
const results = computed(() => {
  const alcoholGrams =
    (strongAmount.value * (strongStrength.value / 100) +
     weakAmount.value  * (weakStrength.value  / 100)) * 0.789;

  const r = TOLERANCE_R[tolerance.value];
  const absorptionFactor = ate.value ? 0.70 : 1.0;
  const peakBAC = (alcoholGrams * absorptionFactor) / (bodyWeight.value * r);

  const startMin = timeToMinutes(startTime.value);
  let endMin     = timeToMinutes(endTime.value);
  if (endMin <= startMin) endMin += 24 * 60;

  const drinkingHours = (endMin - startMin) / 60;

  const rows = [];
  for (let h = 0; h <= 22; h++) {
    let bac;
    if (h <= drinkingHours) {
      bac = peakBAC * (h / Math.max(drinkingHours, 0.5));
    } else {
      bac = Math.max(0, peakBAC - ELIMINATION * (h - drinkingHours));
    }
    const labelMin = (startMin + h * 60) % (24 * 60);
    const labelH   = String(Math.floor(labelMin / 60)).padStart(2, '0');
    const labelM   = String(labelMin % 60).padStart(2, '0');
    rows.push({ label: `${labelH}:${labelM}`, bac });
  }
  return rows;
});

function badgeColor(bac) {
  if (bac < 0.2)   return 'success';
  if (bac < 0.5)   return 'primary';
  if (bac < 1.0)   return 'tertiary';
  if (bac < 2.0)   return 'warning';
  return 'danger';
}
</script>

<style scoped>
#container {
  padding: 16px;
  max-width: 560px;
  margin: 0 auto;
}

ion-radio-group {
  margin: 2rem;
}

ion-radio {
  height: 2rem;
  --border-radius: 4px;
}

.form-list {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.calc-btn {
  margin-bottom: 24px;
}

.results h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.disclaimer {
  font-size: 13px;
  color: var(--ion-color-medium);
  margin-top: 12px;
  text-align: center;
}
</style>
