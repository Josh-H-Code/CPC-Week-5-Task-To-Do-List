<script setup lang="ts">
import { useTodos } from '@/composables/useTodos';
import TodoHeader from '@/components/TodoHeader.vue';
import TodoStats from '@/components/TodoStats.vue';
import TodoInput from '@/components/TodoInput.vue';
import TodoFilters from '@/components/TodoFilters.vue';
import TodoList from '@/components/TodoList.vue';
import TodoFooter from '@/components/TodoFooter.vue';

const {
  filter,
  categoryFilter,
  priorityFilter,
  searchQuery,
  sortBy,
  stats,
  filteredTodos,
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  clearCompleted,
  markAllCompleted,
  resetToDefaults
} = useTodos();
</script>

<template>
  <div class="app-container">
    <!-- Header with logo and sample reset -->
    <TodoHeader
      :total-count="stats.total"
      :completed-count="stats.completed"
      @reset-defaults="resetToDefaults"
    />

    <!-- Interactive stats and progress meter -->
    <TodoStats :stats="stats" />

    <!-- Create Task Form -->
    <TodoInput @add-todo="addTodo" />

    <!-- Search, Filter & Sort Controls -->
    <TodoFilters
      :current-filter="filter"
      :current-category="categoryFilter"
      :current-priority="priorityFilter"
      :current-sort="sortBy"
      :search-query="searchQuery"
      :stats="stats"
      @update:filter="filter = $event"
      @update:category="categoryFilter = $event"
      @update:priority="priorityFilter = $event"
      @update:sort="sortBy = $event"
      @update:search="searchQuery = $event"
    />

    <!-- Task List with animations & empty states -->
    <TodoList
      :todos="filteredTodos"
      :search-query="searchQuery"
      @toggle="toggleTodo"
      @delete="deleteTodo"
      @update="updateTodo"
    />

    <!-- Bulk actions & remaining counters -->
    <TodoFooter
      :stats="stats"
      @clear-completed="clearCompleted"
      @mark-all="markAllCompleted"
    />
  </div>
</template>

<style lang="scss">
// Global styles imported through main.scss in main.ts
</style>
