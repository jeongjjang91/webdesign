# Dashboard Cascading List Filter Implementation Spec

**Date:** 2026-04-29  
**Project:** TC Assistant webdesign  
**Target:** Vue 3 dashboard frontend + company backend API  
**Goal:** Implement Spotfire-style list filters where selecting one filter value narrows the available values in the other filters.

---

## 1. Purpose

The dashboard table viewer should support Spotfire-like dependent filters.

Example:

1. User selects `LINEID = LINE-01`.
2. The `EQPID`, `SERVER MODEL`, and `DCOP MODEL` filter lists refresh.
3. Those lists now show only values that exist under `LINE-01`.
4. User selects `EQPID = ABC123`.
5. Other filter lists refresh again using the new filter combination.

This behavior is also called:

- cascading filter
- dependent filter
- faceted filter
- linked list filter

The implementation must work with API-backed data. The frontend must not assume it has the entire table dataset.

---

## 2. Current Frontend Context

Current dashboard code is mainly in:

```text
src/components/DashboardSection.vue
```

Current filter-related state:

```js
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
```

Current behavior:

- `selectedFilters`: values selected in the UI but not necessarily applied to the table.
- `appliedFilters`: values used for table query/filtering.
- `filterSearch`: text typed into each filter option search box.
- The current mock implementation filters frontend arrays directly.

New behavior:

- `selectedFilters` remains the interactive filter state.
- `appliedFilters` remains the table query state.
- Available filter options must come from backend API.
- When `selectedFilters` changes, frontend calls filter options API.
- When user clicks `조회`, frontend calls rows API using `appliedFilters`.

---

## 3. Required UX Behavior

### 3.1 Filter UI Type

Implement each filter as a list-style multi-select filter.

Recommended layout:

```text
LINEID
[Search input]

[x] LINE-01
[ ] LINE-02
[ ] LINE-03
[ ] LINE-04

Selected 1 / Available 4
```

The list may be displayed in either:

- a dropdown/popup under each filter button, or
- a fixed filter panel above the table, or
- a right-side drawer.

For the current dashboard, reuse the existing dropdown/popup if possible to reduce code changes.

### 3.2 Selection Rules

Each filter supports multi-select.

Within the same filter:

```text
LINEID = LINE-01 OR LINE-02
```

Between different filters:

```text
LINEID in (...) AND EQPID in (...) AND SERVER_MODEL in (...)
```

### 3.3 Cascading Option Rules

When calculating options for a filter, the backend must apply all other selected filters, but must exclude the target filter itself.

Example current selected filters:

```json
{
  "lineId": ["LINE-01"],
  "eqpId": ["ABC123"],
  "serverModel": [],
  "dcopModel": []
}
```

When calculating `lineId` options:

- Apply `eqpId = ABC123`.
- Apply no `serverModel`.
- Apply no `dcopModel`.
- Do not apply `lineId = LINE-01`.

When calculating `eqpId` options:

- Apply `lineId = LINE-01`.
- Apply no `serverModel`.
- Apply no `dcopModel`.
- Do not apply `eqpId = ABC123`.

Reason:

If the backend applies a filter's own selected values while calculating that same filter's option list, users may not be able to expand or change their selection easily.

### 3.4 Selected Values Must Remain Visible

If a selected value is no longer returned by the backend due to other filter changes, the frontend should still show it as selected but disabled or marked unavailable.

Recommended label:

```text
[x] ABC123 (not available)
```

Do not silently remove selected values unless the user clicks clear.

### 3.5 Query Button Behavior

Changing filter selections should refresh available filter options.

Changing filter selections should not refresh table rows immediately.

Table rows are refreshed only when user clicks:

```text
조회
```

Then:

1. Copy `selectedFilters` into `appliedFilters`.
2. Reset table page to 1.
3. Call rows API.
4. Sync URL query from `appliedFilters`.

### 3.6 URL State Behavior

