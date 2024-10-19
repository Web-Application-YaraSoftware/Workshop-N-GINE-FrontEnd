<script setup>
import { ref, inject, watch } from 'vue';

//Inject shared state and methods from the parent
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
  password: '',
});

//Validation error messages
const validationErrors = ref({
  firstName: '',
  lastName: '',
  dni: '',
  email: '',
  password: ''
});

//Watch the selectedMechanic to pre-fill the form if we're updating
watch(selectedMechanic, (newMechanic) => {
  if (newMechanic) {
    formData.value = { ...newMechanic }; //Pre-fill the form for editing
  } else {
    //Reset form data for new mechanic creation
    formData.value = {
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      password: '',
    };
  }
});

//Validation function for checking form inputs
const validateForm = () => {
  let isValid = true;
  //Reset error messages
  validationErrors.value = {
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    password: ''
  };

  //First Name validation
  if (!formData.value.firstName) {
    validationErrors.value.firstName = 'First Name is required';
    isValid = false;
  }

  //Last Name validation
  if (!formData.value.lastName) {
    validationErrors.value.lastName = 'Last Name is required';
    isValid = false;
  }

  //DNI validation (must be exactly 8 characters)
  if (!formData.value.dni || formData.value.dni.length !== 8) {
    validationErrors.value.dni = 'DNI must be exactly 8 characters';
    isValid = false;
  }

  //Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.value.email)) {
    validationErrors.value.email = 'Please enter a valid email address';
    isValid = false;
  }

  //Password validation (minimum 6 characters)
  if (!formData.value.password || formData.value.password.length < 6) {
    validationErrors.value.password = 'Password must be at least 6 characters long';
    isValid = false;
  }

  return isValid;
};

//Handle form submission for creating or updating mechanic
const handleSubmit = () => {
  if (validateForm()) {
    if (selectedMechanic.value) {
      updateMechanic(formData.value); // Update mechanic
    } else {
      createMechanic(formData.value); // Create new mechanic
    }
  }
};

//Handle delete mechanic
const handleDelete = () => {
  deleteMechanic(formData.value.id); // Delete mechanic
};
</script>

<template>
  <pv-dialog v-model:visible="isModalOpen" :header="selectedMechanic ? 'Information' : 'New Mechanic Registration'"
             modal>
    <form @submit.prevent="handleSubmit" class="form-content">
      <label>First Name</label>
      <pv-inputtext v-model="formData.firstName" placeholder="First Name"
                    :class="{ 'is-invalid': validationErrors.firstName }"/>
      <span class="error-message">{{ validationErrors.firstName }}</span>

      <label>Last Name</label>
      <pv-inputtext v-model="formData.lastName" placeholder="Last Name"
                    :class="{ 'is-invalid': validationErrors.lastName }"/>
      <span class="error-message">{{ validationErrors.lastName }}</span>

      <label>DNI</label>
      <pv-inputtext v-model="formData.dni" placeholder="DNI" :class="{ 'is-invalid': validationErrors.dni }"/>
      <span class="error-message">{{ validationErrors.dni }}</span>

      <label>Email</label>
      <pv-inputtext v-model="formData.email" placeholder="Email" :class="{ 'is-invalid': validationErrors.email }"/>
      <span class="error-message">{{ validationErrors.email }}</span>

      <label>Password</label>
      <pv-inputtext type="password" v-model="formData.password" placeholder="Password"
                    :class="{ 'is-invalid': validationErrors.password }"/>
      <span class="error-message">{{ validationErrors.password }}</span>

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
  gap: 10px;
  font-size: 1.5rem;
  width: 400px;
}

@media (max-width: 768px) {
  .form-content {
    width: 80vw;
  }
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 7px;
  margin-top: 20px;
}

.create-button, .update-button {
  background-color: #333;
  color: white;
  width: 100%;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1.5rem;
}

.delete-button {
  background-color: red;
  color: white;
  width: 100%;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1.5rem;
}

/* Styling for error messages */
.error-message {
  color: red;
  font-size: 1rem;
}

/* Styling for invalid input fields */
.is-invalid {
  border-color: red;
}
</style>
