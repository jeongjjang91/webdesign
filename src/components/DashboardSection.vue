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
                      <p class="text-[12px] font-semibold text-[#8B94A5]">LINE별 TC 추이</p>
                      <p class="mt-1 text-2xl font-bold tabular-nums text-white">42건</p>
                    </div>
                    <Icon icon="lucide:line-chart" class="h-5 w-5 text-accent" />
                  </div>
                  <div class="h-40 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                    <svg viewBox="0 0 260 120" class="h-full w-full" role="img" aria-label="LINE별 TC 추이 차트">
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
                      <p class="text-[12px] font-semibold text-[#8B94A5]">MODEL별 비중</p>
                      <p class="mt-1 text-2xl font-bold tabular-nums text-white">4종</p>
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
                      <p class="text-[12px] font-semibold text-[#8B94A5]">LINE별 설비 수</p>
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
                  <span>{{ filteredRequests.length }}개 설비 표시 중</span>
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
            <div class="overflow-auto" :class="filteredRequests.length >= 30 ? 'max-h-[640px]' : ''">
              <div class="grid min-w-[1640px] gap-4 border-b border-white/[0.08] bg-white/[0.04] px-5 py-3 text-[12px] font-semibold text-[#8B94A5]" :style="tableGridStyle">
                <div
                  v-for="column in tableColumns"
                  :key="column.key"
                  :class="column.align === 'right' ? 'text-right' : ''"
                >
                  {{ column.label }}
                </div>
              </div>

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
                <h2 class="text-lg font-semibold text-white">조건에 맞는 설비가 없습니다</h2>
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
  lineId: [],
  eqpId: [],
  serverModel: [],
  dcopModel: [],
})

const filterSearch = reactive({
  lineId: '',
  eqpId: '',
  serverModel: '',
  dcopModel: '',
})

const filterControls = [
  {
    id: 'lineId',
    label: 'LINEID',
    options: ['LINE-01', 'LINE-02', 'LINE-03', 'LINE-04'],
  },
  {
    id: 'eqpId',
    label: 'EQPID',
    options: ['EQP-042', 'EQP-117', 'EQP-203', 'EQP-304', 'EQP-411'],
  },
  {
    id: 'serverModel',
    label: 'SERVER MODEL',
    options: ['SRV-A100', 'SRV-B200', 'SRV-C300', 'SRV-X900'],
  },
  {
    id: 'dcopModel',
    label: 'DCOP MODEL',
    options: ['DCOP-7A', 'DCOP-8B', 'DCOP-9C', 'DCOP-X1'],
  },
]

