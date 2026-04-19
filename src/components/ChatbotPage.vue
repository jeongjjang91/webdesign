<template>
  <div class="flex flex-col h-full bg-[#0A0A0F]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3 flex-shrink-0">
      <div>
        <p class="text-sm font-semibold text-white">TC AI Bot</p>
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
          v-if="msg.role === 'user'"
          class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-accent/20"
        >
          <Icon
            icon="lucide:user"
            class="w-4 h-4 text-accent"
          />
        </div>
        <div
          v-else
          class="bot-avatar-wrap mt-0.5 flex-shrink-0"
          :class="msg.streaming ? 'bot-avatar-wrap--loading' : ''"
        >
          <TcAiBotIcon
            size="sm"
            label="TC AI Bot"
            class="relative z-10"
          />
        </div>

        <!-- Bubble -->
        <div
          v-if="!(msg.role === 'assistant' && msg.streaming && !msg.content)"
          class="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
          :class="msg.role === 'user'
            ? 'bg-[#123B52] text-white rounded-tr-sm border border-sky-400/10'
            : 'bg-white/[0.06] text-[#E5E7EB] rounded-tl-sm border border-white/[0.06]'"
        >
          <div
            v-if="msg.role === 'assistant' && msg.renderedContent"
            class="assistant-content"
            @click="handleAssistantContentClick"
            v-html="msg.renderedContent"
          />
          <span v-else-if="msg.role === 'assistant'" class="whitespace-pre-wrap">{{ msg.content }}</span>
          <span v-else class="whitespace-pre-wrap">{{ msg.content }}</span>

          <div
            v-if="msg.role === 'assistant' && !msg.streaming && msg.id !== 0"
            class="mt-3 border-t border-white/[0.06] pt-2"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] text-[#8B94A5]">응답 평가</span>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors"
                :class="msg.feedback === 'good'
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-white/[0.08] bg-white/[0.04] text-[#AEB6C6] hover:border-emerald-400/30 hover:text-white'"
                @click="setFeedback(msg, 'good')"
              >
                <Icon icon="lucide:thumbs-up" class="h-3.5 w-3.5" />
                좋아요
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors"
                :class="msg.feedback === 'bad'
                  ? 'border-rose-400/30 bg-rose-400/10 text-rose-300'
                  : 'border-white/[0.08] bg-white/[0.04] text-[#AEB6C6] hover:border-rose-400/30 hover:text-white'"
                @click="setFeedback(msg, 'bad')"
              >
                <Icon icon="lucide:thumbs-down" class="h-3.5 w-3.5" />
                별로예요
              </button>
              <span v-if="msg.feedback === 'good'" class="text-[11px] text-emerald-300">
                피드백 감사합니다
              </span>
            </div>

            <div v-if="msg.feedback === 'bad'" class="mt-2">
              <textarea
                v-model="msg.feedbackComment"
                rows="2"
                class="w-full resize-none rounded-md border border-white/[0.08] bg-[#0D0D14] px-3 py-2 text-[12px] leading-relaxed text-white placeholder-[#6B7280] outline-none transition-colors focus:border-accent/50"
                placeholder="어떤 점이 아쉬웠나요?"
                @keydown.enter.exact.prevent="submitFeedback(msg)"
              />
              <div class="mt-2 flex items-center justify-end gap-2">
                <span v-if="msg.feedbackSubmitted" class="mr-auto text-[11px] text-emerald-300">
                  의견이 저장되었습니다
                </span>
                <span v-else class="mr-auto text-[11px] text-[#7D8594]">
                  Enter로 전송, Shift + Enter로 줄바꿈
                </span>
                <button
                  type="button"
                  class="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[11px] font-medium text-[#AEB6C6] transition-colors hover:border-accent/40 hover:text-white"
                  @click="submitFeedback(msg)"
                >
                  의견 보내기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
      <form @submit.prevent="sendMessage()" class="flex gap-3 items-end">
        <textarea
          ref="inputEl"
          v-model="inputText"
          :disabled="isStreaming"
          rows="1"
          placeholder="메시지를 입력하세요..."
          class="flex-1 resize-none bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50 max-h-[120px]"
          @keydown.enter.exact.prevent="sendMessage()"
          @input="autoResize"
        />
        <button
          type="submit"
          :disabled="!inputText.trim() || isStreaming"
          class="app-cta app-cta--icon"
        >
          <span class="app-cta__glow"></span>
          <span class="app-cta__content">
            <Icon :icon="isStreaming ? 'lucide:square' : 'lucide:send'" class="h-4 w-4 text-white" />
          </span>
        </button>
      </form>
      <p class="mt-2 text-[11px] text-[#7D8594]">
        Enter로 전송하고, Shift + Enter로 줄바꿈할 수 있습니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import TcAiBotIcon from './TcAiBotIcon.vue'

const props = defineProps({
  initialPrompt: {
    type: String,
    default: '',
  },
})

const messages = ref([
  {
    id: 0,
    role: 'assistant',
    content: 'TC AI Bot입니다. 무엇을 도와드릴까요?',
    streaming: false,
    renderedContent: '',
    feedback: null,
    feedbackComment: '',
    feedbackSubmitted: false,
  },
])

const inputText = ref('')
const isStreaming = ref(false)
const messagesEl = ref(null)
const inputEl = ref(null)
let demoReplyIndex = 0
let replyTimer = null

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

function sendMessage(textOverride = '') {
  const text = typeof textOverride === 'string' && textOverride.trim()
    ? textOverride.trim()
    : inputText.value.trim()
  if (!text || isStreaming.value) return

  messages.value.push({ id: Date.now(), role: 'user', content: text, streaming: false })
  inputText.value = ''
  scrollToBottom()

  isStreaming.value = true
  const reply = generateReply(text)
  const assistantMsg = {
    id: Date.now() + 1,
    role: 'assistant',
    content: '',
    streaming: true,
    renderedContent: '',
    feedback: null,
    feedbackComment: '',
    feedbackSubmitted: false,
  }
  messages.value.push(assistantMsg)
  scrollToBottom()

  const streamDelay = reply.length > 500 ? 70 : 35
  let i = 0
  replyTimer = setInterval(() => {
    if (i < reply.length) {
      assistantMsg.content += reply[i]
      i++
      scrollToBottom()
    } else {
      assistantMsg.streaming = false
      isStreaming.value = false
      clearReplyTimer()
      finalizeAssistantMessage(assistantMsg)
    }
  }, streamDelay)
}

function clearReplyTimer() {
  if (replyTimer) {
    clearInterval(replyTimer)
    replyTimer = null
  }
}

async function finalizeAssistantMessage(message) {
  try {
    message.renderedContent = renderAssistantContent(message.content)
  } catch (error) {
    console.warn('Assistant content rendering failed. Falling back to plain text.', error)
    message.renderedContent = ''
  } finally {
    scrollToBottom()
    focusInput()
  }
}

function focusInput() {
  nextTick(() => {
    inputEl.value?.focus()
  })
}

function setFeedback(message, value) {
  message.feedback = value
  message.feedbackSubmitted = value === 'good'

  if (value === 'good') {
    message.feedbackComment = ''
  }
}

function submitFeedback(message) {
  message.feedbackSubmitted = true
}

onMounted(() => {
  if (props.initialPrompt.trim()) {
    nextTick(() => {
      sendMessage(props.initialPrompt)
    })
  }
})

onBeforeUnmount(() => {
  clearReplyTimer()
})

function generateReply(userText) {
  const textReply = '좋아요. TC Assistant는 반복되는 운영 질문, 로그 다운로드 조건 정리, 설비 TC 현황 확인 같은 업무를 빠르게 처리할 수 있도록 도와줍니다. 필요한 결과 형식을 알려주시면 그 형식에 맞춰 정리해드릴게요.'

  const tableReply = `아래처럼 표로 정리할 수 있습니다.

| 항목 | 담당 | 상태 |
| --- | --- | --- |
| 로그 다운로드 조건 | JG | 완료 |
| CEID 매핑 테이블 | TC-01 | 진행중 |
| 권한별 UI 접근 | TC PI | 검토중 |

필요하면 CSV 다운로드가 가능한 표 형태로도 보여드릴 수 있습니다.`

  const codeReply = `예시 코드는 아래와 같습니다.

\`\`\`python
def find_risk_tasks(tasks):
    risk_tasks = []

    for task in tasks:
        if "risk" in task:
            risk_tasks.append(task)

    return risk_tasks

tasks = ["log download", "ceid mapping", "risk review"]
print(find_risk_tasks(tasks))
\`\`\`

이 구조를 실제 업무 데이터에 맞춰 확장할 수 있습니다.`

  const longStreamingReply = `스트리밍 테스트용 긴 응답입니다.

요청하신 내용이 들어오면 TC Assistant는 먼저 질문의 목적을 분류합니다. 예를 들어 사용자가 설비 로그를 내려받고 싶은지, TC 파라미터를 확인하고 싶은지, CEID와 RPTID 매핑을 비교하고 싶은지, 또는 운영 이력과 개발 계획을 확인하고 싶은지를 구분합니다. 이 단계는 실제 운영에서는 API 서버에서 권한과 요청 유형을 함께 확인하는 방식으로 확장할 수 있습니다.

첫 번째 단계는 사용자 권한 확인입니다. SSO로 접속한 사용자는 기본적으로 User 권한을 받고, 특정 계정에 Power User, TC PI, Administrator 권한이 추가되어 있으면 해당 권한에 맞는 메뉴와 기능이 열립니다. 이렇게 하면 일반 조회 사용자는 필요한 화면만 보고, 운영 담당자는 로그 다운로드와 대시보드 기능을 사용할 수 있으며, 개발 또는 설정 담당자는 적용 계획과 설정성 기능까지 접근할 수 있습니다.

두 번째 단계는 입력 조건 검증입니다. 로그 다운로드 요청이라면 LINEID, EQPID, 날짜, 로그 유형, TBL 로그 병합 여부, 메일주소 같은 필드를 확인합니다. 날짜는 현재 정책상 오늘부터 한 달 전까지만 선택 가능하게 제한할 수 있고, LINEID와 EQPID는 검색 가능한 드롭다운으로 제공하면 사용자가 잘못된 값을 입력할 가능성을 줄일 수 있습니다.

세 번째 단계는 서버 요청 구성입니다. 프론트엔드는 사용자가 선택한 조건을 JSON 형태로 FastAPI 서버에 전달하고, 서버는 해당 조건을 기반으로 로그 파일 목록이나 다운로드 작업을 생성합니다. 이때 응답은 단순 완료 메시지뿐 아니라 요청 ID, 예상 처리 시간, 파일 크기, 전송 대상 메일주소, 실패 시 재시도 방법 같은 운영 정보를 포함하면 좋습니다.

네 번째 단계는 결과 표시입니다. 대시보드 테이블은 나중에 API 응답 필드명에 맞춰 매핑하면 됩니다. 지금처럼 컬럼 정의와 데이터 배열을 분리해두면, 서버에서 내려주는 필드명이 확정되었을 때 tableColumns와 필터 key만 맞춰도 화면 구조를 크게 바꾸지 않고 연결할 수 있습니다.

마지막 단계는 감사와 이력 관리입니다. 운영에서는 누가 어떤 권한으로 어떤 로그를 요청했는지, 어떤 조건으로 다운로드했는지, 요청이 성공했는지 실패했는지를 남기는 것이 중요합니다. 특히 내부 로그나 민감 데이터가 포함될 수 있는 기능은 권한과 감사 이력을 함께 설계하는 것이 안전합니다.

이 응답은 일부러 길게 작성되어 있습니다. 화면에서 글자가 한 글자씩 추가되는지, 스크롤이 하단으로 잘 따라가는지, 스트리밍 중 입력창과 전송 버튼이 비활성화되는지 확인하기 위한 테스트 문장입니다. 필요하면 더 긴 응답, 표가 포함된 긴 응답, 코드블록이 포함된 긴 응답도 별도로 추가할 수 있습니다.`

  const normalizedText = userText.toLowerCase()

  if (userText.includes('표') || normalizedText.includes('table')) {
    return tableReply
  }

  if (userText.includes('코드') || normalizedText.includes('code')) {
    return codeReply
  }

  if (
    userText.includes('스트리밍')
    || userText.includes('긴 응답')
    || userText.includes('긴응답')
    || userText.includes('길게')
    || userText.includes('테스트')
    || normalizedText.includes('long')
    || normalizedText.includes('stream')
  ) {
    return longStreamingReply
  }

  const replies = [textReply, tableReply, codeReply, longStreamingReply]
  const reply = replies[demoReplyIndex % replies.length]
  demoReplyIndex += 1

  return reply
}
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function createCsvContent(rows) {
  return rows
    .map((row) => row
      .map((cell) => {
        const value = String(cell).replace(/\r?\n/g, ' ')
        const escapedValue = value.replace(/"/g, '""')

        return /[",\n]/.test(value) ? `"${escapedValue}"` : escapedValue
      })
      .join(','))
    .join('\n')
}

function renderTable(lines) {
  const rows = lines
    .filter((line, index) => index !== 1)
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))

  const escapedRows = rows.map((row) => row.map((cell) => escapeHtml(cell)))
  const [header, ...body] = escapedRows
  const csvContent = createCsvContent(rows)

  return `
    <div class="chat-table-wrap">
      <div class="chat-table-toolbar">
        <span>표 데이터</span>
        <button type="button" class="chat-csv-button" data-csv="${encodeURIComponent(csvContent)}">
          CSV 다운로드
        </button>
      </div>
      <div class="chat-table-scroll">
        <table class="chat-table">
          <thead>
            <tr>${header.map((cell) => `<th>${cell}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

function renderAssistantContent(content) {
  const codeBlocks = []
  const codeBlockPattern = /```(\w+)?[ \t]*\n?([\s\S]*?)```/g

  const contentWithPlaceholders = content.replace(codeBlockPattern, (_, language = 'text', code) => {
    const index = codeBlocks.length
    codeBlocks.push(renderCodeBlock(language, code))
    return `@@CODE_BLOCK_${index}@@`
  })

  return renderAssistantSegments(contentWithPlaceholders, codeBlocks)
}

function renderCodeBlock(language, code) {
  const normalizedLanguage = language?.toLowerCase() || 'text'
  const trimmedCode = code.trim()

  return `
    <div class="chat-code-block">
      <div class="chat-code-header">
        <span>${escapeHtml(normalizedLanguage)}</span>
        <button type="button" class="chat-copy-button" data-copy-code="${encodeURIComponent(trimmedCode)}">
          Copy
        </button>
      </div>
      <div class="chat-code-body">
        <pre><code>${escapeHtml(trimmedCode)}</code></pre>
      </div>
    </div>
  `
}

function renderAssistantSegments(contentWithPlaceholders, codeBlocks) {
  const lines = contentWithPlaceholders.split('\n')
  const rendered = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const nextLine = lines[index + 1]
    const isTableStart = line.trim().startsWith('|') && nextLine?.includes('---')

    if (isTableStart) {
      const tableLines = [line, nextLine]
      index += 2

      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index])
        index += 1
      }

      index -= 1
      rendered.push(renderTable(tableLines))
      continue
    }

    if (line.startsWith('@@CODE_BLOCK_')) {
      const codeIndex = Number(line.match(/@@CODE_BLOCK_(\d+)@@/)?.[1])
      rendered.push(codeBlocks[codeIndex] || '')
      continue
    }

    if (line.trim()) {
      rendered.push(`<p>${escapeHtml(line)}</p>`)
    }
  }

  return rendered.join('')
}

