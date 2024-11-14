<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useRouter} from 'vue-router';
import {InterventionState} from "../model/intervention-state.enum.js";
import {InterventionType} from "../model/intervention-type.enum.js";

const props = defineProps({
  interventions: {
    type: Array,
    required: true,
    default: []
  },
  isPanelActive: {
    type: Boolean,
    default: true
  }
});
const getStatusSeverity = (status) => {
  switch (status) {
    case InterventionState.PENDING:
      return 'warn';
    case InterventionState.IN_PROGRESS:
      return 'info';
    case InterventionState.COMPLETED:
      return 'success';
    default:
      return null;
  }
};

const router = useRouter();
const timelineAlign = ref('alternate');

function handleResize() {
  if (window.innerWidth <= 768) {
    timelineAlign.value = 'left';
  } else {
    timelineAlign.value = 'alternate';
  }
}

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

function onRedirectToIntervention(interventionId) {
  router.push(`/interventions/${interventionId}`);
}
</script>

<template>
  <section class="timeline-section">
    <pv-timeline :value="interventions" :align="timelineAlign">
      <template #content="slotProps">
        <pv-card class="timeline-card">
          <template #header>
            <div class="header">
              <pv-tag class="status" :severity="getStatusSeverity(slotProps.item.state)">
                {{ InterventionState.getName(slotProps.item.state) }}
              </pv-tag>
              <p class="date">{{ slotProps.item.getFormattedDate() }}</p>
            </div>
          </template>
          <template #content>
            <p class="type">{{ InterventionType.getName(slotProps.item.interventionType) }}</p>
          </template>
          <template #footer>
            <pv-button label="Read more" class="read-more-button" @click="onRedirectToIntervention(slotProps.item.id)"/>
          </template>
        </pv-card>
      </template>
    </pv-timeline>
  </section>
</template>

<style scoped>
.timeline-section {
  padding: 2rem;
  border-radius: 15px;
  box-sizing: border-box;
}

.timeline-card {
  margin: 1rem 0;
  padding: 1.25rem;
  width: 100%;
  min-width: 13rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #F3F9FF;
  border: 1px solid #A0CFFF;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.status {
  width: fit-content;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.date {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.type {
  font-size: 1.2rem;
  color: #003C6E;
  text-align: center;
}

.read-more-button {
  margin-top: 1rem;
  background-color: transparent;
  color: #1E90FF;
  border: 1px solid #1E90FF;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.read-more-button:hover {
  background-color: #3498db;
  color: white;
}

@media (max-width: 768px) {
  .timeline-card {
    min-width: 100%;
    padding: 1rem;
  }

  .status {
    font-size: 0.9rem;
  }

  .type {
    font-size: 1rem;
  }
}
</style>