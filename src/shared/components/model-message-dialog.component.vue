<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    default: 'Are you sure you want to delete it?'
  },
  visible:{
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'reject', 'update:visible'])

function onConfirm(){
  emit('confirm');
  emit('update:visible', false);
}

function onReject(){
  emit('reject');
  emit('update:visible', false);
}

</script>

<template>
  <pv-dialog v-model:visible="props.visible" :style="{ width: '300px' }" :header="props.title" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span>{{ props.message }}</span>
    </div>
    <template #footer>
      <pv-button label="No" icon="pi pi-times" text @click="onReject" />
      <pv-button label="Yes" icon="pi pi-check" @click="onConfirm" />
    </template>
  </pv-dialog>
</template>

<style scoped>

</style>