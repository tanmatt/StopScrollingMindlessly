// Content Script for Stop Scrolling Mindlessly
// Detects mindless scrolling patterns on web pages

// Domain-specific scroll tracking to prevent cross-domain count carryover
let currentDomain = '';
let scrollCount = 0;
let scrollTimestamps = [];
let lastScrollY = 0;
let lastActivityTime = Date.now();
let currentScrollUnitDistance = 0; // Accumulates scroll distance for the "half page" logic
let interventionActive = false; // Flag to prevent re-triggering intervention while one is active

// Idle reset after 5 minutes (300,000 ms)
const IDLE_RESET_MS = 5 * 60 * 1000;

// No-scroll reset: reset count after 30 seconds without scrolling
const NO_SCROLL_RESET_MS = 30 * 1000;

// Default threshold - will be overridden by settings from background
let scrollThreshold = 10;
let timeWindowSeconds = 30;
let settingsReady = false;
let idleTimeout;
let noScrollResetTimeout;

// Factor for what constitutes a "scroll unit" (e.g., 0.5 for half page)
const SCROLL_UNIT_THRESHOLD_FACTOR = 0.5;

// Scroll rate tracking for overlay widget
let scrollRateData = [];
const SCROLL_RATE_WINDOW_MS = 60000; // 1 minute window for rate calculation

// Initialize domain-specific data
function initializeDomainData() {
  try {
    currentDomain = window.location.hostname.replace('www.', '');
    scrollCount = 0;
    scrollTimestamps = [];
    lastScrollY = window.scrollY;
    currentScrollUnitDistance = 0;
    lastActivityTime = Date.now();
    interventionActive = false;
    clearTimeout(noScrollResetTimeout);
    noScrollResetTimeout = null;
  } catch (e) {
    currentDomain = 'unknown';
  }
}

// Reset scroll data when navigating to different domain
function resetForDomainChange() {
  const newDomain = window.location.hostname.replace('www.', '');
  if (newDomain !== currentDomain) {
    currentDomain = newDomain;
    scrollCount = 0;
    scrollTimestamps = [];
    lastScrollY = window.scrollY;
    currentScrollUnitDistance = 0;
    lastActivityTime = Date.now();
    interventionActive = false;
    clearTimeout(noScrollResetTimeout);
    noScrollResetTimeout = null;
    setupIdleTimeout();
  }
}

// Settings validation functions
function validateScrollThreshold(value) {
  const num = parseInt(value);
  return isNaN(num) ? 10 : Math.max(1, Math.min(100, num)); // Between 1-100
}

function validateTimeWindow(value) {
  const num = parseInt(value);
  return isNaN(num) ? 30 : Math.max(5, Math.min(300, num)); // Between 5-300 seconds
}

// Helper function to get settings with error handling
function getSettings() {
  try {
    if (chrome.runtime && chrome.runtime.id) {
      chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (settings) => {
        if (settings) {
          scrollThreshold = validateScrollThreshold(settings.scrollThreshold) || 10;
          timeWindowSeconds = validateTimeWindow(settings.timeWindowSeconds) || 30;
        }
        settingsReady = true;
      });
    } else {
      settingsReady = true;
    }
  } catch (e) {
    // Extension context invalidated, use defaults
    settingsReady = true;
  }
}

// Initialize domain-specific data and settings
initializeDomainData();
getSettings();
setupIdleTimeout();

// Handle SPA navigation and page changes
window.addEventListener('load', initializeDomainData);
window.addEventListener('beforeunload', () => {
  clearTimeout(idleTimeout);
  clearTimeout(noScrollResetTimeout);
});

// Update settings when changed
if (chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "SETTINGS_UPDATED") {
      scrollThreshold = validateScrollThreshold(message.settings.scrollThreshold) || 10;
      timeWindowSeconds = validateTimeWindow(message.settings.timeWindowSeconds) || 30;
    } else if (message.type === "RESET_SCROLL_COUNT") {
      // Reset scroll counter when popup is shown
      scrollCount = 0;
      scrollTimestamps = [];
      currentScrollUnitDistance = 0;
      interventionActive = false;
      clearTimeout(noScrollResetTimeout);
      noScrollResetTimeout = null;
      setupIdleTimeout();
    }
  });
}

// Helper function to reset scroll count due to idle timeout (5 min)
function resetScrollCountDueToIdle() {
  scrollCount = 0;
  scrollTimestamps = [];
  currentScrollUnitDistance = 0;
  clearTimeout(noScrollResetTimeout);
  noScrollResetTimeout = null;
  setupIdleTimeout();
}

// Helper function to reset scroll count after 30s of no scrolling
function resetScrollCountDueToNoScroll() {
  scrollCount = 0;
  scrollTimestamps = [];
  currentScrollUnitDistance = 0;
  noScrollResetTimeout = null;
}

