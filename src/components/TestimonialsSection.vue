<template>
  <section class="py-28 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute bottom-0 left-[20%] w-[600px] h-[400px] rounded-full bg-accent/6 blur-[120px]"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <div class="text-center mb-16 reveal">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-accent/80 tracking-widest uppercase mb-4">
          <span class="w-4 h-px bg-accent/60"></span>
          고객 후기
          <span class="w-4 h-px bg-accent/60"></span>
        </div>
        <h2 class="text-4xl font-bold tracking-tight">
          실제 사용자들의<br />
          <span class="text-gradient">생생한 이야기</span>
        </h2>
      </div>

      <!-- Testimonial grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(testimonial, i) in testimonials"
          :key="testimonial.name"
          class="glass-card rounded-2xl p-6 hover:border-white/15 transition-all duration-300 reveal"
          :class="`reveal-delay-${(i % 3) + 1}`"
        >
          <!-- Stars -->
          <div class="flex gap-0.5 mb-4">
            <span v-for="s in 5" :key="s" class="text-yellow-400 text-sm">★</span>
          </div>
          <!-- Quote -->
          <blockquote class="text-[14px] text-[#C0C0D0] leading-relaxed mb-5">
            "{{ testimonial.quote }}"
          </blockquote>
          <!-- Author -->
          <div class="flex items-center gap-3 pt-4 border-t border-white/6">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              :class="testimonial.avatarClass">
              {{ testimonial.initials }}
            </div>
            <div>
              <div class="text-[13px] font-semibold text-white">{{ testimonial.name }}</div>
              <div class="text-[11px] text-muted">{{ testimonial.role }} · {{ testimonial.company }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Metric bar -->
      <div class="mt-16 glass-card rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
        <div v-for="metric in metrics" :key="metric.label" class="text-center">
          <div class="text-3xl font-bold text-gradient mb-1">{{ metric.value }}</div>
          <div class="text-[12px] text-muted">{{ metric.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useReveal } from '../composables/useReveal'
useReveal()

const testimonials = [
  {
    quote: '회의록 작성에 하루 1~2시간 쓰던 게 이제 10분도 안 걸려요. 팀원들 모두 "왜 이걸 이제 쓰냐"고 할 정도입니다.',
    name: '김지은',
    role: '팀장',
    company: '마케팅 본부',
    initials: '김',
    avatarClass: 'bg-accent/20 text-accent',
  },
  {
    quote: '레거시 코드 분석이 가장 큰 도움이 됐어요. 5년 된 코드베이스를 신규 입사자도 쉽게 파악할 수 있게 됐습니다.',
    name: '박성민',
    role: '시니어 개발자',
    company: 'IT 개발팀',
    initials: '박',
    avatarClass: 'bg-blue-500/20 text-blue-400',
  },
  {
    quote: '법무팀에서 계약서 검토 의뢰가 하루에 20~30건이었는데, AI가 1차 검토를 다 해줘서 실제 법적 판단에 집중할 수 있어요.',
    name: '이수연',
    role: '법무팀장',
    company: '법무 & 컴플라이언스',
    initials: '이',
    avatarClass: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    quote: '데이터 분석 때 매번 SQL 짜달라고 개발팀 부탁했는데, 이젠 제가 직접 자연어로 원하는 분석 결과를 뽑아냅니다.',
    name: '최현우',
    role: '경영기획 담당',
    company: '전략기획팀',
    initials: '최',
    avatarClass: 'bg-orange-500/20 text-orange-400',
  },
  {
    quote: '보안 때문에 외부 ChatGPT 사용을 금지했는데, 사내 TC Assistant 도입 후 직원들이 오히려 더 적극적으로 AI를 활용하고 있어요.',
    name: '정태준',
    role: 'CTO',
    company: '기술 경영진',
    initials: '정',
    avatarClass: 'bg-rose-500/20 text-rose-400',
  },
  {
    quote: '고객 민원을 AI가 먼저 분류해주니까 진짜 중요한 케이스에 집중할 수 있게 됐습니다. CS팀 만족도가 눈에 띄게 올랐어요.',
    name: '한소영',
    role: 'CS 매니저',
    company: '고객경험팀',
    initials: '한',
    avatarClass: 'bg-purple-500/20 text-purple-400',
  },
]

const metrics = [
  { value: '94%', label: '도입 기업 만족도' },
  { value: '6.2시간', label: '주간 절약 시간 (1인 평균)' },
  { value: '2주', label: '평균 전사 도입 기간' },
  { value: '4.9/5', label: '사용자 평점' },
]
</script>
