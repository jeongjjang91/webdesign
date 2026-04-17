<template>
  <section id="usecases" class="py-28 bg-ink-900/50 border-y border-white/6">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal">
        <div>
          <div class="inline-flex items-center gap-2 text-xs font-semibold text-accent/80 tracking-widest uppercase mb-4">
            <span class="w-4 h-px bg-accent/60"></span>
            부서별 활용 사례
          </div>
          <h2 class="text-4xl font-bold tracking-tight">
            어느 팀이든<br />
            <span class="text-gradient">즉시 활용 가능</span>
          </h2>
        </div>
        <p class="text-[#9CA3B0] text-[14px] max-w-xs leading-relaxed">
          개발팀부터 인사팀까지, 역할에 맞는 TC 어시스턴트를 바로 사용하세요.
        </p>
      </div>

      <!-- Department tabs -->
      <div class="flex flex-wrap gap-2 mb-10 reveal reveal-delay-1">
        <button
          v-for="dept in departments"
          :key="dept.id"
          @click="active = dept.id"
          class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200"
          :class="active === dept.id
            ? 'bg-accent text-white shadow-lg shadow-accent/20'
            : 'text-muted hover:text-white border border-white/8 hover:border-white/16'"
        >
          {{ dept.icon }} {{ dept.label }}
        </button>
      </div>

      <!-- Content area -->
      <div class="grid md:grid-cols-2 gap-6 reveal reveal-delay-2">
        <!-- Use case list -->
        <div class="space-y-3">
          <div
            v-for="(usecase, i) in currentDept.usecases"
            :key="usecase.title"
            class="glass-card rounded-xl p-5 hover:border-white/15 transition-all duration-200 cursor-pointer group"
            @click="activeUsecase = i"
            :class="activeUsecase === i ? 'border-accent/30 bg-accent/5' : ''"
          >
            <div class="flex items-start gap-3">
              <span class="text-xl flex-shrink-0">{{ usecase.icon }}</span>
              <div>
                <h4 class="text-[14px] font-semibold text-white mb-1">{{ usecase.title }}</h4>
                <p class="text-[12px] text-muted leading-relaxed">{{ usecase.desc }}</p>
              </div>
              <svg class="w-4 h-4 text-muted ml-auto flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="glass-card rounded-xl p-6">
          <div class="text-xs text-muted font-medium uppercase tracking-widest mb-4">실제 대화 예시</div>
          <div class="space-y-3">
            <div class="flex justify-end">
              <div class="bg-accent/15 border border-accent/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                <p class="text-[13px] text-white/90 leading-relaxed">
                  {{ currentDept.usecases[activeUsecase].exampleQ }}
                </p>
              </div>
            </div>
            <div class="flex gap-2.5">
              <GatewayFlowIcon size="sm" label="TC Assistant" class="flex-shrink-0 mt-0.5" />
              <div class="glass-card rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                <p class="text-[13px] text-[#C0C0D0] leading-relaxed whitespace-pre-line">
                  {{ currentDept.usecases[activeUsecase].exampleA }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import GatewayFlowIcon from './GatewayFlowIcon.vue'
import { useReveal } from '../composables/useReveal'
useReveal()

const active = ref('dev')
const activeUsecase = ref(0)

const departments = [
  { id: 'dev', icon: '💻', label: '개발팀' },
  { id: 'hr', icon: '👥', label: '인사팀' },
  { id: 'sales', icon: '📈', label: '영업팀' },
  { id: 'legal', icon: '⚖️', label: '법무팀' },
  { id: 'cs', icon: '🎧', label: '고객지원' },
]

const deptData = {
  dev: {
    usecases: [
      {
        icon: '🔍', title: '코드 리뷰 자동화',
        desc: 'PR 제출 시 컨벤션, 보안, 성능 이슈를 자동으로 점검합니다.',
        exampleQ: '이 함수에 SQL 인젝션 취약점 없어?',
        exampleA: '분석 결과, 26번째 줄 쿼리에서 사용자 입력값이 직접 삽입되고 있습니다.\n\n✗ 취약: `query = "SELECT * WHERE id=" + userId`\n✓ 권장: 파라미터 바인딩 사용 (`?` 플레이스홀더)',
      },
      {
        icon: '📖', title: '레거시 코드 해석',
        desc: '5년 전 코드도 한국어로 즉시 설명해드립니다.',
        exampleQ: '이 레거시 배치 스크립트가 뭐 하는 코드야?',
        exampleA: '이 스크립트는 매일 자정에 실행되어 30일 이상 된 임시 파일을 정리하고, 결과를 /var/log/cleanup.log에 기록합니다.',
      },
      {
        icon: '🐛', title: '버그 원인 분석',
        desc: '에러 로그를 붙여넣으면 원인과 해결책을 제시합니다.',
        exampleQ: 'NullPointerException이 왜 발생하는 건지 모르겠어',
        exampleA: 'UserService.java 48번째 줄에서 `user.getProfile()`을 호출하는데, 소셜 로그인 사용자의 경우 profile이 null로 초기화됩니다.\n\n→ Optional 래핑 또는 null 체크 추가 권장',
      },
    ]
  },
  hr: {
    usecases: [
      {
        icon: '📋', title: '취업 규칙 Q&A',
        desc: '사내 규정집을 학습해 직원 질문에 즉시 답변합니다.',
        exampleQ: '출산휴가 기간 중 연차가 발생하나요?',
        exampleA: '네, 출산휴가 90일은 실제 근무일수로 산정됩니다. 따라서 출산휴가 기간에도 연차 발생 기준에 포함됩니다.\n\n관련 규정: 취업규칙 제23조 제2항',
      },
      {
        icon: '📝', title: '채용 공고 초안 작성',
        desc: 'JD 작성 시간을 80% 줄여드립니다.',
        exampleQ: '백엔드 시니어 개발자 채용 공고 써줘, Java 기반이야',
        exampleA: '[채용 공고 초안]\n직무: 백엔드 시니어 개발자\n\n주요 업무\n• Java/Spring 기반 서버 설계 및 개발\n• MSA 아키텍처 운영 및 개선\n• 코드 리뷰 및 주니어 멘토링...',
      },
      {
        icon: '📊', title: '인사 데이터 분석',
        desc: '이직률, 성과 데이터를 자연어로 분석합니다.',
        exampleQ: '올해 개발팀 이직률이 왜 높아졌는지 분석해줘',
        exampleA: '데이터 분석 결과, 3가지 패턴이 발견됩니다:\n\n① 재직 2~3년차 집중 이탈 (62%)\n② 퇴사 사유 1위: 성장 기회 부족\n③ 타 팀 대비 연봉 밴드 8% 낮음',
      },
    ]
  },
  sales: {
    usecases: [
      {
        icon: '📑', title: '제안서 초안 작성',
        desc: '고객사 정보 입력 시 맞춤형 제안서를 생성합니다.',
        exampleQ: '제조업 중견기업 대상 ERP 도입 제안서 써줘',
        exampleA: '[제안서 목차]\n\n1. 현황 진단 및 도입 배경\n2. 솔루션 개요 및 핵심 기능\n3. 도입 효과 (ROI 분석)\n4. 구축 일정 및 예산...',
      },
      {
        icon: '🔎', title: '경쟁사 비교 분석',
        desc: '사내 자료 기반으로 경쟁사 비교표를 즉시 생성합니다.',
        exampleQ: 'A사 대비 우리 제품 차별점 정리해줘',
        exampleA: '주요 차별점 3가지:\n\n① 온프레미스 지원 (A사: 클라우드 전용)\n② 한국어 특화 모델 사용\n③ 구축 기간 50% 단축 (4주 vs 8주)',
      },
    ]
  },
  legal: {
    usecases: [
      {
        icon: '📜', title: '계약서 검토',
        desc: '계약서 위험 조항을 자동으로 식별하고 설명합니다.',
        exampleQ: '이 NDA 계약서에 불리한 조항 있어?',
        exampleA: '⚠ 3가지 주의 조항 발견:\n\n① 비밀유지 기간 무제한 (업계 관행: 3~5년)\n② 손해배상 한도 없음 → 상한 조항 협상 필요\n③ 준거법이 상대방 국가 법률로 지정',
      },
      {
        icon: '⚡', title: '법률 용어 해설',
        desc: '어려운 법률 문서를 평이한 한국어로 설명합니다.',
        exampleQ: '손해배상 면책조항이 뭔지 쉽게 설명해줘',
        exampleA: '한마디로, "우리 잘못으로 손해가 나도 책임 안 진다"는 조항입니다.\n\n다만 고의 또는 중대한 과실이 있으면 법적으로 효력이 없을 수 있습니다.',
      },
    ]
  },
  cs: {
    usecases: [
      {
        icon: '💬', title: '고객 응대 가이드',
        desc: '유사 민원 사례를 검색해 최적의 응대 답변을 제안합니다.',
        exampleQ: '환불 요청하는 화난 고객, 어떻게 응대해?',
        exampleA: '권장 응대 순서:\n\n① 감사 & 공감 표현 먼저\n② 환불 정책 안내 (규정 7조)\n③ 대안 제시 (포인트 환급 or 교환)\n④ 에스컬레이션 기준: 50만원 이상 또는 법적 언급 시',
      },
      {
        icon: '📊', title: '민원 유형 분류',
        desc: '대량 민원을 자동 분류하고 우선순위를 판단합니다.',
        exampleQ: '이번 주 접수된 민원 500건 패턴 분석해줘',
        exampleA: '분석 완료:\n\n① 배송 지연: 38% (↑12%)\n② 제품 불량: 24%\n③ 앱 오류: 19% (신규)\n④ 환불 요청: 13%\n\n→ 앱 오류 급증, 개발팀 즉시 에스컬레이션 권장',
      },
    ]
  },
}

const currentDept = computed(() => deptData[active.value])
</script>
