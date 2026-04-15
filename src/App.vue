<template>
  <div class="flex min-h-screen bg-[#0A0A0F] text-white font-pretendard">
    <!-- Sidebar -->
    <TheSidebar :currentPage="currentPage" @navigate="currentPage = $event" />

    <!-- Content area -->
    <main class="ml-[220px] flex-1 h-screen overflow-hidden flex flex-col">
      <Transition name="fade" mode="out-in">
        <component :is="currentComponent" :key="currentPage" class="flex-1 overflow-y-auto" />
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'
import TheSidebar from './components/TheSidebar.vue'
import ChatbotPage from './components/ChatbotPage.vue'
import HeroSection from './components/HeroSection.vue'
import LogoStrip from './components/LogoStrip.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HowItWorksSection from './components/HowItWorksSection.vue'
import UseCasesSection from './components/UseCasesSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import SecuritySection from './components/SecuritySection.vue'
import CTASection from './components/CTASection.vue'
import TheFooter from './components/TheFooter.vue'

const currentPage = ref('home')

const HomePage = defineComponent({
  setup() {
    return () => h('div', [
      h(HeroSection),
      h(LogoStrip),
      h(TheFooter),
    ])
  }
})

const pageMap = {
  home:         HomePage,
  features:     FeaturesSection,
  how:          HowItWorksSection,
  usecases:     UseCasesSection,
  testimonials: TestimonialsSection,
  security:     SecuritySection,
  cta:          CTASection,
  chat:         ChatbotPage,
}

const currentComponent = computed(() => pageMap[currentPage.value])
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
