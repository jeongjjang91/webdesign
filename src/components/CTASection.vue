<template>
  <section id="start" class="py-28 relative overflow-hidden">
    <!-- Glow -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-accent/12 blur-[100px]"></div>
    </div>

    <div class="relative z-10 max-w-3xl mx-auto px-6 text-center">
      <div class="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8 reveal">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span class="text-xs font-semibold text-accent/90">현재 베타 슬롯 12개 남음</span>
      </div>

      <h2 class="text-5xl font-bold tracking-tight mb-6 reveal reveal-delay-1">
        지금 바로 시작하세요.<br />
        <span class="text-gradient">2주 무료 체험.</span>
      </h2>

      <p class="text-[#9CA3B0] text-[17px] leading-relaxed mb-10 reveal reveal-delay-2">
        신용카드 불필요 · 설치 지원 포함 · 언제든 해지 가능<br />
        전담 온보딩 엔지니어가 처음부터 끝까지 함께합니다.
      </p>

      <!-- Form -->
      <div class="glass-card rounded-2xl p-6 mb-6 reveal reveal-delay-3">
        <div class="grid md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="담당자 성함"
            class="bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-muted outline-none focus:border-accent/50 transition-colors w-full"
          />
          <input
            type="text"
            placeholder="회사명"
            class="bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-muted outline-none focus:border-accent/50 transition-colors w-full"
          />
        </div>
        <div class="grid md:grid-cols-2 gap-3 mb-3">
          <input
            type="email"
            placeholder="업무용 이메일"
            class="bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-muted outline-none focus:border-accent/50 transition-colors w-full"
          />
          <select
            class="bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-muted outline-none focus:border-accent/50 transition-colors w-full appearance-none"
          >
            <option value="" disabled selected>임직원 규모</option>
            <option>50명 미만</option>
            <option>50~200명</option>
            <option>200~1000명</option>
            <option>1000명 이상</option>
          </select>
        </div>
        <button
          class="w-full bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-accent/90 transition-all duration-200 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5 text-[15px]"
        >
          무료 체험 신청하기 →
        </button>
      </div>

      <p class="text-[12px] text-muted reveal reveal-delay-4">
        신청 후 영업일 기준 1일 이내 담당자가 연락드립니다.
      </p>
    </div>
  </section>
</template>
