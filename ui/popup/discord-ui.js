// Discord Monitor UI Handler
console.log('Discord Monitor UI: Loading');

let discordMonitorActive = false;
let discordMonitoredChannels = {}; // Changed to object: { channelId: { skuFilter: [] } }

// DOM Elements
let discordMainView;
let discordSettingsView;
let discordSettingsBtn;
let discordBackBtn;
let discordToggleMain;
let discordToggleSettings;
let discordChannelInput;
let discordSkuInput;
let discordChannelAddBtn;
let discordChannelsContainer;

// Initialize Discord UI
function initDiscordUI() {
  console.log('Discord Monitor UI: Initializing');

  // Get DOM elements
  discordMainView = document.getElementById('discord-monitor-main-view');
  discordSettingsView = document.getElementById('discord-monitor-settings-view');
  discordSettingsBtn = document.getElementById('discord-monitor-settings-btn');
  discordBackBtn = document.getElementById('discord-monitor-back-btn');
  discordToggleMain = document.getElementById('discord-monitor-toggle');
  discordToggleSettings = document.getElementById('discord-monitor-active-toggle-settings');
  discordChannelInput = document.getElementById('discord-channel-id-input');
  discordSkuInput = document.getElementById('discord-sku-filter-input');
  discordChannelAddBtn = document.getElementById('discord-channel-add-btn');
  discordChannelsContainer = document.getElementById('discord-channels-container');

  if (!discordMainView || !discordSettingsView) {
    console.error('Discord Monitor UI: Required DOM elements not found');
    return;
  }

  // Set up event listeners
  setupDiscordEventListeners();

  // Load settings
  loadDiscordSettings();

  console.log('Discord Monitor UI: Initialized');
}

function setupDiscordEventListeners() {
  console.log('Discord Monitor UI: Setting up event listeners');

  // Settings button - open settings view
  if (discordSettingsBtn) {
    discordSettingsBtn.addEventListener('click', () => {
      console.log('Discord Monitor: Opening settings view');
      showDiscordSettingsView();
    });
  }

  // Back button - return to main view
  if (discordBackBtn) {
    discordBackBtn.addEventListener('click', () => {
      console.log('Discord Monitor: Returning to main view');
      hideDiscordSettingsView();
    });
  }

  // Toggle handlers
  const toggleHandler = (e) => {
    const isActive = e.target.checked;
    console.log('Discord Monitor toggle changed to:', isActive);
    discordMonitorActive = isActive;

    // Sync both toggles
    if (discordToggleMain) discordToggleMain.checked = isActive;
    if (discordToggleSettings) discordToggleSettings.checked = isActive;

    // Save to storage
    saveDiscordSettings();
  };

  if (discordToggleMain) {
    discordToggleMain.addEventListener('change', toggleHandler);
  }

  if (discordToggleSettings) {
    discordToggleSettings.addEventListener('change', toggleHandler);
  }

  // Add channel button
  if (discordChannelAddBtn) {
    discordChannelAddBtn.addEventListener('click', addDiscordChannel);
  }

  // Add channel on Enter key
  if (discordChannelInput) {
    discordChannelInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addDiscordChannel();
      }
    });
  }
}

function showDiscordSettingsView() {
  // Hide main sections
  const sitesConfig = document.querySelector('.sites-config');
  const globalSettings = document.getElementById('global-settings');
  const priceCheckMain = document.getElementById('price-check-main-view');
  const proxySection = document.getElementById('proxy-settings-section');
  const statusElement = document.querySelector('.status');

  if (sitesConfig) sitesConfig.style.display = 'none';
  if (globalSettings) globalSettings.style.display = 'none';
  if (priceCheckMain) priceCheckMain.style.display = 'none';
  if (proxySection) proxySection.style.display = 'none';
  if (statusElement) statusElement.style.display = 'none';
  if (discordMainView) discordMainView.style.display = 'none';

  // Show Discord settings view
  if (discordSettingsView) discordSettingsView.style.display = 'block';
}

function hideDiscordSettingsView() {
  // Show main sections
  const sitesConfig = document.querySelector('.sites-config');
  const globalSettings = document.getElementById('global-settings');
  const priceCheckMain = document.getElementById('price-check-main-view');
  const proxySection = document.getElementById('proxy-settings-section');
  const statusElement = document.querySelector('.status');

  if (sitesConfig) sitesConfig.style.display = 'flex';
  if (globalSettings) globalSettings.style.display = 'block';
  if (priceCheckMain) priceCheckMain.style.display = 'block';
  if (proxySection) proxySection.style.display = 'block';
  if (statusElement) statusElement.style.display = 'flex';
  if (discordMainView) discordMainView.style.display = 'block';

  // Hide Discord settings view
  if (discordSettingsView) discordSettingsView.style.display = 'none';
}

async function loadDiscordSettings() {
  console.log('Discord Monitor UI: Loading settings');

  try {
    const result = await chrome.storage.local.get([
      'discord_isActive',
      'discord_monitoredChannels'
    ]);

    discordMonitorActive = result.discord_isActive || false;
    discordMonitoredChannels = result.discord_monitoredChannels || {};

    console.log('Discord Monitor UI: Settings loaded', {
      isActive: discordMonitorActive,
      channelCount: Object.keys(discordMonitoredChannels).length
    });

    // Update UI
    if (discordToggleMain) discordToggleMain.checked = discordMonitorActive;
    if (discordToggleSettings) discordToggleSettings.checked = discordMonitorActive;

    // Render channels
    renderDiscordChannels();

  } catch (error) {
    console.error('Discord Monitor UI: Error loading settings', error);
  }
}

