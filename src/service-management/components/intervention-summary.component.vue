<script setup>
import { ref, onMounted } from 'vue';
import { Intervention } from "../model/intervention.entity.js";
import { CheckpointService } from "../services/checkpoint.service.js";
import TaskDetail from "./task-detail.component.vue";

const props = defineProps({
  intervention: Intervention,
  tasks: Array
});

const checkpointsMap = ref({});

const checkpointService = new CheckpointService();

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

onMounted(() => {
  loadCheckpointsForTasks();
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
        class="task-detail-item"
    />
  </div>
</template>
