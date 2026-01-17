// Discord Content Script - Monitors Discord for Target product links
console.log('Discord Content Script: Loaded');

let isMonitoring = false;
let monitoredChannels = {}; // Changed to object to store channel configs
let processedMessageIds = new Set();
let observer = null;

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get([
      'discord_isActive',
      'discord_monitoredChannels'
    ]);

    isMonitoring = result.discord_isActive || false;
    monitoredChannels = result.discord_monitoredChannels || {};

    console.log('Discord Content Script: Settings loaded', {
      isMonitoring,
      channelCount: Object.keys(monitoredChannels).length
    });

    if (isMonitoring && Object.keys(monitoredChannels).length > 0) {
      startMonitoring();
    }
  } catch (error) {
    console.error('Discord Content Script: Error loading settings', error);
  }
}

// Get current channel ID from URL
function getCurrentChannelId() {
  const pathParts = window.location.pathname.split('/');
  // URL format: /channels/guildId/channelId
  if (pathParts.length >= 4) {
    return pathParts[3]; // Return channel ID
  }
  return null;
}

// Check if current channel is being monitored
function isCurrentChannelMonitored() {
  const currentChannelId = getCurrentChannelId();
  return currentChannelId && monitoredChannels.hasOwnProperty(currentChannelId);
}

// Get channel configuration
function getChannelConfig() {
  const currentChannelId = getCurrentChannelId();
  return monitoredChannels[currentChannelId] || null;
}

// Extract SKU from Discord embedded message
function extractSkuFromEmbed(messageElement) {
  try {
    // Look for SKU in embed fields
    const embedFields = messageElement.querySelectorAll('[class*="embed"] [class*="field"]');
    for (const field of embedFields) {
      const fieldName = field.querySelector('[class*="fieldName"]')?.textContent?.trim().toLowerCase();
      const fieldValue = field.querySelector('[class*="fieldValue"]')?.textContent?.trim();
      
      if (fieldName && (fieldName.includes('sku') || fieldName.includes('tcin')) && fieldValue) {
        // Extract numeric SKU
        const skuMatch = fieldValue.match(/\d+/);
        if (skuMatch) {
          return skuMatch[0];
        }
      }
    }

    // Also check embed description
    const embedDesc = messageElement.querySelector('[class*="embed"] [class*="description"]');
    if (embedDesc) {
      const text = embedDesc.textContent;
      const skuMatch = text.match(/(?:SKU|TCIN):\s*(\d+)/i);
      if (skuMatch) {
        return skuMatch[1];
      }
    }

    // Check for TCIN in links
    const embedLinks = messageElement.querySelectorAll('[class*="embed"] a[href*="/A-"]');
    for (const link of embedLinks) {
      const match = link.href.match(/\/A-(\d+)/);
      if (match) {
        return match[1];
      }
    }
  } catch (error) {
    console.error('Discord Content Script: Error extracting SKU from embed', error);
  }
  return null;
}

// Extract Target product links from a message element
function extractLinks(messageElement) {
  const links = [];
  
  // Look for howl.link links (priority)
  const howlLinks = messageElement.querySelectorAll('a[href*="howl.link"]');
  for (const link of howlLinks) {
    const url = link.href;
    if (url && url.includes('howl.link')) {
      links.push({ url, type: 'howl' });
    }
  }

  // Look for direct target.com/p/ links (but exclude lightningatc.com and other redirect services)
  const targetLinks = messageElement.querySelectorAll('a[href*="target.com/p/"]');
  for (const link of targetLinks) {
    const url = link.href;
    // Only accept direct target.com links, not ones wrapped in other services
    if (url && url.includes('target.com/p/') && 
        !url.includes('lightningatc.com') && 
        !url.includes('quicktask') &&
        url.startsWith('https://www.target.com') || url.startsWith('http://www.target.com')) {
      links.push({ url, type: 'direct' });
    }
  }

  return links;
}

