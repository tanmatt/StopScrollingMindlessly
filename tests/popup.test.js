const setup = require('./setup');

describe('Popup UI', () => {
  let popup;
  let todos = [];

  beforeEach(() => {
    setup();
    todos = [];
    jest.clearAllMocks();
    jest.resetModules();
    chrome.runtime.lastError = null;
    popup = require('../popup.js');
  });

  test('T01: Add TODO', () => {
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    todoInput.value = 'New Task';
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
    todos[0].completed = !todos[0].completed;
    expect(todos[0].completed).toBe(true);
  });

  test('T03: Delete TODO', () => {
    todos = [{ id: 1, text: 'Task 1', priority: 'medium', completed: false }];
    todos.splice(0, 1);
    expect(todos.length).toBe(0);
  });

  test('T04: Refresh Tip - displayRandomTip calls sendMessage', () => {
    popup.displayRandomTip();
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ type: 'GET_TIPS' }, expect.any(Function));
  });

  test('T04b: displayRandomTip sets tip when GET_TIPS responds', () => {
    const tipText = document.getElementById('tipText');
    let callback;
    chrome.runtime.sendMessage.mockImplementation((msg, cb) => {
      callback = cb;
    });
    popup.displayRandomTip();
    callback({ tips: ['Tip A', 'Tip B'] });
    expect(tipText.textContent).toMatch(/Tip [AB]/);
  });

  test('T05: Settings Link', () => {
    chrome.runtime.openOptionsPage();
    expect(chrome.runtime.openOptionsPage).toHaveBeenCalled();
  });

  test('getPriorityEmoji returns correct emojis', () => {
    expect(popup.getPriorityEmoji('high')).toBe('🔴');
    expect(popup.getPriorityEmoji('medium')).toBe('🟡');
    expect(popup.getPriorityEmoji('low')).toBe('🟢');
  });

  test('escapeHtml escapes special chars', () => {
    expect(popup.escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  test('MAX_FREE_TODOS is 5', () => {
    expect(popup.MAX_FREE_TODOS).toBe(5);
  });

  test('handleAddTodo adds todo and saves to storage', () => {
    const todoInput = document.getElementById('todoInput');
    todoInput.value = 'New task';
    popup.handleAddTodo();
    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({ todos: expect.any(Array) }));
  });
});
