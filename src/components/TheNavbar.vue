<template>
  <header
    class="glass-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="{ 'py-3': scrolled, 'py-5': !scrolled }"
  >
    <div class="max-w-6xl mx-auto px-6 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-accent">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 5h12M2 8h9M2 11h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="font-semibold text-[15px] tracking-tight text-white">AiDesk</span>
        <span class="text-xs text-muted font-medium bg-white/5 border border-white/8 rounded-full px-2 py-0.5 ml-1">Beta</span>
      </div>

      <!-- Nav links (desktop) -->
      <nav class="hidden md:flex items-center gap-7">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="text-sm text-[#9CA3B0] hover:text-white transition-colors duration-200 font-medium"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- CTA -->
      <div class="flex items-center gap-3">
        <a href="#contact" class="hidden md:block text-sm text-[#9CA3B0] hover:text-white transition-colors font-medium">
          로그인
        </a>
        <a
          href="#start"
          class="text-sm font-semibold px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
        >
          무료로 시작하기
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)

const navLinks = [
  { label: '기능', href: '#features' },
  { label: '활용 사례', href: '#usecases' },
  { label: '도입 방법', href: '#how' },
  { label: '보안', href: '#security' },
]

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>
