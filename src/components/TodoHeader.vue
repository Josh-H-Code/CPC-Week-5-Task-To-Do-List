<script setup lang="ts">
import { computed } from 'vue';

defineProps<{
  totalCount: number;
  completedCount: number;
}>();

const emit = defineEmits<{
  (e: 'reset-defaults'): void;
}>();

const formattedDate = computed(() => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(now);
});
</script>

<template>
  <header class="todo-header">
    <div class="todo-header__left">
      <div class="todo-header__brand">
        <div class="todo-header__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <div>
          <h1 class="todo-header__title">TaskFlow</h1>
          <p class="todo-header__subtitle">CPC Week 5 • Vue 3 + Vite + TypeScript + Sass</p>
        </div>
      </div>
    </div>

    <div class="todo-header__right">
      <span class="todo-header__date">{{ formattedDate }}</span>
      <button
        class="todo-header__reset-btn"
        @click="emit('reset-defaults')"
        title="Reset to sample data"
        aria-label="Reset to default tasks"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span>Reset Sample</span>
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.todo-header {
  @include flex-between;
  gap: $spacing-md;

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: $radius-md;
    background: linear-gradient(135deg, $primary 0%, $secondary 100%);
    color: white;
    @include flex-center;
    box-shadow: $shadow-glow;

    svg {
      width: 22px;
      height: 22px;
    }
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: 800;
    color: $text-main;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  &__subtitle {
    font-size: $font-size-xs;
    color: $text-muted;
    font-weight: 500;
    margin-top: 2px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    @include mobile {
      width: 100%;
      justify-content: space-between;
    }
  }

  &__date {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-muted;
    background: white;
    padding: 0.35rem 0.75rem;
    border-radius: $radius-full;
    border: 1px solid $border-color;
  }

  &__reset-btn {
    @include btn-base;
    background: white;
    color: $text-muted;
    border-color: $border-color;
    padding: 0.35rem 0.75rem;
    font-size: $font-size-xs;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      color: $primary;
      border-color: $primary-light;
      background: $primary-subtle;
    }
  }
}
</style>
