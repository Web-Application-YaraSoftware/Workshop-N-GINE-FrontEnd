<script setup>
import {InventoryItemService} from "../services/inventory-item.service.js";
import {onMounted, ref} from "vue";
import {FilterMatchMode} from '@primevue/core/api';
import {useToast} from 'primevue/usetoast';
import {InventoryItem} from "../model/inventory-item.entity.js";

const inventoryItem = ref({});
const items = ref();
const selectedItems = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});


const messageDialog = ref(false)
const deleteItemsDialog = ref(false);

const inventoryService = new InventoryItemService();

function getItems() {
  inventoryService.getAll()
      .then(response => {
        items.value = buildItemListFromResponseData(response.data);
      });
}

function buildItemListFromResponseData(items) {
  return items.map(item => {
    const auxItem = new InventoryItem(item);
    return auxItem;
  });
}

function confirmDeleteSelected(item) {
  let deleteItemsDialog;
  deleteItemsDialog.value = true;
}

function confirmDeleteItem(item){
  inventoryItem.value = item;
  messageDialog.value = true;
}

onMounted(() => {
  getItems();
});

</script>

<template>
  <div class="items">
    <section class="table-container">
      <pv-datatable
          class="table"
          ref="dt"
          v-model:selection="selectedItems"
          :value="items"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
      >
        <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
        <pv-column field="name" header="Name" sortable style="width: fit-content"></pv-column>
        <pv-column field="amount" header="Quantity" sortable style="width: fit-content"></pv-column>
        <pv-column :exportable="false" style="width: min-content">
          <template #body="slotProps">
            <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteItem(slotProps.data)"/>
          </template>
        </pv-column>
      </pv-datatable>
    </section>
  </div>
</template>

<style scoped>
.items {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.table {
  min-width: fit-content;
}
</style>