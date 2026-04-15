<template>
  <section id="how" class="py-28 relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/6 blur-[120px]"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center max-w-xl mx-auto mb-20 reveal">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-accent/80 tracking-widest uppercase mb-4">
          <span class="w-4 h-px bg-accent/60"></span>
          도입 프로세스
          <span class="w-4 h-px bg-accent/60"></span>
        </div>
        <h2 class="text-4xl font-bold tracking-tight mb-4">
          2주 만에 팀 전체가<br />
          <span class="text-gradient">AI를 쓰기 시작합니다</span>
        </h2>
        <p class="text-[#9CA3B0] leading-relaxed">
          복잡한 세팅 없이 — 담당자 지정, 데이터 연동, 배포 완료.
        </p>
      </div>

      <!-- Steps -->
      <div class="relative">
        <!-- Connecting line -->
        <div class="hidden lg:block absolute top-[52px] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="relative reveal"
            :class="`reveal-delay-${i + 1}`"
          >
            <!-- Step number -->
            <div class="flex items-center gap-4 mb-5">
              <div class="relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                :class="step.bgClass"
              >
                <span class="text-xl font-bold" :class="step.textClass">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset" :class="step.ringClass"></div>
              </div>
              <div class="h-px flex-1 lg:hidden" :class="step.lineClass"></div>
            </div>
            <div class="text-xs font-semibold uppercase tracking-widest mb-2" :class="step.textClass">
              {{ step.duration }}
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">{{ step.title }}</h3>
            <p class="text-[#9CA3B0] text-[14px] leading-relaxed mb-4">{{ step.desc }}</p>
            <ul class="space-y-2">
              <li v-for="item in step.items" :key="item" class="flex items-start gap-2 text-[13px] text-[#9CA3B0]">
                <span class="mt-0.5 flex-shrink-0" :class="step.textClass">✓</span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-16 text-center reveal">
        <a href="#start" class="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
          지금 도입 상담 신청하기
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
useReveal()

const steps = [
  {
    duration: '1~3일차',
    title: '환경 설정 & 데이터 연동',
    desc: '전담 엔지니어가 사내 인프라에 맞춰 설치를 지원합니다. 기존 시스템과 충돌 없이 연동.',
    items: ['온프레미스 / 클라우드 설치', 'Notion, Drive, SharePoint 연동', 'SSO & 사내 계정 연동'],
    bgClass: 'bg-accent/12',
    textClass: 'text-accent',
    ringClass: 'ring-accent/20',
    lineClass: 'bg-accent/20',
  },
  {
    duration: '4~7일차',
    title: '사내 데이터 학습 & 튜닝',
    desc: '사내 문서, 규정, 업무 매뉴얼을 AI에 학습시킵니다. 우리 회사 맥락을 이해하는 AI로.',
    items: ['문서 인덱싱 & 임베딩', '부서별 접근 권한 설정', '응답 품질 검증 및 조정'],
    bgClass: 'bg-blue-500/12',
    textClass: 'text-blue-400',
    ringClass: 'ring-blue-500/20',
    lineClass: 'bg-blue-500/20',
  },
  {
    duration: '8~14일차',
    title: '전사 배포 & 교육',
    desc: '전직원이 바로 쓸 수 있도록 온보딩 가이드와 부서별 활용법을 제공합니다.',
    items: ['부서별 활용 가이드 제공', '관리자 대시보드 교육', '30일 무제한 기술 지원'],
    bgClass: 'bg-emerald-500/12',
    textClass: 'text-emerald-400',
    ringClass: 'ring-emerald-500/20',
    lineClass: 'bg-emerald-500/20',
  },
]
</script>
