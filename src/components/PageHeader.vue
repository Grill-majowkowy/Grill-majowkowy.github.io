<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title class="header-title">{{ text }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="goBack">
          <ion-icon slot="icon-only" :icon="arrowBackOutline" />
        </ion-button>
        <ion-button @click="goHome">
          <ion-icon slot="icon-only" :icon="homeOutline" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import { IonButtons, IonButton, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
import { arrowBackOutline, homeOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const props = defineProps({
  text: { type: String, default: '' },
});

const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.header-title {
  font-size: 0.95rem;
}
</style>