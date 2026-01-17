// Cleaned / deobfuscated background script
// Note: this is a cleaned, readable version of the deobfuscated background.js.
// It preserves original logic but fixes formatting issues (especially broken `return` newlines)
// and adds small promisified wrappers for callback-style chrome APIs to make async usage reliable.

/**
 * Promisified helpers for commonly used chrome callbacks so `await` works reliably.
 */
function storageLocalGet(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res) => resolve(res || {}));
  });
}
function storageSyncGet(keys) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (res) => resolve(res || {}));
  });
}
function chromeProxySettingsSet(details) {
  return new Promise((resolve, reject) => {
    try {
      chrome.proxy.settings.set(details, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}
function chromeProxySettingsClear(details) {
  return new Promise((resolve, reject) => {
    try {
      chrome.proxy.settings.clear(details, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}
function tabsGet(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(tab);
    });
  });
}
function tabsCreate(createProperties) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create(createProperties, (tab) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(tab);
    });
  });
}
function tabsSendMessage(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (res) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(res);
    });
  });
}
function notificationsCreate(options) {
  return new Promise((resolve, reject) => {
    chrome.notifications.create(options, (id) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(id);
    });
  });
}

/**
 * Script injection tracking and cleanup
 */
let injectedScripts = {};

function cleanupScriptTracking() {
  const now = Date.now();
  Object.keys(injectedScripts).forEach((key) => {
    if (now - injectedScripts[key] > 30 * 60 * 1000) { // 30 minutes
      delete injectedScripts[key];
    }
  });
  console.log("Cleaned up script tracking. Current entries:", Object.keys(injectedScripts).length);
}
setInterval(cleanupScriptTracking, 5 * 60 * 1000); // every 5 minutes

/**
 * Proxy helpers
 */
async function applyProxySettings(proxyConfig) {
  const pacScript = `
    function FindProxyForURL(url, host) {
      return "PROXY ${proxyConfig.host}:${proxyConfig.port}";
    }
  `;
  if (proxyConfig.username && proxyConfig.password) {
    const creds = {
      username: proxyConfig.username,
      password: proxyConfig.password
    };
    await chromeProxySettingsSet({
      value: { mode: 'pac_script', pacScript: { data: pacScript } },
      scope: 'regular'
    });
    try {
      chrome.proxy.onAuthRequired && chrome.proxy.onAuthRequired.addListener(
        function(details, callback) {
          try {
            callback({ username: creds.username, password: creds.password });
          } catch (e) {
            return { authCredentials: { username: creds.username, password: creds.password } };
          }
        },
        { urls: ['<all_urls>'] },
        ['asyncBlocking']
      );
    } catch (err) {
      console.warn("[Proxy] Could not register onAuthRequired listener:", err);
    }
    console.log("[Proxy] Applied proxy settings with authentication");
  } else {
    await chromeProxySettingsSet({
      value: { mode: 'pac_script', pacScript: { data: pacScript } },
      scope: 'regular'
    });
    console.log("[Proxy] Applied proxy settings without authentication");
  }
}

async function clearProxySettings() {
  await chromeProxySettingsClear({ scope: 'regular' });
  console.log("[Proxy] Cleared proxy settings");
}

