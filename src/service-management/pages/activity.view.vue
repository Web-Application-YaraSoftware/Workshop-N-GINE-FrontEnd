<script setup>
import {computed, markRaw, onMounted, ref, watchEffect} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useWorkshopStore} from "../services/workshop-store.js";
import ActivityInformation from "../components/activity-information.component.vue";
import ActivityDiagnosticPreparation from "../components/activity-diagnostic-preparation.component.vue";
import ActivityExecution from "../components/activity-execution.component.vue";
import ActivityMonitoring from "../components/activity-monitoring.component.vue";
import {Intervention} from "../model/intervention.entity.js";
import {InterventionsService} from "../services/interventions.service.js";
import {TasksService} from "../services/tasks.service.js";
import { useConfirm } from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {ProfilesService} from "../../profile-management/services/profiles.service.js";

const router = useRouter();
const route = useRoute();
const profile = ref(null);
const profileService = new ProfilesService();
const authenticationStore = useAuthStore();
const workshopStore = useWorkshopStore();
const hasTasks = ref(true);
const steps = ref([
  {
    id: 1,
    value: 1,
    label: 'Information',
    disabled: false,
    component: markRaw(ActivityInformation)
  },
  {
    id: 2,
    value: 2,
    label: 'Diagnostic and preparation',
    disabled: false,
    component: markRaw(ActivityDiagnosticPreparation)
  },
  {
    id: 3,
    value: 3,
    label: 'Execution',
    disabled: false,
    component: markRaw(ActivityExecution)
  },
  {
    id: 4,
    value: 4,
    label: 'Supervision',
    disabled: false,
    component: markRaw(ActivityMonitoring)
  }
]);
const stepsFiltered = computed(() => {
  restartSteps();
  if (workshopStore.mechanicType?.id === 1) {
    return isMechanicAssistant();
  } else {
    return isMechanicLeader();
  }
});
const currentTotalSteps = computed(() => stepsFiltered.value.length);
const activeStep = ref(1);
const intervention = ref(new Intervention());
const interventionService = new InterventionsService();
const tasksService = new TasksService();
const confirm = useConfirm();
const toast = useToast();
const parentAction = ref(false);

onMounted(() => {
  validateMechanicType();
  getIntervention();
})

watchEffect(() => {
  verifyRoute();
});

function validateMechanicType(){
  // TODO: When the backend is ready again set the mechanic type with and endpoint
  // Delete this above
  if(!workshopStore.mechanicType) workshopStore.setLeader();
}

function areThereTasks(){
  const interventionId = Number(router.currentRoute.value.params.id);
  profileService.getProfileByUserId(authenticationStore.user.id)
      .then( response => {
        profile.value = response.data;

        interventionService.getAllTasksByMechanicIdAndInterventionId(profile.value.id, interventionId)
            .then(
                (response) => {
                  hasTasks.value = response.data.length > 0;
                },
                () => {
                  toast.add({severity: 'error', summary: 'Tasks not loaded', detail: 'An error occurred while loading tasks data', life: 3000});
                }
            )
      });

}

function verifyRoute(){
  if (route.query.step) {
    const step = parseInt(route.query.step);
    if (isValidStep(step)) {
      activeStep.value = step;
    } else {
      onUpdateRoute(1);
    }
  } else {
    onUpdateRoute(1);
  }
}

function isValidStep(step){
  return step>=1 && step<=currentTotalSteps.value;
}

function getIntervention(){
  interventionService.getById(router.currentRoute.value.params.id)
      .then(
          (response) => {
            intervention.value = buildDataFromResponse(response.data);
          },
          () => {
            toast.add({severity: 'error', summary: 'Intervention not loaded', detail: 'An error occurred while loading intervention data', life: 3000});
          }
      )
}

function buildDataFromResponse(response){
  return new Intervention(response);
}

function isMechanicAssistant(){
  return steps.value
      .filter(step => step.id === 1|| step.id === 3)
      .map(step => {
        if (step.id === 3) return { ...step, value: 2}
        return step
      })
}

function isMechanicLeader(){
  if (hasTasks.value) return steps.value
  return steps.value
      .filter(step => step.id !== 3)
      .map(step => {
        if (step.id === 4) return { ...step, value: 3}
        return step
      })
}

function restartSteps(){
  steps.value = [
    {
      id: 1,
      value: 1,
      label: 'Information',
      disabled: false,
      component: markRaw(ActivityInformation)
    },
    {
      id: 2,
      value: 2,
      label: 'Diagnostic and preparation',
      disabled: false,
      component: markRaw(ActivityDiagnosticPreparation)
    },
    {
      id: 3,
      value: 3,
      label: 'Execution',
      disabled: false,
      component: markRaw(ActivityExecution)
    },
    {
      id: 4,
      value: 4,
      label: 'Supervision',
      disabled: false,
      component: markRaw(ActivityMonitoring)
    }
  ];
}

function onUpdateRoute(step){
  areThereTasks();
  router.push({query: {step: step}});
  notifyChildren();
}

function onFinishIntervention(){
  confirm.require({
    message: 'Are you sure you want to finish the intervention?',
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small'
    },
    acceptProps: {
      label: 'Finish',
      icon: 'pi pi-trash',
      class: 'p-button-danger',
      size: 'small'
    },
    accept: () => {
      finishIntervention();
    }
  })
}

function finishIntervention(){
  intervention.value.finish();
  interventionService.put(intervention.value.id, intervention.value)
      .then(
          () => {
            toast.add({severity: 'success', summary: 'Success', detail: 'Intervention finished', life: 3000});
            goToActivities();
          },
          () => {
            toast.add({severity: 'error', summary: 'Intervention not finished', detail: 'An error occurred while finishing the intervention', life: 3000});
          }
      )
}

function goToActivities(){
  router.push({name: 'activities'});
}

function notifyChildren(){
  parentAction.value = !parentAction.value;
}

</script>

<template>
  <pv-stepper :value="activeStep">
    <pv-steplist>
      <pv-step v-for="step in stepsFiltered" :key="step?.id" :value="step?.value">
        <span class="step-label" @click="onUpdateRoute(step?.value)" v-tooltip.bottom="{ value: step?.label }">{{ step.label }}</span>
      </pv-step>
    </pv-steplist>
    <pv-steppanels>
      <pv-steppanel v-for="step in stepsFiltered" :key="step?.id" v-slot="{ activateCallback }" :value="step?.value">
        <div class="buttons" :class="{left: step?.value === 1}">
          <pv-button v-if="step?.value !== 1" severity="secondary" icon="pi pi-arrow-left" iconPos="left" @click="()=>{onUpdateRoute(step?.value - 1); activateCallback(step?.value - 1)}" label="Back"/>
          <pv-button v-if="step?.value !== currentTotalSteps" severity="primary" icon="pi pi-arrow-right" iconPos="right" @click="()=>{onUpdateRoute(step?.value + 1); activateCallback(step?.value + 1)}" label="Next"/>
          <pv-button v-if="step?.value === currentTotalSteps" severity="primary" @click="onFinishIntervention">Finish</pv-button>
        </div>
        <component
            :is="step?.component"
            :intervention="intervention"
            :parentAction="parentAction"
            @confirm:updatedIntervention="getIntervention"
        ></component>
      </pv-steppanel>
    </pv-steppanels>
    <pv-toast/>
  </pv-stepper>
</template>

<style scoped>
.buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.left {
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .step-label{
    display: none;
  }
}
</style>