<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import { Vehicle } from "../model/vehicle.entity.js";
import { InterventionsService } from "../services/interventions.service.js";
import { Intervention } from "../model/intervention.entity.js";

const props = defineProps({
  vehicle: Vehicle,
  index: Number
});

const interventionsService = new InterventionsService();
const registerInterventions = ref([]);

const emits = defineEmits(['selectedVehicle']);

function selectVehicle() {
  emits('selectedVehicle', props.vehicle);
}

function getRegisterInterventions() {
  interventionsService.getAllByVehicleId(props.vehicle.id)
    .then(
      (response) => {
        registerInterventions.value = buildInterventionFromResponseData(response.data);
      },
      (error) => {
        console.error(error);
      }
    );
}

function buildInterventionFromResponseData(data) {
  return data.map((intervention) => new Intervention(intervention));
}

const lastIntervention = ref(null);

function setLastIntervention() {
  if (registerInterventions.value.length > 0) {
    lastIntervention.value = registerInterventions.value.reduce((latest, intervention) => {
      return new Date(intervention.completionDate) > new Date(latest.completionDate) ? intervention : latest;
    }).completionDate;
  }
}

watch(registerInterventions, setLastIntervention);

onMounted(() => {
  getRegisterInterventions();
});
</script>

<template>
  <pv-card class="vehicle-card" @click="selectVehicle">
    <template #header>
      <div class="image-container">
        <img
          :src="vehicle.image || '../../../public/assets/images/default-car.png'"
          alt="Vehicle Image"
          class="vehicle-image"
        />
      </div>
    </template>
    <template #content>
      <div class="card-content">
        <h4>Car {{ index }}</h4>
        <h4>{{ vehicle.brand }} {{ vehicle.model }}</h4>
        <h4 v-if="lastIntervention">Last Intervention: {{ new Date(lastIntervention).toLocaleDateString() }}</h4>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.image-container {
  display: flex;
  justify-content: center;
}

.vehicle-image {
  width: 60%;
  margin-top: 10px;
}

.vehicle-card {
  border: 1px solid #A0CFFF;
  background-color: #F3F9FF;
  border-radius: 12px;
  margin-top: 2rem;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 75, 134, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.vehicle-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 75, 134, 0.15);
}

.card-content {
  display: flex;
  flex-direction: row;
  border-top: 1px solid #e0e0e0;
  justify-content: space-between;
}

.card-content h4 {
  padding-top: 2rem;
  font-size: 1.3rem;
  font-weight: 400;
}
</style>