/**
 * onInstalled initialization
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log("Auto-Checkout extension installed/updated");
  chrome.storage.local.get(
    ['profiles', 'selectedProfile', 'siteSettings', 'globalSettings', 'debugMode', 'discord_monitoredChannels', 'discord_isActive', 'discord_tabOpenCooldownSeconds', 'proxyConfig'],
    (localRes) => {
      chrome.storage.sync.get(['discord_webhookUrl'], (syncRes) => {
        const defaults = {
          profiles: localRes.profiles || [],
          selectedProfile: localRes.selectedProfile || '',
          debugMode: localRes.debugMode !== undefined ? localRes.debugMode : true,
          globalSettings: localRes.globalSettings || { autoSubmit: true, randomizeDelay: false },
          siteSettings: localRes.siteSettings || { target: { enabled: false, quantity: 1, profileId: '' } }
        };
        const toSet = {};
        for (const k in defaults) {
          if (localRes[k] === undefined) toSet[k] = defaults[k];
        }
        if (Object.keys(toSet).length > 0) {
          chrome.storage.local.set(toSet);
        }
        if (localRes.proxyConfig) {
          console.log("[Proxy Init] Proxy configuration found, applying...");
          applyProxySettings(localRes.proxyConfig).catch((err) => {
            console.error("[Proxy Init] Error applying proxy settings:", err);
          });
        } else {
          console.log("[Proxy Init] No proxy configuration found.");
        }
      });
    }
  );
});

/**
 * Runtime message handler
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background: onMessage listener triggered. Received message:", message, "from sender:", sender);

  if (message.action === 'applyProxy') {
    applyProxySettings(message.proxyConfig).then(() => {
      sendResponse({ success: true });
    }).catch((err) => {
      console.error("[Proxy] Error applying proxy settings:", err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  }

  if (message.action === "clearProxy") {
    clearProxySettings().then(() => {
      sendResponse({ success: true });
    }).catch((err) => {
      console.error("[Proxy] Error clearing proxy settings:", err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  }

  if (message.action === "updateBadge" && message.text !== undefined) {
    chrome.action.setBadgeText({ text: message.text, tabId: sender.tab ? sender.tab.id : null });
    if (message.color) {
      chrome.action.setBadgeBackgroundColor({ color: message.color, tabId: sender.tab ? sender.tab.id : null });
    }
    return false;
  }

  if (message.action === "debugLog") {
    chrome.storage.local.get(['debugMode'], (res) => {
      if (res.debugMode) {
        console.log(`DEBUG [${message.context}]:`, message.data);
      }
    });
    return false;
  }

  if (message.action === 'getProfileDataForCheckout') {
    chrome.storage.local.get(['profiles', 'selectedProfile'], (res) => {
      console.log("Background: Received request for profile data");
      try {
        console.log("Background: Retrieved profile data:",
          res.profiles ? `${res.profiles.length} profiles found` : "no profiles",
          "selected:", res.selectedProfile || 'none');

        if (!res.profiles || !res.profiles.length) {
          console.warn("Background: No profiles found in storage");
          sendResponse({ error: "No profiles available" });
          return;
        }
        let profile = res.selectedProfile ? res.profiles.find(p => p.id === res.selectedProfile) : null;
        if (!profile) {
          console.log("Background: Selected profile not found or invalid, defaulting to first available");
          profile = res.profiles[0];
        }
        if (!profile) {
          console.warn("Background: No valid profile could be determined");
          sendResponse({ error: "No valid profile found" });
          return;
        }
        if (profile.payment && profile.payment.cardNumber) {
          const card = profile.payment.cardNumber;
          const masked = card.substring(0, 4) + '...' + card.substring(card.length - 4);
          console.log("Background: Sending profile with card " + masked);
        } else if (!profile.cardNumber) {
          console.warn("Background: Profile has no card number data");
        }
        sendResponse({ profileData: profile });
        console.log("Background: sendResponse executed for getProfileDataForCheckout.");
      } catch (err) {
        console.error("Background: Error processing profile data request:", err);
        sendResponse({ error: err.message });
      }
    });
    return true; // keep channel open for async sendResponse
  }

  if (message.action === "pageDetected") {
    const site = message.site;
    const type = message.type;
    if (site && type && sender.tab) {
      chrome.storage.local.get(['siteSettings'], (res) => {
        if (res.siteSettings?.[site]?.['enabled'] === true) {
          console.log("Background: Activating site " + site + " with settings:", res.siteSettings[site]);
          // Use the promisified tabsSendMessage wrapper (callback chrome.tabs.sendMessage does not return a Promise)
          tabsSendMessage(sender.tab.id, {
            action: "activateSite",
            site: site,
            siteSettings: res.siteSettings[site]
          }).catch((err) => console.warn("Could not send activateSite to tab " + sender.tab.id + ": " + (err && err.message)));
        } else {
          console.log("Background: Site " + site + " not enabled in settings:", res.siteSettings?.[site]?.["enabled"] ? "Enabled" : "Disabled");
        }
      });
    }
    return false;
  }

  if (message.action === 'getSiteSettings') {
    const site = message.site;
    if (!site) {
      sendResponse({});
      return false;
    }
    chrome.storage.local.get(['siteSettings', 'globalSettings'], (res) => {
      sendResponse({
        siteSettings: res.siteSettings ? res.siteSettings[site] : null,
        globalSettings: res.globalSettings
      });
    });
    return true;
  }

  console.log("Background: Unhandled message action:", message.action);
  return false;
});

/**
 * Script injection with dedupe/tracking and retry
 */
