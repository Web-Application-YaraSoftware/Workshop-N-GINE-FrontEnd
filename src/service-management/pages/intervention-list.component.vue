<script setup>
import { ref, computed, onMounted } from 'vue';
import { InterventionsService } from '../services/interventions.service.js';
import { ClientsService } from '../services/clients.service.js';
import { VehiclesService } from '../services/vehicles.service.js';
import { Client } from '../model/client.entity.js';
import { Vehicle } from '../model/vehicle.entity.js';
import NewInterventionDialog from '../components/new-intervention-dialog.component.vue';

// API service instances
const interventionsService = new InterventionsService();
const clientsService = new ClientsService();
const vehiclesService = new VehiclesService();

const interventions = ref([]);
const noInterventions = ref(false);
const filters = ref({global: {value: ''}});
const selectedStatus = ref('All');
const loading = ref(false);
const isDialogVisible = ref(false); // Control the dialog visibility

//Helper function to create a Client instance
const createClient = (clientData) => {
  return new Client(
      clientData.id,
      clientData.workshop_id,
      clientData.first_name,
      clientData.last_name,
      clientData.dni,
      clientData.email,
      clientData.password,
      clientData.image,
      clientData.state,
      clientData.user_type
  );
};

// Helper function to create a Vehicle instance
const createVehicle = (vehicleData) => {
  return new Vehicle(
      vehicleData.id,
      vehicleData.user_id,
      vehicleData.license_plate,
      vehicleData.brand,
      vehicleData.model
  );
};

// Function to fetch and enrich intervention data
const fetchAndEnrichIntervention = (intervention) => {
  return Promise.all([
    clientsService.getClientById(intervention.client_id),
    vehiclesService.getCarById(intervention.vehicle_id)
  ])
      .then(([clientResponse, vehicleResponse]) => {
        const client = createClient(clientResponse.data);
        const vehicle = createVehicle(vehicleResponse.data);

        return {
          ...intervention,
          client,
          vehicle
        };
      })
      .catch(error => {
        console.error(`Error fetching client or vehicle data for intervention ID: ${intervention.id}`, error);
        return { ...intervention, client: null, vehicle: null }; // Handle missing client or vehicle
      });
};

// Fetch interventions from API and populate client and vehicle details
const getInterventions = () => {
  loading.value = true;

  interventionsService.getAllInterventions()
      .then(response => {
        const interventionData = response.data;

        if (interventionData.length === 0) {
          noInterventions.value = true;
        } else {
          noInterventions.value = false;

          const populatedInterventionsPromises = interventionData.map(intervention => {
            return fetchAndEnrichIntervention(intervention);
          });

          // Wait until all interventions have been processed
          Promise.all(populatedInterventionsPromises)
              .then(populatedInterventions => {
                interventions.value = populatedInterventions;
              })
              .catch(error => {
                console.error('Error processing interventions:', error);
              });
        }
      })
      .catch(error => {
        console.error('Error fetching interventions:', error);
        noInterventions.value = true;
      })
      .finally(() => {
        loading.value = false;
      });
};
// Fetch interventions when the component is mounted
onMounted(() => {
  getInterventions();
});

// Show the dialog
const openDialog = () => {
  isDialogVisible.value = true;
};

// Close the dialog
const closeDialog = () => {
  isDialogVisible.value = false;
};

// Handle form submission from the dialog
const submitIntervention = async (interventionData) => {
  try {
    await interventionsService.postIntervention(interventionData);
    // After submission, reload interventions
    onMounted(() => {
      getInterventions();
    });
  } catch (error) {
    console.error('Error submitting intervention:', error);
  }
  closeDialog();
};

// Computed property to filter interventions based on selected status
const filteredInterventions = computed(() => {
  if (selectedStatus.value === 'All') {
    return interventions.value;
  }
  return interventions.value.filter((intervention) => intervention.state?.name === selectedStatus.value);
});

// Function to set the status filter
const filterByStatus = (status) => {
  selectedStatus.value = status;
};

// Function to determine if a button is active
const isActiveFilter = (status) => {
  return selectedStatus.value === status;
};
</script>

