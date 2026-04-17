# TC Assistant Design Documentation

## 1. 프로젝트 개요

이 프로젝트는 Vue 3, Vite, Tailwind CSS 기반의 사내 AI 어시스턴트 웹앱입니다. 초기 랜딩 페이지 성격의 화면에서 출발했지만, 현재는 다음 두 축을 함께 가진 구조로 확장되었습니다.

- TC AI Assistant를 소개하는 홈 화면
- 사이드바 기반의 업무형 앱 화면
- 채팅 페이지
- 대시보드 페이지
- 기능, 도입 방법, 활용 사례, 후기, 보안, 시작하기 섹션

전체 디자인은 기존 프로젝트에서 이미 사용 중이던 다크 톤, Pretendard 계열 폰트, Tailwind 유틸리티, 얇은 border와 semi-transparent surface를 유지합니다.

## 2. 참고한 GitHub 디자인 스킬

사용자가 제공한 GitHub 저장소:

- https://github.com/uxjoseph/supanova-design-skill

참고한 핵심 방향:

- 기존 구조를 통째로 갈아엎지 않고 점진적으로 개선합니다.
- 한국어 UI에서는 Pretendard 기반의 자연스러운 문장과 가독성을 우선합니다.
- 표면감은 `bg-white/[0.04]`, `border-white/[0.08]`, inner shadow 등을 활용한 glass-like surface로 만듭니다.
- 인터랙션은 과장하지 않고 짧은 fade, slide, hover state를 사용합니다.
- 대시보드와 랜딩 화면은 서로 다른 정보 밀도를 가져야 합니다.
- 차트, 테이블, 필터 등 앱형 UI에서는 정보 탐색이 우선이므로 장식보다 명확성을 우선합니다.

주의해서 적용하지 않은 내용:

- Supanova 스킬은 standalone HTML 기준 설명이 많지만, 현재 프로젝트는 Vue 3 + Vite 앱이므로 그 구조를 그대로 따르지 않았습니다.
- 아이콘 시스템은 기존 프로젝트의 `@iconify/vue` + Lucide 아이콘 사용 방식을 유지했습니다.
- 차트 라이브러리는 추가하지 않았습니다. 현재 차트 예시는 SVG, CSS, Tailwind만으로 구현했습니다.

## 3. 디자인 시스템

### 3.1 색상

기존 Tailwind 확장 색상을 유지합니다.

- 배경: `#0A0A0F`
- 사이드바: `#0D0D14`
- 패널/카드: `bg-white/[0.04]`, `bg-white/[0.05]`, `bg-[#0D0D14]`
- 경계선: `border-white/[0.06]`, `border-white/[0.08]`
- 주요 포인트: `accent`, 현재 `#0EA5E9`
- 보조 텍스트: `#9CA3B0`, `#8B94A5`, `#7D8594`, `muted`

디자인 원칙:

- 전체를 어두운 단색으로만 만들지 않고, 반투명 카드와 얇은 border로 계층을 만듭니다.
- 포인트 블루는 CTA, 선택 상태, 차트 라인, 활성 필터 등에 제한적으로 사용합니다.
- 상태 색상은 의미 기반으로 사용합니다.
  - 완료: emerald
  - 진행중: accent blue
  - 검토중: amber
  - 높은 우선순위: rose

### 3.2 타이포그래피

기본 폰트는 Tailwind 설정의 `font-pretendard`를 사용합니다.

주요 규칙:

- 큰 제목: `font-bold`, `tracking-tight`, `leading-tight`
- 본문: `text-[#9CA3B0]`, `leading-relaxed`
- 지표 숫자: `tabular-nums`와 높은 대비의 흰색 사용
- 테이블 텍스트: 긴 텍스트는 `truncate`로 안정적인 행 높이 유지

### 3.3 카드와 표면

카드 스타일은 다음 패턴을 기본으로 합니다.

```html
rounded-lg border border-white/[0.08] bg-white/[0.04]
shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
```

현재 UI에서 카드가 사용되는 곳:

- 홈 숫자 지표 카드
- 홈 채팅 입력 패널
- 오른쪽 채팅 미리보기
- 대시보드 상단 지표
- 대시보드 차트 카드
- 대시보드 필터 바
- 대시보드 테이블 컨테이너
- 로그인 정보 영역

## 4. 전체 레이아웃

### 4.1 App 구조

파일: `src/App.vue`

전체 구조:

- 왼쪽 고정 사이드바: `TheSidebar`
- 오른쪽 페이지 콘텐츠: `currentPage` 상태에 따라 동적 컴포넌트 렌더링
- 페이지 전환: Vue `<Transition name="fade" mode="out-in">`

