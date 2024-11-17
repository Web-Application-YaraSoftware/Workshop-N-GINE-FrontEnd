<script setup>
import PersonnelItem from "./personnel-item.component.vue";

defineProps({
  mechanics: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['editMechanic']);

const handleSelectMechanic = (mechanic) => {
  emit('editMechanic', mechanic);
};
</script>

<template>
  <div class="personnel-cards">
    <personnel-item
        v-for="mechanic in mechanics"
        :key="mechanic.id"
        :mechanic="mechanic"
        @selectMechanic="handleSelectMechanic"
    />
  </div>
</template>

<style scoped>
.personnel-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 10px;
}
</style>
