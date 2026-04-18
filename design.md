# TC Assistant Design Documentation

## 1. 프로젝트 개요

이 프로젝트는 Vue 3, Vite, Tailwind CSS 기반의 사내 AI 어시스턴트 웹앱입니다. 초기 랜딩 페이지 성격의 화면에서 출발했지만, 현재는 다음 두 축을 함께 가진 구조로 확장되었습니다.

- TC AI Bot을 소개하는 홈 화면
- 사이드바 기반의 업무형 앱 화면
- 채팅 페이지
- 대시보드 페이지
- 기능, 적용 계획, 활용 사례, 후기, 개발 이력, 시작하기 섹션

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

### 3.4 버튼

주요 CTA 버튼은 `src/assets/main.css`의 공용 클래스 `app-cta`를 사용합니다.

기본 구조:

```html
<button class="app-cta">
  <span class="app-cta__glow"></span>
  <span class="app-cta__content">
    버튼 문구
    <svg class="app-cta__icon">...</svg>
  </span>
</button>
```

스타일 원칙:

- 기본 버튼은 `bg-slate-900`, `border-white/10`, `rounded-xl`, `font-bold`, `text-white`를 사용합니다.
- Hover 시 `translateY(-2px)`, `border-color: rgba(14,165,233,0.5)`, `box-shadow: 0 0 20px rgba(14,165,233,0.3)`를 적용합니다.
- 내부에는 `linear-gradient(to top right, rgba(14,165,233,0.2), transparent)` glow layer를 두고 hover 시 opacity를 올립니다.
- 오른쪽 화살표 아이콘이 있는 경우 `app-cta__icon`을 사용해 hover 시 `translateX(0.25rem)`로 살짝 이동합니다.
- 폭이 꽉 차는 버튼은 `app-cta--wide`, 작은 버튼은 `app-cta--sm`, 아이콘 전용 버튼은 `app-cta--icon`을 함께 사용합니다.

현재 적용된 주요 버튼:

- 사이드바 `새로운 채팅`
- 홈 `채팅 시작`
- 기능 카드 `로그 다운로드 열기`
- 채팅 입력 전송
- 대시보드 `CSV 다운로드`
- 로그 다운로드 페이지 `다운로드 패키지 생성`
- 설정 팝업 `저장`
- CTA 섹션 `도입 상담 신청하기`

## 4. 전체 레이아웃

### 4.1 App 구조

파일: `src/App.vue`

전체 구조:

- 왼쪽 고정 사이드바: `TheSidebar`
- 오른쪽 페이지 콘텐츠: `currentPage` 상태에 따라 동적 컴포넌트 렌더링
- 페이지 전환: Vue `<Transition name="fade" mode="out-in" appear>`

전환 애니메이션:

- 단순 opacity fade가 아니라 `opacity + scale`을 함께 사용합니다.
- 전환 시간은 `0.2s`로 짧게 유지하여 앱이 기민하게 느껴지도록 합니다.
- easing은 `cubic-bezier(0.4, 0, 0.2, 1)`을 사용합니다.
- 진입 시 `scale(0.98)`에서 시작해 자연스럽게 원래 크기로 올라옵니다.
- 퇴장 시 `scale(1.02)`로 살짝 커지며 사라집니다.
- `appear`를 사용하여 첫 진입 시에도 같은 전환 느낌을 제공합니다.
- `mode="out-in"`을 유지해 이전 페이지가 사라진 뒤 새 페이지가 들어오게 하며, 전환 중 레이아웃 겹침을 줄입니다.
- 전환 대상 컴포넌트에는 `min-h-0 w-full flex-1 overflow-y-auto`를 적용해 스크롤 영역과 크기 계산을 안정화합니다.
- 부모 `main`은 `h-screen overflow-hidden flex flex-col`을 유지해 전환 중 스크롤바 흔들림을 줄입니다.
- 채팅 페이지는 `chatSessionKey`를 포함한 별도 컴포넌트 키를 사용합니다. 같은 `chat` 페이지 안에서 `새로운 채팅`을 다시 눌러도 `ChatbotPage`가 새로 마운트되어 이전 대화 상태가 남지 않습니다.