페이지 맵:

- `home`: 홈 화면
- `dashboard`: 대시보드
- `features`: 기능
- `how`: 도입 방법
- `usecases`: 활용 사례
- `testimonials`: 후기
- `security`: 보안
- `cta`: 시작하기
- `chat`: 채팅 페이지

홈에서 채팅으로 넘어갈 때는 `initialPrompt`를 전달합니다.

### 4.2 사이드바

파일: `src/components/TheSidebar.vue`

구성:

- 상단 로고: `TC Assistant`, `Beta`
- `새로운 채팅` 버튼
- 최근 대화 목록
- 최근 대화 펼치기/접기
- 메인 내비게이션
- 하단 로그인 정보

현재 사이드바 메뉴:

- 홈
- 대시보드
- 기능
- 도입 방법
- 활용 사례
- 후기
- 보안
- 시작하기

로그인 정보:

- 예시 사용자: 김지은
- 이메일: `jieun.kim@tc.co.kr`
- 아바타: `TC`
- 설정 아이콘

디자인 의도:

- 앱형 UI처럼 항상 좌측에 고정합니다.
- 최근 대화는 `새로운 채팅` 아래에서 바로 이어지며, 펼치기 시 짧은 대화 미리보기를 제공합니다.
- 로그인 정보는 왼쪽 아래에 고정되어 사용자가 현재 계정 상태를 인지할 수 있게 합니다.

## 5. 홈 화면 디자인

파일: `src/components/HeroSection.vue`

### 5.1 헤드라인

현재 핵심 카피:

- `업무 효율을`
- `10배 높이는`
- `TC 어시스턴트`

기존 `AI 어시스턴트`는 `TC 어시스턴트`로 변경했습니다.

### 5.2 숫자 지표 개선

기존 단순 텍스트 지표를 반투명 카드 형태로 변경했습니다.

현재 지표:

- `2,400+`: 활성 사용자
- `94%`: 업무 시간 절감
- `30+`: 연동 시스템

디자인 포인트:

- 숫자는 `text-white`, `font-bold`, `tabular-nums`
- 카드 배경은 `bg-white/[0.055]`
- 얇은 border와 inner highlight로 신뢰성 있는 지표 느낌 강화

### 5.3 오른쪽 채팅 미리보기

오른쪽에는 실제 제품 화면처럼 보이는 채팅 미리보기 카드가 있습니다.

반영 내용:

- `TC AI Assistant`로 명칭 통일
- 예시 대화 표시
- 하단에 `실시간 업무 절감 트렌드` 미니 스파크라인 추가

스파크라인 목적:

- 단순 챗봇이 아니라 데이터 기반 업무 솔루션이라는 인상을 줍니다.
- 대시보드 페이지와 시각적 연결성을 만듭니다.

### 5.4 홈 채팅 입력 영역

홈 하단에는 넓은 채팅 입력창이 있습니다.

구성:

- 제목: `TC 어시스턴트에게 바로 질문하기`
- 2 x 3 프롬프트 칩
- 넓은 textarea
- 입력창 우측 하단 고정 `채팅 시작` 버튼

프롬프트 칩:

- 회의록 요약
- 업무 우선순위
- 고객 답변 초안
- 문장 다듬기
- 리스크 정리
- 온보딩 문서

인터랙션:

- 칩 hover 시 약간 위로 이동
- border와 background가 더 선명해짐
- 각 칩 이모지는 서로 다른 파스텔 톤 적용
- 칩 클릭 시 입력창에 프롬프트가 타이핑되는 애니메이션으로 채워짐

채팅 연결:

- `채팅 시작` 클릭 시 홈 입력값이 `App.vue`의 `chatInitialPrompt`로 전달됩니다.
- `ChatbotPage.vue`는 `initialPrompt`를 받아 자동으로 첫 사용자 메시지로 전송합니다.

## 6. 채팅 페이지

파일: `src/components/ChatbotPage.vue`

변경 사항:

- 헤더 이름: `TC AI Assistant`
- 첫 인사말: `TC AI Assistant 입니다 무엇을 도와드릴까요?`
- 홈에서 전달받은 `initialPrompt`가 있으면 페이지 진입 시 자동 전송
- 사용자 메시지 추가 후 AI 응답이 스트리밍되는 방식 유지

현재는 데모 응답 배열에서 무작위 응답을 선택합니다.
실제 API 연결은 아직 없습니다.

## 7. 대시보드 디자인

파일: `src/components/DashboardSection.vue`

