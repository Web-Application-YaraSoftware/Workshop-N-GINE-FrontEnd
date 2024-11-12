<script setup>
import {inject, ref} from 'vue';

const { clientDialog } = inject('dialogVisibility');

const emit = defineEmits(['cancelRegister','acceptRegister']);

const firstName = ref('');
const lastName = ref('');
const dni = ref(0);
const email = ref('');

function restartForm(){
  clientDialog.value = false;
  firstName.value = '';
  lastName.value = '';
  dni.value = 0;
  email.value = '';
}

function onSubmitItem(){
  emit('acceptRegister', { firstName: firstName.value, lastName: lastName.value, dni: dni.value, email: email.value });
  restartForm();
}

function onCancelRequested(){
  restartForm();
  emit('cancelRegister');
}

</script>

<template>
  <pv-dialog v-model:visible="clientDialog" modal header="New Client Registration" :style="{ width: '25rem' }" >
    <span class="text-surface-500 dark:text-surface-400 block mb-5">Enter client information.</span>
    <form @submit.prevent="onSubmitItem">
      <pv-floatlabel class="flex flex-column items-center gap-2 my-5">
        <pv-inputtext v-model="firstName" id="first-name" class="flex-auto" autocomplete="off" required/>
        <label for="first-name" class="flex align-items-center font-semibold w-24">First name:</label>
      </pv-floatlabel>
      <pv-floatlabel class="flex flex-column items-center gap-2 my-5">
        <pv-inputtext v-model="lastName" id="last-name" class="flex-auto" autocomplete="off" required/>
        <label for="last-name" class="flex align-items-center font-semibold w-24">Last name:</label>
      </pv-floatlabel>
      <pv-floatlabel class="flex flex-column items-center gap-2 my-5">
        <pv-inputnumber v-model="dni" id="dni" :useGrouping="false" class="flex-auto" autocomplete="off" required/>
        <label for="dni" class="flex align-items-center font-semibold w-24">DNI:</label>
      </pv-floatlabel>
      <pv-floatlabel class="flex flex-column items-center gap-2 my-5">
        <pv-inputtext type="email" v-model="email" id="email" class="flex-auto" autocomplete="off" required/>
        <label for="email" class="flex align-items-center font-semibold w-24">Email:</label>
      </pv-floatlabel>
      <div class="flex justify-content-end gap-2">
        <pv-button type="button" label="Cancel" severity="secondary" @click="onCancelRequested"></pv-button>
        <pv-button type="submit" label="Save"></pv-button>
      </div>
    </form>
  </pv-dialog>
</template>

<style scoped>

</style>