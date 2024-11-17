<script setup>
import ExecutionRequests from "./execution-requests.component.vue";
import ExecutionTracking from "./execution-tracking.component.vue";
import {Intervention} from "../model/intervention.entity.js";
import {Task} from "../model/task.entity.js";
import {ProductStock} from "../../Inventory/model/product-stock.entity.js";
import {ProductRequest} from "../../Inventory/model/product-request.entity.js";
import {Checkpoint} from "../model/checkpoint.entity.js";
import {ProductStockService} from "../../Inventory/services/product-stock.service.js";
import {ProductRequestService} from "../../Inventory/services/product-request.service.js";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import {computed, onMounted, ref, watch, watchEffect} from "vue";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {InterventionsService} from "../services/interventions.service.js";
import {ProfilesService} from "../../profile-management/services/profiles.service.js";

const confirm = useConfirm();
const toast = useToast();
const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  },
  parentAction: Boolean
});
const interventionService = new InterventionsService();
const productStockService = new ProductStockService();
const productRequestService = new ProductRequestService();
const profileService = new ProfilesService();
const authenticationStore = useAuthStore();
const productsStock = ref([]);
const productsRequests = ref([]);
const checkpoints = ref([]);
const tasks = ref([]);
const profile = ref(null);
const totalTasks = computed(() => tasks.value.length);
const selectedTask = ref();
const selectedTaskId = computed(() => selectedTask.value? selectedTask.value?.id: 0);
const options = ref(['Requests', 'Tracking']);
const selectedOption = ref();

watch(() => props.intervention,
    () => {
      getTasks();
    }, {immediate: true}
);

watch(()=>props.parentAction, () => {
  getTasks();
});

watchEffect(() => {
  if (selectedTask.value !== 0 && selectedTask.value) {
    getProductRequests();
    getCheckpoint();
  }
});

onMounted(() => {
  getProfile();
  getTasks();
  selectedOption.value = options.value[0];
  getProductsStock();
});

function handleTaskChange(task) {
  selectedTask.value = task;
}

function handleTabChange(newTaskId) {
  const task = tasks.value.find(task => task.id === newTaskId);
  if (task) {
    handleTaskChange(task);
  }
}


function handleOptionChange(option) {
  selectedOption.value = option;
}

async function getProfile() {
  try {
    const response = await profileService.getProfileByUserId(authenticationStore.user.id);
    profile.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getTasks() {
  await getProfile();
  interventionService.getAllTasksByMechanicIdAndInterventionId(profile.value.id, props.intervention?.id)
      .then(
          response => {
            tasks.value = buildTasksFromResponseData(response.data);
            selectedTask.value = tasks.value[0];
          },
          error => {
            console.error(error);
          }
      );
}

function buildTasksFromResponseData(data){
  return data.map(task => new Task(task))
}

function getProductsStock(){
  productStockService.getAllByWorkshopId(authenticationStore.user.workshopId)
      .then(
          response => {
            productsStock.value = buildProductsStockFromResponseData(response.data);
          },
          error => {
            console.error(error);
          }
      );
}

function buildProductsStockFromResponseData(data){
  return data.map(productStock => new ProductStock(productStock))
}

function getProductRequests(){
  productRequestService.getAllByTaskId(selectedTask.value.id)
      .then(
          response => {
            productsRequests.value = buildProductsRequestsFromResponseData(response.data);
          },
          error => {
            console.error(error);
          }
      );
}

function buildProductsRequestsFromResponseData(data){
  return data.map(productRequest => new ProductRequest(productRequest))
}

function getCheckpoint(){
  interventionService.getAllCheckpointsByInterventionIdAndTaskId(selectedTask.value.id, props.intervention?.id)
      .then(
          response => {
            checkpoints.value = buildCheckpointsFromResponseData(response.data);
          },
          error => {
            console.error(error);
          }
      );
}

function buildCheckpointsFromResponseData(data){
  return data.map(checkpoint => new Checkpoint(checkpoint))
}


function onRequestAddProductRequest(productRequest){
  const newProductRequest = new ProductRequest();
  newProductRequest.workshopId = authenticationStore.user.workshopId;
  newProductRequest.taskId = selectedTask.value.id;
  newProductRequest.productId = productRequest.productType;
  newProductRequest.requestedQuantity = Number(productRequest.quantity);

  confirm.require({
    message: `Are you sure you want to add the product request?`,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small'
    },
    acceptProps: {
      label: 'Save',
      icon: 'pi pi-check',
      size: 'small'
    },
    accept: () => {
      addProductRequest(newProductRequest);
    }
  });
}

function addProductRequest(productRequest){
  productRequestService.post(productRequest)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Product request added successfully', life: 4000});
            getProductRequests();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while adding the product request', life: 4000});
          }
      );
}


