<script setup>
import {ProductStock} from "../model/product-stock.entity.js";
import {ProductStockService} from "../services/product-stock.service.js";

const props = defineProps({
  title: {
    type: String,
    default: "Edit"
  },
  product: {
    type: ProductStock,
    required: true
  },
  visible:{
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'reject', 'update:visible'])
const inventoryService = new ProductStockService();

function onConfirm(){
  inventoryService.update(props.product.id, props.product)
  console.log(props.product)
  emit('update:visible', false);
}

function onReject(){
  emit('update:visible', false);
}

</script>


<template>
  <pv-dialog v-model:visible="props.visible" :style="{ width: '30rem' }" :header="props.title" :modal="true">
    <section class="form-section">
      <h4>Name</h4>
      <pv-inputtext v-model="props.product.name" class="input-field" required />
    </section>

    <section class="form-section">
      <h4>Type</h4>
      <pv-inputtext v-model="props.product.productType.name" class="input-field" required />
    </section>

    <section class="form-section">
      <h4>Amount</h4>
      <pv-inputtext v-model="props.product.amount" class="input-field" required />
    </section>

    <section class="form-section">
      <h4>Limit</h4>
      <pv-inputtext v-model="props.product.limit" class="input-field" required />
    </section>

    <template #footer>
      <pv-button label="No" icon="pi pi-times" text @click="onReject" />
      <pv-button label="Yes" icon="pi pi-check" @click="onConfirm" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.input-field {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

template[slot="footer"] {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

</style>
