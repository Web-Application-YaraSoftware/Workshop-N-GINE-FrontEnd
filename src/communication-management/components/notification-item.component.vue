<script setup>
import {Notification} from "../model/notification.entity.js";
import {formatDate} from "../../shared/services/date.service.js";

const props = defineProps({
  notification: {
    type: Notification,
    required: true
  }
});
</script>

<template>
  <article class="notification-item">
    <div class="icon">
      <span v-if="notification.state.id === 1" class="pi pi-bell" style="scale: 2.5"></span>
      <span v-else class="pi pi-bell-slash" style="scale: 2.5"></span>
    </div>
    <div class="content">
      <p>{{formatDate(notification.date)}}</p>
      <p> {{notification.content}} </p>
    </div>
    <div style="margin-left: auto">
      <a :href="notification.endpoint">Go to the section</a>
    </div>
  </article>
</template>

<style scoped>
.notification-item {
  width: 100%;
  padding: 1rem;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  gap: 2rem;
  border-radius: 1rem;
  box-shadow: 0.3rem 0.3rem 0.4rem #5E5E5E;
}
.icon {
  height: 100%;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>