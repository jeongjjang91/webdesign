<template>
  <div class="flex min-h-screen bg-[#0A0A0F] text-white font-pretendard">
    <!-- Sidebar -->
    <TheSidebar
      :currentPage="currentPage"
      :dashboardMenu="dashboardMenu"
      :collapsed="isSidebarCollapsed"
      @navigate="navigateTo"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Content area -->
    <main
      class="flex h-screen flex-1 flex-col overflow-hidden transition-[margin] duration-300"
      :class="isSidebarCollapsed ? 'ml-[72px]' : 'ml-[220px]'"
    >
      <Transition name="fade" mode="out-in" appear>
        <component
          :is="currentComponent"
          :key="currentComponentKey"
          :initial-prompt="chatInitialPrompt"
          :dashboard-menu="dashboardMenu"
          class="min-h-0 w-full flex-1 overflow-y-auto"
          @navigate="navigateTo"
        />
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'
import TheSidebar from './components/TheSidebar.vue'
import ChatbotPage from './components/ChatbotPage.vue'
import HeroSection from './components/HeroSection.vue'
import DashboardSection from './components/DashboardSection.vue'
import LogoStrip from './components/LogoStrip.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import LogDownloadPage from './components/LogDownloadPage.vue'
import HowItWorksSection from './components/HowItWorksSection.vue'
import UseCasesSection from './components/UseCasesSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import SecuritySection from './components/SecuritySection.vue'
import CTASection from './components/CTASection.vue'
import TheFooter from './components/TheFooter.vue'

const initialParams = new URLSearchParams(window.location.search)
const initialPage = pageMapValue(initialParams.get('page'))
const initialDashboardMenu = initialParams.get('menu') || 'requests'

const currentPage = ref(initialPage)
const chatInitialPrompt = ref('')
const chatSessionKey = ref(0)
const dashboardMenu = ref(initialDashboardMenu)
const isSidebarCollapsed = ref(false)

function pageMapValue(page) {
  return page || 'home'
}

function syncAppUrl() {
  const params = new URLSearchParams(window.location.search)

  if (currentPage.value === 'home') {
    params.delete('page')
  } else {
    params.set('page', currentPage.value)
  }

  if (currentPage.value === 'dashboard') {
    params.set('menu', dashboardMenu.value)
  } else {
    params.delete('menu')
  }

  const query = params.toString()
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
}

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function navigateTo(page, initialPrompt = '') {
  if (page === 'dashboard' && typeof initialPrompt === 'object' && initialPrompt?.dashboardMenu) {
    dashboardMenu.value = initialPrompt.dashboardMenu
  }

  chatInitialPrompt.value = page === 'chat' && typeof initialPrompt === 'string' ? initialPrompt : ''
  if (page === 'chat') {
    chatSessionKey.value += 1
  }
  currentPage.value = page
  syncAppUrl()
}

const HomePage = defineComponent({
  setup() {
    return () => h('div', [
      h(HeroSection, {
        onNavigate: (page, initialPrompt) => {
          navigateTo(page, initialPrompt)
        },
      }),
      h(LogoStrip),
      h(TheFooter),
    ])
  }
})

const pageMap = {
  home:         HomePage,
  dashboard:    DashboardSection,
  features:     FeaturesSection,
  'log-download': LogDownloadPage,
  how:          HowItWorksSection,
  usecases:     UseCasesSection,
  testimonials: TestimonialsSection,
  security:     SecuritySection,
  cta:          CTASection,
  chat:         ChatbotPage,
}

const currentComponent = computed(() => pageMap[currentPage.value])
const currentComponentKey = computed(() => (
  currentPage.value === 'chat'
    ? `chat-${chatSessionKey.value}`
    : currentPage.value
))
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center top;
  will-change: opacity, transform;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
