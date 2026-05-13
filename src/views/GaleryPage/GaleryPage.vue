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
import { ref, onMounted, onActivated } from 'vue';
import { Filesystem, Directory } from "@capacitor/filesystem";

const size = ref(6); // Standardowy rozmiar kolumny dla zwykłego ekranu telefonu
const sizeSm = ref(4); // Rozmiar kolumny gdy ekran jest większy niż 576px
const sizeMd = ref(3); // Rozmiar kolumny gdy ekran jest większy niż 768px
const sizeLg = ref(4); // Rozmiar kolumny gdy ekran jest większy niż 992px
const sizeXl = ref(3); // Rozmiar kolumny gdy ekran jest większy niż 1200px

const images = ref([])
const capacitorPlatform = Capacitor.getPlatform()
const isNative = capacitorPlatform === 'android' || capacitorPlatform === 'ios';

async function loadDefaultImages() {
  const res = await fetch('/pictures/manifest.json');
  const files = await res.json();
  files.forEach((pictureFile, i) => {
    images.value.push({ id: i + 1, src: `/pictures/${pictureFile}` })
  });
}

const getPhoto = async (photoName) => {
  if (isNative) {
    const { uri } = await Filesystem.getUri({
      path: photoName,
      directory: Directory.Data,
    });
    return Capacitor.convertFileSrc(uri); // zamienia na webowy URL
  } else {
    const result = await Filesystem.readFile({
      path: photoName,
      directory: Directory.Data,
    });
    return `data:image/jpeg;base64,${result.data}`;
  }
};

async function loadUserImages(){
  try {
    const { files } = await Filesystem.readdir({
      path: 'photos',
      directory: Directory.Data,
    });
    const sortedFiles = files.sort((a, b) => b.name.localeCompare(a.name));
    for (const file of sortedFiles) {
      const src = await getPhoto(`photos/${file.name}`);
      images.value.push({ id: Date.now() + Math.random(), src });
    }
  } catch {
    console.error("Nie można odczytać zdjęć z katalogu.");
  }
}

async function loadAllImages() {
  await loadUserImages();
  await loadDefaultImages();
}

onMounted(loadAllImages);
// onActivated(loadDefaultImages)
</script>

<style scoped>
ion-col {
  color: #fff;
}

#container {
  position: absolute;
}
</style>
