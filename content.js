// Content Script for Stop Scrolling Mindlessly
// Detects mindless scrolling patterns on web pages

// Domain-specific scroll tracking to prevent cross-domain count carryover
let currentDomain = '';
let scrollCount = 0;
let scrollTimestamps = [];
let lastScrollY = 0;
let lastActivityTime = Date.now();
let idleTimeout;

// Idle reset after 5 minutes (300,000 ms)
const IDLE_RESET_MS = 5 * 60 * 1000;

// Default threshold - will be overridden by settings from background
let scrollThreshold = 10;
let timeWindowSeconds = 30;

// Initialize domain-specific data
function initializeDomainData() {
  try {
    currentDomain = window.location.hostname.replace('www.', '');
    // Reset scroll data for new domain to ensure domain isolation
    scrollCount = 0;
    scrollTimestamps = [];
    lastActivityTime = Date.now();
  } catch (e) {
    // Fallback for edge cases
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
    lastActivityTime = Date.now();
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
      });
    }
  } catch (e) {
    // Extension context invalidated, use defaults
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
      // Reset idle timeout since there's activity
      setupIdleTimeout();
    }
  });
}

// Helper function to reset scroll count due to idle timeout
function resetScrollCountDueToIdle() {
  scrollCount = 0;
  scrollTimestamps = [];
  // Set up next idle timeout
  setupIdleTimeout();
}

// Helper function to setup idle timeout
function setupIdleTimeout() {
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(resetScrollCountDueToIdle, IDLE_RESET_MS);
}

// Helper function to send message with error handling
function sendScrollDetected() {
  try {
    if (chrome.runtime && chrome.runtime.id) {
      chrome.runtime.sendMessage({ type: "SCROLL_DETECTED" });
    }
  } catch (e) {
    // Extension context invalidated, ignore
  }
}

// Single comprehensive scroll event handler
window.addEventListener('scroll', () => {
  const currentTime = Date.now();
  const currentScrollY = window.scrollY;

  // Reset idle timeout on any scroll activity
  setupIdleTimeout();

  // Only count scroll events if position actually changed (filter out micro-scrolls)
  if (Math.abs(currentScrollY - lastScrollY) > 10) {
    // Update scroll position tracking
    lastScrollY = currentScrollY;

    // Add timestamp for this scroll event
    scrollTimestamps.push(currentTime);

    // Remove timestamps older than time window
    const cutoffTime = currentTime - (timeWindowSeconds * 1000);
    scrollTimestamps = scrollTimestamps.filter(t => t > cutoffTime);

    // Count total scroll events (not direction-specific)
    scrollCount++;

    // Check if we've exceeded threshold
    if (scrollCount >= scrollThreshold) {
      // Reset counter and timestamps
      scrollCount = 0;
      scrollTimestamps = [];

      // Notify background script
      sendScrollDetected();
    }
  }
});
