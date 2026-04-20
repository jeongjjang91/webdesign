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
- URL query 상태 복원
- 컬럼 정렬
- 셀 값 복사
- 챗봇 thinking indicator

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

## 9. URL Query Sync

현재 대시보드 상태를 URL query에 반영한다.

목적:

- 새로고침 후에도 같은 대시보드 상태를 복원한다.
- 특정 조회 조건을 링크로 공유할 수 있게 한다.
- 회사 AI agent가 실제 라우터에 같은 구조를 연결할 수 있게 한다.

권장 query 형태:

```text
?page=dashboard
&menu=priority
&table_page=2
&page_size=50
&sort_by=rpt_order
&sort_order=asc
&filter_eqp_id=ABC123
&filter_ceid=1231
&filter_rpt=10
```

로컬 Vue 프로토타입에서는 camelCase key를 쓰고 있으므로 아래처럼 동작할 수 있다.

```text
?page=dashboard
&menu=priority
&table_page=2
&page_size=10
&sort_by=rptOrder
&sort_order=asc
&filter_eqpId=ABC123
&filter_ceId=1231
&filter_rpt=10
```

회사 API 연결 시에는 백엔드 컬럼명과 맞춰 snake_case 또는 실제 API 필드명으로 변환한다.

주의:

- URL에는 applied 필터만 반영한다.
- 사용자가 선택 중인 draft 필터는 `조회` 전까지 URL에 반영하지 않는다.
- `page`는 앱 페이지용으로 사용한다.
- 테이블 페이지 번호는 `table_page`를 사용해 충돌을 피한다.
- 회사 보안상 URL에 남기면 안 되는 값은 query에 넣지 않는다.

구현 방식:

- Vue Router가 있으면 `router.replace({ query })` 사용
- Vue Router가 없으면 `window.history.replaceState` 사용
- 잘못된 query 값은 무시하고 기본값으로 복원

## 10. Column Sorting

테이블 헤더 클릭으로 정렬을 지원한다.

동작:

```text
첫 클릭: 오름차순
두 번째 클릭: 내림차순
세 번째 클릭: 정렬 해제
```

로컬 프로토타입 처리 순서:

```text
원본 데이터
-> appliedFilters 적용
-> sort_by / sort_order 적용
-> pagination 적용
-> 현재 페이지 표시
```

실제 API 버전 처리:

```text
헤더 클릭
-> sort_by, sort_order 변경
-> page=1
-> API 호출
```

요청 예시:

```text
GET /api/v1/tables/TC_EQP_RELINK?page=1&page_size=50&EQP_ID=ABC123&sort_by=rpt_order&sort_order=asc
```

주의:

- 실제 API 버전에서는 프론트에서 현재 페이지 데이터만 정렬하면 안 된다.
- 전체 결과 기준 정렬이 되도록 서버에 정렬 파라미터를 보내야 한다.
- 백엔드는 `sort_by`가 허용된 컬럼인지 검증해야 한다.

## 11. Cell Copy

셀 영역의 값을 복사할 수 있게 한다.

동작:

- 셀 hover 시 복사 버튼 표시
- 클릭 시 해당 셀 값만 plain text로 복사
- 복사 성공 시 짧게 check 표시
- `vid_list`처럼 긴 문자열도 그대로 복사

주의:

- HTML을 복사하지 않는다.
- 숨겨진 metadata를 복사하지 않는다.
- null 값은 빈 문자열로 처리한다.
- 범위 복사는 이번 범위에 포함하지 않는다.

## 12. Chat Thinking Indicator

챗봇 응답이 시작되었지만 아직 첫 글자가 표시되기 전에는 thinking indicator를 보여준다.

최종 문구:

```text
생각하는 중이에요...
```

최종 디자인:

- 텍스트만 표시한다.
- 동그란 orb는 사용하지 않는다.
- 별도 카드처럼 크게 감싸지 않는다.
- Soft White와 Bright Cyan 조합을 사용한다.
- 그라데이션 하이라이트가 왼쪽에서 오른쪽으로 흐르는 느낌을 준다.
- 애니메이션이 반복될 때 끊기는 느낌이 없도록 대칭 그라데이션을 사용한다.

색상:

```text
Soft White: #F4F7FB
Bright Cyan: #22D3EE
```

표시 조건:

```text
assistant message
streaming === true
content가 비어 있음
```

흐름:

```text
사용자 메시지 전송
-> assistant streaming 메시지 생성
-> content가 비어 있으면 "생각하는 중이에요..." 표시
-> 첫 token/content가 들어오면 일반 assistant bubble로 전환
```

접근성:

```text
role="status"
aria-live="polite"
```

CSS 핵심:

```text
background-clip: text
color: transparent
linear-gradient(Soft White, Bright Cyan, Soft White)
background-position 100% -> 0%
animation duration: 2.1s
letter-spacing: 0
```

