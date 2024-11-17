<script setup>
import { IoTDevice} from "../model/iot-device.entity.js";
import { CodeState } from "../model/code-state.enum.js";
import { nextTick, ref } from "vue";

const props = defineProps({
  iotInformation: {
    type: IoTDevice,
    required: false,
    default: new IoTDevice()
  }
});
const selectedCode = ref();
const popover = ref();

const getStatusSeverity = (status) => {
  switch (status) {
    case CodeState.FAILED:
      return 'warn';
    case CodeState.GOOD:
      return 'info';
    default:
      return null;
  }
};

function onDisplayCodeInformation(event, code) {
  popover.value.hide();
  if (selectedCode.value?.id === code.id) {
    selectedCode.value = null;
  } else {
    selectedCode.value = code;
    nextTick(() => {
      popover.value.show(event);
    });
  }
}
</script>

<template>
  <section class="timeline-section">
    <div v-if="iotInformation && iotInformation.codeList && iotInformation.codeList.length">
      <div class="datatable-container">
        <pv-datatable
            :value="iotInformation.codeList"
            removableSort
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <pv-column field="component" header="Component" sortable></pv-column>
          <pv-column field="state" header="State" sortable>
            <template #body="{ data }">
              <pv-tag :severity="getStatusSeverity(data.state)">
                {{ CodeState.getName(data.state) }}
              </pv-tag>
            </template>
          </pv-column>
          <pv-column field="errorCode" header="Error Code" sortable>
            <template #body="{ data }">
              <p
                  class="code-info"
                  v-if="data.errorCode"
                  @click="onDisplayCodeInformation($event, data)">
                {{ data.errorCode }}
              </p>
              <p v-if="!data.errorCode">-</p>
            </template>
          </pv-column>
          <pv-column field="lastUpdated" header="Last Updated" sortable>
            <template #body="{ data }">
              {{ new Date(data.lastUpdated).toLocaleString() }}
            </template>
          </pv-column>
        </pv-datatable>
      </div>
      <pv-popover ref="popover">
        <div v-if="selectedCode">{{ selectedCode.description }}</div>
      </pv-popover>
    </div>
    <div v-else class="no-iot-device">
      <p>No connected IoT device</p>
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 2rem;
  background-color: #F9FBFC;
  border-radius: 1.2rem;
  box-sizing: border-box;
}

p {
  font-size: 1rem;
  color: #7f8c8d;
}

.code-info {
  cursor: pointer;
  font-size: 1rem;
  color: #2980b9;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.code-info:hover {
  color: #3498db;
  text-decoration: underline;
}

.datatable-container {
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

@media (max-width: 768px) {
  .datatable-container {
    overflow-x: auto;
  }
}

.no-iot-device {
  text-align: center;
  font-size: 1.2rem;
  color: #e74c3c;
  padding: 2rem;
}
</style>