현재 CSS:

```css
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center top;
  will-change: opacity, transform;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
```

페이지 맵:

- `home`: 홈 화면
- `dashboard`: 대시보드
- `features`: 기능
- `log-download`: 사내 로그 즉시 Download
- `how`: 적용 계획
- `usecases`: 활용 사례
- `testimonials`: 후기
- `security`: 개발 이력
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
- 최근 대화 삭제
- 메인 내비게이션
- 하단 로그인 정보

현재 사이드바 메뉴:

- 홈
- 대시보드
- 기능
- 적용 계획
- 활용 사례
- 후기
- 개발 이력
- 시작하기

로그인 정보:

- 예시 사용자: 정근
- 이메일: `jg91.jang@samsung.com`
- 아바타: `JG`
- 설정 아이콘: 계정 및 권한 관리 팝업을 엽니다.

디자인 의도:

- 앱형 UI처럼 항상 좌측에 고정합니다.
- 최근 대화는 `새로운 채팅` 아래에서 바로 이어지며, 펼치기 시 짧은 대화 미리보기를 제공합니다.
- 최근 대화 제목 아래에 `최대 3시간까지 보관` 안내 문구를 표시합니다.
- 최근 대화의 삭제 버튼을 누르면 해당 항목을 목록에서 제거합니다. 펼쳐진 대화를 삭제하면 펼침 상태도 함께 초기화합니다.
- 최근 대화가 모두 삭제되면 빈 상태 안내 문구를 표시합니다.
- 로그인 정보는 왼쪽 아래에 고정되어 사용자가 현재 계정 상태를 인지할 수 있게 합니다.

설정 팝업:

- 사이드바 하단의 설정 아이콘을 누르면 `Teleport` 기반 모달이 열립니다.
- 모달은 배경 클릭, 닫기 버튼, `Escape` 키로 닫을 수 있습니다.
- 탭 구성은 `계정`, `권한`, `기능`, `기타`입니다.
- `계정` 탭은 사용자 이름, 이메일, 역할, 소속, 로그인 방식, 최근 접속 정보를 표시합니다.
- `권한` 탭은 관리자 권한, 대시보드 접근, 민감 데이터 조회 같은 권한 토글을 제공합니다.
- `기능` 탭은 DB 조회 자동화, 문서 검색 RAG, Splunk 로그 분석, LLM Wiki 축적 같은 TC AI Bot 기능 토글을 제공합니다.
- `기타` 탭은 주간 요약 알림, 품질 저하 알림, 대화 기록 보존 같은 운영 옵션을 제공합니다.
- 현재는 프론트엔드 상태만 변경하며, 저장 버튼은 모달을 닫는 동작까지 구현되어 있습니다. 이후 API 연결 시 저장 핸들러를 확장합니다.

### 4.3 적용 계획

파일: `src/components/HowItWorksSection.vue`

기존 `도입 방법` 메뉴는 `적용 계획`으로 변경했습니다. 이 페이지는 TC AI Bot을 사내 TC 시스템 VOC 대응 자동화에 단계적으로 적용하는 계획을 설명합니다.

상단 문구:

- 제목: `TC AI Bot 적용 계획`
- 설명: `사내 TC 시스템 VOC 대응을 자동화하기 위해 DB 조회, 문서 검색, 로그 분석, 지식 축적 순서로 단계적으로 기능을 확장합니다.`

단계 구성:

1. `DB 조회 자동화 (Text-to-SQL)`
   - 가장 빈도가 높은 "설비 기능 존재 여부"와 "설비 간 비교" VOC를 Oracle DB 자동 조회로 처리합니다.
   - FastAPI 백엔드 골격 및 Vue.js 챗봇 SSE 연동
   - Text-to-SQL 파이프라인 구축 (Schema RAG, Value Retrieval, 자동 검증)
   - Golden Dataset 30개 기반 품질 회귀 테스트 체계 수립

