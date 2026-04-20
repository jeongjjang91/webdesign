# Dashboard Table Viewer Web Implementation Spec

## 1. Objective

TC DB read-only MySQL 테이블을 웹 대시보드에서 안전하게 조회, 필터링, 페이지네이션, 다운로드할 수 있는 Table Viewer 화면을 구현한다.

프론트엔드는 제공된 API를 사용해 테이블 목록을 동적으로 불러오고, whitelist에 등록된 테이블만 조회할 수 있어야 한다. 테이블마다 필터 가능 컬럼과 필터 필수 여부가 다르므로, API 응답을 기준으로 UI를 자동 구성한다.

## 2. Agent Instruction

너는 기존 Vue.js 웹 프로젝트를 수정하는 프론트엔드 개발 agent다. 아래 spec을 기준으로 구현하되, 기존 프로젝트의 라우팅, API client, 공통 컴포넌트, 스타일 규칙을 최우선으로 따르고 불필요한 새 라이브러리는 추가하지 마라.

## 3. Target Scope

초기 대상 테이블은 다음과 같다.

| Table | Expected Rows | Filter Required |
| --- | ---: | --- |
| TC_EQUIPMENT | ~50,000 | No |
| TC_EQP_PARAM | ~300,000 | Yes |
| TC_EQP_RELINK | 300,000+ | Yes |

프론트엔드는 특정 테이블명을 하드코딩하지 않고 `/api/v1/tables` 응답을 기반으로 테이블 선택 UI를 구성한다.

향후 `config/whitelist.yaml`에 테이블이 추가되면 프론트엔드 수정 없이 목록에 반영되어야 한다.

## 4. API Contract

### 4.1 Load Table List

```http
GET /api/v1/tables
```

Expected response:

```json
[
  {
    "name": "TC_EQUIPMENT",
    "filterable": ["LINEID", "EQPID", "SERVER_MODEL", "DCOP_MODEL"],
    "requires_where": false
  },
  {
    "name": "TC_EQP_PARAM",
    "filterable": ["LINEID", "EQPID", "SERVER_MODEL", "PARAM_NAME"],
    "requires_where": true
  }
]
```

Frontend behavior:

- On page load, fetch the table list.
- Render table selector from the response.
- Use `filterable` fields to render filter inputs.
- Use `requires_where` to decide whether initial query is allowed.
- If table list loading fails, show a recoverable error state with retry.

### 4.2 Query Table Rows

```http
GET /api/v1/tables/{table_name}?page=1&page_size=50&LINEID=L01&EQPID=EQP01
```

Expected response:

```json
{
  "total": 3200,
  "page": 1,
  "page_size": 50,
  "pages": 64,
  "data": [
    {
      "LINEID": "L01",
      "EQPID": "EQP01"
    }
  ]
}
```

Frontend behavior:

- Send `page` and `page_size` on every query.
- Send only non-empty filter values.
- Do not send filter fields that are not included in the selected table's `filterable` list.
- Default `page_size` should be `50`.
- Available page size options should be `25`, `50`, `100`, `200`.
- Do not allow values greater than `200`.
- On filter change, reset `page` to `1`.
- On table change, reset filters, page, result data, and error state.

### 4.3 Download Table Data

```http
GET /api/v1/tables/{table_name}/download?format=csv&LINEID=L01
GET /api/v1/tables/{table_name}/download?format=excel&LINEID=L01&limit=5000
```

Frontend behavior:

- Provide download format options: `csv`, `excel`.
- Default format should be `excel`.
- Provide optional limit input.
- Limit may be empty.
- If limit is entered, it must be a positive integer.
- Trigger download by assigning the generated URL to `window.location.href` or by creating a temporary anchor.
- Include current filter values in the download URL.
- For tables that require filters, disable download until at least one filter value exists.
- Show clear guidance that unfiltered download is not allowed for filter-required tables.

## 5. Page Structure

The Table Viewer page should contain the following areas.

1. Page header
2. Table selector
3. Filter panel
4. Action toolbar
5. Result summary
6. Data table
7. Pagination controls
8. Loading, empty, and error states

Recommended page hierarchy:

```text
DashboardTableViewerPage
  - TableSelector
  - FilterPanel
  - TableToolbar
  - ResultSummary
  - DataGrid
  - PaginationBar
```

If the existing project already has a component structure or design system, follow that structure first.

## 5.1 Dashboard-To-Table Mapping

If the existing product already has separate dashboard areas per table, each dashboard can load a specific default table while still reusing the same Table Viewer behavior.

Initial dashboard mapping:

