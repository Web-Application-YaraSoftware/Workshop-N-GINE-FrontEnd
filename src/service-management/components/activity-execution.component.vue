<script setup>
import ExecutionRequests from "./execution-requests.component.vue";
import ExecutionTracking from "./execution-tracking.component.vue";
import {useWorkshopStore} from "../../shared/services/workshop-store.js";
import {Intervention} from "../model/intervention.entity.js";
import {Task} from "../model/task.entity.js";
import {ProductStock} from "../model/product-stock.entity.js";
import {TaskProductUsage} from "../model/task-product-usage.entity.js";
import {ProductRequest} from "../model/product-request.entity.js";
import {Checkpoint} from "../model/checkpoint.entity.js";
import {TasksService} from "../services/tasks.service.js";
import {ProductStockService} from "../services/product-stock.service.js";
import {TaskProductUsageService} from "../services/task-product-usage.service.js";
import {ProductRequestService} from "../services/product-request.service.js";
import {CheckpointService} from "../services/checkpoint.service.js";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import {computed, onMounted, ref, watch, watchEffect} from "vue";

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
const tasksService = new TasksService();
const productStockService = new ProductStockService();
const taskProductUsageService = new TaskProductUsageService();
const productRequestService = new ProductRequestService();
const checkpointService = new CheckpointService();
const workshopStore = useWorkshopStore();
const productsStock = ref([]);
const productsRequests = ref([]);
const taskProductUsages = ref([]);
const checkpoints = ref([]);
const tasks = ref([]);
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
    getTaskProductUsages();
    getProductRequests();
    getCheckpoint();
  }
});

onMounted(() => {
  getTasks();
  selectedOption.value = options.value[0];
  getProductsStock();
});

function handleTaskChange(task) {
  selectedTask.value = task;
}

function handleOptionChange(option) {
  selectedOption.value = option;
}

function getTasks() {
  tasksService.getAllByMechanicIdAndInterventionId(workshopStore.user.id, props.intervention?.id)
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
  productStockService.getAllByWorkshopId(workshopStore.workshop?.id)
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

function getTaskProductUsages(){
  taskProductUsageService.getAllByTaskId(selectedTask.value.id)
      .then(
          response => {
            taskProductUsages.value = buildTaskProductUsagesFromResponseData(response.data);
          },
          error => {
            console.error(error);
          }
      );
}

function buildTaskProductUsagesFromResponseData(data){
  return data.map(taskProductUsage => new TaskProductUsage(taskProductUsage))
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
  checkpointService.getAllByTaskId(selectedTask.value.id)
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

function onRequestAddTaskProductUsage(taskProductUsage){
  const newTaskProductUsage = new TaskProductUsage();
  newTaskProductUsage.taskId = selectedTask.value.id;
  newTaskProductUsage.productStockId = taskProductUsage.productType;
  newTaskProductUsage.quantityUsed = Number(taskProductUsage.quantity);
  confirm.require({
    message: `Are you sure you want to add the product usage?`,
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
      addTaskProductUsage(newTaskProductUsage);
    }
  });
}

function addTaskProductUsage(taskProductUsage){
  taskProductUsageService.post(taskProductUsage)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Task product usage added successfully', life: 4000});
            getTaskProductUsages();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while adding the task product usage', life: 4000});
          }
      );
}

function onRequestAddProductRequest(productRequest){
  const newProductRequest = new ProductRequest();
  newProductRequest.workshopId = workshopStore.workshop?.id;
  newProductRequest.taskId = selectedTask.value.id;
  newProductRequest.name = productRequest.productType;
  newProductRequest.requestedQuantity = Number(productRequest.quantity);
  newProductRequest.observation = productRequest.description;
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

function onRequestDeleteTaskProductUsage(taskProductUsage){
  confirm.require({
    message: `Are you sure you want to delete the product usage?`,
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
      deleteTaskProductUsage(taskProductUsage);
    }
  });
}

function deleteTaskProductUsage(taskProductUsage){
  taskProductUsageService.delete(taskProductUsage.id)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Task product usage deleted successfully', life: 4000});
            getTaskProductUsages();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the task product usage', life: 4000});
          }
      );
}

function onRequestDeleteProductRequest(productRequest){
  confirm.require({
    message: `Are you sure you want to delete the product request?`,
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
      deleteProductRequest(productRequest);
    }
  });
}

function deleteProductRequest(productRequest){
  productRequestService.delete(productRequest.id)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Product request deleted successfully', life: 4000});
            getProductRequests();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the product request', life: 4000});
          }
      );
}

function onRequestUpdateTaskProductUsage(taskProductUsage){
  confirm.require({
    message: `Are you sure you want to update the product usage?`,
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
      updateTaskProductUsage(taskProductUsage);
    }
  });
}

function updateTaskProductUsage(taskProductUsage){
  taskProductUsageService.put(taskProductUsage.id, taskProductUsage)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Task product usage updated successfully', life: 4000});
            getTaskProductUsages();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while updating the task product usage', life: 4000});
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
      addCheckpoint(checkpoint);
    }
  });
}

function addCheckpoint(checkpoint){
  const newCheckpoint = new Checkpoint();
  newCheckpoint.name = checkpoint;
  newCheckpoint.taskId = selectedTask.value.id;
  checkpointService.post(newCheckpoint)
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
  checkpointService.delete(checkpoint.id)
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
  checkpointService.put(checkpoint.id, checkpoint)
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
  tasksService.put(finishedTask.id, finishedTask)
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
    <pv-tabs style="width: 100%" v-model:value="selectedTaskId" scrollable>
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
        :task-product-usages="taskProductUsages"
        :products-requests="productsRequests"
        @add:taskProductUsage="onRequestAddTaskProductUsage($event)"
        @add:productRequest="onRequestAddProductRequest($event)"
        @delete:taskProductUsage="onRequestDeleteTaskProductUsage($event)"
        @delete:productRequest="onRequestDeleteProductRequest($event)"
        @update:taskProductUsage="onRequestUpdateTaskProductUsage($event)"
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