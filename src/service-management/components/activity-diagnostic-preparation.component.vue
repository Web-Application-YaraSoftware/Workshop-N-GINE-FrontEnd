<script setup>
import TaskDistribution from "./task-distribution.component.vue";
import DiagnosticIntervention from "./diagnostic-intervention.component.vue";
import {PersonnelService} from "../services/personnel.service.js";
import {TasksService} from "../services/tasks.service.js";
import {useWorkshopStore} from "../../shared/services/workshop-store.js";
import {Mechanic} from "../model/mechanic.entity.js";
import {onMounted, ref, watch} from "vue";
import {Task} from "../model/task.entity.js";
import {Intervention} from "../model/intervention.entity.js";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import {InterventionsService} from "../services/interventions.service.js";

const confirm = useConfirm();
const toast = useToast();
const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  }
});
const emit = defineEmits(['confirm:updatedIntervention']);
const personnelService = new PersonnelService();
const tasksService = new TasksService();
const interventionService = new InterventionsService();
const workshopStore = useWorkshopStore();
const mechanics = ref([]);
const tasks = ref([]);

watch(() => props.intervention,
    () => {
      getTasks();
    }
);

onMounted(() => {
  getMechanics();
  getTasks();
});

function getMechanics() {
  personnelService.getAllPersonnel(workshopStore.workshop?.id)
      .then(
          response => {
            mechanics.value = buildMechanicFromResponseData(response.data);
          },
          error => {
            console.error(error);
          }
      );
}

function buildMechanicFromResponseData(data){
  return data.map(mechanic => new Mechanic(mechanic))
}

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

function onRequestAddTask(task){
  const newTask = new Task();
  newTask.description = task.name;
  newTask.assistantId = task.mechanic;
  newTask.interventionId = props.intervention?.id;
  confirm.require({
    message: "Are you sure you want to add this task?",
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
      addTask(newTask);
    }
  });
}

function addTask(task){
  tasksService.post(task)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Task added successfully', life: 4000});
            getTasks();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while adding the task', life: 4000});
          }
      );
}

function onRequestUpdateTask(task){
  const updatedTask = new Task(task);
  confirm.require({
    message: "Are you sure you want to update this task?",
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
      updateTask(updatedTask);
    }
  });
}

function updateTask(task){
  tasksService.put(task.id, task)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Task updated successfully', life: 4000});
            getTasks();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while updating the task', life: 4000});
          }
      );
}

function onRequestDeleteTask(task){
  const deletedTask = new Task(task);
  confirm.require({
    message: "Are you sure you want to delete this task?",
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
      deleteTask(deletedTask);
    }
  });
}

function deleteTask(task){
  tasksService.delete(task.id)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Task deleted successfully', life: 4000});
            getTasks();
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while deleting the task', life: 4000});
          }
      );
}

function onRequestUpdateIntervention(intervention){
  confirm.require({
    message: "Are you sure you want to update this intervention?",
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
      let interventionToUpdate = new Intervention();
      interventionToUpdate = props.intervention;
      interventionToUpdate.interventionType = intervention.interventionType;
      interventionToUpdate.description = intervention.description;
      updateIntervention(interventionToUpdate);
    }
  });
}

function updateIntervention(intervention) {
  interventionService.put(intervention.id, intervention)
      .then(
          (r) => {
            console.log(r)
            toast.add({severity: 'success', summary: 'Success', detail: 'Intervention updated successfully', life: 4000});
          },
          () => {
            toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred while updating the intervention', life: 4000});
          }
      );
}

</script>

<template>
  <section class="content">
    <pv-toast/>
    <pv-confirmdialog/>
    <task-distribution
        class="item"
        :mechanics="mechanics"
        :tasks="tasks"
        :identifier="workshopStore.user.id"
        @add:task="onRequestAddTask($event)"
        @update:task="onRequestUpdateTask($event)"
        @delete:task="onRequestDeleteTask($event)"
    />
    <diagnostic-intervention
        class="item"
        :intervention="intervention"
        @confirm:updatedIntervention="onRequestUpdateIntervention($event)"
    />
  </section>
</template>

<style scoped>
.content{
  padding: 0 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.item{
  flex-grow: 1;
}
</style>