### 7.1 대시보드 전체 구조

대시보드는 앱형 화면으로 설계되어 홈보다 정보 밀도가 높습니다.

구성:

- 상단 타이틀/설명
- 상단 KPI 카드
- 왼쪽 대시보드 내부 메뉴
- 오른쪽 콘텐츠 영역
- 검색 가능한 다중선택 필터
- 활성 필터 칩
- CSV 다운로드 버튼
- 12컬럼 데이터 테이블
- 인사이트 카드

대시보드 컨테이너는 테이블 확장을 위해 `max-w-[1800px]`로 넓게 설정했습니다.

### 7.2 대시보드 내부 메뉴

대시보드 내부 메뉴는 왼쪽 컬럼에 위치합니다.

메뉴:

- 요청 현황
- 팀별 보기
- 우선순위
- 자동화 후보
- 표시 설정

디자인:

- 기존 메인 사이드바 옆에 붙는 보조 메뉴
- `xl` 이상에서 sticky 동작
- 선택된 메뉴는 `bg-accent/10 text-accent`

메뉴 전환 효과:

- 상단 콘텐츠 패널에 `fade + slide` 전환
- `팀별 보기` 차트 카드는 순차적으로 짧게 등장
- 테이블은 흔들리지 않게 유지

### 7.3 팀별 보기 차트

`팀별 보기` 메뉴에서만 상단 차트 카드가 표시됩니다.

차트 카드:

- 팀별 요청 추이: SVG 라인 차트
- 부서별 비중: CSS conic-gradient 도넛 차트
- 팀별 처리량: 가로 막대 차트

차트 라이브러리는 사용하지 않았습니다.
이유:

- 현재는 예시 UI 수준입니다.
- `apexcharts`, `vue-chartjs` 추가 없이도 충분히 표현 가능합니다.
- 패키지 의존성을 늘리지 않아도 됩니다.

향후 실제 데이터와 복잡한 차트가 필요하면 다음 라이브러리를 검토할 수 있습니다.

- `apexcharts`
- `vue3-apexcharts`
- `chart.js`
- `vue-chartjs`

### 7.4 필터

기존 select 필터를 검색 가능한 다중선택 필터로 변경했습니다.

필터 그룹:

- 부서
- 상태
- 우선순위

동작:

- 필터 버튼 클릭 시 팝오버 표시
- 팝오버 내부 검색 가능
- 여러 항목 동시 선택 가능
- 선택된 값은 칩으로 표시
- 칩 X 버튼으로 개별 제거
- 필터 그룹 안의 `선택 해제`로 해당 그룹 초기화
- `전체 해제`로 모든 필터 초기화

필터 로직:

- 각 필터 그룹은 OR 조건입니다.
  - 예: 부서가 개발팀 또는 인사팀
- 서로 다른 필터 그룹 간에는 AND 조건입니다.
  - 예: 부서가 개발팀/인사팀이고 상태가 진행중/검토중

### 7.5 테이블

현재 테이블은 12개 컬럼 테스트 구조입니다.

컬럼:

- 요청
- 요청자
- 부서
- 상태
- 우선순위
- 분류
- 채널
- 담당자
- 예상 시간
- SLA
- 생성일
- 업데이트

데이터:

- 기본 예시 8개
- 생성 예시 28개
- 총 36개 row

테이블 폭:

- 최소 폭: `1640px`
- 좁은 화면에서는 가로 스크롤
- 넓은 화면에서는 대시보드 컨테이너 폭에 맞춰 확장

세로 스크롤:

- row가 30개 이상이면 테이블 영역 자체에 `max-h-[640px]`를 적용합니다.
- 페이지 전체가 불필요하게 길어지지 않도록 테이블 내부에서 스크롤합니다.

### 7.6 CSV 다운로드

CSV 다운로드 버튼을 추가했습니다.

동작:

- 현재 필터링된 결과 기준으로 CSV 생성
- 테이블 컬럼 순서와 동일하게 다운로드
- 한글 깨짐 방지를 위해 UTF-8 BOM 추가
- 파일명 형식: `tc-dashboard-YYYY-MM-DD.csv`

현재 브라우저 API 사용:

- `Blob`
- `URL.createObjectURL`
- `<a download>`

추가 패키지는 필요하지 않습니다.

## 8. 채팅 코드블록 렌더링

채팅 응답에서 코드블록과 표가 일반 텍스트처럼 뭉개지지 않도록 렌더링을 개선했습니다.

현재 구현:

