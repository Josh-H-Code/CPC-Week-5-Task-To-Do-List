<script setup lang="ts">
import type { TodoStats } from '@/types/todo';

defineProps<{
  stats: TodoStats;
}>();

const emit = defineEmits<{
  (e: 'clear-completed'): void;
  (e: 'mark-all'): void;
}>();
</script>

<template>
  <footer class="todo-footer">
    <div class="todo-footer__info">
      <span class="todo-footer__count">
        <strong>{{ stats.active }}</strong> {{ stats.active === 1 ? 'task' : 'tasks' }} remaining
      </span>
    </div>

    <div class="todo-footer__actions">
      <button
        v-if="stats.total > 0"
        class="todo-footer__btn"
        @click="emit('mark-all')"
        title="Toggle all tasks completion status"
      >
        {{ stats.active === 0 ? 'Mark All Active' : 'Mark All Done' }}
      </button>

      <button
        v-if="stats.completed > 0"
        class="todo-footer__btn todo-footer__btn--danger"
        @click="emit('clear-completed')"
        title="Remove all completed tasks"
      >
        Clear Completed ({{ stats.completed }})
      </button>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.todo-footer {
  @include flex-between;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-xs;
  font-size: $font-size-xs;
  color: $text-muted;

  @include mobile {
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
  }

  &__count {
    strong {
      color: $text-main;
      font-weight: 700;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__btn {
    @include btn-base;
    font-size: $font-size-xs;
    padding: 0.35rem 0.65rem;
    background: transparent;
    border-color: $border-color;
    color: $text-muted;

    &:hover {
      background: white;
      color: $text-main;
      border-color: $border-hover;
    }

    &--danger:hover {
      background: #fee2e2;
      color: $danger;
      border-color: #fca5a5;
    }
  }
}
</style>
