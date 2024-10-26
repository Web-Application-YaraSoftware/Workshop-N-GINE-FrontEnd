<script setup>
import {IoTDevice} from "../model/iot-device.entity.js";
import {CodeState} from "../model/code-state.enum.js";
import {nextTick, ref} from "vue";

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

function onDisplayCodeInformation(event, code){
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
  <div v-if="iotInformation">
    <pv-datatable
        :value="iotInformation.codeList"
        removableSort
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
    >
      <pv-column field="component" header="Component" sortable></pv-column>
      <pv-column field="state" header="State" sortable>
        <template #body="{data}">
          <pv-tag :severity="getStatusSeverity(data.state)">
            {{CodeState.getName(data.state)}}
          </pv-tag>
        </template>
      </pv-column>
      <pv-column field="errorCode" header="Error Code" sortable>
        <template #body="{data}">
          <p class="code-info" v-if="data.errorCode" @click="onDisplayCodeInformation($event, data)">{{data.errorCode}}</p>
          <p v-if="!data.errorCode">-</p>
        </template>
      </pv-column>
    </pv-datatable>
    <pv-popover ref="popover">
      <div v-if="selectedCode">{{selectedCode.description}}</div>
    </pv-popover>
  </div>
  <div v-else>
    <p>No connected Iot device</p>
  </div>
</template>

<style scoped>
.code-info{
  &:hover{
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>