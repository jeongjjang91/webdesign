<template>
  <section id="features" class="py-28">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Header -->
      <div class="max-w-xl mb-16 reveal">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-accent/80 tracking-widest uppercase mb-4">
          <span class="w-4 h-px bg-accent/60"></span>
          핵심 기능
        </div>
        <h2 class="text-4xl font-bold tracking-tight leading-tight">
          업무 현장에 맞게<br />
          <span class="text-gradient">설계된 기능들</span>
        </h2>
        <p class="text-[#9CA3B0] mt-4 leading-relaxed">
          범용 AI가 아닙니다. 우리 회사 데이터를 이해하고,<br />사내 워크플로우에 최적화된 어시스턴트입니다.
        </p>
      </div>

      <!-- Bento grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- Feature 1: Large card -->
        <div class="lg:col-span-2 glass-card rounded-2xl p-7 hover:border-white/15 transition-all duration-300 group reveal">
          <div class="flex items-start justify-between mb-6">
            <div class="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v11m0 0l4-4m-4 4l-4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2"/>
              </svg>
            </div>
            <span class="text-[11px] text-accent/60 font-medium bg-accent/8 rounded-full px-2.5 py-1">인기</span>
          </div>
          <h3 class="text-xl font-bold mb-2">사내 로그 즉시 Download</h3>
          <p class="text-[#9CA3B0] text-[14px] leading-relaxed mb-6">
            장비, 기간, 로그 유형을 선택하면 필요한 사내 로그를 즉시 묶어 다운로드합니다. 장애 분석과 VOC 대응에 필요한 원본 데이터를 빠르게 확보합니다.
          </p>
          <!-- Mini demo -->
          <div class="bg-ink-900 rounded-xl p-4 border border-white/6">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span class="text-[11px] text-muted">다운로드 패키지 생성 중...</span>
            </div>
            <div class="space-y-2">
              <div v-for="(log, i) in logs" :key="i" class="flex items-center gap-3 text-[12px]">
                <span class="text-lg">{{ log.icon }}</span>
                <span class="text-white/70 flex-1">{{ log.name }}</span>
                <span class="text-muted">{{ log.size }}</span>
                <span class="text-accent/80 font-medium">{{ log.status }}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="app-cta mt-5"
            @click="emit('navigate', 'log-download')"
          >
            <span class="app-cta__glow"></span>
            <span class="app-cta__content">
              로그 다운로드 열기
              <svg class="app-cta__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </span>
          </button>
        </div>

        <!-- Feature 2 -->
        <div class="glass-card rounded-2xl p-7 hover:border-white/15 transition-all duration-300 group reveal reveal-delay-1">
          <div class="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center mb-6 group-hover:bg-blue-500/25 transition-colors">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">회의록 자동 생성</h3>
          <p class="text-[#9CA3B0] text-[14px] leading-relaxed">
            Zoom, Teams, Google Meet 녹취 파일을 업로드하면 회의 내용을 구조화된 회의록으로 변환합니다. 담당자·결정사항·후속 조치까지 정리.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span v-for="tag in meetingTags" :key="tag" class="text-[11px] bg-white/4 border border-white/8 rounded-full px-2.5 py-1 text-muted">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="glass-card rounded-2xl p-7 hover:border-white/15 transition-all duration-300 group reveal reveal-delay-2">
          <div class="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center mb-6 group-hover:bg-orange-500/25 transition-colors">
            <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">코드 리뷰 & 디버깅</h3>
          <p class="text-[#9CA3B0] text-[14px] leading-relaxed">
            사내 코드베이스를 학습한 AI가 컨벤션에 맞는 코드 리뷰와 버그 진단을 제공합니다. GitHub/GitLab 연동 지원.
          </p>
          <div class="mt-6 p-3 bg-ink-900 rounded-lg border border-white/6">
            <code class="text-[11px] text-emerald-400">✓ 보안 취약점 없음</code><br>
            <code class="text-[11px] text-yellow-400">⚠ 성능 개선 가능 (2곳)</code><br>
            <code class="text-[11px] text-muted">─ 컨벤션 준수율 97%</code>
          </div>
        </div>

        <!-- Feature 4 -->
        <div class="glass-card rounded-2xl p-7 hover:border-white/15 transition-all duration-300 group reveal reveal-delay-3">
          <div class="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-6 group-hover:bg-emerald-500/25 transition-colors">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">데이터 분석 & 리포팅</h3>
          <p class="text-[#9CA3B0] text-[14px] leading-relaxed">
            엑셀·CSV를 올리면 인사이트를 자연어로 설명하고 차트를 자동 생성합니다. SQL 몰라도 데이터를 분석할 수 있습니다.
          </p>
        </div>

        <!-- Feature 5: Wide card -->
        <div class="lg:col-span-2 glass-card rounded-2xl p-7 hover:border-white/15 transition-all duration-300 group reveal reveal-delay-1">
          <div class="flex flex-col md:flex-row md:items-start gap-6">
            <div class="flex-1">
              <div class="w-11 h-11 rounded-xl bg-rose-500/15 flex items-center justify-center mb-6 group-hover:bg-rose-500/25 transition-colors">
                <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">완전 격리된 보안 환경</h3>
              <p class="text-[#9CA3B0] text-[14px] leading-relaxed">
                사내 데이터는 외부로 절대 나가지 않습니다. 온프레미스 또는 프라이빗 클라우드에 단독 설치되며, 모든 대화는 암호화되어 저장됩니다.
              </p>
            </div>
            <div class="flex flex-col gap-2 min-w-[180px]">
              <div v-for="badge in securityBadges" :key="badge.label"
                class="flex items-center gap-2.5 bg-ink-900 border border-white/6 rounded-xl px-4 py-2.5"
              >
                <span class="text-emerald-400 text-sm">✓</span>
                <span class="text-[12px] text-white/80 font-medium">{{ badge.label }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { useReveal } from '../composables/useReveal'
useReveal()

const emit = defineEmits(['navigate'])

const logs = [
  { icon: '📦', name: 'equipment-error-20260418.zip', size: '128MB', status: 'Ready' },
  { icon: '🧾', name: 'api-gateway-access.log', size: '42MB', status: 'Ready' },
  { icon: '⚙️', name: 'system-health-dump.json', size: '18MB', status: 'Ready' },
]

const meetingTags = ['Zoom 연동', 'Teams 지원', '화자 분리', '요약 자동 생성', '할일 추출']

const securityBadges = [
  { label: 'ISO 27001 준수' },
  { label: '온프레미스 설치' },
  { label: 'AES-256 암호화' },
  { label: 'SSO / LDAP 연동' },
  { label: '접근 권한 관리' },
]
</script>
