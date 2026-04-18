<template>
  <section class="min-h-full bg-[#0A0A0F] px-6 py-8 text-white" @click="openComboId = null">
    <div class="mx-auto w-full max-w-7xl">
      <header class="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button
            type="button"
            class="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-sm font-semibold text-[#B8C0CF] transition-colors hover:bg-white/[0.04] hover:text-white"
            @click="emit('navigate', 'features')"
          >
            <Icon icon="lucide:arrow-left" class="h-4 w-4" />
            기능으로 돌아가기
          </button>
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5">
            <Icon icon="lucide:download-cloud" class="h-3.5 w-3.5 text-accent" />
            <span class="text-xs font-semibold text-accent/90">Internal Log Download</span>
          </div>
          <h1 class="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            설비 로그<br />
            Download
          </h1>
          <p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#9CA3B0]">
            LineID, EQPID, 날짜, 로그 유형을 선택해 장애 분석과 VOC 대응에 필요한 로그 패키지를 생성합니다.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
          <div v-for="metric in metrics" :key="metric.label" class="min-w-[100px]">
            <div class="text-2xl font-bold tabular-nums text-white">{{ metric.value }}</div>
            <div class="mt-1 text-[11px] text-[#7D8594]">{{ metric.label }}</div>
          </div>
        </div>
      </header>

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div class="space-y-6">
          <section class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-bold text-white">다운로드 조건</h2>
                <p class="mt-1 text-sm text-[#8B94A5]">필요한 로그 범위를 선택하면 예상 용량과 파일 구성이 계산됩니다.</p>
              </div>
              <span class="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[12px] font-semibold text-emerald-300">
                접근 권한 확인됨
              </span>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <label v-for="field in formFields" :key="field.id" class="block">
                <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">{{ field.label }}</span>
                <div v-if="field.type === 'searchable-select'" class="relative">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2.5 text-left text-sm text-white outline-none transition-colors hover:bg-white/[0.04] focus:border-accent/50"
                    :aria-expanded="openComboId === field.id"
                    @click.stop="toggleCombo(field.id)"
                  >
                    <span class="truncate">{{ downloadForm[field.id] }}</span>
                    <Icon
                      icon="lucide:chevron-down"
                      class="h-4 w-4 flex-shrink-0 text-[#8B94A5] transition-transform"
                      :class="openComboId === field.id ? 'rotate-180' : ''"
                    />
                  </button>
                  <div
                    v-if="openComboId === field.id"
                    class="absolute left-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#111118] p-2 shadow-xl shadow-black/30"
                    @click.stop
                  >
                    <div class="relative mb-2">
                      <Icon icon="lucide:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                      <input
                        v-model="comboSearch[field.id]"
                        type="text"
                        class="w-full rounded-md border border-white/[0.08] bg-white/[0.04] py-2 pl-9 pr-3 text-[13px] text-white placeholder-[#6B7280] outline-none transition-colors focus:border-accent/50"
                        :placeholder="`${field.label} 검색`"
                      />
                    </div>
                    <div class="max-h-48 overflow-y-auto">
                      <button
                        v-for="option in filteredComboOptions(field)"
                        :key="option"
                        type="button"
                        class="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.06] hover:text-white"
                        :class="downloadForm[field.id] === option ? 'text-white' : 'text-[#C4C9D4]'"
                        @click="selectComboOption(field.id, option)"
                      >
                        <span class="truncate">{{ option }}</span>
                        <Icon v-if="downloadForm[field.id] === option" icon="lucide:check" class="h-4 w-4 flex-shrink-0 text-accent" />
                      </button>
                      <div v-if="!filteredComboOptions(field).length" class="px-3 py-3 text-center text-[12px] text-[#7D8594]">
                        검색 결과가 없습니다
                      </div>
                    </div>
                  </div>
                </div>
                <select
                  v-else-if="field.type === 'select'"
                  v-model="downloadForm[field.id]"
                  class="w-full rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50"
                >
                  <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
                </select>
                <div v-else-if="field.type === 'date'" class="relative">
                  <input
                    v-model="downloadForm[field.id]"
                    type="date"
                    :min="minLogDate"
                    :max="maxLogDate"
                    class="log-date-input w-full rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2.5 pr-10 text-sm text-white outline-none transition-colors focus:border-accent/50"
                    @click="openDatePicker"
                    @focus="openDatePicker"
                  />
                  <button
                    type="button"
                    class="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#8B94A5] transition-colors hover:bg-white/[0.06] hover:text-white"
                    aria-label="날짜 선택"
                    @click="openDatePicker"
                  >
                    <Icon icon="lucide:calendar-days" class="h-4 w-4" />
                  </button>
                </div>
                <input
                  v-else
                  v-model="downloadForm[field.id]"
                  :type="field.type"
                  class="w-full rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent/50"
                  :placeholder="field.placeholder"
                  :readonly="field.readonly"
                />
              </label>
            </div>

            <div class="mt-5">
              <span class="mb-1.5 block text-[12px] font-semibold text-[#7D8594]">요청 사유</span>
              <textarea
                v-model="downloadForm.reason"
                rows="3"
                class="w-full resize-none rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2.5 text-sm leading-relaxed text-white placeholder-[#6B7280] outline-none transition-colors focus:border-accent/50"
                placeholder="예: 설비 오동작 VOC 분석을 위한 로그 확인"
              />
            </div>

            <div class="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-sm text-[#9CA3B0]">
                예상 패키지: <span class="font-semibold text-white">{{ estimatedPackage }}</span>
              </div>
              <button
                type="button"
                class="app-cta"
                @click="createDownloadRequest"
              >
                <span class="app-cta__glow"></span>
                <span class="app-cta__content">
                  <Icon icon="lucide:package-check" class="h-4 w-4" />
                  다운로드 패키지 생성
                </span>
              </button>
            </div>
          </section>

          <section class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-white">생성 파일</h2>
                <p class="mt-1 text-sm text-[#8B94A5]">패키지에 포함될 로그 파일 미리보기입니다.</p>
              </div>
              <Icon icon="lucide:file-archive" class="h-5 w-5 text-accent" />
            </div>

            <div class="space-y-2">
              <article
                v-for="file in packageFiles"
                :key="file.name"
                class="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0D0D14] px-4 py-3"
              >
                <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon :icon="file.icon" class="h-4 w-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-white">{{ file.name }}</p>
                  <p class="mt-0.5 text-[12px] text-[#7D8594]">{{ file.path }}</p>
                </div>
                <span class="text-sm font-semibold tabular-nums text-[#B8C0CF]">{{ file.size }}</span>
              </article>
            </div>
          </section>
        </div>

        <aside class="space-y-6">
          <section class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <h2 class="text-lg font-bold text-white">요청 상태</h2>
            <div class="mt-5 space-y-4">
              <div v-for="step in requestSteps" :key="step.label" class="flex gap-3">
                <div class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full" :class="step.done ? 'bg-accent text-white' : 'bg-white/[0.06] text-[#7D8594]'">
                  <Icon :icon="step.done ? 'lucide:check' : 'lucide:circle'" class="h-3.5 w-3.5" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">{{ step.label }}</p>
                  <p class="mt-0.5 text-[12px] text-[#7D8594]">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <h2 class="text-lg font-bold text-white">최근 다운로드</h2>
            <div class="mt-4 space-y-3">
              <article v-for="item in downloadHistory" :key="item.id" class="rounded-lg bg-[#0D0D14] p-3">
                <div class="flex items-center justify-between gap-3">
                  <p class="truncate text-sm font-semibold text-white">{{ item.title }}</p>
                  <span class="text-[12px] text-emerald-300">{{ item.status }}</span>
                </div>
                <p class="mt-1 text-[12px] text-[#7D8594]">{{ item.createdAt }} · {{ item.size }}</p>
              </article>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits(['navigate'])