| Dashboard Position | Default Table | Behavior |
| --- | --- | --- |
| First dashboard | TC_EQUIPMENT | Load `TC_EQUIPMENT` by default. Because this table does not require filters, it may query page 1 immediately. |
| Second dashboard | TC_EQP_PARAM | Load `TC_EQP_PARAM` by default. Because this table requires filters, do not query until the user enters at least one filter. |
| Third dashboard, if present | TC_EQP_RELINK | Load `TC_EQP_RELINK` by default. Because this table requires filters, do not query until the user enters at least one filter. |

Implementation guidance:

- Keep one reusable table viewer component.
- Pass the default table name from each dashboard instance.
- Each dashboard instance should maintain its own filters, page, page size, loading state, result rows, and errors.
- Do not share filter state between dashboard instances unless explicitly requested.
- Still validate each default table against `/api/v1/tables`; if a configured default table is not returned by the API, show a configuration error for that dashboard.
- Do not hardcode table columns in the component. Columns must still come from API result data and table metadata.

Example component structure:

```text
DashboardPage
  - TableDashboardPanel(defaultTableName="TC_EQUIPMENT")
  - TableDashboardPanel(defaultTableName="TC_EQP_PARAM")
  - TableDashboardPanel(defaultTableName="TC_EQP_RELINK")
```

For a route-based dashboard structure:

```text
/dashboard/equipment -> default table TC_EQUIPMENT
/dashboard/eqp-param -> default table TC_EQP_PARAM
/dashboard/eqp-relink -> default table TC_EQP_RELINK
```

For a tab-based dashboard structure:

```text
Tab 1: Equipment -> TC_EQUIPMENT
Tab 2: EQP Param -> TC_EQP_PARAM
Tab 3: EQP Relink -> TC_EQP_RELINK
```

## 6. User Flow

### 6.1 Initial Load

1. User opens the Table Viewer page.
2. Frontend calls `GET /api/v1/tables`.
3. The first table may be selected automatically, or no table may be selected depending on existing UX conventions.
4. If the selected table does not require filters, data may be loaded immediately.
5. If the selected table requires filters, do not auto-query. Show a message asking the user to enter at least one filter.

### 6.2 Table Selection

When a user selects a table:

1. Clear previous filters.
2. Clear previous result rows.
3. Reset `page` to `1`.
4. Reset `page_size` to default unless the product prefers preserving it.
5. Render filter inputs based on selected table's `filterable` columns.
6. If `requires_where` is `true`, show `필터를 하나 이상 입력해야 조회할 수 있습니다.`
7. If `requires_where` is `false`, allow immediate search.

### 6.3 Search

When a user clicks Search:

1. Validate selected table.
2. Validate required filter rule.
3. Build query params from page, page_size, and non-empty filters.
4. Request data from `/api/v1/tables/{table_name}`.
5. Render returned rows.
6. Render total count and page information.

Filter input and actual query state must be separated.

Use two filter states:

```ts
draftFilters
appliedFilters
```

Meaning:

- `draftFilters`: values the user is currently selecting or typing in the UI.
- `appliedFilters`: values used for the current table result.

Rules:

- Changing a filter updates only `draftFilters`.
- Changing a filter must not immediately call the API.
- Clicking `조회` copies `draftFilters` into `appliedFilters`.
- Clicking `조회` resets `page` to `1`.
- The table result and pagination are based on `appliedFilters`.
- Page navigation uses `appliedFilters`, not the current draft values.
- Page size changes use `appliedFilters`, reset to page `1`, and call the API.

This prevents unnecessary database queries while the user is still composing filter conditions.

### 6.4 Reset Filters

When a user clicks Reset:

1. Clear all filter input values.
2. Reset page to `1`.
3. Clear table result for filter-required tables.
4. For non-filter-required tables, clear filters and reload page 1.

### 6.5 Pagination

When a user changes page:

1. Keep current filters.
2. Keep selected page size.
3. Request the target page.
4. Do not clear the table while loading if the existing UI supports an in-place loading state.

When a user changes page size:

1. Reset page to `1`.
2. Keep current filters.
3. Request data with the new page size.

### 6.6 Current Vue Prototype Pagination Behavior

The current Vue prototype already has client-side pagination added to the dashboard table.

Current behavior:

1. The dashboard starts from the full local/mock row array.
2. User-selected filter values are kept as draft values.
3. The table is not updated immediately when the user selects a filter.
4. When the user clicks `조회`, draft filters are copied into applied filters.
5. Applied filters are used to calculate `filteredRequests`.
6. Pagination is applied after filtering.
7. The table renders only the current page rows, conceptually `paginatedRequests`.
8. The CSV download still uses the full applied-filter result, not only the current page.

Current state shape:

