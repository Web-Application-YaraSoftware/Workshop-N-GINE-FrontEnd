<script setup>
import {useWorkshopStore} from "../../service-management/services/workshop-store.js";
import {useUiStore} from "../services/ui-store.js";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {computed} from "vue";
import {useRouter} from "vue-router";

const uiStore = useUiStore();
const authStore = useAuthStore();
const workshopStore = useWorkshopStore();
const router = useRouter();

const workshopName = workshopStore?.workshopName;
const visibilitySidebar = computed(() => uiStore.sidebar);

function logout() {
  authStore.logout();
  router.push({name: 'login'});
}

</script>

<template>
  <header>
    <pv-toolbar class="custom-toolbar">
      <template #start>
        <i v-if="!visibilitySidebar" class="pi pi-align-justify menu-toggle-icon" @click="uiStore.toggleSidebar"></i>
        <span class="workshop-name">{{ workshopName }}</span>
      </template>
      <template #center>
        <div class="nav-links">
          <span class="link">What's new</span>
          <span class="link help-link">
            Help <i class="pi pi-angle-down"></i>
          </span>
        </div>
      </template>
      <template #end>
        <pv-button @click="logout">Log out</pv-button>
      </template>
    </pv-toolbar>
  </header>
</template>

<style scoped>
header {
  height: 40px;
  background-color: #a0c6ff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.custom-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  font-size: 1.2rem;
  color: #2c3e50;
  background-color: #d8e9fc;
  border-bottom: 3px solid #a7c7e7;
}

.menu-toggle-icon {
  margin-right: 1rem;
  font-size: 1.5rem;
  color: #006994;
  cursor: pointer;
  transition: color 0.4s, transform 0.5s ease-in-out;
}

.menu-toggle-icon:hover {
  color: #004c73;
  transform: scale(1.2);
}

.workshop-name {
  font-weight: bold;
  font-size: 1.5rem;
  color: #007acc;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.link {
  cursor: pointer;
  color: #005f99;
  transition: color 0.3s;
}

.link:hover {
  color: #003f5e;
}

.help-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.account-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-icon {
  font-size: 1.8rem;
  color: #007acc;
}

.account-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #005f99;
  transition: color 0.3s;
}

.account-link:hover {
  color: #003f5e;
}
</style>