The URL should store applied table state, not every temporary selection.

Required query examples:

```text
?page=dashboard
&menu=requests
&table_page=1
&page_size=50
&sort_by=eqpId
&sort_order=asc
&filter_lineId=LINE-01,LINE-02
&filter_eqpId=ABC123
```

On initial page load:

1. Parse URL.
2. Restore `appliedFilters`.
3. Copy same values into `selectedFilters`.
4. Fetch filter options using `selectedFilters`.
5. Fetch rows using `appliedFilters`.

---

## 4. Dashboard-To-Table Mapping

Each dashboard menu must map to one backend table name.

Initial mapping:

| Dashboard menu id | Label | Backend table |
|---|---|---|
| `requests` | 설비 TC 현황 | `TC_EQUIPMENT` |
| `automation` | 설비 TC 파라미터 | `TC_EQP_PARAM` |
| `priority` | CEID 매핑 | `TC_EQP_RELINK` |
| `teams` | LINE별 보기 | `TC_EQUIPMENT` |
| `settings` | 표시 설정 | No table query required |

If a dashboard menu has no table, do not call rows API or filter options API.

---

## 5. Filter Definitions

### 5.1 TC_EQUIPMENT Filters

Frontend keys:

```js
[
  { id: 'lineId', label: 'LINEID', backendColumn: 'LINEID' },
  { id: 'eqpId', label: 'EQPID', backendColumn: 'EQPID' },
  { id: 'serverModel', label: 'SERVER MODEL', backendColumn: 'SERVER_MODEL' },
  { id: 'dcopModel', label: 'DCOP MODEL', backendColumn: 'DCOP_MODEL' },
]
```

### 5.2 TC_EQP_PARAM Filters

Use same initial filters unless backend confirms additional columns.

```js
[
  { id: 'lineId', label: 'LINEID', backendColumn: 'LINEID' },
  { id: 'eqpId', label: 'EQPID', backendColumn: 'EQPID' },
  { id: 'serverModel', label: 'SERVER MODEL', backendColumn: 'SERVER_MODEL' },
  { id: 'dcopModel', label: 'DCOP MODEL', backendColumn: 'DCOP_MODEL' },
]
```

### 5.3 TC_EQP_RELINK Filters

```js
[
  { id: 'eqpId', label: 'eqp_id', backendColumn: 'EQP_ID' },
  { id: 'ceId', label: 'ceid', backendColumn: 'CEID' },
  { id: 'rpt', label: 'rpt', backendColumn: 'RPT' },
]
```

Important:

- Frontend key names may be camelCase.
- Backend column names may be uppercase or snake case.
- Backend must not accept arbitrary frontend column names directly in SQL.
- Backend must use a whitelist mapping.

---

## 6. Backend API Design

Implement two separate API groups:

1. Filter options API
2. Table rows API

CSV export can be added later as a third API.

---

## 7. API 1: Filter Options

### 7.1 Endpoint

```http
GET /api/v1/dashboard/tables/{tableName}/filter-options
```

Example:

```http
GET /api/v1/dashboard/tables/TC_EQUIPMENT/filter-options?lineId=LINE-01&eqpId=ABC123
```

### 7.2 Request Query Parameters

Common:

| Query key | Type | Required | Description |
|---|---:|---:|---|
| `lineId` | string CSV | No | Selected LINEID values |
| `eqpId` | string CSV | No | Selected EQPID values |
| `serverModel` | string CSV | No | Selected SERVER MODEL values |
| `dcopModel` | string CSV | No | Selected DCOP MODEL values |
| `ceId` | string CSV | No | Selected CEID values |
| `rpt` | string CSV | No | Selected RPT values |
| `search` | string | No | Optional text search for option values |
| `limit` | number | No | Max options per filter, default 200 |

CSV format:

```text
lineId=LINE-01,LINE-02
eqpId=ABC123,DEF456
```

If values may contain commas in the future, switch to repeated query params:

```text
lineId=LINE-01&lineId=LINE-02
```

For current TC identifiers, CSV is acceptable.

### 7.3 Response Shape

Return all filter option lists for the current table.

```json
{
  "tableName": "TC_EQUIPMENT",
  "filters": {
    "lineId": {
      "label": "LINEID",
      "values": [
        { "value": "LINE-01", "label": "LINE-01", "count": 12 },
        { "value": "LINE-02", "label": "LINE-02", "count": 8 }
      ]
    },
    "eqpId": {
      "label": "EQPID",
      "values": [
        { "value": "ABC123", "label": "ABC123", "count": 3 },
        { "value": "DEF456", "label": "DEF456", "count": 5 }
      ]
    },
    "serverModel": {
      "label": "SERVER MODEL",
      "values": [
        { "value": "SRV-A100", "label": "SRV-A100", "count": 7 }
      ]
    },
    "dcopModel": {
      "label": "DCOP MODEL",
      "values": [
        { "value": "DCOP-7A", "label": "DCOP-7A", "count": 4 }
      ]
    }
  }
}
```

`count` means:

- number of rows available for that option after applying all other selected filters.
- target filter's own selected values are excluded when calculating that target filter.

If calculating counts is expensive, backend may return `count: null`, but the key should still exist.

### 7.4 Response Rules

- Return options sorted alphabetically or naturally.
- For numeric-like values such as `RPT`, sort numerically if possible.
- Exclude null and empty values by default.
- If null values must be selectable later, represent them explicitly as:

```json
{ "value": "__NULL__", "label": "(empty)", "count": 5 }
```

Do not use raw SQL null as JSON key.

---

## 8. API 2: Table Rows

### 8.1 Endpoint

```http
GET /api/v1/dashboard/tables/{tableName}/rows
```

Example:

```http
GET /api/v1/dashboard/tables/TC_EQUIPMENT/rows?lineId=LINE-01&page=1&pageSize=50&sortBy=eqpId&sortOrder=asc
```

### 8.2 Request Query Parameters

| Query key | Type | Required | Default | Description |
|---|---:|---:|---:|---|
| `lineId` | string CSV | No | empty | Applied LINEID values |
| `eqpId` | string CSV | No | empty | Applied EQPID values |
| `serverModel` | string CSV | No | empty | Applied SERVER MODEL values |
| `dcopModel` | string CSV | No | empty | Applied DCOP MODEL values |
| `ceId` | string CSV | No | empty | Applied CEID values |
| `rpt` | string CSV | No | empty | Applied RPT values |
| `page` | number | No | 1 | 1-based page number |
| `pageSize` | number | No | 50 | page size |
| `sortBy` | string | No | table default | frontend sort key |
| `sortOrder` | string | No | asc | `asc` or `desc` |

### 8.3 Response Shape

```json
{
  "tableName": "TC_EQUIPMENT",
  "page": 1,
  "pageSize": 50,
  "totalRows": 123,
  "totalPages": 3,
  "sortBy": "eqpId",
  "sortOrder": "asc",
  "columns": [
    { "key": "eqpId", "label": "EQPID", "type": "string" },
    { "key": "lineId", "label": "LINEID", "type": "string" },
    { "key": "serverModel", "label": "SERVER MODEL", "type": "string" },
    { "key": "dcopModel", "label": "DCOP MODEL", "type": "string" }
  ],
  "rows": [
    {
      "id": "ABC123",
      "eqpId": "ABC123",
      "lineId": "LINE-01",
      "serverModel": "SRV-A100",
      "dcopModel": "DCOP-7A"
    }
  ]
}
```

The frontend should render `columns` if backend provides them.

If frontend keeps its current static columns, backend must still return row fields matching frontend keys.

---

## 9. Backend Implementation Details

### 9.1 Table Whitelist

Do not pass arbitrary `{tableName}` directly into SQL.

Create a backend whitelist:

```js
const TABLE_CONFIG = {
  TC_EQUIPMENT: {
    table: 'TC_EQUIPMENT',
    defaultSortColumn: 'EQPID',
    filters: {
      lineId: 'LINEID',
      eqpId: 'EQPID',
      serverModel: 'SERVER_MODEL',
      dcopModel: 'DCOP_MODEL',
    },
    columns: {
      eqpId: 'EQPID',
      lineId: 'LINEID',
      serverModel: 'SERVER_MODEL',
      dcopModel: 'DCOP_MODEL',
      tcVersion: 'TC_VERSION',
      status: 'STATUS',
      lastSync: 'LAST_SYNC',
      owner: 'OWNER',
      updatedAt: 'UPDATED_AT',
    },
  },
  TC_EQP_PARAM: {
    table: 'TC_EQP_PARAM',
    defaultSortColumn: 'EQPID',
    filters: {
      lineId: 'LINEID',
      eqpId: 'EQPID',
      serverModel: 'SERVER_MODEL',
      dcopModel: 'DCOP_MODEL',
    },
    columns: {
      eqpId: 'EQPID',
      lineId: 'LINEID',
      serverModel: 'SERVER_MODEL',
      dcopModel: 'DCOP_MODEL',
    },
  },
  TC_EQP_RELINK: {
    table: 'TC_EQP_RELINK',
    defaultSortColumn: 'EQP_ID',
    filters: {
      eqpId: 'EQP_ID',
      ceId: 'CEID',
      rpt: 'RPT',
    },
    columns: {
      eqpId: 'EQP_ID',
      ceId: 'CEID',
      rpt: 'RPT',
      rptOrder: 'RPT_ORDER',
      vidList: 'VID_LIST',
    },
  },
}
```

The exact backend language may differ. Keep the same concept.

### 9.2 Filter Parsing

Convert query strings into arrays.

Rules:

- Missing query = empty array.
- Empty string = empty array.
- Trim whitespace.
- Remove empty items.
- Remove duplicate values.
- Limit max selected values per filter. Recommended max: 200.

Example:

```js
function parseCsvParam(value) {
  if (!value) return []
  return [...new Set(
    String(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  )]
}
```

### 9.3 SQL Condition Builder

Use parameterized queries only.

Pseudo-code:

```js
function buildWhereClause(tableConfig, selectedFilters, excludeFilterKey = null) {
  const where = []
  const params = []

  for (const [filterKey, values] of Object.entries(selectedFilters)) {
    if (filterKey === excludeFilterKey) continue
    if (!values.length) continue

    const column = tableConfig.filters[filterKey]
    if (!column) continue

    const placeholders = values.map(() => '?').join(', ')
    where.push(`${column} IN (${placeholders})`)
    params.push(...values)
  }

  return {
    sql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params,
  }
}
```

Never concatenate user-provided values into SQL.

### 9.4 Filter Options SQL

For each filter, run a distinct query that excludes that filter's own selected values.

Pseudo-SQL:

```sql
SELECT
  {targetColumn} AS value,
  COUNT(*) AS count
FROM {tableName}
{whereClauseExcludingTargetFilter}
WHERE_OR_AND {targetColumn} IS NOT NULL
  AND TRIM({targetColumn}) <> ''
GROUP BY {targetColumn}
ORDER BY {targetColumn}
LIMIT ?
```

Implementation detail:

If `whereClauseExcludingTargetFilter` is empty:

```sql
WHERE {targetColumn} IS NOT NULL
  AND TRIM({targetColumn}) <> ''
```

If it already has conditions:

```sql
WHERE condition1
  AND {targetColumn} IS NOT NULL
  AND TRIM({targetColumn}) <> ''
```

Recommended helper:

```js
function appendCondition(whereSql, condition) {
  if (!whereSql) return `WHERE ${condition}`
  return `${whereSql} AND ${condition}`
}
```

### 9.5 Rows SQL

Pseudo-SQL:

```sql
SELECT
  EQPID AS eqpId,
  LINEID AS lineId,
  SERVER_MODEL AS serverModel,
  DCOP_MODEL AS dcopModel
FROM TC_EQUIPMENT
{whereClause}
ORDER BY {safeSortColumn} {safeSortOrder}
LIMIT ?
OFFSET ?
```

Count query:

```sql
SELECT COUNT(*) AS totalRows
FROM TC_EQUIPMENT
{whereClause}
```

Rules:

- `sortBy` must map through whitelist.
- `sortOrder` must be only `asc` or `desc`.
- `page` minimum is 1.
- `pageSize` allowed values: `20`, `50`, `100`, `200`.
- Recommended default page size: `50`.
- Recommended max page size: `200`.

### 9.6 Parallel Query Optimization

For filter options API, the backend may run one query per filter.

For `TC_EQUIPMENT`, that means up to 4 queries:

- lineId options
- eqpId options
- serverModel options
- dcopModel options

These can be executed in parallel if the backend framework supports it.

Do not block frontend implementation on this optimization.

### 9.7 Index Recommendation

For large MySQL tables, add or confirm indexes on filter columns.

Recommended indexes:

```sql
CREATE INDEX idx_tc_equipment_lineid ON TC_EQUIPMENT (LINEID);
CREATE INDEX idx_tc_equipment_eqpid ON TC_EQUIPMENT (EQPID);
CREATE INDEX idx_tc_equipment_server_model ON TC_EQUIPMENT (SERVER_MODEL);
CREATE INDEX idx_tc_equipment_dcop_model ON TC_EQUIPMENT (DCOP_MODEL);

CREATE INDEX idx_tc_eqp_relink_eqp_id ON TC_EQP_RELINK (EQP_ID);
CREATE INDEX idx_tc_eqp_relink_ceid ON TC_EQP_RELINK (CEID);
CREATE INDEX idx_tc_eqp_relink_rpt ON TC_EQP_RELINK (RPT);
```

Composite indexes may be considered later after checking real query patterns.

---

## 10. Frontend Implementation Details

### 10.1 New State

Add state for backend-provided options.

```js
const filterOptions = reactive({
  lineId: [],
  eqpId: [],
  serverModel: [],
  dcopModel: [],
  ceId: [],
  rpt: [],
})

const filterOptionLoading = ref(false)
const filterOptionError = ref('')
```

Each `filterOptions[key]` should contain:

```js
[
  { value: 'LINE-01', label: 'LINE-01', count: 12 },
]
```

### 10.2 API Request Helper

Create a helper that serializes filters.

```js
function buildFilterQuery(filters) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length) {
      params.set(key, values.join(','))
    }
  })

  return params
}
```

### 10.3 Fetch Filter Options

```js
async function fetchFilterOptions() {
  const tableName = activeTableName.value
  if (!tableName) return

  filterOptionLoading.value = true
  filterOptionError.value = ''

  try {
    const params = buildFilterQuery(selectedFilters)
    const response = await fetch(`/api/v1/dashboard/tables/${tableName}/filter-options?${params}`)

    if (!response.ok) {
      throw new Error(`Filter options request failed: ${response.status}`)
    }

    const data = await response.json()

    Object.keys(filterOptions).forEach((key) => {
      filterOptions[key] = data.filters?.[key]?.values ?? []
    })
  } catch (error) {
    filterOptionError.value = '필터 목록을 불러오지 못했습니다.'
  } finally {
    filterOptionLoading.value = false
  }
}
```

### 10.4 Debounce Filter Option Fetch

Do not call API on every tiny UI event without debounce.

Recommended delay:

```text
200ms to 350ms
```

Pseudo-code:

```js
let filterOptionTimer = null

function scheduleFetchFilterOptions() {
  window.clearTimeout(filterOptionTimer)
  filterOptionTimer = window.setTimeout(() => {
    fetchFilterOptions()
  }, 250)
}
```