async function injectScripts(tabId, files, retryCount = 0) {
  try {
    let urlKey = '';
    try {
      const tab = await tabsGet(tabId);
      urlKey = tab.url || '';
      if (urlKey.includes('target.com/p/')) {
        const parts = urlKey.split('/');
        const pIndex = parts.findIndex(x => x === 'p');
        if (pIndex > -1 && pIndex + 2 < parts.length) {
          urlKey = 'target_product_' + parts[pIndex + 1] + '_' + parts[pIndex + 2];
        }
      }
    } catch (err) {
      console.warn("Error getting tab URL for " + tabId + ":", err);
    }

    const trackingKey = tabId + '_' + urlKey + '_' + files.join('_');
    console.log("Preparing to inject scripts for tab " + tabId + " with URL key: " + urlKey);

    if (injectedScripts[trackingKey]) {
      console.log("Scripts already injected for tab " + tabId + " with this URL, skipping:", urlKey);
      return;
    }
    injectedScripts[trackingKey] = Date.now();

    await chrome.scripting.executeScript({ target: { tabId: tabId }, files: files });

    console.log("Successfully injected scripts into tab " + tabId + ":", files);
  } catch (err) {
    if (err && err.message && (err.message.includes("Cannot access") || err.message.includes("extension context invalidated"))) {
      console.log("Skipping script injection into protected/invalidated tab " + tabId + ": " + err.message);
      return;
    }
    console.error("Error injecting scripts into tab " + tabId + ":", err);
    if (retryCount < 2) {
      console.log("Retrying script injection (attempt " + (retryCount + 1) + "/2)...");
      await new Promise((r) => setTimeout(r, 500 * (retryCount + 1)));
      const retryKey = tabId + '_' + files.join('_');
      delete injectedScripts[retryKey];
      await injectScripts(tabId, files, retryCount + 1);
    } else {
      console.error("Max retries reached for injecting scripts into tab " + tabId + ".");
    }
  }
}

chrome.tabs.onRemoved.addListener((tabId) => {
  const keys = Object.keys(injectedScripts).filter(k => k.startsWith(tabId + '_'));
  keys.forEach(k => delete injectedScripts[k]);
  console.log("Cleaned up script tracking for closed tab " + tabId);
});

/**
 * Send message to tab with exponential backoff retry
 */
async function sendTabMessageWithRetry(tabId, message, attempts = 3, baseDelay = 500) {
  let attempt = 0;
  const trySend = async () => {
    try {
      return await tabsSendMessage(tabId, message);
    } catch (err) {
      console.warn("Attempt " + attempt + " to send " + message.action + " to tab " + tabId + " failed:", err && err.message);
      throw err;
    }
  };

  while (attempt < attempts) {
    try {
      // Only wait on retry attempts, not the first one
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt - 1)));
      }
      console.log("Attempt " + (attempt + 1) + '/' + attempts + " to send " + message.action + " to tab " + tabId);
      return await trySend();
    } catch (err) {
      attempt++;
      if (attempt >= attempts) {
        console.error("Failed to send " + message.action + " to tab " + tabId + " after " + attempts + " attempts");
        return null;
      }
    }
  }
  return null;
}