const defaultEmail = 'jg91.jang@samsung.com'
const maxLogDate = formatDateForInput(new Date())
const minLogDate = formatDateForInput(addMonths(new Date(), -1))
const openComboId = ref(null)
const comboSearch = reactive({
  lineId: '',
  eqpId: '',
})

const downloadForm = reactive({
  lineId: 'LINE-01',
  eqpId: 'EQP-042',
  logDate: maxLogDate,
  logType: 'Error',
  mergeTblLog: '병합',
  email: defaultEmail,
  reason: '',
})

const requestCreated = ref(false)

const formFields = [
  { id: 'lineId', label: 'LineID', type: 'searchable-select', options: ['LINE-01', 'LINE-02', 'LINE-03', 'LINE-04', 'LINE-ALL'] },
  { id: 'eqpId', label: 'EQPID', type: 'searchable-select', options: ['EQP-042', 'EQP-117', 'EQP-203', 'EQP-304', 'EQP-ALL'] },
  { id: 'logDate', label: '날짜', type: 'date' },
  { id: 'logType', label: '로그 유형', type: 'select', options: ['Error', 'Access', 'System', 'VOC Trace', 'All'] },
  { id: 'mergeTblLog', label: 'TBL 로그 병합', type: 'select', options: ['병합', '미병합'] },
  { id: 'email', label: '메일주소', type: 'email', placeholder: defaultEmail, readonly: true },
]

