// Options/Settings Script for StopScrollingMindlessly

let settings = {
  scrollThreshold: 10,
  timeWindowSeconds: 30,
  isPremium: false,
  ignoredDomains: []
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
const premiumSection = document.getElementById('premiumSection');
const premiumActiveSection = document.getElementById('premiumActiveSection');
const upgradeBtn = document.getElementById('upgradeBtn');
const manageBtn = document.getElementById('manageBtn');
const resetSettings = document.getElementById('resetSettings');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  updateUI();
  renderDomainList();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  scrollThresholdSlider.addEventListener('input', handleScrollThresholdChange);
  timeWindowSlider.addEventListener('input', handleTimeWindowChange);
  addDomainBtn.addEventListener('click', handleAddDomain);
  domainInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddDomain();
  });
  upgradeBtn.addEventListener('click', handleUpgrade);
  manageBtn.addEventListener('click', handleManageSubscription);
  resetSettings.addEventListener('click', handleResetSettings);
}

// Load settings from Chrome storage
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['scrollThreshold', 'timeWindowSeconds', 'isPremium', 'ignoredDomains'], (result) => {
      settings.scrollThreshold = result.scrollThreshold || 10;
      settings.timeWindowSeconds = result.timeWindowSeconds || 30;
      settings.isPremium = result.isPremium || false;
      settings.ignoredDomains = result.ignoredDomains || [];
      resolve();
    });
  });
}

// Save settings to Chrome storage
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
function updatePremiumUI() {
  if (settings.isPremium) {
    premiumBadge.textContent = 'PREMIUM';
    premiumBadge.className = 'badge premium';
    premiumSection.style.display = 'none';
    premiumActiveSection.style.display = 'block';
  } else {
    premiumBadge.textContent = 'FREE';
    premiumBadge.className = 'badge free';
    premiumSection.style.display = 'block';
    premiumActiveSection.style.display = 'none';
  }
}

// Handle scroll threshold change
function handleScrollThresholdChange() {
  settings.scrollThreshold = parseInt(scrollThresholdSlider.value);
  scrollThresholdValue.textContent = settings.scrollThreshold;
  sensitivityNote.textContent = settings.scrollThreshold;
  saveSettings();
}

// Handle time window change
function handleTimeWindowChange() {
  settings.timeWindowSeconds = parseInt(timeWindowSlider.value);
  timeWindowValue.textContent = settings.timeWindowSeconds;
  timeNote.textContent = settings.timeWindowSeconds;
  saveSettings();
}

// Handle add domain
function handleAddDomain() {
  let domain = domainInput.value.trim().toLowerCase();
  
  if (!domain) return;
  
  // Clean up domain input
  domain = domain.replace(/^https?:\/\//, ''); // Remove protocol
  domain = domain.replace(/^www\./, ''); // Remove www
  domain = domain.split('/')[0]; // Remove path
  
  // Validate domain format
  if (!isValidDomain(domain)) {
    alert('Please enter a valid domain (e.g., youtube.com)');
    return;
  }
  
  // Check if already exists
  if (settings.ignoredDomains.includes(domain)) {
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
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
  return domainRegex.test(domain);
}

// Handle remove domain
function handleRemoveDomain(domain) {
  settings.ignoredDomains = settings.ignoredDomains.filter(d => d !== domain);
  saveSettings();
  renderDomainList();
}

// Render domain list
function renderDomainList() {
  domainList.innerHTML = '';
  
  if (settings.ignoredDomains.length === 0) {
    domainList.innerHTML = '<div class="domain-empty">No domains ignored. Add domains where you want to disable the extension.</div>';
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
  document.querySelectorAll('.domain-remove').forEach(btn => {
    btn.addEventListener('click', () => handleRemoveDomain(btn.dataset.domain));
  });
}

// Handle upgrade (placeholder)
function handleUpgrade() {
  alert('Premium feature! This would open a payment flow in a production extension.\n\nFor now, you can simulate upgrading by running:\nchrome.storage.local.set({ isPremium: true })');
}

// Handle manage subscription (placeholder)
function handleManageSubscription() {
  alert('This would open a subscription management page in a production extension.');
}

// Handle reset settings
function handleResetSettings(e) {
  e.preventDefault();
  
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    settings = {
      scrollThreshold: 10,
      timeWindowSeconds: 30,
      isPremium: settings.isPremium, // Keep premium status
      ignoredDomains: []
    };
    saveSettings();
    updateUI();
    renderDomainList();
  }
}

// Utility function
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
