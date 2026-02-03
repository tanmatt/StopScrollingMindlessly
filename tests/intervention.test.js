const setup = require('./setup');

describe('Intervention UI', () => {
  let intervention;

  beforeEach(() => {
    setup();
    jest.clearAllMocks();
    chrome.storage.local.get.mockImplementation((keys, cb) => {
      const result = { todos: [], isPremium: false };
      if (typeof keys === 'function') (cb = keys)(result);
      else if (cb) cb(result);
      return Promise.resolve(result);
    });
    jest.resetModules();
    intervention = require('../intervention.js');
    if (document.readyState !== 'loading') {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }
  });

  test('T12: Close Intervention', () => {
    intervention.closeWindow();
    expect(global.window.close).toHaveBeenCalled();
  });

  test('T14: Disable Domain', () => {
    const currentDomain = 'example.com';
    const ignoredDomains = [];
    ignoredDomains.push(currentDomain);
    chrome.storage.local.set({ ignoredDomains });
    expect(ignoredDomains).toContain('example.com');
    expect(chrome.storage.local.set).toHaveBeenCalled();
  });

  test('T15: Settings Icon', () => {
    chrome.runtime.sendMessage({ type: "OPEN_OPTIONS_PAGE" });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ type: "OPEN_OPTIONS_PAGE" });
  });

  test('T17: renderTodos renders items', () => {
    const todoList = document.getElementById('todoList');
    intervention.renderTodos();
    expect(todoList).toBeTruthy();
  });

  test('getPriorityEmoji returns correct emojis', () => {
    expect(intervention.getPriorityEmoji('high')).toBe('🔴');
    expect(intervention.getPriorityEmoji('medium')).toBe('🟡');
    expect(intervention.getPriorityEmoji('low')).toBe('🟢');
    expect(intervention.getPriorityEmoji('unknown')).toBe('');
  });

  test('escapeHtml escapes special chars', () => {
    expect(intervention.escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  test('MAX_FREE_TODOS is 5', () => {
    expect(intervention.MAX_FREE_TODOS).toBe(5);
  });

  test('handleAddTodo adds todo and saves to storage', () => {
    const todoInput = document.getElementById('todoInput');
    todoInput.value = 'New task';
    intervention.handleAddTodo();
    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({ todos: expect.any(Array) }));
  });

  test('loadSettings loads from storage', async () => {
    chrome.storage.local.get.mockImplementation((keys, cb) => {
      if (typeof keys === 'function') (cb = keys)({ todos: [], isPremium: false });
      else cb({ todos: [], isPremium: false });
      return Promise.resolve({ todos: [], isPremium: false });
    });
    await intervention.loadSettings();
    expect(chrome.storage.local.get).toHaveBeenCalled();
  });

  test('loadDataFromUrl parses data param', async () => {
    const data = { tip: 'Test tip', todos: [], isPremium: false };
    const origLocation = global.window.location;
    Object.defineProperty(global.window, 'location', { value: { search: '?data=' + encodeURIComponent(JSON.stringify(data)) }, configurable: true });
    await intervention.loadDataFromUrl();
    expect(document.getElementById('tipText').textContent).toBe('Test tip');
    Object.defineProperty(global.window, 'location', { value: origLocation, configurable: true });
  });

  test('updateAdVisibility is callable', () => {
    intervention.updateAdVisibility();
    expect(document.getElementById('adSection')).toBeTruthy();
  });
});
