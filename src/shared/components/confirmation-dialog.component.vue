<script setup>
import { defineEmits } from 'vue';

const props = defineProps({
  message: String
});

const emits = defineEmits(['confirm', 'dismiss']);

function onConfirm() {
  emits('confirm');
}

function onDismiss() {
  emits('dismiss');
}
</script>

<template>
  <pv-dialog :visible="true" modal>
    <div class="message-content">{{ message }}</div>
    <div class="spacer"></div>
    <div class="action-buttons-container">
      <pv-button label="Confirm" class="p-button-primary" @click="onConfirm" />
      <pv-button label="Cancel" class="p-button-danger" @click="onDismiss" />
    </div>
  </pv-dialog>
</template>

<style scoped>
.message-content {
  font-weight: 400;
  line-height: 2rem;
  text-align: center;
}

.spacer {
  margin-top: 20px;
}

.action-buttons-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
