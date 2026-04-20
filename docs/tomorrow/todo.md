# Tomorrow TODO - Dashboard Table Viewer

## Goal

회사 환경에서 Dashboard Table Viewer를 실제 API와 연결할 수 있도록 구현을 이어간다.

현재 로컬 Vue 프로토타입에는 다음 UI 흐름이 반영되어 있다.

- 대시보드별 기본 테이블 개념
- 3번째 대시보드 `CEID 매핑`
- 4번째 대시보드 `LINE별 보기`
- CEID 매핑 컬럼: `eqp_id`, `ceid`, `rpt`, `rpt_order`, `vid_list`
- 페이지네이션 UI
- 조회 버튼
- draft 필터와 applied 필터 분리

## 1. Start From The Spec

먼저 아래 문서를 기준으로 전체 방향을 확인한다.

```text
docs/dashboard-table-viewer-web-spec.md
```

특히 확인할 섹션:

- `5.1 Dashboard-To-Table Mapping`
- `6.3 Search`
- `6.6 Current Vue Prototype Pagination Behavior`
- `15.1 Vue Prototype Change Notes`

## 2. Dashboard Order

대시보드 메뉴 순서는 아래처럼 맞춘다.

```text
1. 설비 TC 현황
2. 설비 TC 파라미터
3. CEID 매핑
4. LINE별 보기
5. 표시 설정
```

회사 프로젝트에서 사이드바 또는 탭 메뉴가 별도로 있다면 동일한 순서로 맞춘다.

## 3. Default Table Mapping

각 대시보드는 기본 테이블을 가진다.

```text
1번째 대시보드 -> TC_EQUIPMENT
2번째 대시보드 -> TC_EQP_PARAM
3번째 대시보드 -> TC_EQP_RELINK
```

동작 규칙:

- `TC_EQUIPMENT`: 필터 없이 자동 조회 가능
- `TC_EQP_PARAM`: 필터 입력 전 자동 조회 금지
- `TC_EQP_RELINK`: 필터 입력 전 자동 조회 금지

## 4. CEID Mapping Table

3번째 대시보드 `CEID 매핑`은 아래 컬럼을 사용한다.

```text
eqp_id
ceid
rpt
rpt_order
vid_list
```

샘플 표시 형태:

```text
eqp_id | ceid | rpt | rpt_order | vid_list
ABC123 | 1231 | 10  | 0         | 101,205,309,412,518
ABC123 | 1231 | 10  | 1         | 102,206,310,413,519
ABC123 | 1231 | 10  | 2         | 103,207,311,414,520
...
ABC123 | 1231 | 10  | 10        | 111,215,319,422,528
```

주의:

- `rpt`는 숫자 값이다.
- `rpt_order`는 `0`부터 `10`까지 순서대로 표시 가능해야 한다.
- `vid_list`는 숫자를 comma로 나열한 문자열이다.
- 실제 API 응답 컬럼명이 대문자이면 화면 표시명만 소문자로 맞추거나, 매핑 함수를 둔다.

## 5. Query Button Behavior

필터 변경만으로 API를 호출하지 않는다.

상태를 두 개로 분리한다.

```text
draftFilters 또는 selectedFilters
appliedFilters
```

역할:

```text
draftFilters: 사용자가 현재 입력/선택 중인 값
appliedFilters: 마지막 조회에 실제 적용된 값
```

동작:

```text
필터 선택
-> draftFilters만 변경
-> API 호출 없음
-> "변경된 필터가 있습니다" 표시

조회 클릭
-> draftFilters를 appliedFilters로 복사
-> page=1
-> API 호출
```

## 6. Initial Load Behavior

대시보드 진입 시:

```text
GET /api/v1/tables
```

응답에서 현재 대시보드의 기본 테이블이 존재하는지 확인한다.

### TC_EQUIPMENT

필터 필수가 아니므로 자동 조회한다.

```text
GET /api/v1/tables/TC_EQUIPMENT?page=1&page_size=50
```

### TC_EQP_PARAM

필터 필수이므로 자동 조회하지 않는다.

표시 문구:

```text
필터를 하나 이상 입력해야 조회할 수 있습니다.
```

