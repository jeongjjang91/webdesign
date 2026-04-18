<template>
  <aside class="fixed left-0 top-0 h-screen w-[220px] bg-[#0D0D14] border-r border-white/[0.06] flex flex-col z-50">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-white/[0.06]">
      <div class="flex items-center gap-2.5">
        <GatewayFlowIcon size="sm" label="TC Assistant" class="flex-shrink-0" />
        <span class="font-semibold text-[13px] tracking-tight text-white">TC Assistant</span>
        <span class="text-xs text-muted bg-white/5 border border-white/[0.08] rounded-full px-2 py-0.5">Beta</span>
      </div>
    </div>

    <!-- New Chat Button -->
    <div class="px-3 pt-4 pb-2">
      <button
        @click="emit('navigate', 'chat')"
        class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-sky-300/10 bg-[#123B52] text-white text-sm font-semibold shadow-[0_12px_30px_rgba(18,59,82,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 [text-shadow:0_1px_1px_rgba(0,0,0,0.18)] hover:bg-[#164A64] hover:shadow-[0_14px_34px_rgba(18,59,82,0.32),inset_0_1px_0_rgba(255,255,255,0.16)]"
      >
        <Icon icon="lucide:plus" class="w-4 h-4 flex-shrink-0" />
        새로운 채팅
      </button>
    </div>

    <!-- Recent Chats -->
    <section class="px-3 pb-3">
      <div class="flex items-center justify-between px-1.5 pb-2">
        <p class="text-[11px] font-semibold uppercase text-[#6B7280]">최근 대화</p>
        <button
          type="button"
          class="text-[11px] font-medium text-[#8B94A5] hover:text-white transition-colors"
        >
          전체
        </button>
      </div>

      <div v-if="chatHistories.length" class="max-h-[280px] space-y-1 overflow-y-auto pr-0.5">
        <div
          v-for="chat in chatHistories"
          :key="chat.id"
          class="group overflow-hidden rounded-lg transition-colors"
          :class="expandedChatId === chat.id ? 'bg-white/[0.05]' : 'hover:bg-white/[0.04]'"
        >
          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="toggleChat(chat.id)"
              class="min-w-0 flex-1 px-2.5 py-2 text-left"
              :aria-expanded="expandedChatId === chat.id"
            >
              <span class="block truncate text-[13px] font-medium text-[#E5E7EB]">
                {{ chat.title }}
              </span>
              <span class="mt-0.5 block truncate text-[11px] text-[#7D8594]">
                {{ chat.updatedAt }} · {{ chat.messageCount }}개 메시지
              </span>
            </button>
            <button
              type="button"
              @click="toggleChat(chat.id)"
              class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-white/[0.06] hover:text-white"
              :aria-label="expandedChatId === chat.id ? '대화 접기' : '대화 펼치기'"
              :aria-expanded="expandedChatId === chat.id"
            >
              <Icon
                icon="lucide:chevron-down"
                class="h-4 w-4 transition-transform duration-200"
                :class="expandedChatId === chat.id ? 'rotate-180' : ''"
              />
            </button>
            <button
              type="button"
              @click.stop="deleteChat(chat.id)"
              class="mr-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#6B7280] opacity-0 transition-all hover:bg-white/[0.06] hover:text-white group-hover:opacity-100"
              :aria-label="`${chat.title} 삭제`"
              title="대화 삭제"
            >
              <Icon icon="lucide:trash-2" class="h-4 w-4" />
            </button>
          </div>

          <div
            v-if="expandedChatId === chat.id"
            class="border-t border-white/[0.06] px-2.5 pb-2 pt-2"
          >
            <div class="space-y-1.5">
              <p
                v-for="message in chat.preview"
                :key="message.id"
                class="line-clamp-2 rounded-md px-2 py-1.5 text-[11px] leading-4"
                :class="message.role === 'user'
                  ? 'bg-accent/10 text-[#CDEFFF]'
                  : 'bg-white/[0.04] text-[#AEB6C6]'"
              >
                {{ message.content }}
              </p>
            </div>
            <button
              type="button"
              @click="emit('navigate', 'chat')"
              class="mt-2 w-full rounded-md border border-white/[0.08] px-2 py-1.5 text-[11px] font-medium text-[#B8C0CF] transition-colors hover:border-accent/40 hover:text-white"
            >
              대화 열기
            </button>
          </div>
        </div>
      </div>
      <div v-else class="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-5 text-center">
        <p class="text-[12px] font-medium text-[#8B94A5]">최근 대화가 없습니다</p>
        <p class="mt-1 text-[11px] text-[#6B7280]">새로운 채팅을 시작해보세요.</p>
      </div>
    </section>

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

    <!-- User Info -->
    <div class="border-t border-white/[0.06] p-3">
      <div class="flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-3 py-2.5">
        <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15 text-[12px] font-bold text-accent">
          JG
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-[13px] font-semibold text-white">정근</p>
          <p class="truncate text-[11px] text-[#7D8594]">jungeun@tc.co.kr</p>
        </div>
        <button
          type="button"
          @click="openSettings"
          class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-white/[0.06] hover:text-white"
          aria-label="계정 설정"
          :aria-expanded="isSettingsOpen"
        >
          <Icon icon="lucide:settings" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="settings-modal">
        <div
          v-if="isSettingsOpen"
          class="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          @click.self="closeSettings"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
            class="w-full max-w-3xl overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D0D14] text-white shadow-2xl shadow-black/40"
          >
            <header class="flex items-start justify-between gap-4 border-b border-white/[0.08] px-6 py-5">
              <div>
                <p class="text-[12px] font-semibold uppercase tracking-widest text-accent/80">설정</p>
                <h2 id="settings-modal-title" class="mt-1 text-xl font-bold tracking-tight">계정 및 권한 관리</h2>
                <p class="mt-2 text-sm leading-relaxed text-[#9CA3B0]">
                  권한, 접근 범위, 알림처럼 운영에 필요한 항목을 이곳에서 관리합니다.
                </p>
              </div>
              <button
                type="button"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B94A5] transition-colors hover:bg-white/[0.05] hover:text-white"
                aria-label="설정 닫기"
                @click="closeSettings"
              >
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </header>

            <div class="grid max-h-[72vh] overflow-y-auto lg:grid-cols-[180px_minmax(0,1fr)]">
              <aside class="border-b border-white/[0.08] bg-white/[0.025] p-3 lg:border-b-0 lg:border-r">
                <nav class="space-y-1">
                  <button
                    v-for="tab in settingsTabs"
                    :key="tab.id"
                    type="button"
                    class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors"
                    :class="activeSettingsTab === tab.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-[#9CA3B0] hover:bg-white/[0.04] hover:text-white'"
                    @click="activeSettingsTab = tab.id"
                  >
                    <Icon :icon="tab.icon" class="h-4 w-4 flex-shrink-0" />
                    {{ tab.label }}
                  </button>
                </nav>
              </aside>

              <div class="min-w-0 p-6">
                <div v-if="activeSettingsTab === 'profile'" class="space-y-5">
                  <div class="flex items-center gap-4">
                    <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15 text-lg font-bold text-accent">
                      JG
                    </div>
                    <div class="min-w-0">
                      <h3 class="truncate text-lg font-bold text-white">정근</h3>
                      <p class="truncate text-sm text-[#8B94A5]">jungeun@tc.co.kr</p>
                      <p class="mt-1 text-[12px] text-emerald-400">활성 계정</p>
                    </div>
                  </div>

                  <div class="grid gap-3 md:grid-cols-2">
                    <div
                      v-for="item in accountInfo"
                      :key="item.label"
                      class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4"
                    >
                      <p class="text-[12px] font-semibold text-[#7D8594]">{{ item.label }}</p>
                      <p class="mt-2 text-sm font-semibold text-white">{{ item.value }}</p>
                    </div>
                  </div>
                </div>

                <div v-else-if="activeSettingsTab === 'permissions'" class="space-y-4">
                  <div>
                    <h3 class="text-lg font-bold text-white">권한 설정</h3>
                    <p class="mt-1 text-sm text-[#9CA3B0]">사용자가 접근할 수 있는 데이터와 실행 가능한 작업을 정합니다.</p>
                  </div>

                  <div class="space-y-3">
                    <label
                      v-for="permission in permissionSettings"
                      :key="permission.id"
                      class="flex items-start justify-between gap-4 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4"
                    >
                      <span class="min-w-0">
                        <span class="block text-sm font-semibold text-white">{{ permission.label }}</span>
                        <span class="mt-1 block text-[13px] leading-relaxed text-[#8B94A5]">{{ permission.description }}</span>
                      </span>
                      <input v-model="permission.enabled" type="checkbox" class="sr-only" />
                      <span
                        class="mt-0.5 flex h-6 w-11 flex-shrink-0 items-center rounded-full border p-0.5 transition-colors"
                        :class="permission.enabled ? 'border-accent/40 bg-accent/80' : 'border-white/[0.1] bg-white/[0.08]'"
                        aria-hidden="true"
                      >
                        <span
                          class="h-[18px] w-[18px] rounded-full bg-white shadow transition-transform"
                          :class="permission.enabled ? 'translate-x-5' : 'translate-x-0'"
                        ></span>
                      </span>
                    </label>
                  </div>
                </div>

                <div v-else-if="activeSettingsTab === 'features'" class="space-y-4">
                  <div>
                    <h3 class="text-lg font-bold text-white">기능 옵션</h3>
                    <p class="mt-1 text-sm text-[#9CA3B0]">TC AI Bot에서 사용할 업무 기능을 켜고 끕니다.</p>
                  </div>

                  <div class="grid gap-3 md:grid-cols-2">
                    <label
                      v-for="feature in featureSettings"
                      :key="feature.id"
                      class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4"
                    >
                      <span class="flex items-start justify-between gap-3">
                        <span>
                          <span class="block text-sm font-semibold text-white">{{ feature.label }}</span>
                          <span class="mt-1 block text-[13px] leading-relaxed text-[#8B94A5]">{{ feature.description }}</span>
                        </span>
                        <input v-model="feature.enabled" type="checkbox" class="sr-only" />
                        <span
                          class="mt-0.5 flex h-6 w-11 flex-shrink-0 items-center rounded-full border p-0.5 transition-colors"
                          :class="feature.enabled ? 'border-accent/40 bg-accent/80' : 'border-white/[0.1] bg-white/[0.08]'"
                          aria-hidden="true"
                        >
                          <span
                            class="h-[18px] w-[18px] rounded-full bg-white shadow transition-transform"
                            :class="feature.enabled ? 'translate-x-5' : 'translate-x-0'"
                          ></span>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div v-else class="space-y-4">
                  <div>
                    <h3 class="text-lg font-bold text-white">알림 및 기타</h3>
                    <p class="mt-1 text-sm text-[#9CA3B0]">대시보드 알림과 보존 정책을 조정합니다.</p>
                  </div>

                  <div class="space-y-3">
                    <label
                      v-for="option in miscSettings"
                      :key="option.id"
                      class="flex items-start justify-between gap-4 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4"
                    >
                      <span>
                        <span class="block text-sm font-semibold text-white">{{ option.label }}</span>
                        <span class="mt-1 block text-[13px] leading-relaxed text-[#8B94A5]">{{ option.description }}</span>
                      </span>
                      <input v-model="option.enabled" type="checkbox" class="sr-only" />
                      <span
                        class="mt-0.5 flex h-6 w-11 flex-shrink-0 items-center rounded-full border p-0.5 transition-colors"
                        :class="option.enabled ? 'border-accent/40 bg-accent/80' : 'border-white/[0.1] bg-white/[0.08]'"
                        aria-hidden="true"
                      >
                        <span
                          class="h-[18px] w-[18px] rounded-full bg-white shadow transition-transform"
                          :class="option.enabled ? 'translate-x-5' : 'translate-x-0'"
                        ></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <footer class="flex flex-col gap-3 border-t border-white/[0.08] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-[12px] text-[#7D8594]">변경 사항은 현재 화면에서만 유지됩니다. API 연결 후 저장 기능을 붙이면 됩니다.</p>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-[#B8C0CF] transition-colors hover:bg-white/[0.04] hover:text-white"
                  @click="closeSettings"
                >
                  취소
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
                  @click="closeSettings"
                >
                  저장
                </button>
              </div>
            </footer>
          </section>
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import GatewayFlowIcon from './GatewayFlowIcon.vue'

defineProps({
  currentPage: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['navigate'])

const expandedChatId = ref(null)
const isSettingsOpen = ref(false)
const activeSettingsTab = ref('profile')

const openSettings = () => {
  isSettingsOpen.value = true
}

const closeSettings = () => {
  isSettingsOpen.value = false
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeSettings()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const settingsTabs = [
  { id: 'profile', label: '계정', icon: 'lucide:user-round' },
  { id: 'permissions', label: '권한', icon: 'lucide:shield-check' },
  { id: 'features', label: '기능', icon: 'lucide:sliders-horizontal' },
  { id: 'misc', label: '기타', icon: 'lucide:bell' },
]

const accountInfo = [
  { label: '역할', value: 'TC 운영 관리자' },
  { label: '소속', value: 'TC Platform' },
  { label: '로그인 방식', value: '사내 SSO' },
  { label: '최근 접속', value: '오늘 12:18' },
]

const permissionSettings = ref([
  {
    id: 'admin',
    label: '관리자 권한',
    description: '사용자 권한, 시스템 옵션, 운영 정책을 변경할 수 있습니다.',
    enabled: true,
  },
  {
    id: 'dashboard',
    label: '대시보드 접근',
    description: '요청 현황, 처리 지표, CSV 다운로드 기능을 사용할 수 있습니다.',
    enabled: true,
  },
  {
    id: 'sensitive-data',
    label: '민감 데이터 조회',
    description: '검토가 필요한 고객 정보와 내부 로그 상세 내용을 확인합니다.',
    enabled: false,
  },
])

const featureSettings = ref([
  {
    id: 'text-to-sql',
    label: 'DB 조회 자동화',
    description: '자연어 질문을 SQL 조회 흐름으로 연결합니다.',
    enabled: true,
  },
  {
    id: 'rag',
    label: '문서 검색 RAG',
    description: 'Confluence와 사내 문서를 기반으로 답변합니다.',
    enabled: true,
  },
  {
    id: 'splunk',
    label: 'Splunk 로그 분석',
    description: '로그 패턴 분석 초안을 생성하고 검토 큐로 보냅니다.',
    enabled: false,
  },
  {
    id: 'wiki',
    label: 'LLM Wiki 축적',
    description: '검토 완료 답변을 지식화하고 유사 질문에 재사용합니다.',
    enabled: false,
  },
])

const miscSettings = ref([
  {
    id: 'weekly-report',
    label: '주간 요약 알림',
    description: '처리 현황과 주요 병목을 매주 요약합니다.',
    enabled: true,
  },
  {
    id: 'quality-alert',
    label: '품질 저하 알림',
    description: '정확도나 피드백 지표가 기준 아래로 내려가면 알립니다.',
    enabled: true,
  },
  {
    id: 'retain-history',
    label: '대화 기록 보존',
    description: '업무 감사와 재활용을 위해 대화 기록을 보존합니다.',
    enabled: false,
  },
])

const chatHistories = ref([
  {
    id: 'chat-1',
    title: '채용 공고 초안 정리',
    updatedAt: '오늘',
    messageCount: 4,
    preview: [
      {
        id: 'chat-1-message-1',
        role: 'user',
        content: '신입 프론트엔드 개발자 채용 공고를 더 자연스럽게 다듬어줘.',
      },
      {
        id: 'chat-1-message-2',
        role: 'assistant',
        content: '지원 자격과 주요 업무를 분리하고, 팀 문화가 드러나도록 문장을 정리했어요.',
      },
    ],
  },
  {
    id: 'chat-2',
    title: '보안 정책 요약',
    updatedAt: '어제',
    messageCount: 12,
    preview: [
      {
        id: 'chat-2-message-1',
        role: 'user',
        content: '사내 보안 정책 문서를 임직원 안내용으로 요약해줘.',
      },
      {
        id: 'chat-2-message-2',
        role: 'assistant',
        content: '계정 관리, 자료 반출, 외부 협업 기준을 중심으로 핵심만 정리했어요.',
      },
    ],
  },
  {
    id: 'chat-3',
    title: '영업 제안서 문구 수정',
    updatedAt: '4월 14일',
    messageCount: 8,
    preview: [
      {
        id: 'chat-3-message-1',
        role: 'user',
        content: '제안서 첫 문단이 너무 딱딱한데 신뢰감 있게 바꿔줘.',
      },
      {
        id: 'chat-3-message-2',
        role: 'assistant',
        content: '도입 효과를 먼저 보여주고, 뒤에서 제품 강점을 연결하는 흐름으로 바꿨어요.',
      },
    ],
  },
  {
    id: 'chat-4',
    title: '월간 실적 보고서 요약',
    updatedAt: '4월 13일',
    messageCount: 6,
    preview: [
      {
        id: 'chat-4-message-1',
        role: 'user',
        content: '월간 실적 보고서를 핵심 수치와 이슈 중심으로 요약해줘.',
      },
      {
        id: 'chat-4-message-2',
        role: 'assistant',
        content: '매출 변화, 주요 리스크, 다음 액션 아이템 순서로 정리했어요.',
      },
    ],
  },
  {
    id: 'chat-5',
    title: '고객 문의 답변 작성',
    updatedAt: '4월 12일',
    messageCount: 9,
    preview: [
      {
        id: 'chat-5-message-1',
        role: 'user',
        content: '환불 문의에 대한 답변을 정중한 톤으로 작성해줘.',
      },
      {
        id: 'chat-5-message-2',
        role: 'assistant',
        content: '고객 불편에 공감한 뒤 정책과 다음 절차를 안내하는 문구로 작성했어요.',
      },
    ],
  },
  {
    id: 'chat-6',
    title: 'API 변경점 정리',
    updatedAt: '4월 11일',
    messageCount: 5,
    preview: [
      {
        id: 'chat-6-message-1',
        role: 'user',
        content: '이번 API 변경사항을 개발팀 공유용으로 정리해줘.',
      },
      {
        id: 'chat-6-message-2',
        role: 'assistant',
        content: '신규 필드, 제거 예정 필드, 호환성 영향 순서로 요약했어요.',
      },
    ],
  },
  {
    id: 'chat-7',
    title: '면접 질문 리스트',
    updatedAt: '4월 10일',
    messageCount: 7,
    preview: [
      {
        id: 'chat-7-message-1',
        role: 'user',
        content: '프론트엔드 개발자 면접 질문을 역량별로 만들어줘.',
      },
      {
        id: 'chat-7-message-2',
        role: 'assistant',
        content: '기술 역량, 협업 경험, 문제 해결 방식으로 나눠 질문을 구성했어요.',
      },
    ],
  },
  {
    id: 'chat-8',
    title: '계약서 조항 검토',
    updatedAt: '4월 9일',
    messageCount: 11,
    preview: [
      {
        id: 'chat-8-message-1',
        role: 'user',
        content: '계약서에서 리스크가 될 만한 조항을 찾아줘.',
      },
      {
        id: 'chat-8-message-2',
        role: 'assistant',
        content: '책임 범위, 위약 조건, 개인정보 처리 조항을 우선 검토 대상으로 표시했어요.',
      },
    ],
  },
  {
    id: 'chat-9',
    title: '프로젝트 리스크 분석',
    updatedAt: '4월 8일',
    messageCount: 8,
    preview: [
      {
        id: 'chat-9-message-1',
        role: 'user',
        content: '현재 프로젝트의 주요 리스크와 대응 방안을 정리해줘.',
      },
      {
        id: 'chat-9-message-2',
        role: 'assistant',
        content: '일정, 인력, 의존성, 품질 리스크로 나누어 대응안을 작성했어요.',
      },
    ],
  },
  {
    id: 'chat-10',
    title: '온보딩 체크리스트',
    updatedAt: '4월 7일',
    messageCount: 4,
    preview: [
      {
        id: 'chat-10-message-1',
        role: 'user',
        content: '신규 입사자 온보딩 체크리스트를 만들어줘.',
      },
      {
        id: 'chat-10-message-2',
        role: 'assistant',
        content: '첫날 준비, 계정 발급, 팀 소개, 1주차 목표 순서로 정리했어요.',
      },
    ],
  },
])

const toggleChat = (chatId) => {
  expandedChatId.value = expandedChatId.value === chatId ? null : chatId
}

const deleteChat = (chatId) => {
  chatHistories.value = chatHistories.value.filter((chat) => chat.id !== chatId)

  if (expandedChatId.value === chatId) {
    expandedChatId.value = null
  }
}

const navItems = [
  { page: 'home',         label: '홈',       icon: 'lucide:home' },
  { page: 'dashboard',    label: '대시보드', icon: 'lucide:layout-dashboard' },
  { page: 'features',     label: '기능',     icon: 'lucide:zap' },
  { page: 'how',          label: '적용 계획', icon: 'lucide:repeat-2' },
  { page: 'usecases',     label: '활용 사례', icon: 'lucide:briefcase' },
  { page: 'testimonials', label: '후기',     icon: 'lucide:star' },
  { page: 'security',     label: '보안',     icon: 'lucide:shield' },
  { page: 'cta',          label: '시작하기',  icon: 'lucide:rocket' },
]
</script>

<style scoped>
.settings-modal-enter-active,
.settings-modal-leave-active {
  transition: opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-modal-enter-active section,
.settings-modal-leave-active section {
  transition:
    opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-modal-enter-from,
.settings-modal-leave-to {
  opacity: 0;
}

.settings-modal-enter-from section,
.settings-modal-leave-to section {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