const dashboardMenus = [
  {
    id: 'requests',
    icon: 'lucide:list-checks',
    title: '설비 TC 현황',
    caption: '필터와 테이블',
    description: 'LINEID, EQPID, SERVER MODEL, DCOP MODEL 기준으로 설비 TC 현황을 확인합니다.',
  },
  {
    id: 'teams',
    icon: 'lucide:users',
    title: 'LINE별 보기',
    caption: '설비 분포',
    description: 'LINE별 설비 분포와 TC 운영 상태를 비교합니다.',
  },
  {
    id: 'priority',
    icon: 'lucide:flag',
    title: '점검 우선순위',
    caption: '주의 설비 추적',
    description: '주의, 점검중, 지연 상태의 설비를 먼저 확인합니다.',
  },
  {
    id: 'automation',
    icon: 'lucide:sparkles',
    title: '자동화 후보',
    caption: '반복 작업 탐색',
    description: '반복되는 TC 점검 패턴을 찾아 자동화 후보로 전환합니다.',
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
  { team: 'SRV-A100', value: 34, color: '#38BDF8' },
  { team: 'SRV-B200', value: 22, color: '#22C55E' },
  { team: 'SRV-C300', value: 18, color: '#F59E0B' },
  { team: 'SRV-X900', value: 14, color: '#A78BFA' },
]

const teamWorkload = [
  { team: 'LINE-01', value: 14, percent: 88 },
  { team: 'LINE-02', value: 9, percent: 56 },
  { team: 'LINE-03', value: 7, percent: 44 },
  { team: 'LINE-04', value: 5, percent: 31 },
]

const tableColumns = [
  { key: 'title', label: '설비' },
  { key: 'lineId', label: 'LINEID' },
  { key: 'eqpId', label: 'EQPID' },
  { key: 'serverModel', label: 'SERVER MODEL' },
  { key: 'dcopModel', label: 'DCOP MODEL' },
  { key: 'tcVersion', label: 'TC VERSION' },
  { key: 'status', label: '상태' },
  { key: 'lastSync', label: '최근 동기화' },
  { key: 'owner', label: '담당자' },
  { key: 'updatedAt', label: '업데이트', align: 'right' },
]

const tableGridStyle = {
  gridTemplateColumns: 'minmax(300px,1.8fr) minmax(110px,0.7fr) minmax(120px,0.75fr) minmax(150px,0.9fr) minmax(150px,0.9fr) minmax(120px,0.75fr) minmax(110px,0.7fr) minmax(140px,0.85fr) minmax(110px,0.7fr) minmax(140px,0.85fr)',
}

const baseRequests = [
  { id: 1, title: 'Main Litho TC', summary: '노광 설비 TC 운영 현황', lineId: 'LINE-01', eqpId: 'EQP-042', serverModel: 'SRV-A100', dcopModel: 'DCOP-7A', tcVersion: 'TC 4.2.1', status: '정상', lastSync: '오늘 10:42', owner: 'JG', updatedAt: '오늘 10:42' },
  { id: 2, title: 'Etch Chamber TC', summary: '식각 챔버 TC 상태 점검', lineId: 'LINE-01', eqpId: 'EQP-117', serverModel: 'SRV-B200', dcopModel: 'DCOP-8B', tcVersion: 'TC 4.1.8', status: '주의', lastSync: '오늘 09:18', owner: 'TC-02', updatedAt: '오늘 09:18' },
  { id: 3, title: 'CMP Process TC', summary: 'CMP 공정 설비 연동 현황', lineId: 'LINE-02', eqpId: 'EQP-203', serverModel: 'SRV-C300', dcopModel: 'DCOP-9C', tcVersion: 'TC 4.2.0', status: '점검중', lastSync: '어제 17:35', owner: 'TC-03', updatedAt: '어제 17:35' },
  { id: 4, title: 'Diffusion TC', summary: '확산 공정 TC 패키지 상태', lineId: 'LINE-03', eqpId: 'EQP-304', serverModel: 'SRV-X900', dcopModel: 'DCOP-X1', tcVersion: 'TC 4.0.9', status: '정상', lastSync: '어제 15:04', owner: 'TC-01', updatedAt: '어제 15:04' },
  { id: 5, title: 'Inspection TC', summary: '검사 설비 데이터 수집 상태', lineId: 'LINE-04', eqpId: 'EQP-411', serverModel: 'SRV-A100', dcopModel: 'DCOP-8B', tcVersion: 'TC 4.2.1', status: '지연', lastSync: '4월 15일', owner: 'TC-04', updatedAt: '4월 15일' },
]

const requestVariants = [
  { title: 'Photo Track TC', summary: 'Photo track 설비 TC 연결 상태', lineId: 'LINE-01', eqpId: 'EQP-042', serverModel: 'SRV-A100', dcopModel: 'DCOP-7A' },
  { title: 'Dry Etch TC', summary: 'Dry etch 설비 로그 수집 상태', lineId: 'LINE-01', eqpId: 'EQP-117', serverModel: 'SRV-B200', dcopModel: 'DCOP-8B' },
  { title: 'Wet Bench TC', summary: 'Wet station TC 패키지 버전 확인', lineId: 'LINE-02', eqpId: 'EQP-203', serverModel: 'SRV-C300', dcopModel: 'DCOP-9C' },
  { title: 'Furnace TC', summary: 'Furnace 설비 서버 모델 매핑', lineId: 'LINE-03', eqpId: 'EQP-304', serverModel: 'SRV-X900', dcopModel: 'DCOP-X1' },
  { title: 'Metrology TC', summary: 'Metrology 설비 DCOP 연동 상태', lineId: 'LINE-04', eqpId: 'EQP-411', serverModel: 'SRV-A100', dcopModel: 'DCOP-8B' },
  { title: 'Sorter TC', summary: 'Sorter 설비 TC 상태 추적', lineId: 'LINE-02', eqpId: 'EQP-117', serverModel: 'SRV-B200', dcopModel: 'DCOP-7A' },
  { title: 'Implant TC', summary: 'Implant 설비 서버 동기화', lineId: 'LINE-03', eqpId: 'EQP-203', serverModel: 'SRV-C300', dcopModel: 'DCOP-X1' },
  { title: 'Clean TC', summary: 'Clean 설비 TC 로그 점검', lineId: 'LINE-04', eqpId: 'EQP-304', serverModel: 'SRV-X900', dcopModel: 'DCOP-9C' },
]

const statuses = ['정상', '주의', '점검중', '지연']
const tcVersions = ['TC 4.2.1', 'TC 4.2.0', 'TC 4.1.8', 'TC 4.0.9']
const assignees = ['JG', 'TC-01', 'TC-02', 'TC-03', 'TC-04']

const generatedRequests = Array.from({ length: 28 }, (_, index) => {
  const variant = requestVariants[index % requestVariants.length]
  const id = baseRequests.length + index + 1
  const status = statuses[index % statuses.length]

  return {
    id,
    title: variant.title,
    summary: variant.summary,
    lineId: variant.lineId,
    eqpId: variant.eqpId,
    serverModel: variant.serverModel,
    dcopModel: variant.dcopModel,
    tcVersion: tcVersions[index % tcVersions.length],
    status,
    lastSync: `4월 ${18 - (index % 7)}일`,
    owner: assignees[index % assignees.length],
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
  { label: '전체 설비', value: requests.length },
  { label: '정상', value: requests.filter((request) => request.status === '정상').length },
  { label: '점검 필요', value: requests.filter((request) => request.status !== '정상').length },
])

const insights = [
  {
    icon: 'lucide:activity',
    title: 'TC 동기화',
    description: '최근 동기화 지연 설비를 LINEID와 EQPID 기준으로 좁혀 빠르게 확인할 수 있습니다.',
  },
  {
    icon: 'lucide:server',
    title: '모델 매핑',
    description: 'SERVER MODEL과 DCOP MODEL 조합을 필터링해 설비별 TC 호환 상태를 점검합니다.',
  },
  {
    icon: 'lucide:timer',
    title: '운영 우선순위',
    description: '주의, 점검중, 지연 상태의 설비를 우선 확인해 로그 다운로드와 원인 분석으로 연결합니다.',
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
    정상: 'bg-emerald-400/10 text-emerald-300',
    주의: 'bg-amber-400/10 text-amber-300',
    점검중: 'bg-accent/10 text-[#8BD8FF]',
    지연: 'bg-rose-400/10 text-rose-300',
  }

  return classes[status]
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
