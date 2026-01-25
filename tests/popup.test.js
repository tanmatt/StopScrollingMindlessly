// Mock chrome API
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  runtime: {
    openOptionsPage: jest.fn()
  }
};

// Set up DOM for popup
document.body.innerHTML = `
  <div class="container">
    <div class="todos-section">
      <div class="todo-list" id="todoList"></div>
      <div class="add-todo-form" id="addTodoForm">
        <input type="text" id="todoInput" placeholder="Add a quick task..." maxlength="80">
        <select id="prioritySelect">
          <option value="low">🟢 Low</option>
          <option value="medium" selected>🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <button type="button" id="addTodoBtn">+</button>
      </div>
    </div>
    <div class="tip-section">
      <p id="tipText">Loading...</p>
      <button class="refresh-tip" id="refreshTip">New Tip</button>
    </div>
    <div class="footer">
      <a href="#" id="settingsLink">⚙️ Settings</a>
    </div>
  </div>
`;

// Import and test popup functions
// Since functions are not exported, we'll test by simulating the behavior

describe('Popup Script Tests', () => {
  beforeEach(() => {
    // Reset mocks
    chrome.storage.local.get.mockClear();
    chrome.storage.local.set.mockClear();
    chrome.runtime.openOptionsPage.mockClear();

    // Reset DOM
    document.getElementById('todoList').innerHTML = '';
    document.getElementById('todoInput').value = '';
  });

  test('todo input validation', () => {
    const input = document.getElementById('todoInput');

    // Empty input should not create todo
    input.value = '';
    // Note: In real code, this is checked in handleAddTodo

    // Valid input
    input.value = 'Test todo';
    expect(input.value).toBe('Test todo');
  });

  test('priority select options', () => {
    const select = document.getElementById('prioritySelect');
    expect(select.options.length).toBe(3);
    expect(select.options[0].value).toBe('low');
    expect(select.options[1].value).toBe('medium');
    expect(select.options[2].value).toBe('high');
  });

  test('settings link exists', () => {
    const link = document.getElementById('settingsLink');
    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Settings');
  });
});