/**
 * Tab update handling - detect target.com pages and inject relevant scripts
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.url && tab.url.includes('target.com/cart')) {
    const previousProductKeys = Object.keys(injectedScripts).filter(k => k.startsWith(tabId + '_target_product_'));
    if (previousProductKeys.length > 0) {
      console.log("Detected product → cart redirect for tab " + tabId + ", re-injecting scripts for cart page");
      previousProductKeys.forEach(k => delete injectedScripts[k]);
      const cartFiles = [
        'common/utils.js',
        'common/element-finder.js',
        'common/storage.js',
        'common/checkout-base.js',
        'sites/target/selectors.js',
        'sites/target/checkout.js',
        'sites/target/content-script.js'
      ];
      injectScripts(tabId, cartFiles).then(() => {
        // Ultra-fast cart page activation
        setTimeout(async () => {
          console.log("Sending detectPage message for cart (redirected) to tab " + tabId);
          await sendTabMessageWithRetry(tabId, { action: 'detectPage', site: 'target', type: 'cart' }, 3, 100);
        }, 50);
      });
      return;
    }
  }

  // Inject scripts as soon as loading starts for maximum speed
  if (changeInfo.status === 'loading' && tab.url && !tab.url.startsWith('chrome://')) {
    if (tab.url.includes('target.com')) {
      try {
        let pageType = '';
        if (tab.url.includes('/p/')) pageType = 'product';
        else if (tab.url.includes('/checkout')) pageType = 'checkout';
        else if (tab.url.includes('/cart')) pageType = 'cart';
        else if (tab.url.includes('/gift-registry')) pageType = 'registry';

        console.log("Target page detected (loading): " + pageType + " at URL: " + tab.url);

        const files = [
          'common/utils.js',
          'common/element-finder.js',
          'common/storage.js',
          'common/checkout-base.js',
          'sites/target/selectors.js',
          'sites/target/checkout.js',
          'sites/target/content-script.js'
        ];

        if (pageType === 'product') {
          const oldKeys = Object.keys(injectedScripts).filter(k => k.startsWith(tabId + '_') && !k.includes(tab.url));
          if (oldKeys.length > 0) {
            console.log("Cleaning up " + oldKeys.length + " previous script injections for tab " + tabId);
            oldKeys.forEach(k => delete injectedScripts[k]);
          }
        }

        injectScripts(tabId, files).then(() => {
          if (pageType) {
            // Ultra-fast activation - minimal delay for maximum speed
            setTimeout(async () => {
              console.log("Sending detectPage message for " + pageType + " to tab " + tabId);
              const res = await sendTabMessageWithRetry(tabId, { action: 'detectPage', site: 'target', type: pageType }, 3, 200);
              if (res) {
                console.log("Successfully notified tab " + tabId + " about " + pageType + " page");
              }
            }, 50);
          }
        });
      } catch (err) {
        console.error("Error in Target URL detection/injection:", err);
      }
    }
  }
});

/**
 * Discord Background Handler - monitors links from content script and opens them with cooldowns
 */
console.log('Discord Background Handler: Loaded');

const lastOpenedTime = { global: 0 };
const skuCooldowns = new Map();

async function getDiscordSettings() {
  try {
    const result = await storageLocalGet(['globalSettings']);
    const settings = result.globalSettings || {};
    return {
      globalCooldown: (settings.globalCooldown || 5) * 1000,
      skuCooldown: (settings.skuCooldown || 10) * 1000
    };
  } catch (error) {
    console.error('Discord Background Handler: Error getting settings', error);
    return { globalCooldown: 5000, skuCooldown: 10000 };
  }
}

function extractSku(url) {
  const match = url.match(/\/A-(\d+)/);
  return match ? match[1] : null;
}

function cleanupCooldowns(skuCooldownDuration) {
  const now = Date.now();
  for (const [sku, timestamp] of skuCooldowns.entries()) {
    if (now - timestamp > skuCooldownDuration * 2) {
      skuCooldowns.delete(sku);
    }
  }
}

