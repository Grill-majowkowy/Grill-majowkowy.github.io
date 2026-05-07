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
        <ion-item>
          <ion-list>
            <ion-item>
              <ion-select v-model="newProduct.shop" aria-label="sklep" interface="popover" placeholder="Wybierz sklep">
                <ion-select-option value="biedronka">Biedronka</ion-select-option>
                <ion-select-option value="lidl">Lidl</ion-select-option>
                <ion-select-option value="auchan">Auchan</ion-select-option>
                <ion-select-option value="netto">Netto</ion-select-option>
                <ion-select-option value="zabka">Żabka</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
          <ion-avatar v-if="newProduct.shop">
            <img alt="Logo sklepu" :src="shopAvatars[newProduct.shop]">
          </ion-avatar>
        </ion-item> 
        <ion-item>
          <ion-toggle v-model="newProduct.isBought">Czy już kupione?</ion-toggle>
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
import { IonButtons, IonContent, IonHeader, IonInput, IonList, 
  IonModal, IonPage, IonTitle, IonToolbar, IonButton, 
  IonIcon, IonItem,
  IonAvatar,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { shopAvatars } from './shopAvatars.js'

const props = defineProps({
  isVisible: { type: Boolean, required: true },
});

const newProduct = defineModel();

const emit = defineEmits(['addProduct', 'closeModal']);
</script>