```ts
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 20, 50]
```

Current filter state shape:

```ts
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
```

In the current prototype:

- `selectedFilters` is the draft filter state.
- `appliedFilters` is the state actually used by the table.
- The active filter chips show `selectedFilters`.
- The table result uses `appliedFilters`.
- If `selectedFilters` differs from `appliedFilters`, show a small pending message such as `변경된 필터가 있습니다`.

Current derived values:

```ts
filteredRequests = activeRequests filtered by appliedFilters
totalPages = max(1, ceil(filteredRequests.length / pageSize))
paginatedRequests = filteredRequests.slice(start, start + pageSize)
pageStart = first visible row number
pageEnd = last visible row number
visiblePages = up to 5 page buttons around the current page
hasPendingFilters = selectedFilters differs from appliedFilters
```

Current UI controls:

```text
조회
총 {filteredRequests.length}건
{currentPage} / {totalPages} 페이지
페이지당 [5|10|20|50] 건
[이전] [1] [2] [3] [4] [5] [다음]
```

Reset rules:

- When filters change, do not update the table immediately.
- When `조회` is clicked, reset `currentPage` to `1`.
- When `pageSize` changes, reset `currentPage` to `1`.
- When the filtered result becomes smaller than the current page range, clamp `currentPage` to `totalPages`.
- Previous is disabled on page `1`.
- Next is disabled on `totalPages`.

Important implementation detail:

- The table body must iterate over `paginatedRequests`, not `filteredRequests`.
- The summary count should still use `filteredRequests.length`.
- The current visible range should use `pageStart` and `pageEnd`.
- Download behavior should remain based on `filteredRequests` unless the product explicitly asks for current-page-only download.
- Filter UI controls should modify draft filters.
- Table filtering should read applied filters.

Prototype flow:

```text
activeRequests
  -> user edits selectedFilters
  -> user clicks 조회
  -> copy selectedFilters into appliedFilters
  -> apply appliedFilters
  -> filteredRequests
  -> apply currentPage + pageSize
  -> paginatedRequests
  -> render table rows
```

Server API transition flow:

```text
selected table + filters + currentPage + pageSize
  -> GET /api/v1/tables/{table_name}?page={currentPage}&page_size={pageSize}&...
  -> response.data
  -> render table rows directly
```

When the real API is connected:

- Keep the same pagination UI.
- Replace local `paginatedRequests` slicing with API response `data`.
- Replace `filteredRequests.length` summary with API response `total`.
- Replace `totalPages` calculation with API response `pages`, or calculate from `total` and `page_size` if `pages` is absent.
- Keep draft filters and applied filters separated.
- Filter input changes should not call the API.
- `조회` should copy draft filters to applied filters and call the API with `page=1`.
- On page button click, call the API with the new `page`.
- On page size change, call the API with `page=1` and the selected `page_size`.
- Do not fetch all rows to the browser for pagination.

## 7. UI Requirements

### 7.1 Table Selector

Render a selector or tab list from `/api/v1/tables`.

Each table item should display:

- Table name
- Whether filters are required

Example labels:

```text
TC_EQUIPMENT
TC_EQP_PARAM - 필터 필수
TC_EQP_RELINK - 필터 필수
```

Avoid hardcoding the initial three tables in the UI logic.

### 7.2 Filter Panel

Render one text input per `filterable` column.

Input behavior:

- Trim whitespace before sending request.
- Empty values are not included in query params.
- Pressing Enter in any filter input should trigger Search.
- Filter labels should use the column name exactly as provided by API.
- Do not invent client-only filters.

For filter-required tables:

- Search button is disabled until at least one filter has a non-empty value.
- Show helper text: `이 테이블은 데이터가 많아 필터를 하나 이상 입력해야 합니다.`

### 7.3 Toolbar

Toolbar actions:

- Search
- Reset
- Download CSV
- Download Excel
- Optional limit input for download

Button rules:

- Search disabled if no table is selected.
- Search disabled if selected table requires filters and no filters are entered.
- Download disabled if there is no selected table.
- Download disabled if selected table requires filters and no filters are entered.
- While querying, prevent duplicate Search requests.

### 7.4 Result Summary

After successful query, show:

```text
총 3,200건 - 1 / 64 페이지 - 페이지당 50건
```

If no query has been made yet, do not show fake totals.

If total is zero, show:

```text
조회 결과가 없습니다.
```

### 7.5 Data Table

Columns should be derived dynamically from `data`.

Column behavior:

- If `data` has rows, derive columns from the first row's keys.
- Preserve API key order if possible.
- Render all values as text.
- `null` or `undefined` should render as empty text or `-`, according to existing app convention.
- Long text should not break the layout.
- Use horizontal scroll for wide tables.
- Keep header visible if existing layout supports sticky headers.

