<template>
  <ion-page>
    <PageHeader text="Baza produktów grillowych" />

    <ion-content :fullscreen="true">
      <div id="container">
        <ProductCard 
          v-for="product in products" 
          v-model="newProduct"
          :key="product.id" 
          :product="product"
        />
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="isAddProductModalVisible = !isAddProductModalVisible">
          <ion-icon :icon="isAddProductModalVisible ? closeOutline : addOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <AddProductModal
      :isVisible="isAddProductModalVisible"
      @addProduct="addProduct"
      @closeModal="closeModal"
    />
  </ion-page>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {
  IonContent, IonPage,
  IonList, IonItem, IonInput, IonButton, IonButtons,
  IonFab, IonFabButton, IonIcon,
  IonModal, IonHeader, IonToolbar, IonTitle,
} from '@ionic/vue';
import { addOutline, closeOutline } from 'ionicons/icons';
import PageHeader from '../../components/PageHeader.vue';
import ProductCard from './ProductCard.vue';
import AddProductModal from './AddProductModal.vue';

const isAddProductModalVisible = ref(false);

const products = reactive([
  { id: 1, name: 'Kiełbasa', description: 'Tradycyjna kiełbasa z grilla', price: 10 },
  { id: 2, name: 'Stek', description: 'Soczysty stek z grilla', price: 25 },
  { id: 3, name: 'Warzywa', description: 'Grillowane warzywa sezonowe', price: 15 },
]);


function addProduct(newProduct) {
  if (!newProduct.name.trim()) return;
  products.push({
    id: Date.now(),
    name: newProduct.name.trim(),
    description: newProduct.description.trim(),
    price: newProduct.price ?? 0,
  });
  newProduct.name = '';
  newProduct.description = '';
  newProduct.price = null;
  closeModal();
}

function closeModal() {
  isAddProductModalVisible.value = false;
}
</script>

<style scoped>
#container {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.submit-btn {
  margin-top: 12px;
}

.submit-btn {
  margin-top: 12px;
}
</style>
