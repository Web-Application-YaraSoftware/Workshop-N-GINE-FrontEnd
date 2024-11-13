<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  mechanics: {
    type: Array,
    required: true,
    default: []
  },
  tasks: {
    type: Array,
    required: true,
    default: []
  },
  identifier: {
    type: Number,
    required: true
  }
});
const emit = defineEmits(['add:task', 'update:task', 'delete:task']);
const tasksWithMechanicName = computed(() => {
  return props.tasks.map(task => {
    const mechanic = props.mechanics.find(mechanic => mechanic.id === task.assistantId);
    return {
      ...task,
      mechanicName: mechanic ? mechanic.fullName : 'Unknown'
    };
  });
});
const task = ref({
  mechanic: "",
  name: ""
});
const loading = ref(false);
const editingRows = ref([]);

function onSubmit(){
  loading.value = true;
  if(isValidForm()) emit('add:task', task.value);
  resetForm();
  loading.value = false;
}

function onRowEditSave(event){
  if (event.data.description === event.newData.description && event.data.assistantId === event.newData.assistantId) return;
  if(event.newData && event.newData.description)
    emit('update:task', event.newData);
}

function onRowDelete(event){
  emit('delete:task', event);
}

function isValidForm(){
  return task.value.name && task.value.mechanic;
}

function resetForm(){
  task.value = {
    mechanic: "",
    name: ""
  };
}
</script>

<template>
  <div class="content">
    <h2>Task distribution</h2>
    <form class="form-tasks">
      <pv-inputgroup>
        <pv-inputgroupaddon>
          <i class="pi pi-list"></i>
        </pv-inputgroupaddon>
        <pv-inputtext id="task-name" v-model="task.name" placeholder="Task"/>
      </pv-inputgroup>
      <pv-inputgroup>
        <pv-inputgroupaddon>
          <i class="pi pi-user"></i>
        </pv-inputgroupaddon>
        <pv-select
            v-model="task.mechanic"
            :options="mechanics"
            optionValue="id"
            showClear
            filter
            optionLabel="fullName"
            placeholder="Select a mechanic"
        >
          <template #option="slotPros">
            <div v-if="slotPros.option.id===identifier">Yo</div>
            <div v-else>{{slotPros.option.fullName}}</div>
          </template>
        </pv-select>
      </pv-inputgroup>
      <pv-button class="add-button" type="submit" label="Add" icon="pi pi-plus" :loading="loading" @click.prevent="onSubmit"/>
    </form>
    <pv-datatable
        v-model:editingRows="editingRows"
        :value="tasksWithMechanicName"
        editMode="row"
        dataKey="id"
        @row-edit-save="onRowEditSave"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15]"
        scrollable
    >
      <pv-column field="description" header="Task">
        <template #editor="{data, field}">
          <pv-inputtext v-model="data[field]"/>
        </template>
      </pv-column>
      <pv-column field="mechanicName" header="Mechanic">
        <template #body="{data}">{{data.mechanicName}}</template>
        <template #editor="{data, field}">
          <pv-select v-model="data.assistantId" :options="mechanics" optionLabel="fullName" optionValue="id" placeholder="Select a mechanic" fluid>
            <template #option="{option}">
              <div v-if="option.id===identifier">Yo</div>
              <div v-else>{{option.fullName}}</div>
            </template>
          </pv-select>
        </template>
      </pv-column>
      <pv-column style="width: min-content" :rowEditor="true"/>
      <pv-column style="width: 2.5rem">
        <template #body="{data}">
          <pv-button icon="pi pi-trash" text rounded @click="onRowDelete(data)"/>
        </template>
      </pv-column>
    </pv-datatable>
  </div>
</template>

<style scoped>
.content{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-tasks{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.add-button{
  width: fit-content;
}
</style>