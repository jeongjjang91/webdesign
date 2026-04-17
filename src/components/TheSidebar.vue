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

      <div class="max-h-[280px] space-y-1 overflow-y-auto pr-0.5">
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
              class="mr-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#6B7280] opacity-0 transition-all hover:bg-white/[0.06] hover:text-white group-hover:opacity-100"
              aria-label="대화 옵션"
            >
              <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
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
          TC
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-[13px] font-semibold text-white">김지은</p>
          <p class="truncate text-[11px] text-[#7D8594]">jieun.kim@tc.co.kr</p>
        </div>
        <button
          type="button"
          class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-white/[0.06] hover:text-white"
          aria-label="계정 설정"
        >
          <Icon icon="lucide:settings" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
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

const chatHistories = [
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
]

const toggleChat = (chatId) => {
  expandedChatId.value = expandedChatId.value === chatId ? null : chatId
}

const navItems = [
  { page: 'home',         label: '홈',       icon: 'lucide:home' },
  { page: 'dashboard',    label: '대시보드', icon: 'lucide:layout-dashboard' },
  { page: 'features',     label: '기능',     icon: 'lucide:zap' },
  { page: 'how',          label: '도입 방법', icon: 'lucide:repeat-2' },
  { page: 'usecases',     label: '활용 사례', icon: 'lucide:briefcase' },
  { page: 'testimonials', label: '후기',     icon: 'lucide:star' },
  { page: 'security',     label: '보안',     icon: 'lucide:shield' },
  { page: 'cta',          label: '시작하기',  icon: 'lucide:rocket' },
]
</script>
