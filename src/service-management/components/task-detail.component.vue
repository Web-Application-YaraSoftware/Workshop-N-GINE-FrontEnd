<script setup>
import { Task } from "../model/task.entity.js";
import { TaskState } from "../model/task-state.enum.js";
import { InterventionState } from "../model/intervention-state.enum.js";
import { computed } from "vue";

const props = defineProps({
  task: Task,
  checkpoints: Array,
  productUsages: Array
});

const statusSeverity = computed(() => {
  switch (InterventionState.getNumber(props.task.status)) {
    case InterventionState.PENDING:
      return 'danger';
    case InterventionState.IN_PROGRESS:
      return 'warn';
    case InterventionState.COMPLETED:
      return 'success';
    default:
      return 'secondary';
  }
});
</script>

<template>
  <div class="expansion-panel-container">
    <pv-panel toggleable :collapsed="true">
      <template #header>
        <div class="panel-header">
          <h3 class="task-description">{{ task.description }}</h3>
          <div class="spacer"></div>
          <pv-button :label="`Status: ${task.status}`" :severity="statusSeverity" />
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
  border-radius: 10px;
  border: 1px solid #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 20px;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.task-description {
  font-size: 1.2rem;
  color: #1f2937;
  font-weight: 600;
  margin: 0;
}

.spacer {
  flex-grow: 1;
}

.task-details {
  padding: 20px;
  background-color: #f9fafb;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1e40af;
  border-bottom: 2px solid #93c5fd;
  padding-bottom: 5px;
}

.checkpoint-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.checkpoint-item {
  font-size: 1rem;
  color: #374151;
  margin: 5px 0;
  padding-left: 10px;
  position: relative;
}

.checkpoint-item::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

.replacement-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.replacement-table th {
  background-color: #eff6ff;
  color: #1e3a8a;
  font-weight: 600;
  padding: 10px;
  border-bottom: 2px solid #93c5fd;
}

.replacement-table td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
  color: #4b5563;
}

@media (max-width: 768px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .task-description,
  .task-status {
    font-size: 1rem;
  }

  .task-details {
    padding: 15px;
  }

  .section-title {
    font-size: 1rem;
  }

  .checkpoint-item {
    font-size: 0.9rem;
  }
}
</style>