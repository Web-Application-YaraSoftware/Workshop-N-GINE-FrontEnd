<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useRouter} from 'vue-router';
import {InterventionState} from "../../service-management/model/intervention-state.enum.js";
import {InterventionType} from "../../service-management/model/intervention-type.enum.js";

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
.timeline-card {
  margin: 0.5rem 0;
  padding-top: 1.25rem;
  width: auto;
  min-width: 11.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-radius: 1.2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.timeline-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.header {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;

  .status {
    width: fit-content;
  }

  .date {
    color: #7f8c8d;
  }
}

.type {
  font-size: 1.1rem;
  color: black;
  text-align: center;
}

.read-more-button {
  margin-top: 1rem;
  background-color: transparent;
  color: #1E90FF;
  border: 1px solid #1E90FF;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.read-more-button:hover {
  background-color: #3498db;
  color: white;
}
</style>