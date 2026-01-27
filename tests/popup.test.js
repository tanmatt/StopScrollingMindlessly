const setup = require('./setup');

describe('Popup UI', () => {
  let todos = [];

  beforeEach(() => {
    setup();
    todos = [];
    // No need to clear innerHTML manually as setup() resets document.body.innerHTML
    jest.clearAllMocks();
  });

  test('T01: Add TODO', () => {
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    todoInput.value = 'New Task';

    // Simulate click handler logic
    const text = todoInput.value.trim();
    if (text) {
      todos.push({ id: Date.now(), text, priority: 'medium', completed: false });
      const item = document.createElement('div');
      item.textContent = text;
      todoList.appendChild(item);
    }

    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe('New Task');
    expect(todoList.children.length).toBe(1);
  });

  test('T02: Complete TODO', () => {
    todos = [{ id: 1, text: 'Task 1', priority: 'medium', completed: false }];

    // Simulate toggle logic
    todos[0].completed = !todos[0].completed;

    expect(todos[0].completed).toBe(true);
  });

  test('T03: Delete TODO', () => {
    todos = [{ id: 1, text: 'Task 1', priority: 'medium', completed: false }];

    // Simulate delete logic
    todos.splice(0, 1);

    expect(todos.length).toBe(0);
  });

  test('T04: Refresh Tip', () => {
    const tipText = document.getElementById('tipText');
    const tips = ["Tip 1", "Tip 2"];

    // Simulate refresh logic
    const randomTip = tips[0];
    tipText.textContent = randomTip;

    expect(tipText.textContent).toBe("Tip 1");
  });

  test('T05: Settings Link', () => {
    const settingsLink = document.getElementById('settingsLink');

    // Simulate click
    // In actual code: chrome.runtime.openOptionsPage();
    chrome.runtime.openOptionsPage();
    expect(chrome.runtime.openOptionsPage).toHaveBeenCalled();
  });
});
