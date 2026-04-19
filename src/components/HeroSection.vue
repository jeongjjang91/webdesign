<template>
  <section class="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden noise-overlay">
    <!-- Background gradients -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]"></div>
      <div class="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/8 blur-[100px]"></div>
      <div class="absolute top-[40%] left-[60%] w-[200px] h-[200px] rounded-full bg-blue-500/6 blur-[80px]"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <div class="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
        <!-- Left: Content -->
        <div>
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8 reveal">
            <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"></span>
            <span class="text-xs font-semibold text-accent/90 tracking-wide uppercase">사내 전용 AI 플랫폼</span>
          </div>

          <!-- Headline -->
          <h1 class="text-[52px] lg:text-[64px] font-bold leading-[1.08] tracking-tight mb-6 reveal reveal-delay-1">
            업무 효율을<br />
            <span class="text-gradient">10배 높이는</span><br />
            TC 어시스턴트
          </h1>

          <!-- Subtext -->
          <p class="text-[17px] leading-relaxed text-[#9CA3B0] mb-10 max-w-[480px] reveal reveal-delay-2">
            설비 TC 현황, 로그 다운로드, CEID 매핑, 개발 계획을 한 화면에서 빠르게 확인하는 사내 AI 어시스턴트입니다.
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-1 gap-3 mt-12 pt-8 border-t border-white/6 sm:grid-cols-3 reveal reveal-delay-4">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="rounded-lg border border-white/[0.08] bg-white/[0.055] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              <div class="text-2xl font-bold tabular-nums text-white">{{ stat.value }}</div>
              <div class="text-xs text-[#9CA3B0] mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Right: Chat UI Preview -->
        <div class="relative reveal reveal-delay-2">
          <!-- Floating card -->
          <div class="relative glass-card rounded-2xl p-1 inner-glow glow-accent animate-float">
          <!-- Chat header -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-white/6">
            <div>
              <div class="text-[16px] font-semibold text-white">TC AI Bot</div>
              <div class="text-[13px] text-emerald-400 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                온라인
              </div>
            </div>
            <div class="ml-auto flex gap-1.5">
              <div class="w-2 h-2 rounded-full bg-white/20"></div>
              <div class="w-2 h-2 rounded-full bg-white/20"></div>
              <div class="w-2 h-2 rounded-full bg-white/20"></div>
            </div>
          </div>

          <!-- Chat messages -->
          <div class="p-4 space-y-3 min-h-[320px]">
            <!-- User message -->
            <div class="flex justify-end">
              <div class="bg-[#123B52] border border-sky-400/10 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]">
                <p class="text-[13px] text-white/90 leading-relaxed">지난주 설비 TC 이슈를 요약해줘. 핵심 결정사항만.</p>
              </div>
            </div>

            <!-- AI response -->
            <div class="flex gap-2.5">
              <TcAiBotIcon size="sm" label="TC AI Bot" class="flex-shrink-0 mt-0.5" />
              <div class="glass-card rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                <p class="text-[13px] text-white/80 leading-relaxed mb-2">확인했습니다. <strong class="text-white">핵심 결정사항 3가지</strong></p>
                <ul class="text-[12px] text-[#9CA3B0] space-y-1.5">
                  <li class="flex gap-2"><span class="text-accent">01</span> LINE-12 설비 로그 보존 정책 확정</li>
                  <li class="flex gap-2"><span class="text-accent">02</span> CEID 매핑 검증 담당자 지정</li>
                  <li class="flex gap-2"><span class="text-accent">03</span> 서버 API 연동 일정 재조정</li>
                </ul>
              </div>
            </div>

            <!-- User follow-up -->
            <div class="flex justify-end">
              <div class="bg-[#123B52] border border-sky-400/10 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]">
                <p class="text-[13px] text-white/90 leading-relaxed">담당자별 후속 작업도 정리해줘.</p>
              </div>
            </div>

            <!-- Typing indicator -->
            <div class="flex gap-2.5 items-end">
              <div class="hero-bot-avatar hero-bot-avatar--loading flex-shrink-0">
                <TcAiBotIcon size="sm" label="TC AI Bot" class="relative z-10" />
              </div>
            </div>
          </div>

          <!-- Input area -->
          <div class="px-4 pb-4">
            <div class="mb-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
              <div class="mb-2 flex items-center justify-between">
                <span class="text-[11px] font-semibold text-[#9CA3B0]">실시간 업무 절감 트렌드</span>
                <span class="text-[11px] font-semibold text-accent">+18%</span>
              </div>
              <svg viewBox="0 0 220 54" class="h-12 w-full" role="img" aria-label="실시간 업무 절감 트렌드 스파크라인">
                <path d="M4 44 H216" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
                <path d="M4 34 H216" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
                <path d="M6 40 C28 34, 42 36, 60 26 C82 14, 98 23, 118 18 C142 12, 158 26, 178 14 C194 6, 206 10, 216 7" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
            <div class="flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
              <span class="text-[12px] text-muted flex-1">사내 데이터에 대해 무엇이든 물어보세요...</span>
              <button class="w-6 h-6 rounded-lg bg-accent/80 flex items-center justify-center">
                <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
              </button>
            </div>
          </div>
          </div>

          <!-- Floating badges -->
          <div class="absolute -top-4 -right-4 glass-card rounded-xl px-3 py-2 border border-white/10 animate-float" style="animation-delay: 1s">
            <div class="flex items-center gap-2">
              <span class="text-lg">🔒</span>
              <div>
                <div class="text-[11px] font-semibold text-white">안전 격리</div>
                <div class="text-[10px] text-muted">사내망 전용</div>
              </div>
            </div>
          </div>

          <div class="absolute -bottom-4 -left-4 glass-card rounded-xl px-3 py-2 border border-white/10 animate-float" style="animation-delay: 2s">
            <div class="flex items-center gap-2">
              <span class="text-lg">⚡</span>
              <div>
                <div class="text-[11px] font-semibold text-white">응답 0.8초</div>
                <div class="text-[10px] text-muted">평균 응답 속도</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wide Chat Shortcut -->
      <form
        class="reveal reveal-delay-3 mx-auto mt-16 max-w-4xl"
        @submit.prevent="openChat"
      >
        <div class="rounded-lg border border-white/[0.08] bg-white/[0.05] p-4">
          <label for="home-chat-input" class="mb-3 block text-sm font-semibold text-white">
            TC 어시스턴트에게 바로 질문하기
          </label>
          <div class="mb-5 grid grid-cols-2 gap-2">
            <button
              v-for="chip in promptChips"
              :key="chip.label"
              type="button"
              class="group relative rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 pr-9 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-white/[0.075] hover:shadow-lg hover:shadow-accent/10 active:translate-y-0"
              @click="selectPrompt(chip.prompt)"
            >
              <span class="flex items-start gap-3">
                <span
                  class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-base"
                  :class="[chip.iconBg, chip.color]"
                >
                  {{ chip.emoji }}
                </span>
                <span class="min-w-0 pr-4">
                  <span class="block truncate text-[13px] font-semibold leading-5 text-white">
                    {{ chip.label }}
                  </span>
                  <span class="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-[#8B94A5]">
                    {{ chip.description }}
                  </span>
                </span>
              </span>
              <span class="absolute right-3 top-3 text-[13px] text-[#6B7280] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white">
                >
              </span>
            </button>
          </div>
          <div class="relative">
            <textarea
              id="home-chat-input"
              v-model="homeChatText"
              rows="3"
              class="min-h-[132px] w-full resize-none rounded-lg border border-white/[0.08] bg-[#0D0D14] px-4 py-3 pb-16 text-sm leading-relaxed text-white placeholder-[#7D8594] outline-none transition-colors focus:border-accent/50"
              placeholder="궁금한 내용을 입력하거나 아래 예시를 선택하세요."
              @keydown.enter.exact.prevent="openChat"
            />
            <button
              type="submit"
              class="app-cta app-cta--sm absolute bottom-3 right-3 h-11 text-sm"
            >
              <span class="app-cta__glow"></span>
              <span class="app-cta__content">
                채팅 시작
                <svg class="app-cta__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-6-6 6 6-6 6"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { useReveal } from '../composables/useReveal'
