<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { WorkshopClientService } from "../services/workshop-client.service.js";
import ConfirmationDialog from "../../shared/components/confirmation-dialog.component.vue";
import { WorkshopClient } from "../model/workshop-client.entity.js";

// Router and services
const router = useRouter();
const route = useRoute();
const workshopClientService = new WorkshopClientService();

// Reactive state
const clientId = ref(0);
const workshopClient = ref(new WorkshopClient());

// Dialog states
const confirmationMessage = ref('');
const showConfirmationDialog = ref(false);
const onConfirmAction = ref(() => {});

function initializeComponent() {
  loadClientIdFromRoute();
  loadClientData();
}

function loadClientIdFromRoute() {
  clientId.value = route.params.id || 0;
}

function loadClientData() {
  if (clientId.value) {
    workshopClientService.getById(clientId.value).then(client => {
      workshopClient.value = client;
    });
  }
}

function updateClient() {
  confirmationMessage.value = 'Are you sure you want to update this client?';
  onConfirmAction.value = () => {
    workshopClientService.update(clientId.value, workshopClient.value).then(() => {
      loadClientData();
    });
  };
  showConfirmationDialog.value = true;
}

function deleteClient() {
  confirmationMessage.value = 'Are you sure you want to delete this client?';
  onConfirmAction.value = () => {
    workshopClientService.delete(clientId.value).then(() => {
      router.push('/clients');
    });
  };
  showConfirmationDialog.value = true;
}

function onConfirm() {
  showConfirmationDialog.value = false;
  if (typeof onConfirmAction.value === 'function') {
    onConfirmAction.value();
  }
}

function onDismiss() {
  showConfirmationDialog.value = false;
}

onMounted(() => {
  initializeComponent();
});
</script>

<template>
  <main>
    <h2 class="section-title">Personal information: </h2>
    <form>
      <div class="client-info-container">
        <div class="spacer"></div>
        <div class="client-info-fields">
          <pv-floatlabel>
            <pv-inputtext id="firstName" class="full-width" v-model="workshopClient.firstName" />
            <label for="firstName">First Name</label>
          </pv-floatlabel>

          <pv-floatlabel>
            <pv-inputtext id="lastName" class="full-width" v-model="workshopClient.lastName" />
            <label for="lastName">Last Name</label>
          </pv-floatlabel>

          <pv-floatlabel>
            <pv-select id="documentType" class="full-width" v-model="workshopClient.documentType"
                       :options="['passport', 'id', 'driver-license']" />
            <label for="documentType">Document Type</label>
          </pv-floatlabel>

          <pv-floatlabel>
            <pv-inputtext id="dni" class="full-width" v-model="workshopClient.dni" />
            <label for="dni">Document No</label>
          </pv-floatlabel>

          <pv-floatlabel>
            <pv-inputtext id="email" class="full-width" v-model="workshopClient.email" type="email" />
            <label for="email">Email</label>
          </pv-floatlabel>

          <pv-floatlabel>
            <pv-inputnumber id="age" class="full-width" v-model="workshopClient.age" />
            <label for="age">Age</label>
          </pv-floatlabel>

          <pv-floatlabel>
            <pv-inputtext id="location" class="full-width" v-model="workshopClient.location" />
            <label for="location">Location</label>
          </pv-floatlabel>
        </div>

        <div class="client-info-actions">
          <pv-button icon="pi pi-trash" class=" button p-button-danger" @click="deleteClient" />
          <pv-button icon="pi pi-save" class=" button p-button-primary" @click="updateClient" />
        </div>
      </div>
    </form>

    <ConfirmationDialog v-if="showConfirmationDialog" :message="confirmationMessage" @confirm="onConfirm"
                        @dismiss="onDismiss" />
  </main>
</template>

<style scoped>
.client-info-container {
  padding: 3rem;
  margin: 2rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: 1.5rem;
}

.client-info-fields {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 3rem;
}

.full-width {
  width: 100%;
  font-size: 1.3rem;
}

label {
  font-size: 1.4rem;
}

.client-info-actions {
  display: flex;
  justify-content: space-around;
  max-height: 50px;
}

.button {
  min-width: 50px;
  min-height: 50px;
}
</style>
