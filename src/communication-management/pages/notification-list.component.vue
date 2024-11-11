<script setup>
import NotificationItem from '../components/notification-item.component.vue'
import { NotificationService } from "../services/notification.service.js";
import { Notification } from "../model/notification.entity.js";
import { onMounted, ref } from "vue";
import {NotificationManager} from "../model/notification-manager.entity.js";

const notifications = ref();
const notificationService = new NotificationService();
const notificationManager = new NotificationManager();

function getNotifications() {
  notificationService.getByUserId(2)
      .then(response => {
        notificationManager.notifications.value = buildNotificationListFromResponseData(response.data)
        console.log(notificationManager.notifications)
      })

}

function buildNotificationListFromResponseData(data) {
  return data.map(notification => new Notification(notification));
}

onMounted(() => {
  getNotifications();
});
</script>


<template>
  <section class="notifications-container">
    <h1 class="text-4xl">Notifications</h1>
    <div class="flex flex-column gap-5">
      <notification-item v-for="notification in notificationManager.notifications.value" :key="notification.id" :notification="notification" />
    </div>
  </section>
</template>

<style scoped>
.notifications-container{
  width: 100%;
  height: calc(100vh - 40px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