Cell rules:

- Do not interpret values as HTML.
- Do not render links automatically unless explicitly required later.
- Keep text selectable for copy.

### 7.6 Pagination

Show pagination only after a successful query.

Required controls:

- Previous page
- Next page
- Current page
- Total pages
- Page size selector

Rules:

- Previous disabled on page `1`.
- Next disabled on last page.
- Page input, if implemented, must clamp between `1` and `pages`.
- If `pages` is `0`, disable pagination controls.

## 8. State Model

Recommended frontend state:

```ts
type TableMeta = {
  name: string
  filterable: string[]
  requires_where: boolean
}

type TableQueryState = {
  selectedTable: string | null
  filters: Record<string, string>
  page: number
  pageSize: number
}

type TableResultState = {
  total: number
  page: number
  pageSize: number
  pages: number
  data: Record<string, unknown>[]
}

type LoadingState = {
  tables: boolean
  rows: boolean
  download: boolean
}

type ErrorState = {
  tables: string | null
  rows: string | null
  download: string | null
}
```

Adapt type syntax to the project's actual JavaScript or TypeScript setup.

## 9. Error Handling

### 9.1 Table List Error

If `/api/v1/tables` fails:

- Show error message.
- Provide Retry button.
- Do not render stale table options unless the project already has cache behavior.

### 9.2 Query Error

If table query fails:

- Preserve selected table and filters.
- Show error message near the table area.
- Do not clear existing results unless the failed query belongs to a different selected table.
- If API returns `400` for missing filters, show a user-friendly message.

Recommended messages:

```text
조회 조건을 확인해 주세요.
이 테이블은 필터를 하나 이상 입력해야 조회할 수 있습니다.
데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
```

### 9.3 Download Error

For direct browser download, detailed error handling may be limited.

Minimum requirement:

- Validate filters and limit before triggering download.
- If validation fails, show inline message and do not call download URL.

Optional enhanced behavior:

- Use `fetch` to check response status and then download blob.
- Only implement this if the existing app already uses this pattern.

## 10. Validation Rules

Search validation:

- A table must be selected.
- If `requires_where` is `true`, at least one filter must be non-empty.
- `page_size` must be one of `25`, `50`, `100`, `200`.

Download validation:

- A table must be selected.
- If `requires_where` is `true`, at least one filter must be non-empty.
- `format` must be `csv` or `excel`.
- `limit`, if provided, must be a positive integer.
- The UI should explain that the backend maximum is `100,000`.

## 11. Security Requirements

Frontend must not attempt to bypass backend constraints.

- Do not allow arbitrary table names from user input.
- Use only table names from `/api/v1/tables`.
- Use only filter fields from selected table's `filterable` list.
- Do not include empty filters in request params.
- Do not expose internal DB details beyond table and column names provided by API.
- Do not hardcode credentials, database URLs, or internal API hosts.
- Use relative API paths unless the existing app has a central API client/base URL convention.

## 12. Performance Requirements

The UI should remain usable with large result sets.

- Do not request more than `200` rows per page.
- Do not render all pages client-side.
- Do not store downloaded data in frontend memory.
- Do not implement client-side filtering for server data.
- Use server pagination only.
- Avoid deep watchers on large `data` arrays.
- For wide rows, prefer simple text rendering over heavy custom cell components.

## 13. Responsive Behavior

Desktop:

- Table selector, filters, and actions may be arranged horizontally if space allows.
- Data table may use horizontal scrolling for many columns.

Tablet:

- Filters should wrap cleanly.
- Toolbar buttons should remain accessible.

Mobile:

- Filters stack vertically.
- Toolbar actions may wrap.
- Data table should use horizontal scroll.
- No page-level horizontal overflow except inside the table scroll area.
- Buttons and inputs must remain tappable.

## 14. Accessibility Requirements

- Each filter input must have a visible label.
- Buttons must have clear accessible names.
- Loading state should be announced visually at minimum.
- Keyboard users should be able to select table, enter filters, trigger search, move pagination, and trigger download.
- Do not rely on color alone to indicate disabled or error states.

## 14.1 Chat Thinking Indicator

The chatbot page includes a lightweight thinking indicator for the short moment between creating an assistant streaming message and receiving the first visible token.

Purpose:

- Avoid showing an empty assistant bubble.
- Make the assistant feel responsive immediately after the user sends a message.
- Keep the UI aligned with the dark TC Assistant theme.

Display text:

```text
생각하는 중이에요...
```

Final visual direction:

