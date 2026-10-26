<script setup lang="ts">
import { ref } from 'vue';
import type { Category, Priority } from '@/types/todo';
import { CATEGORIES, PRIORITIES } from '@/types/todo';

const emit = defineEmits<{
  (
    e: 'add-todo',
    data: {
      title: string;
      description?: string;
      category: Category;
      priority: Priority;
      dueDate?: string;
    }
  ): void;
}>();

const title = ref('');
const description = ref('');
const category = ref<Category>('Study');
const priority = ref<Priority>('medium');
const dueDate = ref('');
const isExpanded = ref(false);
const inputError = ref(false);

const handleSubmit = () => {
  const trimmed = title.value.trim();
  if (!trimmed) {
    inputError.value = true;
    return;
  }

  emit('add-todo', {
    title: trimmed,
    description: description.value.trim() || undefined,
    category: category.value,
    priority: priority.value,
    dueDate: dueDate.value || undefined
  });

  // Reset form
  title.value = '';
  description.value = '';
  dueDate.value = '';
  inputError.value = false;
  isExpanded.value = false;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};
</script>

<template>
  <div class="todo-input-card" :class="{ 'todo-input-card--expanded': isExpanded }">
    <form @submit.prevent="handleSubmit" class="todo-input-form">
      <!-- Main Input Row -->
      <div class="todo-input-form__main">
        <input
          v-model="title"
          type="text"
          class="todo-input-form__field"
          :class="{ 'todo-input-form__field--error': inputError }"
          placeholder="What needs to be done? (e.g. Finish Week 5 Task...)"
          @focus="isExpanded = true"
          @keydown="handleKeydown"
          @input="inputError = false"
        />

        <button
          type="button"
          class="todo-input-form__toggle-btn"
          :class="{ 'todo-input-form__toggle-btn--active': isExpanded }"
          @click="isExpanded = !isExpanded"
          title="Toggle details"
          aria-label="Toggle task options"
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
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <button type="submit" class="todo-input-form__submit-btn">
          <span>Add Task</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p v-if="inputError" class="todo-input-form__error-text">
        Please enter a task title before submitting.
      </p>

      <!-- Expandable Details Section -->
      <transition name="fade">
        <div v-if="isExpanded" class="todo-input-form__details">
          <!-- Description input -->
          <textarea
            v-model="description"
            class="todo-input-form__textarea"
            placeholder="Add optional notes or description..."
            rows="2"
          ></textarea>

          <div class="todo-input-form__options-row">
            <!-- Category Selector -->
            <div class="option-group">
              <label class="option-group__label">Category</label>
              <select v-model="category" class="option-group__select">
                <option v-for="cat in CATEGORIES" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <!-- Priority Selector -->
            <div class="option-group">
              <label class="option-group__label">Priority</label>
              <div class="priority-selector">
                <button
                  v-for="p in PRIORITIES"
                  :key="p.value"
                  type="button"
                  class="priority-selector__btn"
                  :class="{
                    'priority-selector__btn--active': priority === p.value,
                    [`priority-selector__btn--${p.value}`]: true
                  }"
                  @click="priority = p.value"
                >
                  <span class="dot"></span>
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Due Date Picker -->
            <div class="option-group">
              <label class="option-group__label">Due Date</label>
              <input
                v-model="dueDate"
                type="date"
                class="option-group__date"
              />
            </div>
          </div>
        </div>
      </transition>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.todo-input-card {
  @include glass-card;
  padding: $spacing-md;
  transition: all $transition-smooth;

  &:focus-within {
    box-shadow: $shadow-lg, 0 0 0 2px rgba(99, 102, 241, 0.15);
  }
}

.todo-input-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  &__main {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    @include mobile {
      flex-wrap: wrap;
    }
  }

  &__field {
    flex: 1;
    min-width: 200px;
    height: 48px;
    padding: 0 $spacing-md;
    border-radius: $radius-md;
    border: 1px solid $border-color;
    background: $bg-input;
    font-size: $font-size-base;
    color: $text-main;
    outline: none;
    transition: all $transition-fast;

    &:focus {
      border-color: $border-focus;
      background: white;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }

    &--error {
      border-color: $danger;
      background: #fff5f5;
    }
  }

  &__toggle-btn {
    width: 44px;
    height: 44px;
    border-radius: $radius-md;
    border: 1px solid $border-color;
    background: white;
    color: $text-muted;
    @include flex-center;
    transition: all $transition-fast;

    svg {
      width: 18px;
      height: 18px;
      transition: transform $transition-fast;
    }

    &:hover {
      color: $primary;
      border-color: $primary-light;
    }

    &--active svg {
      transform: rotate(45deg);
    }
  }

  &__submit-btn {
    @include btn-base;
    height: 48px;
    padding: 0 $spacing-lg;
    background: linear-gradient(135deg, $primary 0%, $secondary 100%);
    color: white;
    border-radius: $radius-md;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);

    svg {
      width: 16px;
      height: 16px;
      transition: transform $transition-fast;
    }

    &:hover {
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45);
      transform: translateY(-1px);

      svg {
        transform: translateX(2px);
      }
    }

    @include mobile {
      width: 100%;
    }
  }

  &__error-text {
    font-size: $font-size-xs;
    color: $danger;
    font-weight: 600;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding-top: $spacing-sm;
    border-top: 1px dashed $border-color;
  }

  &__textarea {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    border: 1px solid $border-color;
    background: $bg-input;
    font-size: $font-size-sm;
    color: $text-main;
    resize: vertical;
    outline: none;

    &:focus {
      border-color: $border-focus;
      background: white;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }
  }

  &__options-row {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    align-items: flex-end;
  }
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-2xs;

  &__label {
    font-size: $font-size-xs;
    font-weight: 700;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__select,
  &__date {
    height: 38px;
    padding: 0 $spacing-sm;
    border-radius: $radius-sm;
    border: 1px solid $border-color;
    background: white;
    font-size: $font-size-sm;
    color: $text-main;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: $border-focus;
    }
  }
}

.priority-selector {
  display: flex;
  gap: $spacing-2xs;

  &__btn {
    @include btn-base;
    height: 38px;
    padding: 0 $spacing-sm;
    border: 1px solid $border-color;
    background: white;
    color: $text-muted;
    font-size: $font-size-xs;
    border-radius: $radius-sm;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &--low .dot {
      background-color: $priority-low;
    }
    &--medium .dot {
      background-color: $priority-medium;
    }
    &--high .dot {
      background-color: $priority-high;
    }

    &--active {
      font-weight: 700;

      &.priority-selector__btn--low {
        border-color: $priority-low;
        background-color: $priority-low-bg;
        color: $priority-low;
      }
      &.priority-selector__btn--medium {
        border-color: $priority-medium;
        background-color: $priority-medium-bg;
        color: $priority-medium;
      }
      &.priority-selector__btn--high {
        border-color: $priority-high;
        background-color: $priority-high-bg;
        color: $priority-high;
      }
    }
  }
}
</style>