async function saveDiscordSettings() {
  console.log('Discord Monitor UI: Saving settings');

  try {
    await chrome.storage.local.set({
      discord_isActive: discordMonitorActive,
      discord_monitoredChannels: discordMonitoredChannels
    });

    console.log('Discord Monitor UI: Settings saved');
  } catch (error) {
    console.error('Discord Monitor UI: Error saving settings', error);
  }
}

function addDiscordChannel() {
  const channelId = discordChannelInput.value.trim();
  const skuFilter = discordSkuInput ? discordSkuInput.value.trim() : '';

  if (!channelId) {
    alert('Please enter a Discord channel ID.');
    return;
  }

  // Validate channel ID (should be numeric)
  if (!/^\d+$/.test(channelId)) {
    alert('Channel ID should be numeric. Please enter a valid Discord channel ID.');
    return;
  }

  // Check if already added
  if (discordMonitoredChannels.hasOwnProperty(channelId)) {
    alert('This channel is already being monitored.');
    return;
  }

  // Parse SKU filter
  let skuList = [];
  if (skuFilter) {
    skuList = skuFilter.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  // Add to list
  discordMonitoredChannels[channelId] = {
    skuFilter: skuList
  };

  // Save and update UI
  saveDiscordSettings();
  renderDiscordChannels();

  // Clear inputs
  discordChannelInput.value = '';
  if (discordSkuInput) discordSkuInput.value = '';

  console.log('Discord Monitor UI: Added channel', channelId, 'with SKU filter', skuList);
}

function removeDiscordChannel(channelId) {
  if (!confirm(`Remove channel ${channelId} from monitoring?`)) {
    return;
  }

  // Remove from list
  delete discordMonitoredChannels[channelId];

  // Save and update UI
  saveDiscordSettings();
  renderDiscordChannels();

  console.log('Discord Monitor UI: Removed channel', channelId);
}

function editChannelSkus(channelId) {
  const currentSkus = discordMonitoredChannels[channelId]?.skuFilter || [];
  const currentSkuString = currentSkus.join(', ');
  
  const newSkuString = prompt(`Edit SKU filter for channel ${channelId}:\n(comma-separated, leave empty for all SKUs)`, currentSkuString);
  
  if (newSkuString === null) {
    return; // User cancelled
  }

  // Parse new SKU list
  const newSkuList = newSkuString.split(',').map(s => s.trim()).filter(s => s.length > 0);

  // Update
  discordMonitoredChannels[channelId].skuFilter = newSkuList;

  // Save and update UI
  saveDiscordSettings();
  renderDiscordChannels();

  console.log('Discord Monitor UI: Updated SKU filter for channel', channelId, newSkuList);
}

function renderDiscordChannels() {
  if (!discordChannelsContainer) return;

  // Clear container
  discordChannelsContainer.innerHTML = '';

  if (Object.keys(discordMonitoredChannels).length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No channels added yet.';
    emptyMsg.className = 'empty-message';
    discordChannelsContainer.appendChild(emptyMsg);
    return;
  }

  // Render each channel
  for (const [channelId, config] of Object.entries(discordMonitoredChannels)) {
    const channelDiv = document.createElement('div');
    channelDiv.className = 'price-check-item'; // Reuse existing styles

    const channelDetails = document.createElement('div');
    channelDetails.className = 'price-check-item-details';

    const channelIdSpan = document.createElement('div');
    channelIdSpan.className = 'price-check-item-sku';
    channelIdSpan.textContent = `Channel ID: ${channelId}`;

    const skuFilterSpan = document.createElement('div');
    skuFilterSpan.className = 'price-check-item-price';
    const skuText = config.skuFilter && config.skuFilter.length > 0 
      ? `SKUs: ${config.skuFilter.join(', ')}` 
      : 'All SKUs';
    skuFilterSpan.textContent = skuText;

    channelDetails.appendChild(channelIdSpan);
    channelDetails.appendChild(skuFilterSpan);

    const actions = document.createElement('div');
    actions.className = 'price-check-item-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'price-check-item-edit';
    editBtn.textContent = '✎';
    editBtn.title = 'Edit SKU filter';
    editBtn.onclick = () => editChannelSkus(channelId);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'price-check-item-delete';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Remove channel';
    deleteBtn.onclick = () => removeDiscordChannel(channelId);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    channelDiv.appendChild(channelDetails);
    channelDiv.appendChild(actions);

    discordChannelsContainer.appendChild(channelDiv);
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.discord_isActive !== undefined) {
      discordMonitorActive = changes.discord_isActive.newValue;
      if (discordToggleMain) discordToggleMain.checked = discordMonitorActive;
      if (discordToggleSettings) discordToggleSettings.checked = discordMonitorActive;
    }

    if (changes.discord_monitoredChannels !== undefined) {
      discordMonitoredChannels = changes.discord_monitoredChannels.newValue || {};
      renderDiscordChannels();
    }
  }
});

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDiscordUI);
} else {
  initDiscordUI();
}

console.log('Discord Monitor UI: Script loaded');
