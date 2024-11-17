<script setup>
import {Intervention} from "../model/intervention.entity.js";
import {Task} from "../model/task.entity.js";
import {computed, onMounted, ref, watch, watchEffect} from "vue";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {InterventionsService} from "../services/interventions.service.js";
import {ProfilesService} from "../../profile-management/services/profiles.service.js";
import {Profile} from "../../profile-management/model/profile.entity.js";
import {WorkshopService} from "../services/workshop.service.js";

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
const workshopService = new WorkshopService();
const profileService = new ProfilesService();

const mechanicIds = ref([]);
const mechanics = ref([]);
const tasks = ref([]);
const tasksWithMechanicName = computed(() => {
  return tasks.value.map(task => {
    const mechanic = mechanics.value.find(mechanic => mechanic?.userId === task?.mechanicAssignedId);
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

watchEffect(async ()=>{
  mechanics.value = await Promise.all(mechanicIds.value.map( async  (mechanic) => {
    return await getProfileByUserId(mechanic);
  }));
})

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