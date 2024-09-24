<script setup>
import {ref, onMounted} from 'vue';
import {PersonnelService} from '../services/personnel.service.js';
import {Mechanic} from '../model/mechanic.entity.js';
import PersonnelItem from '../components/personnel-item.component.vue';


const mechanics = ref([]);
const personnelService = new PersonnelService();

//Define emit for sending event to parent
const emit = defineEmits(['noMechanics']);

//Function to fetch personnel data
const getPersonnel = async () => {
  try {
    const response = await personnelService.getAllPersonnel();
    const mechanicData = response.data;

    if (mechanicData.length === 0) {
      emit('noMechanics'); //Emit the noMechanics event if no mechanics are returned
    } else {
      mechanics.value = createPersonnelListFromResponseData(mechanicData);
    }
  } catch (error) {
    console.error('Error fetching personnel:', error);
    emit('noMechanics'); //Emit if there's an error and no data is available
  }
};

//Function to create mechanic objects from response data
const createPersonnelListFromResponseData = (mechanicsData) => {
  return mechanicsData.map(mechanic => {
    const id = mechanic.id;
    const workshopId = mechanic.workshop_id;
    const stateId = mechanic.state_id;
    const userType = mechanic.user_type;
    const firstName = mechanic.first_name;
    const lastName = mechanic.last_name;
    const dni = mechanic.dni;
    const email = mechanic.email;
    const password = mechanic.password;
    const image = mechanic.image;

    return new Mechanic(id, workshopId, stateId, userType, firstName, lastName, dni, email, password, image);
  });
};

onMounted(() => {
  getPersonnel();
});
</script>

<template>
  <section class="card-container">
    <!--Loop through reactive mechanics array -->
    <personnel-item v-for="mechanic in mechanics" :key="mechanic.id" :mechanic="mechanic"/>
  </section>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  justify-content: space-between;
  text-align: center;
  align-items: center;
}
</style>
