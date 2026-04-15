<template>
  <section class="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden noise-overlay">
    <!-- Background gradients -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]"></div>
      <div class="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/8 blur-[100px]"></div>
      <div class="absolute top-[40%] left-[60%] w-[200px] h-[200px] rounded-full bg-blue-500/6 blur-[80px]"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
      <!-- Left: Content -->
      <div>
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8 reveal">
          <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"></span>
          <span class="text-xs font-semibold text-accent/90 tracking-wide uppercase">사내 전용 AI 플랫폼</span>
        </div>

        <!-- Headline -->
        <h1 class="text-[52px] lg:text-[64px] font-bold leading-[1.08] tracking-tight mb-6 reveal reveal-delay-1">
          업무 효율을<br />
          <span class="text-gradient">10배 높이는</span><br />
          AI 어시스턴트
        </h1>

        <!-- Subtext -->
        <p class="text-[17px] leading-relaxed text-[#9CA3B0] mb-10 max-w-[480px] reveal reveal-delay-2">
          문서 요약부터 코드 리뷰, 회의록 작성까지 — 팀 전체가 쓰는 보안 AI 챗봇을 사내에 직접 구축하세요. 외부 데이터 유출 없이 안전하게.
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap gap-3 reveal reveal-delay-3">
          <a
            href="#start"
            class="group inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-accent/90 transition-all duration-200 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
          >
            무료 체험 신청
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a
            href="#demo"
            class="inline-flex items-center gap-2 text-[#C4C4D4] font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            데모 보기
          </a>
        </div>

        <!-- Stats -->
        <div class="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/6 reveal reveal-delay-4">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
            <div class="text-xs text-muted mt-0.5">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Right: Chat UI Preview -->
      <div class="relative reveal reveal-delay-2">
        <!-- Floating card -->
        <div class="relative glass-card rounded-2xl p-1 inner-glow glow-accent animate-float">
          <!-- Chat header -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-white/6">
            <div class="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 5h12M2 8h9M2 11h6" stroke="#A99FFF" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div class="text-[13px] font-semibold text-white">AiDesk 어시스턴트</div>
              <div class="text-[11px] text-emerald-400 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                온라인
              </div>
            </div>
            <div class="ml-auto flex gap-1.5">
              <div class="w-2 h-2 rounded-full bg-white/20"></div>
              <div class="w-2 h-2 rounded-full bg-white/20"></div>
              <div class="w-2 h-2 rounded-full bg-white/20"></div>
            </div>
          </div>

          <!-- Chat messages -->
          <div class="p-4 space-y-3 min-h-[320px]">
            <!-- User message -->
            <div class="flex justify-end">
              <div class="bg-accent/20 border border-accent/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]">
                <p class="text-[13px] text-white/90 leading-relaxed">지난주 팀 회의록 요약해줘. 핵심 결정사항만</p>
              </div>
            </div>

            <!-- AI response -->
            <div class="flex gap-2.5">
              <div class="w-6 h-6 rounded-md bg-accent/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M2 5h12M2 8h9" stroke="#A99FFF" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="glass-card rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                <p class="text-[13px] text-white/80 leading-relaxed mb-2">📋 <strong class="text-white">핵심 결정사항 3가지</strong></p>
                <ul class="text-[12px] text-[#9CA3B0] space-y-1.5">
                  <li class="flex gap-2"><span class="text-accent">01</span> Q2 마케팅 예산 15% 증액 승인</li>
                  <li class="flex gap-2"><span class="text-accent">02</span> 신규 CRM 도입 TF팀 구성 (6명)</li>
                  <li class="flex gap-2"><span class="text-accent">03</span> 재택근무 가이드라인 5월 중 확정</li>
                </ul>
              </div>
            </div>

            <!-- User follow-up -->
            <div class="flex justify-end">
              <div class="bg-accent/20 border border-accent/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]">
                <p class="text-[13px] text-white/90 leading-relaxed">TF팀 구성원 명단도 알 수 있어?</p>
              </div>
            </div>

            <!-- Typing indicator -->
            <div class="flex gap-2.5 items-end">
              <div class="w-6 h-6 rounded-md bg-accent/20 flex-shrink-0 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M2 5h12M2 8h9" stroke="#A99FFF" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                <div class="flex gap-1 items-center h-4">
                  <div class="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style="animation-delay:0ms"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style="animation-delay:150ms"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style="animation-delay:300ms"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input area -->
          <div class="px-4 pb-4">
            <div class="flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
              <span class="text-[12px] text-muted flex-1">사내 데이터에 대해 무엇이든 물어보세요...</span>
              <button class="w-6 h-6 rounded-lg bg-accent/80 flex items-center justify-center">
                <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Floating badges -->
        <div class="absolute -top-4 -right-4 glass-card rounded-xl px-3 py-2 border border-white/10 animate-float" style="animation-delay: 1s">
          <div class="flex items-center gap-2">
            <span class="text-lg">🔒</span>
            <div>
              <div class="text-[11px] font-semibold text-white">완전 격리</div>
              <div class="text-[10px] text-muted">사내망 전용</div>
            </div>
          </div>
        </div>

        <div class="absolute -bottom-4 -left-4 glass-card rounded-xl px-3 py-2 border border-white/10 animate-float" style="animation-delay: 2s">
          <div class="flex items-center gap-2">
            <span class="text-lg">⚡</span>
            <div>
              <div class="text-[11px] font-semibold text-white">응답 0.8초</div>
              <div class="text-[10px] text-muted">평균 응답 속도</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useReveal } from '../composables/useReveal'
useReveal()

const stats = [
  { value: '2,400+', label: '활성 사용자' },
  { value: '94%', label: '업무 시간 절감' },
  { value: '30+', label: '연동 시스템' },
]
</script>