- Text only.
- No circular orb.
- No decorative card or large loading container.
- Soft White text with a Bright Cyan moving highlight.
- Gradient flow moves from left to right.
- The gradient loop should not visibly snap or cut at the repeat point.

Color tokens:

```text
Soft White: #F4F7FB
Bright Cyan: #22D3EE
```

Current implementation behavior:

```text
User sends message
-> assistant streaming message is created
-> if assistant content is still empty, show thinking indicator
-> once first content appears, hide thinking indicator and show normal assistant bubble
```

Vue template condition:

```vue
<div
  v-if="msg.role === 'assistant' && msg.streaming && !msg.content"
  class="thinking-indicator"
  role="status"
  aria-live="polite"
>
  <span>생각하는 중이에요...</span>
</div>
```

Normal assistant bubble should use `v-else` after the thinking indicator so empty streaming content does not create an empty bubble.

Recommended CSS:

```css
.thinking-indicator {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 0.65rem;
  min-height: 2.5rem;
  border-radius: 8px;
  padding: 0.35rem 0.85rem 0.35rem 0.35rem;
  background: linear-gradient(
    90deg,
    #F4F7FB 0%,
    #F4F7FB 22%,
    #22D3EE 34%,
    #F4F7FB 46%,
    #F4F7FB 50%,
    #F4F7FB 72%,
    #22D3EE 84%,
    #F4F7FB 96%,
    #F4F7FB 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0;
  animation: thinking-text-flow 2.1s linear infinite;
}

@keyframes thinking-text-flow {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
```

Implementation notes:

- The first version used a gradient circular orb, but it was removed by product decision.
- The text color was changed from purple-blue to the TC Assistant-friendly Soft White/Bright Cyan combination.
- The gradient direction was reversed so the highlight reads left-to-right.
- The gradient pattern was made symmetrical and longer to reduce visible looping discontinuity.
- Keep `letter-spacing: 0` to match the UI typography rules.
- Keep `role="status"` and `aria-live="polite"` for assistive technology.

## 15. Implementation Steps for AI Agent

Follow these steps in order.

1. Inspect the existing frontend project structure.
2. Identify routing/page conventions.
3. Identify existing API client conventions.
4. Identify existing table, button, input, select, loading, and error components.
5. Create a Dashboard Table Viewer page using existing conventions.
6. Implement table list loading from `GET /api/v1/tables`.
7. Implement dynamic table selection.
8. Implement filter inputs based on selected table metadata.
9. Implement required-filter validation.
10. Implement paginated row query.
11. Implement dynamic table column rendering.
12. Implement result summary.
13. Implement pagination controls.
14. Implement CSV and Excel download actions.
15. Implement reset behavior.
16. Add loading, empty, and error states.
17. Verify responsive behavior.
18. Run project build and fix any errors.
19. Manually test with non-filter-required table, filter-required table, empty result, pagination, page size change, CSV download, and Excel download.

## 15.1 Vue Prototype Change Notes

The current Vue prototype has been updated with table pagination in the dashboard component. Use the following as the implementation direction when applying the same behavior inside the company project.

### Template Changes

The table summary near the filter area should show both the total filtered count and the current visible row range.

Recommended copy:

```text
{total}개 항목 중 {pageStart}-{pageEnd} 표시
```

The table row loop should render only the paged rows.

Before:

```vue
<article v-for="request in filteredRequests" :key="request.id">
```

After:

```vue
<article v-for="request in paginatedRequests" :key="request.id">
```

Add a pagination bar below the table container.

Add a `조회` button near the action toolbar.

Button behavior:

- The button applies current draft filters.
- The button resets the current page to `1`.
- In the API version, the button calls the table query endpoint.
- In the local prototype, the button only copies draft filters to applied filters.

Recommended pending-filter message:

```text
변경된 필터가 있습니다
```

Show this message when draft filters differ from applied filters.

Required content:

```text
총 {total}건
{currentPage} / {totalPages} 페이지
페이지당 {pageSize}건
이전
page number buttons
다음
```

Required behavior:

- `이전` button calls `goToPage(currentPage - 1)`.
- `다음` button calls `goToPage(currentPage + 1)`.
- Number buttons call `goToPage(page)`.
- `이전` is disabled when `currentPage === 1`.
- `다음` is disabled when `currentPage === totalPages`.
- Page size selector uses numeric values.

Recommended page size options for the prototype:

```ts
[5, 10, 20, 50]
```

Recommended page size options for the real API version:

```ts
[25, 50, 100, 200]
```

Use the real API version options when backend pagination is connected, because the backend allows up to `200`.

### Script Changes

Add pagination state:

```ts
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 20, 50]
const sortBy = ref('')
const sortOrder = ref('asc')
const copiedCellKey = ref('')
```

