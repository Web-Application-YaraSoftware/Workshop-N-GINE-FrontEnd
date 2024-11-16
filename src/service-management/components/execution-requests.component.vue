<script setup>
import {computed, onMounted, ref} from "vue";
//productType es un productId
const props = defineProps({
  productsStock: {
    type: Array,
    required: true,
    default: []
  },
  productsRequests: {
    type: Array,
    required: true,
    default: []
  }
});
const emit = defineEmits([
    'add:productRequest', 'update:productRequest'
]);
const productRequestsWithProductName = computed(() => {
  return props.productsRequests.map(productsRequest => {
    const product = props.productsStock.find(product => product.id === productsRequest.productId);
    return {
      ...productsRequest,
      productName: product ? product.name : 'Unknown'
    };
  });
});
const requestedProduct = ref({
  productType: 0,
  quantity: 0,
  description: ""
});
const isRequestProduct = computed(() => typeof requestedProduct.value.productType == 'number' && requestedProduct.value.productType !== 0);
const availableAmount = computed(() => {
  console.log(requestedProduct.value.productType)
  const product = props.productsStock.find(product => product.id === requestedProduct.value.productType);
  return product ? product.stockQuantity : 0;
});
const loading = ref(false);
const options = ref(['From stock', 'Requested']);
const selectedOption = ref();
const editingRowsStock = ref([]);
const editingRowsRequests = ref([]);

onMounted(() => {
  selectedOption.value = options.value[0];
});

function onSubmit(){
  loading.value = true;
  requestAddProductRequest();
  loading.value = false;
}

function requestAddProductRequest(){
  if (isRequestProduct.value) {
    emit('add:productRequest', requestedProduct.value);
    resetForm();
  }
}

function resetForm(){
  requestedProduct.value = {
    productType: 0,
    quantity: 0,
    description: ""
  };
}


function onRowEditSaveRequest(event){
if (event.data.requestedQuantity !== event.newData.requestedQuantity)
    emit('update:productRequest', event.newData);
}


function handleOptionChange(option) {
  selectedOption.value = option;
}


</script>

<template>
  <div class="content">
    <form class="form" @submit.prevent="onSubmit">
      <pv-inputgroup>
        <pv-inputgroupaddon>
          <i class="pi pi-cog"></i>
        </pv-inputgroupaddon>
        <pv-select
            v-model="requestedProduct.productType"
            editable
            :options="productsStock"
            optionValue="id"
            showClear
            filter
            optionLabel="name"
            placeholder="Select a part"
        />
      </pv-inputgroup>
      <pv-inputgroup  v-if="isRequestProduct">
        <pv-inputgroupaddon>
          <i class="pi pi-bars"></i>
        </pv-inputgroupaddon>
        <pv-inputtext disabled :value="'Total available: '+ availableAmount"/>
      </pv-inputgroup>
      <pv-inputgroup>
        <pv-inputgroupaddon>
          <i class="pi pi-bars"></i>
        </pv-inputgroupaddon>
        <pv-inputtext type="number" min="1" v-model="requestedProduct.quantity"/>
      </pv-inputgroup>

      <pv-button class="add-button" type="submit" label="Add" icon="pi pi-plus" :loading="loading"/>
    </form>
    <pv-tabs class="options" :value="options[0]">
      <pv-tablist>
        <pv-tab v-for="option in options" :key="option" :value="option" @click="handleOptionChange(option)">{{option}}</pv-tab>
      </pv-tablist>
    </pv-tabs>
    <div v-if="selectedOption === options[0]" class="table">
      <pv-datatable
          v-model:editingRows="editingRowsStock"
          :value="productsStock"
          editMode="row"
          dataKey="id"
          scrollable
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 15]"
      >
        <pv-column field="name" header="Part" style="width: 20rem">
          <template #body="{data}">{{data.name}}</template>
          <template #editor="{data, field}">
            <pv-select v-model="data.id" :options="productsStock" optionLabel="name" optionValue="id" placeholder="Select a product stock" fluid>
              <template #option="{option}">
                <div>{{option.name}}</div>
              </template>
            </pv-select>
          </template>
        </pv-column>
        <pv-column field="stockQuantity" header="Quantity" style="width: 3rem">
          <template #editor="{data, field}">
            <pv-inputtext type="number" min="1" v-model="data[field]"/>
          </template>
        </pv-column>
      </pv-datatable>
    </div>
    <div v-if="selectedOption === options[1]" class="table">
      <pv-datatable
          v-model:editingRows="editingRowsRequests"
          :value="productRequestsWithProductName"
          editMode="row"
          dataKey="id"
          scrollable
          @row-edit-save="onRowEditSaveRequest"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 15]"
      >
        <pv-column field="productName" header="Part" style="width: 20rem">
          <template #body="{data}">{{data.productName}}</template>
        </pv-column>
        <pv-column field="requestedQuantity" header="Quantity" style="width: 3rem">
          <template #editor="{data, field}">
            <pv-inputtext type="number" min="1" v-model="data[field]"/>
          </template>
        </pv-column>
        <pv-column style="width: 2.5rem" :rowEditor="true"/>
      </pv-datatable>
    </div>
  </div>

</template>

<style scoped>
.content{
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form{
  width: auto;
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.add-button{
  width: fit-content;
}
.table{
  width: 100%;
  max-width: 30rem;
}
.options{
  width: auto;
  max-width: 30rem;
}
</style>