### TC_EQP_RELINK

필터 필수이므로 자동 조회하지 않는다.

표시 문구:

```text
필터를 하나 이상 입력해야 조회할 수 있습니다.
```

## 7. Pagination Behavior

실제 API 버전에서는 서버 페이지네이션을 사용한다.

페이지 이동:

```text
GET /api/v1/tables/{table_name}?page={page}&page_size={page_size}&{appliedFilters}
```

페이지당 건수 변경:

```text
page=1로 초기화
appliedFilters 유지
API 재호출
```

권장 page size:

```text
25
50
100
200
```

UI 표시:

```text
총 {total}건
{page} / {pages} 페이지
페이지당 {page_size}건
```

## 8. Download Behavior

다운로드는 현재 적용된 필터 기준으로 수행한다.

```text
GET /api/v1/tables/{table_name}/download?format=excel&{appliedFilters}
GET /api/v1/tables/{table_name}/download?format=csv&{appliedFilters}
```

주의:

- draft 필터가 아니라 applied 필터 기준으로 다운로드한다.
- 사용자가 필터를 바꿨지만 조회를 누르지 않은 상태라면, 기존 조회 조건 기준으로 다운로드된다.
- 이 상태가 헷갈릴 수 있으므로 `변경된 필터가 있습니다` 문구를 유지한다.

## 9. Implementation Checklist

- [ ] 회사 프로젝트의 대시보드 컴포넌트 위치 확인
- [ ] 사이드바 또는 탭 메뉴 순서 변경
- [ ] 대시보드별 default table mapping 추가
- [ ] `/api/v1/tables` 호출 추가
- [ ] 기본 테이블 whitelist 검증
- [ ] `requires_where`에 따른 자동 조회 여부 분기
- [ ] 필터 UI를 table metadata 기반으로 생성
- [ ] draft/applied 필터 상태 분리
- [ ] 조회 버튼 추가
- [ ] 조회 클릭 시 page=1로 API 호출
- [ ] 페이지 이동 시 applied 필터 기준으로 API 호출
- [ ] page size 변경 시 page=1로 API 호출
- [ ] CEID 매핑 컬럼을 `eqp_id`, `ceid`, `rpt`, `rpt_order`, `vid_list`로 맞춤
- [ ] 다운로드는 applied 필터 기준으로 호출
- [ ] 빈 결과, 로딩, 에러 상태 확인
- [ ] 모바일에서 테이블 가로 스크롤 확인
- [ ] 빌드 실행

## 10. Manual Test Cases

### TC_EQUIPMENT

- [ ] 첫 번째 대시보드 진입 시 자동 조회된다.
- [ ] 필터 선택만으로 API가 호출되지 않는다.
- [ ] 조회 버튼 클릭 시 필터가 적용된다.
- [ ] 다음 페이지 클릭 시 같은 필터로 page만 변경된다.
- [ ] page size 변경 시 1페이지로 돌아간다.

### TC_EQP_PARAM

- [ ] 두 번째 대시보드 진입 시 자동 조회되지 않는다.
- [ ] 필터 없이 조회가 막힌다.
- [ ] 필터 입력 후 조회가 가능하다.
- [ ] 페이지 이동 시 applied 필터가 유지된다.

### TC_EQP_RELINK / CEID Mapping

- [ ] 세 번째 대시보드가 CEID 매핑으로 표시된다.
- [ ] 컬럼 순서가 `eqp_id`, `ceid`, `rpt`, `rpt_order`, `vid_list`다.
- [ ] `rpt_order`가 0부터 10까지 정상 표시된다.
- [ ] `vid_list`가 comma-separated 숫자 문자열로 표시된다.
- [ ] 필터 없이 자동 조회되지 않는다.

## 11. Notes For Company AI Agent

기존 프로젝트 스타일을 우선한다.

새 라이브러리는 추가하지 않는다.

필터 변경 즉시 API 호출하는 구조로 만들지 않는다.

대용량 테이블은 반드시 조회 버튼을 통해 조건 확정 후 호출한다.

서버 페이지네이션을 사용하고, 전체 데이터를 프론트에 받아서 자르지 않는다.
