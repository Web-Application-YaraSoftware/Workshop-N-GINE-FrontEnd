<script setup>
import {ProductRequestService} from "../services/product-request.service.js";
import {onMounted, ref} from "vue";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import {ProductRequest} from "../model/product-request.entity.js";
import ModelMessageDialog from "../../shared/components/model-message-dialog.component.vue";

const requests = ref();
const selectedRequests = ref();
const tasks = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const isDialogVisible = ref(false);
let selectedRequest = ref();
let updatedStatus  = ref();

const inventoryService = new ProductRequestService();

function getRequest(){
  inventoryService.getAllByWorkshopId(1)
      .then(response => {
        requests.value = buildRequestListFromResponseData(response.data);
      });
}

function buildRequestListFromResponseData(requests){
  return requests.map(request => {
    const auxItem = new ProductRequest(request);
    return auxItem;
  });
}


function showUpdateDialog(item, newStatus) {
  isDialogVisible.value = true;
  selectedRequest = item;
  updatedStatus = newStatus
}

function onConfirm() {
  inventoryService.updateRequests(selectedRequest, updatedStatus)
  console.log('Request Rejected',selectedRequest);
  selectedRequest = '';
}
function onReject() {
  console.log('Delete rejected');
  selectedRequest = '';
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
        <pv-column field="name" header="Name" sortable style="width: fit-content"></pv-column>
        <pv-column field="requestedQuantity" header="Amount" sortable style="width: fit-content"></pv-column>
        <pv-column field="requestedDate" header="Date" sortable style="width: fit-content"></pv-column>
        <pv-column field="observation" header="Observation" sortable style="width: fit-content"></pv-column>
        <pv-column :exportable="false" style="width: min-content">
          <template #body="slotProps">

            <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="showUpdateDialog(slotProps.data, 1)"/>
            <pv-button icon="pi pi-pencil" outlined rounded severity="success" @click="showUpdateDialog(slotProps.data, 2)"/>

          </template>
        </pv-column>
      </pv-datatable>
      <ModelMessageDialog :visible="isDialogVisible"
                          title="Delete Confirmation"
                          message="Are you sure you want to delete this request?"
                          @confirm="onConfirm"
                          @reject="onReject"
                          @update:visible="isDialogVisible = $event"/>
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