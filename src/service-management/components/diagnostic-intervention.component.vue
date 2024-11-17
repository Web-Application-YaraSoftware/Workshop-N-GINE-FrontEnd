<script setup>
import {Intervention} from "../model/intervention.entity.js";
import {computed, ref, watch} from "vue";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  }
});
const emit = defineEmits(['confirm:updatedIntervention']);
const selectedIntervention = ref({
  type: '',
  description: ''
});
const isEditMode = computed(() => selectedIntervention.value.type !== props.intervention?.type || selectedIntervention.value.description !== props.intervention?.description);
const interventionTypes = ref([
  {value: 'Maintenance', label: 'Maintenance'},
  {value: 'Reparation', label: 'Reparation'},
]);

watch(() => props.intervention, () => {
  selectedIntervention.value = {
    type: props.intervention?.type,
    description: props.intervention?.description
  };
}, {immediate: true});

function onRequestSave(){
  emit('confirm:updatedIntervention', selectedIntervention.value);
}

function onRequestCancel(){
  resetValues();
}

function resetValues(){
  selectedIntervention.value = {
    type: props.intervention?.type,
    description: props.intervention?.description
  };
}
</script>

<template>
  <div class="content">
    <h2>Diagnostic</h2>
    <pv-inputgroup>
      <pv-inputgroupaddon>
        <i class="pi pi-wrench"></i>
      </pv-inputgroupaddon>
      <pv-select v-model="selectedIntervention.type" :options="interventionTypes" optionLabel="label" optionValue="value" fluid/>
    </pv-inputgroup>
    <pv-inputgroup>
      <pv-inputgroupaddon>
        <i class="pi pi-list"></i>
      </pv-inputgroupaddon>
      <pv-textarea v-model="selectedIntervention.description" rows="5" style="width: 100%" placeholder="Description" />
    </pv-inputgroup>
    <pv-buttongroup v-if="isEditMode">
      <pv-button label="Save" icon="pi pi-check" @click="onRequestSave"/>
      <pv-button label="Cancel" icon="pi pi-times" @click="onRequestCancel"/>
    </pv-buttongroup>
  </div>
</template>

<style scoped>
.content{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>