async function handleAssistantContentClick(event) {
  const csvButton = event.target.closest('.chat-csv-button')
  if (csvButton) {
    const csvContent = decodeURIComponent(csvButton.dataset.csv || '')
    if (!csvContent) return

    downloadCsv(csvContent)
    csvButton.textContent = '다운로드 완료'

    setTimeout(() => {
      csvButton.textContent = 'CSV 다운로드'
    }, 1200)
    return
  }

  const button = event.target.closest('.chat-copy-button')
  if (!button) return

  const code = decodeURIComponent(button.dataset.copyCode || '')
  if (!code) return

  await navigator.clipboard.writeText(code)
  button.textContent = 'Copied'

  setTimeout(() => {
    button.textContent = 'Copy'
  }, 1200)
}

function downloadCsv(csvContent) {
  const today = new Date().toISOString().slice(0, 10)
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `tc-assistant-table-${today}.csv`
  link.click()

  URL.revokeObjectURL(url)
}
</script>

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.bot-avatar-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}

.bot-avatar-wrap--loading::before {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 9999px;
  background:
    conic-gradient(from 0deg, rgba(14, 165, 233, 0), rgba(14, 165, 233, 0.95), rgba(192, 38, 211, 0.9), rgba(14, 165, 233, 0));
  animation: bot-avatar-spin 0.9s linear infinite;
  filter: drop-shadow(0 0 10px rgba(14, 165, 233, 0.35));
}

