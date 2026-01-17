// Discord Monitor - Listens to Discord notifications and auto-opens product links
// This feature allows monitoring specific Discord channels for product links

console.log('Discord Monitor: Script loaded');

class DiscordMonitor {
  constructor() {
    this.isActive = false;
    this.monitoredChannelIds = [];
    this.lastOpenedTime = 0;
    this.globalCooldown = 5000; // 5 seconds default
    this.skuCooldowns = new Map(); // Track cooldowns per SKU
    this.skuCooldownDuration = 10000; // 10 seconds default
    this.discordTab = null;
    this.checkInterval = null;
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get([
        'discord_isActive',
        'discord_monitoredChannels',
        'globalSettings'
      ]);

      this.isActive = result.discord_isActive || false;
      this.monitoredChannelIds = result.discord_monitoredChannels || [];
      
      // Load cooldown settings from globalSettings
      if (result.globalSettings) {
        this.globalCooldown = (result.globalSettings.globalCooldown || 5) * 1000;
        this.skuCooldownDuration = (result.globalSettings.skuCooldown || 10) * 1000;
      }

      console.log('Discord Monitor: Settings loaded', {
        isActive: this.isActive,
        channelCount: this.monitoredChannelIds.length,
        globalCooldown: this.globalCooldown,
        skuCooldownDuration: this.skuCooldownDuration
      });
    } catch (error) {
      console.error('Discord Monitor: Error loading settings', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.local.set({
        discord_isActive: this.isActive,
        discord_monitoredChannels: this.monitoredChannelIds
      });
      console.log('Discord Monitor: Settings saved');
    } catch (error) {
      console.error('Discord Monitor: Error saving settings', error);
    }
  }

  async start() {
    console.log('Discord Monitor: Starting...');
    await this.loadSettings();

    if (!this.isActive) {
      console.log('Discord Monitor: Not active, skipping');
      return;
    }

    if (this.monitoredChannelIds.length === 0) {
      console.warn('Discord Monitor: No channels configured');
      return;
    }

    // Find or open Discord tab
    await this.findOrOpenDiscordTab();

    // Start monitoring interval
    this.startMonitoring();

    console.log('Discord Monitor: Started successfully');
  }

  async findOrOpenDiscordTab() {
    try {
      // Search for existing Discord tab
      const tabs = await chrome.tabs.query({ url: '*://discord.com/*' });
      
      if (tabs.length > 0) {
        this.discordTab = tabs[0];
        console.log('Discord Monitor: Found existing Discord tab', this.discordTab.id);
      } else {
        // Open Discord in a new tab
        const tab = await chrome.tabs.create({
          url: 'https://discord.com/channels/@me',
          active: false
        });
        this.discordTab = tab;
        console.log('Discord Monitor: Opened new Discord tab', this.discordTab.id);
      }
    } catch (error) {
      console.error('Discord Monitor: Error finding/opening Discord tab', error);
    }
  }

  startMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every 2 seconds for new messages
    this.checkInterval = setInterval(async () => {
      await this.checkForNewLinks();
    }, 2000);

    console.log('Discord Monitor: Monitoring started');
  }

  async checkForNewLinks() {
    if (!this.discordTab) {
      console.warn('Discord Monitor: No Discord tab available');
      return;
    }

    try {
      // Inject content script to extract links from Discord
      const results = await chrome.scripting.executeScript({
        target: { tabId: this.discordTab.id },
        function: this.extractLinksFromDiscord,
        args: [this.monitoredChannelIds]
      });

      if (results && results[0] && results[0].result) {
        const links = results[0].result;
        
        if (links.length > 0) {
          console.log('Discord Monitor: Found links', links);
          
          for (const link of links) {
            await this.processLink(link);
          }
        }
      }
    } catch (error) {
      console.error('Discord Monitor: Error checking for links', error);
    }
  }

  // This function runs in the Discord page context
  extractLinksFromDiscord(monitoredChannelIds) {
    const links = [];
    const now = Date.now();

    // Check if we're in a monitored channel
    const currentChannelId = window.location.pathname.split('/').pop();
    
    if (!monitoredChannelIds.includes(currentChannelId)) {
      return links;
    }

    // Look for Target product links in recent messages
    // Target product URL pattern: target.com/p/
    const messages = document.querySelectorAll('[id^="chat-messages-"] [class*="message-"]');
    
    for (const message of messages) {
      const messageLinks = message.querySelectorAll('a[href*="target.com/p/"]');
      
      for (const link of messageLinks) {
        const href = link.href;
        const timestamp = message.querySelector('time')?.dateTime || now;
        
        // Only process links from the last 30 seconds
        const messageAge = now - new Date(timestamp).getTime();
        if (messageAge < 30000) {
          links.push({
            url: href,
            timestamp: timestamp,
            channelId: currentChannelId
          });
        }
      }
    }

    return links;
  }

  async processLink(linkInfo) {
    const now = Date.now();
    
    // Check global cooldown
    if (now - this.lastOpenedTime < this.globalCooldown) {
      console.log('Discord Monitor: Global cooldown active, skipping link');
      return;
    }

    // Extract SKU/TCIN from URL
    const sku = this.extractSku(linkInfo.url);
    
    if (sku) {
      // Check SKU-specific cooldown
      const lastOpenedForSku = this.skuCooldowns.get(sku);
      if (lastOpenedForSku && now - lastOpenedForSku < this.skuCooldownDuration) {
        console.log(`Discord Monitor: SKU ${sku} on cooldown, skipping`);
        return;
      }

      // Update cooldowns
      this.skuCooldowns.set(sku, now);
      this.lastOpenedTime = now;

      // Clean up old cooldowns
      this.cleanupCooldowns();

      // Open link in new tab
      await this.openLink(linkInfo.url);
    }
  }

  extractSku(url) {
    // Extract TCIN/SKU from Target URL
    // Format: target.com/p/product-name/-/A-12345678
    const match = url.match(/\/A-(\d+)/);
    return match ? match[1] : null;
  }

  cleanupCooldowns() {
    const now = Date.now();
    for (const [sku, timestamp] of this.skuCooldowns.entries()) {
      if (now - timestamp > this.skuCooldownDuration * 2) {
        this.skuCooldowns.delete(sku);
      }
    }
  }

  async openLink(url) {
    try {
      console.log('Discord Monitor: Opening link', url);
      
      const tab = await chrome.tabs.create({
        url: url,
        active: true
      });

      console.log('Discord Monitor: Opened tab', tab.id);

      // Send notification to user
      try {
        await chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('icons/icon128.png'),
          title: 'Discord Monitor',
          message: 'Opened product from Discord notification'
        });
      } catch (notifError) {
        console.warn('Discord Monitor: Could not show notification', notifError);
      }
    } catch (error) {
      console.error('Discord Monitor: Error opening link', error);
    }
  }

  stop() {
    console.log('Discord Monitor: Stopping...');
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('Discord Monitor: Stopped');
  }

  async toggle(enabled) {
    this.isActive = enabled;
    await this.saveSettings();

    if (enabled) {
      await this.start();
    } else {
      this.stop();
    }
  }

  async updateChannels(channelIds) {
    this.monitoredChannelIds = channelIds;
    await this.saveSettings();
    console.log('Discord Monitor: Updated channels', channelIds);
  }
}

// Create and export global instance
window.discordMonitor = new DiscordMonitor();

// Auto-start if enabled
window.discordMonitor.loadSettings().then(() => {
  if (window.discordMonitor.isActive) {
    window.discordMonitor.start();
  }
});
