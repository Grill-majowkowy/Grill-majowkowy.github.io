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
              <div class="image-wrapper">
                <ion-img
                  class="gallery-image" 
                  :src="image.src" 
                  alt="zdjęcie w galerii"
                ></ion-img>
                <ion-button
                  v-if="image.userPhoto"
                  class="delete-btn"
                  fill="solid"
                  color="danger"
                  size="small"
                  @click="deletePhoto(image)"
                >
                  <ion-icon :icon="trashOutline" />
                </ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/vue';
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import PageHeader from '../../components/PageHeader.vue';
import { ref, onMounted, onActivated } from 'vue';
import { Filesystem, Directory } from "@capacitor/filesystem";
import { trashOutline } from 'ionicons/icons';

const size = ref(6); // Standardowy rozmiar kolumny dla zwykłego ekranu telefonu
const sizeSm = ref(4); // Rozmiar kolumny gdy ekran jest większy niż 576px
const sizeMd = ref(3); // Rozmiar kolumny gdy ekran jest większy niż 768px
const sizeLg = ref(4); // Rozmiar kolumny gdy ekran jest większy niż 992px
const sizeXl = ref(3); // Rozmiar kolumny gdy ekran jest większy niż 1200px

const images = ref([])
const capacitorPlatform = Capacitor.getPlatform()
const isNative = capacitorPlatform === 'android' || capacitorPlatform === 'ios';

async function loadDefaultImages() {
  const res = await fetch('/pictures/manifest.json'); // ten manifest jest generowany podczas budowania aplikacji i zawiera listę domyślnych zdjęć które są wrzucone do folderu public/pictures
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
      images.value.push({ id: Date.now() + Math.random(), src, userPhoto: true, path: `photos/${file.name}` });
    }
  } catch {
    console.error("Nie można odczytać zdjęć z katalogu.");
  }
}

async function loadAllImages() {
  await loadUserImages();
  await loadDefaultImages();
}

async function deletePhoto(image) {
  try {
    await Filesystem.deleteFile({
      path: image.path,
      directory: Directory.Data,
    });
    images.value = images.value.filter(i => i.id !== image.id);
  } catch (error) {
    console.error("Nie można usunąć zdjęcia:", error);
  }
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

.image-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  --border-radius: 50%;
  --padding-start: 6px;
  --padding-end: 6px;
  --padding-top: 6px;
  --padding-bottom: 6px;
  opacity: 0.85;
}
</style>
