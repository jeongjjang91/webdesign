<template>
  <section id="development-history" class="min-h-full bg-[#0A0A0F] px-6 py-10 text-white">
    <div class="mx-auto w-full max-w-6xl">
      <header class="mb-12">
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
          <span class="text-xs font-semibold uppercase tracking-widest text-accent/90">Development History</span>
        </div>
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              개발 이력을<br />
              <span class="text-gradient">한눈에 관리합니다</span>
            </h1>
            <p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#9CA3B0]">
              TC AI Bot의 기능 추가, 개선, 오류 수정 이력을 시간순으로 정리해 시스템이 꾸준히 관리되고 있음을 보여줍니다.
            </p>
          </div>

          <div class="grid grid-cols-3 gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
            <div v-for="metric in historyMetrics" :key="metric.label" class="min-w-[96px]">
              <div class="text-2xl font-bold tabular-nums text-white">{{ metric.value }}</div>
              <div class="mt-1 text-[11px] text-[#7D8594]">{{ metric.label }}</div>
            </div>
          </div>
        </div>
      </header>

      <div class="relative mx-auto max-w-5xl">
        <div class="absolute left-[8.5rem] top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-accent/10 via-accent/50 to-white/[0.06] md:block"></div>

        <article
          v-for="entry in historyEntries"
          :key="entry.version"
          class="relative grid gap-5 pb-8 md:grid-cols-[7rem_2.5rem_minmax(0,1fr)]"
        >
          <div class="pt-1 md:text-right">
            <p class="text-sm font-bold tabular-nums text-white">{{ entry.date }}</p>
            <p class="mt-1 text-[12px] text-[#7D8594]">{{ entry.version }}</p>
          </div>

          <div class="hidden justify-center pt-1 md:flex">
            <span
              class="history-node relative z-10 h-4 w-4 rounded-full border border-accent bg-[#0A0A0F]"
              :class="entry.current ? 'history-node-current' : ''"
            ></span>
          </div>

          <div
            class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:border-white/[0.14]"
          >
            <div class="mb-3 flex flex-wrap items-center gap-2">
              <span
                class="rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                :class="tagClass(entry.tag)"
              >
                {{ entry.tag }}
              </span>
              <span v-if="entry.current" class="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">
                Current
              </span>
            </div>

            <h2 class="text-lg font-bold text-white">{{ entry.title }}</h2>
            <p class="mt-2 text-sm leading-relaxed text-[#9CA3B0]">{{ entry.description }}</p>

            <ul class="mt-4 grid gap-2 md:grid-cols-2">
              <li v-for="item in entry.items" :key="item" class="flex items-start gap-2 text-[13px] leading-relaxed text-[#AEB6C6]">
                <span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const historyMetrics = [
  { label: '현재 버전', value: 'v1.4' },
  { label: '누적 변경', value: '28' },
  { label: '최근 배포', value: '4월 18일' },
]

const historyEntries = [
  {
    date: '2026.04.18',
    version: 'v1.4',
    tag: 'New',
    current: true,
    title: '설비 로그 Download 기능 추가',
    description: 'LineID, EQPID, 날짜, 로그 유형, TBL 로그 병합 조건으로 로그 다운로드 패키지를 생성하는 화면을 추가했습니다.',
    items: ['검색형 LineID/EQPID 드롭다운', '최근 1개월 날짜 제한 캘린더', '메일주소 기반 다운로드 요청'],
  },
  {
    date: '2026.04.17',
    version: 'v1.3',
    tag: 'Improvement',
    current: false,
    title: '적용 계획 단계 관리 팝업 개선',
    description: '개발 계획 단계를 화면에서 추가, 수정, 삭제할 수 있는 관리 팝업을 도입했습니다.',
    items: ['단계별 체크리스트 편집', '현재 진행 단계 glow 표시', '코드 배열 기반 데이터 관리'],
  },
  {
    date: '2026.04.16',
    version: 'v1.2',
    tag: 'Fix',
    current: false,
    title: '채팅 세션 초기화 오류 수정',
    description: '최근 대화에서 채팅을 연 뒤 새 채팅을 눌렀을 때 기존 대화가 유지되던 문제를 수정했습니다.',
    items: ['chatSessionKey 기반 재마운트', '스트리밍 타이머 정리', '새 채팅 상태 초기화'],
  },
  {
    date: '2026.04.15',
    version: 'v1.1',
    tag: 'Improvement',
    current: false,
    title: '공용 CTA 버튼 스타일 통합',
    description: '주요 액션 버튼을 app-cta 클래스로 통합해 일관된 hover lift와 blue glow를 적용했습니다.',
    items: ['공용 버튼 컴포넌트 클래스', 'Gradient glow layer', '아이콘 hover motion'],
  },
  {
    date: '2026.04.14',
    version: 'v1.0',
    tag: 'New',
    current: false,
    title: 'TC Assistant 기본 화면 구축',
    description: '사이드바 기반 앱 레이아웃과 홈, 기능, 채팅, 대시보드 화면의 기본 구조를 구성했습니다.',
    items: ['사이드바 내비게이션', '채팅 UI', '대시보드 테이블과 필터'],
  },
]

function tagClass(tag) {
  const classes = {
    New: 'border-accent/30 bg-accent/10 text-accent',
    Fix: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
    Improvement: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  }

  return classes[tag] ?? 'border-white/[0.1] bg-white/[0.04] text-[#C4C9D4]'
}
</script>

<style scoped>
.history-node {
  box-shadow:
    0 0 0 4px rgba(14, 165, 233, 0.08),
    0 0 18px rgba(14, 165, 233, 0.18);
}

.history-node-current {
  box-shadow:
    0 0 0 5px rgba(14, 165, 233, 0.12),
    0 0 26px rgba(14, 165, 233, 0.58),
    0 0 46px rgba(14, 165, 233, 0.28);
}

.history-node-current::after {
  content: "";
  position: absolute;
  inset: -9px;
  border-radius: 999px;
  border: 1px solid rgba(14, 165, 233, 0.28);
  animation: history-pulse 2.4s ease-in-out infinite;
}

@keyframes history-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.92);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}
</style>
