// Background Service Worker for StopScrollingMindlessly

// Default settings
const defaultSettings = {
  scrollThreshold: 10,
  timeWindowSeconds: 30,
  isPremium: false,
  ignoredDomains: [],
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

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCROLL_DETECTED") {
    handleScrollDetected(sender.tab?.url);
  } else if (message.type === "GET_SETTINGS") {
    getSettings().then(sendResponse);
  } else if (message.type === "UPDATE_TODOS") {
    updateTodos(message.todos).then(sendResponse);
  } else if (message.type === "GET_TIPS") {
    sendResponse({ tips: getProductivityTips() });
  } else if (message.type === "CHECK_PREMIUM") {
    checkPremiumStatus().then(sendResponse);
  }
  return true;
});

async function handleScrollDetected(url) {
  if (!url) return;
  
  const domain = new URL(url).hostname.replace('www.', '');
  const settings = await getSettings();
  
  // Check if domain is ignored
  if (settings.ignoredDomains.includes(domain)) {
    return;
  }
  
  // Show the intervention popup
  showInterventionPopup();
}

async function showInterventionPopup() {
  const settings = await getSettings();
  
  // Get a random tip
  const tips = getProductivityTips();
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  // Create intervention data
  const interventionData = {
    todos: settings.todos.filter(t => !t.completed).slice(0, 5),
    tip: randomTip,
    isPremium: settings.isPremium,
    adPlaceholder: !settings.isPremium ? getAdPlaceholder() : null
  };
  
  // Open the intervention popup
  chrome.windows.create({
    url: `intervention.html?data=${encodeURIComponent(JSON.stringify(interventionData))}`,
    type: "popup",
    width: 400,
    height: 500,
    focused: true
  });
}

function getAdPlaceholder() {
  return {
    text: "Sponsored - Try Premium for Ad-Free Experience",
    cta: "Upgrade Now"
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