async function handleDiscordLink(url, channelId) {
  console.log('Discord Background Handler: Processing link', url);
  const settings = await getDiscordSettings();
  const now = Date.now();

  if (now - lastOpenedTime.global < settings.globalCooldown) {
    console.log('Discord Background Handler: Global cooldown active, skipping');
    return false;
  }

  const sku = extractSku(url);
  if (sku) {
    const lastOpenedForSku = skuCooldowns.get(sku);
    if (lastOpenedForSku && now - lastOpenedForSku < settings.skuCooldown) {
      console.log(`Discord Background Handler: SKU ${sku} on cooldown, skipping`);
      return false;
    }
    skuCooldowns.set(sku, now);
    lastOpenedTime.global = now;
    cleanupCooldowns(settings.skuCooldown);
  } else {
    lastOpenedTime.global = now;
  }

  try {
    const tab = await tabsCreate({ url: url, active: true });
    console.log('Discord Background Handler: Opened tab', tab.id, url);
    try {
      await notificationsCreate({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Discord Monitor',
        message: `Opened product from Discord (SKU: ${sku || 'unknown'})`
      });
    } catch (notifErr) {
      console.warn('Discord Background Handler: Could not show notification', notifErr);
    }
    return true;
  } catch (err) {
    console.error('Discord Background Handler: Error opening tab', err);
    return false;
  }
}

// Message listener for discordLinkDetected
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'discordLinkDetected') {
    console.log('Discord Background Handler: Received Discord link', message);
    handleDiscordLink(message.url, message.channelId).then((result) => {
      sendResponse({ success: result });
    }).catch((error) => {
      console.error('Discord Background Handler: Error handling link', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // keep response channel open
  }
});

console.log('Discord Background Handler: Initialized');

// ============================================================================
// Scheduled Login Feature
// ============================================================================

let scheduledLoginAlarm = null;

async function scheduleLogin(scheduledLoginData) {
  try {
    if (!chrome.alarms) {
      console.error('Scheduled Login: chrome.alarms API not available. Check permissions.');
      return;
    }

    // Clear any existing alarms
    const existingAlarms = await chrome.alarms.getAll();
    for (const alarm of existingAlarms) {
      if (alarm.name.startsWith('scheduledLogin') || alarm.name === 'randomHourlyLogin' || alarm.name === 'intervalLogin') {
        await chrome.alarms.clear(alarm.name);
      }
    }

    if (!scheduledLoginData || (!scheduledLoginData.enabled && !scheduledLoginData.randomHourly && !scheduledLoginData.intervalEnabled)) {
      console.log('Scheduled Login: All logins disabled or not configured');
      return;
    }

    const now = new Date();
    
    // Handle multiple scheduled times
    if (scheduledLoginData.enabled && scheduledLoginData.times) {
      const times = scheduledLoginData.times.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      times.forEach((timeStr, index) => {
        try {
          const [hours, minutes] = timeStr.split(':').map(Number);
          
          if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            console.warn(`Scheduled Login: Invalid time format: ${timeStr}`);
            return;
          }
          
          let scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);
          
          // If the time has already passed today, schedule for tomorrow
          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }

          // Create the alarm with a unique name
          chrome.alarms.create(`scheduledLogin_${index}`, {
            when: scheduledTime.getTime(),
            periodInMinutes: scheduledLoginData.daily ? 24 * 60 : undefined
          });

          console.log(`Scheduled Login ${index + 1}: Set for ${scheduledTime.toLocaleString()}${scheduledLoginData.daily ? ' (repeating daily)' : ' (once)'}`);
        } catch (err) {
          console.error(`Scheduled Login: Error parsing time ${timeStr}:`, err);
        }
      });
    }
    
    // Handle random hourly login
    if (scheduledLoginData.randomHourly) {
      scheduleNextRandomLogin();
    }
    
    // Handle interval-based login
    if (scheduledLoginData.intervalMinutes && scheduledLoginData.intervalMinutes > 0) {
      scheduleNextIntervalLogin(scheduledLoginData.intervalMinutes);
    }
  } catch (error) {
    console.error('Scheduled Login: Error scheduling:', error);
  }
}

function scheduleNextRandomLogin() {
  try {
    const now = new Date();
    const randomMinute = Math.floor(Math.random() * 60); // 0-59
    
    const nextLogin = new Date();
    nextLogin.setHours(now.getHours() + 1, randomMinute, 0, 0);
    
    // If we've already passed this hour + random minute, move to next hour
    if (nextLogin <= now) {
      nextLogin.setHours(nextLogin.getHours() + 1);
    }
    
    chrome.alarms.create('randomHourlyLogin', {
      when: nextLogin.getTime()
    });
    
    console.log(`Random Hourly Login: Scheduled for ${nextLogin.toLocaleString()} (minute ${randomMinute})`);
  } catch (error) {
    console.error('Random Hourly Login: Error scheduling:', error);
  }
}

