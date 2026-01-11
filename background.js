// Background Service Worker for StopScrollingMindlessly

// Track when popup was last shown to prevent rapid re-showing
let lastPopupTime = 0;
const POPUP_COOLDOWN_MS = 5000; // 5 seconds cooldown between popups
let popupWindowId = null;  // Track open popup window

// Default settings - less sensitive defaults
const defaultSettings = {
  scrollThreshold: 20,  // Increased from 10 - less sensitive
  timeWindowSeconds: 45,  // Increased from 30 - more forgiving
  isPremium: false,
  ignoredDomains: [],
  hasCompletedSetup: false,
  todos: [
    { id: 1, text: "Complete this task", priority: "medium", completed: false },
    { id: 2, text: "Drink water", priority: "low", completed: false }
  ]
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  const settings = await chrome.storage.local.get(defaultSettings);
  if (!settings.scrollThreshold) {
    await chrome.storage.local.set(defaultSettings);
  }
});

// Handle extension icon click - open setup if not completed
chrome.action.onClicked.addListener(async (tab) => {
  const settings = await chrome.storage.local.get('hasCompletedSetup');
  if (!settings.hasCompletedSetup) {
    chrome.runtime.openOptionsPage();
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCROLL_DETECTED") {
    handleScrollDetected(sender.tab?.url, sender.tab?.id);
  } else if (message.type === "GET_SETTINGS") {
    getSettings().then(sendResponse);
  } else if (message.type === "UPDATE_TODOS") {
    updateTodos(message.todos).then(sendResponse);
  } else if (message.type === "GET_TIPS") {
    sendResponse({ tips: getProductivityTips() });
  } else if (message.type === "CHECK_PREMIUM") {
    checkPremiumStatus().then(sendResponse);
  } else if (message.type === "RESET_SCROLL_COUNT") {
    // Reset scroll count in the specific tab
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, { type: "RESET_SCROLL_COUNT" });
    }
  }
  return true;
});

async function handleScrollDetected(url, tabId) {
  if (!url) return;
  
  const domain = new URL(url).hostname.replace('www.', '');
  const settings = await getSettings();
  
  // Check if domain is ignored
  if (settings.ignoredDomains.includes(domain)) {
    return;
  }
  
  // Show the intervention popup
  const popupShown = await showInterventionPopup();
  
  // Reset scroll count in the tab after showing popup
  if (popupShown && tabId) {
    try {
      chrome.tabs.sendMessage(tabId, { type: "RESET_SCROLL_COUNT" });
    } catch (e) {
      // Tab might be closed, ignore
    }
  }
}

async function showInterventionPopup() {
  const currentTime = Date.now();
  
  // Check cooldown to prevent rapid re-showing
  if (currentTime - lastPopupTime < POPUP_COOLDOWN_MS) {
    return false;
  }
  
  // Check if popup is already open
  if (popupWindowId) {
    try {
      // Check if the window still exists
      await chrome.windows.get(popupWindowId);
      // Focus the existing popup instead of creating a new one
      chrome.windows.update(popupWindowId, { focused: true });
      lastPopupTime = currentTime;
      return false; // Popup was already open, not newly shown
    } catch (e) {
      // Window no longer exists, reset the ID
      popupWindowId = null;
    }
  }
  
  const settings = await getSettings();
  
  // Get a random tip
  const tips = getProductivityTips();
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  // Create intervention data
  const interventionData = {
    todos: settings.todos.filter(t => !t.completed).slice(0, 5),
    tip: randomTip,
    isPremium: settings.isPremium,
    currentDomain: domain,
    adPlaceholder: !settings.isPremium ? getAdPlaceholder() : null
  };
  
  // Open the intervention popup
  const window = await chrome.windows.create({
    url: `intervention.html?data=${encodeURIComponent(JSON.stringify(interventionData))}`,
    type: "popup",
    width: 400,
    height: 500,
    focused: true
  });
  
  // Store the window ID
  popupWindowId = window.id;
  lastPopupTime = currentTime;
  
  // Listen for popup removal
  chrome.windows.onRemoved.addListener(function removedListener(windowId) {
    if (windowId === popupWindowId) {
      popupWindowId = null;
      chrome.windows.onRemoved.removeListener(removedListener);
    }
  });
  
  return true; // Popup was newly shown
}

function getAdPlaceholder() {
  return {
    text: "Try all the premium features free for a limited time. No card required.",
    cta: "Get Free Trial"
  };
}

async function getSettings() {
  const result = await chrome.storage.local.get(defaultSettings);
  return result;
}

async function updateTodos(todos) {
  await chrome.storage.local.set({ todos });
  return { success: true };
}

async function checkPremiumStatus() {
  const settings = await getSettings();
  return { isPremium: settings.isPremium };
}

function getProductivityTips() {
  return [
    "The two-minute rule: If a task takes less than 2 minutes, do it now.",
    "Batch similar tasks together to reduce context switching.",
    "Take a 5-minute break every 25 minutes of focused work (Pomodoro technique).",
    "Start your day by eating the frog - do your hardest task first.",
    "Sleep 7-9 hours to maintain peak cognitive performance.",
    "Exercise regularly - even 20 minutes can boost brain function.",
    "Drink water throughout the day - dehydration reduces focus.",
    "Use the 1-3-5 rule: 1 big task, 3 medium tasks, 5 small tasks daily.",
    "Eliminate distractions: Put your phone in another room while working.",
    "Review your goals weekly to stay aligned with what matters.",
    "Deep work requires uninterrupted blocks of 90 minutes.",
    "Say no to things that don't align with your priorities.",
    "Use waiting time wisely - listen to podcasts or read articles.",
    "Delegate tasks that others can do well.",
    "Schedule your most creative work during your peak energy hours.",
    "Write down everything - free your mind for important thinking.",
    "Break large projects into small, actionable steps.",
    "Review tomorrow's tasks tonight so you start with clarity.",
    "Limit social media to specific times - don't scroll mindlessly.",
    "Your future self will thank you for what you do today."
  ];
}
