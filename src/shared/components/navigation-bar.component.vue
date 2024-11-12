<script setup>
import {reactive} from "vue";
import {useWorkshopStore} from "../services/workshop-store.js";

const workshopStore = useWorkshopStore();

const navigationItems = reactive([
    /*
  {
    name: 'Personnel',
    rutaName: 'personnel',
    role: 1,
    isPublic: false
  },
  {
    name: 'Clients',
    rutaName: 'clients',
    role: 1,
    isPublic: false
  },
  {
    name: 'Interventions',
    rutaName: 'interventions',
    role: 1,
    isPublic: false
  },
  {
    name: 'Inventory',
    rutaName: 'inventory',
    role: 1,
    isPublic: false
  },
  {
    name: 'Metrics',
    rutaName: 'metrics',
    role: 1,
    isPublic: false
  },
  {
    name: 'My tasks',
    rutaName: 'tasks',
    role: 2,
    isPublic: false
  },
  {
    name: 'Vehicles',
    rutaName: 'vehicles',
    role: 3,
    isPublic: false
  },
  {
    name: 'Notifications',
    rutaName: 'notifications',
    isPublic: true
  }
     */
]);

</script>

<template>
  <aside class="navbar">
    <nav class="menu">
        <div class="menu-icon">
          <i class="pi pi-align-justify" style="font-size: 3rem"></i>
        </div>
        <img class="logo" src="/assets/images/logo.png" alt="logo of workshop n-gine">
        <ul class="links">
          <router-link
              v-for="item in navigationItems"
              :key="item.rutaName"
              :class="!(workshopStore.role === item.role || item.isPublic)? 'hidden': ''"
              :to="item.rutaName === 'vehicles'?{name: item.rutaName, params: {carOwnerId: workshopStore.user.id}}:{name: item.rutaName}"
          >{{item.name}}
          </router-link>
        </ul>
    </nav>
    <div class="go-back">
      <i class="pi pi-arrow-left" style="font-size: 3rem"></i>
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
  }
  .menu {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 2rem;
    flex-grow: 1;
  }
  .menu-icon{
    width: 100%;
    padding-bottom: 1rem;
    border-bottom: 0.5rem solid white;
    i{
      cursor: pointer;
    }
  }
  .logo{
    width: 10rem;
  }
  .links {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: 100%;
    a {
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
  .go-back {
    width: 100%;
    padding-top: 2rem;
    border-top: 0.5rem solid white;
    i{
      cursor: pointer;
    }
  }
</style>