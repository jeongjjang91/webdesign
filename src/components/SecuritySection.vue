<template>
  <section id="security" class="py-28 bg-ink-900/50 border-y border-white/6">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left -->
        <div class="reveal">
          <div class="inline-flex items-center gap-2 text-xs font-semibold text-accent/80 tracking-widest uppercase mb-4">
            <span class="w-4 h-px bg-accent/60"></span>
            보안 & 컴플라이언스
          </div>
          <h2 class="text-4xl font-bold tracking-tight mb-5">
            기업 데이터,<br />
            <span class="text-gradient">절대 외부로 나가지 않습니다</span>
          </h2>
          <p class="text-[#9CA3B0] leading-relaxed mb-8">
            ChatGPT 같은 외부 서비스와 달리, TC Assistant는 사내 인프라 위에서 완전 격리된 환경으로 운영됩니다. 모든 데이터는 사내 서버에만 존재합니다.
          </p>

          <div class="space-y-4">
            <div v-for="item in securityItems" :key="item.title"
              class="flex items-start gap-4 p-4 glass-card rounded-xl hover:border-white/15 transition-all"
            >
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="item.bgClass">
                <span class="text-lg">{{ item.icon }}</span>
              </div>
              <div>
                <div class="text-[14px] font-semibold text-white mb-0.5">{{ item.title }}</div>
                <div class="text-[12px] text-muted leading-relaxed">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Architecture diagram -->
        <div class="reveal reveal-delay-2">
          <div class="glass-card rounded-2xl p-7 border border-white/10">
            <div class="text-xs text-muted uppercase tracking-widest font-medium mb-6">데이터 흐름 구조</div>

            <!-- Diagram -->
            <div class="space-y-3">
              <!-- External -->
              <div class="rounded-xl border border-white/8 bg-white/2 p-4">
                <div class="text-[11px] text-muted mb-2 font-medium">사용자 디바이스</div>
                <div class="flex gap-2">
                  <div class="flex-1 bg-ink-900 rounded-lg p-2.5 text-center text-[11px] text-white/60 border border-white/6">브라우저</div>
                  <div class="flex-1 bg-ink-900 rounded-lg p-2.5 text-center text-[11px] text-white/60 border border-white/6">모바일 앱</div>
                  <div class="flex-1 bg-ink-900 rounded-lg p-2.5 text-center text-[11px] text-white/60 border border-white/6">Slack Bot</div>
                </div>
              </div>

              <!-- Arrow down -->
              <div class="flex items-center justify-center gap-2">
                <div class="h-6 w-px bg-accent/40"></div>
                <div class="text-[10px] text-accent/60 font-medium">TLS 암호화 전송</div>
              </div>

              <!-- Firewall -->
              <div class="rounded-xl border border-orange-500/30 bg-orange-500/5 p-3 text-center">
                <div class="text-[11px] font-semibold text-orange-400">🔥 방화벽 & 접근 제어</div>
              </div>

              <!-- Arrow down -->
              <div class="flex items-center justify-center">
                <div class="h-4 w-px bg-white/20"></div>
              </div>

              <!-- Internal zone -->
              <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div class="text-[11px] text-emerald-400 font-semibold mb-3">🔒 사내 전용 보안 구역 (Isolated)</div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="bg-ink-900 rounded-lg p-2.5 text-center border border-white/6">
                    <div class="text-lg mb-1">🤖</div>
                    <div class="text-[10px] text-white/60">AI 모델 서버</div>
                  </div>
                  <div class="bg-ink-900 rounded-lg p-2.5 text-center border border-white/6">
                    <div class="text-lg mb-1">🗄️</div>
                    <div class="text-[10px] text-white/60">벡터 DB</div>
                  </div>
                  <div class="bg-ink-900 rounded-lg p-2.5 text-center border border-white/6">
                    <div class="text-lg mb-1">📁</div>
                    <div class="text-[10px] text-white/60">사내 문서 저장소</div>
                  </div>
                  <div class="bg-ink-900 rounded-lg p-2.5 text-center border border-white/6">
                    <div class="text-lg mb-1">📊</div>
                    <div class="text-[10px] text-white/60">감사 로그</div>
                  </div>
                </div>
              </div>

              <!-- No external -->
              <div class="flex items-center justify-center gap-2 pt-1">
                <span class="text-[11px] text-rose-400 font-medium">✗ 외부 인터넷 연결 없음</span>
              </div>
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

const securityItems = [
  {
    icon: '🏠', title: '완전 격리 온프레미스',
    desc: '사내 서버 또는 프라이빗 클라우드에만 설치됩니다. 어떤 데이터도 외부로 전송되지 않습니다.',
    bgClass: 'bg-accent/12',
  },
  {
    icon: '🔐', title: 'AES-256 전구간 암호화',
    desc: '저장 데이터, 전송 중 데이터 모두 AES-256으로 암호화됩니다. TLS 1.3 통신만 허용.',
    bgClass: 'bg-emerald-500/12',
  },
  {
    icon: '👤', title: '역할 기반 접근 제어',
    desc: '부서·직급별로 접근 가능한 데이터를 세밀하게 제어합니다. SSO & LDAP 완전 연동.',
    bgClass: 'bg-blue-500/12',
  },
  {
    icon: '📋', title: '전체 감사 로그',
    desc: '모든 질의·응답 이력이 기록됩니다. 컴플라이언스 감사 시 즉시 조회 가능.',
    bgClass: 'bg-orange-500/12',
  },
]
</script>
