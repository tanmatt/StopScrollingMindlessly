// Content Script for StopScrollingMindlessly
// Detects mindless scrolling patterns on web pages

let scrollCount = 0;
let scrollTimestamps = [];
let lastScrollY = 0;
let scrollDirection = null;
let lastActivityTime = Date.now();
let idleTimeout;

// Idle reset after 5 minutes (300,000 ms)
const IDLE_RESET_MS = 5 * 60 * 1000;

// Default threshold - will be overridden by settings from background
let scrollThreshold = 10;
let timeWindowSeconds = 30;

// Helper function to get settings with error handling
function getSettings() {
  try {
    if (chrome.runtime && chrome.runtime.id) {
      chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (settings) => {
        if (settings) {
          scrollThreshold = settings.scrollThreshold || 10;
          timeWindowSeconds = settings.timeWindowSeconds || 30;
        }
      });
    }
  } catch (e) {
    // Extension context invalidated, use defaults
  }
}

// Initialize settings and idle timeout
getSettings();
setupIdleTimeout();

// Update settings when changed
if (chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "SETTINGS_UPDATED") {
      scrollThreshold = message.settings.scrollThreshold || 10;
      timeWindowSeconds = message.settings.timeWindowSeconds || 30;
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

// Detect scroll events
window.addEventListener('scroll', () => {
  const currentTime = Date.now();
  const currentScrollY = window.scrollY;
  
  // Detect scroll direction
  if (currentScrollY > lastScrollY) {
    scrollDirection = 'down';
  } else if (currentScrollY < lastScrollY) {
    scrollDirection = 'up';
  }
  lastScrollY = currentScrollY;
  
  // Add timestamp for this scroll
  scrollTimestamps.push(currentTime);
  
  // Remove timestamps older than time window
  const cutoffTime = currentTime - (timeWindowSeconds * 1000);
  scrollTimestamps = scrollTimestamps.filter(t => t > cutoffTime);
  
  // Count scrolls in current direction
  scrollCount++;
  
  // Check if we've exceeded threshold
  if (scrollCount >= scrollThreshold) {
    // Reset counter
    scrollCount = 0;
    
    // Notify background script
    sendScrollDetected();
  }
});

// Reset idle timeout on scroll activity
window.addEventListener('scroll', () => {
  setupIdleTimeout();
});

// Debounce scroll reset when user stops scrolling
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    scrollCount = 0;
    scrollTimestamps = [];
  }, 2000); // Reset after 2 seconds of no scrolling
});
