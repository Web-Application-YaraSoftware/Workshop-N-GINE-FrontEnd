<script setup>
import {ref} from "vue";

const props = defineProps({
  checkpoints: {
    type: Array,
    required: true,
    default: []
  }
});
const emit = defineEmits([
    'add:checkpoint', 'update:checkpoint', 'delete:checkpoint'
]);
const checkpoint = ref();
const loading = ref(false);
const editingRows = ref([]);

function onSubmit(){
  loading.value = true;
  if (checkpoint.value) requestAddCheckpoint();
  loading.value = false;
  resetForm();
}

function onRowEditSave(event){
  if (event.data.name !== event.newData.name) emit('update:checkpoint', event.newData);
}

function onRowDeleteStock(data){
  emit('delete:checkpoint', data);
}

function requestAddCheckpoint(){
  emit('add:checkpoint', checkpoint.value);
}

function resetForm(){
  checkpoint.value = "";
}
</script>

<template>
  <div class="content">
    <form class="form" @submit.prevent="onSubmit">
      <pv-inputgroup>
        <pv-inputgroupaddon>
          <i class="pi pi-check"></i>
        </pv-inputgroupaddon>
        <pv-inputtext v-model="checkpoint"/>
      </pv-inputgroup>
      <pv-button class="add-button" type="submit" label="Add" icon="pi pi-plus" :loading="loading"/>
    </form>
    <div class="table">
      <pv-datatable
          v-model:editingRows="editingRows"
          :value="checkpoints"
          editMode="row"
          dataKey="id"
          scrollable
          @row-edit-save="onRowEditSave"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 15]"
      >
        <pv-column field="name" header="Name" style="width: 3rem">
          <template #editor="{data, field}">
            <pv-inputtext v-model="data[field]"/>
          </template>
        </pv-column>
        <pv-column style="width: 2.5rem" :rowEditor="true"/>
        <pv-column style="width: 2.5rem">
          <template #body="{data}">
            <pv-button icon="pi pi-trash" text rounded @click="onRowDeleteStock(data)"/>
          </template>
        </pv-column>
      </pv-datatable>
    </div>
  </div>
</template>

<style scoped>
.content{
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form{
  width: auto;
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.add-button{
  width: fit-content;
}
.table{
  width: 100%;
  max-width: 30rem;
}
</style>