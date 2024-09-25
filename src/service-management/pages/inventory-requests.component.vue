<script setup>
import {InventoryRequestService} from "../services/inventory-request.service.js";
import {onMounted, ref} from "vue";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import {InventoryRequest} from "../model/inventory-request.entity.js";

const inventoryRequest = ref({});
const requests = ref();
const selectedRequests = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const messageDialog = ref(false)

const deleteRequestDialog = ref(false);

const inventoryService = new InventoryRequestService();

function getRequest(){
  inventoryService.getAll()
      .then(response => {
        requests.value = buildRequestListFromResponseData(response.data);
      });
}

function buildRequestListFromResponseData(requests){
  return requests.map(request => {
    const auxItem = new InventoryRequest(request);
    return auxItem;
  });
}

function confirmDeleteSelected(request){
  let deleteRequestDialog;
  deleteRequestDialog.value = true;
}

function confirmDeleteRequest(request){
  inventoryRequest.value = request;
  messageDialog.value = true;
}

onMounted(() => {
  getRequest();
});

</script>

<template>
  <div class="items">
    <section class="table-container">
      <pv-datatable
          class="table"
          ref="dt"
          v-model:selection="selectedRequests"
          :value="requests"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} requests"
      >
        <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
        <pv-column field="description" header="Description" sortable style="width: fit-content"></pv-column>
        <pv-column field="amount" header="Quantity" sortable style="width: fit-content"></pv-column>
        <pv-column field="state.name" header="State" sortable style="width: fit-content"></pv-column>
        <pv-column :exportable="false" style="width: min-content">
          <template #body="slotProps">

            <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteRequest(slotProps.data)"/>

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