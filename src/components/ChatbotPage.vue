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
          <span
            v-if="msg.streaming"
            class="inline-block w-[2px] h-[14px] bg-current ml-0.5 align-middle"
            style="animation: blink 0.8s step-end infinite"
          />
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

  messages.value.push({ id: Date.now(), role: 'user', content: text, streaming: false })
  inputText.value = ''
  scrollToBottom()

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

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