Watch selected filters:

```js
watch(
  selectedFilters,
  () => {
    scheduleFetchFilterOptions()
  },
  { deep: true }
)
```

### 10.5 Display Available Options

Replace current static `filter.options` usage with backend options.

```js
function filteredOptions(filter) {
  const keyword = filterSearch[filter.id].trim().toLowerCase()
  const options = filterOptions[filter.id] ?? []

  if (!keyword) return options

  return options.filter((option) => {
    return String(option.label ?? option.value).toLowerCase().includes(keyword)
  })
}
```

Template should use:

```vue
<button
  v-for="option in filteredOptions(filter)"
  :key="option.value"
  type="button"
  @click="toggleFilterValue(filter.id, option.value)"
>
  <span>{{ option.label }}</span>
  <span v-if="option.count !== null">{{ option.count }}</span>
</button>
```

### 10.6 Preserve Unavailable Selected Values

Add computed helper:

```js
function optionsWithSelectedValues(filter) {
  const available = filterOptions[filter.id] ?? []
  const selected = selectedFilters[filter.id] ?? []
  const availableValues = new Set(available.map((option) => String(option.value)))

  const missingSelected = selected
    .filter((value) => !availableValues.has(String(value)))
    .map((value) => ({
      value,
      label: `${value} (not available)`,
      count: 0,
      unavailable: true,
    }))

  return [...missingSelected, ...available]
}
```

Use this helper inside `filteredOptions`.

### 10.7 Fetch Rows

Rows should be fetched from backend using `appliedFilters`, not `selectedFilters`.

```js
async function fetchRows() {
  const tableName = activeTableName.value
  if (!tableName) return

  const params = buildFilterQuery(appliedFilters)
  params.set('page', String(currentPage.value))
  params.set('pageSize', String(pageSize.value))

  if (sortBy.value) {
    params.set('sortBy', sortBy.value)
    params.set('sortOrder', sortOrder.value)
  }

  const response = await fetch(`/api/v1/dashboard/tables/${tableName}/rows?${params}`)
  const data = await response.json()

  tableRows.value = data.rows
  totalRows.value = data.totalRows
}
```

### 10.8 Apply Button

```js
function applyFilters() {
  Object.keys(selectedFilters).forEach((key) => {
    appliedFilters[key].splice(0, appliedFilters[key].length, ...selectedFilters[key])
  })

  currentPage.value = 1
  openFilterId.value = null
  syncDashboardUrl()
  fetchRows()
}
```

### 10.9 Menu Change

When dashboard menu changes:

1. Set `activeMenuId`.
2. Clear `openFilterId`.
3. Reset `currentPage` to 1.
4. Reset filters that do not belong to the new table.
5. Fetch filter options for new table.
6. Fetch rows if the table can auto-load.

For `TC_EQP_PARAM` and `TC_EQP_RELINK`, if the business rule says at least one filter is required, do not fetch rows until user selects filters and clicks `조회`.

---

## 11. Loading And Error UI

### 11.1 Filter Options Loading

When filter options are loading:

- Keep previous options visible if possible.
- Show small loading text or spinner inside the filter panel.
- Disable repeated clicks only if necessary.

Recommended message:

```text
필터 목록 갱신 중
```

### 11.2 Filter Options Error

If filter options API fails:

- Keep current selected values.
- Show error near filter area.
- Allow retry.

Recommended message:

```text
필터 목록을 불러오지 못했습니다.
```

### 11.3 Rows Error

If rows API fails:

- Keep filter selections.
- Keep old rows or clear rows depending on product decision.
- Show error in table area.

Recommended message:

```text
테이블 데이터를 불러오지 못했습니다.
```

---

## 12. Security Requirements

Backend must follow these rules:

1. Whitelist table names.
2. Whitelist filter keys.
3. Whitelist sort keys.
4. Use parameterized queries.
5. Limit page size.
6. Limit selected values per filter.
7. Do not return hidden columns.
8. Apply user authorization before querying.