function onRequestUpdateProductRequest(productRequest){
  confirm.require({
    message: `Are you sure you want to update the product request?`,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small'
    },
    acceptProps: {
      label: 'Save',
      icon: 'pi pi-check',
      size: 'small'
    },
    accept: () => {
      updateProductRequest(productRequest);
    }
  });
}

function updateProductRequest(productRequest){
  productRequestService.put(productRequest.id, productRequest)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Product request updated successfully', life: 4000});
            getProductRequests();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while updating the product request', life: 4000});
          }
      );
}

function onRequestAddCheckpoint(checkpoint){
  const newCheckpoint ={
    "name": checkpoint
  }
  confirm.require({
    message: `Are you sure you want to add the checkpoint?`,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small'
    },
    acceptProps: {
      label: 'Save',
      icon: 'pi pi-check',
      size: 'small'
    },
    accept: () => {
      addCheckpoint(newCheckpoint);
    }
  });
}

function addCheckpoint(checkpoint){
  interventionService.postCheckpoint(checkpoint, selectedTask.value.id, props.intervention?.id)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Checkpoint added successfully', life: 4000});
            getCheckpoint();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while adding the checkpoint', life: 4000});
          }
      );
}

function onRequestDeleteCheckpoint(checkpoint){
  console.log(checkpoint);
  confirm.require({
    message: `Are you sure you want to delete the checkpoint?`,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small'
    },
    acceptProps: {
      label: 'Delete',
      icon: 'pi pi-trash',
      class: 'p-button-danger',
      size: 'small'
    },
    accept: () => {
      deleteCheckpoint(checkpoint);
    }
  });
}

function deleteCheckpoint(checkpoint){
  interventionService.deleteCheckpoint(checkpoint.id, selectedTask.value.id, props.intervention?.id)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Checkpoint deleted successfully', life: 4000});
            getCheckpoint();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the checkpoint', life: 4000});
          }
      );
}

function onRequestUpdateCheckpoint(checkpoint){
  confirm.require({
    message: `Are you sure you want to update the checkpoint?`,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small'
    },
    acceptProps: {
      label: 'Save',
      icon: 'pi pi-check',
      size: 'small'
    },
    accept: () => {
      updateCheckpoint(checkpoint);
    }
  });
}

function updateCheckpoint(checkpoint){
  interventionService.putCheckpoint(checkpoint.id, selectedTask.value.id, props.intervention?.id, checkpoint)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Checkpoint updated successfully', life: 4000});
            getCheckpoint();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while updating the checkpoint', life: 4000});
          }
      );
}

function onFinishTask(){
  confirm.require({
    message: `Are you sure you want to finish the task?`,
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small'
    },
    acceptProps: {
      label: 'Finish',
      icon: 'pi pi-check',
      size: 'small'
    },
    accept: () => {
      finishTask();
    }
  });
}

function finishTask(){
  const finishedTask = new Task(selectedTask.value);
  finishedTask.finishTask();
  interventionService.putTask(finishedTask.id, finishedTask, props.intervention?.id)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Task finished successfully', life: 4000});
            goNextTask();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while finishing the task', life: 4000});
          }
      );
}

function goNextTask(){
  const currentTaskIndex = tasks.value.findIndex(task => task?.id === selectedTask.value.id);
  if (currentTaskIndex < totalTasks.value - 1) {
    selectedTask.value = tasks.value[currentTaskIndex + 1];
  }
}

</script>

<template>
  <div class="content" v-if="totalTasks>0">
    <pv-tabs style="width: 100%" :value="selectedTaskId" @update:value="handleTabChange" scrollable>
      <pv-tablist>
        <pv-tab
            v-for="(task, index) in tasks"
            :key="task.id"
            :value="task.id"
            @click="handleTaskChange(task)"
        >Task {{index + 1}}</pv-tab>
      </pv-tablist>
    </pv-tabs>
    <div class="second-header">
      <pv-tabs class="options" :value="options[0]" scrollable>
        <pv-tablist>
          <pv-tab
              v-for="option in options"
              :key="option"
              :value="option"
              @click="handleOptionChange(option)"
          >{{option}}</pv-tab>
        </pv-tablist>
      </pv-tabs>
      <pv-button @click="onFinishTask">Finish</pv-button>
    </div>
    <execution-requests
        v-if="selectedOption === options[0]"
        :products-stock="productsStock"
        :products-requests="productsRequests"
        @add:productRequest="onRequestAddProductRequest($event)"
        @update:productRequest="onRequestUpdateProductRequest($event)"
    />
    <execution-tracking
        v-if="selectedOption === options[1]"
        :checkpoints="checkpoints"
        @add:checkpoint="onRequestAddCheckpoint($event)"
        @delete:checkpoint="onRequestDeleteCheckpoint($event)"
        @update:checkpoint="onRequestUpdateCheckpoint($event)"
    />
  </div>
</template>

<style scoped>
.content{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.second-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.options{
  flex-grow: 1;
}
</style>