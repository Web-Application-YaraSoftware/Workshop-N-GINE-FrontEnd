<script setup>
import { ref, onMounted } from 'vue';
import { Intervention } from "../model/intervention.entity.js";
import { InterventionsService} from "../services/interventions.service.js";
/*
technical debt:
import { TaskProductUsageService } from "../services/task-product-usage.service.js";
import { ProductStockService } from "../../Inventory/services/product-stock.service.js";
 */
import TaskDetail from "./task-detail.component.vue";

const props = defineProps({
  intervention: Intervention,
  tasks: Array
});

const checkpointsMap = ref({});

const interventionService = new InterventionsService();
/*
technical debt:
const taskProductUsagesMap = ref({});

const taskProductUsageService = new TaskProductUsageService();
const productStockService = new ProductStockService();

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
 */
function loadCheckpointsForTasks() {
  props.tasks.forEach(task => {
    interventionService.getAllCheckpointsByInterventionIdAndTaskId(props.intervention.id, task.id).then(response => {
      checkpointsMap.value[task.id] = response.data || [];
    });
  });
}

function getCheckpoints(taskId) {
  return checkpointsMap.value[taskId] || [];
}


onMounted(() => {
  loadCheckpointsForTasks();
  //loadProductUsagesForTasks();
});
</script>

<template>
  <div class="summary-container">
    <h2>Intervention Summary</h2>
    <p>Registration Date: {{ intervention.createdAt }}</p>
    <p>Scheduled Date: {{ intervention.scheduledDate}}</p>
    <p>Completion Date: {{intervention.updatedAt}}</p>
    <p>{{ intervention.description }}</p>

    <h3 class="task-title">Tasks</h3>

    <task-detail
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :checkpoints="getCheckpoints(task.id)"
        class="task-detail-item"
    />
  </div>
</template>

<style scoped>
.summary-container {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d5db;
}

h2 {
  font-size: 1.8rem;
  color: #1e3a8a;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
}

p {
  margin-top: 5px;
  color: #374151;
  font-size: 1.1rem;
  line-height: 1.5;
}

h3.task-title {
  margin-top: 30px;
  font-size: 1.5rem;
  color: #2563eb;
  border-bottom: 2px solid #93c5fd;
  padding-bottom: 5px;
}

.task-detail-item {
  margin-top: 20px;
  padding: 15px;
  background-color: #f3f4f6;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  transition: transform 0.2s ease;
}

.task-detail-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.task-detail-item:not(:last-child) {
  margin-bottom: 20px;
}

.replacement-table th,
.replacement-table td {
  padding: 12px;
  text-align: left;
  font-size: 0.95rem;
}

.replacement-table th {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: bold;
}

.replacement-table td {
  border-bottom: 1px solid #93c5fd;
  color: #4b5563;
}

@media (max-width: 768px) {
  .summary-container {
    padding: 15px;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3.task-title {
    font-size: 1.2rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
