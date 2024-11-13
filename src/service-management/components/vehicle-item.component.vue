<script setup>
import {ref, defineProps, defineEmits} from 'vue';
import {Vehicle} from "../../cmr/model/vehicle.entity.js";

const props = defineProps({
  vehicle: Vehicle,
  index: Number
});

const emits = defineEmits(['selectedVehicle']);

function selectVehicle() {
  emits('selectedVehicle', props.vehicle);
}

const lastIntervention = ref(
    props.vehicle?.interventionRegister && props.vehicle?.interventionRegister.length > 0
        ? props.vehicle?.interventionRegister[props.vehicle?.interventionRegister.length - 1].completionDate
        : null
);
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
  border: 1px solid #e0e0e0;
  margin-top: 2rem;
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