function scheduleNextIntervalLogin(intervalMinutes) {
  try {
    const now = new Date();
    const nextLogin = new Date(now.getTime() + intervalMinutes * 60 * 1000);
    
    chrome.alarms.create('intervalLogin', {
      when: nextLogin.getTime()
    });
    
    console.log(`Interval Login: Scheduled for ${nextLogin.toLocaleString()} (every ${intervalMinutes} minutes)`);
  } catch (error) {
    console.error('Interval Login: Error scheduling:', error);
  }
}

async function performScheduledLogin() {
  try {
    console.log('Scheduled Login: Executing pre-emptive login...');
    
    // Get credentials
    const result = await storageLocalGet(['targetEmail', 'targetPassword', 'globalSettings']);
    const email = result.targetEmail;
    const password = result.targetPassword;
    const autoLogin = result.globalSettings?.autoLogin !== false;

    if (!autoLogin) {
      console.log('Scheduled Login: Auto-login is disabled, skipping');
      return;
    }

    if (!email || !password) {
      console.log('Scheduled Login: No credentials saved, skipping');
      return;
    }

    // Open Target login page in new tab
    const tab = await tabsCreate({
      url: 'https://www.target.com/account',
      active: false // Don't focus the tab
    });

    console.log(`Scheduled Login: Opened login page in tab ${tab.id}`);

    // Show notification
    try {
      await notificationsCreate({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Scheduled Login',
        message: 'Pre-emptive login to Target started. Check the new tab.'
      });
    } catch (notifErr) {
      console.warn('Scheduled Login: Could not show notification', notifErr);
    }

    // Auto-close the tab after 10 seconds (login should be complete by then)
    setTimeout(async () => {
      try {
        await chrome.tabs.remove(tab.id);
        console.log('Scheduled Login: Closed login tab');
      } catch (err) {
        console.log('Scheduled Login: Could not close tab (may already be closed)');
      }
    }, 10000);

  } catch (error) {
    console.error('Scheduled Login: Error performing login:', error);
  }
}

// Listen for alarm
if (chrome.alarms) {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name.startsWith('scheduledLogin')) {
      console.log(`Scheduled Login: Alarm triggered (${alarm.name})`);
      await performScheduledLogin();
    } else if (alarm.name === 'randomHourlyLogin') {
      console.log('Random Hourly Login: Alarm triggered');
      await performScheduledLogin();
      
      // Schedule the next random login
      const result = await storageLocalGet(['scheduledLogin']);
      if (result.scheduledLogin && result.scheduledLogin.randomHourly) {
        scheduleNextRandomLogin();
      }
    } else if (alarm.name === 'intervalLogin') {
      console.log('Interval Login: Alarm triggered');
      await performScheduledLogin();
      
      // Schedule the next interval login
      const result = await storageLocalGet(['scheduledLogin']);
      if (result.scheduledLogin && result.scheduledLogin.intervalMinutes > 0) {
        scheduleNextIntervalLogin(result.scheduledLogin.intervalMinutes);
      }
    }
  });
} else {
  console.warn('Scheduled Login: chrome.alarms API not available. Scheduled login feature will not work.');
}

// Listen for schedule updates from options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scheduleLoginUpdated') {
    console.log('Scheduled Login: Received update from options page');
    scheduleLogin(message.scheduledLogin);
    sendResponse({ success: true });
    return false;
  }
  
  if (message.action === 'testLogin') {
    console.log('Test Login: Received manual test request');
    performScheduledLogin().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Test Login: Error:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // keep response channel open
  }
});

// Initialize scheduled login on startup
(async function initScheduledLogin() {
  try {
    const result = await storageLocalGet(['scheduledLogin']);
    if (result.scheduledLogin) {
      scheduleLogin(result.scheduledLogin);
    }
  } catch (error) {
    console.error('Scheduled Login: Error initializing:', error);
  }
})();

console.log('Scheduled Login: Initialized');