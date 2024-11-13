<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
  mechanic: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['selectMechanic']);
</script>

<template>
  <pv-card class="mechanic-card" @click="$emit('selectMechanic', mechanic)">
    <template #header>
      <img
          alt="Mechanic Image"
          :src="mechanic?.image || 'https://xsgames.co/randomusers/avatar.php?g=male'"
          class="mechanic-image"
      />
    </template>
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
  width: 240px;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid #5A8CCF;
  box-shadow: 0 6px 15px rgba(90, 140, 207, 0.15);
  background: linear-gradient(145deg, #0F7BFF, #154c86);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  cursor: pointer;
  margin: 15px;
  padding: 10px;
  position: relative;
}

.mechanic-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px rgba(120, 180, 255, 0.25);
}

.mechanic-image {
  width: 100%;
  height: 210px;
  object-fit: cover;
  border-radius: 10px;
  border-bottom: 2px solid #78B4FF;
  box-shadow: inset 0 0 20px rgba(120, 180, 255, 0.1);
}

.mechanic-footer {
  padding: 10px;
  color: white;
  text-align: center;
  border-radius: 10px;
}

.mechanic-name {
  font-weight: bold;
  font-size: 1.7rem;
  color: #f0f0f0;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  line-height: 1.4;
  transition: color 0.3s ease, transform 0.2s ease;
}

.mechanic-card:hover .mechanic-name {
  color: #689ac2;
  transform: translateY(-2px);
}

.mechanic-card:active .mechanic-name {
  transform: translateY(1px);
}

.mechanic-card::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  background-color: #f0f0f0;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.mechanic-card:hover::after {
  background-color: #0F7BFF;
  transform: scale(1.2);
}
</style>
