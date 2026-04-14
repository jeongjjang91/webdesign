# Sidebar Navigation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current single-page scroll layout into a sidebar-driven app with a fixed left sidebar, per-page content area, and a streaming chatbot UI page.

**Architecture:** App.vue holds a `currentPage` ref that controls which section component is rendered in the right content area. TheSidebar.vue emits `navigate` events. ChatbotPage.vue simulates streaming text with `setInterval`. No Vue Router needed.

**Tech Stack:** Vue 3 (Composition API), Vite, Tailwind CSS v3, @iconify/vue

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `tailwind.config.js` | Modify | Change accent color from indigo to sky blue |
| `src/assets/main.css` | Modify | Update gradient and glow utilities to sky blue |
| `src/App.vue` | Rewrite | Sidebar + content layout, currentPage state |
| `src/components/TheSidebar.vue` | Create | Sidebar nav with menu items and chat button |
| `src/components/ChatbotPage.vue` | Create | Chat UI with simulated streaming |
| `src/components/TheNavbar.vue` | Delete | Replaced by sidebar |
| `src/composables/useReveal.js` | Keep | Used by individual section components |
| All section components | Modify | Add `useReveal()` call inside each component |

---

## Task 1: Update accent color system to sky blue

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/assets/main.css`

- [ ] **Step 1: Update tailwind.config.js accent colors**

Replace the `accent` block in `tailwind.config.js`:

```js
accent: {
  DEFAULT: '#0EA5E9',      // sky-500
  soft: '#38BDF8',         // sky-400
  glow: 'rgba(14,165,233,0.15)',
},
```

Full updated `colors` block:
```js
colors: {
  ink: {
    950: '#0A0A0F',
    900: '#111118',
    800: '#1A1A24',
    700: '#252532',
  },
  surface: {
    DEFAULT: '#1E1E2E',
    elevated: '#252538',
    glass: 'rgba(255,255,255,0.04)',
  },
  accent: {
    DEFAULT: '#0EA5E9',
    soft: '#38BDF8',
    glow: 'rgba(14,165,233,0.15)',
  },
  muted: '#6B7280',
  border: 'rgba(255,255,255,0.08)',
},
```

- [ ] **Step 2: Update main.css gradient and glow utilities**

Replace `.text-gradient` and `.glow-accent` in `src/assets/main.css`:

```css
.text-gradient {
  background: linear-gradient(135deg, #7DD3FC 0%, #0EA5E9 50%, #38BDF8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glow-accent {
  box-shadow: 0 0 40px rgba(14, 165, 233, 0.2);
}
```

- [ ] **Step 3: Verify dev server starts without errors**

```bash
npm run dev
```

Expected: Server starts at http://localhost:5173 with no console errors.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js src/assets/main.css
git commit -m "feat: update accent color from indigo to sky blue"
```

---

## Task 2: Add useReveal to each section component

**Context:** Previously `useReveal()` was called once in App.vue. In the new layout, each section is mounted/unmounted via `v-if`, so each component must call `useReveal()` itself to trigger animations on mount.

**Files:**
- Modify: `src/components/HeroSection.vue`
- Modify: `src/components/LogoStrip.vue`
- Modify: `src/components/FeaturesSection.vue`
- Modify: `src/components/HowItWorksSection.vue`
- Modify: `src/components/UseCasesSection.vue`
- Modify: `src/components/TestimonialsSection.vue`
- Modify: `src/components/SecuritySection.vue`
- Modify: `src/components/CTASection.vue`

- [ ] **Step 1: Add useReveal import and call to each section component**

In every section component listed above, find the `<script setup>` block and add these two lines if not already present:

```js
import { useReveal } from '../composables/useReveal'
useReveal()
```

Do this for all 8 section components.

- [ ] **Step 2: Commit**

```bash
git add src/components/
git commit -m "feat: move useReveal into individual section components"
```

---

## Task 3: Create TheSidebar.vue

**Files:**
- Create: `src/components/TheSidebar.vue`

- [ ] **Step 1: Create TheSidebar.vue**

```vue
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
        <span class="text-xs text-muted bg-white/5 border border-white/8 rounded-full px-2 py-0.5">Beta</span>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TheSidebar.vue
git commit -m "feat: create TheSidebar component"
```

---

## Task 4: Create ChatbotPage.vue

**Files:**
- Create: `src/components/ChatbotPage.vue`

- [ ] **Step 1: Create ChatbotPage.vue**

```vue
<template>
  <div class="flex flex-col h-full bg-[#0A0A0F]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3 flex-shrink-0">
      <div class="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
        <Icon icon="lucide:bot" class="w-4 h-4 text-accent" />
      </div>
      <div>
        <p class="text-sm font-semibold text-white">AiDesk AI Assistant</p>
        <p class="text-xs text-muted">스트리밍 응답 지원</p>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesEl" class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex gap-3"
        :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
      >
        <!-- Avatar -->
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          :class="msg.role === 'user' ? 'bg-accent/20' : 'bg-white/[0.06]'"
        >
          <Icon
            :icon="msg.role === 'user' ? 'lucide:user' : 'lucide:bot'"
            class="w-4 h-4"
            :class="msg.role === 'user' ? 'text-accent' : 'text-muted'"
          />
        </div>

        <!-- Bubble -->
        <div
          class="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
          :class="msg.role === 'user'
            ? 'bg-accent text-white rounded-tr-sm'
            : 'bg-white/[0.06] text-[#E5E7EB] rounded-tl-sm border border-white/[0.06]'"
        >
          <span>{{ msg.content }}</span>
          <span v-if="msg.streaming" class="inline-block w-[2px] h-[14px] bg-current ml-0.5 align-middle animate-[blink_0.8s_step-end_infinite]" />
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
      <form @submit.prevent="sendMessage" class="flex gap-3 items-end">
        <textarea
          v-model="inputText"
          :disabled="isStreaming"
          rows="1"
          placeholder="메시지를 입력하세요..."
          class="flex-1 resize-none bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50 max-h-[120px]"
          @keydown.enter.exact.prevent="sendMessage"
          @input="autoResize"
        />
        <button
          type="submit"
          :disabled="!inputText.trim() || isStreaming"
          class="w-10 h-10 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 flex-shrink-0"
        >
          <Icon :icon="isStreaming ? 'lucide:square' : 'lucide:send'" class="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

const messages = ref([
  {
    id: 0,
    role: 'assistant',
    content: '안녕하세요! AiDesk AI입니다. 무엇을 도와드릴까요?',
    streaming: false,
  },
])

const inputText = ref('')
const isStreaming = ref(false)
const messagesEl = ref(null)

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  })
}

function autoResize(e) {
  e.target.style.height = 'auto'
  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isStreaming.value) return

  // Add user message
  messages.value.push({ id: Date.now(), role: 'user', content: text, streaming: false })
  inputText.value = ''
  scrollToBottom()

  // Simulate assistant streaming response
  isStreaming.value = true
  const reply = generateReply(text)
  const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: '', streaming: true }
  messages.value.push(assistantMsg)
  scrollToBottom()

  let i = 0
  const interval = setInterval(() => {
    if (i < reply.length) {
      assistantMsg.content += reply[i]
      i++
      scrollToBottom()
    } else {
      assistantMsg.streaming = false
      isStreaming.value = false
      clearInterval(interval)
    }
  }, 30)
}

function generateReply(userText) {
  const replies = [
    'AiDesk는 AI 기반 고객 지원 플랫폼입니다. 팀의 생산성을 높이고 고객 만족도를 향상시킬 수 있어요.',
    '무엇이든 도와드릴게요! AiDesk의 기능, 요금제, 도입 방법 등에 대해 질문해주세요.',
    '좋은 질문이에요! AiDesk를 사용하면 반복적인 문의를 자동화하고 에이전트가 복잡한 문제에 집중할 수 있습니다.',
    '더 자세한 정보가 필요하시면 언제든지 말씀해 주세요. 전문 팀이 도움을 드릴 준비가 되어 있습니다.',
    '네, 이해했습니다. AiDesk는 엔터프라이즈 수준의 보안과 함께 쉬운 통합 옵션을 제공합니다.',
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}
</script>

<style>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ChatbotPage.vue
git commit -m "feat: create ChatbotPage with streaming UI"
```

---

## Task 5: Rewrite App.vue with sidebar layout

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Rewrite App.vue**

```vue
<template>
  <div class="flex min-h-screen bg-[#0A0A0F] text-white font-pretendard">
    <!-- Sidebar -->
    <TheSidebar :currentPage="currentPage" @navigate="currentPage = $event" />

    <!-- Content area -->
    <main class="ml-[220px] flex-1 min-h-screen overflow-y-auto">
      <Transition name="fade" mode="out-in">
        <component :is="currentComponent" :key="currentPage" />
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
import { defineComponent, h } from 'vue'

const currentPage = ref('home')

// Wrap multi-section home page in a single component
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
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:5173 and verify:
- Sidebar visible on left with logo and all menu items
- "새로운 채팅" button at top in sky blue
- Clicking each menu item swaps the right content
- Chat page shows with input and assistant greeting
- Fade transition plays between pages

- [ ] **Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat: rewrite App.vue with sidebar layout and page switching"
```

---

## Task 6: Remove TheNavbar and clean up

**Files:**
- Delete: `src/components/TheNavbar.vue`

- [ ] **Step 1: Delete TheNavbar.vue**

```bash
git rm src/components/TheNavbar.vue
```

- [ ] **Step 2: Check no remaining imports**

Search for any remaining references:

```bash
grep -r "TheNavbar" src/
```

Expected: no output (zero references remaining).

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove TheNavbar (replaced by TheSidebar)"
```

---

## Task 7: Fix chat page height and final polish

**Context:** ChatbotPage needs to fill the full viewport height so the input stays pinned to the bottom. The content area `<main>` has `min-h-screen` but ChatbotPage must also be `h-screen` to make the flex column work.

**Files:**
- Modify: `src/App.vue` (main element)
- Modify: `src/components/ChatbotPage.vue` (wrapper div)

- [ ] **Step 1: Make main element fixed height for chat**

In `src/App.vue`, update `<main>` to also support full-height pages:

```vue
<main class="ml-[220px] flex-1 h-screen overflow-hidden flex flex-col">
  <Transition name="fade" mode="out-in">
    <component :is="currentComponent" :key="currentPage" class="flex-1 overflow-y-auto" />
  </Transition>
</main>
```

For non-chat pages this just allows scrolling; for ChatbotPage the inner flex-col takes over.

- [ ] **Step 2: Verify chat page layout**

Open http://localhost:5173, click "새로운 채팅":
- Header is pinned at top
- Input is pinned at bottom
- Message area scrolls in the middle
- Typing a message and pressing Enter shows user bubble, then streaming assistant response

- [ ] **Step 3: Verify other pages still scroll correctly**

Click 기능, 도입 방법, 보안 — content should scroll normally within the right area.

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat: fix chat page layout and finalize sidebar redesign"
git push origin master
```

---

## Self-Review

**Spec coverage check:**
- ✅ Fixed left sidebar (220px, always visible, icons + text) → Task 3
- ✅ 새로운 채팅 button above nav items → Task 3
- ✅ All 7 section pages mapped → Task 3 + Task 5
- ✅ Sky blue accent (#0EA5E9) → Task 1
- ✅ currentPage state management → Task 5
- ✅ Fade transition → Task 5
- ✅ Chat: streaming cursor animation → Task 4
- ✅ Chat: auto-scroll on new messages → Task 4
- ✅ Chat: send disabled while streaming → Task 4
- ✅ Chat: initial greeting message → Task 4
- ✅ TheNavbar removed → Task 6
- ✅ useReveal per component → Task 2
- ✅ Chat layout (header/messages/input pinned) → Task 7

**No placeholders, no TBDs, no missing code blocks.**
