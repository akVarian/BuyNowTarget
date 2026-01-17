// Cleaned / deobfuscated popup script
// Preserves original logic but fixes formatting, converts callback-style storage to promise-based helpers
// and tidies event handling and DOM lookups for reliability.

/**
 * Small promise wrappers for chrome.storage so we can reliably use async/await.
 */
function storageLocalGet(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res) => resolve(res || {}));
  });
}
function storageLocalSet(obj) {
  return new Promise((resolve) => {
    chrome.storage.local.set(obj, () => resolve());
  });
}
function storageLocalRemove(key) {
  return new Promise((resolve) => {
    chrome.storage.local.remove(key, () => resolve());
  });
}
function tabsQuery(queryInfo) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(queryInfo, (tabs) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(tabs || []);
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

/**
 * DOM references
 */
document.addEventListener('DOMContentLoaded', async function () {
  console.log("Popup initialized");

  const manifestVersion = chrome.runtime.getManifest().version;
  const versionEls = document.querySelectorAll(".version-display, #version");
  versionEls.forEach(el => { el.textContent = 'v' + manifestVersion; });
  if (document.title.includes('v3.4') || document.title.includes('v3.5')) {
    document.title = document.title.replace(/v\d+\.\d+/, 'v' + manifestVersion);
  }

  const autoSubmitToggle = document.getElementById("auto-submit");
  const autoCloseOosToggle = document.getElementById("auto-close-oos");
  const autoLoginToggle = document.getElementById('auto-login');
  const statusElement = document.querySelector('.status');
  const sitesConfigEl = document.querySelector('.sites-config');
  const globalSettingsEl = document.getElementById('global-settings');
  const proxySettingsSection = document.getElementById('proxy-settings-section');
  const proxyInput = document.getElementById('proxy-input');

  const priceCheckMainView = document.getElementById("price-check-main-view");
  const priceCheckSettingsView = document.getElementById("price-check-settings-view");
  const priceCheckSettingsBtn = document.getElementById('price-check-settings-btn');
  const priceCheckBackBtn = document.getElementById('price-check-back-btn');
  const priceCheckActiveToggleMain = document.getElementById('price-check-active-toggle');
  const priceCheckStatusMain = document.getElementById('price-check-status-main');
  const priceCheckStatusEl = document.getElementById("price-check-status");
  const priceCheckActiveToggleSettings = document.getElementById("price-check-active-toggle-settings");
  const priceCheckCloseTabToggle = document.getElementById('price-check-close-tab-toggle');
  const priceCheckItemsContainer = document.getElementById('price-check-items-container');
  const priceCheckSkuInput = document.getElementById('price-check-sku-input');
  const priceCheckPriceInput = document.getElementById('price-check-price-input');
  const priceCheckAddBtn = document.getElementById('price-check-add-btn');
  const priceCheckMassInput = document.getElementById("price-check-mass-input");
  const priceCheckMassAddBtn = document.getElementById("price-check-mass-add-btn");
  const copySkusBtn = document.getElementById('copy-skus-btn');
  const copyMaxPriceBtn = document.getElementById('copy-max-price-btn');

  // Some views referenced in the original code — obtain them if present
  const discordMainView = document.getElementById('discord-main-view');
  const profileDropdown = document.querySelector('#target-profile-select');

  // map of site controls (toggle, quantity, profileSelect)
  const siteControls = {};
  let price_check_items = {};
  let price_check_enabled = false;
  let price_check_closeTabOnFail = false;

  console.log("Starting initialization...");
  initSiteControls();
  await loadSettings();
  setupEventListeners();
  console.log("Initialization complete");

  // Initialize site control elements from DOM
  function initSiteControls() {
    if (!sitesConfigEl) {
      console.warn("sites-config element not found in DOM");
      return;
    }
    const siteEls = sitesConfigEl.querySelectorAll('.site-config');
    siteEls.forEach(siteEl => {
      const siteKey = siteEl.getAttribute("data-site");
      if (!siteKey) return;
      siteControls[siteKey] = {
        toggle: siteEl.querySelector('.site-toggle'),
        quantity: siteEl.querySelector('.site-quantity'),
        profileSelect: siteEl.querySelector('.site-profile-select')
      };
    });
    console.log("Initialized site controls:", siteControls);
  }

  // Setup event listeners for UI interactions
  function setupEventListeners() {
    console.log("Setting up event listeners...");

    // Site-specific controls
    for (const siteKey in siteControls) {
      const controls = siteControls[siteKey];

      if (controls.toggle) {
        controls.toggle.addEventListener('change', (evt) => {
          const enabled = evt.target.checked;
          console.log(`Setting ${siteKey} enabled to: ${enabled}`);
          chrome.storage.local.get('siteSettings', (res) => {
            const siteSettings = res.siteSettings || {};
            if (!siteSettings[siteKey]) siteSettings[siteKey] = {};
            siteSettings[siteKey].enabled = enabled;
            chrome.storage.local.set({ siteSettings }, () => {
              if (chrome.runtime.lastError) {
                console.error(`Error saving ${siteKey} enabled state:`, chrome.runtime.lastError);
              } else {
                console.log(`Successfully saved ${siteKey} enabled state: ${enabled}`);
                if (siteKey === 'target') {
                  // notify all target tabs
                  chrome.tabs.query({ url: '*://*.target.com/*' }, (tabs) => {
                    if (tabs && tabs.length > 0) {
                      tabs.forEach(t => {
                        try {
                          tabsSendMessage(t.id, { action: "updateSiteSetting", site: 'target', siteSettings: { enabled } })
                          .catch(err => console.warn("Could not send enabled update to tab:", err && err.message));
                        } catch (e) {
                          console.warn("tabsSendMessage error:", e);
                        }
                      });
                      console.log(`Sent enabled update to ${tabs.length} Target tab(s)`);
                    }
                  });
                }
              }
            });
          });
        });
      }

      if (controls.quantity) {
        controls.quantity.addEventListener('change', (evt) => {
          const quantity = parseInt(evt.target.value) || 1;
          chrome.storage.local.get('siteSettings', (res) => {
            const siteSettings = res.siteSettings || {};
            if (!siteSettings[siteKey]) siteSettings[siteKey] = {};
            siteSettings[siteKey].quantity = quantity;
            console.log(`Saving quantity for ${siteKey}: ${quantity}`);
            chrome.storage.local.set({ siteSettings }, () => {
              if (chrome.runtime.lastError) {
                console.error("Error saving quantity:", chrome.runtime.lastError && chrome.runtime.lastError.message);
              } else {
                console.log("Quantity saved successfully. New value:", quantity);
                if (siteKey === 'target') {
                  chrome.tabs.query({ url: '*://*.target.com/*' }, (tabs) => {
                    if (tabs && tabs.length > 0) {
                      tabs.forEach(t => {
                        try {
                          tabsSendMessage(t.id, { action: 'updateSiteSetting', site: 'target', siteSettings: { quantity } })
                          .catch(err => console.warn("Could not send quantity update to tab:", err && err.message));
                        } catch (e) {
                          console.warn("tabsSendMessage error:", e);
                        }
                      });
                    }
                  });
                }
              }
            });
          });
        });
      }

      if (controls.profileSelect) {
        controls.profileSelect.addEventListener('change', (evt) => {
          const profileId = evt.target.value;
          chrome.storage.local.get('siteSettings', (res) => {
            const siteSettings = res.siteSettings || {};
            if (!siteSettings[siteKey]) siteSettings[siteKey] = {};
            siteSettings[siteKey].profileId = profileId;
            console.log(`Saving profile selection for ${siteKey}: ${profileId}`);
            chrome.storage.local.set({ siteSettings }, () => {
              if (chrome.runtime.lastError) {
                console.error("Error saving profile selection:", chrome.runtime.lastError && chrome.runtime.lastError.message);
              } else {
                console.log("Profile selection saved successfully. New value:", profileId);
                if (siteKey === 'target') {
                  chrome.tabs.query({ url: "*://*.target.com/*" }, (tabs) => {
                    if (tabs && tabs.length > 0) {
                      tabs.forEach(t => {
                        try {
                          tabsSendMessage(t.id, { action: 'updateSiteSetting', site: "target", siteSettings: { profileId } })
                          .catch(err => console.warn("Could not send profile update to tab:", err && err.message));
                        } catch (e) {
                          console.warn("tabsSendMessage error:", e);
                        }
                      });
                      console.log(`Sent profile update to ${tabs.length} Target tab(s)`);
                    }
                  });
                }
              }
            });
          });
        });
      }
    }

    // Global toggles
    if (autoSubmitToggle) {
      autoSubmitToggle.addEventListener('change', (e) => updateGlobalSetting('autoSubmit', e.target.checked));
    }
    if (autoCloseOosToggle) {
      autoCloseOosToggle.addEventListener('change', (e) => updateGlobalSetting('autoCloseCartPage', e.target.checked));
    }

    // Auto-login toggle with credential validation
    if (autoLoginToggle) {
      autoLoginToggle.addEventListener('change', async (e) => {
        const enabled = e.target.checked;
        if (enabled) {
          try {
            const creds = await storageLocalGet(["targetEmail", "targetPassword"]);
            const hasEmail = creds.targetEmail && creds.targetEmail.trim() !== '';
            const hasPassword = creds.targetPassword && creds.targetPassword.trim() !== '';
            if (!hasEmail || !hasPassword) {
              e.target.checked = false;
              alert("Auto-login cannot be enabled without Target credentials.\n\nTo set up auto-login:\n1. Click \"Settings\" in the extension popup\n2. Go to \"General Settings\" tab\n3. Enter your Target email and password\n4. Click \"Save Settings\"\n5. Return here to enable auto-login");
              return;
            }
          } catch (err) {
            console.error("Error checking credentials:", err);
            e.target.checked = false;
            alert("Error checking credentials. Please try again.");
            return;
          }
        }
        updateGlobalSetting('autoLogin', e.target.checked);
      });
    }

    // Proxy input handling
    if (proxyInput) {
      proxyInput.addEventListener('change', handleProxyChange);
      proxyInput.addEventListener('blur', handleProxyChange);
    }

    // Price check navigation
    console.log("Setting up Price Check navigation, button exists:", !!priceCheckSettingsBtn);
    if (priceCheckSettingsBtn) {
      priceCheckSettingsBtn.addEventListener("click", () => {
        console.log("Price Check Settings button clicked");
        if (sitesConfigEl) sitesConfigEl.style.display = 'none';
        if (globalSettingsEl) globalSettingsEl.style.display = 'none';
        if (discordMainView) discordMainView.style.display = 'none';
        if (priceCheckMainView) priceCheckMainView.style.display = "none";
        if (proxySettingsSection) proxySettingsSection.style.display = 'none';
        if (statusElement) statusElement.style.display = 'none';
        if (priceCheckSettingsView) priceCheckSettingsView.style.display = 'block';
      });
    } else {
      console.error("Price Check Settings button not found in DOM");
    }

    if (priceCheckBackBtn) {
      priceCheckBackBtn.addEventListener("click", () => {
        console.log("Price Check Back button clicked");
        if (priceCheckSettingsView) priceCheckSettingsView.style.display = 'none';
        if (sitesConfigEl) sitesConfigEl.style.display = 'flex';
        if (globalSettingsEl) globalSettingsEl.style.display = 'block';
        if (discordMainView) discordMainView.style.display = 'block';
        if (priceCheckMainView) priceCheckMainView.style.display = 'block';
        if (proxySettingsSection) proxySettingsSection.style.display = 'block';
        if (statusElement) statusElement.style.display = 'flex';
      });
    }

    // Price check toggles and controls
    const priceCheckToggleActiveHandler = (evt) => {
      const active = evt.target.checked;
      console.log("Price Check toggle changed to:", active);
      price_check_enabled = active;
      if (priceCheckActiveToggleMain) priceCheckActiveToggleMain.checked = active;
      if (priceCheckActiveToggleSettings) priceCheckActiveToggleSettings.checked = active;
      updatePriceCheckStatusDisplay();
      chrome.storage.local.set({ price_check_enabled: active });
    };
    if (priceCheckActiveToggleMain) priceCheckActiveToggleMain.addEventListener("change", priceCheckToggleActiveHandler);
    if (priceCheckActiveToggleSettings) priceCheckActiveToggleSettings.addEventListener('change', priceCheckToggleActiveHandler);

    if (priceCheckCloseTabToggle) {
      console.log("Initial toggle state:", priceCheckCloseTabToggle.checked);
      const toggleContainer = priceCheckCloseTabToggle.closest('.toggle-wrapper') || priceCheckCloseTabToggle.parentElement;
      if (toggleContainer) {
        console.log("Found toggle container, attaching click handler");
        toggleContainer.addEventListener('click', (evt) => {
          price_check_closeTabOnFail = !price_check_closeTabOnFail;
          priceCheckCloseTabToggle.checked = price_check_closeTabOnFail;
          console.log("Toggle clicked! New state:", price_check_closeTabOnFail);
          if (price_check_closeTabOnFail) toggleContainer.classList.add('toggle-active');
          else toggleContainer.classList.remove('toggle-active');
          chrome.storage.local.set({ price_check_closeTabOnFail }, () => {
            if (chrome.runtime.lastError) console.error("Error saving close tab setting:", chrome.runtime.lastError);
            else {
              console.log("Close tab on fail setting saved successfully:", price_check_closeTabOnFail);
              chrome.storage.local.get(['price_check_closeTabOnFail'], (res) => {
                console.log("Verified state in storage:", res.price_check_closeTabOnFail);
              });
            }
          });
          evt.preventDefault();
          evt.stopPropagation();
        });
        priceCheckCloseTabToggle.addEventListener('change', (evt) => {
          console.log("Checkbox change event triggered, current checked:", evt.target.checked);
          evt.stopPropagation();
        });
      } else {
        console.error("Could not find toggle container for click handler!");
        priceCheckCloseTabToggle.addEventListener('change', (evt) => {
          price_check_closeTabOnFail = evt.target.checked;
          console.log("Fallback handler: toggle changed to", price_check_closeTabOnFail);
          chrome.storage.local.set({ price_check_closeTabOnFail });
        });
      }
    }

    // Price check item handlers
    if (priceCheckAddBtn) priceCheckAddBtn.addEventListener('click', addPriceCheckItem);
    if (priceCheckSkuInput) priceCheckSkuInput.addEventListener('keydown', (e) => { if (e.key === "Enter") addPriceCheckItem(); });
    if (priceCheckMassAddBtn) priceCheckMassAddBtn.addEventListener("click", addPriceCheckItemsBulk);
    if (copySkusBtn) copySkusBtn.addEventListener('click', copySkusToClipboard);
    if (copyMaxPriceBtn) copyMaxPriceBtn.addEventListener("click", copyMaxPriceToClipboard);

    // Storage change listener
    chrome.storage.onChanged.addListener(handleStorageChanges);

    console.log("All event listeners set up");
  } // end setupEventListeners

  // Handle proxy input changes -> parse and save proxy config, notify background
  function handleProxyChange(evt) {
    const value = (evt.target.value || '').trim();
    if (!value) {
      chrome.storage.local.remove('proxyConfig', () => {
        chrome.runtime.sendMessage({ action: 'clearProxy' });
      });
      return;
    }
    const parts = value.split(':');
    let parsed = null;
    if (parts.length === 2) {
      parsed = { host: parts[0], port: parts[1] };
    } else if (parts.length === 4) {
      parsed = { host: parts[0], port: parts[1], username: parts[2], password: parts[3] };
    }
    if (parsed) {
      chrome.storage.local.set({ proxyConfig: parsed }, () => {
        chrome.runtime.sendMessage({ action: 'applyProxy', proxyConfig: parsed });
      });
    }
  }

  // Storage change handler to reflect changes into popup UI
  async function handleStorageChanges(changes, areaName) {
    console.log("Storage changes detected:", areaName, changes);
    if (areaName !== 'local') return;

    if (changes.siteSettings) {
      console.log("siteSettings changed:", changes.siteSettings.newValue);
      const targetSettings = changes.siteSettings.newValue?.['target'];
      if (targetSettings && siteControls.target) {
        if (siteControls.target.toggle && targetSettings.hasOwnProperty('enabled')) {
          siteControls.target.toggle.checked = targetSettings.enabled === true;
          console.log("Updated Target toggle from storage change:", targetSettings.enabled);
        }
        if (siteControls.target.quantity && targetSettings.hasOwnProperty('quantity')) {
          siteControls.target.quantity.value = targetSettings.quantity;
          console.log("Updated Target quantity from storage change:", targetSettings.quantity);
        }
        if (siteControls.target.profileSelect && targetSettings.hasOwnProperty('profileId')) {
          siteControls.target.profileSelect.value = targetSettings.profileId;
          console.log("Updated Target profile from storage change:", targetSettings.profileId);
        }
      }
    }

    if (changes.enabled && siteControls.target?.toggle) {
      console.log("Global 'enabled' flag changed (legacy):", changes.enabled.newValue);
      siteControls.target.toggle.checked = changes.enabled.newValue === true;
    }

    if (changes.globalSettings) {
      const gs = changes.globalSettings.newValue || {};
      if (autoSubmitToggle) autoSubmitToggle.checked = gs.autoSubmit !== false;
      if (autoCloseOosToggle) autoCloseOosToggle.checked = gs.autoCloseCartPage === true;
      if (autoLoginToggle) autoLoginToggle.checked = gs.autoLogin === true;
      console.log("Updated global settings from storage change");
    }

    if (changes.proxyConfig) {
      const pc = changes.proxyConfig.newValue;
      if (pc) {
        let value = '';
        if (pc.username && pc.password) value = `${pc.host}:${pc.port}:${pc.username}:${pc.password}`;
        else value = `${pc.host}:${pc.port}`;
        if (proxyInput) proxyInput.value = value;
      } else if (proxyInput) {
        proxyInput.value = '';
      }
    }

    if (changes.price_check_enabled !== undefined) {
      price_check_enabled = changes.price_check_enabled.newValue;
      if (priceCheckActiveToggleMain) priceCheckActiveToggleMain.checked = price_check_enabled;
      if (priceCheckActiveToggleSettings) priceCheckActiveToggleSettings.checked = price_check_enabled;
      updatePriceCheckStatusDisplay();
    }

    if (changes.price_check_closeTabOnFail !== undefined) {
      price_check_closeTabOnFail = changes.price_check_closeTabOnFail.newValue;
      if (priceCheckCloseTabToggle) priceCheckCloseTabToggle.checked = price_check_closeTabOnFail;
    }

    if (changes.price_check_items) {
      price_check_items = changes.price_check_items.newValue || {};
      renderPriceCheckItems();
    }
  }

  // Load initial settings into the popup UI
  async function loadSettings() {
    try {
      console.log("Loading settings from storage...");
      const res = await storageLocalGet(['enabled', 'siteSettings', "globalSettings", 'proxyConfig', 'discord_monitoredChannels', 'discord_isActive', 'discord_isMultiSkuMode', 'price_check_enabled', 'price_check_closeTabOnFail', 'price_check_items', 'profiles', "selectedProfile"]);
      console.log("Settings loaded:", res);

      // Site-specific target toggle & quantity
      if (siteControls.target && siteControls.target.toggle) {
        const targetEnabled = res.siteSettings?.['target']?.['enabled'] === true;
        siteControls.target.toggle.checked = targetEnabled;
        console.log("Loaded Target toggle state from site-specific settings:", targetEnabled);
        if (siteControls.target.quantity && res.siteSettings?.['target']?.["quantity"]) {
          siteControls.target.quantity.value = res.siteSettings.target.quantity;
          console.log("Loaded Target quantity from settings:", res.siteSettings.target.quantity);
        }
      }

      const globalSettings = res.globalSettings || {};
      if (autoSubmitToggle) autoSubmitToggle.checked = globalSettings.autoSubmit !== false;
      if (autoCloseOosToggle) autoCloseOosToggle.checked = globalSettings.autoCloseCartPage === true;
      if (autoLoginToggle) autoLoginToggle.checked = globalSettings.autoLogin === true;

      if (res.proxyConfig) {
        const pc = res.proxyConfig;
        let proxyStr = '';
        if (pc.username && pc.password) proxyStr = `${pc.host}:${pc.port}:${pc.username}:${pc.password}`;
        else proxyStr = `${pc.host}:${pc.port}`;
        if (proxyInput) proxyInput.value = proxyStr;
      }

      price_check_enabled = res.price_check_enabled === true;
      price_check_closeTabOnFail = res.price_check_closeTabOnFail === true;
      price_check_items = res.price_check_items || {};
      console.log("Price check enabled:", price_check_enabled);

      if (priceCheckActiveToggleMain) priceCheckActiveToggleMain.checked = price_check_enabled;
      if (priceCheckActiveToggleSettings) priceCheckActiveToggleSettings.checked = price_check_enabled;
      if (priceCheckCloseTabToggle) priceCheckCloseTabToggle.checked = price_check_closeTabOnFail;

      updatePriceCheckStatusDisplay();
      renderPriceCheckItems();
      loadProfilesIntoDropdown(res.profiles, res.selectedProfile);

      console.log("Settings loaded successfully");
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  }

  // Populate the profile dropdown
  function loadProfilesIntoDropdown(profiles, selectedProfileId) {
    try {
      console.log("Loading profiles for dropdown...");
      console.log("Profiles data:", profiles ? `${profiles.length} profiles found` : "no profiles");
      if (!profileDropdown) {
        console.error("Profile dropdown not found");
        return;
      }

      // clear existing options (except first default option)
      while (profileDropdown.options.length > 1) profileDropdown.remove(1);

      if (!profiles || !profiles.length) {
        console.warn("No profiles found");
        return;
      }

      profiles.forEach(profile => {
        const opt = document.createElement("option");
        opt.value = profile.id;
        opt.textContent = profile.name || `Profile ${profile.id}`;
        profileDropdown.appendChild(opt);
      });
      console.log("Profiles loaded into dropdown");

      chrome.storage.local.get('siteSettings', (res) => {
        const siteProfileId = res.siteSettings?.['target']?.['profileId'];
        let chosen = null;
        if (siteProfileId) {
          console.log("Using Target site-specific profile ID:", siteProfileId);
          chosen = siteProfileId;
        } else if (selectedProfileId) {
          console.log("Falling back to global profile ID:", selectedProfileId);
          chosen = selectedProfileId;
        }
        if (chosen) {
          profileDropdown.value = chosen;
          console.log("Selected profile set to:", chosen);
          try {
            localStorage.setItem('targetProfileId', chosen);
          } catch (e) {
            console.warn("Could not save profile ID to localStorage:", e);
          }
        } else {
          console.warn("No profile ID found to select");
        }
      });
    } catch (err) {
      console.error("Error loading profiles for dropdown:", err);
      try {
        const recovered = localStorage.getItem('targetProfileId');
        if (recovered && profileDropdown) {
          console.log("Recovered profile ID from localStorage:", recovered);
          profileDropdown.value = recovered;
        }
      } catch (e) {
        console.error("Could not recover from localStorage:", e);
      }
    }
  }

  // Update a value inside globalSettings and propagate to tabs
  async function updateGlobalSetting(key, value) {
    try {
      const res = await storageLocalGet('globalSettings');
      const globalSettings = res.globalSettings || {};
      globalSettings[key] = value;
      await storageLocalSet({ globalSettings });
      console.log("Global setting", key, "updated to:", value);

      // notify target tabs
      try {
        const tabs = await tabsQuery({ url: "*://*.target.com/*" });
        if (tabs.length > 0) {
          tabs.forEach(t => {
            tabsSendMessage(t.id, { action: 'updateGlobalSetting', globalSettings })
            .catch(err => console.warn("Could not send global setting update to tab:", err && err.message));
          });
          console.log("Sent global setting update to", tabs.length, "Target tab(s)");
        }
      } catch (err) {
        console.warn("Error notifying tabs of global settings change:", err);
      }
    } catch (err) {
      console.error("Error updating global setting", key, ":", err);
    }
  }

  // Price check UI helpers
  function updatePriceCheckStatusDisplay() {
    const statusText = price_check_enabled ? 'Active' : 'Inactive';
    const statusClass = price_check_enabled ? "status-online" : "status-offline";
    console.log("Updating price check status display:", statusText);
    if (priceCheckStatusEl) {
      priceCheckStatusEl.textContent = statusText;
      priceCheckStatusEl.className = statusClass;
    }
    if (priceCheckStatusMain) {
      priceCheckStatusMain.textContent = statusText;
      priceCheckStatusMain.className = statusClass;
      priceCheckStatusMain.style.color = price_check_enabled ? '#2ECC71' : '#f04747';
    }
  }

  function addPriceCheckItem() {
    const sku = (priceCheckSkuInput && priceCheckSkuInput.value || '').trim();
    if (!sku) { alert("Please enter a valid SKU/TCIN."); return; }
    const priceVal = parseFloat(priceCheckPriceInput && priceCheckPriceInput.value.trim());
    if (isNaN(priceVal) || priceVal <= 0) { alert("Please enter a valid maximum price."); return; }

    price_check_items[sku] = priceVal;
    chrome.storage.local.set({ price_check_items }, () => {
      renderPriceCheckItems();
      if (priceCheckSkuInput) priceCheckSkuInput.value = '';
      if (priceCheckPriceInput) priceCheckPriceInput.value = '';
    });
  }

  function addPriceCheckItemsBulk() {
    const input = (priceCheckMassInput && priceCheckMassInput.value || '').trim();
    if (!input) { alert("Please enter data in the SKU;maxprice format."); return; }
    const lines = input.split("\n").filter(l => l.trim());
    let addedCount = 0;
    let invalidCount = 0;
    lines.forEach(line => {
      const parts = line.trim().split(';');
      if (parts.length !== 2) { invalidCount++; return; }
      const sku = parts[0].trim();
      const price = parseFloat(parts[1].trim());
      if (!sku || isNaN(price) || price <= 0) { invalidCount++; return; }
      price_check_items[sku] = price;
      addedCount++;
    });
    if (addedCount > 0) {
      chrome.storage.local.set({ price_check_items }, () => {
        renderPriceCheckItems();
        if (priceCheckMassInput) priceCheckMassInput.value = '';
        if (invalidCount > 0) alert(`Added ${addedCount} items. ${invalidCount} items had invalid format and were skipped.`);
        else alert(`Successfully added ${addedCount} items.`);
      });
    } else if (invalidCount > 0) {
      alert("No valid entries found. Please use the format SKU;maxprice on each line.");
    }
  }

  function copySkusToClipboard() {
    const entries = Object.entries(price_check_items);
    if (entries.length === 0) { alert("No price checks available to copy."); return; }
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    const text = entries.map(([sku]) => sku).join("\n");
    navigator.clipboard.writeText(text).then(() => { alert("SKUs copied to clipboard!"); })
    .catch(err => { console.error("Could not copy text:", err); alert("Failed to copy SKUs."); });
  }

  function copyMaxPriceToClipboard() {
    const entries = Object.entries(price_check_items);
    if (entries.length === 0) { alert("No price checks available to copy."); return; }
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    const text = entries.map(([sku, max]) => `${sku};${max}`).join("\n");
    navigator.clipboard.writeText(text).then(() => { alert("SKUs with max prices copied to clipboard!"); })
    .catch(err => { console.error("Could not copy text:", err); alert("Failed to copy SKUs with max prices."); });
  }

  function renderPriceCheckItems() {
    if (!priceCheckItemsContainer) return;
    priceCheckItemsContainer.innerHTML = '';
    const entries = Object.entries(price_check_items);
    if (entries.length === 0) {
      const p = document.createElement('p');
      p.textContent = "No price checks added yet.";
      p.className = 'empty-message';
      priceCheckItemsContainer.appendChild(p);
      return;
    }
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    entries.forEach(([sku, maxPrice]) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'price-check-item';

      const itemDetails = document.createElement('div');
      itemDetails.className = 'price-check-item-details';

      const skuDiv = document.createElement('div');
      skuDiv.className = 'price-check-item-sku';
      skuDiv.textContent = "SKU: " + sku;

      const priceSpan = document.createElement('div');
      priceSpan.className = 'price-check-item-price';
      priceSpan.textContent = "Max Price: $" + maxPrice.toFixed(2);

      itemDetails.appendChild(skuDiv);
      itemDetails.appendChild(priceSpan);

      const actions = document.createElement("div");
      actions.className = 'price-check-item-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'price-check-item-edit';
      editBtn.textContent = '✎';
      editBtn.title = "Edit price";
      editBtn.onclick = () => {
        const newVal = prompt(`Edit max price for SKU "${sku}":`, maxPrice.toFixed(2));
        if (newVal !== null) {
          const parsed = parseFloat(newVal);
          if (!isNaN(parsed) && parsed > 0) {
            price_check_items[sku] = parsed;
            chrome.storage.local.set({ price_check_items }, () => renderPriceCheckItems());
          } else {
            alert("Please enter a valid price (greater than 0).");
          }
        }
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = "price-check-item-delete";
      deleteBtn.textContent = '×';
      deleteBtn.title = "Remove price check";
      deleteBtn.onclick = () => {
        if (confirm(`Remove price check for SKU "${sku}"?`)) {
          delete price_check_items[sku];
          chrome.storage.local.set({ price_check_items }, () => renderPriceCheckItems());
        }
      };

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      itemDiv.appendChild(itemDetails);
      itemDiv.appendChild(actions);
      priceCheckItemsContainer.appendChild(itemDiv);
    });
  }

}); // end DOMContentLoaded