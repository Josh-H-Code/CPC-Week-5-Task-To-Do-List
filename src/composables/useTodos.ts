import { ref, computed, watch, onMounted } from 'vue';
import type { Todo, FilterStatus, SortOption, Category, Priority, TodoStats } from '@/types/todo';

const STORAGE_KEY = 'cpc_week5_todos_v1';

const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    title: 'Initialize Vue 3 & Vite with TypeScript',
    description: 'Set up modern tooling with strict TypeScript typing and fast HMR.',
    completed: true,
    priority: 'high',
    category: 'Coding',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: Date.now() - 172800000,
    completedAt: Date.now() - 86400000
  },
  {
    id: '2',
    title: 'Design clean responsive UI with Sass (SCSS)',
    description: 'Leverage variables, mixins, and BEM modular component styling.',
    completed: true,
    priority: 'high',
    category: 'Coding',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 86400000,
    completedAt: Date.now() - 3600000
  },
  {
    id: '3',
    title: 'Implement Task Filters & LocalStorage Persistence',
    description: 'Ensure state persists across browser reloads and users can filter by status/category.',
    completed: false,
    priority: 'medium',
    category: 'Study',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    createdAt: Date.now() - 3600000
  },
  {
    id: '4',
    title: 'Review CPC Week 5 assignment submission rubric',
    description: 'Double check code organization, TypeScript interfaces, and accessibility features.',
    completed: false,
    priority: 'low',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    createdAt: Date.now()
  }
];

export function useTodos() {
  const todos = ref<Todo[]>([]);
  const filter = ref<FilterStatus>('all');
  const categoryFilter = ref<string>('all');
  const priorityFilter = ref<string>('all');
  const searchQuery = ref<string>('');
  const sortBy = ref<SortOption>('createdAt');

  // Load from LocalStorage
  const loadTodos = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        todos.value = JSON.parse(saved);
      } else {
        todos.value = INITIAL_TODOS;
      }
    } catch (e) {
      console.error('Failed to load todos from localStorage', e);
      todos.value = INITIAL_TODOS;
    }
  };

  // Save to LocalStorage
  watch(
    todos,
    (newTodos) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      } catch (e) {
        console.error('Failed to save todos to localStorage', e);
      }
    },
    { deep: true }
  );

  onMounted(() => {
    loadTodos();
  });

  // Actions
  const addTodo = (newTodoData: {
    title: string;
    description?: string;
    priority: Priority;
    category: Category;
    dueDate?: string;
  }) => {
    const trimmedTitle = newTodoData.title.trim();
    if (!trimmedTitle) return;

    const newTodo: Todo = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: trimmedTitle,
      description: newTodoData.description?.trim() || undefined,
      completed: false,
      priority: newTodoData.priority,
      category: newTodoData.category,
      dueDate: newTodoData.dueDate || undefined,
      createdAt: Date.now()
    };

    todos.value.unshift(newTodo);
  };

  const toggleTodo = (id: string) => {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? Date.now() : undefined;
    }
  };

  const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos.value[index] = { ...todos.value[index], ...updates };
    }
  };

  const deleteTodo = (id: string) => {
    todos.value = todos.value.filter((t) => t.id !== id);
  };

  const clearCompleted = () => {
    todos.value = todos.value.filter((t) => !t.completed);
  };

  const markAllCompleted = () => {
    const allDone = todos.value.every((t) => t.completed);
    todos.value.forEach((t) => {
      t.completed = !allDone;
      t.completedAt = !allDone ? Date.now() : undefined;
    });
  };

  const resetToDefaults = () => {
    todos.value = [...INITIAL_TODOS];
  };

  // Stats computed
  const stats = computed<TodoStats>(() => {
    const total = todos.value.length;
    const completed = todos.value.filter((t) => t.completed).length;
    const active = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, active, completed, percentage };
  });

  // Filtered and Sorted todos
  const filteredTodos = computed(() => {
    let result = todos.value.filter((todo) => {
      // Status filter
      if (filter.value === 'active' && todo.completed) return false;
      if (filter.value === 'completed' && !todo.completed) return false;

      // Category filter
      if (categoryFilter.value !== 'all' && todo.category !== categoryFilter.value) {
        return false;
      }

      // Priority filter
      if (priorityFilter.value !== 'all' && todo.priority !== priorityFilter.value) {
        return false;
      }

      // Search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        const matchTitle = todo.title.toLowerCase().includes(query);
        const matchDesc = todo.description ? todo.description.toLowerCase().includes(query) : false;
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    });

    // Sort
    const priorityWeights: Record<Priority, number> = {
      high: 3,
      medium: 2,
      low: 1
    };

    result.sort((a, b) => {
      if (sortBy.value === 'createdAt') {
        return b.createdAt - a.createdAt;
      }
      if (sortBy.value === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy.value === 'priority') {
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      }
      if (sortBy.value === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  });

  return {
    todos,
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
  };
}
