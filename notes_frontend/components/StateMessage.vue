<template>
  <div class="empty-state" :aria-live="live ? 'polite' : undefined">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  live?: boolean
}>()
</script>
