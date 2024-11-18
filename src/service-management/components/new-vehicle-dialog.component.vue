<script setup>
import {ref} from 'vue';
import {Vehicle} from "../model/vehicle.entity.js";

const dialogVisible = ref(true);
const vehicle = ref(new Vehicle());

const emit = defineEmits(['save', 'cancel']);

function onSave() {
  emit('save', vehicle.value);
  dialogVisible.value = false;
}

function onCancel() {
  emit('cancel');
  dialogVisible.value = false;
}
</script>

<template>
  <pv-dialog header="New Vehicle Registration" :visible="dialogVisible" modal @hide="onCancel">
    <div class="p-fluid">
      <div class="p-field">
        <pv-floatlabel>
          <label for="license-plate">License Plate</label>
          <pv-inputtext id="license-plate" v-model="vehicle.licensePlate" required/>
        </pv-floatlabel>
      </div>

      <div class="p-field">
        <pv-floatlabel>
          <label for="brand">Brand</label>
          <pv-inputtext id="brand" v-model="vehicle.brand" required/>
        </pv-floatlabel>
      </div>

      <div class="p-field">
        <pv-floatlabel>
          <label for="model">Model</label>
          <pv-inputtext id="model" v-model="vehicle.model" required/>
        </pv-floatlabel>
      </div>

<!--
      <div class="p-field">
        <pv-floatlabel>
          <label for="image">Image URL</label>
          <pv-inputtext id="image" v-model="vehicle.image" required/>
        </pv-floatlabel>
      </div>

      <div class="p-field">
        <pv-floatlabel>
          <label for="iot-device-id">IoT Device ID</label>
          <pv-inputnumber id="iot-device-id" v-model="vehicle.iotDeviceId" required/>
        </pv-floatlabel>
      </div>
-->
      <div class="p-dialog-footer">
        <pv-button label="Create" icon="pi pi-check" class="p-button-primary" @click="onSave"/>
        <pv-button label="Cancel" icon="pi pi-times" class="p-button-danger" @click="onCancel"/>
      </div>
    </div>
  </pv-dialog>
</template>

<style scoped>
.p-field {
  margin: 1.6rem;
}

.p-dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>