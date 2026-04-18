<template>
  <section id="how" class="py-28 relative overflow-hidden bg-[#020617]">
    <!-- Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/6 blur-[120px]"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 reveal">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-accent/80 tracking-widest uppercase mb-4">
          <span class="w-4 h-px bg-accent/60"></span>
          적용 계획
          <span class="w-4 h-px bg-accent/60"></span>
        </div>
        <h2 class="text-4xl font-bold tracking-tight mb-5">
          TC AI Bot <span class="text-gradient">개발 계획</span>
        </h2>
        <p class="mx-auto max-w-1xl text-[14px] leading-relaxed text-[#B8C0CF]">
          사내 TC 시스템 VOC 대응을 자동화하기 위해 DB 조회, 문서 검색, 로그 분석, 지식 축적 순서로 단계적으로 기능을 확장합니다.
        </p>
      </div>

      <!-- Steps -->
      <div class="timeline-list mx-auto max-w-5xl space-y-8">
        <div
          v-for="(step, i) in steps"
          :key="step.id"
          class="relative grid grid-cols-[4.5rem_1fr] gap-5 reveal visible"
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="relative flex justify-center pt-2">
            <div
              class="timeline-node relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-[#071827]"
              :class="[step.nodeClass]"
            >
              <span class="text-xl font-bold" :class="step.textClass">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
          </div>
          <div
            class="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <TcAiBotIcon size="xs" label="TC AI Bot" class="absolute right-4 top-4 opacity-45" />
            <div class="pr-12">
              <div class="text-xs font-semibold uppercase tracking-widest mb-2" :class="step.textClass">
                {{ step.duration }}
              </div>
              <h3 class="text-[19px] font-bold leading-snug mb-3 text-white">{{ step.title }}</h3>
              <p class="text-slate-400 text-[14px] leading-relaxed mb-4">{{ step.desc }}</p>
              <ul class="grid gap-2 md:grid-cols-3">
                <li v-for="item in step.items" :key="item" class="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-400">
                  <span class="mt-0.5 flex-shrink-0" :class="step.textClass">✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-16 text-center reveal">
        <button type="button" class="app-cta" @click="openPlanEditor">
          <span class="app-cta__glow"></span>
          <span class="app-cta__content">
            적용 계획 관리
            <svg class="app-cta__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="plan-modal">
        <div
          v-if="isPlanEditorOpen"
          class="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          @click.self="closePlanEditor"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-editor-title"
            class="w-full max-w-5xl overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D0D14] text-white shadow-2xl shadow-black/40"
          >
            <header class="flex items-start justify-between gap-4 border-b border-white/[0.08] px-6 py-5">
              <div>
                <p class="text-[12px] font-semibold uppercase tracking-widest text-accent/80">Roadmap Editor</p>
                <h2 id="plan-editor-title" class="mt-1 text-xl font-bold tracking-tight">적용 계획 단계 관리</h2>
                <p class="mt-2 text-sm leading-relaxed text-[#9CA3B0]">
                  단계별 제목, 설명, 체크리스트를 추가하거나 수정합니다. 현재 화면 상태는 DB 없이 프론트엔드 코드 상태로 반영됩니다.
                </p>
              </div>
              <button
                type="button"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B94A5] transition-colors hover:bg-white/[0.05] hover:text-white"
                aria-label="적용 계획 관리 닫기"
                @click="closePlanEditor"
              >
                ×
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
                  <article
                    v-for="(step, index) in steps"
                    :key="step.id"
                    class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="min-w-0">
                        <p class="text-[12px] font-semibold uppercase tracking-widest" :class="step.textClass">{{ step.duration }}</p>
                        <h4 class="mt-1 truncate text-sm font-bold text-white">{{ step.title }}</h4>
                        <p class="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8B94A5]">{{ step.desc }}</p>
                      </div>
                      <div class="flex flex-shrink-0 items-center gap-2">
                        <button
                          type="button"
                          class="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[12px] font-semibold text-[#B8C0CF] transition-colors hover:border-accent/40 hover:text-white"
                          @click="editStep(index)"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          class="rounded-md border border-rose-400/20 px-2.5 py-1.5 text-[12px] font-semibold text-rose-300 transition-colors hover:bg-rose-400/10"
                          @click="deleteStep(index)"
                        >
                          삭제
                        </button>
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
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">단계 라벨</span>
                  <input
                    v-model="editingStep.duration"
                    type="text"
                    class="w-full rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50"
                    placeholder="단계 1"
                  />
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">제목</span>
                  <input
                    v-model="editingStep.title"
                    type="text"
                    class="w-full rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50"
                    placeholder="DB 조회 자동화"
                  />
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">설명</span>
                  <textarea
                    v-model="editingStep.desc"
                    rows="3"
                    class="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition-colors focus:border-accent/50"
                  />
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">체크리스트</span>
                  <textarea
                    v-model="editingStep.itemsText"
                    rows="5"
                    class="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition-colors focus:border-accent/50"
                    placeholder="한 줄에 하나씩 입력"
                  />
                </label>

                <label class="block">
                  <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">색상</span>
                  <select
                    v-model="editingStep.textClass"
                    class="w-full rounded-lg border border-white/[0.08] bg-[#0A0A0F] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50"
                  >
                    <option v-for="option in stepColorOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </label>

                <label class="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-[#B8C0CF]">
                  <input v-model="editingStep.isActive" type="checkbox" class="h-4 w-4 accent-sky-500" />
                  현재 진행 중 단계로 표시
                </label>

                <div class="flex items-center justify-end gap-2 border-t border-white/[0.08] pt-4">
                  <button
                    type="button"
                    class="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-[#B8C0CF] transition-colors hover:bg-white/[0.04] hover:text-white"
                    @click="resetEditingForm"
                  >
                    초기화
                  </button>
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