- 표는 자체 마크다운 테이블 파서로 HTML 테이블 렌더링
- 코드블록은 별도 하이라이터 없이 안전한 HTML escape 후 다크 코드 패널로 렌더링
- 코드블록 상단에 언어 라벨과 `Copy` 버튼 표시
- 코드 컨테이너는 `border`, `shadow`, toolbar를 가진 다크 패널로 표시

Shiki 적용 이후 스트리밍/렌더링 흐름이 복잡해져 채팅 응답 안정성이 떨어질 수 있어 제거했습니다.
현재는 의존성 없는 자체 렌더링으로 되돌렸고, 응답 완료 후 표와 코드블록만 HTML 형태로 정리합니다.

## 9. 다른 섹션 명칭 정리

브랜드/제품명을 다음과 같이 정리했습니다.

- `AiDesk` -> `TC Assistant` 또는 `TC AI Assistant`
- `AI 어시스턴트` -> `TC 어시스턴트`
- 무료 체험/데모 관련 문구 제거 또는 도입 상담 문구로 변경

수정된 주요 파일:

- `src/components/ChatbotPage.vue`
- `src/components/HeroSection.vue`
- `src/components/TheFooter.vue`
- `src/components/SecuritySection.vue`
- `src/components/TestimonialsSection.vue`
- `src/components/UseCasesSection.vue`
- `src/components/CTASection.vue`

## 10. 현재 패키지 점검

현재 `package.json`:

```json
{
  "dependencies": {
    "@iconify/vue": "^4.3.0",
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^6.2.6"
  }
}
```

`npm ls --depth=0` 확인 결과:

- `vue`
- `@iconify/vue`
- `@vitejs/plugin-vue`
- `vite`
- `tailwindcss`
- `autoprefixer`
- `postcss`

현재 구현 기준으로 누락된 패키지는 없습니다.

추가하지 않은 패키지:

- 차트 라이브러리: 현재 SVG/CSS 기반 예시 차트이므로 불필요
- CSV 라이브러리: 브라우저 기본 API로 충분
- 상태 관리 라이브러리: 현재는 컴포넌트 로컬 상태로 충분
- 라우터: 현재는 `currentPage` 기반의 단순 페이지 전환 구조
- 코드 하이라이터: 현재는 안정성을 위해 별도 패키지 미사용

향후 추가를 검토할 수 있는 패키지:

- 실제 라우팅이 필요하면 `vue-router`
- 전역 상태가 커지면 `pinia`
- 실제 차트가 복잡해지면 `apexcharts` 또는 `chart.js`
- 서버 API 통신이 많아지면 `axios` 또는 fetch 래퍼
- 코드 하이라이팅 품질을 다시 높일 때는 별도 렌더링 컴포넌트로 분리 검토

## 11. 빌드 및 검증

Windows PowerShell에서는 `npm run build`가 실행 정책 때문에 막힐 수 있습니다.

권장 명령:

```bash
npm.cmd run build
```

최근 확인 결과:

- `npm.cmd ls --depth=0` 정상
- `npm.cmd run build` 정상

## 12. 현재 Git 변경 요약

현재 작업 트리에는 다음 변경이 있습니다.

- `src/App.vue`
- `src/components/CTASection.vue`
- `src/components/ChatbotPage.vue`
- `src/components/HeroSection.vue`
- `src/components/SecuritySection.vue`
- `src/components/TestimonialsSection.vue`
- `src/components/TheFooter.vue`
- `src/components/TheSidebar.vue`
- `src/components/UseCasesSection.vue`
- `src/components/DashboardSection.vue`
- `design.md`

`DashboardSection.vue`와 `design.md`는 새로 추가된 파일입니다.

## 13. 향후 설계 방향

대시보드는 앞으로 메뉴별로 테이블을 별도 관리하는 구조로 바꾸는 것이 좋습니다.

권장 구조:

```js
const dashboardTables = {
  requests: {
    columns: [],
    rows: [],
    filters: [],
  },
  teams: {
    columns: [],
    rows: [],
    filters: [],
  },
  priority: {
    columns: [],
    rows: [],
    filters: [],
  },
  automation: {
    columns: [],
    rows: [],
    filters: [],
  },
  settings: {
    columns: [],
    rows: [],
    filters: [],
  },
}
```

이렇게 하면 다음이 가능해집니다.

- 메뉴별 전용 컬럼
- 메뉴별 전용 필터
- 메뉴별 CSV 다운로드
- 메뉴별 차트/요약 카드
- API 연결 시 엔드포인트 분리

현재는 `요청 현황` 중심의 테이블을 기반으로 확장 테스트를 한 상태입니다.
