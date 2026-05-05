<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ product.name }}</ion-card-title>
      <ion-card-subtitle>{{ product.description }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      To jest przykładowy produkt w bazie produktów grillowych. Możesz tutaj umieścić informacje o składnikach, sposobie przygotowania, czy też sugestie dotyczące podania.
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
const props = defineProps({
  product: { type: Object, required: true },
})
</script>