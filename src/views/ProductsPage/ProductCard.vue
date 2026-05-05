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
      To jest przykładowy produkt w bazie produktów grillowych.
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonIcon
} from '@ionic/vue'
import { createOutline, trashOutline } from 'ionicons/icons'

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