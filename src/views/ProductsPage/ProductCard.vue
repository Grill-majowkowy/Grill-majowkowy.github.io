<template>
  <ion-card>
    <ion-card-header>
      <div>
        <ion-card-title>{{ product.name }}</ion-card-title>
        <ion-card-subtitle>{{ product.description }}</ion-card-subtitle>
      </div>

      <div class="actions">
        <ion-button fill="clear" @click="$emit('edit', product.id)">
          <ion-icon :icon="createOutline" />
        </ion-button>

        <ion-button fill="clear" color="danger" @click="$emit('delete', product.id)">
          <ion-icon :icon="trashOutline" />
        </ion-button>
      </div>
    </ion-card-header>

    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-select v-model="product.shop" aria-label="sklep" interface="popover" placeholder="Wybierz sklep">
            <ion-select-option value="biedronka">Biedronka</ion-select-option>
            <ion-select-option value="lidl">Lidl</ion-select-option>
            <ion-select-option value="auchan">Auchan</ion-select-option>
            <ion-select-option value="netto">Netto</ion-select-option>
            <ion-select-option value="zabka">Żabka</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
      <ion-avatar v-if="product.shop">
        <img alt="Logo sklepu" :src="shopAvatars[product.shop]">
      </ion-avatar>
      <ion-toggle :checked="product.isBought">Czy już kupione?</ion-toggle>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { ref } from 'vue'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonAvatar,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonToggle,
} from '@ionic/vue'
import { createOutline, trashOutline } from 'ionicons/icons'
import { shopAvatars } from './shopAvatars.js'

defineProps({
  product: { type: Object, required: true }
})

defineEmits(['edit', 'delete'])
</script>

<style scoped>
.title-section {
  display: flex;
  flex-direction: column;
}

.actions {
  position: absolute;
  right: 0;
  top: -1%;
}
</style>