Authorization example:

- General user: read only allowed tables.
- Power user: read additional operational tables.
- Admin: read all dashboard tables.

Do not rely only on frontend role settings.

---

## 13. Performance Requirements

Minimum acceptable behavior:

- Filter options API returns within 1 second for normal use.
- Rows API returns within 1 second for first page under normal filter conditions.
- Page size max is 200.
- Filter option limit default is 200 values per filter.

If a filter has more than 200 possible values:

- Return first 200 sorted values.
- Support `search` query later for server-side option search.

Future search endpoint shape:

```http
GET /api/v1/dashboard/tables/TC_EQUIPMENT/filter-options?lineId=LINE-01&search=ABC
```

For now, frontend local search within returned options is acceptable.

---

## 14. Testing Checklist

### 14.1 Frontend

- Initial dashboard load fetches filter options.
- Initial dashboard load fetches rows for `TC_EQUIPMENT`.
- Selecting `LINEID` refreshes other filter option lists.
- Selecting `EQPID` refreshes other filter option lists.
- Selected values remain checked after option refresh.
- `조회` copies selected filters to applied filters.
- Rows API uses applied filters only.
- URL query updates after `조회`.
- Refreshing browser restores filters from URL.
- CSV download uses current applied filters.
- CEID dashboard uses `eqpId`, `ceId`, `rpt` filters only.
- Empty result state is shown when no rows match.
- API error state is shown when filter options fail.
- API error state is shown when rows fail.

### 14.2 Backend

- Unknown table name returns 404 or 400.
- Unknown filter key is ignored or rejected consistently.
- Unknown sort key falls back to default sort or returns 400.
- SQL injection strings are treated as values, not SQL.
- Empty filters return full option lists.
- For each target filter, its own selected values are excluded from option calculation.
- Counts match filtered row counts.
- Pagination totalRows and totalPages are correct.
- Page size over max is clamped or rejected.
- User without permission cannot access restricted table.

### 14.3 Manual Scenario

Use `TC_EQUIPMENT`.

1. Open dashboard.
2. Confirm all LINEID options are visible.
3. Select `LINE-01`.
4. Confirm EQPID list contains only EQP IDs under `LINE-01`.
5. Select one EQPID.
6. Confirm SERVER MODEL and DCOP MODEL narrow again.
7. Click `조회`.
8. Confirm table rows match selected filters.
9. Refresh browser.
10. Confirm same filters and rows are restored.

---

## 15. Implementation Order

Recommended order for a lower-capability implementation agent:

1. Add backend table config whitelist.
2. Implement query parsing helper.
3. Implement safe SQL where builder.
4. Implement rows API.
5. Test rows API with simple filters.
6. Implement one filter option query for one filter.
7. Generalize filter option query for all filters.
8. Implement filter options API response shape.
9. Add frontend `filterOptions` state.
10. Replace static options with API options.
11. Add debounced filter option refresh when `selectedFilters` changes.
12. Change rows to fetch from rows API.
13. Connect `조회` button to rows API.
14. Add loading and error UI.
15. Test URL restore.
16. Test CEID menu.

Do not implement CSV export first. CSV depends on the same applied filter query and can be added after rows and filter options are stable.

---

## 16. Acceptance Criteria

The feature is complete when all of the following are true:

1. Dashboard filter values come from backend API, not hardcoded frontend arrays.
2. Selecting one filter value updates other filter lists.
3. Each filter option list is calculated while excluding that filter's own selected values.
4. Table rows are fetched from backend rows API.
5. Rows are fetched only when user clicks `조회`, except initial auto-load tables.
6. URL refresh restores dashboard menu, filters, page, page size, and sort.
7. Backend uses table, column, filter, and sort whitelists.
8. Backend uses parameterized SQL.
9. Large filter lists are limited.
10. Build succeeds.

