<template>
  <span
    class="inline-flex items-center justify-center"
    :class="[sizeClasses[size] || sizeClasses.md]"
    role="img"
    :aria-label="label"
  >
    <svg class="h-full w-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient :id="`${iconId}-border`" x1="9" y1="7" x2="55" y2="57" gradientUnits="userSpaceOnUse">
          <stop stop-color="#67E8F9" />
          <stop offset="1" stop-color="#38BDF8" />
        </linearGradient>
        <linearGradient :id="`${iconId}-line`" x1="18" y1="15" x2="49" y2="52" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7DD3FC" />
          <stop offset="0.55" stop-color="#5EEAD4" />
          <stop offset="1" stop-color="#38BDF8" />
        </linearGradient>
        <radialGradient :id="`${iconId}-glow-fill`" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(31 29) rotate(90) scale(28)">
          <stop stop-color="#123B52" />
          <stop offset="1" stop-color="#0F172A" />
        </radialGradient>
        <filter :id="`${iconId}-glow`" x="2" y="2" width="60" height="60" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.25 0 0 0 0 0.91 0 0 0 0 0.88 0 0 0 0.65 0" />
          <feBlend in="SourceGraphic" />
        </filter>
      </defs>

      <rect x="4" y="4" width="56" height="56" rx="15" fill="#0F1D29" stroke="#1E3A4A" stroke-width="1.2" />
      <rect x="8" y="8" width="48" height="48" rx="12" :fill="`url(#${iconId}-glow-fill)`" />
      <rect x="8" y="8" width="48" height="48" rx="12" :stroke="`url(#${iconId}-border)`" stroke-width="2.2" />

      <g :filter="`url(#${iconId}-glow)`" :stroke="`url(#${iconId}-line)`" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23.5 26.5C23.5 21.25 27.35 18.5 32 18.5C36.65 18.5 40.5 21.25 40.5 26.5" />
        <path d="M23 28H41C43.2 28 44.5 29.35 44.5 31.4V34.1C44.5 38.35 39.75 40.4 32 40.4C24.25 40.4 19.5 38.35 19.5 34.1V31.4C19.5 29.35 20.8 28 23 28Z" />
        <path d="M19.5 31H17.5C16.25 31 15.4 31.85 15.4 33.1V35.6C15.4 36.85 16.25 37.7 17.5 37.7H19.5" />
        <path d="M44.5 31H46.5C47.75 31 48.6 31.85 48.6 33.1V35.6C48.6 36.85 47.75 37.7 46.5 37.7H44.5" />
        <path d="M26.2 41.1V45.2C26.2 46.8 28.4 48.1 32 48.1C35.6 48.1 37.8 46.8 37.8 45.2V41.1" />
        <path d="M21.5 43.2C19.1 45 17.9 47.4 17.9 50.2" />
        <path d="M42.5 43.2C44.9 45 46.1 47.4 46.1 50.2" />
        <path d="M24.8 49.2C27 50.2 29.4 50.7 32 50.7C34.6 50.7 37 50.2 39.2 49.2" />
        <path d="M43.5 39.2C46.9 38 49.3 34.8 50.6 31.2" />
        <path d="M49.7 31.7L53 28.2" />
        <path d="M50.9 30.6C53 32 54.7 34 55.6 36.4" />
        <path d="M52 31.2L55.2 29.1" />
        <path d="M52.5 33.8L56.3 33.5" />
      </g>

      <circle cx="27.2" cy="32.8" r="2.05" fill="#67E8F9" />
      <circle cx="36.8" cy="32.8" r="2.05" fill="#67E8F9" />
      <path d="M29.2 36.7C30.25 37.65 31.05 38.05 32 38.05C32.95 38.05 33.75 37.65 34.8 36.7" stroke="#67E8F9" stroke-width="2.1" stroke-linecap="round" />
      <text x="32" y="46" text-anchor="middle" font-size="5.8" font-weight="700" fill="#7DD3FC" font-family="Arial, sans-serif">TC</text>
    </svg>
  </span>
</template>

<script setup>
const iconId = `tc-ai-bot-${Math.random().toString(36).slice(2)}`

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
