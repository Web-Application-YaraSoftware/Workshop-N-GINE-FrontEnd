<script setup>
import PersonnelItem from "./personnel-item.component.vue";

// Props passed from parent to display the list of mechanics
defineProps({
  mechanics: {
    type: Array,
    required: true
  }
});

// Emit to notify the parent when a mechanic is selected
const emit = defineEmits(['editMechanic']);

// Function to handle the mechanic selection and emit to the parent
const handleSelectMechanic = (mechanic) => {
  emit('editMechanic', mechanic); // Emit the mechanic to the parent
};
</script>

<template>
  <div class="personnel-cards">
    <!-- Loop through mechanics and pass each mechanic to the PersonnelItem component -->
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