2. `문서 기반 기능 설명 (RAG)`
   - Confluence 등 내부 문서를 검색해 "기능 설명" 유형 VOC에 자동 응답합니다.
   - Hybrid 검색(BM25 + Vector) 및 Cross-encoder Reranking 적용
   - Contextual Retrieval로 청크별 컨텍스트 자동 생성 및 색인
   - 멀티 Agent Orchestrator 구성 (DB + Doc 복합 질문 처리)

3. `로그 분석 반자동화 (Splunk)`
   - 설비 오동작 원인을 Splunk 로그 패턴 분석으로 초안 생성하고 검토자가 승인 후 발송합니다.
   - SPL 자동 생성 및 로그 패턴 라이브러리 구축
   - Confidence 기반 자동/반자동 라우팅 및 검토 큐 운영
   - 도메인 패턴 DB 누적으로 진단 정확도 지속 개선

4. `지식 축적 및 품질 자동화 (LLM Wiki)`
   - 검토된 답변을 구조화하여 축적하고, 품질 지표 대시보드로 운영 안정성을 확보합니다.
   - 검토 완료 답변 자동 적재 및 유사 질문 재활용 (Knowledge Agent)
   - RAGAS 기반 품질 지표 CI 자동화 및 회귀 감지
   - 응답 latency, 정확률, 피드백 비율 운영 대시보드 구축

레이아웃:

- 4단계 순서를 명확하게 읽을 수 있도록 `1 -> 2 -> 3 -> 4` 세로 타임라인 구조를 사용합니다.
- 전체 섹션 배경은 스마트 팩토리/데이터 흐름 톤에 맞춰 `bg-[#020617]`을 사용합니다.
- 좌측에는 `01`부터 `04`까지 번호가 적힌 원형 노드를 배치합니다.
- 노드를 관통하는 세로 점선은 `timeline-list::before`로 구현하며, 첫 번째 노드 중심에서 시작해 네 번째 노드 중심에서 끝나도록 `top`/`bottom`을 조정합니다.
- 점선에는 `timeline-flow` 애니메이션을 적용하여 위에서 아래로 데이터가 천천히 흐르는 느낌을 줍니다.
- 각 단계는 우측 카드에 제목, 단계 이름, 설명 문구, 체크리스트를 배치합니다.
- 카드 우측 상단에는 작은 `TcAiBotIcon`을 배치해 시스템 정체성을 강화합니다.
- 세부 항목은 데스크톱에서 `md:grid-cols-3`으로 배치하여 카드 내부 정보 밀도를 안정화합니다.
- 현재 진행 중인 단계는 `roadmap-node-active`로 지정해 01 노드에 더 강한 glow와 pulse를 적용합니다.
- 상단 설명 문구가 사라져 보이지 않도록 헤더 폭을 `max-w-3xl`, 설명 문구 폭을 `max-w-2xl`로 조정하고 텍스트 대비를 `#B8C0CF`로 올립니다.
- 긴 기술 용어가 어색하게 끊기지 않도록 전체 컨테이너를 `max-w-7xl`로 넓히고, 제목은 `leading-snug`, 리스트는 `leading-relaxed`를 사용합니다.
- 카드 간격은 `gap-8`, 리스트 텍스트는 `text-[12.5px]`로 조정해 긴 항목이 과하게 줄바꿈되지 않게 합니다.
- 각 단계는 기존 카드/번호/체크리스트 패턴을 유지해 전체 디자인 톤과 일관성을 맞춥니다.
- 하단 `적용 계획 상세 논의하기` 버튼은 적용 계획 관리 팝업을 엽니다.
- 팝업에서는 단계 추가, 수정, 삭제가 가능합니다. 단계 라벨, 제목, 설명, 체크리스트, 색상, 현재 진행 중 표시를 편집할 수 있습니다.
- 기본 단계 데이터는 `HowItWorksSection.vue` 안의 `defaultSteps` 배열로 코드 관리합니다. 별도 DB 없이 운영 가능하며, 화면에서 편집한 내용은 현재 브라우저 세션의 프론트엔드 상태에 즉시 반영됩니다.
- 새로고침 후에도 영구 반영하려면 `defaultSteps` 배열을 코드에서 수정하거나, 이후 `localStorage` 또는 API 저장소를 연결합니다.

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

