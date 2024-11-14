<script setup>
import {useWorkshopStore} from "../services/workshop-store.js";
import {Intervention} from "../model/intervention.entity.js";
import {TasksService} from "../services/tasks.service.js";
import {Task} from "../model/task.entity.js";
import {computed, onMounted, ref, watch} from "vue";
import {PersonnelService} from "../services/personnel.service.js";
import {Mechanic} from "../model/mechanic.entity.js";
import {TaskState} from "../model/task-state.enum.js";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  },
  parentAction: Boolean
});
const workshopStore = useWorkshopStore();
const tasksService = new TasksService();
const personnelService = new PersonnelService();
const mechanics = ref([]);
const tasks = ref([]);
const tasksWithMechanicName = computed(() => {
  return tasks.value.map(task => {
    const mechanic = mechanics.value.find(mechanic => mechanic?.id === task?.assistantId);
    return {
      ...task,
      mechanicName: mechanic?.fullName
    };
  });
});
const getStatusSeverity = (status) => {
  switch (status) {
    case TaskState.CANCELED:
      return 'warn';
    case TaskState.PENDING:
      return 'info';
    case TaskState.DONE:
      return 'success';
    default:
      return null;
  }
};

watch(() => props.intervention,
    () => {
      getTasks();
    }, {immediate: true}
);

watch(()=>props.parentAction, () => {
  getTasks();
});

onMounted(() => {
  getMechanics();
});

function getTasks() {
  tasksService.getAllByInterventionId(props.intervention?.id)
      .then(
          response => {
            tasks.value = buildTasksFromResponseData(response.data);
          },
          error => {
            console.error(error);
          }
      );
}

function buildTasksFromResponseData(data){
  return data.map(task => new Task(task))
}

function getMechanics(){
  personnelService.getAllPersonnel(workshopStore.workshop.id)
      .then(
          response => {
            mechanics.value = buildMechanicsFromResponseData(response.data);
          },
          error => {
            console.error(error);
          }
      );
}

function buildMechanicsFromResponseData(data){
  return data.map(mechanic => new Mechanic(mechanic))
}

</script>

<template>
  <div class="content">
    <h2>Tasks Status</h2>
    <pv-datatable
        :value="tasksWithMechanicName"
        dataKey="id"
        scrollable
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15]"
        removableSort
    >
      <pv-column field="description" header="Part" style="width: 20rem" sortable/>
      <pv-column field="mechanicName" header="Mechanic" style="width: 10rem" sortable/>
      <pv-column field="state" header="Status" style="width: 10rem" sortable>
        <template #body="{data}">
          <pv-tag :severity="getStatusSeverity(data.state)">
            {{ TaskState.getName(data.state) }}
          </pv-tag>
        </template>
      </pv-column>
    </pv-datatable>
  </div>
</template>

<style scoped>

</style>