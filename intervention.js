// Intervention Popup Script for Stop Scrolling Mindlessly

let todos = [];
let isPremium = false;
let interventionData = null;
let scrollTimestamps = [];
let spmUpdateInterval;
let spmHideTimeout;

// DOM Elements
const todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTodoBtn = document.getElementById('addTodoBtn');
const tipText = document.getElementById('tipText');
const adSection = document.getElementById('adSection');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const disableDomainBtn = document.getElementById('disableDomainBtn');
const settingsLink = document.getElementById('settingsLink');
const scrollsPerMinuteOverlay = document.getElementById('scrollsPerMinuteOverlay');
const scrollsPerMinuteValue = document.getElementById('scrollsPerMinuteValue');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadDataFromUrl();
  await loadSettings();
  renderTodos(); // Ensure renderTodos is called after data is loaded
  updateAdVisibility();
  setupEventListeners();
});

// Load data from URL parameters (passed from background.js)
async function loadDataFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const dataParam = params.get('data');
  
  if (dataParam) {
    try {
      interventionData = JSON.parse(decodeURIComponent(dataParam));
      
      // Display tip
      if (interventionData.tip) {
        tipText.textContent = interventionData.tip;
      }
      
      // Set isPremium flag
      isPremium = interventionData.isPremium || false;
      
      // Use todos from intervention data if available
      if (interventionData.todos && interventionData.todos.length > 0) {
        todos = interventionData.todos;
      }
    } catch (e) {
      console.error('Error parsing intervention data:', e);
    }
  }
}

// Load settings from Chrome storage
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['todos', 'isPremium'], (result) => {
      // Only use stored todos if we didn't get them from intervention data
      if (todos.length === 0 && result.todos) {
        todos = result.todos;
      }
      if (!isPremium) {
        isPremium = result.isPremium || false;
      }
      resolve();
    });
  });
}

// Update ad visibility based on premium status
function updateAdVisibility() {
  if (isPremium) {
    adSection.style.display = 'none';
  } else {
    adSection.style.display = 'block';
  }
}

// Setup event listeners
function setupEventListeners() {
  addTodoBtn.addEventListener('click', handleAddTodo);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTodo();
  });
  modalCloseBtn.addEventListener('click', closeWindow);
  disableDomainBtn.addEventListener('click', handleDisableDomain);
  settingsLink.addEventListener('click', openSettings);

  // Add scroll event listener for SPM
  window.addEventListener('scroll', handleScroll);
}

// Open settings page
function openSettings() {
  console.log("Settings link clicked from intervention.");
  chrome.runtime.sendMessage({ type: "OPEN_OPTIONS_PAGE" });
  window.close();
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

  sortedTodos.forEach((todo) => {
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

// Dismiss and continue (won't show again for a while)
function dismissAndContinue() {
  // Store dismissal timestamp to prevent immediate re-showing
  chrome.storage.local.set({ lastDismissal: Date.now() }, () => {
    window.close();
  });
}

// Close window
function closeWindow() {
  window.close();
}

// Handle disable domain
function handleDisableDomain() {
  if (interventionData && interventionData.currentDomain) {
    // Get current ignored domains
    chrome.storage.local.get(['ignoredDomains'], (result) => {
      const ignoredDomains = result.ignoredDomains || [];
      const domain = interventionData.currentDomain.replace('www.', '');

      // Add domain if not already ignored
      if (!ignoredDomains.includes(domain)) {
        ignoredDomains.push(domain);
        chrome.storage.local.set({ ignoredDomains }, () => {
          alert(`Extension disabled on ${domain}. You can re-enable it in the extension settings.`);
          window.close();
        });
      } else {
        alert(`Extension is already disabled on ${domain}.`);
        window.close();
      }
    });
  } else {
    alert('Unable to determine current domain.');
  }
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

// Scrolls Per Minute (SPM) Overlay Logic
function handleScroll() {
  const now = Date.now();
  scrollTimestamps.push(now);

  // Remove timestamps older than 1 minute (60 seconds)
  const oneMinuteAgo = now - 60 * 1000;
  while (scrollTimestamps.length > 0 && scrollTimestamps[0] < oneMinuteAgo) {
    scrollTimestamps.shift();
  }

  // Show overlay and update SPM
  if (scrollsPerMinuteOverlay.style.display === 'none' || scrollsPerMinuteOverlay.style.display === '') {
    scrollsPerMinuteOverlay.style.display = 'block';
    startSpmUpdateInterval();
  }

  // Reset hide timeout
  clearTimeout(spmHideTimeout);
  spmHideTimeout = setTimeout(() => {
    scrollsPerMinuteOverlay.style.display = 'none';
    clearInterval(spmUpdateInterval);
  }, 1000); // Hide after 1 second of no scrolling
}

function updateSpmValue() {
  scrollsPerMinuteValue.textContent = scrollTimestamps.length;
}

function startSpmUpdateInterval() {
  if (!spmUpdateInterval) {
    spmUpdateInterval = setInterval(updateSpmValue, 200); // Update every 200ms
  }
}
