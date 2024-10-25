<script setup>
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { InterventionState } from "../model/intervention-state.enum.js";
import { Intervention } from "../model/intervention.entity.js";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
  },
  mechanics: {
    type: Array,
    required: false,
  },
  vehicles: {
    type: Array,
    required: false,
  },
  isOwner: Boolean,
});

const emit = defineEmits(['updateIntervention']);
const toast = useToast();

const formValues = ref({
  dni: '',
  firstName: '',
  lastName: '',
  licensePlate: '',
  brand: '',
  model: '',
  modality: '',
  scheduledDate: null,
  leadMechanic: '',
  description: ''
});

const errors = ref({});

const MAX_CHARACTERS = {
  licensePlate: 10,
  brand: 30,
  model: 30,
  description: 200
};

const updateBrandAndModel = (licensePlate) => {
  const selectedVehicle = props.vehicles.find(vehicle => vehicle.licensePlate === licensePlate);
  if (selectedVehicle) {
    formValues.value.brand = selectedVehicle.brand;
    formValues.value.model = selectedVehicle.model;
  }
};

watch(() => formValues.value.licensePlate, updateBrandAndModel);

watch(() => props.intervention, (newValue) => {
  if (newValue) {
    const leadMechanic = props.mechanics.find(m => m.id === newValue.mechanicLeaderId);
    formValues.value = {
      dni: newValue?.vehicle?.owner?.dni || '',
      firstName: newValue?.vehicle?.owner?.firstName || '',
      lastName: newValue?.vehicle?.owner?.lastName || '',
      licensePlate: newValue?.vehicle?.licensePlate || '',
      brand: newValue?.vehicle?.brand || '',
      model: newValue?.vehicle?.model || '',
      modality: newValue?.interventionType || '',
      scheduledDate: newValue?.registrationDate ? new Date(newValue.registrationDate) : null,
      leadMechanic: leadMechanic ? leadMechanic.id : '',
      description: newValue?.description || '',
    };
  }
}, {immediate: true});
</script>
