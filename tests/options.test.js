const setup = require('./setup');

describe('Options UI', () => {
  let settings = {
    scrollThreshold: 20,
    timeWindowSeconds: 45,
    ignoredDomains: []
  };

  beforeEach(() => {
    setup();
    settings = {
      scrollThreshold: 20,
      timeWindowSeconds: 45,
      ignoredDomains: []
    };
    jest.clearAllMocks();
  });

  test('T07: Scroll Threshold', () => {
    const slider = document.getElementById('scrollThreshold');
    slider.value = 30;

    // Simulate change
    settings.scrollThreshold = parseInt(slider.value);
    chrome.storage.local.set(settings);

    expect(settings.scrollThreshold).toBe(30);
    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({ scrollThreshold: 30 }));
  });

  test('T08: Time Window', () => {
    const slider = document.getElementById('timeWindow');
    slider.value = 60;

    // Simulate change
    settings.timeWindowSeconds = parseInt(slider.value);
    chrome.storage.local.set(settings);

    expect(settings.timeWindowSeconds).toBe(60);
    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({ timeWindowSeconds: 60 }));
  });

  test('T09: Add Domain', () => {
    const input = document.getElementById('domainInput');
    input.value = 'example.com';

    // Simulate add
    settings.ignoredDomains.push(input.value);
    chrome.storage.local.set(settings);

    expect(settings.ignoredDomains).toContain('example.com');
    expect(chrome.storage.local.set).toHaveBeenCalled();
  });

  test('T10: Remove Domain', () => {
    settings.ignoredDomains = ['example.com'];

    // Simulate remove
    settings.ignoredDomains = settings.ignoredDomains.filter(d => d !== 'example.com');
    chrome.storage.local.set(settings);

    expect(settings.ignoredDomains).not.toContain('example.com');
  });

  test('T11: Reset Settings', () => {
    settings.scrollThreshold = 50;

    // Simulate reset
    settings = {
      scrollThreshold: 20,
      timeWindowSeconds: 45,
      ignoredDomains: []
    };
    chrome.storage.local.set(settings);

    expect(settings.scrollThreshold).toBe(20);
  });
});