// Helper function to setup idle timeout
function setupIdleTimeout() {
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(resetScrollCountDueToIdle, IDLE_RESET_MS);
}

// Setup 30s no-scroll reset timer (call on each scroll)
function setupNoScrollResetTimeout() {
  clearTimeout(noScrollResetTimeout);
  noScrollResetTimeout = setTimeout(resetScrollCountDueToNoScroll, NO_SCROLL_RESET_MS);
}

// Helper function to send message with error handling
function sendScrollDetected() {
  try {
    if (chrome.runtime && chrome.runtime.id) {
      interventionActive = true; // Set flag to prevent further triggers
      chrome.runtime.sendMessage({ type: "SCROLL_DETECTED" });
    }
  } catch (e) {
    // Extension context invalidated, ignore
  }
}

// Scroll rate calculation and overlay widget
function calculateScrollRate() {
  const now = Date.now();
  const cutoffTime = now - SCROLL_RATE_WINDOW_MS;
  
  // Filter timestamps within the last minute
  scrollRateData = scrollRateData.filter(t => t > cutoffTime);
  
  // Calculate scrolls per minute
  const scrollRate = scrollRateData.length;
  
  // Update overlay widget
  updateScrollRateOverlay(scrollRate);
  
  return scrollRate;
}

// Create and update scroll rate overlay widget
function updateScrollRateOverlay(scrollRate) {
  let widget = document.getElementById('scroll-rate-widget');
  
  if (!widget) {
    widget = document.createElement('div');
    widget.id = 'scroll-rate-widget';
    widget.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      z-index: 2147483647;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.2);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(widget);
  }
  
  widget.textContent = `Scrolls/min: ${scrollRate}`;
  
  // Auto-hide after 3 seconds of inactivity
  clearTimeout(widget.hideTimeout);
  widget.style.opacity = '1';
  widget.hideTimeout = setTimeout(() => {
    widget.style.opacity = '0';
  }, 3000);
}

// Reset scroll rate data when domain changes
function resetScrollRateData() {
  scrollRateData = [];
  const widget = document.getElementById('scroll-rate-widget');
  if (widget) {
    widget.remove();
  }
}

// Single comprehensive scroll event handler
window.addEventListener('scroll', () => {
  if (interventionActive) {
    return;
  }
  if (!settingsReady) {
    return; // Don't count until settings are loaded
  }

  const currentTime = Date.now();
  const currentScrollY = window.scrollY;
  const deltaY = currentScrollY - lastScrollY;

  // Only process if there's actual scroll movement
  if (deltaY > 0) {
    setupIdleTimeout();
    setupNoScrollResetTimeout();

    // Add timestamp for this scroll event (for time window)
    scrollTimestamps.push(currentTime);

    // Remove timestamps older than time window
    const cutoffTime = currentTime - (timeWindowSeconds * 1000);
    scrollTimestamps = scrollTimestamps.filter(t => t > cutoffTime);

    // Accumulate scroll distance for the "half page" logic
    currentScrollUnitDistance += deltaY;

    const viewportHeight = window.innerHeight;
    const scrollUnitThreshold = viewportHeight * SCROLL_UNIT_THRESHOLD_FACTOR;

    // If accumulated scroll distance exceeds half page, count it as a "scroll unit"
    if (currentScrollUnitDistance >= scrollUnitThreshold) {
        scrollCount++;
        currentScrollUnitDistance = 0; // Reset for the next unit
    }

    // Update lastScrollY for the next delta calculation
    lastScrollY = currentScrollY;

    // Track scroll rate for overlay widget (this should still count every scroll event)
    scrollRateData.push(currentTime);
    calculateScrollRate();

    // Check if we've exceeded threshold for intervention
    if (scrollCount >= scrollThreshold) {
      // Reset counter and timestamps for intervention logic
      scrollCount = 0;
      scrollTimestamps = [];
      currentScrollUnitDistance = 0; // Also reset this

      // Notify background script
      sendScrollDetected();
    }
  } else {
    // User is scrolling up, reset lastScrollY to the current position
    lastScrollY = currentScrollY;
  }
});

// Handle domain changes to reset scroll rate data
window.addEventListener('load', () => {
  resetForDomainChange();
  resetScrollRateData();
});

// Handle SPA navigation
window.addEventListener('popstate', () => {
  resetForDomainChange();
  resetScrollRateData();
});

function clearAllTimeouts() {
  if (typeof idleTimeout !== 'undefined') clearTimeout(idleTimeout);
  if (typeof noScrollResetTimeout !== 'undefined') clearTimeout(noScrollResetTimeout);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateScrollThreshold,
    validateTimeWindow,
    resetScrollCountDueToNoScroll,
    resetScrollCountDueToIdle,
    getSettings,
    initializeDomainData,
    resetForDomainChange,
    NO_SCROLL_RESET_MS,
    IDLE_RESET_MS,
    setupNoScrollResetTimeout,
    clearAllTimeouts
  };
}
