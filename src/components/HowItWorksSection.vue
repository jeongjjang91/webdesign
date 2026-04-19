<template>
  <section id="how" class="relative overflow-hidden bg-[#020617] py-28">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-accent/6 blur-[120px]"></div>
    </div>

    <div class="relative z-10 mx-auto max-w-7xl px-6">
      <div class="reveal mx-auto mb-16 max-w-3xl text-center">
        <div class="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent/80">
          <span class="h-px w-4 bg-accent/60"></span>
          적용 계획
          <span class="h-px w-4 bg-accent/60"></span>
        </div>
        <h2 class="mb-5 text-4xl font-bold tracking-tight">
          TC AI Bot <span class="text-gradient">개발 계획</span>
        </h2>
        <p class="mx-auto max-w-2xl text-[14px] leading-relaxed text-[#B8C0CF]">
          화면 경험과 서버 자동화 흐름을 분리해 UI 개발 계획과 서버 개발 계획을 병렬로 관리합니다.
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-2">
        <section
          v-for="track in planTracks"
          :key="track.id"
          class="reveal visible rounded-lg border border-white/[0.08] bg-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <div class="mb-8 flex items-start justify-between gap-4">
            <div>
              <p class="text-[12px] font-semibold uppercase tracking-widest" :class="track.textClass">{{ track.caption }}</p>
              <h3 class="mt-2 text-2xl font-bold text-white">{{ track.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#8B94A5]">{{ track.description }}</p>
            </div>
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <span class="text-sm font-bold">{{ trackSteps(track.id).length }}</span>
            </div>
          </div>

          <div class="timeline-list space-y-7">
            <article
              v-for="(step, i) in trackSteps(track.id)"
              :key="step.id"
              class="relative grid grid-cols-[4rem_1fr] gap-4 reveal visible"
              :class="`reveal-delay-${i + 1}`"
            >
              <div class="relative flex justify-center pt-2">
                <div
                  class="timeline-node relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-[#071827]"
                  :class="[step.nodeClass]"
                >
                  <span class="text-base font-bold" :class="step.textClass">{{ String(i + 1).padStart(2, '0') }}</span>
                </div>
              </div>
              <div class="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <TcAiBotIcon size="xs" label="TC AI Bot" class="absolute right-4 top-4 opacity-45" />
                <div class="pr-12">
                  <div class="mb-2 text-xs font-semibold uppercase tracking-widest" :class="step.textClass">{{ step.duration }}</div>
                  <h4 class="mb-3 text-[18px] font-bold leading-snug text-white">{{ step.title }}</h4>
                  <p class="mb-4 text-[14px] leading-relaxed text-slate-400">{{ step.desc }}</p>
                  <ul class="grid gap-2">
                    <li v-for="item in step.items" :key="item" class="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-400">
                      <span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" :class="step.textClass"></span>
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <div class="reveal mt-16 text-center">
        <button type="button" class="app-cta" @click="openPlanEditor">
          <span class="app-cta__glow"></span>
          <span class="app-cta__content">
            적용 계획 관리
            <svg class="app-cta__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="plan-modal">
        <div v-if="isPlanEditorOpen" class="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm" role="presentation" @click.self="closePlanEditor">
          <section role="dialog" aria-modal="true" aria-labelledby="plan-editor-title" class="w-full max-w-5xl overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D0D14] text-white shadow-2xl shadow-black/40">
            <header class="flex items-start justify-between gap-4 border-b border-white/[0.08] px-6 py-5">
              <div>
                <p class="text-[12px] font-semibold uppercase tracking-widest text-accent/80">Roadmap Editor</p>
                <h2 id="plan-editor-title" class="mt-1 text-xl font-bold tracking-tight">적용 계획 단계 관리</h2>
                <p class="mt-2 text-sm leading-relaxed text-[#9CA3B0]">
                  UI 개발 계획과 서버 개발 계획을 트랙별로 추가하거나 수정합니다. 현재 화면 상태는 프론트엔드 상태에 즉시 반영됩니다.
                </p>
              </div>
              <button type="button" class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B94A5] transition-colors hover:bg-white/[0.05] hover:text-white" aria-label="적용 계획 관리 닫기" @click="closePlanEditor">
                x
              </button>
            </header>

            <div class="grid max-h-[74vh] overflow-y-auto lg:grid-cols-[minmax(0,1fr)_420px]">
              <div class="border-b border-white/[0.08] p-5 lg:border-b-0 lg:border-r">
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-base font-bold text-white">현재 단계</h3>
                    <p class="mt-1 text-[13px] text-[#8B94A5]">{{ steps.length }}개 단계가 등록되어 있습니다.</p>
                  </div>
                  <button type="button" class="app-cta app-cta--sm" @click="startNewStep">
                    <span class="app-cta__glow"></span>
                    <span class="app-cta__content">새 단계 작성</span>
                  </button>
                </div>

                <div class="space-y-3">
                  <article v-for="(step, index) in steps" :key="step.id" class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                    <div class="flex items-start justify-between gap-4">
                      <div class="min-w-0">
                        <p class="text-[12px] font-semibold uppercase tracking-widest" :class="step.textClass">{{ trackLabel(step.track) }} · {{ step.duration }}</p>
                        <h4 class="mt-1 truncate text-sm font-bold text-white">{{ step.title }}</h4>
                        <p class="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8B94A5]">{{ step.desc }}</p>
                      </div>
                      <div class="flex flex-shrink-0 items-center gap-2">
                        <button type="button" class="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[12px] font-semibold text-[#B8C0CF] transition-colors hover:border-accent/40 hover:text-white" @click="editStep(index)">수정</button>
                        <button type="button" class="rounded-md border border-rose-400/20 px-2.5 py-1.5 text-[12px] font-semibold text-rose-300 transition-colors hover:bg-rose-400/10" @click="deleteStep(index)">삭제</button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>

              <form class="space-y-4 p-5" @submit.prevent="saveEditingStep">
                <div>
                  <h3 class="text-base font-bold text-white">{{ editingIndex === -1 ? '새 단계 추가' : '단계 수정' }}</h3>
                  <p class="mt-1 text-[13px] text-[#8B94A5]">체크리스트는 줄바꿈으로 여러 개를 입력합니다.</p>
                </div>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">트랙</span>
                  <select v-model="editingStep.track" class="w-full rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50">
                    <option v-for="track in planTracks" :key="track.id" :value="track.id">{{ track.title }}</option>
                  </select>
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">단계 라벨</span>
                  <input v-model="editingStep.duration" type="text" class="w-full rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50" placeholder="단계 1" />
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">제목</span>
                  <input v-model="editingStep.title" type="text" class="w-full rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50" placeholder="기능 개발" />
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">설명</span>
                  <textarea v-model="editingStep.desc" rows="3" class="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition-colors focus:border-accent/50" />
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">체크리스트</span>
                  <textarea v-model="editingStep.itemsText" rows="5" class="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition-colors focus:border-accent/50" placeholder="한 줄에 하나씩 입력" />
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">색상</span>
                  <select v-model="editingStep.textClass" class="w-full rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50">
                    <option v-for="option in stepColorOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                  </select>
                </label>

                <label class="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-[#B8C0CF]">
                  <input v-model="editingStep.isActive" type="checkbox" class="h-4 w-4 accent-sky-500" />
                  현재 진행 중 단계로 표시
                </label>

                <div class="flex items-center justify-end gap-2 border-t border-white/[0.08] pt-4">
                  <button type="button" class="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-[#B8C0CF] transition-colors hover:bg-white/[0.04] hover:text-white" @click="resetEditingForm">초기화</button>
                  <button type="submit" class="app-cta app-cta--sm text-sm">
                    <span class="app-cta__glow"></span>
                    <span class="app-cta__content">{{ editingIndex === -1 ? '추가' : '저장' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useReveal } from '../composables/useReveal'
import TcAiBotIcon from './TcAiBotIcon.vue'

useReveal()

const planTracks = [
  {
    id: 'ui',
    title: 'UI 개발 계획',
    caption: 'Frontend Roadmap',
    description: '사용자가 직접 다루는 화면, 설정, 대시보드, 권한별 UI를 단계적으로 정리합니다.',
    textClass: 'text-accent',
  },
  {
    id: 'server',
    title: '서버 개발 계획',
    caption: 'Backend Roadmap',
    description: 'FastAPI, DB 조회, 문서 RAG, 로그 분석까지 서버 처리 흐름을 단계적으로 확장합니다.',
    textClass: 'text-emerald-400',
  },
]

const defaultSteps = [
  {
    id: 'ui-navigation',
    track: 'ui',
    duration: 'UI 1',
    title: '사이드바와 화면 구조 정리',
    desc: '홈, 대시보드, 로그 다운로드, 개발 이력 화면을 앱형 내비게이션으로 구성합니다.',
    items: ['사이드바 하위 메뉴 구성', '대시보드 내부 메뉴 연결', '주요 버튼 스타일 통일'],
    nodeClass: 'roadmap-node-active',
    textClass: 'text-accent',
  },
  {
    id: 'ui-dashboard',
    track: 'ui',
    duration: 'UI 2',
    title: '설비 TC 대시보드 고도화',
    desc: 'LINEID, EQPID, 모델, CEID 기준으로 조회 가능한 테이블과 필터 UI를 개선합니다.',
    items: ['검색형 드롭다운 필터', '가로 스크롤 sticky 컬럼', 'CEID / RPTID / VID LIST 테이블'],
    nodeClass: '',
    textClass: 'text-blue-400',
  },
  {
    id: 'ui-permission',
    track: 'ui',
    duration: 'UI 3',
    title: '권한별 UI 접근 제어',
    desc: 'SSO 사용자 기본 권한과 계정별 추가 권한에 따라 접근 가능한 메뉴를 분리합니다.',
    items: ['User 기본 권한', 'Power User / TC PI / Administrator 추가 권한', '권한별 사이드바 메뉴 표시'],
    nodeClass: '',
    textClass: 'text-violet-300',
  },
  {
    id: 'server-text-to-sql',
    track: 'server',
    duration: 'Server 1',
    title: 'DB 조회 자동화(Text-to-SQL)',
    desc: '설비 기능 존재 여부와 설비 간 비교 VOC를 DB 자동 조회 흐름으로 처리합니다.',
    items: ['FastAPI 백엔드 연결', 'Schema RAG / Value Retrieval 구성', 'Golden Dataset 기반 정확도 테스트'],
    nodeClass: 'roadmap-node-active',
    textClass: 'text-emerald-400',
  },
  {
    id: 'server-doc-rag',
    track: 'server',
    duration: 'Server 2',
    title: '문서 기반 기능 설명(RAG)',
    desc: 'Confluence와 사내 문서를 검색해 기능 설명 유형의 VOC에 자동 응답합니다.',
    items: ['Hybrid Search', 'Cross-encoder Reranking', 'DB + Doc 복합 질문 처리'],
    nodeClass: '',
    textClass: 'text-blue-400',
  },
  {
    id: 'server-log-analysis',
    track: 'server',
    duration: 'Server 3',
    title: '로그 분석 반자동화',
    desc: '설비 오동작 원인 분석을 로그 패턴 분석 초안과 검색어 생성으로 지원합니다.',
    items: ['SPL 자동 생성', '로그 패턴 라이브러리', '검토자 승인 흐름'],
    nodeClass: '',
    textClass: 'text-amber-300',
  },
]

const steps = ref(defaultSteps.map((step) => ({ ...step, items: [...step.items] })))
const isPlanEditorOpen = ref(false)
const editingIndex = ref(0)
const stepColorOptions = [
  { label: 'Accent Blue', value: 'text-accent' },
  { label: 'Blue', value: 'text-blue-400' },
  { label: 'Emerald', value: 'text-emerald-400' },
  { label: 'Violet', value: 'text-violet-300' },
  { label: 'Amber', value: 'text-amber-300' },
  { label: 'Rose', value: 'text-rose-300' },
]
const editingStep = reactive(createEditingStep(steps.value[0], 0))

function trackSteps(trackId) {
  return steps.value.filter((step) => step.track === trackId)
}

function trackLabel(trackId) {
  return planTracks.find((track) => track.id === trackId)?.title ?? trackId
}

function createEditingStep(step = null, index = steps.value.length) {
  const fallbackColor = stepColorOptions[index % stepColorOptions.length]?.value ?? 'text-accent'
  return {
    id: step?.id ?? `custom-step-${Date.now()}`,
    track: step?.track ?? 'ui',
    duration: step?.duration ?? `단계 ${index + 1}`,
    title: step?.title ?? '',
    desc: step?.desc ?? '',
    itemsText: step?.items?.join('\n') ?? '',
    textClass: step?.textClass ?? fallbackColor,
    isActive: step?.nodeClass === 'roadmap-node-active',
  }
}

function setEditingStep(nextStep) {
  Object.assign(editingStep, nextStep)
}

function openPlanEditor() {
  editStep(0)
  isPlanEditorOpen.value = true
}

function closePlanEditor() {
  isPlanEditorOpen.value = false
}

function editStep(index) {
  editingIndex.value = index
  setEditingStep(createEditingStep(steps.value[index], index))
}

function startNewStep() {
  editingIndex.value = -1
  setEditingStep(createEditingStep(null, steps.value.length))
}

function resetEditingForm() {
  if (editingIndex.value === -1) {
    startNewStep()
    return
  }

  editStep(editingIndex.value)
}

function normalizeStepFromForm() {
  return {
    id: editingStep.id || `custom-step-${Date.now()}`,
    track: editingStep.track,
    duration: editingStep.duration.trim() || `단계 ${editingIndex.value + 1}`,
    title: editingStep.title.trim() || '새 적용 단계',
    desc: editingStep.desc.trim() || '새 단계의 설명을 입력하세요.',
    items: editingStep.itemsText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    nodeClass: editingStep.isActive ? 'roadmap-node-active' : '',
    textClass: editingStep.textClass,
  }
}

function saveEditingStep() {
  const nextStep = normalizeStepFromForm()

  if (editingStep.isActive) {
    steps.value = steps.value.map((step) => ({ ...step, nodeClass: step.track === nextStep.track ? '' : step.nodeClass }))
  }

  if (editingIndex.value === -1) {
    steps.value.push(nextStep)
    editStep(steps.value.length - 1)
    return
  }

  steps.value.splice(editingIndex.value, 1, nextStep)
  editStep(editingIndex.value)
}

function deleteStep(index) {
  steps.value.splice(index, 1)

  if (!steps.value.length) {
    startNewStep()
    return
  }

  editStep(Math.min(index, steps.value.length - 1))
}
</script>

<style scoped>
.timeline-list {
  position: relative;
}

.timeline-list::before {
  content: "";
  position: absolute;
  left: 2rem;
  top: 2rem;
  bottom: 2rem;
  width: 1px;
  background:
    linear-gradient(180deg, rgba(59, 130, 246, 0.48), rgba(56, 189, 248, 0.76), rgba(59, 130, 246, 0.34)),
    repeating-linear-gradient(180deg, rgba(224, 242, 254, 0.62) 0 10px, transparent 10px 18px);
  background-size: 100% 100%, 100% 28px;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.36);
  animation: timeline-flow 12s linear infinite;
}

.timeline-node {
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.16),
    0 0 16px rgba(59, 130, 246, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.roadmap-node-active {
  box-shadow:
    0 0 0 1px rgba(56, 189, 248, 0.28),
    0 0 26px rgba(56, 189, 248, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.roadmap-node-active::after {
  content: "";
  position: absolute;
  inset: -7px;
  border-radius: 20px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  box-shadow: 0 0 22px rgba(56, 189, 248, 0.28);
  animation: roadmap-node-pulse 2.8s ease-in-out infinite;
}

@keyframes timeline-flow {
  from {
    background-position: 0 0, 0 0;
  }

  to {
    background-position: 0 0, 0 56px;
  }
}

@keyframes roadmap-node-pulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.98);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.06);
  }
}

.plan-modal-enter-active,
.plan-modal-leave-active {
  transition: opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.plan-modal-enter-active section,
.plan-modal-leave-active section {
  transition:
    opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.plan-modal-enter-from,
.plan-modal-leave-to {
  opacity: 0;
}

.plan-modal-enter-from section,
.plan-modal-leave-to section {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
