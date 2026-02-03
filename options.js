// Options/Settings Script for Stop Scrolling Mindlessly

let settings = {
  scrollThreshold: 20,
  timeWindowSeconds: 45,
  isPremium: false,
  ignoredDomains: [],
  hasCompletedSetup: false
};

// DOM Elements
const scrollThresholdSlider = document.getElementById('scrollThreshold');
const scrollThresholdValue = document.getElementById('scrollThresholdValue');
const timeWindowSlider = document.getElementById('timeWindow');
const timeWindowValue = document.getElementById('timeWindowValue');
const sensitivityNote = document.getElementById('sensitivityNote');
const timeNote = document.getElementById('timeNote');
const domainInput = document.getElementById('domainInput');
const addDomainBtn = document.getElementById('addDomainBtn');
const domainList = document.getElementById('domainList');
const premiumBadge = document.getElementById('premiumBadge');
const resetSettings = document.getElementById('resetSettings');
const setupSection = document.getElementById('setupSection');
const sensitivitySection = document.getElementById('sensitivitySection');
const domainSection = document.getElementById('domainSection');
const saveSetupBtn = document.getElementById('saveSetupBtn');
let selectedSensitivity = 'medium';

// Initialize
/* istanbul ignore next */
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  checkSetupRequired();
  updateUI();
  renderDomainList();
  setupEventListeners();
});

// Check if first-time setup is needed
/* istanbul ignore next */
function checkSetupRequired() {
  if (!settings.hasCompletedSetup) {
    setupSection.style.display = 'block';
    sensitivitySection.style.display = 'none';
    domainSection.style.display = 'block'; // Show domain section even before setup
  } else {
    setupSection.style.display = 'none';
    sensitivitySection.style.display = 'block';
    domainSection.style.display = 'block';
  }
}

// Setup event listeners
/* istanbul ignore next */
function setupEventListeners() {
  scrollThresholdSlider.addEventListener('input', handleScrollThresholdChange);
  timeWindowSlider.addEventListener('input', handleTimeWindowChange);
  addDomainBtn.addEventListener('click', handleAddDomain);
  domainInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddDomain();
  });
  resetSettings.addEventListener('click', handleResetSettings);

  // Setup wizard listeners
  document.querySelectorAll('.setup-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.setup-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      selectedSensitivity = option.dataset.sensitivity;
    });
  });

  if (saveSetupBtn) {
    saveSetupBtn.addEventListener('click', saveSetup);
  }
}

// Save setup and close wizard
/* istanbul ignore next */
async function saveSetup() {
  // Apply selected sensitivity
  switch (selectedSensitivity) {
    case 'low':
      settings.scrollThreshold = 30;
      settings.timeWindowSeconds = 60;
      break;
    case 'medium':
      settings.scrollThreshold = 20;
      settings.timeWindowSeconds = 45;
      break;
    case 'high':
      settings.scrollThreshold = 10;
      settings.timeWindowSeconds = 20;
      break;
  }
  
  settings.hasCompletedSetup = true;
  
  await chrome.storage.local.set({
    scrollThreshold: settings.scrollThreshold,
    timeWindowSeconds: settings.timeWindowSeconds,
    hasCompletedSetup: true
  });
  
  // Notify content scripts
  chrome.runtime.sendMessage({
    type: "SETTINGS_UPDATED",
    settings: {
      scrollThreshold: settings.scrollThreshold,
      timeWindowSeconds: settings.timeWindowSeconds
    }
  });
  
  // Hide setup, show main settings
  setupSection.style.display = 'none';
  sensitivitySection.style.display = 'block';
  domainSection.style.display = 'block';
  
  updateUI();
}

// Load settings from Chrome storage
/* istanbul ignore next */
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['scrollThreshold', 'timeWindowSeconds', 'isPremium', 'ignoredDomains', 'hasCompletedSetup'], (result) => {
      settings.scrollThreshold = result.scrollThreshold || 20;
      settings.timeWindowSeconds = result.timeWindowSeconds || 45;
      settings.isPremium = result.isPremium || false;
      settings.ignoredDomains = result.ignoredDomains || [];
      settings.hasCompletedSetup = result.hasCompletedSetup || false;
      resolve();
    });
  });
}

// Save settings to Chrome storage
/* istanbul ignore next */
async function saveSettings() {
  await chrome.storage.local.set({
    scrollThreshold: settings.scrollThreshold,
    timeWindowSeconds: settings.timeWindowSeconds,
    ignoredDomains: settings.ignoredDomains
  });
  
  // Notify content scripts of settings update
  chrome.runtime.sendMessage({
    type: "SETTINGS_UPDATED",
    settings: {
      scrollThreshold: settings.scrollThreshold,
      timeWindowSeconds: settings.timeWindowSeconds
    }
  });
}

