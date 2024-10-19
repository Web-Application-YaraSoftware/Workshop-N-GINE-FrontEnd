<script setup>
import { defineEmits, defineProps } from 'vue';

// Define the props to receive the mechanic object
defineProps({
  mechanic: {
    type: Object,
    default: () => ({}) // Ensure we have a default empty object if no mechanic is passed
  }
});

// Define emit to notify the parent component when a mechanic is clicked
const emit = defineEmits(['selectMechanic']);
</script>

<template>
  <!-- Mechanic Card -->
  <pv-card class="mechanic-card" @click="$emit('selectMechanic', mechanic)">
    <!-- Mechanic Image -->
    <template #header>
      <img
          alt="Mechanic Image"
          :src="mechanic?.image || '/path/to/default-image.jpg'"
          class="mechanic-image"
      />
    </template>

    <!-- Mechanic Name -->
    <template #footer>
      <div class="mechanic-footer">
        <p class="mechanic-name">
          {{ mechanic?.firstName || 'First Name' }} {{ mechanic?.lastName || 'Last Name' }}
        </p>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.mechanic-card {
  min-width: 210px;
  height: 310px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid #282828;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #282828;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.mechanic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.mechanic-image {
  width: 100%;
  height: 210px;
  object-fit: cover;
}

.mechanic-footer {
  background-color: #282828;
  padding: 10px 0;
  object-fit: cover;
}

.mechanic-name {
  color: white;
  font-weight: bold;
  font-size: 1.7rem;
  text-align: center;
  margin: 0;
}
</style>
