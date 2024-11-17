<script setup>
import RegisterInterventions from "./register-interventions.component.vue";
import IotInformation from "./iot-information.component.vue";
import GeneralInformation from "./general-information.component.vue";
import {Intervention} from "../model/intervention.entity.js";
import {IoTDevice} from "../model/iot-device.entity.js";
import {Vehicle} from "../model/vehicle.entity.js";
import {InterventionsService} from "../services/interventions.service.js";
import {IotDevicesService} from "../services/iot-devices.service.js";
import {VehiclesService} from "../../cmr/services/vehicles.service.js";
import {PersonnelService} from "../services/personnel.service.js";
import {computed, ref, watch, watchEffect} from "vue";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {ProfilesService} from "../../profile-management/services/profiles.service.js";
import {Profile} from "../../profile-management/model/profile.entity.js";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  }
});
const registerInterventions = ref([]);
const iotInformation = ref(new IoTDevice());
const validatedIotInformation = computed(() => {
  return iotInformation.value instanceof IoTDevice ? iotInformation.value : new IoTDevice(iotInformation.value);
});
const client = ref();
const clientVehicles = ref([]);
const mechanics = ref([]);
const mechanicsWithProfile = ref([]);
const interventionsService = new InterventionsService();
const iotDevicesService = new IotDevicesService();
const profileService = new ProfilesService();
const vehicleService = new VehiclesService();
const personnelService = new PersonnelService();
const authenticationStore = useAuthStore();

watch(() => props.intervention,
    () => {
      getRegisterInterventions();
      getIoTDevice();
      getVehicles().then(() => {
        getClient();
      });
      getMechanics();
    }
);

watchEffect(async () => {
  mechanicsWithProfile.value = await Promise.all(mechanics.value.map( async  (mechanic) => {
    return await getProfileByUserId(mechanic);
  }));
});

function getClient(){
  const targetUserId = clientVehicles.value.length > 0 ? clientVehicles.value[0].userId : null;
  profileService.getProfileByUserId(targetUserId)
   .then(
       (response) => {
         client.value = buildClientFromResponseData(response.data);
       },
       (error) => {
         console.error(error);
       }
   );
}

function buildClientFromResponseData(data) {
  return new Profile(data);
}

function getVehicles() {
  return vehicleService.getById(props.intervention?.vehicleId)
      .then(
          (response) => {
            const userId = response.data.userId;
            return vehicleService.getByUserId(userId);
          }
      )
      .then(
          (response) => {
            clientVehicles.value = buildVehicleFromResponseData(response.data);
          },
          (error) => {
            console.error(error);
          }
      );
}

function buildVehicleFromResponseData(data) {
  return data.map((vehicle) => new Vehicle(vehicle));
}

function getMechanics(){
  personnelService.getAllPersonnel(authenticationStore.user.workshopId)
      .then(
          (response) => {
            mechanics.value = response.data;
          },
          (error) => {
            console.error(error);
          }
      );
}

function getRegisterInterventions() {
  interventionsService.getAllByVehicleId(props.intervention?.vehicleId)
      .then(
          (response) => {
            registerInterventions.value = buildInterventionFromResponseData(response.data);
          },
          (error) => {
            console.error(error);
          }
      );
}

function getIoTDevice(){
  if(!props.intervention?.vehicleId) return;
  iotDevicesService.getAllByVehicleId(props.intervention?.vehicleId)
      .then(
          (response) => {
            if (response.data) {
              iotInformation.value = buildIoTDeviceFromResponseData(response.data);
            }
          },
          (error) => {
            console.error(error);
          }
      );
}

function buildIoTDeviceFromResponseData(data) {
  return new IoTDevice(data);
}

function buildInterventionFromResponseData(data) {
  return data.map((intervention) => new Intervention(intervention));
}

async function getProfileByUserId(userId) {
  let response = await profileService.getProfileByUserId(userId);
  return new Profile(response.data);
}

</script>

<template>
  <section class="content">
    <div class="item">
      <h3>General information:</h3>
      <general-information
          :intervention="props.intervention"
          :client="client"
          :clientVehicles="clientVehicles"
          :mechanics="mechanicsWithProfile"
      />
    </div>
    <div class="item">
      <h3>IoT information:</h3>
      <iot-information :iot-information="validatedIotInformation"/>
    </div>
    <div class="item">
      <h3>Previous interventions:</h3>
      <pv-panel header=" " toggleable collapsed>
        <div class="interventions">
          <register-interventions :interventions="registerInterventions"/>
        </div>
      </pv-panel>
    </div>
  </section>
</template>

<style scoped>
.content{
  padding: 0 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.item{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.interventions{
  height: auto;
  max-height: 40rem;
  overflow-y: auto;
}
</style>