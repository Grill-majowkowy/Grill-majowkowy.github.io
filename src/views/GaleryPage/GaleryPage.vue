<template>
  <ion-page>
    <PageHeader text="Galeria" />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-grid>
          <ion-row>
            <ion-col
              v-for="image in images"
              :size="size"  
              :size-sm="sizeSm" 
              :size-md="sizeMd" 
              :size-lg="sizeLg"
              :size-xl="sizeXl"
              :key="image.id"
            >
              <img :src="image.src" class="gallery-image" />
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import PageHeader from '../../components/PageHeader.vue';
import { ref, onMounted, onActivated } from 'vue'

const size = ref(6); // Standardowy rozmiar kolumny dla zwykłego ekranu telefonu
const sizeSm = ref(4); // Rozmiar kolumny gdy ekran jest większy niż 576px
const sizeMd = ref(3); // Rozmiar kolumny gdy ekran jest większy niż 768px
const sizeLg = ref(4); // Rozmiar kolumny gdy ekran jest większy niż 992px
const sizeXl = ref(3); // Rozmiar kolumny gdy ekran jest większy niż 1200px

const images = ref([])

async function loadImages() {
  const res = await fetch('/pictures/manifest.json');
  const files = await res.json();
  images.value = files.map((pictureFile, i) => ({ id: i + 1, src: `/pictures/${pictureFile}` }));
}

onMounted(loadImages)
onActivated(loadImages)
</script>

<style scoped>
ion-col {
  color: #fff;
}

#container {
  position: absolute;
}
</style>
