<script setup>
import {useWorkshopStore} from "../services/workshop-store.js";

const workshopStore = useWorkshopStore();
</script>

<template>
  <header>
    <pv-toolbar>
      <template #start>{{workshopStore.workshop?.name}}</template>
      <template #center>
        <div class="flex gap-6">
          <span>What's new</span>
          <span class="flex align-items-center gap-2">Help <i class="pi pi-angle-down"></i></span>
        </div>
      </template>
      <template #end>
        <div class="flex  align-content-center gap-2">
          <i class="pi pi-user"></i>
          <span class="flex align-items-center gap-2">Account <i class="pi pi-angle-down"></i></span>
        </div>
      </template>
    </pv-toolbar>
  </header>
</template>

<style scoped>
header {
  height: 40px;
}
.p-toolbar {
  padding: 1rem;
  font-size: 1.5rem;
}
.pi-user {
  font-size: 1.5rem;
  padding-right: 5px;
}

</style>