Add separate draft and applied filter state:

```ts
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
```

Use `selectedFilters` for filter controls and chips.

Use `appliedFilters` for table filtering.

Add pending-filter detection:

```ts
const hasPendingFilters = computed(() => {
  return Object.keys(selectedFilters).some((key) => {
    return selectedFilters[key].join('|') !== appliedFilters[key].join('|')
  })
})
```

Add derived pagination values:

```ts
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

const pageStart = computed(() => {
  if (!filteredRows.value.length) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const pageEnd = computed(() => Math.min(currentPage.value * pageSize.value, filteredRows.value.length))
```

Add sorting before pagination:

```ts
const sortedRows = computed(() => {
  if (!sortBy.value) return filteredRows.value

  return [...filteredRows.value].sort((left, right) => {
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
```

Then paginate `sortedRows`, not `filteredRows`:

```ts
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})
```

Add visible page button calculation:

```ts
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})
```

Add reset and clamp watchers:

```ts
watch([filteredRows, pageSize], () => {
  currentPage.value = 1
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})
```

Add page navigation function:

```ts
function goToPage(page) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}
```

Add sort toggle function:

```ts
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
}
```

Sort click cycle:

```text
no sort -> ascending -> descending -> no sort
```

Add filter apply function:

```ts
function applyFilters() {
  Object.keys(selectedFilters).forEach((key) => {
    appliedFilters[key].splice(0, appliedFilters[key].length, ...selectedFilters[key])
  })
  currentPage.value = 1
}
```

For the API version, this function should also call the query API:

```ts
async function applyFilters() {
  copyDraftFiltersToAppliedFilters()
  currentPage.value = 1
  await fetchRows({ page: 1, pageSize: pageSize.value, filters: appliedFilters })
}
```

Adapt naming to the company codebase. For example, if the existing computed result is named `filteredRequests`, use `paginatedRequests`. If it is named `filteredRows`, use `paginatedRows`.

### URL Query Sync Implementation

The prototype syncs app and dashboard table state into the URL query.

Current prototype query params:

```text
page=dashboard
menu=priority
table_page=2
page_size=10
sort_by=rptOrder
sort_order=asc
filter_eqpId=ABC123
filter_ceId=1231
filter_rpt=10
```

Query param responsibilities:

| Param | Meaning |
| --- | --- |
| `page` | App-level page, for example `dashboard` |
| `menu` | Dashboard section id, for example `priority` |
| `table_page` | Current table page |
| `page_size` | Rows per page |
| `sort_by` | Current sort column key |
| `sort_order` | `asc` or `desc` |
| `filter_*` | Applied filter values |

Important rules:

- URL query must store applied filters, not draft filters.
- Changing draft filters must not update `filter_*` params.
- Clicking `조회` copies draft filters to applied filters and then updates the URL.
- Page movement updates `table_page`.
- Page size changes update `page_size` and reset `table_page` to `1`.
- Sort changes update `sort_by`, `sort_order`, and reset `table_page` to `1`.
- Use `table_page` instead of `page` for table pagination to avoid conflict with app-level routing.

Prototype restore logic:

```ts
function restoreDashboardFromUrl() {
  const params = new URLSearchParams(window.location.search)

  restore menu from params.get('menu')
  restore table page from params.get('table_page')
  restore page size from params.get('page_size')
  restore sort from params.get('sort_by') and params.get('sort_order')
  restore applied filters from params matching filter_*
  copy restored applied filters into draft filters
}
```

Prototype sync logic:

```ts
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

  write applied filters as filter_* params
  window.history.replaceState({}, '', nextUrl)
}
```

Production router guidance:

- If the company project uses Vue Router, prefer `router.replace({ query })`.
- If it does not use Vue Router, `window.history.replaceState` is acceptable.
- Do not use `router.push` or `history.pushState` for every table state change unless browser back/forward history for table state is explicitly required.
- Ignore invalid query values and fall back to safe defaults.
- Do not put sensitive values in URL query.

### Header Sort UI

Each table header should be a button.

Header button behavior:

- Click calls `toggleSort(column.key)`.
- Current sorted column shows an ascending or descending icon.
- Unsorted columns may show a neutral sort icon.
- Sort should be keyboard accessible because the header control is a real button.

Recommended display:

```text
eqp_id <neutral sort icon>
rpt_order <up icon>
```

Production API guidance:

- Prototype sorting is local because data is local/mock.
- Production sorting must be server-side.
- Header click should set `sort_by`, `sort_order`, reset page to `1`, update URL, and call the row query API.
- Backend should reject or ignore sort columns not allowed for the selected table.