.bot-avatar-wrap--loading::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 9999px;
  background: #0A0A0F;
}

@keyframes bot-avatar-spin {
  to {
    transform: rotate(360deg);
  }
}

:deep(.assistant-content) {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

:deep(.assistant-content p) {
  margin: 0;
}

:deep(.chat-code-block) {
  overflow: hidden;
  border: 1px solid rgba(107, 114, 128, 0.5);
  border-radius: 8px;
  background: #0D0D14;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}

:deep(.chat-code-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(31, 41, 55, 0.5);
  padding: 0.55rem 0.75rem;
  color: #8B94A5;
  font-size: 0.7rem;
  font-weight: 600;
}

:deep(.chat-copy-button) {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  color: #AEB6C6;
  cursor: pointer;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.22rem 0.5rem;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}

:deep(.chat-copy-button:hover) {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(14, 165, 233, 0.1);
  color: #FFFFFF;
}

:deep(.chat-code-body pre) {
  margin: 0;
  overflow-x: auto;
  padding: 1.25rem;
  background-color: #1a1b26 !important;
}

:deep(.chat-code-body code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;
  line-height: 1.6;
  white-space: pre;
}

:deep(.chat-code-body .line) {
  min-height: 1.6em;
}

:deep(.chat-table-wrap) {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

:deep(.chat-table-toolbar) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.55rem 0.75rem;
  color: #8B94A5;
  font-size: 0.7rem;
  font-weight: 700;
}

:deep(.chat-csv-button) {
  flex-shrink: 0;
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 6px;
  background: rgba(18, 59, 82, 0.72);
  color: #D8F3FF;
  cursor: pointer;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}

:deep(.chat-csv-button:hover) {
  border-color: rgba(56, 189, 248, 0.4);
  background: #164A64;
  color: #FFFFFF;
}

:deep(.chat-table-scroll) {
  overflow-x: auto;
}

:deep(.chat-table) {
  width: 100%;
  min-width: 420px;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.78rem;
}

:deep(.chat-table th) {
  background: rgba(255, 255, 255, 0.06);
  color: #E5E7EB;
  font-weight: 700;
  text-align: left;
}

:deep(.chat-table th),
:deep(.chat-table td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.65rem 0.75rem;
}

:deep(.chat-table td) {
  color: #B8C0CF;
}

:deep(.chat-table tr:last-child td) {
  border-bottom: 0;
}
</style>