- `TC AI Bot`으로 명칭 통일
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

## 6. 기능 페이지

파일:

- `src/components/FeaturesSection.vue`
- `src/components/LogDownloadPage.vue`

첫 번째 기능 카드는 `사내 문서 즉시 검색 & 요약`에서 `사내 로그 즉시 Download`로 변경했습니다.

반영 내용:

- 제목: `사내 로그 즉시 Download`
- 설명: LineID, EQPID, 날짜, 로그 유형, TBL 로그 병합 여부, 메일주소를 기준으로 장애 분석과 VOC 대응에 필요한 원본 로그를 빠르게 확보하는 기능으로 변경
- 미니 데모는 문서 검색 결과 대신 다운로드 패키지 생성 상태와 로그 파일 목록을 표시
- 카드 하단에 `로그 다운로드 열기` 버튼 추가
- 버튼은 공용 CTA 클래스 `app-cta`를 사용합니다. Hover 시 살짝 떠오르고, accent border와 blue glow shadow, 내부 gradient glow layer가 나타납니다.
- 버튼 클릭 시 `App.vue`의 `navigateTo('log-download')` 흐름으로 새 기능 상세 페이지로 전환

상세 페이지 구성:

- 상단: `기능으로 돌아가기` 버튼, 페이지 제목, 운영 지표
- 다운로드 조건: LineID, EQPID, 날짜, 로그 유형, TBL 로그 병합, 메일주소, 요청 사유
- LineID와 EQPID는 검색형 드롭다운으로 제공하여 드롭다운 안에서 검색한 뒤 옵션을 선택합니다.
- 날짜는 브라우저 기본 캘린더를 사용하며, 선택 가능 범위는 오늘부터 1개월 전까지로 제한합니다.
- 메일주소 기본값은 사이드바 계정 이메일과 동일한 `jg91.jang@samsung.com`을 사용합니다.
- 생성 파일: 패키지에 포함될 로그 파일 미리보기
- 요청 상태: 권한 확인, 파일 구성, 다운로드 준비 단계
- 최근 다운로드: 완료된 로그 다운로드 이력

현재는 프론트엔드 예시 화면이며, `다운로드 패키지 생성` 버튼을 누르면 요청 상태만 화면 안에서 갱신됩니다. 실제 다운로드 API는 이후 저장/생성 핸들러에 연결합니다.

## 7. 채팅 페이지

파일: `src/components/ChatbotPage.vue`

변경 사항:

- 헤더 이름: `TC AI Bot`
- 첫 인사말: `TC AI Bot 입니다 무엇을 도와드릴까요?`
- 홈에서 전달받은 `initialPrompt`가 있으면 페이지 진입 시 자동 전송
- 사용자 메시지 추가 후 AI 응답이 스트리밍되는 방식 유지
- 새 채팅으로 컴포넌트가 다시 마운트될 때 이전 스트리밍 타이머가 남지 않도록 unmount 시 타이머를 정리합니다.

현재는 데모 응답 배열에서 무작위 응답을 선택합니다.
실제 API 연결은 아직 없습니다.

## 8. 대시보드 디자인

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

- 설비 TC 현황
- 설비 TC 파라미터
- LINE별 보기
- CEID 매핑
- 표시 설정

디자인:

- 기존 메인 사이드바 옆에 붙는 보조 메뉴
- `xl` 이상에서 sticky 동작
- 선택된 메뉴는 `bg-accent/10 text-accent`

메뉴 전환 효과:

