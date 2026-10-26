<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Todo, Priority, Category } from '@/types/todo';
import { CATEGORIES, PRIORITIES } from '@/types/todo';

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: 'toggle', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'update', id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): void;
}>();

const isEditing = ref(false);
const editTitle = ref(props.todo.title);
const editDescription = ref(props.todo.description || '');
const editCategory = ref<Category>(props.todo.category);
const editPriority = ref<Priority>(props.todo.priority);
const editDueDate = ref(props.todo.dueDate || '');

const startEditing = () => {
  editTitle.value = props.todo.title;
  editDescription.value = props.todo.description || '';
  editCategory.value = props.todo.category;
  editPriority.value = props.todo.priority;
  editDueDate.value = props.todo.dueDate || '';
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveEditing = () => {
  const trimmed = editTitle.value.trim();
  if (!trimmed) return;

  emit('update', props.todo.id, {
    title: trimmed,
    description: editDescription.value.trim() || undefined,
    category: editCategory.value,
    priority: editPriority.value,
    dueDate: editDueDate.value || undefined
  });
  isEditing.value = false;
};

// Due date status
const dueDateStatus = computed(() => {
  if (!props.todo.dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(props.todo.dueDate + 'T00:00:00');

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)}d overdue`,
      type: 'overdue'
    };
  } else if (diffDays === 0) {
    return {
      text: 'Due today',
      type: 'today'
    };
  } else if (diffDays === 1) {
    return {
      text: 'Due tomorrow',
      type: 'soon'
    };
  } else {
    return {
      text: `Due in ${diffDays}d`,
      type: 'normal'
    };
  }
});
</script>

<template>
  <li class="todo-item" :class="{ 'todo-item--completed': todo.completed, 'todo-item--editing': isEditing }">
    <!-- View Mode -->
    <div v-if="!isEditing" class="todo-item__content">
      <!-- Checkbox -->
      <label class="custom-checkbox">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="emit('toggle', todo.id)"
          :aria-label="`Mark '${todo.title}' as ${todo.completed ? 'incomplete' : 'complete'}`"
        />
        <span class="custom-checkbox__box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </label>

      <!-- Task Details -->
      <div class="todo-item__body">
        <div class="todo-item__title-row">
          <span class="todo-item__title" @dblclick="startEditing">{{ todo.title }}</span>

          <div class="todo-item__tags">
            <!-- Category Badge -->
            <span
              class="badge"
              :class="`badge--${todo.category.toLowerCase()}`"
            >
              {{ todo.category }}
            </span>

            <!-- Priority Pill -->
            <span
              class="priority-pill"
              :class="`priority-pill--${todo.priority}`"
            >
              <span class="priority-pill__dot"></span>
              {{ todo.priority }}
            </span>
          </div>
        </div>

        <p v-if="todo.description" class="todo-item__description">
          {{ todo.description }}
        </p>

        <!-- Meta info (due date & created) -->
        <div class="todo-item__meta">
          <span
            v-if="dueDateStatus"
            class="todo-item__due"
            :class="`todo-item__due--${dueDateStatus.type}`"
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {{ dueDateStatus.text }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="todo-item__actions">
        <button
          class="action-btn action-btn--edit"
          @click="startEditing"
          title="Edit task"
          aria-label="Edit task"
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
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>

        <button
          class="action-btn action-btn--delete"
          @click="emit('delete', todo.id)"
          title="Delete task"
          aria-label="Delete task"
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
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="todo-item__edit-form">
      <input
        v-model="editTitle"
        type="text"
        class="edit-input"
        @keydown.enter="saveEditing"
        @keydown.esc="cancelEditing"
        placeholder="Task title"
        autofocus
      />

      <textarea
        v-model="editDescription"
        class="edit-textarea"
        placeholder="Description..."
        rows="2"
      ></textarea>

      <div class="edit-options">
        <select v-model="editCategory" class="edit-select">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>

        <select v-model="editPriority" class="edit-select">
          <option v-for="p in PRIORITIES" :key="p.value" :value="p.value">
            {{ p.label }} Priority
          </option>
        </select>

        <input v-model="editDueDate" type="date" class="edit-date" />
      </div>

      <div class="edit-actions">
        <button class="btn-cancel" @click="cancelEditing">Cancel</button>
        <button class="btn-save" @click="saveEditing">Save Changes</button>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.todo-item {
  @include glass-card;
  padding: $spacing-md;
  transition: all $transition-smooth;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: $shadow-md;
    border-color: rgba(99, 102, 241, 0.2);
  }

  &--completed {
    opacity: 0.72;
    background: rgba(248, 250, 252, 0.85);

    .todo-item__title {
      text-decoration: line-through;
      color: $text-muted;
    }
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-2xs;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    flex-wrap: wrap;
  }

  &__title {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-main;
    word-break: break-word;
    cursor: pointer;
  }

  &__tags {
    display: inline-flex;
    align-items: center;
    gap: $spacing-2xs;
  }

  &__description {
    font-size: $font-size-sm;
    color: $text-muted;
    line-height: 1.4;
    word-break: break-word;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-top: $spacing-2xs;
  }

  &__due {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-xs;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: $radius-full;

    svg {
      width: 12px;
      height: 12px;
    }

    &--normal {
      background: $bg-muted;
      color: $text-muted;
    }

    &--soon {
      background: #eff6ff;
      color: #2563eb;
    }

    &--today {
      background: #fef3c7;
      color: #d97706;
    }

    &--overdue {
      background: #fee2e2;
      color: #dc2626;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 2px;
    opacity: 0.6;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 1;
    }

    @include mobile {
      opacity: 1;
    }
  }
}

// Custom Checkbox
.custom-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-top: 2px;

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__box {
    width: 22px;
    height: 22px;
    border-radius: $radius-sm;
    border: 2px solid $border-hover;
    background: white;
    @include flex-center;
    transition: all $transition-fast;

    svg {
      width: 14px;
      height: 14px;
      color: white;
      opacity: 0;
      transform: scale(0.6);
      transition: all $transition-fast;
    }
  }

  input:checked + .custom-checkbox__box {
    background: $primary;
    border-color: $primary;

    svg {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:hover .custom-checkbox__box {
    border-color: $primary;
  }
}

// Action Buttons
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: $radius-sm;
  @include flex-center;
  color: $text-light;
  transition: all $transition-fast;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: $bg-muted;
  }

  &--edit:hover {
    color: $primary;
  }

  &--delete:hover {
    color: $danger;
    background: #fee2e2;
  }
}

// Edit Form Styles
.todo-item__edit-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  width: 100%;
}

.edit-input,
.edit-textarea {
  width: 100%;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
  border: 1px solid $border-color;
  font-size: $font-size-sm;
  outline: none;

  &:focus {
    border-color: $border-focus;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.12);
  }
}

.edit-options {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.edit-select,
.edit-date {
  height: 32px;
  padding: 0 $spacing-xs;
  font-size: $font-size-xs;
  border-radius: $radius-sm;
  border: 1px solid $border-color;
  background: white;
  outline: none;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-xs;
  margin-top: $spacing-2xs;
}

.btn-cancel {
  @include btn-base;
  padding: $spacing-2xs $spacing-sm;
  background: white;
  border-color: $border-color;
  color: $text-muted;

  &:hover {
    color: $text-main;
  }
}

.btn-save {
  @include btn-base;
  padding: $spacing-2xs $spacing-sm;
  background: $primary;
  color: white;

  &:hover {
    background: $primary-hover;
  }
}
</style>
