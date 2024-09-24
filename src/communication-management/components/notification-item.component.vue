<script setup>
const props = defineProps({
  notification: Object
});
</script>

<template>
  <div style="width: 100%; height:100%">
    <pv-card>
      <template #title>{{ notification.date }}</template>
      <template #content>

        <div class="flex gap-4 mt-1">
          <span class="pi pi-bell" style="scale: 2.5"></span>
          <p class="m-0"> {{notification.content}} </p>
          <div style="margin-left: auto">
            <a :href="notification.endpoint">Go to the section</a>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>

</style>