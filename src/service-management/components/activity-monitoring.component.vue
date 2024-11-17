<script setup>
import {useWorkshopStore} from "../services/workshop-store.js";
import {Intervention} from "../model/intervention.entity.js";
import {Task} from "../model/task.entity.js";
import {computed, onMounted, ref, watch} from "vue";
import {PersonnelService} from "../services/personnel.service.js";
import {Mechanic} from "../model/mechanic.entity.js";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {InterventionsService} from "../services/interventions.service.js";
import {ProfilesService} from "../../profile-management/services/profiles.service.js";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  },
  parentAction: Boolean
});
const authenticationStore = useAuthStore();
const interventionService = new InterventionsService();
const personnelService = new PersonnelService();
const profileService = new ProfilesService();
const mechanics = ref([]);
const tasks = ref([]);
const tasksWithMechanicName = computed(() => {
  return tasks.value.map(task => {
    const mechanic = mechanics.value.find(mechanic => mechanic?.id === task?.mechanicAssignedId);
    return {
      ...task,
      mechanicName: mechanic?.fullName
    };
  });
});
const getStatusSeverity = (status) => {
  switch (status) {
    case 'Pending':
      return 'warn';
    case 'InProgress':
      return 'info';
    case 'Completed':
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

function getMechanics(){
  personnelService.getAllPersonnel(authenticationStore.user.workshopId)
      .then(
          async response => {
            mechanics.value = await buildMechanicsFromResponseData(response.data);
          },
          error => {
            console.error(error);
          }
      );
}

function buildMechanicsFromResponseData(userIds){

  const mechanicPromises = userIds.map(userId =>
      profileService.getProfileByUserId(userId)
          .then(response => new Mechanic(response.data))
  );

  return Promise.all(mechanicPromises)
      .then(mechanics => {
        return mechanics;
      })
      .catch(error => {
        console.error(error);
        return [];
      });
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
      <pv-column field="status" header="Status" style="width: 10rem" sortable>
        <template #body="{data}">
          <pv-tag :severity="getStatusSeverity(data.status)">
            {{ data.status }}
          </pv-tag>
        </template>
      </pv-column>
    </pv-datatable>
  </div>
</template>

<style scoped>

</style>