### Cell Copy UI

Each table cell should provide a copy action.

Current prototype behavior:

- Copy button appears on cell hover.
- Clicking the button copies only that cell's text value.
- Copy success changes the icon to a check mark for a short time.
- The copied value is plain text.
- `null` or `undefined` copies as an empty string.

Recommended copy state:

```ts
const copiedCellKey = ref('')
```

Recommended copy key:

```ts
`${row.id}-${column.key}`
```

Copy function behavior:

```ts
async function copyCell(value, rowId, columnKey) {
  const text = String(value ?? '')
  await navigator.clipboard.writeText(text)
  copiedCellKey.value = `${rowId}-${columnKey}`
  clear copiedCellKey after a short timeout
}
```

Fallback:

- If `navigator.clipboard.writeText` is not available, use a temporary `textarea` and `document.execCommand('copy')`.

Scope:

- Implement individual cell copy only.
- Do not implement drag selection, multi-cell range copy, row copy, or current-page copy unless separately requested.
- Do not copy HTML markup or hidden metadata.

Fields that benefit most:

- `vid_list`
- `eqp_id`
- `ceid`
- `EQPID`
- `PARAM_NAME`

### Download Behavior

Keep CSV/Excel download based on the full filtered result, not the current page.

Reason:

- Pagination controls what the user is currently viewing.
- Download usually means downloading the current query result.
- Downloading only visible rows can surprise users.

If the product requires current-page-only download later, add a separate action label such as:

```text
현재 페이지 다운로드
```

### Empty State Behavior

When there are no filtered rows:

- Do not render the pagination bar.
- Show the existing empty state.
- `pageStart` and `pageEnd` should both resolve safely without displaying invalid ranges.

Recommended display:

```text
0개 항목
조회 결과가 없습니다.
```

### API Version Migration

The current prototype is client-side because it uses local/mock data. The production API version should become server-side pagination.

Do not keep client-side slicing after the real API is connected.

Production state:

```ts
const currentPage = ref(1)
const pageSize = ref(50)
const totalRows = ref(0)
const totalPages = ref(1)
const rows = ref([])
```

Production request:

```text
GET /api/v1/tables/{table_name}?page={currentPage}&page_size={pageSize}&{filters}
```

Production query triggers:

- Initial dashboard open:
  - If the default table does not require filters, call the API automatically with `page=1`.
  - If the default table requires filters, do not call the row API yet.
- Filter change:
  - Update draft filter state only.
  - Do not call the API.
- `조회` click:
  - Copy draft filters into applied filters.
  - Reset page to `1`.
  - Call the row API.
- Page click:
  - Keep applied filters.
  - Call the row API with the selected page.
- Page size change:
  - Keep applied filters.
  - Reset page to `1`.
  - Call the row API.

Production response mapping:

```ts
rows.value = response.data
totalRows.value = response.total
currentPage.value = response.page
pageSize.value = response.page_size
totalPages.value = response.pages
```

Production table rendering:

```vue
<article v-for="row in rows" :key="row.id ?? stableRowKey(row)">
```

If the API does not provide stable row IDs, generate a stable display key from page number, row index, and a stable column value. Do not mutate API rows only to add UI keys unless the existing codebase uses that pattern.

## 16. Non-Goals

Do not implement these unless separately requested.

- Client-side full dataset caching
- Client-side sorting for production API data
- Partial string search UI
- Saved filter presets
- Background export job UI
- Column visibility settings
- Row editing
- Data mutation
- Arbitrary SQL query input

## 17. Future Extension Hooks

### Sorting

Future API may support:

```text
sort_by=PARAM_NAME
sort_order=asc
```

Keep table header rendering simple enough to add sortable headers later.

Current Vue prototype already includes local table sorting.

Prototype behavior:

- Clicking a table header cycles sort state:
  - no sort -> ascending
  - ascending -> descending
  - descending -> no sort
- Sorting is applied after filtering and before pagination.
- Changing sort resets the current page to `1`.
- Sort state is reflected in the URL query.

Prototype flow:

```text
activeRows
  -> applied filters
  -> filteredRows
  -> sort by sortBy/sortOrder
  -> sortedRows
  -> paginate
  -> paginatedRows
```

Recommended URL params:

```text
sort_by=rptOrder
sort_order=asc
```

Production API behavior:

- Do not sort only the current page on the frontend.
- Send `sort_by` and `sort_order` to the backend.
- Backend should validate that `sort_by` is an allowed column for the selected table.
- Changing sort should request `page=1`.

Production request example:

```http
GET /api/v1/tables/TC_EQP_RELINK?page=1&page_size=50&EQP_ID=ABC123&sort_by=rpt_order&sort_order=asc
```

