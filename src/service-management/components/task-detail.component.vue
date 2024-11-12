<script setup>
import { Task } from "../model/task.entity.js";
import { TaskState } from "../model/task-state.enum.js";

const props = defineProps({
  task: Task,
  checkpoints: Array,
  productUsages: Array
});
</script>

<template>
  <div class="expansion-panel-container">
    <pv-panel toggleable :collapsed="true">
      <template #header>
        <div class="panel-header">
          <h3 class="task-description">{{ task.description }}</h3>
          <div class="spacer"></div>
          <h3 class="task-status">Status: {{ TaskState.getName(task.state) }}</h3>
        </div>
      </template>

      <template #footer>
        <div class="task-details">
          <h4 class="section-title">Checkpoints:</h4>
          <ul class="checkpoint-list">
            <li v-for="checkpoint in checkpoints" :key="checkpoint.id" class="checkpoint-item">
              - {{ checkpoint?.name || 'No name available' }}
            </li>
          </ul>

          <h4 class="section-title">List of replacement parts used:</h4>
          <pv-datatable :value="productUsages" class="replacement-table">
            <pv-column field="productStock.name" header="Replacement Part">
              <template #body="slotProps">
                {{ slotProps.data.name || 'No name available' }}
              </template>
            </pv-column>
            <pv-column field="quantityUsed" header="Quantity Used">
              <template #body="slotProps">
                {{ slotProps.data.quantityUsed || 'N/A' }}
              </template>
            </pv-column>
          </pv-datatable>
        </div>
      </template>
    </pv-panel>
  </div>
</template>

<style scoped>
.expansion-panel-container {
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-description {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.task-status {
  font-size: 1rem;
  color: #888;
  font-weight: 500;
  margin-left: 20px;
}

.spacer {
  flex-grow: 1;
}

.task-details {
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #424242;
}

.checkpoint-list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 20px;
}

.checkpoint-item {
  padding: 5px 0;
  font-size: 0.95rem;
  color: #555;
}

.replacement-table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
}

.replacement-table th, .replacement-table td {
  padding: 10px;
  text-align: left;
}

.replacement-table th {
  background-color: #f0f0f0;
  color: #333;
}

.replacement-table td {
  border-bottom: 1px solid #e0e0e0;
}

</style>
