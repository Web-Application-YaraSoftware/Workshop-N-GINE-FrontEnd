<script setup>
defineProps({
  mechanic: Object
});
</script>

<template>
  <pv-card class="mechanic-card">
    <!-- Mechanic Image -->
    <template #header>
      <img alt="Mechanic Image" :src="mechanic?.image" class="mechanic-image" />
    </template>

    <!-- Mechanic Name -->
    <template #footer>
      <div class="mechanic-footer">
        <p class="mechanic-name">{{ mechanic?.first_name }} {{ mechanic?.last_name }}</p>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.mechanic-card {
  min-width: 180px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid #282828;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.mechanic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.mechanic-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #f0f0f0;
}

.mechanic-footer {
  background-color: #282828;
  padding: 10px 0;
}

.mechanic-name {
  color: white;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  margin: 0;
}
</style>
