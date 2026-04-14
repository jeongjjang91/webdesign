<template>
  <section class="py-16 border-y border-white/6">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-center text-xs text-muted font-medium tracking-widest uppercase mb-10 reveal">
        국내 주요 기업이 신뢰하는 사내 AI 플랫폼
      </p>
      <div class="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 reveal reveal-delay-1">
        <span
          v-for="company in companies"
          :key="company"
          class="text-[15px] font-semibold text-white/25 hover:text-white/50 transition-colors duration-300 tracking-tight"
        >
          {{ company }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
const companies = [
  'Kakao Enterprise', 'Naver Cloud', 'KT DS', 'Samsung SDS',
  'LG CNS', 'SK C&C', 'Hyundai AutoEver', 'Lotte Data',
]
</script>