### Contains Search

Future API may support:

```text
PARAM_NAME__contains=TEMP
```

Current implementation should use exact-match filters only. Do not invent contains behavior on the frontend.

### Large Export Job

Future large downloads over `100,000` rows may become async background jobs.

Keep download action isolated in a function so it can later be replaced with job creation and polling.

## 17.1 URL Query Sync

The Vue prototype supports URL query sync for dashboard table state.

Purpose:

- Refresh should preserve the current dashboard table state.
- Users can share a link to the current dashboard view.
- The company agent can map the same behavior to the production router.

Recommended query params:

```text
page=dashboard
menu=priority
table_page=2
page_size=10
sort_by=rptOrder
sort_order=asc
filter_eqpId=ABC123
filter_ceId=1231
filter_rpt=10
```

Rules:

- `page` controls the app-level page.
- `menu` controls the dashboard tab or section.
- `table_page` controls table pagination and avoids conflict with app-level `page`.
- `page_size` controls rows per page.
- `sort_by` and `sort_order` control sorting.
- Filter params should represent applied filters, not draft filters.
- Draft filters should not be written to the URL until the user clicks `조회`.

Prototype behavior:

- On initial load, parse URL query and restore dashboard menu, page, page size, sort state, and applied filters.
- On dashboard state change, update the URL with `history.replaceState`.
- Do not add browser history entries for every pagination/filter change in the prototype.

Production behavior:

- If the company project uses Vue Router, use `router.replace` instead of direct `history.replaceState`.
- Keep query values limited to non-sensitive table filters.
- Do not put credentials, internal hostnames, tokens, or SQL in the URL.
- If a query references an invalid table/menu/filter, ignore it and fall back to defaults.

## 17.2 Cell Copy

The Vue prototype supports copying individual cell values.

Behavior:

- Each cell shows a copy action on hover.
- Clicking copy writes that cell value to the clipboard.
- The UI briefly changes the icon to a check mark after copying.
- Values are copied as plain text.
- `null` or `undefined` should copy as an empty string.

Recommended production behavior:

- Use `navigator.clipboard.writeText` when available.
- Provide a fallback for older browsers if required by the company environment.
- Do not copy hidden metadata or HTML.
- For long fields such as `vid_list`, cell copy is especially useful.

Optional future extension:

- Add row copy.
- Add selected-cell range copy.
- Add current visible page copy as TSV.

## 18. QA Checklist

### Table List

- `/api/v1/tables` is called on page load.
- Table selector renders all returned tables.
- Filter-required metadata is visible or reflected in guidance.
- Failed table list request shows retry state.

### Filters

- Filter fields change when selected table changes.
- Empty filters are not sent.
- Pressing Enter triggers search.
- Filter-required tables cannot be searched without at least one filter.
- Reset clears filters correctly.

### Query

- Query sends correct `page`.
- Query sends correct `page_size`.
- Query sends only allowed filters.
- Page resets to `1` after filter search.
- Existing filters persist during pagination.
- Empty result is handled cleanly.
- API errors are shown without crashing the page.

### Table Rendering

- Columns render dynamically.
- Wide table does not break page layout.
- Long cell values are readable or truncated according to project style.
- Null values do not render as `undefined`.

### Pagination

- Previous disabled on first page.
- Next disabled on last page.
- Page size change resets to page `1`.
- Total count and page count match API response.

### Download

- CSV download URL includes current filters.
- Excel download URL includes current filters.
- Download is blocked for filter-required tables with no filters.
- Invalid limit is blocked.
- Empty limit is allowed.

### Responsive

- Mobile layout has no page-level horizontal overflow.
- Table area scrolls horizontally if needed.
- Inputs and buttons remain usable on small screens.

## 19. Suggested User-Facing Copy

Use Korean UI copy unless the existing product uses English.

```text
테이블 선택
필터
조회
초기화
CSV 다운로드
Excel 다운로드
페이지당 행 수
총 {total}건
{page} / {pages} 페이지
조회 결과가 없습니다.
필터를 하나 이상 입력해야 조회할 수 있습니다.
데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
다운로드 건수 제한
```

## 20. Request Builder Behavior

Build query params:

1. Start with `page` and `page_size`.
2. For each selected table filterable column, read the input value and trim whitespace.
3. If the trimmed value is non-empty, append `column=value`.
4. Do not append unknown columns.
5. Send GET request to `/api/v1/tables/{selectedTable}`.

Build download params:

1. Start with `format`.
2. Add `limit` only when provided.
3. Add non-empty filters.
4. Navigate browser to `/api/v1/tables/{selectedTable}/download?{params}`.
