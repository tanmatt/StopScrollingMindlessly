// Popup Script for Stop Scrolling Mindlessly

const MAX_FREE_TODOS = 5;
let todos = [];
let isPremium = false;

// DOM Elements
const todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTodoBtn = document.getElementById('addTodoBtn');
const tipText = document.getElementById('tipText');
const refreshTip = document.getElementById('refreshTip');
const promoSection = document.getElementById('promoSection');
const settingsLink = document.getElementById('settingsLink');

// Initialize
/* istanbul ignore next */
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  renderTodos();
  displayRandomTip();
  updatePremiumUI();
  setupEventListeners();
});

// Setup event listeners
/* istanbul ignore next */
function setupEventListeners() {
  addTodoBtn.addEventListener('click', handleAddTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTodo();
  });
  refreshTip.addEventListener('click', displayRandomTip);
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

// Load settings from Chrome storage
/* istanbul ignore next */
async function loadSettings() {
  return new Promise((resolve) => {
    /* istanbul ignore next */
    chrome.storage.local.get(['todos', 'isPremium'], (result) => {
      todos = result.todos || [
        { id: 1, text: "Complete this task", priority: "medium", completed: false },
        { id: 2, text: "Drink water", priority: "low", completed: false }
      ];
      isPremium = result.isPremium || false;
      resolve();
    });
  });
}

// Update premium UI
/* istanbul ignore next */
function updatePremiumUI() {
  // Always show the promotional message for now
  promoSection.style.display = 'block';
}

// Render todos
function renderTodos() {
  todoList.innerHTML = '';
  /* istanbul ignore next */
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.completed ? 1 : -1;
  });
  
  /* istanbul ignore next */
  sortedTodos.forEach((todo, index) => {
    const realIndex = todos.findIndex(t => t.id === todo.id);
    const item = document.createElement('div');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;
    item.innerHTML = `
      <div class="todo-checkbox${todo.completed ? ' checked' : ''}" data-index="${realIndex}"></div>
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <span class="priority-badge priority-${todo.priority}">${getPriorityEmoji(todo.priority)}</span>
      <button class="todo-delete" data-index="${realIndex}">×</button>
    `;
    todoList.appendChild(item);
  });
  
  // Add event listeners
  document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', handleToggleTodo);
  });
  
  document.querySelectorAll('.todo-delete').forEach(btn => {
    btn.addEventListener('click', handleDeleteTodo);
  });
}

// Handle add todo
function handleAddTodo() {
  const text = todoInput.value.trim();

  if (!text) return;

  const incompleteCount = todos.filter(t => !t.completed).length;
  if (!isPremium && incompleteCount >= MAX_FREE_TODOS) {
    /* istanbul ignore next */
    alert(`Free users can have up to ${MAX_FREE_TODOS} active todos. Complete or remove some to add more.`);
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    priority: prioritySelect.value,
    completed: false
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoInput.value = '';
}

// Handle toggle todo
/* istanbul ignore next */
function handleToggleTodo(e) {
  const index = parseInt(e.target.dataset.index);
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// Handle delete todo
/* istanbul ignore next */
function handleDeleteTodo(e) {
  const index = parseInt(e.target.dataset.index);
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// Save todos
/* istanbul ignore next */
function saveTodos() {
  chrome.storage.local.set({ todos });
}

// Display random tip (fetched from background - single source of truth)
function displayRandomTip() {
  /* istanbul ignore next */
  chrome.runtime.sendMessage({ type: "GET_TIPS" }, (response) => {
    if (chrome.runtime.lastError) {
      /* istanbul ignore next */
      tipText.textContent = "Tip unavailable. Check your connection.";
      return;
    }
    /* istanbul ignore next */
    if (response && response.tips && response.tips.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.tips.length);
      tipText.textContent = response.tips[randomIndex];
    }
  });
}

// Handle upgrade (placeholder)
/* istanbul ignore next */
function handleUpgrade() {
  alert('Premium feature! This would open a payment flow in a production extension.\n\nFor now, you can simulate upgrading by running:\nchrome.storage.local.set({ isPremium: true })');
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getPriorityEmoji(priority) {
  switch (priority) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: /* istanbul ignore next */ return '';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    displayRandomTip,
    handleAddTodo,
    getPriorityEmoji,
    escapeHtml,
    loadSettings,
    MAX_FREE_TODOS,
    renderTodos
  };
}
