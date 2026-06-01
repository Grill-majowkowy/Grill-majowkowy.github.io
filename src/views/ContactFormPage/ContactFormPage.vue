<template>
  <ion-page>
    <PageHeader text="Formularz Kontaktowy" />

    <ion-content :fullscreen="true">
      <ion-list lines="full" class="form-list">

        <!-- Email odbiorcy -->
        <ion-item>
          <ion-label position="stacked">Email odbiorcy</ion-label>
          <ion-input v-model="form.email" type="email" inputmode="email" placeholder="np. jan@example.com" clearInput />
        </ion-item>

        <!-- Imię odbiorcy -->
        <ion-item>
          <ion-label position="stacked">Imię odbiorcy</ion-label>
          <ion-input v-model="form.recipient" placeholder="Wpisz imię odbiorcy" clearInput />
        </ion-item>

        <!-- Moje imię -->
        <ion-item>
          <ion-label position="stacked">Moje imię</ion-label>
          <ion-input v-model="form.name" placeholder="Wpisz swoje imię" clearInput />
        </ion-item>

        <!-- Dług (slider) -->
        <ion-item>
          <ion-label position="stacked">Dług: <strong>{{ form.due }} zł</strong></ion-label>
          <ion-range
            v-model="form.due"
            :min="0"
            :max="1000"
            :step="10"
            :pin="true"
            :pin-formatter="(v) => v + ' zł'"
            color="primary"
            class="range-field"
          >
            <ion-label slot="start">0 zł</ion-label>
            <ion-label slot="end">1 000 zł</ion-label>
          </ion-range>
        </ion-item>

        <!-- Termin spłaty -->
        <ion-item>
          <ion-label position="stacked">Termin spłaty</ion-label>
          <ion-datetime-button datetime="due-date-datetime" class="datetime-btn" />
          <ion-modal
            :keep-contents-mounted="true"
            :initial-breakpoint="1"
            :breakpoints="[0, 1]"
            class="datetime-modal"
          >
            <ion-datetime
              id="due-date-datetime"
              v-model="form.dueDate"
              presentation="date"
              :first-day-of-week="1"
              :show-default-buttons="true"
              done-text="Wybierz"
              cancel-text="Anuluj"
              size="cover"
            />
          </ion-modal>
        </ion-item>

        <!-- Czy blikiem? -->
        <ion-item>
          <ion-label>Czy blikiem?</ion-label>
          <ion-toggle v-model="form.isBlik" color="primary" slot="end" />
        </ion-item>

        <!-- Numer telefonu (warunkowo) -->
        <ion-item v-if="form.isBlik">
          <ion-label position="stacked">Numer telefonu do BLIK</ion-label>
          <ion-input
            v-model="form.phoneNumber"
            type="tel"
            inputmode="numeric"
            placeholder="9 cyfr"
            :maxlength="9"
            @ionInput="onPhoneInput"
            clearInput
          />
          <ion-note slot="helper">Dokładnie 9 cyfr</ion-note>
          <ion-note slot="error" color="danger" v-if="phoneError">{{ phoneError }}</ion-note>
        </ion-item>

      </ion-list>

      <div class="send-wrapper">
        <ion-button expand="block" :disabled="!isValid" @click="sendMail">
          <ion-icon :icon="mailOutline" slot="start" />
          Wyślij wiadomość
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  IonPage, IonContent, IonList, IonItem, IonLabel, IonInput,
  IonRange, IonToggle, IonButton, IonIcon, IonNote,
  IonDatetime, IonDatetimeButton, IonModal,
} from '@ionic/vue';
import { mailOutline } from 'ionicons/icons';
import PageHeader from '../../components/PageHeader.vue';

const form = ref({
  email: '',
  recipient: '',
  name: '',
  due: 50,
  dueDate: new Date().toISOString(),
  isBlik: false,
  phoneNumber: '',
});

const phoneError = ref('');

function onPhoneInput(e) {
  // przyjmuj tylko liczby i to dokładnie 9 cyfr
  const digits = (e.target.value ?? '').replace(/\D/g, '').slice(0, 9);
  form.value.phoneNumber = digits;
  e.target.value = digits;
  if (digits.length > 0 && digits.length < 9) {
    phoneError.value = 'Numer musi mieć dokładnie 9 cyfr';
  } else {
    phoneError.value = '';
  }
}

const isValid = computed(() => {
  if (!form.value.email.trim()) return false;
  if (!form.value.recipient.trim()) return false;
  if (!form.value.name.trim()) return false;
  if (form.value.isBlik && form.value.phoneNumber.length !== 9) return false;
  return true;
});

function formatDate(iso) {
  if (!iso) return 'brak';
  const d = new Date(iso);
  return d.toLocaleDateString('pl-PL');
}

function sendMail() {
  const { email, recipient, name, due, dueDate, isBlik, phoneNumber } = form.value;

  const blikLine = isBlik
    ? `Przelew: BLIK na numer ${phoneNumber}`
    : 'Przelew: tradycyjny przelew bankowy';

  const body = [
    `Cześć ${recipient},`,
    '',
    `Przypominam o długu na kwotę ${due} zł za ostatniego grilla (kiełbasy i %-nty).`,
    `Termin spłaty: ${formatDate(dueDate)}.`,
    blikLine,
    '',
    `Pozdro,`,
    name,
  ].join('\n');

  const subject = encodeURIComponent(`Przypomnienie o spłacie długu – ${name}`);
  const encodedBody = encodeURIComponent(body);

  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${encodedBody}`;
}
</script>

<style scoped>
.form-list {
  margin-top: 8px;
}

.range-field {
  width: 100%;
  padding-top: 8px;
}

.send-wrapper {
  padding: 16px;
}

.datetime-btn {
  margin-top: 8px;
  margin-bottom: 4px;
}
</style>
