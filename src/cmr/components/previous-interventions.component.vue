<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  vehicle: Object,
  isPanelActive: Boolean
});

const previousInterventions = ref([]);
const router = useRouter();
const timelineAlign = ref('alternate');

function handleResize() {
  if (window.innerWidth <= 768) {
    timelineAlign.value = 'left';
  } else {
    timelineAlign.value = 'alternate';
  }
}

watch(
    () => props.vehicle,
    (newValue) => {
      if (newValue && newValue.interventionRegister) {
        previousInterventions.value = newValue.interventionRegister.map((intervention) => ({
          status: `Intervention #${intervention.id}`,
          date: new Date(intervention.completionDate).toLocaleDateString(),
          leader: `${intervention.leader.firstName} ${intervention.leader.lastName}`,
          id: intervention.id
        }));
      }
    },
    {immediate: true}
);

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

function goToIntervention(interventionId) {
  router.push(`/interventions/${interventionId}`);
}
</script>

<template>
  <section class="timeline-section">
    <h2 class="section-title">Previous Interventions</h2>
    <pv-timeline :value="previousInterventions" :align="timelineAlign" class="customized-timeline">
      <template #marker="slotProps">
        <span class="marker-icon">
          <i class="pi pi-calendar"></i>
        </span>
      </template>
      <template #content="slotProps">
        <pv-card class="timeline-card">
          <template #header>
            <div class="card-header">{{ slotProps.item.status }}</div>
            <div class="card-subtitle">{{ slotProps.item.date }}</div>
          </template>
          <template #content>
            <p class="card-leader">Leader: {{ slotProps.item.leader }}</p>
          </template>
          <template #footer>
            <pv-button label="Read more" class="read-more-button" @click="goToIntervention(slotProps.item.id)"/>
          </template>
        </pv-card>
      </template>
    </pv-timeline>
  </section>
</template>

<style scoped>
.timeline-section {
  padding: 2rem;
  background: #f0f4f8;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1c3c56;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.customized-timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1rem;
}

.marker-icon {
  width: 35px;
  height: 35px;
  font-size: 1.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #1E90FF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.marker-icon:hover {
  transform: scale(1.1);
  background-color: #3498db;
}

.timeline-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  padding: 1.5rem;
  margin-top: 0.5rem;
}

.timeline-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1c3c56;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.card-leader {
  font-size: 1.1rem;
  color: #2c3e50;
}

.read-more-button {
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

@media (max-width: 768px) {
  .marker-icon {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }

  .card-header {
    font-size: 1.3rem;
  }

  .card-subtitle {
    font-size: 1rem;
  }
}
</style>
