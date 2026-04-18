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
          :key="step.title"
          class="relative grid grid-cols-[4.5rem_1fr] gap-5 reveal"
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
        <a href="#start" class="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
          적용 계획 상세 논의하기
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useReveal } from '../composables/useReveal'
import TcAiBotIcon from './TcAiBotIcon.vue'
useReveal()

const steps = [
  {
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
</style>