const defaultSteps = [
  {
    id: 'db-automation',
    duration: '단계 1',
    title: 'DB 조회 자동화 (Text-to-SQL)',
    desc: '가장 빈도가 높은 "설비 기능 존재 여부"와 "설비 간 비교" VOC를 Oracle DB 자동 조회로 처리합니다.',
    items: [
      'FastAPI 백엔드 골격 및 Vue.js 챗봇 SSE 연동',
      'Text-to-SQL 파이프라인 구축 (Schema RAG, Value Retrieval, 자동 검증)',
      'Golden Dataset 30개 기반 품질 회귀 테스트 체계 수립',
    ],
    nodeClass: 'roadmap-node-active',
    textClass: 'text-accent',
  },
  {
    id: 'doc-rag',
    duration: '단계 2',
    title: '문서 기반 기능 설명 (RAG)',
    desc: 'Confluence 등 내부 문서를 검색해 "기능 설명" 유형 VOC에 자동 응답합니다.',
    items: [
      'Hybrid 검색(BM25 + Vector) 및 Cross-encoder Reranking 적용',
      'Contextual Retrieval로 청크별 컨텍스트 자동 생성 및 색인',
      '멀티 Agent Orchestrator 구성 (DB + Doc 복합 질문 처리)',
    ],
    nodeClass: '',
    textClass: 'text-blue-400',
  },
  {
    id: 'splunk-analysis',
    duration: '단계 3',
    title: '로그 분석 반자동화 (Splunk)',
    desc: '설비 오동작 원인을 Splunk 로그 패턴 분석으로 초안 생성하고 검토자가 승인 후 발송합니다.',
    items: [
      'SPL 자동 생성 및 로그 패턴 라이브러리 구축',
      'Confidence 기반 자동/반자동 라우팅 및 검토 큐 운영',
      '도메인 패턴 DB 누적으로 진단 정확도 지속 개선',
    ],
    nodeClass: '',
    textClass: 'text-emerald-400',
  },
  {
    id: 'llm-wiki',
    duration: '단계 4',
    title: '지식 축적 및 품질 자동화 (LLM Wiki)',
    desc: '검토된 답변을 구조화하여 축적하고, 품질 지표 대시보드로 운영 안정성을 확보합니다.',
    items: [
      '검토 완료 답변 자동 적재 및 유사 질문 재활용 (Knowledge Agent)',
      'RAGAS 기반 품질 지표 CI 자동화 및 회귀 감지',
      '응답 latency, 정확률, 피드백 비율 운영 대시보드 구축',
    ],
    nodeClass: '',
    textClass: 'text-violet-300',
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

function createEditingStep(step = null, index = steps.value.length) {
  const fallbackColor = stepColorOptions[index % stepColorOptions.length]?.value ?? 'text-accent'
  return {
    id: step?.id ?? `custom-step-${Date.now()}`,
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
    duration: editingStep.duration.trim() || `단계 ${editingIndex.value + 1}`,
    title: editingStep.title.trim() || '새 적용 단계',
    desc: editingStep.desc.trim() || '이 단계의 설명을 입력하세요.',
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
    steps.value = steps.value.map((step) => ({ ...step, nodeClass: '' }))
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
  left: 2.25rem;
  top: 2.25rem;
  bottom: 2.25rem;
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
