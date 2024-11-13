<script setup>
import { ref, inject, watch } from 'vue';

const isModalOpen = inject('isModalOpen');
const selectedMechanic = inject('selectedMechanic');
const createMechanic = inject('createMechanic');
const updateMechanic = inject('updateMechanic');
const deleteMechanic = inject('deleteMechanic');

const formData = ref({
  firstName: '',
  lastName: '',
  dni: '',
  email: '',
  age: 0,
  location: '',
});

const validationErrors = ref({
  firstName: '',
  lastName: '',
  dni: '',
  email: '',
  age: '',
  location: '',
});

watch(selectedMechanic, (newMechanic) => {
  if (newMechanic) {
    formData.value = { ...newMechanic };
  } else {
    formData.value = {
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      age: 0,
      location: '',
    };
  }
});

const validateForm = () => {
  let isValid = true;
  validationErrors.value = {
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    age: '',
    location: '',
  };

  if (!formData.value.firstName) {
    validationErrors.value.firstName = 'First Name is required';
    isValid = false;
  }

  if (!formData.value.lastName) {
    validationErrors.value.lastName = 'Last Name is required';
    isValid = false;
  }

  if (!formData.value.dni || formData.value.dni.length !== 8) {
    validationErrors.value.dni = 'DNI must be exactly 8 characters';
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.value.email)) {
    validationErrors.value.email = 'Please enter a valid email address';
    isValid = false;
  }

  if (formData.value.age <= 0) {
    validationErrors.value.age = 'Age must be a positive number';
    isValid = false;
  }

  if (!formData.value.location) {
    validationErrors.value.location = 'Location is required';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    if (selectedMechanic.value) {
      updateMechanic(formData.value);
    } else {
      createMechanic(formData.value);
    }
  }
};

const handleDelete = () => {
  deleteMechanic(formData.value.id);
};
</script>

<template>
  <pv-dialog v-model:visible="isModalOpen" :header="selectedMechanic ? 'Information' : 'New Mechanic Registration'" modal>
    <form @submit.prevent="handleSubmit" class="form-content">
      <label>First Name</label>
      <pv-inputtext v-model="formData.firstName" placeholder="First Name" :class="{ 'is-invalid': validationErrors.firstName }"/>
      <span class="error-message">{{ validationErrors.firstName }}</span>

      <label>Last Name</label>
      <pv-inputtext v-model="formData.lastName" placeholder="Last Name" :class="{ 'is-invalid': validationErrors.lastName }"/>
      <span class="error-message">{{ validationErrors.lastName }}</span>

      <label>DNI</label>
      <pv-inputtext v-model="formData.dni" placeholder="DNI" :class="{ 'is-invalid': validationErrors.dni }"/>
      <span class="error-message">{{ validationErrors.dni }}</span>

      <label>Email</label>
      <pv-inputtext v-model="formData.email" placeholder="Email" :class="{ 'is-invalid': validationErrors.email }"/>
      <span class="error-message">{{ validationErrors.email }}</span>

      <label>Age</label>
      <pv-inputtext v-model="formData.age" placeholder="Age" type="number" :class="{ 'is-invalid': validationErrors.age }"/>
      <span class="error-message">{{ validationErrors.age }}</span>

      <label>Location</label>
      <pv-inputtext v-model="formData.location" placeholder="Location" :class="{ 'is-invalid': validationErrors.location }"/>
      <span class="error-message">{{ validationErrors.location }}</span>

      <div class="button-group">
        <pv-button v-if="selectedMechanic" label="Update" type="submit" class="update-button"/>
        <pv-button v-else label="Create" type="submit" class="create-button"/>
        <pv-button v-if="selectedMechanic" label="Delete" class="delete-button" @click="handleDelete"/>
      </div>
    </form>
  </pv-dialog>
</template>

<style scoped>
.form-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-size: 1.6rem;
  width: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .form-content {
    width: 90vw;
  }
}

.label {
  font-size: 1.6rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.pv-inputtext {
  padding: 10px;
  font-size: 1.5rem;
  border: 2px solid #78B4FF;
  border-radius: 5px;
  background-color: #F4F9FF;
  transition: border 0.3s ease;
}

.pv-inputtext:focus {
  border-color: #006DFF;
  outline: none;
}

.error-message {
  color: red;
  font-size: 1.2rem;
  margin-top: 5px;
}

.is-invalid {
  border-color: red;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.create-button, .update-button, .delete-button {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.create-button, .update-button {
  background-color: #006DFF;
  color: white;
}

.create-button:hover, .update-button:hover {
  background-color: #004B86;
  transform: translateY(-3px);
}

.delete-button {
  background-color: #e50d0d;
  color: white;
}

.delete-button:hover {
  background-color: #e50d0d;
  transform: translateY(-3px);
}
</style>
