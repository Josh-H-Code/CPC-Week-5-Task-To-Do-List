<script setup lang="ts">
import type { Todo } from '@/types/todo';
import TodoItem from './TodoItem.vue';

defineProps<{
  todos: Todo[];
  searchQuery: string;
}>();

const emit = defineEmits<{
  (e: 'toggle', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'update', id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): void;
}>();
</script>

<template>
  <div class="todo-list-wrapper">
    <TransitionGroup
      v-if="todos.length > 0"
      name="list"
      tag="ul"
      class="todo-list"
    >
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
        @update="(id, updates) => emit('update', id, updates)"
      />
    </TransitionGroup>

    <!-- Empty State -->
    <div v-else class="todo-empty">
      <div class="todo-empty__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h3 class="todo-empty__title">
        {{ searchQuery ? 'No matching tasks found' : 'All clear! No tasks here' }}
      </h3>
      <p class="todo-empty__subtitle">
        {{
          searchQuery
            ? `Try refining your search terms or clearing your filters.`
            : 'Add a new task above or relax and enjoy your day!'
        }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo-list-wrapper {
  position: relative;
  min-height: 200px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  position: relative;
}

.todo-empty {
  @include glass-card;
  padding: $spacing-2xl $spacing-lg;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;

  &__icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: $primary-light;
    color: $primary;
    @include flex-center;
    margin-bottom: $spacing-xs;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 700;
    color: $text-main;
  }

  &__subtitle {
    font-size: $font-size-sm;
    color: $text-muted;
    max-width: 360px;
    line-height: 1.5;
  }
}
</style>
