<script setup>
import { ref, provide, computed, onMounted } from 'vue';
import PersonnelList from "../components/personnel-list.component.vue";
import NewMechanicDialog from "../components/mechanic-form-dialog.component.vue";
import { PersonnelService } from '../services/personnel.service.js';
import { Mechanic } from '../model/mechanic.entity.js';

const isModalOpen = ref(false); // Control modal new mechanic visibility
const selectedMechanic = ref(null); // Track which mechanic is selected (for editing)
const mechanics = ref([]);
const noMechanics = ref(false); // Handle 'No Mechanics' state
const searchQuery = ref(''); // Search input value

// API service instance
const personnelService = new PersonnelService();

// Fetch personnel from API on mount
const getPersonnel = async () => {
  try {
    const response = await personnelService.getAllPersonnel();
    const mechanicData = response.data;

    if (mechanicData.length === 0) {
      noMechanics.value = true; // Set noMechanics flag if no data is returned
    } else {
      noMechanics.value = false; // Data exists, hide "No personnel" message
      mechanics.value = createPersonnelListFromResponseData(mechanicData);
    }
  } catch (error) {
    console.error('Error fetching personnel:', error);
    noMechanics.value = true; // In case of error, show "No personnel" message
  }
};

// Helper function to map response data to Mechanic objects
const createPersonnelListFromResponseData = (mechanicsData) => {
  return mechanicsData.map(mechanic => {
    const { id, workshop_id, first_name, last_name, dni, email, password, image,  state, user_type} = mechanic;
    return new Mechanic(id, workshop_id, first_name, last_name, dni, email, password, image, state, user_type);
  });
};

onMounted(() => {
  getPersonnel();
});

// Filter mechanics based on search query
const filteredMechanics = computed(() => {
  if (!searchQuery.value) {
    return mechanics.value; // No filter, return all mechanics
  }
  return mechanics.value.filter(mechanic =>
      mechanic.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mechanic.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mechanic.dni.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mechanic.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      `${mechanic.firstName} ${mechanic.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Function to open the modal for creating a new mechanic
const openCreateModal = () => {
  selectedMechanic.value = null; // Reset selected mechanic
  isModalOpen.value = true; // Open modal
};

// Function to open the modal for updating an existing mechanic
const openUpdateModal = (mechanic) => {
  selectedMechanic.value = { ...mechanic }; // Set selected mechanic
  isModalOpen.value = true; // Open modal
};

// Function to handle creating a new mechanic
const createMechanic = async (newMechanicData) => {
  try {
    const defaultWorkshopId = mechanics.value.length > 0 ? mechanics.value[0].workshopId : 1; // Default workshopId

    const newMechanic = new Mechanic(
        null, // No ID when creating a new mechanic (handled by backend)
        newMechanicData.workshopId || defaultWorkshopId,
        newMechanicData.firstName,
        newMechanicData.lastName,
        newMechanicData.dni,
        newMechanicData.email,
        newMechanicData.password,
        newMechanicData.image || '/path/to/default-image.jpg',
        newMechanicData.state || { id: 1, name: 'ACTIVE' }, // Ensure state is passed as an object
        newMechanicData.userType || { id: 2, type: 'mechanic' } // Ensure userType is passed as an object
    );

    const response = await personnelService.postPersonnel(newMechanic);
    mechanics.value.push(response.data); // Add new mechanic to the list
  } catch (error) {
    console.error('Error creating mechanic:', error);
  }
  closeDialog();
};

// Function to handle updating an existing mechanic
const updateMechanic = async (updatedMechanicData) => {
  try {
    const updatedMechanic = new Mechanic(
        updatedMechanicData.id,
        selectedMechanic.value.workshopId,
        updatedMechanicData.firstName,
        updatedMechanicData.lastName,
        updatedMechanicData.dni,
        updatedMechanicData.email,
        updatedMechanicData.password,
        updatedMechanicData.image || selectedMechanic.value.image,
        updatedMechanicData.state || selectedMechanic.value.state, // Ensure state is passed as an object
        updatedMechanicData.userType || selectedMechanic.value.userType // Ensure userType is passed as an object
    );

    await personnelService.putPersonnel(updatedMechanic.id, updatedMechanic);
    const index = mechanics.value.findIndex(m => m.id === updatedMechanic.id);
    if (index !== -1) {
      mechanics.value[index] = { ...updatedMechanic }; // Update mechanic in the list
    }
  } catch (error) {
    console.error('Error updating mechanic:', error);
  }
  closeDialog();
};

// Function to handle deleting a mechanic
const deleteMechanic = async (id) => {
  try {
    await personnelService.deletePersonnel(id);
    mechanics.value = mechanics.value.filter(m => m.id !== id); // Remove mechanic from the list
  } catch (error) {
    console.error('Error deleting mechanic:', error);
  }
  closeDialog();
};

// Function to close the modal
const closeDialog = () => {
  isModalOpen.value = false; // Close the modal
};

// Provide shared state and methods to child components
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

    <!-- Search Input and Button Container -->
    <div class="controls" v-if="!noMechanics">
      <pv-inputtext v-model="searchQuery" placeholder="Keyword to filter" class="search-input"/>
      <span class="pi pi-search"></span>
      <span class="spacer"></span>
      <pv-button label="New mechanic" icon="pi pi-plus" class="new-mechanic-button" @click="openCreateModal" />
    </div>

    <!-- Show filtered personnel list -->
    <div v-if="!noMechanics">
      <personnel-list :mechanics="filteredMechanics" @editMechanic="openUpdateModal" />
    </div>

    <!-- Conditionally render the "No registered personnel" section -->
    <div v-if="noMechanics" class="no-personnel">
      <p>No registered personnel</p>
      <pv-button label="Register" class="register-button" @click="openCreateModal" />
    </div>

    <!-- MechanicDialog for creating or editing mechanics -->
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
}

.search-input {
  flex: 1;
  margin-right: 10px;
  width: 60%;
  font-size: 1.5rem;
}

.new-mechanic-button {
  background-color: #333;
  color: white;
  font-size: 1.5rem;
}

.no-personnel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 86vh;
}

.no-personnel p {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.register-button {
  background-color: #333;
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1.5rem;
}
</style>
