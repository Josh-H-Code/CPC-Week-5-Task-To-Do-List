<script setup lang="ts">
import type { FilterStatus, SortOption, TodoStats } from '@/types/todo';
import { CATEGORIES, PRIORITIES } from '@/types/todo';

defineProps<{
  currentFilter: FilterStatus;
  currentCategory: string;
  currentPriority: string;
  currentSort: SortOption;
  searchQuery: string;
  stats: TodoStats;
}>();

const emit = defineEmits<{
  (e: 'update:filter', value: FilterStatus): void;
  (e: 'update:category', value: string): void;
  (e: 'update:priority', value: string): void;
  (e: 'update:sort', value: SortOption): void;
  (e: 'update:search', value: string): void;
}>();

const filterTabs: { id: FilterStatus; label: string; countKey: keyof TodoStats }[] = [
  { id: 'all', label: 'All', countKey: 'total' },
  { id: 'active', label: 'Active', countKey: 'active' },
  { id: 'completed', label: 'Done', countKey: 'completed' }
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'createdAt', label: 'Recently Added' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Highest Priority' },
  { value: 'title', label: 'Alphabetical (A-Z)' }
];
</script>

<template>
  <div class="todo-filters">
    <!-- Top Row: Search and Tabs -->
    <div class="todo-filters__top">
      <!-- Search Input -->
      <div class="search-box">
        <svg
          class="search-box__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          :value="searchQuery"
          type="text"
          class="search-box__input"
          placeholder="Search tasks..."
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        />

        <button
          v-if="searchQuery"
          class="search-box__clear"
          @click="emit('update:search', '')"
          aria-label="Clear search"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Status Tabs -->
      <nav class="filter-tabs" aria-label="Task status filters">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          class="filter-tabs__btn"
          :class="{ 'filter-tabs__btn--active': currentFilter === tab.id }"
          @click="emit('update:filter', tab.id)"
        >
          <span>{{ tab.label }}</span>
          <span class="filter-tabs__count">{{ stats[tab.countKey] }}</span>
        </button>
      </nav>
    </div>

    <!-- Bottom Row: Dropdown Filters & Sorting -->
    <div class="todo-filters__bottom">
      <div class="filter-select-group">
        <!-- Category Filter -->
        <div class="custom-select-wrapper">
          <label class="sr-only" for="category-filter">Filter by category</label>
          <select
            id="category-filter"
            :value="currentCategory"
            class="filter-select"
            @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
          >
            <option value="all">All Categories</option>
            <option v-for="cat in CATEGORIES" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="custom-select-wrapper">
          <label class="sr-only" for="priority-filter">Filter by priority</label>
          <select
            id="priority-filter"
            :value="currentPriority"
            class="filter-select"
            @change="emit('update:priority', ($event.target as HTMLSelectElement).value)"
          >
            <option value="all">All Priorities</option>
            <option v-for="p in PRIORITIES" :key="p.value" :value="p.value">
              {{ p.label }} Priority
            </option>
          </select>
        </div>
      </div>

      <!-- Sort By Selector -->
      <div class="sort-select-wrapper">
        <span class="sort-label">Sort:</span>
        <select
          :value="currentSort"
          class="filter-select filter-select--sort"
          @change="emit('update:sort', ($event.target as HTMLSelectElement).value as SortOption)"
        >
          <option v-for="s in sortOptions" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo-filters {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  &__top {
    display: flex;
    gap: $spacing-sm;
    align-items: center;

    @include mobile {
      flex-direction: column;
    }
  }

  &__bottom {
    @include flex-between;
    gap: $spacing-sm;
    flex-wrap: wrap;
  }
}

.search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;

  @include mobile {
    width: 100%;
  }

  &__icon {
    position: absolute;
    left: $spacing-sm;
    width: 16px;
    height: 16px;
    color: $text-light;
    pointer-events: none;
  }

  &__input {
    width: 100%;
    height: 40px;
    padding-left: 2.25rem;
    padding-right: 2.25rem;
    border-radius: $radius-md;
    border: 1px solid $border-color;
    background: white;
    font-size: $font-size-sm;
    color: $text-main;
    outline: none;
    transition: all $transition-fast;

    &:focus {
      border-color: $border-focus;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }
  }

  &__clear {
    position: absolute;
    right: $spacing-xs;
    width: 24px;
    height: 24px;
    @include flex-center;
    color: $text-light;
    border-radius: 50%;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      color: $text-main;
      background-color: $bg-muted;
    }
  }
}

.filter-tabs {
  display: flex;
  background-color: #e2e8f0;
  padding: 3px;
  border-radius: $radius-md;
  gap: 2px;

  @include mobile {
    width: 100%;
    justify-content: stretch;
  }

  &__btn {
    @include btn-base;
    padding: 0.35rem 0.75rem;
    border-radius: $radius-sm;
    color: $text-muted;
    background: transparent;

    @include mobile {
      flex: 1;
      justify-content: center;
    }

    &:hover {
      color: $text-main;
    }

    &--active {
      background: white;
      color: $primary;
      box-shadow: $shadow-xs;
    }
  }

  &__count {
    background: rgba(15, 23, 42, 0.08);
    font-size: 0.7rem;
    padding: 1px 6px;
    border-radius: $radius-full;
  }

  &__btn--active .filter-tabs__count {
    background: $primary-light;
    color: $primary;
  }
}

.filter-select-group {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
}

.custom-select-wrapper,
.sort-select-wrapper {
  display: flex;
  align-items: center;
  gap: $spacing-2xs;
}

.sort-label {
  font-size: $font-size-xs;
  color: $text-muted;
  font-weight: 600;
}

.filter-select {
  height: 34px;
  padding: 0 $spacing-sm;
  border-radius: $radius-sm;
  border: 1px solid $border-color;
  background-color: white;
  font-size: $font-size-xs;
  font-weight: 600;
  color: $text-muted;
  outline: none;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $border-hover;
    color: $text-main;
  }

  &:focus {
    border-color: $border-focus;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