import TcAiBotIcon from './TcAiBotIcon.vue'
useReveal()

const emit = defineEmits(['navigate'])

const homeChatText = ref('')
let promptTypingTimer = null

function openChat() {
  emit('navigate', 'chat', homeChatText.value.trim())
}

function selectPrompt(prompt) {
  if (promptTypingTimer) {
    clearInterval(promptTypingTimer)
  }

  homeChatText.value = ''
  let index = 0

  promptTypingTimer = setInterval(() => {
    homeChatText.value += prompt[index]
    index += 1

    if (index >= prompt.length) {
      clearInterval(promptTypingTimer)
      promptTypingTimer = null
    }
  }, 18)
}

onUnmounted(() => {
  if (promptTypingTimer) {
    clearInterval(promptTypingTimer)
  }
})

const promptChips = [
  {
    emoji: 'M',
    label: '회의록 요약',
    description: '긴 회의를 핵심만 짧게 정리해요',
    prompt: '회의록을 핵심 결정사항 중심으로 요약해줘',
    color: 'text-orange-300',
    iconBg: 'bg-orange-400/10',
  },
  {
    emoji: 'P',
    label: '업무 우선순위',
    description: '할 일을 중요한 순서로 정리해요',
    prompt: '이번 주 업무 우선순위를 정리해줘',
    color: 'text-rose-300',
    iconBg: 'bg-rose-400/10',
  },
  {
    emoji: 'R',
    label: '응답 초안',
    description: '문의에 맞는 답변 문구를 만들어요',
    prompt: '고객 문의 답변 초안을 작성해줘',
    color: 'text-sky-300',
    iconBg: 'bg-sky-400/10',
  },
  {
    emoji: 'W',
    label: '문장 다듬기',
    description: '딱딱한 문장을 자연스럽게 바꿔요',
    prompt: '보고서 문장을 더 자연스럽게 다듬어줘',
    color: 'text-violet-300',
    iconBg: 'bg-violet-400/10',
  },
  {
    emoji: 'L',
    label: '리스크 정리',
    description: '위험 요소와 대응책을 묶어줘요',
    prompt: '프로젝트 리스크를 항목별로 정리해줘',
    color: 'text-amber-300',
    iconBg: 'bg-amber-400/10',
  },
  {
    emoji: 'D',
    label: '온보딩 문서',
    description: '신규 인원 안내를 빠르게 만들어요',
    prompt: '신규 입사자 안내 문서를 만들어줘',
    color: 'text-emerald-300',
    iconBg: 'bg-emerald-400/10',
  },
]

const stats = [
  { value: '2,400+', label: '월간 요청' },
  { value: '94%', label: '업무 시간 절감' },
  { value: '30+', label: '연동 시스템' },
]
</script>

<style scoped>
.hero-bot-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}

.hero-bot-avatar--lg {
  width: 4rem;
  height: 4rem;
}

.hero-bot-avatar--loading::before {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 9999px;
  background:
    conic-gradient(from 0deg, rgba(14, 165, 233, 0), rgba(14, 165, 233, 0.95), rgba(192, 38, 211, 0.9), rgba(14, 165, 233, 0));
  animation: hero-bot-avatar-spin 0.9s linear infinite;
  filter: drop-shadow(0 0 10px rgba(14, 165, 233, 0.35));
}

.hero-bot-avatar--loading::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 9999px;
  background: #0D0D14;
}

@keyframes hero-bot-avatar-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
