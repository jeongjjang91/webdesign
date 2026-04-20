<template>
  <span
    class="inline-flex items-center justify-center"
    :class="[sizeClasses[size] || sizeClasses.md]"
    role="img"
    :aria-label="label"
  >
    <img src="/tc-assistant-brand-icon.png" alt="" class="h-full w-full object-contain" />
  </span>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
  },
  label: {
    type: String,
    default: 'TC AI Bot',
  },
})

const sizeClasses = {
  xs: 'h-8 w-8',
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}
</script>
