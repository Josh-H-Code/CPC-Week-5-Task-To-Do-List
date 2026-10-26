# TaskFlow — Modern Vue 3 + Vite + TypeScript + Sass To-Do Application
> **CPC Week 5 Task: To-Do List Web Application**

An interactive, responsive To-Do List web application built using **Vue.js 3** (Composition API `<script setup lang="ts">`), **Vite**, **TypeScript**, and **Sass (SCSS)**.

---

## ✨ Features

- **Vue 3 Composition API**: Clean, modular reactive state with custom composables (`useTodos.ts`).
- **TypeScript**: Strict type definitions (`Todo`, `Priority`, `Category`, `FilterStatus`, `SortOption`).
- **Sass (SCSS) Architecture**: Modular stylesheets with variables (`_variables.scss`), mixins (`_mixins.scss`), reset (`_reset.scss`), and scoped component styles.
- **Task Management**:
  - Add tasks with title, optional description, category, priority, and due dates.
  - Interactive completion toggle with strike-through and smooth state transitions.
  - Inline editing (double-click or edit button, press Enter to save, Esc to cancel).
  - Delete individual tasks with clear actions.
  - Bulk actions: "Mark All Done / Active" and "Clear Completed".
- **Visual Progress & Analytics**:
  - Animated progress bar showing real-time completion percentage.
  - Quick-metric cards for Total, Pending, and Completed tasks.
- **Search & Multi-Level Filtering**:
  - Instant live search through task titles and notes.
  - Status tabs: All, Active, Completed with live item count badges.
  - Category filters: Study, Work, Personal, Health, Coding.
  - Priority filters: Low, Medium, High.
  - Sorting: Recently Added, Due Date, Highest Priority, Alphabetical.
- **Smart Due Date Tracking**: Automatic badges for Overdue, Due Today, Due Tomorrow, and upcoming deadlines.
- **LocalStorage Persistence**: Automatically saves and restores all tasks and modifications across browser sessions.
- **Responsive & Accessible**: Mobile-friendly layout with semantic HTML and keyboard accessibility.

---

## 📁 Project Structure

```
CPC Week 5 Task To Do List/
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── tsconfig.node.json           # TypeScript config for Vite
├── vite.config.ts               # Vite configuration with Sass preprocessor
├── preview.html                 # Standalone zero-install interactive preview
├── public/
│   └── favicon.svg              # App icon
└── src/
    ├── main.ts                  # Application bootstrap
    ├── App.vue                  # Root component layout
    ├── env.d.ts                 # TypeScript Vue SFC definitions
    ├── types/
    │   └── todo.ts              # TypeScript interfaces and constants
    ├── composables/
    │   └── useTodos.ts          # Reactive state, actions & localStorage
    ├── components/
    │   ├── TodoHeader.vue       # Header, date & sample reset
    │   ├── TodoStats.vue        # Progress bar & metric counters
    │   ├── TodoInput.vue        # Add task form with options
    │   ├── TodoFilters.vue      # Search bar, status tabs & filters
    │   ├── TodoItem.vue         # Individual task card with edit mode
    │   ├── TodoList.vue         # Transition group & empty states
    │   └── TodoFooter.vue       # Remaining count & bulk actions
    └── styles/
        ├── _variables.scss      # Colors, typography, spacing, shadows
        ├── _mixins.scss         # Flexbox, responsive breakpoints, cards
        ├── _reset.scss          # Modern CSS reset
        └── main.scss            # Global styles and animations
```

---

## 🚀 Getting Started

### 1. Prerequisites (Installing Node.js on macOS)

To run the Vite development server, ensure Node.js (version 18 or higher) is installed:

- **Option A (Recommended)**: Download and run the macOS `.pkg` installer from [nodejs.org](https://nodejs.org/) (choose LTS).
- **Option B (Homebrew)**: If you use Homebrew, open Terminal and run:
  ```bash
  brew install node
  ```
- **Option C (NVM)**:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  nvm install --lts
  ```

### 2. Install Dependencies

In your terminal, navigate to this project folder and run:

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000` (and automatically open in your default browser).

### 4. Build for Production

```bash
npm run build
```

This compiles TypeScript and bundles optimized static assets into the `dist/` directory.

---

## ⚡ Instant Standalone Preview

If you would like to test the user interface immediately before or while installing Node.js, you can open `preview.html` directly in Safari or Chrome!
