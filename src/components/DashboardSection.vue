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
            TC 정보를 한눈에<br />확인하는 대시보드
          </h1>
          <p class="mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#9CA3B0]">
            설비별 TC 상태와 파라미터, CEID 매핑 정보를 빠르게 확인합니다.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
          <div v-for="metric in metrics" :key="metric.label" class="min-w-[96px]">
            <div class="text-2xl font-bold tabular-nums text-white">{{ metric.value }}</div>
            <div class="mt-1 text-[11px] text-[#7D8594]">{{ metric.label }}</div>
          </div>
        </div>
      </header>

      <div>
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
                    <div class="h-24 w-24 flex-shrink-0 rounded-full" style="background: conic-gradient(#38BDF8 0 34%, #22C55E 34% 56%, #F59E0B 56% 74%, #A78BFA 74% 88%, rgba(255,255,255,0.14) 88% 100%)" />
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
                  <div v-for="filter in activeFilterControls" :key="filter.id" class="relative min-w-[200px]">
                    <span class="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#7D8594]">
                      {{ filter.label }}
                      <span v-if="filter.tooltip" class="group/tooltip relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-accent/35 bg-accent/10 text-accent transition-colors hover:border-accent/60 hover:bg-accent/15">
                        <Icon icon="lucide:info" class="h-3.5 w-3.5" />
                        <span class="pointer-events-none absolute bottom-7 left-1/2 z-[90] w-64 -translate-x-1/2 translate-y-1 rounded-lg border border-accent/50 bg-[#020617] p-3 text-left opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.55),0_0_28px_rgba(14,165,233,0.24)] ring-1 ring-white/[0.06] transition-all duration-150 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100">
                          <span class="mb-1 block text-[11px] font-bold uppercase tracking-widest text-accent">{{ filter.label }}</span>
                          <span class="block text-[12px] font-medium leading-relaxed text-[#D7DEE9]">{{ filter.tooltip }}</span>
                          <span class="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-accent/50 bg-[#020617]"></span>
                        </span>
                      </span>
                    </span>
                    <button type="button" class="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2.5 text-left text-sm text-white outline-none transition-colors hover:bg-white/[0.04]" @click="toggleFilterPanel(filter.id)">
                      <span class="truncate" :class="selectedFilters[filter.id].length ? 'text-white' : 'text-[#7D8594]'">{{ filterButtonLabel(filter) }}</span>
                      <Icon icon="lucide:chevron-down" class="h-4 w-4 flex-shrink-0 text-[#7D8594] transition-transform" :class="openFilterId === filter.id ? 'rotate-180' : ''" />
                    </button>

                    <div v-if="openFilterId === filter.id" class="absolute left-0 top-[72px] z-30 w-full rounded-lg border border-white/[0.08] bg-[#111118] p-2 shadow-xl shadow-black/30">
                      <div class="relative mb-2">
                        <Icon icon="lucide:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                        <input v-model="filterSearch[filter.id]" type="text" class="w-full rounded-md border border-white/[0.08] bg-white/[0.04] py-2 pl-9 pr-3 text-[13px] text-white placeholder-[#6B7280] outline-none transition-colors focus:border-accent/50" :placeholder="`${filter.label} 검색`" />
                      </div>

                      <div class="max-h-48 space-y-1 overflow-y-auto">
                        <button v-for="option in filteredOptions(filter)" :key="option" type="button" class="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.05]" :class="isSelected(filter.id, option) ? 'text-white' : 'text-[#AEB6C6]'" @click="toggleFilterValue(filter.id, option)">
                          <span class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors" :class="isSelected(filter.id, option) ? 'border-accent bg-accent text-white' : 'border-white/[0.14] bg-white/[0.03]'">
                            <Icon v-if="isSelected(filter.id, option)" icon="lucide:check" class="h-3 w-3" />
                          </span>
                          <span class="truncate">{{ option }}</span>
                        </button>

                        <div v-if="!filteredOptions(filter).length" class="px-2.5 py-4 text-center text-[12px] text-[#7D8594]">검색 결과가 없습니다</div>
                      </div>

                      <div class="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2">
                        <button type="button" class="text-[12px] font-semibold text-[#8B94A5] transition-colors hover:text-white" @click="clearFilterGroup(filter.id)">선택 해제</button>
                        <span class="text-[11px] text-[#6B7280]">{{ selectedFilters[filter.id].length }}개 선택</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-[12px] text-[#8B94A5]">
                  <Icon icon="lucide:filter" class="h-4 w-4" />
                  <span>{{ filteredRequests.length }}개 항목 중 {{ pageStart }}-{{ pageEnd }} 표시</span>
                </div>
              </div>
            </div>
          </Transition>

          <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <TransitionGroup v-if="activeFilters.length" name="chip" tag="div" class="flex flex-wrap items-center gap-2">
              <div v-for="filter in activeFilters" :key="`${filter.id}-${filter.value}`" class="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[12px] text-[#D7F3FF]">
                <span class="text-accent/80">{{ filter.label }}:</span>
                <span class="font-semibold">{{ filter.value }}</span>
                <button type="button" class="rounded-full p-0.5 text-[#8BD8FF] transition-colors hover:bg-white/10 hover:text-white" :aria-label="`${filter.label} ${filter.value} 필터 제거`" @click="removeFilter(filter.id, filter.value)">
                  <Icon icon="lucide:x" class="h-3.5 w-3.5" />
                </button>
              </div>
              <button key="clear-all" type="button" class="px-2 py-1 text-[12px] font-semibold text-[#8B94A5] transition-colors hover:text-white" @click="clearFilters">전체 해제</button>
            </TransitionGroup>

            <div class="ml-auto flex flex-wrap items-center justify-end gap-2">
              <span v-if="hasPendingFilters" class="text-[12px] font-semibold text-amber-300">변경된 필터가 있습니다</span>
              <button type="button" class="rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-[12px] font-semibold text-accent transition-colors hover:border-accent/60 hover:bg-accent/15" @click="applyFilters">
                조회
              </button>
              <button type="button" class="app-cta app-cta--sm" @click="downloadCsv">
                <span class="app-cta__glow"></span>
                <span class="app-cta__content">
                  <Icon icon="lucide:download" class="h-4 w-4" />
                  CSV 다운로드
                </span>
              </button>
            </div>
          </div>

          <div class="w-full overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div class="overflow-auto" :class="filteredRequests.length >= 30 ? 'max-h-[640px]' : ''">
              <div class="grid min-w-[1640px] gap-4 border-b border-white/[0.08] bg-white/[0.04] px-5 py-3 text-[12px] font-semibold text-[#8B94A5]" :style="activeTableGridStyle">
                <div v-for="column in activeTableColumns" :key="column.key" :class="[column.align === 'right' ? 'text-right' : '', column.sticky ? 'sticky left-0 z-20 -ml-5 pl-5 pr-4' : '']">
                  <button type="button" class="inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-white/[0.06] hover:text-white" :class="column.align === 'right' ? 'ml-auto' : ''" @click="toggleSort(column.key)">
                    <span class="truncate">{{ column.label }}</span>
                    <Icon v-if="sortBy === column.key && sortOrder === 'asc'" icon="lucide:arrow-up" class="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                    <Icon v-else-if="sortBy === column.key && sortOrder === 'desc'" icon="lucide:arrow-down" class="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                    <Icon v-else icon="lucide:arrow-up-down" class="h-3.5 w-3.5 flex-shrink-0 text-[#5F6878]" />
                  </button>
                </div>
              </div>

              <div v-if="filteredRequests.length" class="min-w-[1640px] divide-y divide-white/[0.06]">
                <article v-for="request in paginatedRequests" :key="request.id" class="grid gap-4 px-5 py-4 transition-colors hover:bg-white/[0.035]" :style="activeTableGridStyle">
                  <div v-for="column in activeTableColumns" :key="column.key" class="flex min-w-0 items-center text-sm" :class="[column.align === 'right' ? 'justify-end text-right' : '', column.sticky ? 'sticky left-0 z-10 -ml-5 pl-5 pr-4' : '']">
                    <template v-if="column.sticky">
                      <div class="group/cell flex min-h-[48px] min-w-0 items-center gap-2">
                        <div class="truncate font-semibold text-white">{{ request[column.key] }}</div>
                        <button type="button" class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-[#8B94A5] opacity-0 transition-all hover:border-accent/40 hover:text-accent group-hover/cell:opacity-100" :aria-label="`${column.label} 복사`" @click="copyCell(request[column.key], request.id, column.key)">
                          <Icon :icon="copiedCellKey === `${request.id}-${column.key}` ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </template>
                    <template v-else-if="column.key === 'status'">
                      <span class="rounded-full px-2.5 py-1 text-[12px] font-semibold" :class="statusClass(request.status)">{{ request.status }}</span>
                    </template>
                    <template v-else>
                      <div class="group/cell flex min-w-0 items-center gap-2" :class="column.align === 'right' ? 'justify-end' : ''">
                        <span class="truncate text-[#C4C9D4]">{{ request[column.key] }}</span>
                        <button type="button" class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-[#8B94A5] opacity-0 transition-all hover:border-accent/40 hover:text-accent group-hover/cell:opacity-100" :aria-label="`${column.label} 복사`" @click="copyCell(request[column.key], request.id, column.key)">
                          <Icon :icon="copiedCellKey === `${request.id}-${column.key}` ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </template>
                  </div>
                </article>
              </div>

              <div v-else class="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                  <Icon icon="lucide:search-x" class="h-5 w-5 text-[#8B94A5]" />
                </div>
                <h2 class="text-lg font-semibold text-white">조건에 맞는 항목이 없습니다</h2>
                <p class="mt-2 text-sm text-[#8B94A5]">필터를 줄이거나 전체 해제를 눌러 다시 확인해보세요.</p>
              </div>
            </div>
          </div>

          <div v-if="filteredRequests.length" class="mt-4 flex flex-col gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap items-center gap-3 text-[12px] text-[#8B94A5]">
              <span>총 <strong class="font-semibold text-white">{{ filteredRequests.length }}</strong>건</span>
              <span>{{ currentPage }} / {{ totalPages }} 페이지</span>
              <label class="flex items-center gap-2">
                <span>페이지당</span>
                <select v-model.number="pageSize" class="rounded-md border border-white/[0.08] bg-[#0D0D14] px-2.5 py-1.5 text-[12px] font-semibold text-white outline-none transition-colors focus:border-accent/50">
                  <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
                </select>
                <span>건</span>
              </label>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button type="button" class="rounded-md border border-white/[0.08] bg-[#0D0D14] px-3 py-2 text-[12px] font-semibold text-[#C4C9D4] transition-colors hover:border-accent/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
                이전
              </button>
              <button v-for="page in visiblePages" :key="page" type="button" class="h-8 min-w-8 rounded-md border px-2 text-[12px] font-semibold transition-colors" :class="page === currentPage ? 'border-accent bg-accent text-white' : 'border-white/[0.08] bg-[#0D0D14] text-[#C4C9D4] hover:border-accent/30 hover:text-white'" @click="goToPage(page)">
                {{ page }}
              </button>
              <button type="button" class="rounded-md border border-white/[0.08] bg-[#0D0D14] px-3 py-2 text-[12px] font-semibold text-[#C4C9D4] transition-colors hover:border-accent/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
                다음
              </button>
            </div>
          </div>

          <div class="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
            <article v-for="insight in insights" :key="insight.title" class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
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
import { computed, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  dashboardMenu: {
    type: String,
    default: 'requests',
  },
})

const openFilterId = ref(null)
const activeMenuId = ref(props.dashboardMenu)
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 20, 50]
const sortBy = ref('')
const sortOrder = ref('asc')
const copiedCellKey = ref('')

watch(
  () => props.dashboardMenu,
  (menuId) => {
    if (dashboardMenus.some((menu) => menu.id === menuId)) {
      activeMenuId.value = menuId
      openFilterId.value = null
      currentPage.value = 1
      syncDashboardUrl()
    }
  },
)

const selectedFilters = reactive({
  lineId: [],
  eqpId: [],
  serverModel: [],
  dcopModel: [],
  ceId: [],
  rpt: [],
})

const appliedFilters = reactive({
  lineId: [],
  eqpId: [],
  serverModel: [],
  dcopModel: [],
  ceId: [],
  rpt: [],
})

const filterSearch = reactive({
  lineId: '',
  eqpId: '',
  serverModel: '',
  dcopModel: '',
  ceId: '',
  rpt: '',
})

const filterControls = [
  { id: 'lineId', label: 'LINEID', options: ['LINE-01', 'LINE-02', 'LINE-03', 'LINE-04'] },
  { id: 'eqpId', label: 'EQPID', options: ['ABC123', 'DEF456', 'GHI789', 'JKL234', 'MNO567'] },
  {
    id: 'serverModel',
    label: 'SERVER MODEL',
    options: ['SRV-A100', 'SRV-B200', 'SRV-C300', 'SRV-X900'],
    tooltip: '설비 TC를 구동하는 서버 하드웨어 또는 서버 프로파일 모델입니다.',
  },
  {
    id: 'dcopModel',
    label: 'DCOP MODEL',
    options: ['DCOP-7A', 'DCOP-8B', 'DCOP-9C', 'DCOP-X1'],
    tooltip: '설비와 TC 사이의 데이터 수집/제어 연동에 사용하는 DCOP 모델입니다.',
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
    id: 'automation',
    icon: 'lucide:sparkles',
    title: '설비 TC 파라미터',
    caption: 'TC 파라미터 관리',
    description: '설비별 TC 파라미터 후보와 반복 점검 기준을 확인합니다.',
  },
  {
    id: 'priority',
    icon: 'lucide:flag',
    title: 'CEID 매핑',
    caption: 'RPTID / VID LIST',
    description: 'EQP_ID, CEID, RPT 기준으로 RPT_ORDER와 VID_LIST 매핑을 확인합니다.',
  },
  {
    id: 'teams',
    icon: 'lucide:users',
    title: 'LINE별 보기',
    caption: '설비 분포',
    description: 'LINE별 설비 분포와 TC 운영 상태를 비교합니다.',
  },
  {
    id: 'settings',
    icon: 'lucide:sliders-horizontal',
    title: '표시 설정',
    caption: '화면 구성 조정',
    description: '테이블과 필터 표시 방식을 업무 방식에 맞게 조정합니다.',
  },
]

const activeMenu = computed(() => dashboardMenus.find((menu) => menu.id === activeMenuId.value) ?? dashboardMenus[0])

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
  { key: 'eqpId', label: 'EQPID', sticky: true },
  { key: 'lineId', label: 'LINEID' },
  { key: 'serverModel', label: 'SERVER MODEL' },
  { key: 'dcopModel', label: 'DCOP MODEL' },
  { key: 'tcVersion', label: 'TC VERSION' },
  { key: 'status', label: '상태' },
  { key: 'lastSync', label: '최근 동기화' },
  { key: 'owner', label: '담당자' },
  { key: 'updatedAt', label: '업데이트', align: 'right' },
]

const tableGridStyle = {
  gridTemplateColumns: 'minmax(132px,0.55fr) minmax(110px,0.7fr) minmax(150px,0.9fr) minmax(150px,0.9fr) minmax(120px,0.75fr) minmax(110px,0.7fr) minmax(140px,0.85fr) minmax(110px,0.7fr) minmax(140px,0.85fr)',
}

const ceFilterControls = [
  { id: 'eqpId', label: 'eqp_id', options: ['ABC123', 'DEF456', 'GHI789', 'JKL234'] },
  { id: 'ceId', label: 'ceid', options: ['1231', '1232', '1233', '1234'] },
  { id: 'rpt', label: 'rpt', options: ['10', '20', '30'] },
]

const ceTableColumns = [
  { key: 'eqpId', label: 'eqp_id', sticky: true },
  { key: 'ceId', label: 'ceid' },
  { key: 'rpt', label: 'rpt', align: 'right' },
  { key: 'rptOrder', label: 'rpt_order', align: 'right' },
  { key: 'vidList', label: 'vid_list' },
]

const ceTableGridStyle = {
  gridTemplateColumns: 'minmax(130px,0.65fr) minmax(120px,0.6fr) minmax(100px,0.45fr) minmax(120px,0.55fr) minmax(520px,2fr)',
}

const baseRequests = [
  { id: 1, lineId: 'LINE-01', eqpId: 'ABC123', serverModel: 'SRV-A100', dcopModel: 'DCOP-7A', tcVersion: 'TC 4.2.1', status: '정상', lastSync: '오늘 10:42', owner: 'JG', updatedAt: '오늘 10:42' },
  { id: 2, lineId: 'LINE-01', eqpId: 'DEF456', serverModel: 'SRV-B200', dcopModel: 'DCOP-8B', tcVersion: 'TC 4.1.8', status: '주의', lastSync: '오늘 09:18', owner: 'TC-02', updatedAt: '오늘 09:18' },
  { id: 3, lineId: 'LINE-02', eqpId: 'GHI789', serverModel: 'SRV-C300', dcopModel: 'DCOP-9C', tcVersion: 'TC 4.2.0', status: '점검중', lastSync: '어제 17:35', owner: 'TC-03', updatedAt: '어제 17:35' },
  { id: 4, lineId: 'LINE-03', eqpId: 'JKL234', serverModel: 'SRV-X900', dcopModel: 'DCOP-X1', tcVersion: 'TC 4.0.9', status: '정상', lastSync: '어제 15:04', owner: 'TC-01', updatedAt: '어제 15:04' },
  { id: 5, lineId: 'LINE-04', eqpId: 'MNO567', serverModel: 'SRV-A100', dcopModel: 'DCOP-8B', tcVersion: 'TC 4.2.1', status: '지연', lastSync: '4월 15일', owner: 'TC-04', updatedAt: '4월 15일' },
]

const requestVariants = [
  { lineId: 'LINE-01', eqpId: 'ABC123', serverModel: 'SRV-A100', dcopModel: 'DCOP-7A' },
  { lineId: 'LINE-01', eqpId: 'DEF456', serverModel: 'SRV-B200', dcopModel: 'DCOP-8B' },
  { lineId: 'LINE-02', eqpId: 'GHI789', serverModel: 'SRV-C300', dcopModel: 'DCOP-9C' },
  { lineId: 'LINE-03', eqpId: 'JKL234', serverModel: 'SRV-X900', dcopModel: 'DCOP-X1' },
  { lineId: 'LINE-04', eqpId: 'MNO567', serverModel: 'SRV-A100', dcopModel: 'DCOP-8B' },
  { lineId: 'LINE-02', eqpId: 'DEF456', serverModel: 'SRV-B200', dcopModel: 'DCOP-7A' },
  { lineId: 'LINE-03', eqpId: 'GHI789', serverModel: 'SRV-C300', dcopModel: 'DCOP-X1' },
  { lineId: 'LINE-04', eqpId: 'JKL234', serverModel: 'SRV-X900', dcopModel: 'DCOP-9C' },
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

const ceRequests = [
  { id: 'ce-0', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 0, vidList: '101,205,309,412,518' },
  { id: 'ce-1', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 1, vidList: '102,206,310,413,519' },
  { id: 'ce-2', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 2, vidList: '103,207,311,414,520' },
  { id: 'ce-3', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 3, vidList: '104,208,312,415,521' },
  { id: 'ce-4', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 4, vidList: '105,209,313,416,522' },
  { id: 'ce-5', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 5, vidList: '106,210,314,417,523' },
  { id: 'ce-6', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 6, vidList: '107,211,315,418,524' },
  { id: 'ce-7', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 7, vidList: '108,212,316,419,525' },
  { id: 'ce-8', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 8, vidList: '109,213,317,420,526' },
  { id: 'ce-9', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 9, vidList: '110,214,318,421,527' },
  { id: 'ce-10', eqpId: 'ABC123', ceId: '1231', rpt: 10, rptOrder: 10, vidList: '111,215,319,422,528' },
  { id: 'ce-11', eqpId: 'DEF456', ceId: '1232', rpt: 20, rptOrder: 0, vidList: '201,305,409,512,618' },
  { id: 'ce-12', eqpId: 'GHI789', ceId: '1233', rpt: 30, rptOrder: 1, vidList: '301,405,509,612,718' },
]

const activeFilterControls = computed(() => (activeMenuId.value === 'priority' ? ceFilterControls : filterControls))
const activeTableColumns = computed(() => (activeMenuId.value === 'priority' ? ceTableColumns : tableColumns))
const activeTableGridStyle = computed(() => (activeMenuId.value === 'priority' ? ceTableGridStyle : tableGridStyle))
const activeRequests = computed(() => (activeMenuId.value === 'priority' ? ceRequests : requests))

const activeFilters = computed(() => activeFilterControls.value.flatMap((filter) => {
  return selectedFilters[filter.id].map((value) => ({ id: filter.id, label: filter.label, value }))
}))

const hasPendingFilters = computed(() => {
  return Object.keys(selectedFilters).some((key) => {
    return selectedFilters[key].join('|') !== appliedFilters[key].join('|')
  })
})

const filteredRequests = computed(() => {
  return activeRequests.value.filter((request) => {
    return activeFilterControls.value.every((filter) => {
      const selectedValues = appliedFilters[filter.id]
      return !selectedValues.length || selectedValues.includes(String(request[filter.id]))
    })
  })
})

const sortedRequests = computed(() => {
  if (!sortBy.value) return filteredRequests.value

  return [...filteredRequests.value].sort((left, right) => {
    const leftValue = left[sortBy.value]
    const rightValue = right[sortBy.value]
    const direction = sortOrder.value === 'asc' ? 1 : -1

    if (leftValue == null && rightValue == null) return 0
    if (leftValue == null) return -1 * direction
    if (rightValue == null) return 1 * direction

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return (leftValue - rightValue) * direction
    }

    return String(leftValue).localeCompare(String(rightValue), 'ko', { numeric: true }) * direction
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRequests.value.length / pageSize.value)))

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedRequests.value.slice(start, start + pageSize.value)
})

const pageStart = computed(() => {
  if (!filteredRequests.value.length) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const pageEnd = computed(() => Math.min(currentPage.value * pageSize.value, filteredRequests.value.length))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

watch([filteredRequests, pageSize], () => {
  currentPage.value = 1
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

watch([activeMenuId, currentPage, pageSize, sortBy, sortOrder], syncDashboardUrl)

const metrics = computed(() => [
  activeMenuId.value === 'priority'
    ? { label: '전체 CEID', value: ceRequests.length }
    : { label: '전체 설비', value: requests.length },
  activeMenuId.value === 'priority'
    ? { label: 'RPT 10', value: ceRequests.filter((request) => request.rpt === 10).length }
    : { label: '정상', value: requests.filter((request) => request.status === '정상').length },
  activeMenuId.value === 'priority'
    ? { label: 'EQP 수', value: new Set(ceRequests.map((request) => request.eqpId)).size }
    : { label: '점검 필요', value: requests.filter((request) => request.status !== '정상').length },
])

const insights = [
  {
    icon: 'lucide:activity',
    title: 'TC 동기화',
    description: '최근 동기화 지연 설비를 LINEID와 EQPID 기준으로 빠르게 확인할 수 있습니다.',
  },
  {
    icon: 'lucide:server',
    title: '모델 매핑',
    description: 'SERVER MODEL과 DCOP MODEL 조합을 필터링해 설비별 TC 호환 상태를 점검합니다.',
  },
  {
    icon: 'lucide:timer',
    title: '운영 우선순위',
    description: '주의, 점검중, 지연 상태 설비를 우선 확인해 로그 다운로드와 원인 분석으로 연결합니다.',
  },
]

restoreDashboardFromUrl()

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
    appliedFilters[key].splice(0)
    filterSearch[key] = ''
  })
  currentPage.value = 1
  syncDashboardUrl()
}

function applyFilters() {
  Object.keys(selectedFilters).forEach((key) => {
    appliedFilters[key].splice(0, appliedFilters[key].length, ...selectedFilters[key])
  })
  currentPage.value = 1
  openFilterId.value = null
  syncDashboardUrl()
}

function goToPage(page) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

function toggleSort(columnKey) {
  if (sortBy.value !== columnKey) {
    sortBy.value = columnKey
    sortOrder.value = 'asc'
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
  } else {
    sortBy.value = ''
    sortOrder.value = 'asc'
  }

  currentPage.value = 1
  syncDashboardUrl()
}

async function copyCell(value, rowId, columnKey) {
  const text = String(value ?? '')

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const input = document.createElement('textarea')
      input.value = text
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }

    copiedCellKey.value = `${rowId}-${columnKey}`
    window.setTimeout(() => {
      if (copiedCellKey.value === `${rowId}-${columnKey}`) {
        copiedCellKey.value = ''
      }
    }, 1400)
  } catch {
    copiedCellKey.value = ''
  }
}

function restoreDashboardFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const menu = params.get('menu')
  const restoredPage = Number(params.get('table_page'))
  const restoredPageSize = Number(params.get('page_size'))
  const restoredSortBy = params.get('sort_by')
  const restoredSortOrder = params.get('sort_order')

  if (menu && dashboardMenus.some((item) => item.id === menu)) {
    activeMenuId.value = menu
  }

  if (pageSizeOptions.includes(restoredPageSize)) {
    pageSize.value = restoredPageSize
  }

  if (Number.isInteger(restoredPage) && restoredPage > 0) {
    currentPage.value = restoredPage
  }

  if (restoredSortBy && activeTableColumns.value.some((column) => column.key === restoredSortBy)) {
    sortBy.value = restoredSortBy
    sortOrder.value = restoredSortOrder === 'desc' ? 'desc' : 'asc'
  }

  Object.keys(selectedFilters).forEach((key) => {
    const value = params.get(`filter_${key}`)
    if (!value) return

    const values = value.split(',').map((item) => item.trim()).filter(Boolean)
    selectedFilters[key].splice(0, selectedFilters[key].length, ...values)
    appliedFilters[key].splice(0, appliedFilters[key].length, ...values)
  })
}

function syncDashboardUrl() {
  const params = new URLSearchParams(window.location.search)

  params.set('page', 'dashboard')
  params.set('menu', activeMenuId.value)
  params.set('table_page', String(currentPage.value))
  params.set('page_size', String(pageSize.value))

  if (sortBy.value) {
    params.set('sort_by', sortBy.value)
    params.set('sort_order', sortOrder.value)
  } else {
    params.delete('sort_by')
    params.delete('sort_order')
  }

  Object.keys(appliedFilters).forEach((key) => {
    if (appliedFilters[key].length) {
      params.set(`filter_${key}`, appliedFilters[key].join(','))
    } else {
      params.delete(`filter_${key}`)
    }
  })

  const query = params.toString()
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
}

function escapeCsvValue(value) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

function downloadCsv() {
  const header = activeTableColumns.value.map((column) => escapeCsvValue(column.label)).join(',')
  const rows = filteredRequests.value.map((request) => activeTableColumns.value.map((column) => escapeCsvValue(request[column.key])).join(','))
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
