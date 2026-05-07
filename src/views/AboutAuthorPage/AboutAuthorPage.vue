<template>
  <ion-page>
    <PageHeader text="Informacje o autorze" />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-text color="primary">
          <h1>Projekt zaliczeniowy na informatykę</h1>
        </ion-text>

        <ion-text color="secondary">
          <h2>Autor: Bartosz Marzol</h2>
        </ion-text>

        <ion-text color="tertiary">
          Wersja aplikacji: <strong>{{ version }}</strong>
        </ion-text>
        <ion-text color="tertiary">
          <h3>Data ostatniej aktualizacji: {{ lastUpdateDate }}</h3>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import PageHeader from '../../components/PageHeader.vue';

const version = 'v1';
const lastUpdateDate = '2026-05-07';
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
