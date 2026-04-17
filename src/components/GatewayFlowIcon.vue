<template>
  <span
    class="inline-flex items-center justify-center"
    :class="[sizeClasses[size] || sizeClasses.md]"
    role="img"
    :aria-label="label"
  >
    <svg class="h-full w-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient :id="`${iconId}-line-left`" x1="10" y1="32" x2="27" y2="32" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4B5563" />
          <stop offset="1" stop-color="#2563EB" stop-opacity="0.65" />
        </linearGradient>
        <linearGradient :id="`${iconId}-line-right`" x1="37" y1="32" x2="54" y2="32" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2563EB" stop-opacity="0.65" />
          <stop offset="1" stop-color="#4B5563" />
        </linearGradient>
        <radialGradient :id="`${iconId}-core`" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 32) rotate(90) scale(14)">
          <stop stop-color="#38BDF8" />
          <stop offset="0.6" stop-color="#2563EB" />
          <stop offset="1" stop-color="#1D4ED8" />
        </radialGradient>
        <filter :id="`${iconId}-glow`" x="10" y="10" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.145 0 0 0 0 0.388 0 0 0 0 0.922 0 0 0 0.85 0" />
          <feBlend in="SourceGraphic" />
        </filter>
      </defs>

      <rect x="3" y="3" width="58" height="58" rx="15" fill="#111827" stroke="#38BDF8" stroke-opacity="0.38" stroke-width="2" />
      <rect x="8" y="8" width="48" height="48" rx="12" fill="#0F2230" fill-opacity="0.78" />

      <rect x="9.5" y="27.5" width="8" height="8" rx="2" fill="#1F2937" stroke="#64748B" stroke-width="1.6" />
      <path d="M18.5 32H26.5" :stroke="`url(#${iconId}-line-left)`" stroke-width="2.3" stroke-linecap="round" />
      <path d="M24 27.5L28.5 32L24 36.5M20 27.5L24.5 32L20 36.5" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <path d="M37.5 32H45.5" :stroke="`url(#${iconId}-line-right)`" stroke-width="2.3" stroke-linecap="round" />
      <path d="M41 27.5L45.5 32L41 36.5M45 27.5L49.5 32L45 36.5" stroke="#7DD3FC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="46.5" y="27.5" width="8" height="8" rx="2" fill="#1F2937" stroke="#64748B" stroke-width="1.6" />

      <g class="origin-center animate-pulse" :filter="`url(#${iconId}-glow)`">
        <circle cx="32" cy="32" r="10" :fill="`url(#${iconId}-core)`" />
        <circle cx="32" cy="32" r="4.3" fill="#E0F2FE" />
      </g>

      <path d="M32 17V23" stroke="#2563EB" stroke-width="2.4" stroke-linecap="round" />
      <circle cx="32" cy="16" r="2.8" fill="#38BDF8" />
      <path d="M32 41V47" stroke="#2563EB" stroke-width="2.4" stroke-linecap="round" />
      <circle cx="32" cy="48" r="2.8" fill="#38BDF8" />
    </svg>
  </span>
</template>

<script setup>
const iconId = `gateway-flow-${Math.random().toString(36).slice(2)}`

defineProps({
  size: {
    type: String,
    default: 'md',
  },
  label: {
    type: String,
    default: 'TC Assistant Gateway Flow',
  },
})

const sizeClasses = {
  xs: 'h-8 w-8',
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}
</script>
