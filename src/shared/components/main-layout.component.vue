<script setup>
  import HeaderContent from "./header-content.component.vue";
  import NavigationBar from "./navigation-bar.component.vue";
  import {useUiStore} from "../services/ui-store.js";
  import {useAuthStore} from "../../iam/services/auth-store.js";
  import {computed, onMounted} from "vue";
  import {useRouter} from "vue-router";

  const uiStore = useUiStore();
  const authStore = useAuthStore();
  const router = useRouter();

  const visibilitySidebar = computed(() => uiStore.sidebar);

  onMounted(() => {
    redirectByRole();
  });

  function redirectByRole(){
    if(authStore.isClient){
      router.push({name: 'vehicles', params : {carOwnerId: authStore.user.id}});
    }
    if(authStore.isMechanic){
      router.push({name: 'activities'});
    }
    if(authStore.isOwner){
      router.push({name: 'personnel'});
    }
  }

</script>

<template>
  <div class="container">
    <header-content class="header"/>
    <Transition name="slide-sidebar">
      <navigation-bar v-if="visibilitySidebar" class="navbar"/>
    </Transition>
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
  .slide-sidebar-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-sidebar-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-sidebar-enter-from,
  .slide-sidebar-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
</style>