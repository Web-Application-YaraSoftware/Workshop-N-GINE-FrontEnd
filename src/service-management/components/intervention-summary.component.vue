<script setup>
import { ref, onMounted } from 'vue';
import { Intervention } from "../model/intervention.entity.js";
import { CheckpointService } from "../services/checkpoint.service.js";
import { TaskProductUsageService } from "../services/task-product-usage.service.js";
import { ProductStockService } from "../services/product-stock.service.js";
import TaskDetail from "./task-detail.component.vue";

const props = defineProps({
  intervention: Intervention,
  tasks: Array
});

const checkpointsMap = ref({});
const taskProductUsagesMap = ref({});

const checkpointService = new CheckpointService();
const taskProductUsageService = new TaskProductUsageService();
const productStockService = new ProductStockService();

function loadCheckpointsForTasks() {
  props.tasks.forEach(task => {
    checkpointService.getAllByTaskId(task.id).then(response => {
      checkpointsMap.value[task.id] = response.data || [];
    });
  });
}

function getCheckpoints(taskId) {
  return checkpointsMap.value[taskId] || [];
}

function loadProductUsagesForTasks() {
  props.tasks.forEach(task => {
    loadTaskProductUsages(task);
  });
}

function loadTaskProductUsages(task) {
  taskProductUsageService.getAllByTaskId(task.id).then(response => {
    const productUsages = response.data || [];
    productUsages.forEach(productUsage => {
      loadProductStockForTask(task.id, productUsage);
    });
  });
}

function loadProductStockForTask(taskId, productUsage) {
  productStockService.getById(productUsage.productStockId).then(productStockResponse => {
    const productStock = productStockResponse.data;

    if (!taskProductUsagesMap.value[taskId]) {
      taskProductUsagesMap.value[taskId] = [];
    }

    taskProductUsagesMap.value[taskId].push({
      name: productStock.name,
      quantityUsed: productUsage.quantityUsed
    });
  });
}

function getProductUsages(taskId) {
  return taskProductUsagesMap.value[taskId] || [];
}

onMounted(() => {
  loadCheckpointsForTasks();
  loadProductUsagesForTasks();
});
</script>

<template>
  <div class="summary-container">
    <h2>Intervention Summary</h2>
    <p>Registration Date: {{ new Date(intervention.registrationDate).toLocaleDateString() }}</p>
    <p>Completion Date: {{ new Date(intervention.completionDate).toLocaleDateString() }}</p>
    <p>{{ intervention.description }}</p>

    <h3 class="task-title">Tasks</h3>

    <task-detail
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :checkpoints="getCheckpoints(task.id)"
        :productUsages="getProductUsages(task.id)"
        class="task-detail-item"
    />
  </div>
</template>

<style scoped>
.summary-container {
  padding: 20px;
  background-color: #fcfcfc;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #a3c4f3;
}

h2 {
  font-size: 1.7rem;
  color: #1e3a8a;
  margin-bottom: 20px;
}

p {
  margin-top: 5px;
  color: #374151;
  font-size: 1.05rem;
}

h3.task-title {
  margin-top: 30px;
  font-size: 1.4rem;
  color: #1d4ed8;
}

.task-detail-item {
  margin-top: 15px;
}

.task-detail-item:not(:last-child) {
  border-bottom: 1px solid #93c5fd;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.task-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
}

.replacement-table th, .replacement-table td {
  padding: 10px;
  text-align: left;
}

.replacement-table th {
  background-color: #dbeafe;
  color: #1e40af;
}

.replacement-table td {
  border-bottom: 1px solid #bfdbfe;
}
</style>
