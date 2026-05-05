<template>
  <ion-modal :is-open="isVisible" @did-dismiss="$emit('closeModal')">
    <ion-header>
      <ion-toolbar>
        <ion-title>Dodaj produkt</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('closeModal')">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input
            v-model="newProduct.name"
            label="Nazwa"
            label-placement="floating"
            placeholder="np. Kiełbasa"
            :clear-input="true"
          />
        </ion-item>
        <ion-item>
          <ion-input
            v-model="newProduct.description"
            label="Opis"
            label-placement="floating"
            placeholder="np. Tradycyjna kiełbasa z grilla"
            :clear-input="true"
          />
        </ion-item>
        <ion-item>
          <ion-input
            v-model.number="newProduct.price"
            label="Cena (zł)"
            label-placement="floating"
            type="number"
            placeholder="np. 10"
            :clear-input="true"
          />
        </ion-item>
      </ion-list>
      <ion-button expand="block" class="submit-btn" @click="$emit('addProduct', newProduct)">
        Dodaj produkt
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { IonButtons, IonContent, IonHeader, IonInput, IonList, IonModal, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonItem } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';

const props = defineProps({
  isVisible: { type: Boolean, required: true },
});

const newProduct = defineModel();

const emit = defineEmits(['addProduct', 'closeModal']);
</script>