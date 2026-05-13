<template>
  <ion-page>
    <PageHeader text="Zrób zdjęcie swojej kiełbasy (na grillu)" />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-text color="primary">
          <h1>Aktualny tryb capacitor: {{ capacitorPlatform }}</h1>
        </ion-text>
        <ion-button @click="takePhoto">Zrób zdjęcie</ion-button>
        <ion-button fill="outline" @click="openGallery">Otwórz galerię</ion-button>
        <div v-if="lastPhoto" style="margin-top: 20px;">
          <ion-img
            class="image-style"
            :src="lastPhoto"
            alt="Ostatnie zdjęcie kiełbasy które zrobiłeś"
          ></ion-img>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonText,
} from "@ionic/vue";
import { IonCol, IonGrid, IonRow } from "@ionic/vue";
import PageHeader from "../../components/PageHeader.vue";
import { ref, onMounted } from "vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";

const capacitorPlatform = Capacitor.getPlatform()
const isNative = capacitorPlatform === 'android' || capacitorPlatform === 'ios';
const lastPhoto = ref(null);

const savePhoto  = async (photo) => {
  try {
    const photoName = `photos/${Date.now()}.jpeg`;
    if (isNative) {
      await Filesystem.copy({
          from: photo.path,
          to: photoName,
          directory: Directory.Data,
        });
    } else {
      await Filesystem.writeFile({
          path: photoName,
          data: photo.base64String,
          directory: Directory.Data,
          recursive: true,
        });
    }
  } catch (error) {
    console.error("Błąd podczas zapisywania zdjęcia:", error);
    alert("Nie udało się zapisać zdjęcia. Spróbuj ponownie.");
  }
}

// Na telefonie uruchomi aparat, a na komputerze otworzy okno wyboru pliku
// Natywnie jest to obsługiwane przez Capacitor, więc nie musimy się martwić o różnice między platformami
const takePhoto = async () => {
  let photo;
  try {
    photo = await Camera.getPhoto({
      // natywnie korzysta z lepszego trybu, w przeglądarce zeby zapisac musimy miec base64, bo nie ma dostępu do zmiennej path w przeglądarce
      resultType: isNative ? CameraResultType.Uri : CameraResultType.Base64, 
      quality: 90, // spoko jakość jeszcze, ale rozmiar mniejszy
      saveToGallery: false, // nie zapisujemy do galerii, zdjęcie tylko na uzytek aplikacji
    });
  } catch (error) {
    console.error("Błąd podczas robienia zdjęcia:", error);
    alert("Nie udało się zrobić zdjęcia. Spróbuj ponownie.");
  }
  if (photo) {
    lastPhoto.value = isNative ? photo.webPath : `data:image/jpeg;base64,${photo.base64String}`;
    await savePhoto(photo);
  };
  
};

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

const openGallery = () => {
  window.location.href = "/galeria/";
};

// Po starcie aplikacji szukane jest w pamięci ostatnie zrobione zdjecie i wyświetlane tutaj
onMounted(async () => {
  try {
    const { files } = await Filesystem.readdir({
      path: 'photos',
      directory: Directory.Data,
    });
    if (files.length > 0) {
      const latest = files.sort((a, b) => b.name.localeCompare(a.name))[0];
      lastPhoto.value = await getPhoto(`photos/${latest.name}`);
    }
  } catch {
    console.error("Nie można odczytać zdjęcia z katalogu.");
  }
});

</script>

<style scoped>
#container {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-style {
  max-width: 90%; 
  border-radius: 8px;
  border: 4px solid #646464;
  justify-self: center;
}
</style>
