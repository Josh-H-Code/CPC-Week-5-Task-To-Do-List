<script setup lang="ts">
import type { TodoStats } from '@/types/todo';

defineProps<{
  stats: TodoStats;
}>();
</script>

<template>
  <div class="todo-stats">
    <!-- Progress Bar Section -->
    <div class="todo-stats__progress-header">
      <div class="todo-stats__label-group">
        <span class="todo-stats__label">Progress</span>
        <span class="todo-stats__fraction">
          {{ stats.completed }} of {{ stats.total }} completed
        </span>
      </div>
      <span class="todo-stats__percentage">{{ stats.percentage }}%</span>
    </div>

    <div class="todo-stats__track">
      <div
        class="todo-stats__bar"
        :style="{ width: `${stats.percentage}%` }"
        role="progressbar"
        :aria-valuenow="stats.percentage"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>

    <!-- Metric Counters Grid -->
    <div class="todo-stats__metrics">
      <div class="metric-card metric-card--total">
        <span class="metric-card__value">{{ stats.total }}</span>
        <span class="metric-card__label">Total Tasks</span>
      </div>
      <div class="metric-card metric-card--active">
        <span class="metric-card__value">{{ stats.active }}</span>
        <span class="metric-card__label">Pending</span>
      </div>
      <div class="metric-card metric-card--completed">
        <span class="metric-card__value">{{ stats.completed }}</span>
        <span class="metric-card__label">Completed</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo-stats {
  @include glass-card;
  padding: $spacing-md $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &__progress-header {
    @include flex-between;
  }

  &__label-group {
    display: flex;
    align-items: baseline;
    gap: $spacing-xs;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: 700;
    color: $text-main;
  }

  &__fraction {
    font-size: $font-size-xs;
    color: $text-muted;
  }

  &__percentage {
    font-size: $font-size-base;
    font-weight: 800;
    color: $primary;
  }

  &__track {
    width: 100%;
    height: 10px;
    background-color: $bg-muted;
    border-radius: $radius-full;
    overflow: hidden;
    position: relative;
  }

  &__bar {
    height: 100%;
    background: linear-gradient(90deg, $primary 0%, $secondary 50%, $accent 100%);
    border-radius: $radius-full;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-sm;
    padding-top: $spacing-2xs;
  }
}

.metric-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xs;
  border-radius: $radius-md;
  background-color: $bg-body;
  border: 1px solid $border-color;
  transition: transform $transition-fast;

  &:hover {
    transform: translateY(-2px);
  }

  &__value {
    font-size: $font-size-xl;
    font-weight: 800;
    line-height: 1.2;
  }

  &__label {
    font-size: $font-size-xs;
    color: $text-muted;
    font-weight: 600;
    margin-top: 2px;
  }

  &--total .metric-card__value {
    color: $text-main;
  }

  &--active .metric-card__value {
    color: $warning;
  }

  &--completed .metric-card__value {
    color: $success;
  }
}
</style>