const metrics = [
  { label: '오늘 요청', value: '18' },
  { label: '평균 생성', value: '42초' },
  { label: '성공률', value: '99%' },
]

const packageFiles = [
  { icon: 'lucide:file-text', name: 'equipment-error.log', path: '/logs/line/LINE-01/eqp/EQP-042/error', size: '84MB' },
  { icon: 'lucide:server', name: 'api-gateway-access.log', path: '/logs/gateway/access', size: '42MB' },
  { icon: 'lucide:table', name: 'tbl-log-merged.csv', path: '/logs/tbl/merged', size: '28MB' },
  { icon: 'lucide:shield-check', name: 'download-audit.csv', path: '/logs/audit/download', size: '6MB' },
]

const downloadHistory = [
  { id: 1, title: 'LINE-01 / EQP-042 장애 분석 로그', createdAt: '오늘 11:42', size: '128MB', status: '완료' },
  { id: 2, title: 'VOC trace 패키지', createdAt: '어제 16:08', size: '74MB', status: '완료' },
  { id: 3, title: 'Gateway access 로그', createdAt: '4월 17일', size: '211MB', status: '완료' },
]

const requestSteps = computed(() => [
  { label: '권한 확인', description: '사용자 역할과 로그 접근 범위를 확인합니다.', done: true },
  { label: '파일 구성', description: '선택 조건에 맞는 로그 파일을 묶습니다.', done: true },
  { label: '다운로드 준비', description: requestCreated.value ? '패키지가 생성되었습니다.' : '패키지 생성 버튼을 누르면 시작합니다.', done: requestCreated.value },
])

const estimatedPackage = computed(() => {
  const size = downloadForm.mergeTblLog === '병합' ? '178MB' : '150MB'
  return `${downloadForm.lineId}_${downloadForm.eqpId}_${downloadForm.logDate}_${downloadForm.logType} · ${size} · ${downloadForm.email}`
})

const createDownloadRequest = () => {
  requestCreated.value = true
  openComboId.value = null
}

const openDatePicker = (event) => {
  const input = event.currentTarget.closest('.relative')?.querySelector('input[type="date"]')

  try {
    input?.showPicker?.()
  } catch {
    input?.focus()
  }
}

function addMonths(date, months) {
  const nextDate = new Date(date)
  nextDate.setMonth(nextDate.getMonth() + months)
  return nextDate
}

function formatDateForInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function filteredComboOptions(field) {
  const query = String(comboSearch[field.id] ?? '').trim().toLowerCase()

  if (!query) {
    return field.options
  }

  return field.options.filter((option) => option.toLowerCase().includes(query))
}

function toggleCombo(fieldId) {
  openComboId.value = openComboId.value === fieldId ? null : fieldId
  comboSearch[fieldId] = ''
}

function selectComboOption(fieldId, option) {
  downloadForm[fieldId] = option
  comboSearch[fieldId] = ''
  openComboId.value = null
}
</script>

<style scoped>
.log-date-input {
  color-scheme: dark;
}

.log-date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
}
</style>