// Process a new message
async function processMessage(messageElement) {
  // Get message ID to avoid processing duplicates
  const messageId = messageElement.id || messageElement.getAttribute('data-message-id');
  
  if (!messageId || processedMessageIds.has(messageId)) {
    return;
  }

  // Mark as processed
  processedMessageIds.add(messageId);

  // Clean up old processed IDs (keep last 100)
  if (processedMessageIds.size > 100) {
    const idsArray = Array.from(processedMessageIds);
    const toRemove = idsArray.slice(0, processedMessageIds.size - 100);
    toRemove.forEach(id => processedMessageIds.delete(id));
  }

  // Check if we're in a monitored channel
  if (!isCurrentChannelMonitored()) {
    return;
  }

  const channelConfig = getChannelConfig();
  if (!channelConfig) {
    return;
  }

  // Extract SKU from embed
  const embedSku = extractSkuFromEmbed(messageElement);
  console.log('Discord Content Script: Extracted SKU from embed:', embedSku);

  // Check if this SKU should be monitored
  if (channelConfig.skuFilter && channelConfig.skuFilter.length > 0) {
    if (!embedSku || !channelConfig.skuFilter.includes(embedSku)) {
      console.log('Discord Content Script: SKU not in filter list, skipping');
      return;
    }
  }

  // Extract links
  const links = extractLinks(messageElement);

  if (links.length > 0) {
    console.log('Discord Content Script: Found links in message', links);

    // Send links to background script for processing
    for (const linkInfo of links) {
      try {
        await chrome.runtime.sendMessage({
          action: 'discordLinkDetected',
          url: linkInfo.url,
          linkType: linkInfo.type,
          sku: embedSku,
          channelId: getCurrentChannelId(),
          timestamp: Date.now()
        });
        console.log('Discord Content Script: Sent link to background', linkInfo);
      } catch (error) {
        console.error('Discord Content Script: Error sending message to background', error);
      }
    }
  }
}

// Start monitoring for new messages
function startMonitoring() {
  console.log('Discord Content Script: Starting monitoring');

  if (observer) {
    observer.disconnect();
  }

  // Find the messages container
  const messagesContainer = document.querySelector('[class*="messagesWrapper"]') || 
                           document.querySelector('[class*="scroller"]') ||
                           document.querySelector('[data-list-id^="chat-messages"]');

  if (!messagesContainer) {
    console.warn('Discord Content Script: Messages container not found, will retry');
    // Retry after a delay
    setTimeout(startMonitoring, 2000);
    return;
  }

  console.log('Discord Content Script: Found messages container, setting up observer');

  // Create mutation observer to watch for new messages
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if this is a message element
            const isMessage = node.id && node.id.startsWith('chat-messages-') ||
                            node.getAttribute('class')?.includes('message');
            
            if (isMessage) {
              processMessage(node);
            }

            // Also check child messages
            const messages = node.querySelectorAll('[id^="chat-messages-"], [class*="message"]');
            messages.forEach(msg => processMessage(msg));
          }
        }
      }
    }
  });

  // Start observing
  observer.observe(messagesContainer, {
    childList: true,
    subtree: true
  });

  console.log('Discord Content Script: Observer started');

  // Process existing messages once
  const existingMessages = messagesContainer.querySelectorAll('[id^="chat-messages-"], [class*="message"]');
  console.log('Discord Content Script: Processing', existingMessages.length, 'existing messages');
  existingMessages.forEach(msg => processMessage(msg));
}

// Stop monitoring
function stopMonitoring() {
  console.log('Discord Content Script: Stopping monitoring');
  
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  processedMessageIds.clear();
}

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.discord_isActive || changes.discord_monitoredChannels) {
      console.log('Discord Content Script: Settings changed, reloading');
      loadSettings();
    }
  }
});

// Listen for URL changes (channel switches)
let lastUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    console.log('Discord Content Script: URL changed', lastUrl);
    
    if (isMonitoring && Object.keys(monitoredChannels).length > 0) {
      // Restart monitoring for new channel
      stopMonitoring();
      setTimeout(startMonitoring, 1000);
    }
  }
});

urlObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Initialize
loadSettings();

console.log('Discord Content Script: Initialized');
