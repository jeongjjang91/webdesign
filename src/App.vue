<template>
  <div class="min-h-screen bg-[#0A0A0F] text-white font-pretendard">
    <TheNavbar />
    <main>
      <HeroSection />
      <LogoStrip />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <TestimonialsSection />
      <SecuritySection />
      <CTASection />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheNavbar from './components/TheNavbar.vue'
import HeroSection from './components/HeroSection.vue'
import LogoStrip from './components/LogoStrip.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HowItWorksSection from './components/HowItWorksSection.vue'
import UseCasesSection from './components/UseCasesSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import SecuritySection from './components/SecuritySection.vue'
import CTASection from './components/CTASection.vue'
import TheFooter from './components/TheFooter.vue'
import { useReveal } from './composables/useReveal'

useReveal()
</script>
