<script setup>
  import HeaderContent from "./header-content.component.vue";
  import NavigationBar from "./navigation-bar.component.vue";
  import {useWorkshopStore} from "../services/workshop-store.js";
  import {onMounted} from "vue";

  const workshopStore = useWorkshopStore();

  function getWorkshop(){
    workshopStore.getWorkshop();
  }

  onMounted(()=>{
    getWorkshop();
  })
</script>

<template>
  <div class="container">
    <header-content class="header"/>
    <navigation-bar class="navbar"/>
    <router-view class="main"/>
  </div>
</template>

<style scoped>
  .container {
    width: 100%;
    height: auto;
    min-height: 100vh;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 'header header'
                         'nav main';
  }
  .header {
    grid-area: header;
  }
  .navbar {
    grid-area: nav;
  }
  .main {
    grid-area: main;
    padding: 2rem;
  }
</style>