// Update UI with current settings
/* istanbul ignore next */
function updateUI() {
  // Update sliders
  scrollThresholdSlider.value = settings.scrollThreshold;
  scrollThresholdValue.textContent = settings.scrollThreshold;
  sensitivityNote.textContent = settings.scrollThreshold;
  
  timeWindowSlider.value = settings.timeWindowSeconds;
  timeWindowValue.textContent = settings.timeWindowSeconds;
  timeNote.textContent = settings.timeWindowSeconds;
  
  // Update premium status
  updatePremiumUI();
}

// Update premium UI
/* istanbul ignore next */
function updatePremiumUI() {
  premiumBadge.textContent = 'FREE';
  premiumBadge.className = 'badge free';
}

// Handle scroll threshold change
/* istanbul ignore next */
function handleScrollThresholdChange() {
  settings.scrollThreshold = parseInt(scrollThresholdSlider.value);
  scrollThresholdValue.textContent = settings.scrollThreshold;
  sensitivityNote.textContent = settings.scrollThreshold;
  saveSettings();
}

// Handle time window change
/* istanbul ignore next */
function handleTimeWindowChange() {
  settings.timeWindowSeconds = parseInt(timeWindowSlider.value);
  timeWindowValue.textContent = settings.timeWindowSeconds;
  timeNote.textContent = settings.timeWindowSeconds;
  saveSettings();
}

// Handle add domain
/* istanbul ignore next */
function handleAddDomain() {
  let domain = domainInput.value.trim().toLowerCase();
  
  if (!domain) return;
  
  // Clean up domain input
  domain = domain.replace(/^https?:\/\//, ''); // Remove protocol
  domain = domain.replace(/^www\./, ''); // Remove www
  domain = domain.split('/')[0]; // Remove path
  
  // Validate domain format
  if (!isValidDomain(domain)) {
    /* istanbul ignore next */
    alert('Please enter a valid domain (e.g., youtube.com)');
    return;
  }
  
  // Check if already exists
  if (settings.ignoredDomains.includes(domain)) {
    /* istanbul ignore next */
    alert('This domain is already in your ignore list');
    return;
  }
  
  // Add domain
  settings.ignoredDomains.push(domain);
  saveSettings();
  renderDomainList();
  domainInput.value = '';
}

// Validate domain format
function isValidDomain(domain) {
  // More comprehensive domain validation
  // Allows: letters, numbers, hyphens, multiple TLDs, reasonable length
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain) && domain.length <= 253; // Max domain length per RFC
}

// Handle remove domain
/* istanbul ignore next */
function handleRemoveDomain(domain) {
  settings.ignoredDomains = settings.ignoredDomains.filter(d => d !== domain);
  saveSettings();
  renderDomainList();
}

// Render domain list
/* istanbul ignore next */
function renderDomainList() {
  domainList.innerHTML = '';
  
  if (settings.ignoredDomains.length === 0) {
    domainList.innerHTML = '<div class="domain-empty">No websites ignored yet. Add domains above where you want to disable the extension.</div>';
    return;
  }
  
  settings.ignoredDomains.forEach(domain => {
    const item = document.createElement('div');
    item.className = 'domain-item';
    item.innerHTML = `
      <span class="domain-name">${escapeHtml(domain)}</span>
      <button class="domain-remove" data-domain="${escapeHtml(domain)}">×</button>
    `;
    domainList.appendChild(item);
  });
  
  // Add event listeners
  /* istanbul ignore next */
  document.querySelectorAll('.domain-remove').forEach(btn => {
    btn.addEventListener('click', () => handleRemoveDomain(btn.dataset.domain));
  });
}

// Handle upgrade (placeholder)
/* istanbul ignore next */
function handleUpgrade() {
  alert('Premium feature! This would open a payment flow in a production extension.\n\nFor now, you can simulate upgrading by running:\nchrome.storage.local.set({ isPremium: true })');
}

// Handle manage subscription (placeholder)
/* istanbul ignore next */
function handleManageSubscription() {
  alert('This would open a subscription management page in a production extension.');
}

// Handle reset settings
/* istanbul ignore next */
function handleResetSettings(e) {
  e.preventDefault();
  
  if (confirm('Are you sure you want to reset all settings to defaults? This will also show the setup wizard again.')) {
    settings = {
      scrollThreshold: 20,
      timeWindowSeconds: 45,
      isPremium: settings.isPremium,
      ignoredDomains: [],
      hasCompletedSetup: false
    };
    saveSettings();
    updateUI();
    renderDomainList();
    checkSetupRequired();
  }
}

// Utility function
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidDomain,
    escapeHtml,
    handleAddDomain,
    handleRemoveDomain,
    renderDomainList,
    loadSettings,
    saveSettings
  };
}
