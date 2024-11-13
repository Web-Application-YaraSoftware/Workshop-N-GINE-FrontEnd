<script setup>
import RegisterInterventions from "./register-interventions.component.vue";
import IotInformation from "./iot-information.component.vue";
import GeneralInformation from "./general-information.component.vue";
import {Intervention} from "../model/intervention.entity.js";
import {IoTDevice} from "../../cmr/model/iot-device.entity.js";
import {Client} from "../../cmr/model/client.entity.js";
import {Vehicle} from "../../cmr/model/vehicle.entity.js";
import {InterventionsService} from "../services/interventions.service.js";
import {IotDevicesService} from "../../cmr/services/iot-devices.service.js";
import {ClientsService} from "../../cmr/services/clients.service.js";
import {VehiclesService} from "../../cmr/services/vehicles.service.js";
import {PersonnelService} from "../services/personnel.service.js";
import {useWorkshopStore} from "../../shared/services/workshop-store.js";
import {computed, ref, watch} from "vue";
import {Mechanic} from "../model/mechanic.entity.js";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  }
});
const registerInterventions = ref([]);
const iotInformation = ref([]);
const validatedIotInformation = computed(()=>{
  return iotInformation.value.length > 0 ? iotInformation.value[0] : null;
});
const client = ref();
const clientVehicles = ref([]);
const mechanics = ref([]);
const interventionsService = new InterventionsService();
const iotDevicesService = new IotDevicesService();
const clientsService = new ClientsService();
const vehicleService = new VehiclesService();
const personnelService = new PersonnelService();
const workshopStore = useWorkshopStore();

watch(() => props.intervention,
    () => {
      getRegisterInterventions();
      getIoTDevice();
      getClient();
      getVehicles();
      getMechanics();
    }
);

function getClient(){
  clientsService.getById(props.intervention?.clientId)
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
  return new Client(data);
}

function getVehicles(){
  vehicleService.getByClientId(props.intervention?.clientId)
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
  personnelService.getAllPersonnel(workshopStore.workshop?.id)
      .then(
          (response) => {
            mechanics.value = buildMechanicFromResponseData(response.data);
          },
          (error) => {
            console.error(error);
          }
      );
}

function buildMechanicFromResponseData(data) {
  return data.map((mechanic) => new Mechanic(mechanic));
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
  iotDevicesService.getAllByVehicleId(props.intervention?.vehicleId)
      .then(
          (response) => {
            iotInformation.value = buildIoTDeviceFromResponseData(response.data);
          },
          (error) => {
            console.error(error);
          }
      );
}

function buildIoTDeviceFromResponseData(data) {
  return data.map((iotDevice) => new IoTDevice(iotDevice));
}

function buildInterventionFromResponseData(data) {
  return data.map((intervention) => new Intervention(intervention));
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
          :mechanics="mechanics"
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