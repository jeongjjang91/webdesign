<template>
  <aside
    class="fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/[0.06] bg-[#0D0D14] transition-[width] duration-300"
    :class="collapsed ? 'w-[72px]' : 'w-[220px]'"
  >
    <div class="order-1 border-b border-white/[0.06] px-3 py-4">
      <button
        type="button"
        class="flex w-full items-center gap-2.5 rounded-lg text-left transition-colors hover:bg-white/[0.04]"
        :class="collapsed ? 'justify-center p-1' : 'px-1 py-1.5'"
        :aria-label="collapsed ? '홈으로 이동' : undefined"
        title="홈으로 이동"
        @click="emit('navigate', 'home')"
      >
        <GatewayFlowIcon size="sm" label="TC Assistant" class="flex-shrink-0" />
        <template v-if="!collapsed">
          <span class="font-semibold tracking-tight text-white">TC Assistant</span>
          <span class="rounded-full border border-white/[0.08] bg-white/5 px-2 py-0.5 text-xs text-muted">Beta</span>
        </template>
      </button>
    </div>

    <div class="order-2 pb-2 pt-4" :class="collapsed ? 'px-1' : 'px-3'">
      <div class="flex items-center gap-2">
      <button
        @click="emit('navigate', 'chat')"
        class="app-cta app-cta--sm min-w-0 text-sm"
        :class="collapsed ? 'h-8 w-[30px] rounded-lg p-0' : 'h-9 flex-1 px-3 py-0'"
        :aria-label="collapsed ? '새 채팅' : undefined"
        title="새 채팅"
      >
        <span class="app-cta__glow"></span>
        <span class="app-cta__content">
          <Icon icon="lucide:square-pen" class="h-4 w-4 flex-shrink-0" />
          <span v-if="!collapsed">새 채팅</span>
        </span>
      </button>
        <button
          type="button"
          class="flex h-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B94A5] transition-colors hover:bg-white/[0.05] hover:text-white"
          :class="collapsed ? 'w-[30px]' : 'w-9'"
          :aria-label="collapsed ? '사이드바 펼치기' : '사이드바 접기'"
          :title="collapsed ? '사이드바 펼치기' : '사이드바 접기'"
          @click="emit('toggle-sidebar')"
        >
          <Icon :icon="collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <section v-if="!collapsed" class="order-5 flex-1 overflow-y-auto px-3 pb-3">
      <div class="flex items-start justify-between gap-2 px-1.5 pb-2">
        <div>
          <p class="text-[11px] font-semibold uppercase text-[#6B7280]">최근 대화</p>
          <p class="mt-0.5 text-[10px] leading-4 text-[#6B7280]">최대 3시간까지 보관</p>
        </div>
        <button type="button" class="text-[11px] font-medium text-[#8B94A5] transition-colors hover:text-white">전체</button>
      </div>

      <div v-if="chatHistories.length" class="space-y-1 pr-0.5">
        <div
          v-for="chat in chatHistories"
          :key="chat.id"
          class="group overflow-hidden rounded-lg transition-colors"
          :class="expandedChatId === chat.id ? 'bg-white/[0.05]' : 'hover:bg-white/[0.04]'"
        >
          <div class="flex items-center gap-1">
            <button type="button" @click="toggleChat(chat.id)" class="min-w-0 flex-1 px-2.5 py-2 text-left" :aria-expanded="expandedChatId === chat.id">
              <span class="block truncate text-[13px] font-medium text-[#E5E7EB]">{{ chat.title }}</span>
              <span class="mt-0.5 block truncate text-[11px] text-[#7D8594]">{{ chat.updatedAt }} · {{ chat.messageCount }}개 메시지</span>
            </button>
            <button type="button" @click="toggleChat(chat.id)" class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-white/[0.06] hover:text-white" :aria-label="expandedChatId === chat.id ? '대화 접기' : '대화 펼치기'" :aria-expanded="expandedChatId === chat.id">
              <Icon icon="lucide:chevron-down" class="h-4 w-4 transition-transform duration-200" :class="expandedChatId === chat.id ? 'rotate-180' : ''" />
            </button>
            <button type="button" @click.stop="deleteChat(chat.id)" class="mr-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#6B7280] opacity-0 transition-all hover:bg-white/[0.06] hover:text-white group-hover:opacity-100" :aria-label="`${chat.title} 삭제`" title="대화 삭제">
              <Icon icon="lucide:trash-2" class="h-4 w-4" />
            </button>
          </div>

          <div v-if="expandedChatId === chat.id" class="border-t border-white/[0.06] px-2.5 pb-2 pt-2">
            <div class="space-y-1.5">
              <p
                v-for="message in chat.preview"
                :key="message.id"
                class="line-clamp-2 rounded-md px-2 py-1.5 text-[11px] leading-4"
                :class="message.role === 'user' ? 'bg-accent/10 text-[#CDEFFF]' : 'bg-white/[0.04] text-[#AEB6C6]'"
              >
                {{ message.content }}
              </p>
            </div>
            <button type="button" @click="emit('navigate', 'chat')" class="mt-2 w-full rounded-md border border-white/[0.08] px-2 py-1.5 text-[11px] font-medium text-[#B8C0CF] transition-colors hover:border-accent/40 hover:text-white">
              대화 열기
            </button>
          </div>
        </div>
      </div>
      <div v-else class="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-5 text-center">
        <p class="text-[12px] font-medium text-[#8B94A5]">최근 대화가 없습니다</p>
        <p class="mt-1 text-[11px] text-[#6B7280]">새로운 채팅을 시작해보세요.</p>
      </div>
    </section>

    <div v-if="!collapsed" class="order-4 mx-3 mb-2 border-t border-white/[0.06]"></div>

    <nav class="order-3 space-y-0.5 px-3" :class="collapsed ? 'flex-1 pt-2' : ''">
      <p v-if="!collapsed" class="px-1.5 pb-2 pt-1 text-[11px] font-semibold uppercase text-[#6B7280]">기능</p>
      <div v-for="item in accessibleNavItems" :key="item.page">
        <button
          @click="handleNavClick(item)"
          class="flex w-full items-center gap-2.5 rounded-lg py-2.5 text-left text-sm font-medium transition-all duration-200"
          :class="[
            collapsed ? 'justify-center px-0' : 'px-3',
            currentPage === item.page
              ? collapsed ? 'bg-accent/10 text-accent' : 'border-l-2 border-accent bg-accent/10 pl-[10px] text-accent'
              : 'text-[#9CA3B0] hover:bg-white/[0.04] hover:text-white',
          ]"
          :aria-expanded="item.page === 'dashboard' ? isDashboardExpanded : undefined"
          :aria-label="collapsed ? item.label : undefined"
          :title="collapsed ? item.label : undefined"
        >
          <Icon :icon="item.icon" class="h-4 w-4 flex-shrink-0" />
          <template v-if="!collapsed">
            <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
            <Icon v-if="item.page === 'dashboard'" icon="lucide:chevron-down" class="h-4 w-4 flex-shrink-0 transition-transform" :class="isDashboardExpanded ? 'rotate-180' : ''" />
          </template>
        </button>

        <Transition name="sidebar-submenu">
          <div v-if="!collapsed && item.page === 'dashboard' && isDashboardExpanded" class="ml-4 mt-1 space-y-1 border-l border-white/[0.08] pl-3">
            <button
              v-for="subItem in dashboardSubItems"
              :key="subItem.id"
              type="button"
              class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold transition-colors"
              :class="currentPage === 'dashboard' && dashboardMenu === subItem.id ? 'bg-accent/10 text-accent' : 'text-[#7D8594] hover:bg-white/[0.04] hover:text-white'"
              @click="selectDashboardMenu(subItem.id)"
            >
              <span class="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current"></span>
              <span class="truncate">{{ subItem.label }}</span>
            </button>
          </div>
        </Transition>
      </div>
    </nav>

    <div class="order-6 border-t border-white/[0.06] p-3">
      <div class="flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-3 py-2.5" :class="collapsed ? 'justify-center px-0' : ''">
        <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15 text-[12px] font-bold text-accent">JG</div>
        <div v-if="!collapsed" class="min-w-0 flex-1">
          <p class="truncate text-[13px] font-semibold text-white">정근</p>
          <p class="truncate text-[11px] text-[#7D8594]">jg91.jang@samsung.com</p>
        </div>
        <button v-if="!collapsed" type="button" @click="openSettings" class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-white/[0.06] hover:text-white" aria-label="계정 설정" :aria-expanded="isSettingsOpen">
          <Icon icon="lucide:settings" class="h-4 w-4" />
        </button>
      </div>
      <button
        v-if="collapsed"
        type="button"
        @click="openSettings"
        class="mt-2 flex h-8 w-full items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-white/[0.06] hover:text-white"
        aria-label="계정 설정"
        :aria-expanded="isSettingsOpen"
        title="계정 설정"
      >
        <Icon icon="lucide:settings" class="h-4 w-4" />
      </button>
    </div>

    <Teleport to="body">
      <Transition name="settings-modal">
        <div v-if="isSettingsOpen" class="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm" role="presentation" @click.self="closeSettings">
          <section role="dialog" aria-modal="true" aria-labelledby="settings-modal-title" class="w-full max-w-3xl overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D0D14] text-white shadow-2xl shadow-black/40">
            <header class="flex items-start justify-between gap-4 border-b border-white/[0.08] px-6 py-5">
              <div>
                <p class="text-[12px] font-semibold uppercase tracking-widest text-accent/80">설정</p>
                <h2 id="settings-modal-title" class="mt-1 text-xl font-bold tracking-tight">계정 및 권한 관리</h2>
                <p class="mt-2 text-sm leading-relaxed text-[#9CA3B0]">권한, 접근 범위, 알림처럼 운영에 필요한 항목을 한곳에서 관리합니다.</p>
              </div>
              <button type="button" class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B94A5] transition-colors hover:bg-white/[0.05] hover:text-white" aria-label="설정 닫기" @click="closeSettings">
                <Icon icon="lucide:x" class="h-4 w-4" />
              </button>
            </header>

            <div class="grid max-h-[72vh] overflow-y-auto lg:grid-cols-[180px_minmax(0,1fr)]">
              <aside class="border-b border-white/[0.08] bg-white/[0.025] p-3 lg:border-b-0 lg:border-r">
                <nav class="space-y-1">
                  <button
                    v-for="tab in settingsTabs"
                    :key="tab.id"
                    type="button"
                    class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors"
                    :class="activeSettingsTab === tab.id ? 'bg-accent/10 text-accent' : 'text-[#9CA3B0] hover:bg-white/[0.04] hover:text-white'"
                    @click="activeSettingsTab = tab.id"
                  >
                    <Icon :icon="tab.icon" class="h-4 w-4 flex-shrink-0" />
                    {{ tab.label }}
                  </button>
                </nav>
              </aside>

              <div class="min-w-0 p-6">
                <div v-if="activeSettingsTab === 'profile'" class="space-y-5">
                  <div class="flex items-center gap-4">
                    <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15 text-lg font-bold text-accent">JG</div>
                    <div class="min-w-0">
                      <h3 class="truncate text-lg font-bold text-white">정근</h3>
                      <p class="truncate text-sm text-[#8B94A5]">jg91.jang@samsung.com</p>
                      <p class="mt-1 text-[12px] text-emerald-400">활성 계정</p>
                    </div>
                  </div>

                  <div class="grid gap-3 md:grid-cols-2">
                    <div v-for="item in accountInfo" :key="item.label" class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                      <p class="text-[12px] font-semibold text-[#7D8594]">{{ item.label }}</p>
                      <p class="mt-2 text-sm font-semibold text-white">{{ item.value }}</p>
                    </div>
                  </div>
                </div>

                <div v-else-if="activeSettingsTab === 'permissions'" class="space-y-5">
                  <div>
                    <h3 class="text-lg font-bold text-white">권한 설정</h3>
                    <p class="mt-1 text-sm text-[#9CA3B0]">권한을 선택하면 해당 권한이 접근 가능한 메뉴만 사이드바에 표시됩니다.</p>
                  </div>

                  <div class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                    <label class="block text-[12px] font-semibold text-[#7D8594]">현재 권한</label>
                    <p class="mt-1 text-[12px] leading-5 text-[#8B94A5]">
                      SSO 인증 사용자는 기본적으로 User 권한으로 들어오고, 특정 계정에 추가 권한을 부여할 수 있습니다.
                    </p>
                    <div class="mt-3 grid gap-2 md:grid-cols-4">
                      <button
                        v-for="role in roleOptions"
                        :key="role.id"
                        type="button"
                        class="rounded-lg border px-3 py-3 text-left transition-all"
                        :class="currentRole === role.id ? 'border-accent/60 bg-accent/10 text-white shadow-[0_0_18px_rgba(14,165,233,0.18)]' : 'border-white/[0.08] bg-[#0D0D14] text-[#9CA3B0] hover:border-white/[0.16] hover:text-white'"
                        @click="currentRole = role.id"
                      >
                        <span class="block text-sm font-bold">{{ role.label }}</span>
                        <span class="mt-1 block text-[11px] leading-4 text-[#7D8594]">{{ role.description }}</span>
                      </button>
                    </div>
                  </div>

                  <div class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h4 class="text-sm font-bold text-white">계정별 추가 권한</h4>
                        <p class="mt-1 text-[12px] text-[#8B94A5]">SSO 계정에 추가 권한을 지정하면 로그인 시 해당 권한으로 UI가 열립니다.</p>
                      </div>
                      <span class="rounded-full border border-white/[0.08] bg-[#0D0D14] px-3 py-1 text-[11px] font-semibold text-[#9CA3B0]">기본 User</span>
                    </div>

                    <div class="mt-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_150px_auto]">
                      <input
                        v-model="newRoleAccount.email"
                        type="email"
                        class="rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-[#6B7280] focus:border-accent/50"
                        placeholder="계정 이메일"
                      />
                      <select
                        v-model="newRoleAccount.role"
                        class="rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2 text-sm font-semibold text-white outline-none transition-colors focus:border-accent/50"
                      >
                        <option v-for="role in elevatedRoleOptions" :key="role.id" :value="role.id">{{ role.label }}</option>
                      </select>
                      <button
                        type="button"
                        class="app-cta app-cta--sm text-sm"
                        @click="addRoleAccount"
                      >
                        <span class="app-cta__glow"></span>
                        <span class="app-cta__content">추가</span>
                      </button>
                    </div>

                    <div class="mt-4 space-y-2">
                      <div
                        v-for="account in roleAccounts"
                        :key="account.email"
                        class="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#0D0D14] px-3 py-2.5"
                      >
                        <div class="min-w-0">
                          <p class="truncate text-sm font-semibold text-white">{{ account.email }}</p>
                          <p class="mt-0.5 text-[11px] text-[#7D8594]">{{ roleLabel(account.role) }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                          <select
                            v-model="account.role"
                            class="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-[12px] font-semibold text-white outline-none focus:border-accent/50"
                          >
                            <option v-for="role in elevatedRoleOptions" :key="role.id" :value="role.id">{{ role.label }}</option>
                          </select>
                          <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-md text-[#7D8594] transition-colors hover:bg-white/[0.06] hover:text-white"
                            :aria-label="`${account.email} 권한 삭제`"
                            @click="removeRoleAccount(account.email)"
                          >
                            <Icon icon="lucide:trash-2" class="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <h4 class="text-sm font-bold text-white">권한별 접근 UI</h4>
                        <p class="mt-1 text-[12px] text-[#8B94A5]">체크된 메뉴만 현재 권한에서 접근할 수 있습니다.</p>
                      </div>
                      <span class="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">{{ activeRoleLabel }}</span>
                    </div>

                    <div class="mt-4 grid gap-2 md:grid-cols-2">
                      <label v-for="item in navItems" :key="item.page" class="flex items-start justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#0D0D14] p-3">
                        <span class="min-w-0">
                          <span class="flex items-center gap-2 text-sm font-semibold text-white">
                            <Icon :icon="item.icon" class="h-4 w-4 text-accent" />
                            {{ item.label }}
                          </span>
                          <span class="mt-1 block text-[11px] leading-4 text-[#7D8594]">{{ item.description }}</span>
                        </span>
                        <input v-model="roleAccess[currentRole]" type="checkbox" class="sr-only" :value="item.page" />
                        <span class="mt-0.5 flex h-6 w-11 flex-shrink-0 items-center rounded-full border p-0.5 transition-colors" :class="roleAccess[currentRole].includes(item.page) ? 'border-accent/40 bg-accent/80' : 'border-white/[0.1] bg-white/[0.08]'" aria-hidden="true">
                          <span class="h-[18px] w-[18px] rounded-full bg-white shadow transition-transform" :class="roleAccess[currentRole].includes(item.page) ? 'translate-x-5' : 'translate-x-0'"></span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <label v-for="permission in permissionSettings" :key="permission.id" class="flex items-start justify-between gap-4 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                      <span class="min-w-0">
                        <span class="block text-sm font-semibold text-white">{{ permission.label }}</span>
                        <span class="mt-1 block text-[13px] leading-relaxed text-[#8B94A5]">{{ permission.description }}</span>
                      </span>
                      <input v-model="permission.enabled" type="checkbox" class="sr-only" />
                      <span class="mt-0.5 flex h-6 w-11 flex-shrink-0 items-center rounded-full border p-0.5 transition-colors" :class="permission.enabled ? 'border-accent/40 bg-accent/80' : 'border-white/[0.1] bg-white/[0.08]'" aria-hidden="true">
                        <span class="h-[18px] w-[18px] rounded-full bg-white shadow transition-transform" :class="permission.enabled ? 'translate-x-5' : 'translate-x-0'"></span>
                      </span>
                    </label>
                  </div>
                </div>

                <div v-else-if="activeSettingsTab === 'features'" class="space-y-4">
                  <div>
                    <h3 class="text-lg font-bold text-white">기능 옵션</h3>
                    <p class="mt-1 text-sm text-[#9CA3B0]">TC Assistant에서 사용할 업무 기능을 켜고 끕니다.</p>
                  </div>

                  <div class="grid gap-3 md:grid-cols-2">
                    <label v-for="feature in featureSettings" :key="feature.id" class="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                      <span class="flex items-start justify-between gap-3">
                        <span>
                          <span class="block text-sm font-semibold text-white">{{ feature.label }}</span>
                          <span class="mt-1 block text-[13px] leading-relaxed text-[#8B94A5]">{{ feature.description }}</span>
                        </span>
                        <input v-model="feature.enabled" type="checkbox" class="sr-only" />
                        <span class="mt-0.5 flex h-6 w-11 flex-shrink-0 items-center rounded-full border p-0.5 transition-colors" :class="feature.enabled ? 'border-accent/40 bg-accent/80' : 'border-white/[0.1] bg-white/[0.08]'" aria-hidden="true">
                          <span class="h-[18px] w-[18px] rounded-full bg-white shadow transition-transform" :class="feature.enabled ? 'translate-x-5' : 'translate-x-0'"></span>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div v-else class="space-y-4">
                  <div>
                    <h3 class="text-lg font-bold text-white">알림 및 기타</h3>
                    <p class="mt-1 text-sm text-[#9CA3B0]">대시보드 알림과 보존 정책을 조정합니다.</p>
                  </div>

                  <div class="space-y-3">
                    <label v-for="option in miscSettings" :key="option.id" class="flex items-start justify-between gap-4 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
                      <span>
                        <span class="block text-sm font-semibold text-white">{{ option.label }}</span>
                        <span class="mt-1 block text-[13px] leading-relaxed text-[#8B94A5]">{{ option.description }}</span>
                      </span>
                      <input v-model="option.enabled" type="checkbox" class="sr-only" />
                      <span class="mt-0.5 flex h-6 w-11 flex-shrink-0 items-center rounded-full border p-0.5 transition-colors" :class="option.enabled ? 'border-accent/40 bg-accent/80' : 'border-white/[0.1] bg-white/[0.08]'" aria-hidden="true">
                        <span class="h-[18px] w-[18px] rounded-full bg-white shadow transition-transform" :class="option.enabled ? 'translate-x-5' : 'translate-x-0'"></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <footer class="flex flex-col gap-3 border-t border-white/[0.08] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-[12px] text-[#7D8594]">현재 변경사항은 화면에서 즉시 반영됩니다. 운영에서는 API로 권한을 저장하면 됩니다.</p>
              <div class="flex items-center gap-2">
                <button type="button" class="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-[#B8C0CF] transition-colors hover:bg-white/[0.04] hover:text-white" @click="closeSettings">취소</button>
                <button type="button" class="app-cta app-cta--sm text-sm" @click="closeSettings">
                  <span class="app-cta__glow"></span>
                  <span class="app-cta__content">저장</span>
                </button>
              </div>
            </footer>
          </section>
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import GatewayFlowIcon from './GatewayFlowIcon.vue'

const props = defineProps({
  currentPage: {
    type: String,
    required: true,
  },
  dashboardMenu: {
    type: String,
    default: 'requests',
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate', 'toggle-sidebar'])

const expandedChatId = ref(null)
const isSettingsOpen = ref(false)
const activeSettingsTab = ref('profile')
const isDashboardExpanded = ref(props.currentPage === 'dashboard')
const ssoUserEmail = 'jg91.jang@samsung.com'
const currentRole = ref('user')
const newRoleAccount = ref({
  email: '',
  role: 'power-user',
})

const settingsTabs = [
  { id: 'profile', label: '계정', icon: 'lucide:user-round' },
  { id: 'permissions', label: '권한', icon: 'lucide:shield-check' },
  { id: 'features', label: '기능', icon: 'lucide:sliders-horizontal' },
  { id: 'misc', label: '기타', icon: 'lucide:bell' },
]

const accountInfo = [
  { label: '역할', value: 'TC 운영 관리자' },
  { label: '소속', value: 'TC Platform' },
  { label: '로그인 방식', value: '사내 SSO' },
  { label: '최근 접속', value: '오늘 12:18' },
]

const permissionSettings = ref([
  { id: 'user', label: 'User 기본 권한', description: 'SSO 인증 사용자는 기본적으로 일반 조회 사용자 권한을 받습니다.', enabled: true },
  { id: 'elevated', label: '추가 권한 허용', description: '특정 계정에 Power User, TC PI, Administrator 권한을 부여합니다.', enabled: true },
  { id: 'sensitive-data', label: '민감 데이터 조회', description: 'TC PI 이상 권한에서 내부 로그와 설정 데이터를 확인할 수 있습니다.', enabled: false },
])

const featureSettings = ref([
  { id: 'text-to-sql', label: 'DB 조회 자동화', description: '자연어 질문을 SQL 조회 흐름으로 연결합니다.', enabled: true },
  { id: 'rag', label: '문서 검색 RAG', description: '사내 문서를 기반으로 응답합니다.', enabled: true },
  { id: 'splunk', label: 'Splunk 로그 분석', description: '로그 패턴 분석 초안을 생성하고 검색어로 보냅니다.', enabled: false },
  { id: 'wiki', label: 'LLM Wiki 축적', description: '검토 완료 응답을 지식화하고 유사 질문에 재사용합니다.', enabled: false },
])

const miscSettings = ref([
  { id: 'weekly-report', label: '주간 요약 알림', description: '처리 현황과 주요 병목을 매주 요약합니다.', enabled: true },
  { id: 'quality-alert', label: '품질 저하 알림', description: '정확도나 피드백 지표가 기준 아래로 내려가면 알립니다.', enabled: true },
  { id: 'retain-history', label: '대화 기록 보존', description: '업무 감사와 재활용을 위해 대화 기록을 보존합니다.', enabled: false },
])

const chatHistories = ref([
  {
    id: 'chat-1',
    title: '로그 다운로드 조건 정리',
    updatedAt: '오늘',
    messageCount: 4,
    preview: [
      { id: 'chat-1-message-1', role: 'user', content: 'LineID와 EQPID 조건으로 로그를 내려받고 싶어.' },
      { id: 'chat-1-message-2', role: 'assistant', content: '필터 조건과 날짜 범위를 기준으로 다운로드 화면을 구성했습니다.' },
    ],
  },
  {
    id: 'chat-2',
    title: 'CEID 매핑 테이블 설계',
    updatedAt: '어제',
    messageCount: 12,
    preview: [
      { id: 'chat-2-message-1', role: 'user', content: 'CEID, RPTID, VID LIST 구조로 테이블을 바꿔줘.' },
      { id: 'chat-2-message-2', role: 'assistant', content: '세 번째 대시보드 메뉴를 CEID 매핑 구조로 분리했습니다.' },
    ],
  },
  {
    id: 'chat-3',
    title: '권한별 UI 접근',
    updatedAt: '4월 14일',
    messageCount: 8,
    preview: [
      { id: 'chat-3-message-1', role: 'user', content: '권한별로 접속 가능한 UI를 다르게 하고 싶어.' },
      { id: 'chat-3-message-2', role: 'assistant', content: '설정창에서 권한과 메뉴 접근 범위를 관리할 수 있게 만들겠습니다.' },
    ],
  },
])

const navItems = [
  { page: 'dashboard', label: '대시보드', icon: 'lucide:layout-dashboard', description: '설비 TC 현황과 매핑 관리' },
  { page: 'features', label: '기능', icon: 'lucide:zap', description: '사내 로그 다운로드와 주요 기능' },
  { page: 'how', label: '적용 계획', icon: 'lucide:repeat-2', description: '단계별 적용 계획 관리' },
  { page: 'usecases', label: '활용 사례', icon: 'lucide:briefcase', description: '업무 적용 시나리오' },
  { page: 'testimonials', label: '후기', icon: 'lucide:star', description: '사용자 피드백 영역' },
  { page: 'security', label: '개발 이력', icon: 'lucide:git-branch', description: '버전별 개발 이력' },
  { page: 'cta', label: '시작하기', icon: 'lucide:rocket', description: '도입 요청과 실행 영역' },
]

const dashboardSubItems = [
  { id: 'requests', label: '설비 TC 현황' },
  { id: 'automation', label: '설비 TC 파라미터' },
  { id: 'teams', label: 'LINE별 보기' },
  { id: 'priority', label: 'CEID 매핑' },
  { id: 'settings', label: '표시 설정' },
]

const roleOptions = [
  { id: 'user', label: 'User', description: '일반 조회 사용자' },
  { id: 'power-user', label: 'Power User', description: '운영 담당자' },
  { id: 'tc-pi', label: 'TC PI', description: '개발/설정 담당자' },
  { id: 'administrator', label: 'Administrator', description: '최고 관리자' },
]

const elevatedRoleOptions = roleOptions.filter((role) => role.id !== 'user')

const roleAccess = ref({
  user: ['dashboard', 'usecases', 'security'],
  'power-user': ['dashboard', 'features', 'how', 'usecases', 'security'],
  'tc-pi': ['dashboard', 'features', 'how', 'usecases', 'security', 'cta'],
  administrator: navItems.map((item) => item.page),
})

const roleAccounts = ref([
  { email: 'jg91.jang@samsung.com', role: 'administrator' },
  { email: 'power.user@samsung.com', role: 'power-user' },
  { email: 'tc.pi@samsung.com', role: 'tc-pi' },
  { email: 'admin@samsung.com', role: 'administrator' },
])

const activeRoleLabel = computed(() => roleOptions.find((role) => role.id === currentRole.value)?.label ?? currentRole.value)

const accessibleNavItems = computed(() => {
  const allowedPages = roleAccess.value[currentRole.value] ?? []
  return navItems.filter((item) => allowedPages.includes(item.page))
})

const openSettings = () => {
  isSettingsOpen.value = true
}

const closeSettings = () => {
  isSettingsOpen.value = false
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeSettings()
  }
}

const toggleChat = (chatId) => {
  expandedChatId.value = expandedChatId.value === chatId ? null : chatId
}

const deleteChat = (chatId) => {
  chatHistories.value = chatHistories.value.filter((chat) => chat.id !== chatId)

  if (expandedChatId.value === chatId) {
    expandedChatId.value = null
  }
}

const handleNavClick = (item) => {
  if (item.page === 'dashboard') {
    isDashboardExpanded.value = !isDashboardExpanded.value
    emit('navigate', 'dashboard', { dashboardMenu: props.dashboardMenu })
    return
  }

  emit('navigate', item.page)
}

const selectDashboardMenu = (menuId) => {
  isDashboardExpanded.value = true
  emit('navigate', 'dashboard', { dashboardMenu: menuId })
}

const roleLabel = (roleId) => {
  return roleOptions.find((role) => role.id === roleId)?.label ?? roleId
}

const resolveSsoRole = () => {
  const matchedAccount = roleAccounts.value.find((account) => account.email.toLowerCase() === ssoUserEmail.toLowerCase())
  currentRole.value = matchedAccount?.role ?? 'user'
}

const addRoleAccount = () => {
  const email = newRoleAccount.value.email.trim().toLowerCase()
  if (!email) return

  const existingAccount = roleAccounts.value.find((account) => account.email.toLowerCase() === email)
  if (existingAccount) {
    existingAccount.role = newRoleAccount.value.role
  } else {
    roleAccounts.value.push({ email, role: newRoleAccount.value.role })
  }

  newRoleAccount.value.email = ''
  resolveSsoRole()
}

const removeRoleAccount = (email) => {
  roleAccounts.value = roleAccounts.value.filter((account) => account.email !== email)
  resolveSsoRole()
}

watch(
  () => props.currentPage,
  (page) => {
    if (page === 'dashboard') {
      isDashboardExpanded.value = true
    }
  },
)

watch(
  accessibleNavItems,
  (items) => {
    if (props.currentPage === 'home') {
      return
    }

    if (!items.some((item) => item.page === props.currentPage)) {
      emit('navigate', items[0]?.page ?? 'home')
    }
  },
  { deep: true },
)

watch(roleAccounts, resolveSsoRole, { deep: true })

onMounted(() => {
  resolveSsoRole()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.settings-modal-enter-active,
.settings-modal-leave-active {
  transition: opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-modal-enter-active section,
.settings-modal-leave-active section {
  transition:
    opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-modal-enter-from,
.settings-modal-leave-to {
  opacity: 0;
}

.settings-modal-enter-from section,
.settings-modal-leave-to section {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.sidebar-submenu-enter-active,
.sidebar-submenu-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.sidebar-submenu-enter-from,
.sidebar-submenu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
