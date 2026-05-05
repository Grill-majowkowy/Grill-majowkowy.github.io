<template>
  <ion-page>
    <PageHeader text="Baza produktów grillowych" />

    <ion-content :fullscreen="true">
      <div id="container">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
          @delete="deleteProduct"
          @edit="editProduct"
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
      v-model="newProduct"
      @addProduct="addOrEditProduct"
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


function addOrEditProduct(newProduct) {
  if (!newProduct.name.trim()) return;
  if (newProduct.id !== null) {
    const product = products.find(p => p.id === newProduct.id);
    product.name = newProduct.name.trim();
    product.description = newProduct.description.trim();
    product.price = newProduct.price ?? 0;
  } else {
    products.push({
      id: Math.random(),
      name: newProduct.name.trim(),
      description: newProduct.description.trim(),
      price: newProduct.price ?? 0,
    });
  }

  newProduct.name = '';
  newProduct.description = '';
  newProduct.price = null;
  closeModal();
}

let newProduct = reactive({ id: null, name: '', description: '', price: null });

function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  newProduct = {...product};
  isAddProductModalVisible.value = true;
}

function deleteProduct(productId) {
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products.splice(index, 1);
  }
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
