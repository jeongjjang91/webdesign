<template>
  <footer class="border-t border-white/6 py-14">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <GatewayFlowIcon size="sm" label="TC Assistant" class="flex-shrink-0" />
            <span class="font-semibold text-[15px] text-white">TC Assistant</span>
          </div>
          <p class="text-[13px] text-muted leading-relaxed max-w-[220px]">
            사내 데이터를 완전히 이해하는 기업 전용 TC 어시스턴트 플랫폼
          </p>
          <div class="flex gap-3 mt-5">
            <a v-for="social in socials" :key="social.label" href="#"
              class="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition-all"
              :title="social.label"
            >
              <svg v-if="social.label === 'Blog'" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 01-2.18 2.18C2.71 17.82 2 17.11 2 16.27c0-1.2 1-2.18 2.18-2.18a2.18 2.18 0 012 1.55zm.06-9.28c0-1.2-.98-2.18-2.18-2.18C2.71 4.18 2 4.89 2 5.73c0 1.2 1 2.18 2.18 2.18a2.18 2.18 0 002.06-1.55zM22 5.73c0-1.2-.98-2.18-2.18-2.18-1.2 0-2.18.98-2.18 2.18 0 .58.23 1.11.61 1.5C16.7 10.35 13.55 12 10 12V6.73a2.18 2.18 0 00-2.18-2.18v10.91a2.18 2.18 0 002.18 2.18c1.2 0 2.18-.98 2.18-2.18v-.27c4.09-.42 7.57-2.74 9.57-6.07.14-.13.25-.29.25-.47z"/></svg>
              <svg v-else-if="social.label === 'GitHub'" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <svg v-else class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div v-for="col in footerLinks" :key="col.title">
          <div class="text-[12px] font-semibold text-white uppercase tracking-widest mb-4">{{ col.title }}</div>
          <ul class="space-y-2.5">
            <li v-for="link in col.links" :key="link">
              <a href="#" class="text-[13px] text-muted hover:text-white transition-colors">{{ link }}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/6 gap-4">
        <p class="text-[12px] text-muted">© 2025 TC Assistant. All rights reserved.</p>
        <div class="flex gap-5">
          <a href="#" class="text-[12px] text-muted hover:text-white transition-colors">개인정보처리방침</a>
          <a href="#" class="text-[12px] text-muted hover:text-white transition-colors">이용약관</a>
          <a href="#" class="text-[12px] text-muted hover:text-white transition-colors">보안정책</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import GatewayFlowIcon from './GatewayFlowIcon.vue'

const socials = [
  { label: 'Blog' },
  { label: 'GitHub' },
  { label: 'X' },
]

const footerLinks = [
  {
    title: '제품',
    links: ['기능 소개', '활용 사례', '보안', '가격 정책', '릴리즈 노트'],
  },
  {
    title: '회사',
    links: ['소개', '블로그', '채용', '파트너십', '문의하기'],
  },
  {
    title: '지원',
    links: ['문서', '온보딩 가이드', 'API 레퍼런스', '커뮤니티', '상태 페이지'],
  },
]
</script>
