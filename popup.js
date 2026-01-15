// Popup Script for Stop Scrolling Mindlessly

const MAX_FREE_TODOS = 5;
let todos = [];
let isPremium = false;
let currentTipIndex = 0;

// Productivity tips (same as in background.js)
const productivityTips = [
  "The two-minute rule: If a task takes less than 2 minutes, do it now.",
  "Batch similar tasks together to reduce context switching.",
  "Take a 5-minute break every 25 minutes of focused work (Pomodoro technique).",
  "Start your day by eating the frog - do your hardest task first.",
  "Sleep 7-9 hours to maintain peak cognitive performance.",
  "Exercise regularly - even 20 minutes can boost brain function.",
  "Drink water throughout the day - dehydration reduces focus.",
  "Use the 1-3-5 rule: 1 big task, 3 medium tasks, 5 small tasks daily.",
  "Eliminate distractions: Put your phone in another room while working.",
  "Review your goals weekly to stay aligned with what matters.",
  "Deep work requires uninterrupted blocks of 90 minutes.",
  "Say no to things that don't align with your priorities.",
  "Use waiting time wisely - listen to podcasts or read articles.",
  "Delegate tasks that others can do well.",
  "Schedule your most creative work during your peak energy hours.",
  "Write down everything - free your mind for important thinking.",
  "Break large projects into small, actionable steps.",
  "Review tomorrow's tasks tonight so you start with clarity.",
  "Limit social media to specific times - don't scroll mindlessly.",
  "Your future self will thank you for what you do today."
];

// DOM Elements
const todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTodoBtn = document.getElementById('addTodoBtn');
const tipText = document.getElementById('tipText');
const refreshTip = document.getElementById('refreshTip');
const adSection = document.getElementById('adSection');
const settingsLink = document.getElementById('settingsLink');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  renderTodos();
  displayRandomTip();
  updatePremiumUI();
  setupEventListeners();
});

// Setup event listeners
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
async function loadSettings() {
  return new Promise((resolve) => {
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
function updatePremiumUI() {
  if (isPremium) {
    adSection.style.display = 'none';
  } else {
    adSection.style.display = 'block';
  }
}

// Render todos
function renderTodos() {
  todoList.innerHTML = '';
  
  // Sort: incomplete first, then by priority
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.completed ? 1 : -1;
  });
  
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

  // Check limit for free users
  const activeTodos = todos.filter(t => !t.completed);
  if (!isPremium && activeTodos.length >= MAX_FREE_TODOS) {
    alert('You\'ve reached the limit of 5 todos. Upgrade to Premium for unlimited todos!');
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
function handleToggleTodo(e) {
  const index = parseInt(e.target.dataset.index);
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// Handle delete todo
function handleDeleteTodo(e) {
  const index = parseInt(e.target.dataset.index);
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// Save todos
function saveTodos() {
  chrome.storage.local.set({ todos });
}

// Display random tip
function displayRandomTip() {
  const randomIndex = Math.floor(Math.random() * productivityTips.length);
  currentTipIndex = randomIndex;
  tipText.textContent = productivityTips[randomIndex];
}

// Handle upgrade (placeholder)
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
    default: return '';
  }
}