<template>
  <section class="intervention-container p-4">
    <!-- Header -->
    <section class="header mb-4">
      <h2 class="font-bold">Interventions</h2>
    </section>

    <!-- Disposition modes -->
    <section class="disposition-modes mb-4 flex gap-4">
      <pv-button icon="pi pi-list" class="p-button-rounded p-button-text custom-size-button" />
      <pv-button icon="pi pi-table" class="p-button-rounded p-button-text custom-size-button" />
    </section>

    <!-- Search and action toolbar -->
    <section class="w-full flex items-center justify-between mb-4">
      <pv-toolbar class="w-full">
        <template #start>
          <pv-iconfield>
            <pv-inputicon>
              <i class="pi pi-search" />
            </pv-inputicon>
            <pv-inputtext class="custom-size-button" v-model="filters['global'].value" placeholder="Keyword" />
          </pv-iconfield>
        </template>
        <template #end>
          <!-- Button to open the dialog -->
            <pv-button class="custom-size-button" label="Schedule intervention" icon="pi pi-plus" severity="success" @click="openDialog"/>
        </template>
      </pv-toolbar>
    </section>

    <!-- Filters -->
    <section class="filters mb-4 flex gap-4">
      <pv-button
          label="Pending"
          :class="{ 'p-button-active': isActiveFilter('PENDING') }"
          class="p-button-outlined custom-size-button"
          @click="filterByStatus('PENDING')"
      />
      <pv-button
          label="In progress"
          :class="{ 'p-button-active': isActiveFilter('IN_PROGRESS') }"
          class="p-button-outlined custom-size-button"
          @click="filterByStatus('IN_PROGRESS')"
      />
      <pv-button
          label="Completed"
          :class="{ 'p-button-active': isActiveFilter('COMPLETED') }"
          class="p-button-outlined custom-size-button"
          @click="filterByStatus('COMPLETED')"
      />
      <pv-button
          label="All"
          :class="{ 'p-button-active': isActiveFilter('All') }"
          class="p-button-outlined custom-size-button"
          @click="filterByStatus('All')"
      />
    </section>

    <!-- Interventions table -->
    <section class="interventions-table">
      <pv-datatable
          :value="filteredInterventions"
          class="table"
          :paginator="true"
          :rows="10"
          dataKey="id"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} interventions"
          responsiveLayout="scroll"
      >
        <pv-column field="client.firstName" header="Client First Name" sortable></pv-column>
        <pv-column field="client.lastName" header="Client Last Name" sortable></pv-column>
        <pv-column field="vehicle.licensePlate" header="Vehicle License Plate" sortable></pv-column>
        <pv-column field="vehicle.model" header="Vehicle Model" sortable></pv-column>
        <pv-column field="registration_date" header="Registration Date" sortable></pv-column>
        <pv-column field="completion_date" header="Completion Date" sortable></pv-column>
        <pv-column field="state.name" header="Status" sortable></pv-column>
      </pv-datatable>

      <!-- Show a loading indicator if data is being fetched -->
      <div v-if="loading" class="loading-indicator">
        Loading interventions...
      </div>

      <!-- Show no interventions message -->
      <div v-if="noInterventions" class="no-interventions">
        No interventions found.
      </div>
    </section>

    <!-- New Intervention Dialog -->
    <new-intervention-dialog
        :visible="isDialogVisible"
        @close="closeDialog"
        @submit="submitIntervention"
    />
  </section>
</template>

<style scoped>
.intervention-container {
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  height: calc(100vh - 40px);
  overflow-x: auto;
  overflow-y: auto;
}

.header h2 {
  font-size: 4rem;
  font-weight: bold;
}

.disposition-modes {
  display: flex;
  justify-content: flex-start;
  font-size: 3rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 100px;
}

.custom-size-button {
  font-size: 1.3rem;
  padding: 0.75rem 1.5rem;
}

.p-button-active {
  background-color: #007ad9 !important;
  color: white !important;
}

.p-button-outlined {
  border: 2px solid #007ad9;
}

.interventions-table {
  margin-top: 20px;
  width: 100%;
  overflow-x: auto;
}

p-datatable-sm {
  text-align: center;
  font-weight: bold;
  padding: 10px;
}

.loading-indicator {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
  color: #007ad9;
}

.no-interventions {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
  color: red;
}
.table {
  min-width: fit-content;
  width: 100%;
  font-size: 1.2rem;
}
</style>
