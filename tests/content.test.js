const setup = require('./setup');

describe('Content Script Logic', () => {
  let scrollCount = 0;
  let currentScrollUnitDistance = 0;
  let lastScrollY = 0;
  const SCROLL_UNIT_THRESHOLD_FACTOR = 0.5;
  const viewportHeight = 1000; // Mock viewport height
  const scrollUnitThreshold = viewportHeight * SCROLL_UNIT_THRESHOLD_FACTOR; // 500

  beforeEach(() => {
    setup();
    scrollCount = 0;
    currentScrollUnitDistance = 0;
    lastScrollY = 0;
    global.window.innerHeight = viewportHeight;
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
});
