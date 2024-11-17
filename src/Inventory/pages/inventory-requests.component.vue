<script setup>
import {ProductRequestService} from "../services/product-request.service.js";
import {onMounted, ref} from "vue";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import {ProductRequest} from "../model/product-request.entity.js";
import ModelMessageDialog from "../../shared/components/model-message-dialog.component.vue";
import {ProductRequestState} from "../model/product-request-state.enum.js";
import {ProductStockService} from "../services/product-stock.service.js";

const requests = ref();
const selectedRequests = ref();
const tasks = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const isDialogVisible = ref(false);
let selectedRequest = ref();
let updatedStatus  = ref();
let dialogTitle = ref();
let dialogMessage = ref();



const inventoryRequestService = new ProductRequestService();
const inventoryProductService = new ProductStockService();

function getRequest() {
  Promise.all([
    inventoryRequestService.getAllByWorkshopId(1),
    inventoryProductService.getAllByWorkshopId(1)
  ])
      .then(([requestsResponse, productStocksResponse]) => {
        const productStocks = productStocksResponse.data.reduce((acc, productStock) => {
          acc[productStock.id] = productStock.name;
          return acc;
        }, {});
        requests.value = buildRequestListFromResponseData(requestsResponse.data, productStocks);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
}

function buildRequestListFromResponseData(requests, productStocks) {
  return requests
      .filter(request => request.status === ProductRequestState.getName(1))
      .map(request => {
        const productRequest = new ProductRequest(request);
        productRequest.productName = productStocks[request.productId] || 'Unknown';
        return productRequest;
      });
}


function showUpdateDialog(item, newStatus) {
  isDialogVisible.value = true;
  selectedRequest = item;
  updatedStatus = newStatus
  if(newStatus === 3) {
    dialogTitle = 'Reject Confirmation';
    dialogMessage = 'Are you sure you want to reject this request?';
  }
  else if (newStatus === 2) {
    dialogTitle = 'Approve Confirmation';
    dialogMessage = 'Are you sure you want to approve this request?';
  }
}

function onConfirm() {
  if (updatedStatus === 2) {
    inventoryRequestService.acceptRequest(selectedRequest.id)
  }
  else if (updatedStatus === 3) {
    inventoryRequestService.rejectRequest(selectedRequest.id)
  }
  selectedRequest = '';
}
function onReject() {
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
        <pv-column field="requestedQuantity" header="Requested Quantity" sortable style="width: fit-content"></pv-column>
        <pv-column field="productName" header="Product" sortable style="width: fit-content"></pv-column>

        <pv-column :exportable="false" style="width: min-content">
          <template #body="slotProps">

            <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="showUpdateDialog(slotProps.data, 3)"/>
            <pv-button icon="pi pi-pencil" outlined rounded severity="success" @click="showUpdateDialog(slotProps.data, 2)"/>

          </template>
        </pv-column>
      </pv-datatable>
      <ModelMessageDialog :visible="isDialogVisible"
                          :title="dialogTitle"
                          :message="dialogMessage"
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