구현 주의:

- 기존 assistant bubble이 빈 상태로 렌더링되지 않게 `v-if` / `v-else` 구조를 사용한다.
- 스트리밍 첫 글자가 나오면 thinking indicator는 사라져야 한다.
- 로딩 orb, bokeh, 별도 장식 요소는 추가하지 않는다.

## 13. Implementation Checklist

- [x] TC Assistant 브랜드/봇/파비콘 아이콘을 새 육각형 궤도 아이콘으로 통일
- [x] 미사용 아이콘 파일 정리
- [x] 아이콘 구조적 의미와 쌍성 시스템 메타포를 `design.md`에 문서화
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
- [ ] URL query에서 dashboard state 복원
- [ ] applied 필터, 페이지, page size, 정렬 상태를 URL에 반영
- [ ] 컬럼 헤더 클릭 정렬 추가
- [ ] 실제 API 버전에서는 sort_by/sort_order를 서버로 전달
- [ ] 셀 값 복사 버튼 추가
- [ ] 복사 성공 피드백 추가
- [ ] 챗봇 streaming 시작 시 thinking indicator 표시
- [ ] thinking indicator가 첫 content 수신 후 사라지는지 확인
- [ ] Soft White/Bright Cyan 그라데이션 방향 확인
- [ ] thinking indicator 접근성 속성 확인
- [ ] 빈 결과, 로딩, 에러 상태 확인
- [ ] 모바일에서 테이블 가로 스크롤 확인
- [ ] 빌드 실행

## 14. Manual Test Cases

### TC_EQUIPMENT

- [ ] 첫 번째 대시보드 진입 시 자동 조회된다.
- [ ] 필터 선택만으로 API가 호출되지 않는다.
- [ ] 조회 버튼 클릭 시 필터가 적용된다.
- [ ] 다음 페이지 클릭 시 같은 필터로 page만 변경된다.
- [ ] page size 변경 시 1페이지로 돌아간다.
- [ ] 새로고침 후 URL query 기준으로 상태가 복원된다.

### TC_EQP_PARAM

- [ ] 두 번째 대시보드 진입 시 자동 조회되지 않는다.
- [ ] 필터 없이 조회가 막힌다.
- [ ] 필터 입력 후 조회가 가능하다.
- [ ] 페이지 이동 시 applied 필터가 유지된다.
- [ ] 정렬 시 page=1로 돌아간다.

### TC_EQP_RELINK / CEID Mapping

- [ ] 세 번째 대시보드가 CEID 매핑으로 표시된다.
- [ ] 컬럼 순서가 `eqp_id`, `ceid`, `rpt`, `rpt_order`, `vid_list`다.
- [ ] `rpt_order`가 0부터 10까지 정상 표시된다.
- [ ] `vid_list`가 comma-separated 숫자 문자열로 표시된다.
- [ ] 필터 없이 자동 조회되지 않는다.
- [ ] `rpt_order` 컬럼 정렬이 정상 동작한다.
- [ ] `vid_list` 셀 복사가 정상 동작한다.
- [ ] 공유 URL로 같은 CEID 매핑 상태가 열린다.

### URL / Sort / Copy

- [ ] URL query에 draft 필터가 아니라 applied 필터가 반영된다.
- [ ] `조회` 전 필터 변경은 URL에 반영되지 않는다.
- [ ] 정렬 상태가 URL에 반영된다.
- [ ] 페이지 번호가 `table_page`로 반영된다.
- [ ] 셀 복사 시 plain text만 클립보드에 들어간다.

### Chat Thinking Indicator

- [ ] 사용자 메시지 전송 직후 `생각하는 중이에요...`가 표시된다.
- [ ] 첫 응답 글자가 나오면 thinking indicator가 사라진다.
- [ ] 동그란 orb가 표시되지 않는다.
- [ ] 그라데이션 하이라이트가 왼쪽에서 오른쪽으로 흐른다.
- [ ] 애니메이션 반복 지점이 눈에 띄게 끊기지 않는다.
- [ ] 다크 UI에서 텍스트가 충분히 읽힌다.

## 15. Notes For Company AI Agent

기존 프로젝트 스타일을 우선한다.

새 라이브러리는 추가하지 않는다.

필터 변경 즉시 API 호출하는 구조로 만들지 않는다.

대용량 테이블은 반드시 조회 버튼을 통해 조건 확정 후 호출한다.

서버 페이지네이션을 사용하고, 전체 데이터를 프론트에 받아서 자르지 않는다.

정렬은 실제 API 연결 시 서버 정렬로 전환한다.

URL query에는 보안상 남겨도 되는 값만 넣는다.

챗봇 thinking indicator는 텍스트 중심으로 유지하고, 장식용 orb를 다시 추가하지 않는다.
