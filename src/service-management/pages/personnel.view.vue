<script setup>
import { ref, provide, computed, onMounted } from 'vue';
import PersonnelList from "../components/personnel-list.component.vue";
import NewMechanicDialog from "../components/mechanic-form-dialog.component.vue";
import { ProfilesService } from "../../profile-management/services/profiles.service.js";
import { WorkshopService } from "../services/workshop.service.js";
import { Profile } from "../../profile-management/model/profile.entity.js";

const isModalOpen = ref(false);
const selectedMechanic = ref(null);
const mechanics = ref([]);
const noMechanics = ref(false);
const searchQuery = ref('');

const profilesService = new ProfilesService();
const workshopService = new WorkshopService();
const workshopId = 1;

function fetchMechanics() {
  fetchMechanicsUserId()
      .then(userIds => {
        if (!Array.isArray(userIds)) {
          throw new Error('Invalid response format');
        }
        const profilePromises = userIds.map(userId => profilesService.getProfileByUserId(userId));
        return Promise.all(profilePromises);
      })
      .then(profiles => {
        mechanics.value = profiles.map(profile => mechanicFromResponseData(profile.data));
        noMechanics.value = mechanics.value.length === 0;
      })
      .catch(error => {
        console.error('Error fetching mechanics:', error);
        noMechanics.value = true;
      });
}

function fetchMechanicsUserId() {
  return workshopService.getMechanicsUserIdByWorkshopId(workshopId)
      .then(response => {
        if (typeof response.data !== 'object' || response.data === null) {
          throw new Error('Invalid response format');
        }
        return response.data;
      })
      .catch(error => {
        console.error('Error fetching mechanics user IDs:', error);
        return [];
      });
}

function mechanicFromResponseData(data) {
  return new Profile(data);
}

onMounted(fetchMechanics);

const filteredMechanics = computed(() => {
  if (!searchQuery.value) {
    return mechanics.value;
  }
  return mechanics.value.filter(mechanic =>
      mechanic.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mechanic.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mechanic.dni.toString().toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mechanic.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      `${mechanic.firstName} ${mechanic.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const openCreateModal = () => {
  selectedMechanic.value = null;
  isModalOpen.value = true;
};

const openUpdateModal = (mechanic) => {
  selectedMechanic.value = { ...mechanic };
  isModalOpen.value = true;
};

const createMechanic = async (newMechanicData) => {
  try {
    const newMechanic = new Profile(newMechanicData);
    const response = await workshopService.postMechanicToWorkshop(workshopId, newMechanic);
    mechanics.value.push(response.data);
  } catch (error) {
    console.error('Error creating mechanic:', error);
  }
  closeDialog();
  fetchMechanics();
};

const updateMechanic = async (updatedMechanicData) => {
  try {
    const updatedMechanic = new Profile(updatedMechanicData);
    await profilesService.putProfile(updatedMechanic.id, updatedMechanic);
    const index = mechanics.value.findIndex(m => m.id === updatedMechanic.id);
    if (index !== -1) {
      mechanics.value[index] = { ...updatedMechanic };
    }
  } catch (error) {
    console.error('Error updating mechanic:', error);
  }
  closeDialog();
};

const deleteMechanic = async (id) => {
  //TODO: Implement delete mechanic
  try {
    await profilesService.deleteProfile(id);
    mechanics.value = mechanics.value.filter(m => m.id !== id);
  } catch (error) {
    console.error('Error deleting mechanic:', error);
  }
  closeDialog();
};

const closeDialog = () => {
  isModalOpen.value = false;
};

provide('isModalOpen', isModalOpen);
provide('selectedMechanic', selectedMechanic);
provide('createMechanic', createMechanic);
provide('updateMechanic', updateMechanic);
provide('deleteMechanic', deleteMechanic);
provide('closeDialog', closeDialog);
</script>

<template>
  <section class="personnel-container">
    <div class="header">
      <h1>Personnel</h1>
    </div>

    <div class="controls" v-if="!noMechanics">
      <pv-inputtext v-model="searchQuery" placeholder="Keyword to filter" class="search-input"/>
      <span class="pi pi-search"></span>
      <span class="spacer"></span>
      <pv-button label="New mechanic" icon="pi pi-plus" class="new-mechanic-button" @click="openCreateModal"/>
    </div>

    <div v-if="!noMechanics">
      <personnel-list :mechanics="filteredMechanics" @editMechanic="openUpdateModal"/>
    </div>

    <div v-if="noMechanics" class="no-personnel">
      <p>No registered personnel</p>
      <pv-button label="Register" class="register-button" @click="openCreateModal"/>
    </div>

    <new-mechanic-dialog
        :mechanic="selectedMechanic"
        :visible="isModalOpen"
        @createMechanic="createMechanic"
        @updateMechanic="updateMechanic"
        @deleteMechanic="deleteMechanic"
        @closeDialog="closeDialog"
    />
  </section>
</template>

<style scoped>
.personnel-container {
  padding: 20px;
  height: calc(100vh - 40px);
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 4rem;
  color: #004B86;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.spacer {
  flex: 0.1;
}

.controls .pi {
  font-size: 1.7rem;
  margin-right: 10px;
  color: #004B86;
  transition: color 0.3s ease;
}

.controls .pi:hover {
  color: #0F7BFF;
}

.search-input {
  flex: 1;
  margin-right: 10px;
  width: 60%;
  font-size: 1.5rem;
  padding: 10px;
  border: 2px solid #78B4FF;
  background-color: #EBF7FF;
  color: #0054FF;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: border 0.3s ease;
}

.search-input:focus {
  border-color: #006DFF;
  outline: none;
}

.new-mechanic-button {
  background-color: #006DFF;
  color: white;
  font-size: 1.5rem;
  padding: 12px 30px;
  border-radius: 30px;
  border: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.new-mechanic-button:hover {
  background-color: #004B86;
  transform: translateY(-3px);
}

.new-mechanic-button:active {
  transform: translateY(1px);
}

.no-personnel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 86vh;
  text-align: center;
}

.no-personnel p {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #5389FF;
}

.register-button {
  background-color: #0F7BFF;
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1.5rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.register-button:hover {
  background-color: #006DFF;
  transform: translateY(-3px);
}

.register-button:active {
  transform: translateY(1px);
}
</style>
