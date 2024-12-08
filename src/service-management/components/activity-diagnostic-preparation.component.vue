<script setup>
import TaskDistribution from "./task-distribution.component.vue";
import DiagnosticIntervention from "./diagnostic-intervention.component.vue";
import {PersonnelService} from "../services/personnel.service.js";
import {WorkshopService} from "../services/workshop.service.js";
import {TasksService} from "../services/tasks.service.js";
import {useWorkshopStore} from "../services/workshop-store.js";
import {Mechanic} from "../model/mechanic.entity.js";
import {onMounted, ref, watch, watchEffect} from "vue";
import {Task} from "../model/task.entity.js";
import {Intervention} from "../model/intervention.entity.js";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import {InterventionsService} from "../services/interventions.service.js";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {ProfilesService} from "../../profile-management/services/profiles.service.js";
import {Profile} from "../../profile-management/model/profile.entity.js";

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
const profileService = new ProfilesService();
const workshopService = new WorkshopService();
const tasksService = new TasksService();
const interventionService = new InterventionsService();
const authenticationStore = useAuthStore();
const workshopStore = useWorkshopStore();
const mechanicIds = ref([]);
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

watchEffect(async ()=>{
  mechanics.value = await Promise.all(mechanicIds.value.map( async  (mechanic) => {
    return await getProfileByUserId(mechanic);
  }));
})

function getMechanics() {
  workshopService.getMechanicsUserIdByWorkshopId(authenticationStore?.user?.workshopId)
      .then(
          response => {
            mechanicIds.value = response.data;
          },
          error => {
            console.error(error);
          }
      );
}

async function getProfileByUserId(userId) {
  let response = await profileService.getProfileByUserId(userId);
  return new Profile(response.data);
}

function getTasks() {
  interventionService.getAllTasksByInterventionId(props.intervention?.id)
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
  const requestBody = {
    mechanicAssignedId: task.mechanic,
    description: task.name
  }
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
      addTask(requestBody);
    }
  });
}

function addTask(task){
  interventionService.postTask(task, props.intervention?.id)
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
  const requestBody = {
    id: task.id,
    mechanicAssignedId: task.mechanicAssignedId,
    description: task.description
  }

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
      updateTask(requestBody);
    }
  });
}

function updateTask(task){
  interventionService.putTask(task.id, task, props.intervention?.id)
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
  interventionService.deleteTask(task.id, props.intervention?.id)
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
      let response = {
        id: props.intervention?.id,
        vehicleId: props.intervention?.vehicleId,
        mechanicLeaderId: props.intervention?.mechanicLeaderId,
        type: intervention.type === 'Reparation' ? 1 : 2,
        description: intervention.description,
        scheduledAt: props.intervention?.scheduledDate
      }
      updateIntervention(response);
    }
  });
}

function updateIntervention(intervention) {
  interventionService.put(intervention.id, intervention)
      .then(
          () => {
            emit('confirm:updatedIntervention');
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
        :identifier="authenticationStore.user.id"
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