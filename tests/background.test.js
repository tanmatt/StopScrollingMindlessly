const setup = require('./setup');

describe('Background Script', () => {
  let listeners = {};
  let background;

  beforeEach(() => {
    setup();
    jest.resetModules();
    background = require('../background.js');
    listeners.onInstalled = global.chrome.runtime.onInstalled.addListener.mock.calls[0][0];
    listeners.onClicked = global.chrome.action.onClicked.addListener.mock.calls[0][0];
    listeners.onActivated = global.chrome.tabs.onActivated.addListener.mock.calls[0][0];
    listeners.onMessage = global.chrome.runtime.onMessage.addListener.mock.calls[0][0];
  });

  test('onInstalled: sets default settings if fresh install', async () => {
    // Mock storage.get to return empty object (undefined hasCompletedSetup)
    global.chrome.storage.local.get.mockImplementation((keys, cb) => {
      if (typeof keys === 'function') cb = keys;
      return Promise.resolve({});
    });

    await listeners.onInstalled();

    expect(global.chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({
      scrollThreshold: 20,
      hasCompletedSetup: false
    }));
  });

  test('onInstalled: does not overwrite if setup exists', async () => {
    global.chrome.storage.local.get.mockImplementation(() => Promise.resolve({ hasCompletedSetup: true }));

    await listeners.onInstalled();

    expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
  });

  test('onClicked: opens options page if setup not completed', async () => {
    global.chrome.storage.local.get.mockImplementation(() => Promise.resolve({ hasCompletedSetup: false }));

    await listeners.onClicked({});

    expect(global.chrome.runtime.openOptionsPage).toHaveBeenCalled();
  });

  test('onActivated: sends RESET_SCROLL_COUNT', () => {
    listeners.onActivated({ tabId: 123 });
    expect(global.chrome.tabs.sendMessage).toHaveBeenCalledWith(123, { type: "RESET_SCROLL_COUNT" });
  });

  test('onMessage: GET_SETTINGS', async () => {
    const sendResponse = jest.fn();
    global.chrome.storage.local.get.mockImplementation(() => Promise.resolve({ some: 'setting' }));

    listeners.onMessage({ type: "GET_SETTINGS" }, {}, sendResponse);

    // Wait for promise resolution
    await new Promise(process.nextTick);

    expect(sendResponse).toHaveBeenCalledWith({ some: 'setting' });
  });

  test('onMessage: OPEN_OPTIONS_PAGE', () => {
    listeners.onMessage({ type: "OPEN_OPTIONS_PAGE" }, {}, jest.fn());
    expect(global.chrome.runtime.openOptionsPage).toHaveBeenCalled();
  });

  test('getProductivityTips returns array of 20 tips', () => {
    const tips = background.getProductivityTips();
    expect(tips).toHaveLength(20);
    expect(tips[0]).toContain('two-minute');
  });

  test('getSettings returns storage result', async () => {
    global.chrome.storage.local.get.mockResolvedValue({ scrollThreshold: 25 });
    const result = await background.getSettings();
    expect(result.scrollThreshold).toBe(25);
  });

  test('getAdPlaceholder returns placeholder object', () => {
    const ad = background.getAdPlaceholder();
    expect(ad).toHaveProperty('text');
    expect(ad).toHaveProperty('cta');
  });

  test('defaultSettings has expected structure', () => {
    expect(background.defaultSettings.scrollThreshold).toBe(20);
    expect(background.defaultSettings.timeWindowSeconds).toBe(45);
    expect(background.defaultSettings.hasCompletedSetup).toBe(false);
  });

  test('updateTodos saves to storage', async () => {
    const todos = [{ id: 1, text: 'Test', priority: 'medium', completed: false }];
    const result = await background.updateTodos(todos);
    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({ todos });
    expect(result).toEqual({ success: true });
  });

  test('checkPremiumStatus returns isPremium', async () => {
    global.chrome.storage.local.get.mockResolvedValue({ isPremium: true });
    const result = await background.checkPremiumStatus();
    expect(result).toEqual({ isPremium: true });
  });
});
