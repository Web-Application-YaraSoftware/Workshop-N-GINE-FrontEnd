<script setup>
import {reactive} from "vue";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {useUiStore} from "../services/ui-store.js";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const navigationItems = reactive([
  {
    name: 'Personnel',
    rutaName: 'personnel',
    visibility: authStore.isOwner,
    icon: 'pi pi-users'
  },
  {
    name: 'Clients',
    rutaName: 'clients',
    visibility: authStore.isOwner,
    icon: 'pi pi-id-card'
  },
  {
    name: 'Interventions',
    rutaName: 'interventions',
    visibility: authStore.isOwner,
    icon: 'pi pi-hammer'
  },
  {
    name: 'Inventory',
    rutaName: 'inventory',
    visibility: authStore.isOwner,
    icon: 'pi pi-box'
  },
  {
    name: 'Metrics',
    rutaName: 'metrics',
    visibility: authStore.isOwner,
    icon: 'pi pi-chart-bar'
  },
  {
    name: 'My Activities',
    rutaName: 'activities',
    visibility: authStore.isMechanic,
    icon: 'pi pi-clock'
  },
  {
    name: 'Vehicles',
    rutaName: 'vehicles',
    visibility: authStore.isClient,
    icon: 'pi pi-car'
  },
  {
    name: 'Notifications',
    rutaName: 'notifications',
    visibility: true,
    icon: 'pi pi-bell'
  }
]);

function goBack() {
  router.go(-1);
}

</script>

<template>
  <aside class="navbar">
    <nav class="menu">
      <div class="menu-icon">
        <i class="pi pi-align-justify" @click="uiStore.toggleSidebar"></i>
      </div>
      <img class="logo" src="/assets/images/logo.png" alt="logo of workshop n-gine">
      <ul class="links">
        <router-link
            v-for="item in navigationItems"
            :key="item.rutaName"
            :class="item.visibility ? '' : 'hidden'"
            :to="item.rutaName === 'vehicles' ? { name: item.rutaName, params: { carOwnerId: authStore.user.id } } : { name: item.rutaName }"
        >
          <pv-button :icon="item.icon" :label="item.name" severity="info" size="large" variant="text" raised/>
        </router-link>
      </ul>
    </nav>
    <div class="go-back">
      <i class="pi pi-arrow-left" @click="goBack"></i>
    </div>
  </aside>
</template>

<style scoped>
.hidden {
  display: none;
}
.navbar {
  width: min-content;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-color: #d8e9fc;
  border-right: 3px solid #a7c7e7;
  box-shadow: 3px 0 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), box-shadow 0.5s;
  backdrop-filter: blur(8px);
}

.menu {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 2rem;
  flex-grow: 1;
}

.menu-icon {
  width: 100%;
  padding-bottom: 1.5rem;
  border-bottom: 2px dashed #b4dbf4;
}

.menu-icon i {
  font-size: 3rem;
  color: #006994;
  cursor: pointer;
  transition: color 0.4s, transform 0.5s ease-in-out;
}

.menu-icon i:hover {
  color: #004c73;
  transform: scale(1.2) rotate(15deg);
}

.logo {
  width: 12rem;
  transition: transform 0.5s ease-in-out, filter 0.5s;
}

.logo:hover {
  transform: scale(1.25) rotate(-10deg);
  filter: drop-shadow(0 0 10px rgba(0, 123, 255, 0.5));
}

.links {
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

a {
  color: #005f99;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.4s ease, transform 0.4s ease, text-shadow 0.3s;
  button{
    font-size: 1.3rem;
  }
}

a:hover {
  color: #003f5e;
  transform: translateX(15px);
  text-shadow: 0 0 5px #a7c7e7;
}

.go-back {
  width: 100%;
  padding-top: 2.5rem;
  border-top: 2px dashed #b4dbf4;
}

.go-back i {
  font-size: 3rem;
  color: #006994;
  cursor: pointer;
  transition: transform 0.4s, color 0.4s, box-shadow 0.4s;
}

.go-back i:hover {
  transform: translateX(-15px) scale(1.1);
  color: #003f5e;
}
</style>
