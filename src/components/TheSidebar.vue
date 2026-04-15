<template>
  <aside class="fixed left-0 top-0 h-screen w-[220px] bg-[#0D0D14] border-r border-white/[0.06] flex flex-col z-50">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-white/[0.06]">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-accent">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 5h12M2 8h9M2 11h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="font-semibold text-[15px] tracking-tight text-white">AiDesk</span>
        <span class="text-xs text-muted bg-white/5 border border-white/[0.08] rounded-full px-2 py-0.5">Beta</span>
      </div>
    </div>

    <!-- New Chat Button -->
    <div class="px-3 pt-4 pb-2">
      <button
        @click="emit('navigate', 'chat')"
        class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
      >
        <Icon icon="lucide:plus" class="w-4 h-4 flex-shrink-0" />
        새로운 채팅
      </button>
    </div>

    <!-- Divider -->
    <div class="mx-3 mb-2 border-t border-white/[0.06]" />

    <!-- Nav Items -->
    <nav class="flex-1 px-3 space-y-0.5 overflow-y-auto">
      <button
        v-for="item in navItems"
        :key="item.page"
        @click="emit('navigate', item.page)"
        class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left"
        :class="currentPage === item.page
          ? 'bg-accent/10 text-accent border-l-2 border-accent pl-[10px]'
          : 'text-[#9CA3B0] hover:text-white hover:bg-white/[0.04]'"
      >
        <Icon :icon="item.icon" class="w-4 h-4 flex-shrink-0" />
        {{ item.label }}
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  currentPage: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['navigate'])

const navItems = [
  { page: 'home',         label: '홈',       icon: 'lucide:home' },
  { page: 'features',     label: '기능',     icon: 'lucide:zap' },
  { page: 'how',          label: '도입 방법', icon: 'lucide:repeat-2' },
  { page: 'usecases',     label: '활용 사례', icon: 'lucide:briefcase' },
  { page: 'testimonials', label: '후기',     icon: 'lucide:star' },
  { page: 'security',     label: '보안',     icon: 'lucide:shield' },
  { page: 'cta',          label: '시작하기',  icon: 'lucide:rocket' },
]
</script>
