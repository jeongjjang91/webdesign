# Sidebar Navigation Redesign — Design Spec

**Date:** 2026-04-15  
**Project:** AiDesk webdesign (Vue 3 + Vite + Tailwind)

---

## Overview

Convert the current single-page scroll layout into a sidebar-driven app where clicking sidebar menu items swaps the right-side content area. No Vue Router — state is managed via a `currentPage` ref in App.vue.

---

## Layout

```
┌──────────────┬─────────────────────────────────┐
│   Sidebar    │         Content Area             │
│   (220px)    │   (selected page component)      │
│   fixed      │   scrollable                     │
└──────────────┴─────────────────────────────────┘
```

- **Sidebar:** Fixed left, 220px wide, dark background (`#0D0D14`), full viewport height
- **Content area:** Fills remaining width, independently scrollable

---

## Sidebar Structure

### Top — Action Button
- **새로운 채팅** button (sky blue, full-width, icon + text)
- Visually distinct from nav items — acts as a primary CTA

### Navigation Items (icon + label)
| Icon | Label | Page |
|------|-------|------|
| 🏠 | 홈 | HeroSection + LogoStrip |
| ⚡ | 기능 | FeaturesSection |
| 🔄 | 도입 방법 | HowItWorksSection |
| 💼 | 활용 사례 | UseCasesSection |
| ⭐ | 후기 | TestimonialsSection |
| 🔒 | 보안 | SecuritySection |
| 🚀 | 시작하기 | CTASection |

### Active State
- Active item: sky blue background (`#0EA5E9/15`) + sky blue text + left border accent
- Inactive: muted text, hover brightens

---

## Color System

Replace all current indigo accent colors with sky blue:

| Token | Value |
|-------|-------|
| `--accent` | `#0EA5E9` (sky-500) |
| `--accent-hover` | `#38BDF8` (sky-400) |
| `--accent-glow` | `rgba(14,165,233,0.2)` |

Update in `src/assets/main.css` and all component classes.

---

## Page Components

Each section component is wrapped and displayed independently in the content area. The `TheFooter` is shown at the bottom of all non-chat pages.

---

## Chatbot Page

Triggered by clicking **새로운 채팅**. Replaces the content area with a full chat interface.

### Structure
```
┌─────────────────────────────┐
│  Header: AiDesk AI Assistant│
├─────────────────────────────┤
│                             │
│   [Message bubbles area]    │
│   scrollable                │
│                             │
│   AI bubble (left)          │
│   User bubble (right)       │
│                             │
│   Streaming indicator:      │
│   animated blinking cursor  │
├─────────────────────────────┤
│  [Input field] [Send btn]   │
└─────────────────────────────┘
```

### Streaming UI Behavior
- When user sends a message, AI bubble appears immediately with animated typing cursor (`▊` blinking)
- Text streams in character by character (simulated via `setInterval` for now)
- Send button disabled while streaming; shows stop icon
- Auto-scroll to bottom as new tokens arrive
- Input clears on send

### Message Data Model
```js
{
  id: number,
  role: 'user' | 'assistant',
  content: string,
  streaming: boolean
}
```

### Initial State
- One greeting message from assistant on load:  
  `"안녕하세요! AiDesk AI입니다. 무엇을 도와드릴까요?"`

---

## State Management (App.vue)

```js
const currentPage = ref('home') // 'home' | 'features' | 'how' | 'usecases' | 'testimonials' | 'security' | 'cta' | 'chat'
```

Page transition: CSS fade (opacity 0→1, 150ms) using Vue's `<Transition>` component.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `src/App.vue` | Rewrite — sidebar layout + currentPage state |
| `src/components/TheSidebar.vue` | Create — sidebar nav component |
| `src/components/ChatbotPage.vue` | Create — streaming chat UI |
| `src/assets/main.css` | Update accent colors indigo → sky blue |
| All section components | Remove scroll-reveal deps if any, keep content |
| `src/composables/useReveal.js` | Remove (no longer needed) |
| `src/components/TheNavbar.vue` | Remove (replaced by sidebar) |

---

## Out of Scope

- Actual AI API integration (structure supports adding it later)
- Mobile responsive sidebar (always-visible fixed sidebar)
- Vue Router / URL-based navigation
- Chat history persistence