- 상단 콘텐츠 패널에 `fade + slide` 전환
- `LINE별 보기` 차트 카드는 순차적으로 짧게 등장
- 테이블은 흔들리지 않게 유지

### 7.3 LINE별 보기 차트

`LINE별 보기` 메뉴에서만 상단 차트 카드가 표시됩니다.

차트 카드:

- LINE별 TC 추이: SVG 라인 차트
- MODEL별 비중: CSS conic-gradient 도넛 차트
- LINE별 설비 수: 가로 막대 차트

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

- LINEID
- EQPID
- SERVER MODEL
- DCOP MODEL

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
  - 예: LINEID가 LINE-01 또는 LINE-02
- 서로 다른 필터 그룹 간에는 AND 조건입니다.
  - 예: LINEID가 LINE-01/LINE-02이고 SERVER MODEL이 SRV-A100

### 7.5 테이블

현재 테이블은 설비 TC 현황 중심의 10개 컬럼 구조입니다.

컬럼:

- 설비
- LINEID
- SERVER MODEL
- DCOP MODEL
- TC VERSION
- 상태
- 담당자
- 최근 동기화
- 업데이트

데이터:

- 기본 예시 5개
- 생성 예시 28개
- 총 33개 row
- 첫 번째 컬럼은 `EQPID`이며, 기존 별도 `EQPID` 컬럼은 제거했습니다.
- 가로 스크롤 시 첫 번째 `EQPID` 컬럼은 sticky로 고정합니다.
- `SERVER MODEL`, `DCOP MODEL` 필터 제목 옆에는 정보 아이콘을 표시합니다. 아이콘 hover 시 고대비 툴팁이 필터 위쪽에 표시되며, accent border와 blue glow shadow로 가독성을 높입니다.
- 정보 아이콘은 outline 형태를 유지하고 `text-accent (#0EA5E9)`, `border-accent/35`, `bg-accent/10`을 적용해 시스템 알림처럼 명확하게 보이도록 합니다.
- FastAPI 연동을 고려해 테이블 첫 컬럼도 `title` 같은 별도 표시 필드가 아니라 `tableColumns`의 `key`를 그대로 사용해 렌더링합니다. 이후 API 필드명이 확정되면 `tableColumns`와 필터 key만 맞추면 됩니다.
- 세 번째 내부 메뉴 `CEID 매핑`은 별도 테이블 구조를 사용합니다.
  - 필터: LINEID, EQPID, CEID
  - 컬럼: LINEID, EQPID, CEID, RPTID, VID LIST
  - LINEID 예시: `12`, `13`
  - EQPID 예시: `ABC123`
  - CEID 예시: `3021`, `3022`
  - RPTID 예시: `100`, `200`
  - VID LIST 예시: `1,2,3,100,1000`

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

- `AiDesk` -> `TC Assistant` 또는 `TC AI Bot`
- `AI 어시스턴트` -> `TC 어시스턴트`
- 무료 체험/데모 관련 문구 제거 또는 도입 상담 문구로 변경
- 기존 `보안` 메뉴는 `개발 이력` 메뉴로 변경했습니다. 내부 page key는 기존 `security`를 유지하지만, 화면은 개발 이력 타임라인으로 렌더링합니다.

개발 이력 페이지:

- 파일: `src/components/SecuritySection.vue`
- 수직 타임라인 스타일을 사용합니다.
- 왼쪽에는 날짜와 버전, 오른쪽에는 변경 내용을 배치합니다.
- 타임라인 노드는 포인트 컬러 Blue `#0EA5E9`를 사용합니다.
- 현재 버전 노드는 blue glow와 pulse 효과로 강조합니다.
- 변경 성격은 `New`, `Fix`, `Improvement` 배지로 구분합니다.
- 개발 이력 데이터는 컴포넌트 내부 `historyEntries` 배열로 코드 관리합니다.

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

현재는 `설비 TC 현황` 중심의 테이블을 기반으로 확장 테스트를 한 상태입니다.
