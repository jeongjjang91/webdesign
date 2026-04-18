<template>
  <section class="min-h-full bg-[#0A0A0F] px-6 py-8 text-white">
    <div class="mx-auto w-full max-w-[1800px]">
      <header class="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5">
            <Icon icon="lucide:layout-dashboard" class="h-3.5 w-3.5 text-accent" />
            <span class="text-xs font-semibold text-accent/90">TC Assistant Dashboard</span>
          </div>
          <h1 class="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            TC 정보를 한눈에<br />
            확인하는 대시보드
          </h1>
          <p class="mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#9CA3B0]">
            TC 정보를 빠르게 확인하고, 필요한 내용만 골라 효율적으로 살펴볼 수 있습니다.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
          <div v-for="metric in metrics" :key="metric.label" class="min-w-[96px]">
            <div class="text-2xl font-bold tabular-nums text-white">{{ metric.value }}</div>
            <div class="mt-1 text-[11px] text-[#7D8594]">{{ metric.label }}</div>
          </div>
        </div>
      </header>

      <div class="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside class="xl:sticky xl:top-8 xl:self-start">
          <div class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div class="px-2 pb-3 pt-1">
              <p class="text-[14px] font-semibold uppercase text-[#6B7280]">메뉴</p>
            </div>
            <nav class="space-y-2">
              <button
                v-for="menu in dashboardMenus"
                :key="menu.id"
                type="button"
                class="w-full rounded-lg px-3 py-2.5 text-left transition-all duration-200"
                :class="activeMenuId === menu.id
                  ? 'bg-accent/10 text-accent'
                  : 'text-[#9CA3B0] hover:bg-white/[0.04] hover:text-white'"
                @click="activeMenuId = menu.id"
              >
                <span class="flex items-center gap-2.5">
                  <Icon :icon="menu.icon" class="h-4 w-4 flex-shrink-0" />
                  <span class="text-sm font-semibold">{{ menu.title }}</span>
                </span>
                <span class="mt-1 block pl-6 text-[11px] leading-4 text-[#7D8594]">
                  {{ menu.caption }}
                </span>
              </button>
            </nav>
          </div>
        </aside>

        <div class="min-w-0">
          <Transition name="dashboard-panel" mode="out-in">
            <div :key="activeMenuId" class="mb-4 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
              <div class="mb-4 flex items-start gap-3 border-b border-white/[0.06] pb-4">
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon :icon="activeMenu.icon" class="h-5 w-5" />
                </div>
                <div>
                  <h2 class="text-base font-semibold text-white">{{ activeMenu.title }}</h2>
                  <p class="mt-1 text-sm leading-relaxed text-[#8B94A5]">{{ activeMenu.description }}</p>
                </div>
              </div>

              <div v-if="activeMenuId === 'teams'" class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                <article class="dashboard-card rounded-lg border border-white/[0.08] bg-[#0D0D14] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div class="mb-3 flex items-center justify-between">
                    <div>
                      <p class="text-[12px] font-semibold text-[#8B94A5]">팀별 요청 추이</p>
                      <p class="mt-1 text-2xl font-bold tabular-nums text-white">42건</p>
                    </div>
                    <Icon icon="lucide:line-chart" class="h-5 w-5 text-accent" />
                  </div>
                  <div class="h-40 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                    <svg viewBox="0 0 260 120" class="h-full w-full" role="img" aria-label="팀별 요청 추이 차트">
                      <path d="M10 98 H250" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
                      <path d="M10 68 H250" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
                      <path d="M10 38 H250" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
                      <path d="M12 88 C42 72, 60 78, 88 56 C116 34, 136 44, 160 32 C190 18, 212 34, 248 20" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" />
                      <path d="M12 88 C42 72, 60 78, 88 56 C116 34, 136 44, 160 32 C190 18, 212 34, 248 20 L248 110 L12 110 Z" fill="rgba(14,165,233,0.12)" />
                    </svg>
                  </div>
                </article>

                <article class="dashboard-card rounded-lg border border-white/[0.08] bg-[#0D0D14] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div class="mb-3 flex items-center justify-between">
                    <div>
                      <p class="text-[12px] font-semibold text-[#8B94A5]">부서별 비중</p>
                      <p class="mt-1 text-2xl font-bold tabular-nums text-white">5팀</p>
                    </div>
                    <Icon icon="lucide:pie-chart" class="h-5 w-5 text-accent" />
                  </div>
                  <div class="flex h-40 items-center gap-4 rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                    <div
                      class="h-24 w-24 flex-shrink-0 rounded-full"
                      style="background: conic-gradient(#38BDF8 0 34%, #22C55E 34% 56%, #F59E0B 56% 74%, #A78BFA 74% 88%, rgba(255,255,255,0.14) 88% 100%)"
                    />
                    <div class="min-w-0 space-y-2">
                      <div v-for="item in teamDistribution" :key="item.team" class="flex items-center gap-2 text-[12px] text-[#AEB6C6]">
                        <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
                        <span class="min-w-0 flex-1 truncate">{{ item.team }}</span>
                        <span class="font-semibold tabular-nums text-white">{{ item.value }}%</span>
                      </div>
                    </div>
                  </div>
                </article>

                <article class="dashboard-card rounded-lg border border-white/[0.08] bg-[#0D0D14] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div class="mb-3 flex items-center justify-between">
                    <div>
                      <p class="text-[12px] font-semibold text-[#8B94A5]">팀별 처리량</p>
                      <p class="mt-1 text-2xl font-bold tabular-nums text-white">87%</p>
                    </div>
                    <Icon icon="lucide:bar-chart-3" class="h-5 w-5 text-accent" />
                  </div>
                  <div class="h-40 space-y-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                    <div v-for="item in teamWorkload" :key="item.team">
                      <div class="mb-1 flex items-center justify-between text-[12px]">
                        <span class="text-[#AEB6C6]">{{ item.team }}</span>
                        <span class="font-semibold tabular-nums text-white">{{ item.value }}건</span>
                      </div>
                      <div class="h-2 rounded-full bg-white/[0.06]">
                        <div class="h-full rounded-full bg-accent" :style="{ width: `${item.percent}%` }"></div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex flex-col gap-3 md:flex-row md:items-center">
                  <div
                    v-for="filter in filterControls"
                    :key="filter.id"
                    class="relative min-w-[200px]"
                  >
                    <span class="mb-1.5 block text-[11px] font-semibold text-[#7D8594]">{{ filter.label }}</span>
                    <button
                      type="button"
                      class="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2.5 text-left text-sm text-white outline-none transition-colors hover:bg-white/[0.04]"
                      @click="toggleFilterPanel(filter.id)"
                    >
                      <span class="truncate" :class="selectedFilters[filter.id].length ? 'text-white' : 'text-[#7D8594]'">
                        {{ filterButtonLabel(filter) }}
                      </span>
                      <Icon
                        icon="lucide:chevron-down"
                        class="h-4 w-4 flex-shrink-0 text-[#7D8594] transition-transform"
                        :class="openFilterId === filter.id ? 'rotate-180' : ''"
                      />
                    </button>

                    <div
                      v-if="openFilterId === filter.id"
                      class="absolute left-0 top-[72px] z-30 w-full rounded-lg border border-white/[0.08] bg-[#111118] p-2 shadow-xl shadow-black/30"
                    >
                      <div class="relative mb-2">
                        <Icon icon="lucide:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                        <input
                          v-model="filterSearch[filter.id]"
                          type="text"
                          class="w-full rounded-md border border-white/[0.08] bg-white/[0.04] py-2 pl-9 pr-3 text-[13px] text-white placeholder-[#6B7280] outline-none transition-colors focus:border-accent/50"
                          :placeholder="`${filter.label} 검색`"
                        />
                      </div>

                      <div class="max-h-48 space-y-1 overflow-y-auto">
                        <button
                          v-for="option in filteredOptions(filter)"
                          :key="option"
                          type="button"
                          class="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.05]"
                          :class="isSelected(filter.id, option) ? 'text-white' : 'text-[#AEB6C6]'"
                          @click="toggleFilterValue(filter.id, option)"
                        >
                          <span
                            class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors"
                            :class="isSelected(filter.id, option)
                              ? 'border-accent bg-accent text-white'
                              : 'border-white/[0.14] bg-white/[0.03]'"
                          >
                            <Icon v-if="isSelected(filter.id, option)" icon="lucide:check" class="h-3 w-3" />
                          </span>
                          <span class="truncate">{{ option }}</span>
                        </button>

                        <div v-if="!filteredOptions(filter).length" class="px-2.5 py-4 text-center text-[12px] text-[#7D8594]">
                          검색 결과가 없습니다
                        </div>
                      </div>

                      <div class="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2">
                        <button
                          type="button"
                          class="text-[12px] font-semibold text-[#8B94A5] transition-colors hover:text-white"
                          @click="clearFilterGroup(filter.id)"
                        >
                          선택 해제
                        </button>
                        <span class="text-[11px] text-[#6B7280]">{{ selectedFilters[filter.id].length }}개 선택</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-[12px] text-[#8B94A5]">
                  <Icon icon="lucide:filter" class="h-4 w-4" />
                  <span>{{ filteredRequests.length }}개 요청 표시 중</span>
                </div>
              </div>
            </div>
          </Transition>

          <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <TransitionGroup
              v-if="activeFilters.length"
              name="chip"
              tag="div"
              class="flex flex-wrap items-center gap-2"
            >
              <div
                v-for="filter in activeFilters"
                :key="`${filter.id}-${filter.value}`"
                class="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[12px] text-[#D7F3FF]"
              >
                <span class="text-accent/80">{{ filter.label }}:</span>
                <span class="font-semibold">{{ filter.value }}</span>
                <button
                  type="button"
                  class="rounded-full p-0.5 text-[#8BD8FF] transition-colors hover:bg-white/10 hover:text-white"
                  :aria-label="`${filter.label} ${filter.value} 필터 제거`"
                  @click="removeFilter(filter.id, filter.value)"
                >
                  <Icon icon="lucide:x" class="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                key="clear-all"
                type="button"
                class="px-2 py-1 text-[12px] font-semibold text-[#8B94A5] transition-colors hover:text-white"
                @click="clearFilters"
              >
                전체 해제
              </button>
            </TransitionGroup>

            <button
              type="button"
              class="app-cta app-cta--sm ml-auto"
              @click="downloadCsv"
            >
              <span class="app-cta__glow"></span>
              <span class="app-cta__content">
                <Icon icon="lucide:download" class="h-4 w-4" />
                CSV 다운로드
              </span>
            </button>
          </div>

          <div class="w-full overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div class="grid min-w-[1640px] gap-4 border-b border-white/[0.08] bg-white/[0.04] px-5 py-3 text-[12px] font-semibold text-[#8B94A5]" :style="tableGridStyle">
              <div
                v-for="column in tableColumns"
                :key="column.key"
                :class="column.align === 'right' ? 'text-right' : ''"
              >
                {{ column.label }}
              </div>
            </div>

            <div class="overflow-auto" :class="filteredRequests.length >= 30 ? 'max-h-[640px]' : ''">
              <div v-if="filteredRequests.length" class="min-w-[1640px] divide-y divide-white/[0.06]">
                <article
                  v-for="request in filteredRequests"
                  :key="request.id"
                  class="grid gap-4 px-5 py-4 transition-colors hover:bg-white/[0.035]"
                  :style="tableGridStyle"
                >
                  <div
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="flex min-w-0 items-center text-sm"
                    :class="column.align === 'right' ? 'justify-end text-right' : ''"
                  >
                    <template v-if="column.key === 'title'">
                      <div class="min-w-0">
                        <div class="truncate font-semibold text-white">{{ request.title }}</div>
                        <div class="mt-1 truncate text-[12px] text-[#7D8594]">{{ request.summary }}</div>
                      </div>
                    </template>
                    <template v-else-if="column.key === 'status'">
                      <span class="rounded-full px-2.5 py-1 text-[12px] font-semibold" :class="statusClass(request.status)">
                        {{ request.status }}
                      </span>
                    </template>
                    <template v-else-if="column.key === 'priority'">
                      <span class="rounded-full px-2.5 py-1 text-[12px] font-semibold" :class="priorityClass(request.priority)">
                        {{ request.priority }}
                      </span>
                    </template>
                    <template v-else>
                      <span class="truncate text-[#C4C9D4]">{{ request[column.key] }}</span>
                    </template>
                  </div>
                </article>
              </div>

              <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                  <Icon icon="lucide:search-x" class="h-5 w-5 text-[#8B94A5]" />
                </div>
                <h2 class="text-lg font-semibold text-white">조건에 맞는 요청이 없습니다</h2>
                <p class="mt-2 text-sm text-[#8B94A5]">필터를 줄이거나 전체 해제를 눌러 다시 확인해보세요.</p>
              </div>
            </div>
          </div>

          <div class="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
            <article
              v-for="insight in insights"
              :key="insight.title"
              class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon :icon="insight.icon" class="h-5 w-5" />
              </div>
              <h3 class="text-base font-semibold text-white">{{ insight.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#9CA3B0]">{{ insight.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'

const openFilterId = ref(null)
const activeMenuId = ref('requests')

const selectedFilters = reactive({
  team: [],
  status: [],
  priority: [],
})

const filterSearch = reactive({
  team: '',
  status: '',
  priority: '',
})

const filterControls = [
  {
    id: 'team',
    label: '부서',
    options: ['개발팀', '인사팀', '영업팀', '법무팀', '고객지원'],
  },
  {
    id: 'status',
    label: '상태',
    options: ['진행중', '완료', '검토중', '대기'],
  },
  {
    id: 'priority',
    label: '우선순위',
    options: ['높음', '보통', '낮음'],
  },
]

const dashboardMenus = [
  {
    id: 'requests',
    icon: 'lucide:list-checks',
    title: '요청 현황',
    caption: '필터와 테이블',
    description: '전체 요청을 필터링하고 상태별 처리 흐름을 확인합니다.',
  },
  {
    id: 'teams',
    icon: 'lucide:users',
    title: '팀별 보기',
    caption: '부서별 업무량',
    description: '부서별 요청 분포와 반복되는 업무 유형을 비교합니다.',
  },
  {
    id: 'priority',
    icon: 'lucide:flag',
    title: '우선순위',
    caption: '중요 요청 추적',
    description: '높은 우선순위 요청을 먼저 살펴보고 처리 병목을 줄입니다.',
  },
  {
    id: 'automation',
    icon: 'lucide:sparkles',
    title: '자동화 후보',
    caption: '반복 작업 탐색',
    description: '자주 반복되는 요청을 찾아 템플릿이나 자동화 흐름으로 전환합니다.',
  },
  {
    id: 'settings',
    icon: 'lucide:sliders-horizontal',
    title: '표시 설정',
    caption: '화면 구성 조정',
    description: '테이블과 필터 표시 방식을 업무 방식에 맞게 조정합니다.',
  },
]

const activeMenu = computed(() => {
  return dashboardMenus.find((menu) => menu.id === activeMenuId.value) ?? dashboardMenus[0]
})

const teamDistribution = [
  { team: '개발팀', value: 34, color: '#38BDF8' },
  { team: '인사팀', value: 22, color: '#22C55E' },
  { team: '영업팀', value: 18, color: '#F59E0B' },
  { team: '법무팀', value: 14, color: '#A78BFA' },
]

const teamWorkload = [
  { team: '개발팀', value: 14, percent: 88 },
  { team: '인사팀', value: 9, percent: 56 },
  { team: '영업팀', value: 7, percent: 44 },
  { team: '법무팀', value: 5, percent: 31 },
]

const tableColumns = [
  { key: 'title', label: '요청' },
  { key: 'requester', label: '요청자' },
  { key: 'team', label: '부서' },
  { key: 'status', label: '상태' },
  { key: 'priority', label: '우선순위' },
  { key: 'category', label: '분류' },
  { key: 'channel', label: '채널' },
  { key: 'assignee', label: '담당자' },
  { key: 'estimatedTime', label: '예상 시간' },
  { key: 'sla', label: 'SLA' },
  { key: 'createdAt', label: '생성일' },
  { key: 'updatedAt', label: '업데이트', align: 'right' },
]

const tableGridStyle = {
  gridTemplateColumns: 'minmax(320px,2fr) minmax(110px,0.7fr) minmax(110px,0.7fr) minmax(110px,0.7fr) minmax(110px,0.7fr) minmax(130px,0.85fr) minmax(110px,0.7fr) minmax(110px,0.7fr) minmax(110px,0.7fr) minmax(100px,0.65fr) minmax(120px,0.75fr) minmax(140px,0.85fr)',
}

const baseRequests = [
  { id: 1, title: 'Q2 마케팅 회의록 요약', summary: '핵심 결정사항과 액션 아이템 정리', requester: '김지은', team: '영업팀', status: '완료', priority: '보통', category: '문서 요약', channel: 'Web', assignee: 'TC-01', estimatedTime: '12분', sla: '정상', createdAt: '오늘 09:58', updatedAt: '오늘 10:42' },
  { id: 2, title: '신입 온보딩 문서 초안', summary: '첫 출근 안내와 부서별 체크리스트 작성', requester: '박성민', team: '인사팀', status: '진행중', priority: '높음', category: '문서 작성', channel: 'Slack', assignee: 'TC-02', estimatedTime: '28분', sla: '주의', createdAt: '오늘 08:44', updatedAt: '오늘 09:18' },
  { id: 3, title: '계약서 위험 조항 검토', summary: '면책, 위약, 개인정보 조항 우선 검토', requester: '이수연', team: '법무팀', status: '검토중', priority: '높음', category: '리스크 분석', channel: 'Web', assignee: 'TC-03', estimatedTime: '35분', sla: '주의', createdAt: '어제 16:02', updatedAt: '어제 17:35' },
  { id: 4, title: '레거시 API 코드 설명', summary: '인증 모듈 흐름과 오류 처리 경로 정리', requester: '최현우', team: '개발팀', status: '완료', priority: '보통', category: '코드 분석', channel: 'API', assignee: 'TC-01', estimatedTime: '18분', sla: '정상', createdAt: '어제 14:10', updatedAt: '어제 15:04' },
  { id: 5, title: '고객 문의 답변 가이드', summary: '환불 및 계정 복구 문의 응대 문구 정리', requester: '정태준', team: '고객지원', status: '진행중', priority: '보통', category: '응대 가이드', channel: 'Helpdesk', assignee: 'TC-04', estimatedTime: '22분', sla: '정상', createdAt: '4월 15일', updatedAt: '4월 15일' },
  { id: 6, title: '보안 정책 FAQ 정리', summary: '자료 반출과 외부 협업 기준 문답화', requester: '한소영', team: '인사팀', status: '대기', priority: '낮음', category: 'FAQ', channel: 'Web', assignee: '미배정', estimatedTime: '16분', sla: '여유', createdAt: '4월 14일', updatedAt: '4월 14일' },
  { id: 7, title: '영업 제안서 문장 개선', summary: '도입 효과 중심으로 첫 문단 재작성', requester: '김지은', team: '영업팀', status: '완료', priority: '낮음', category: '문장 개선', channel: 'Web', assignee: 'TC-02', estimatedTime: '9분', sla: '정상', createdAt: '4월 13일', updatedAt: '4월 13일' },
  { id: 8, title: '버그 리포트 원인 분류', summary: '로그 기반으로 재현 조건과 원인 후보 분리', requester: '최현우', team: '개발팀', status: '검토중', priority: '높음', category: '이슈 분석', channel: 'API', assignee: 'TC-03', estimatedTime: '31분', sla: '주의', createdAt: '4월 12일', updatedAt: '4월 12일' },
]

const requestVariants = [
  { title: '월간 영업 실적 보고서 정리', summary: '지역별 매출 변화와 주요 코멘트 요약', category: '보고서 정리', team: '영업팀', requester: '오하윤', channel: 'Web' },
  { title: '채용 면접 질문 리스트 작성', summary: '직무 역량과 협업 경험 중심 질문 구성', category: '채용 지원', team: '인사팀', requester: '서민재', channel: 'Slack' },
  { title: '개인정보 처리 위탁 조항 검토', summary: '수탁사 책임 범위와 고지 문구 점검', category: '계약 검토', team: '법무팀', requester: '윤서진', channel: 'Web' },
  { title: '배포 오류 로그 요약', summary: '실패 지점과 재시도 가능 조건 분류', category: '장애 분석', team: '개발팀', requester: '강도윤', channel: 'API' },
  { title: '고객 불만 유형 분류', summary: '반복 문의 유형과 우선 처리 기준 정리', category: '문의 분석', team: '고객지원', requester: '문채원', channel: 'Helpdesk' },
  { title: '사내 보안 교육 자료 초안', summary: '임직원 대상 보안 수칙과 사례 작성', category: '교육 자료', team: '인사팀', requester: '한유진', channel: 'Web' },
  { title: '제안서 경쟁사 비교표 작성', summary: '기능, 비용, 보안 기준 비교 항목 구성', category: '시장 분석', team: '영업팀', requester: '배준호', channel: 'Web' },
  { title: 'API 명세 변경점 요약', summary: '신규 필드와 호환성 영향 범위 정리', category: '기술 문서', team: '개발팀', requester: '정우빈', channel: 'API' },
  { title: '환불 정책 안내 문구 개선', summary: '고객 안내용 문장을 명확하고 부드럽게 수정', category: '응대 문구', team: '고객지원', requester: '이도아', channel: 'Helpdesk' },
]

const statuses = ['진행중', '완료', '검토중', '대기']
const priorities = ['높음', '보통', '낮음']
const assignees = ['TC-01', 'TC-02', 'TC-03', 'TC-04', '미배정']
const slaLabels = ['정상', '주의', '여유']

const generatedRequests = Array.from({ length: 28 }, (_, index) => {
  const variant = requestVariants[index % requestVariants.length]
  const id = baseRequests.length + index + 1
  const status = statuses[index % statuses.length]
  const priority = priorities[(index + 1) % priorities.length]

  return {
    id,
    title: variant.title,
    summary: variant.summary,
    requester: variant.requester,
    team: variant.team,
    status,
    priority,
    category: variant.category,
    channel: variant.channel,
    assignee: assignees[index % assignees.length],
    estimatedTime: `${10 + ((index * 7) % 31)}분`,
    sla: slaLabels[index % slaLabels.length],
    createdAt: `4월 ${11 - (index % 7)}일`,
    updatedAt: `4월 ${12 - (index % 7)}일`,
  }
})

const requests = [...baseRequests, ...generatedRequests]

const activeFilters = computed(() => {
  return filterControls.flatMap((filter) => {
    return selectedFilters[filter.id].map((value) => ({
      id: filter.id,
      label: filter.label,
      value,
    }))
  })
})

const filteredRequests = computed(() => {
  return requests.filter((request) => {
    return filterControls.every((filter) => {
      const selectedValues = selectedFilters[filter.id]
      return !selectedValues.length || selectedValues.includes(request[filter.id])
    })
  })
})

const metrics = computed(() => [
  { label: '전체 요청', value: requests.length },
  { label: '진행중', value: requests.filter((request) => request.status === '진행중').length },
  { label: '높은 우선순위', value: requests.filter((request) => request.priority === '높음').length },
])

const insights = [
  {
    icon: 'lucide:activity',
    title: '요청 흐름',
    description: '최근 요청은 인사팀과 개발팀에 집중되어 있습니다. 반복되는 문서 작업은 템플릿화하면 더 빠르게 처리할 수 있습니다.',
  },
  {
    icon: 'lucide:shield-check',
    title: '보안 검토',
    description: '법무팀과 보안 관련 요청은 검토중 상태가 많습니다. 승인 기준을 칩 필터로 분리하면 병목을 쉽게 찾을 수 있습니다.',
  },
  {
    icon: 'lucide:timer',
    title: '응답 속도',
    description: '완료된 요청 대부분은 당일 처리되었습니다. 높은 우선순위 항목은 별도 알림으로 연결하기 좋은 후보입니다.',
  },
]

function toggleFilterPanel(filterId) {
  openFilterId.value = openFilterId.value === filterId ? null : filterId
}

function filteredOptions(filter) {
  const keyword = filterSearch[filter.id].trim().toLowerCase()
  if (!keyword) return filter.options

  return filter.options.filter((option) => option.toLowerCase().includes(keyword))
}

function isSelected(filterId, value) {
  return selectedFilters[filterId].includes(value)
}

function toggleFilterValue(filterId, value) {
  const values = selectedFilters[filterId]
  const index = values.indexOf(value)

  if (index >= 0) {
    values.splice(index, 1)
    return
  }

  values.push(value)
}

function filterButtonLabel(filter) {
  const values = selectedFilters[filter.id]
  if (!values.length) return `${filter.label} 전체`
  if (values.length === 1) return values[0]
  return `${values[0]} 외 ${values.length - 1}개`
}

function removeFilter(filterId, value) {
  const values = selectedFilters[filterId]
  const index = values.indexOf(value)

  if (index >= 0) {
    values.splice(index, 1)
  }
}

function clearFilterGroup(filterId) {
  selectedFilters[filterId].splice(0)
  filterSearch[filterId] = ''
}

function clearFilters() {
  Object.keys(selectedFilters).forEach((key) => {
    selectedFilters[key].splice(0)
    filterSearch[key] = ''
  })
}

function escapeCsvValue(value) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

function downloadCsv() {
  const header = tableColumns.map((column) => escapeCsvValue(column.label)).join(',')
  const rows = filteredRequests.value.map((request) => {
    return tableColumns.map((column) => escapeCsvValue(request[column.key])).join(',')
  })
  const csv = '\uFEFF' + [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `tc-dashboard-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function statusClass(status) {
  const classes = {
    완료: 'bg-emerald-400/10 text-emerald-300',
    진행중: 'bg-accent/10 text-[#8BD8FF]',
    검토중: 'bg-amber-400/10 text-amber-300',
    대기: 'bg-white/[0.06] text-[#AEB6C6]',
  }

  return classes[status]
}

function priorityClass(priority) {
  const classes = {
    높음: 'bg-rose-400/10 text-rose-300',
    보통: 'bg-white/[0.06] text-[#C4C9D4]',
    낮음: 'bg-slate-400/10 text-slate-300',
  }

  return classes[priority]
}
</script>

<style scoped>
.chip-enter-active,
.chip-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.chip-enter-from,
.chip-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.dashboard-panel-enter-active,
.dashboard-panel-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.dashboard-panel-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.dashboard-panel-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.dashboard-card {
  animation: dashboardCardIn 0.22s ease both;
}

.dashboard-card:nth-child(2) {
  animation-delay: 0.04s;
}

.dashboard-card:nth-child(3) {
  animation-delay: 0.08s;
}

@keyframes dashboardCardIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
