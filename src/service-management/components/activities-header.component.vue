<script setup>
</script>

<template>
  <main class="content">
    <h2>My activities</h2>
    <section class="options">
      <router-link :to="{name: 'assistant'}">
        <pv-button text raised severity="info" outlined>Assistant</pv-button>
      </router-link>
      <router-link :to="{name: 'leader'}">
        <pv-button text raised severity="info" outlined>Leader</pv-button>
      </router-link>
    </section>
    <router-view/>
  </main>
</template>

<style scoped>
.content{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.options {
  display: flex;
  gap: 1rem;
}
</style>