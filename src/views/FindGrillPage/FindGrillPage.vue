<template>
  <ion-page>
    <PageHeader text="Zlokalizuj Grilla" />

    <ion-content :fullscreen="true">
      <div id="map-container" ref="mapContainer"></div>

      <div id="locate-btn-wrapper">
        <ion-button expand="block" @click="locateMe" :disabled="loading">
          <ion-spinner v-if="loading" name="crescent" slot="start" />
          <ion-icon v-else :icon="locationOutline" slot="start" />
          Lokalizuj
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { IonContent, IonPage, IonButton, IonSpinner, IonIcon, toastController } from '@ionic/vue';
import { locationOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PageHeader from '../../components/PageHeader.vue';

// Naprawia problem z ikonami Leaflet w Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const mapContainer = ref(null);
const loading = ref(false);
let map = null;
let marker = null;

onMounted(async () => {
  await nextTick();
  map = L.map(mapContainer.value).setView([52.2297, 21.0122], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  setTimeout(() => map && map.invalidateSize(), 200);
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

// W trybie webowym użyty jest toast z Ionic, w natywnym - z Capacitor
async function showToast(message) {
  if (Capacitor.isNativePlatform()) {
    await Toast.show({ text: message, duration: 'long' });
  } else {
    const toast = await toastController.create({
      message,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }
}

async function locateMe() {
  await showToast('Pobieranie lokalizacji...');
  loading.value = true;
  try {
    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    const { latitude, longitude } = position.coords;

    map.setView([latitude, longitude], 15);

    if (marker) {
      marker.setLatLng([latitude, longitude]);
    } else {
      marker = L.marker([latitude, longitude]).addTo(map);
    }

    marker.bindPopup(`Twoja lokalizacja:<br/>${latitude.toFixed(5)}, ${longitude.toFixed(5)}`).openPopup();

    await showToast(`Znaleziono lokalizację: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
  } catch (err) {
    await showToast(`Nie udało się pobrać lokalizacji: ${err.message}`);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
:deep(ion-content::part(scroll)) {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#map-container {
  flex: 1;
  min-height: 0;
  width: 100%;
}

#locate-btn-wrapper {
  padding: 12px 16px;
  flex-shrink: 0;
}
</style>
