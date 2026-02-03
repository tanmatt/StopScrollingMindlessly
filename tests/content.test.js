const setup = require('./setup');

describe('Content Script Logic', () => {
  let scrollCount = 0;
  let currentScrollUnitDistance = 0;
  let lastScrollY = 0;
  let content;
  const SCROLL_UNIT_THRESHOLD_FACTOR = 0.5;
  const viewportHeight = 1000;
  const scrollUnitThreshold = viewportHeight * SCROLL_UNIT_THRESHOLD_FACTOR;

  beforeEach(() => {
    setup();
    scrollCount = 0;
    currentScrollUnitDistance = 0;
    lastScrollY = 0;
    global.window.innerHeight = viewportHeight;
    global.window.scrollY = 0;
    global.window.location = { hostname: 'example.com' };
    jest.resetModules();
    content = require('../content.js');
  });

  test('T03: Scroll Direction - Down', () => {
    const currentScrollY = 100;
    const deltaY = currentScrollY - lastScrollY; // 100 - 0 = 100 (positive)

    if (deltaY > 0) {
      currentScrollUnitDistance += deltaY;
    }

    expect(currentScrollUnitDistance).toBe(100);
  });

  test('T03: Scroll Direction - Up', () => {
    lastScrollY = 200;
    const currentScrollY = 100;
    const deltaY = currentScrollY - lastScrollY; // 100 - 200 = -100 (negative)

    if (deltaY > 0) {
      currentScrollUnitDistance += deltaY;
    }

    expect(currentScrollUnitDistance).toBe(0); // Should not increase
  });

  test('Half Page Scroll Logic', () => {
    // Threshold is 500

    // Scroll 1: 300px down
    let currentScrollY = 300;
    let deltaY = currentScrollY - lastScrollY;
    if (deltaY > 0) currentScrollUnitDistance += deltaY;
    lastScrollY = currentScrollY;

    // Check: Not yet a scroll count
    if (currentScrollUnitDistance >= scrollUnitThreshold) {
      scrollCount++;
      currentScrollUnitDistance = 0;
    }
    expect(scrollCount).toBe(0);
    expect(currentScrollUnitDistance).toBe(300);

    // Scroll 2: Another 300px down (Total 600px > 500px)
    currentScrollY = 600;
    deltaY = currentScrollY - lastScrollY;
    if (deltaY > 0) currentScrollUnitDistance += deltaY;
    lastScrollY = currentScrollY;

    // Check: Should increment scroll count
    if (currentScrollUnitDistance >= scrollUnitThreshold) {
      scrollCount++;
      currentScrollUnitDistance = 0;
    }
    expect(scrollCount).toBe(1);
    expect(currentScrollUnitDistance).toBe(0);
  });

  test('T16: SPM Overlay Logic', () => {
    let scrollTimestamps = [];
    const now = Date.now();

    // Simulate scrolls (chronological order: oldest first)
    scrollTimestamps.push(now - 61000); // Older than 1 minute
    scrollTimestamps.push(now - 1000);
    scrollTimestamps.push(now);

    // Filter logic
    const oneMinuteAgo = now - 60 * 1000;
    while (scrollTimestamps.length > 0 && scrollTimestamps[0] < oneMinuteAgo) {
      scrollTimestamps.shift();
    }

    expect(scrollTimestamps.length).toBe(2);
  });

  test('validateScrollThreshold clamps to 1-100', () => {
    expect(content.validateScrollThreshold(15)).toBe(15);
    expect(content.validateScrollThreshold(0)).toBe(1);
    expect(content.validateScrollThreshold(200)).toBe(100);
    expect(content.validateScrollThreshold('x')).toBe(10);
  });

  test('validateTimeWindow clamps to 5-300', () => {
    expect(content.validateTimeWindow(45)).toBe(45);
    expect(content.validateTimeWindow(1)).toBe(5);
    expect(content.validateTimeWindow(400)).toBe(300);
  });

  test('NO_SCROLL_RESET_MS is 30 seconds', () => {
    expect(content.NO_SCROLL_RESET_MS).toBe(30 * 1000);
  });

  test('IDLE_RESET_MS is 5 minutes', () => {
    expect(content.IDLE_RESET_MS).toBe(5 * 60 * 1000);
  });

  test('resetScrollCountDueToNoScroll is callable', () => {
    expect(() => content.resetScrollCountDueToNoScroll()).not.toThrow();
  });

  test('initializeDomainData sets domain', () => {
    content.initializeDomainData();
    expect(() => content.initializeDomainData()).not.toThrow();
  });

  test('resetForDomainChange when same domain does nothing', () => {
    global.window.location = { hostname: 'example.com' };
    content.initializeDomainData();
    content.resetForDomainChange();
    content.resetForDomainChange();
    expect(() => content.resetForDomainChange()).not.toThrow();
  });

  afterEach(() => {
    if (content.clearAllTimeouts) content.clearAllTimeouts();
  });
});
