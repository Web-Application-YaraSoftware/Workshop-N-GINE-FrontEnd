<script setup>
import {ProductStockService} from "../services/product-stock.service.js";
import {onMounted, ref} from "vue";
import {FilterMatchMode} from '@primevue/core/api';
import {useToast} from 'primevue/usetoast';
import {ProductStock} from "../model/product-stock.entity.js";
import {ProductTypeService} from "../services/product-type.service.js";
import ModelMessageDialog from "../../shared/components/model-message-dialog.component.vue";
import EditProductStockDialog from "../components/edit-product-stock-dialog.component.vue";


const toast = useToast();
const items = ref();
const selectedItems = ref();
const types = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const inventoryService = new ProductStockService();
const productTypeService = new ProductTypeService()

const deleteDialogVisible = ref(false);
const editDialogVisible = ref(false);
let modifieditem = ref();

function getProductType() {
  return productTypeService.getAll()
      .then(response => {
        types.value = response.data;
      });
}

function getItems() {
  inventoryService.getAllByWorkshopId(1)
      .then(response => {
        items.value = buildItemListFromResponseData(response.data);
        console.log(items.value)
      });
}

function buildItemListFromResponseData(items) {
  return items.map(item => {
    const auxItem = new ProductStock(item);
    const matchingType = types.value.find(type => type.id === auxItem.id);
    auxItem.productType = matchingType;

    return auxItem;
  });
}


function showDeleteDialog(item) {
  deleteDialogVisible.value = true;
  modifieditem = item;
}

function onConfirm() {
  inventoryService.delete(modifieditem.id)
  console.log('Item deleted',modifieditem);
  modifieditem = '';
}
function onReject() {
  console.log('Delete rejected');
  modifieditem = '';
}

function showEditDialog(item) {
  editDialogVisible.value = true;

  modifieditem = item;
}


onMounted(() => {
  getProductType();
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
        <pv-column field="name" header="Name" sortable style="width: fit-content"></pv-column>
        <pv-column field="productType.name" header="Type" sortable style="width: fit-content"></pv-column>
        <pv-column field="amount" header="Quantity" sortable style="width: fit-content"></pv-column>
        <pv-column field="limit" header="Limit" sortable style="width: fit-content"></pv-column>
        <pv-column :exportable="false" style="width: min-content">
          <template #body="slotProps">
            <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="showDeleteDialog(slotProps.data)"/>
            <br>
            <pv-button icon="pi pi-pencil" outlined rounded severity="success" @click="showEditDialog(slotProps.data)"/>
          </template>
        </pv-column>
      </pv-datatable>

      <ModelMessageDialog :visible="deleteDialogVisible"
                          title="Delete Confirmation"
                          message="Are you sure you want to delete this item?"
                          @confirm="onConfirm"
                          @reject="onReject"
                          @update:visible="deleteDialogVisible = $event"/>

      <edit-product-stock-dialog :visible="editDialogVisible"
                                 :product="modifieditem"
                                 @update:visible="editDialogVisible = $event"/>
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