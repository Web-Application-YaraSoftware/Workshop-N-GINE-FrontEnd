<script setup>

import {ref} from "vue";

let title=ref("Stock");

function titleHeader(newTitle){
  title.value = newTitle;
  console.log(title)
}

</script>

<template>
  <section>
    <pv-card>
      <template #title>{{title}}</template>
      <template #content class="w-full">
        <router-link to="/inventory/stock">
          <pv-button label="In Stock" class="mr-4 mt-6" @click="titleHeader('Stock')"/>
        </router-link>

        <router-link to="/inventory/requests">
          <pv-button label="Requests" @click="titleHeader('Requests')"/>
        </router-link>
      </template>
    </pv-card>
    <router-view/>
  </section>



</template>

<style scoped>

</style>