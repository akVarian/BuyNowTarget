// Discord Background Handler - Handles Discord link detection and tab opening
console.log('Discord Background Handler: Loaded');

// Track cooldowns and opened tabs
const lastOpenedTime = { global: 0 };
const skuCooldowns = new Map();
const openedTabs = new Map(); // Track tabs opened from Discord

// Get settings
async function getDiscordSettings() {
  try {
    const result = await chrome.storage.local.get(['globalSettings']);
    const settings = result.globalSettings || {};
    
    return {
      globalCooldown: (settings.globalCooldown || 5) * 1000,
      skuCooldown: (settings.skuCooldown || 10) * 1000,
      autoCloseFailedTabs: settings.autoCloseFailedTabs !== false // default true
    };
  } catch (error) {
    console.error('Discord Background Handler: Error getting settings', error);
    return {
      globalCooldown: 5000,
      skuCooldown: 10000,
      autoCloseFailedTabs: true
    };
  }
}

// Extract SKU/TCIN from Target URL
function extractSkuFromUrl(url) {
  const match = url.match(/\/A-(\d+)/);
  return match ? match[1] : null;
}

// Resolve howl.link to actual Target URL
async function resolveHowlLink(howlUrl) {
  try {
    console.log('Discord Background Handler: Resolving howl.link', howlUrl);
    
    // Create a temporary tab to resolve the redirect
    const tab = await chrome.tabs.create({
      url: howlUrl,
      active: false
    });

    // Wait for the tab to load and get the final URL
    return new Promise((resolve) => {
      const listener = (tabId, changeInfo, updatedTab) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          const finalUrl = updatedTab.url;
          console.log('Discord Background Handler: Resolved to', finalUrl);
          
          // Close the temporary tab
          chrome.tabs.remove(tab.id);
          
          if (finalUrl.includes('target.com')) {
            resolve(finalUrl);
          } else {
            resolve(null);
          }
        }
      };

      chrome.tabs.onUpdated.addListener(listener);

      // Timeout after 10 seconds
      setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        chrome.tabs.remove(tab.id);
        resolve(null);
      }, 10000);
    });
  } catch (error) {
    console.error('Discord Background Handler: Error resolving howl.link', error);
    return null;
  }
}

// Clean up old cooldowns
function cleanupCooldowns(skuCooldownDuration) {
  const now = Date.now();
  for (const [sku, timestamp] of skuCooldowns.entries()) {
    if (now - timestamp > skuCooldownDuration * 2) {
      skuCooldowns.delete(sku);
    }
  }
}

// Handle Discord link detection
async function handleDiscordLink(url, linkType, sku, channelId) {
  console.log('Discord Background Handler: Processing link', { url, linkType, sku });

  const settings = await getDiscordSettings();
  const now = Date.now();

  // Resolve howl.link if needed
  let targetUrl = url;
  if (linkType === 'howl') {
    targetUrl = await resolveHowlLink(url);
    if (!targetUrl) {
      console.error('Discord Background Handler: Failed to resolve howl.link');
      return false;
    }
  }

  // Extract SKU from URL if not provided
  if (!sku) {
    sku = extractSkuFromUrl(targetUrl);
  }

  // Check global cooldown
  if (now - lastOpenedTime.global < settings.globalCooldown) {
    console.log('Discord Background Handler: Global cooldown active, skipping');
    return false;
  }

  // Check SKU-specific cooldown
  if (sku) {
    const lastOpenedForSku = skuCooldowns.get(sku);
    if (lastOpenedForSku && now - lastOpenedForSku < settings.skuCooldown) {
      console.log(`Discord Background Handler: SKU ${sku} on cooldown, skipping`);
      return false;
    }

    // Update cooldowns
    skuCooldowns.set(sku, now);
    lastOpenedTime.global = now;

    // Clean up old cooldowns
    cleanupCooldowns(settings.skuCooldown);
  } else {
    // No SKU found, just use global cooldown
    lastOpenedTime.global = now;
  }

  // Open the link in a new tab
  try {
    const tab = await chrome.tabs.create({
      url: targetUrl,
      active: true
    });

    console.log('Discord Background Handler: Opened tab', tab.id, targetUrl);

    // Track this tab for auto-close monitoring
    openedTabs.set(tab.id, {
      url: targetUrl,
      sku: sku,
      openedAt: now,
      autoClose: settings.autoCloseFailedTabs
    });

    // Set up monitoring for this tab
    if (settings.autoCloseFailedTabs) {
      monitorTabForFailure(tab.id);
    }

    // Show notification
    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Discord Monitor',
        message: `Opened product from Discord (SKU: ${sku || 'unknown'})`
      });
    } catch (notifError) {
      console.warn('Discord Background Handler: Could not show notification', notifError);
    }

    return true;
  } catch (error) {
    console.error('Discord Background Handler: Error opening tab', error);
    return false;
  }
}

// Monitor tab for checkout failure and auto-close if needed
function monitorTabForFailure(tabId) {
  console.log('Discord Background Handler: Monitoring tab', tabId, 'for failures');

  // Listen for tab updates
  const listener = (updatedTabId, changeInfo, tab) => {
    if (updatedTabId !== tabId) return;

    const tabInfo = openedTabs.get(tabId);
    if (!tabInfo) return;

    // Check if we're on an error page or OOS page
    if (changeInfo.url || changeInfo.status === 'complete') {
      const url = tab.url || '';
      
      // Check for common failure indicators
      const isError = url.includes('/error') || 
                     url.includes('/404') || 
                     url.includes('/cart') && changeInfo.title?.toLowerCase().includes('out of stock');

      if (isError) {
        console.log('Discord Background Handler: Detected failure on tab', tabId, 'closing...');
        chrome.tabs.remove(tabId);
        openedTabs.delete(tabId);
        chrome.tabs.onUpdated.removeListener(listener);
      }
    }

    // Auto-cleanup after 60 seconds
    if (Date.now() - tabInfo.openedAt > 60000) {
      console.log('Discord Background Handler: Removing listener for tab', tabId, 'after timeout');
      chrome.tabs.onUpdated.removeListener(listener);
      openedTabs.delete(tabId);
    }
  };

  chrome.tabs.onUpdated.addListener(listener);

  // Also listen for tab removal
  const removeListener = (removedTabId) => {
    if (removedTabId === tabId) {
      chrome.tabs.onUpdated.removeListener(listener);
      chrome.tabs.onRemoved.removeListener(removeListener);
      openedTabs.delete(tabId);
    }
  };

  chrome.tabs.onRemoved.addListener(removeListener);
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'discordLinkDetected') {
    console.log('Discord Background Handler: Received Discord link', message);
    
    handleDiscordLink(message.url, message.linkType, message.sku, message.channelId)
      .then(result => {
        sendResponse({ success: result });
      })
      .catch(error => {
        console.error('Discord Background Handler: Error handling link', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep message channel open for async response
  }
  
  // Listen for button availability check from content script
  if (message.action === 'checkButtonAvailability') {
    console.log('Discord Background Handler: Received button check', message);
    
    // If no buttons are available and auto-close is enabled, close the tab
    if (!message.hasButtons && sender.tab) {
      getDiscordSettings().then(settings => {
        if (settings.autoCloseFailedTabs) {
          console.log('Discord Background Handler: No buttons available, closing tab', sender.tab.id);
          chrome.tabs.remove(sender.tab.id);
        }
      });
    }
    
    sendResponse({ received: true });
    return true;
  }
});

console.log('Discord Background Handler: Initialized');
