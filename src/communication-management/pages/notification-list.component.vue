<script setup>
import NotificationItem from '../components/notification-item.component.vue'
import { NotificationService } from "../services/notification.service.js";
import { Notification } from "../model/notification.entity.js";
import { onMounted, ref } from "vue";

const notifications = ref([]);
const notificationService = new NotificationService();

function getNotifications() {
  notificationService.getAll()
      .then(response => {
        console.log("Dato API:", response.data);
        notifications.value = buildNotificationListFromResponseData(response.data)
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

  <section>
    <h1>Notifications</h1>
    <div class="flex flex-column gap-5">
      <div v-for="notification in notifications" :key="notification.id">
        <NotificationItem :notification="notification" />
      </div>
    </div>
  </section>


</template>

<style scoped>
*{
  font-family: 'Roboto', sans-serif;
}

</style>
