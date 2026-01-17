console.log("[TARGET-CHECKOUT] Starting execution - Performance Optimized Version");
if (window.location.pathname === "/cart") {
  console.log("Cart page detected - checking auto-close setting");
  if (typeof updateStatus === "function") {
    updateStatus("Cart page detected - checking auto-close setting", "status-waiting");
  }
  async function autoCloseCartPage() {
    try {
      const _0x47c86e = await chrome.storage.local.get(["globalSettings"]);
      const _0x5aa964 = _0x47c86e.globalSettings || {};
      if (_0x5aa964.autoCloseCartPage) {
        console.log("Auto-close cart page is enabled, closing tab...");
        if (typeof updateStatus === "function") {
          updateStatus("Auto-closing cart page...", "status-running");
        }
        console.error("---------- AUTO-CLOSING TAB: CART PAGE DETECTED ----------");
        window.close();
        setTimeout(() => {
          try {
            window.close();
          } catch (_0x150578) {
            console.error("Failed second close attempt:", _0x150578);
          }
        }, 100);
      } else {
        console.log("Auto-close cart page is disabled, keeping tab open");
        if (typeof updateStatus === "function") {
          updateStatus("Cart page detected (automation disabled)", "status-waiting");
        }
      }
    } catch (_0x316c82) {
      console.error("Error in autoCloseCartPage:", _0x316c82);
    }
  }
  autoCloseCartPage();
  window.targetContentScriptExecuted = true;
} else {
  const utils = {};
  const finder = {};
  const storage = {};
  const selectors = {};
  utils.sleep = sleep;
  utils.waitForElement = waitForElement;
  utils.findElementWithSelectors = findElementWithSelectors;
  utils.clickElement = clickElement;
  utils.fillField = fillField;
  utils.updateStatus = updateStatus;
  utils.debugLog = debugLog;
  utils.getFromStorage = getFromStorage;
  utils.saveToStorage = saveToStorage;
  utils.getProfiles = getProfiles;
  finder.findButtonByText = findButtonByText;
  finder.findElementWithSelectors = findElementWithSelectors;
  finder.fillFieldBySelectors = fillFieldBySelectors;
  finder.createElementWatcher = createElementWatcher;
  finder.createButtonWatcher = createButtonWatcher;
  finder.isElementVisible = isElementVisible;
  finder.isElementDisabled = isElementDisabled;
  storage.getFromStorage = getFromStorage;
  storage.saveToStorage = saveToStorage;
  storage.getSiteSettings = getSiteSettings;
  storage.updateSiteSettings = updateSiteSettings;
  storage.getProfiles = getProfiles;
  storage.saveProfile = saveProfile;
  storage.deleteProfile = deleteProfile;
  selectors.productPageSelectors = productPageSelectors;
  selectors.checkoutPageSelectors = checkoutPageSelectors;
  selectors.popupSelectors = popupSelectors;
  selectors.loginPageSelectors = loginPageSelectors;
  if (!window.targetContentScriptExecuted) {
    window.targetContentScriptExecuted = true;
    initializeTargetCheckout();
    function initializeTargetCheckout() {
      console.log("Initializing Target checkout logic...");
      let _0x2ff9f4 = false;
      let _0x57a58e = {};
      let _0x374d73 = {};
      let _0x54665f = false;
      let _0x48c4b8 = "";
      let _0x1e2eb9 = null;
      let _0x31ff88 = false;
      let _0x3959fe = false;
      let _0x42ab65 = false;
      let _0x1e1acc = false;
      let _0x490f2a = false;
      let _0x2973fa = false;
      let _0x5e0334 = 0;
      let _0x17cb02 = false;
      let _0x248029 = 0;
      const _0x44abf7 = 3000;
      const _0x4ffcd0 = 3;
      let _0x2d6471 = [];
      let _0x337d31 = [];
      _0x206f07();
      async function _0x206f07() {
        console.log("Target checkout init() called on page: " + window.location.pathname);
        if (window.location.pathname === "/cart") {
          console.log("Cart page detected in init() - checkout automation disabled for cart pages");
          utils.updateStatus("Cart page detected (automation disabled)", "status-waiting");
          return;
        }
        await _0x51e9d3();
        _0x4d15d5();
        _0xac78e8();
      }
      async function _0x51e9d3() {
        try {
          console.log("Loading settings and profile from storage, previous isEnabled =", _0x2ff9f4);
          const _0x15eddb = await storage.getFromStorage(["siteSettings", "globalSettings", "debugMode", "price_check_enabled", "price_check_closeTabOnFail", "price_check_items"]);
          _0x57a58e = _0x15eddb.siteSettings?.target || {
            enabled: false,
            quantity: 1,
            profileId: ""
          };
          _0x374d73 = _0x15eddb.globalSettings || {
            autoSubmit: true,
            randomizeDelay: false
          };
          _0x2ff9f4 = _0x57a58e.enabled === true;
          console.log("Target enabled state: " + _0x2ff9f4 + " (using site-specific setting only)");
          console.log("Target quantity setting: " + _0x57a58e.quantity);
          console.log("Target profile ID: " + (_0x57a58e.profileId || "not set"));
          try {
            window.sessionStorage.setItem("target_module_enabled", _0x2ff9f4 ? "true" : "false");
            window.sessionStorage.setItem("target_module_quantity", _0x57a58e.quantity.toString());
            if (_0x57a58e.profileId) {
              window.sessionStorage.setItem("target_module_profileId", _0x57a58e.profileId);
            }
          } catch (_0x1cc9dc) {
            console.warn("Could not save settings to sessionStorage:", _0x1cc9dc);
          }
          utils.debugLog("target-settings-loaded", {
            siteSettings: _0x57a58e,
            globalSettings: _0x374d73,
            isEnabled: _0x2ff9f4
          });
          const _0xa435ac = await storage.getProfiles();
          const _0x480be4 = _0xa435ac.profiles || [];
          const _0x15894a = _0x57a58e.profileId;
          const _0x2b30fe = _0xa435ac.selectedProfileId;
          _0x1e2eb9 = null;
          console.log("Profile selection: site profile ID = \"" + _0x15894a + "\", global profile ID = \"" + _0x2b30fe + "\", total profiles: " + _0x480be4.length);
          if (_0x15894a) {
            _0x1e2eb9 = _0x480be4.find(_0x5b44b8 => _0x5b44b8.id === _0x15894a);
            if (_0x1e2eb9) {
              console.log("Using site-specific profile: " + _0x1e2eb9.name + " (ID: " + _0x1e2eb9.id + ")");
            } else {
              console.warn("Site-specific profile ID \"" + _0x15894a + "\" not found in available profiles.");
            }
          }
          if (!_0x1e2eb9 && _0x2b30fe) {
            _0x1e2eb9 = _0x480be4.find(_0xa4506c => _0xa4506c.id === _0x2b30fe);
            if (_0x1e2eb9) {
              console.log("Using global profile: " + _0x1e2eb9.name + " (ID: " + _0x1e2eb9.id + ")");
            } else {
              console.warn("Global profile ID \"" + _0x2b30fe + "\" not found in available profiles.");
            }
          }
          if (!_0x1e2eb9 && _0x480be4.length > 0) {
            _0x1e2eb9 = _0x480be4[0];
            console.log("No profile ID specified or found, defaulting to first profile: " + _0x1e2eb9.name + " (ID: " + _0x1e2eb9.id + ")");
            await storage.saveToStorage({
              selectedProfile: _0x1e2eb9.id
            });
            _0x57a58e.profileId = _0x1e2eb9.id;
            await storage.updateSiteSettings("target", {
              profileId: _0x1e2eb9.id
            });
            console.log("Updated site profile ID to first profile: " + _0x1e2eb9.id);
          }
          if (!_0x1e2eb9) {
            console.warn("No checkout profile selected or found for Target.");
          } else {
            utils.debugLog("target-profile-loaded", {
              profileName: _0x1e2eb9.name
            });
          }
        } catch (_0x25039d) {
          console.error("Error loading settings or profile:", _0x25039d);
          _0x2ff9f4 = false;
          utils.updateStatus("Error loading settings: " + _0x25039d.message, "status-waiting");
        }
      }
      function _0x4d15d5() {
        chrome.runtime.onMessage.addListener((_0x4ddd48, _0x519428, _0x7d9c37) => {
          let _0x13cf35 = false;
          utils.debugLog("target-message-received", _0x4ddd48);
          if (_0x4ddd48.action === "detectPage" && _0x4ddd48.site === "target") {
            if (_0x4ddd48.type === "cart") {
              console.log("Cart page detection message received - ignoring");
              return;
            }
            _0x4af73c(_0x4ddd48.type);
          }
          if (_0x4ddd48.action === "activateSite" && _0x4ddd48.site === "target") {
            console.log("Target received 'activateSite'");
            const _0xdf8a96 = _0x2ff9f4;
            _0x57a58e = _0x4ddd48.siteSettings || _0x57a58e;
            _0x2ff9f4 = _0x57a58e.enabled === true;
            console.log("Target activation: Site=" + _0x57a58e.enabled + ", Effective=" + _0x2ff9f4);
            if (!_0xdf8a96 && _0x2ff9f4) {
              _0x251a6f();
            } else if (_0xdf8a96 && !_0x2ff9f4) {
              _0x1ec5e0();
            }
          }
          if (_0x4ddd48.action === "toggleStatus") {
            console.log("Target received 'toggleStatus'");
            const _0x247b7 = _0x4ddd48.enabled;
            const _0x5d736e = _0x2ff9f4;
            _0x2ff9f4 = _0x247b7 && (_0x57a58e?.enabled || false);
            console.log("Target toggle: Global=" + _0x247b7 + ", Site=" + _0x57a58e?.enabled + ", Effective=" + _0x2ff9f4);
            if (_0x5d736e && !_0x2ff9f4) {
              _0x1ec5e0();
            } else if (!_0x5d736e && _0x2ff9f4) {
              _0x251a6f();
            }
          }
          if (_0x4ddd48.action === "updateSiteSetting" && _0x4ddd48.site === "target") {
            console.log("Target setting update received in content script:", _0x4ddd48.siteSettings);
            Object.assign(_0x57a58e, _0x4ddd48.siteSettings);
            console.log("Updated local siteSettings:", _0x57a58e);
            try {
              for (const _0x573de0 in _0x4ddd48.siteSettings) {
                const value = _0x4ddd48.siteSettings[_0x573de0];
                window.sessionStorage.setItem("target_module_" + _0x573de0, String(value));
                console.log("Backed up " + _0x573de0 + "=" + value + " to sessionStorage");
              }
            } catch (_0x4af286) {
              console.warn("Could not save settings to sessionStorage:", _0x4af286);
            }
            if (_0x4ddd48.siteSettings.hasOwnProperty("enabled")) {
              const _0x2b2efd = _0x2ff9f4;
              _0x2ff9f4 = _0x57a58e.enabled === true;
              console.log("Target enabled setting update: Site=" + _0x57a58e.enabled + ", Effective=" + _0x2ff9f4);
              if (_0x2b2efd && !_0x2ff9f4) {
                _0x1ec5e0();
              } else if (!_0x2b2efd && _0x2ff9f4) {
                _0x251a6f();
              }
            }
            if (_0x4ddd48.siteSettings.hasOwnProperty("quantity")) {
              console.log("Target quantity updated to: " + _0x57a58e.quantity);
            }
            if (_0x4ddd48.siteSettings.hasOwnProperty("profileId")) {
              console.log("Target profile ID updated to: " + _0x57a58e.profileId);
              _0x51e9d3();
            }
            _0x7d9c37({
              success: true,
              received: _0x4ddd48.siteSettings
            });
            return true;
          }
          if (_0x4ddd48.action === "updateGlobalSetting") {
            console.log("Target global setting update received in content script:", _0x4ddd48.globalSettings);
            Object.assign(_0x374d73, _0x4ddd48.globalSettings);
            console.log("Updated local globalSettings:", _0x374d73);
          }
          if (_0x4ddd48.action === "profileUpdated" || _0x4ddd48.action === "profileSelected") {
            console.log("Target detected profile update/selection.");
            _0x51e9d3();
          }
          if (_0x13cf35) {
            return true;
          }
        });
        console.log("Target message listeners set up.");
      }
      function _0xac78e8() {
        const _0x4a5560 = window.location.href;
        let _0x1e590f = "unknown";
        try {
          if (_0x4a5560.includes("target.com/p/")) {
            _0x1e590f = "product";
          } else if (_0x4a5560.includes("/gift-registry")) {
            _0x1e590f = "registry";
          } else if (_0x4a5560.includes("target.com/checkout")) {
            _0x1e590f = "checkout";
          } else if (window.location.pathname === "/cart") {
            _0x1e590f = "cart";
          } else if (_0x4a5560.includes("/account/signin") || _0x4a5560.includes("/account") || _0x4a5560.includes("/login") || document.querySelector("form[name=\"login\"]") || document.querySelector("#username") || document.querySelector("#password")) {
            _0x1e590f = "login";
          }
          console.log("Detected Target page type: " + _0x1e590f + " for URL: " + _0x4a5560);
        } catch (_0x4e92ca) {
          console.error("Error detecting page type:", _0x4e92ca);
        }
        return _0x1e590f;
      }
      function _0x4af73c(_0xc2eccd) {
        console.log("Handling detected page type: " + _0xc2eccd + ". Enabled: " + _0x2ff9f4);
        _0x1ec5e0();
        if (_0xc2eccd === "cart") {
          console.log("Cart page detected - checkout automation is disabled for cart pages");
          utils.updateStatus("Cart page detected (automation disabled)", "status-waiting");
          return;
        }
        try {
          const _0x57a2cf = window.location.href.includes("target.com/p/");
          if (_0x2ff9f4) {
            if (_0xc2eccd === "product") {
              utils.updateStatus("Ready on product page", "status-running");
              _0x51e9d3().then(() => {
                console.log("Settings loaded, preparing to start checkout process");
                const _0x4694b3 = () => {
                  console.log("Starting checkout process immediately");
                  try {
                    _0x497e30(true).catch(_0x4dc56e => {
                      if (_0x4dc56e && _0x4dc56e.message && _0x4dc56e.message.includes("lookup route")) {
                        console.warn("Route lookup error detected, attempting to continue anyway:", _0x4dc56e.message);
                        utils.updateStatus("Working around route error...", "status-running");
                        setTimeout(() => {
                          _0x497e30(true).catch(_0x10d20f);
                        }, 300);
                      } else {
                        _0x10d20f(_0x4dc56e);
                      }
                    });
                  } catch (_0x2436f3) {
                    console.error("Error starting checkout process:", _0x2436f3);
                    _0x10d20f(_0x2436f3);
                  }
                };
                if (document.readyState === "complete" || document.readyState === "interactive") {
                  console.log("Page already loaded, starting checkout immediately");
                  _0x4694b3();
                } else {
                  console.log("Page still loading, waiting for DOMContentLoaded event");
                  window.addEventListener("DOMContentLoaded", () => {
                    console.log("DOMContentLoaded fired, starting checkout");
                    _0x4694b3();
                  }, {
                    once: true
                  });
                  setTimeout(_0x4694b3, 50);
                }
              }).catch(_0x2e148e => {
                console.error("Failed to load settings:", _0x2e148e);
                utils.updateStatus("Error loading settings", "status-waiting");
              });
            } else if (_0xc2eccd === "checkout") {
              utils.updateStatus("Continuing on checkout page", "status-running");
              _0x68c4cb();
              _0x51e9d3().then(() => {
                console.log("Settings loaded, preparing to continue checkout process");
                setTimeout(() => _0x39ce02().catch(_0x10d20f), 100);
              }).catch(_0x7d258e => {
                console.error("Failed to load settings:", _0x7d258e);
                utils.updateStatus("Error loading settings", "status-waiting");
              });
            } else if (_0xc2eccd === "registry") {
              utils.updateStatus("Gift registry page detected (not supported)", "status-waiting");
              console.log("Gift registry pages are not supported for checkout automation");
            } else if (_0xc2eccd === "login") {
              _0x4fb218();
            } else {
              utils.updateStatus("On non-targetable Target page", "status-waiting");
            }
          } else {
            const _0x462a73 = {
              product: "Product page detected (Disabled)",
              checkout: "Checkout page detected (Disabled)",
              registry: "Gift registry page detected (not supported)",
              unknown: "Non-targetable Target page"
            };
            utils.updateStatus(_0x462a73[_0xc2eccd] || _0x462a73.unknown, "status-waiting");
          }
        } catch (_0x1b4729) {
          console.error("Error in handlePageDetection:", _0x1b4729);
          utils.updateStatus("Error handling page detection", "status-waiting");
        }
      }
      function _0x251a6f() {
        console.log("Target checkout activated");
        if (window.location.pathname === "/cart") {
          console.log("Cart page detected in onActivate() - checkout automation disabled for cart pages");
          utils.updateStatus("Cart page detected (automation disabled)", "status-waiting");
          return;
        }
        _0x51e9d3().then(() => {
          const _0x23c92e = _0xac78e8();
          if (_0x23c92e !== "cart") {
            _0x4af73c(_0x23c92e);
          }
        });
      }
      function _0x1ec5e0() {
        console.log("Cleaning up Target checkout processes");
        _0x54665f = false;
        _0x48c4b8 = "";
        _0x31ff88 = false;
        _0x3959fe = false;
        _0x42ab65 = false;
        _0x1e1acc = false;
        _0x490f2a = false;
        _0x2d6471.forEach(_0x15f2fa => {
          if (_0x15f2fa && typeof _0x15f2fa.disconnect === "function") {
            try {
              _0x15f2fa.disconnect();
            } catch (_0x17e9b9) {
              console.warn("Error disconnecting observer:", _0x17e9b9);
            }
          }
        });
        _0x2d6471 = [];
        _0x337d31.forEach(_0x2b418f => clearInterval(_0x2b418f));
        _0x337d31 = [];
        if (window.highDemandRetryInterval) {
          clearInterval(window.highDemandRetryInterval);
          window.highDemandRetryInterval = null;
          console.log("Cleared high demand retry interval");
        }
        if (window.orderCompletionRetryInterval) {
          clearInterval(window.orderCompletionRetryInterval);
          window.orderCompletionRetryInterval = null;
          console.log("Cleared order completion retry interval");
        }
        console.log("Target observers/intervals cleaned.");
      }
      function _0x10d20f(_0x28e7a3) {
        console.error("Checkout process error during step '" + _0x48c4b8 + "':", _0x28e7a3);
        utils.updateStatus("Error: " + _0x28e7a3.message, "status-waiting");
        _0x54665f = false;
      }
      function _0x2e1a62() {
        try {
          console.log("🔍 Starting TCIN extraction (URL method only)");
          const _0x2faf71 = window.location.pathname.match(/\/p\/.*?-\/A-(\d+)/);
          if (_0x2faf71 && _0x2faf71[1]) {
            console.log("🔍 Extracted TCIN from URL: " + _0x2faf71[1]);
            return _0x2faf71[1];
          }
          const _0x2036df = document.querySelectorAll("[data-tcin]");
          if (_0x2036df.length > 0) {
            const _0x6d4d3c = _0x2036df[0].getAttribute("data-tcin");
            console.log("🔍 Found TCIN in data-tcin attribute: " + _0x6d4d3c);
            return _0x6d4d3c;
          }
          console.warn("⚠️ Could not find TCIN from URL or data attribute");
          return null;
        } catch (_0x40f393) {
          console.error("❌ Error extracting TCIN:", _0x40f393);
          console.error("❌ Stack trace:", _0x40f393.stack);
          return null;
        }
      }
      function _0x556191() {
        try {
          console.log("🔍 Starting price extraction");
          const _0x466ad7 = document.querySelector("[data-test=\"product-price\"]");
          console.log("🔍 Primary price element found:", _0x466ad7 ? "Yes" : "No");
          if (_0x466ad7) {
            const _0x144eeb = _0x466ad7.textContent.trim();
            console.log("🔍 Price element text:", _0x144eeb);
            const _0x832a42 = parseFloat(_0x144eeb.replace("$", ""));
            if (!isNaN(_0x832a42)) {
              console.log("🔍 Successfully extracted price: $" + _0x832a42);
              return _0x832a42;
            } else {
              console.log("🔍 Price text could not be converted to a number");
            }
          }
          console.log("🔍 Trying fallback price selectors");
          const _0x33e731 = Array.from(document.querySelectorAll(".styles__PriceFontSize-sc-x06r9i-0, .h-text-bold"));
          console.log("🔍 Fallback price elements found:", _0x33e731.length);
          if (_0x33e731.length > 0) {
            console.log("🔍 Fallback element texts:", _0x33e731.map(_0x24cc49 => _0x24cc49.textContent.trim()));
          }
          for (const _0x1d6ea5 of _0x33e731) {
            const _0x4d717a = _0x1d6ea5.textContent.trim();
            console.log("🔍 Checking potential price text:", _0x4d717a);
            if (_0x4d717a.startsWith("$")) {
              const _0x2eb70a = parseFloat(_0x4d717a.replace("$", ""));
              if (!isNaN(_0x2eb70a)) {
                console.log("🔍 Found price via fallback: $" + _0x2eb70a);
                return _0x2eb70a;
              }
            }
          }
          console.log("🔍 Trying to extract price from structured data");
          const _0x488a6b = document.querySelector("script[type=\"application/ld+json\"]");
          if (_0x488a6b) {
            try {
              const _0x274698 = JSON.parse(_0x488a6b.textContent);
              console.log("🔍 Structured data found:", _0x274698.hasOwnProperty("offers") ? "Has offers" : "No offers");
              if (_0x274698.offers && _0x274698.offers.price) {
                const _0x4016b5 = parseFloat(_0x274698.offers.price);
                if (!isNaN(_0x4016b5)) {
                  console.log("🔍 Found price in structured data: $" + _0x4016b5);
                  return _0x4016b5;
                }
              }
            } catch (_0x3578d8) {
              console.log("🔍 Error parsing structured data:", _0x3578d8.message);
            }
          }
          console.warn("⚠️ Could not find price on product page after trying all methods");
          return null;
        } catch (_0x411fcd) {
          console.error("❌ Error extracting price:", _0x411fcd);
          console.error("❌ Stack trace:", _0x411fcd.stack);
          return null;
        }
      }
      let _0x1749e3 = false;
      async function _0xfdd300() {
        try {
          const _0x153198 = await storage.getFromStorage(["price_check_enabled"]);
          const _0xd8f51c = _0x153198.price_check_enabled === true;
          if (!_0xd8f51c) {
            console.log("🔍 Price check is disabled, skipping all price verification");
            return true;
          }
          console.log("🔍 Price check starting (enabled)...");
          const _0x5bf52d = await storage.getFromStorage(["price_check_closeTabOnFail", "price_check_items"]);
          const _0x43eb30 = _0x5bf52d.price_check_closeTabOnFail === true;
          const _0x19b78e = _0x5bf52d.price_check_items || {};
          console.log("🔍 Price check settings loaded:", {
            price_check_enabled: _0xd8f51c,
            price_check_closeTabOnFail: _0x43eb30,
            num_items: Object.keys(_0x19b78e).length,
            item_keys: Object.keys(_0x19b78e)
          });
          const _0xe4a9ee = _0x2e1a62();
          console.log("🔍 Extracted TCIN:", _0xe4a9ee);
          const _0x35af40 = document.querySelectorAll("div b");
          console.log("🔍 TCIN labels found:", _0x35af40.length);
          if (_0x35af40.length > 0) {
            console.log("🔍 TCIN label texts:", Array.from(_0x35af40).map(_0x50c39f => _0x50c39f.textContent.trim()));
          }
          const _0x99492f = document.querySelector("meta[name=\"productId\"]");
          console.log("🔍 Meta TCIN element found:", _0x99492f ? "Yes" : "No");
          if (_0x99492f) {
            console.log("🔍 Meta TCIN value:", _0x99492f.content);
          }
          const _0x4936f6 = _0x556191();
          console.log("🔍 Extracted price:", _0x4936f6);
          const _0x46d7fe = document.querySelectorAll("[data-test=\"product-price\"]");
          console.log("🔍 Price elements found:", _0x46d7fe.length);
          if (_0x46d7fe.length > 0) {
            console.log("🔍 Price element texts:", Array.from(_0x46d7fe).map(_0x1fd332 => _0x1fd332.textContent.trim()));
          }
          const _0xcf8979 = document.querySelectorAll(".styles__PriceFontSize-sc-x06r9i-0, .h-text-bold");
          console.log("🔍 Fallback price elements found:", _0xcf8979.length);
          if (_0xcf8979.length > 0) {
            console.log("🔍 Fallback price texts:", Array.from(_0xcf8979).map(_0x5035b6 => _0x5035b6.textContent.trim()));
          }
          if (!_0xe4a9ee) {
            console.warn("⚠️ Could not perform price check: TCIN not found on page");
            console.warn("⚠️ DOM elements checked:", document.querySelectorAll("div b").length);
            console.log("🔍 HTML structure near where TCIN should be:");
            const _0x55d0f7 = document.querySelectorAll(".ProductDetailsLayout");
            if (_0x55d0f7.length > 0) {
              console.log("🔍 Product details containers found:", _0x55d0f7.length);
              console.log("🔍 First container HTML snippet:", _0x55d0f7[0].innerHTML.substring(0, 500) + "...");
            } else {
              console.log("🔍 Product details containers not found");
            }
            return true;
          }
          if (!_0x4936f6) {
            console.warn("⚠️ Could not perform price check: Price not found on page");
            console.warn("⚠️ Price elements available:", document.querySelectorAll("[data-test=\"product-price\"]").length);
            console.log("🔍 HTML structure near where price should be:");
            const _0x48c9cd = document.querySelectorAll(".styles__PriceDetailsWrapper-sc-1iuiv4s-0, .styles__PriceFontSize-sc-x06r9i-0");
            if (_0x48c9cd.length > 0) {
              console.log("🔍 Price containers found:", _0x48c9cd.length);
              console.log("🔍 First container HTML snippet:", _0x48c9cd[0].innerHTML.substring(0, 500) + "...");
            } else {
              console.log("🔍 Price containers not found");
            }
            return true;
          }
          console.log("🔍 All saved price check items:", JSON.stringify(_0x19b78e, null, 2));
          console.log("🔍 Checking if TCIN exists in price_check_items:", _0xe4a9ee in _0x19b78e);
          if (_0xe4a9ee in _0x19b78e) {
            const _0x308786 = _0x19b78e[_0xe4a9ee];
            console.log("🔍 Price check: Comparing price $" + _0x4936f6 + " with max $" + _0x308786 + " for TCIN " + _0xe4a9ee);
            if (_0x4936f6 > _0x308786) {
              utils.updateStatus("Price check failed: $" + _0x4936f6 + " exceeds max $" + _0x308786, "status-waiting");
              console.error("❌ PRICE CHECK FAILED: $" + _0x4936f6 + " exceeds maximum price $" + _0x308786 + " for TCIN " + _0xe4a9ee);
              console.error("------------- CHECKOUT BLOCKED BY PRICE CHECK -------------");
              if (_0x43eb30) {
                console.log("🔍 Price check failed - Closing tab immediately");
                try {
                  window.close();
                  setTimeout(() => {
                    try {
                      window.close();
                    } catch (_0x30515d) {
                      console.error("Failed second close attempt:", _0x30515d);
                    }
                  }, 50);
                } catch (_0x261d4d) {
                  console.error("Failed to close tab:", _0x261d4d);
                  if (!_0x1749e3) {
                    _0x1749e3 = true;
                    alert("Price check failed: $" + _0x4936f6 + " exceeds your maximum price of $" + _0x308786 + " for this item.");
                  }
                }
              } else if (!_0x1749e3) {
                _0x1749e3 = true;
                alert("Price check failed: $" + _0x4936f6 + " exceeds your maximum price of $" + _0x308786 + " for this item.");
              }
              return false;
            } else {
              utils.updateStatus("Price check passed: $" + _0x4936f6 + " <= max $" + _0x308786, "status-running");
              console.log("✅ Price check passed: $" + _0x4936f6 + " is under or equal to maximum price $" + _0x308786 + " for TCIN " + _0xe4a9ee);
              return true;
            }
          } else {
            console.log("🔍 No price check rule for TCIN " + _0xe4a9ee + " - continuing checkout");
            return true;
          }
        } catch (_0x1c2d1e) {
          console.error("❌ Error during price check:", _0x1c2d1e);
          console.error("❌ Stack trace:", _0x1c2d1e.stack);
          utils.updateStatus("Price check error: " + _0x1c2d1e.message, "status-waiting");
          console.log("🔍 Error context - URL:", window.location.href);
          console.log("🔍 Error context - DOM ready state:", document.readyState);
          return false;
        }
      }
      function _0x2adc1f() {
        try {
          const _0x5a2365 = finder.findElementWithSelectors(selectors.productPageSelectors.addToCart);
          const _0x5d1f18 = _0x5a2365 && finder.isElementVisible(_0x5a2365);
          if (_0x5d1f18) {
            console.log("Add to cart button is ready");
          }
          return _0x5d1f18;
        } catch (_0x3bf173) {
          console.log("Error checking critical elements:", _0x3bf173);
          return false;
        }
      }
      async function _0x497e30(_0x495583 = false) {
        if (_0x54665f) {
          console.log("Checkout already in progress...");
          return;
        }
        _0x54665f = true;
        utils.updateStatus("Starting checkout...", "status-running");
        _0x48c4b8 = "start";
        try {
          if (!_0x495583) {
            await _0x51e9d3();
          }
          if (!_0x1e2eb9) {
            utils.updateStatus("Error: No profile selected", "status-waiting");
            throw new Error("Cannot start checkout: No profile selected.");
          }
          if (!_0x2ff9f4) {
            console.log("Checkout start aborted: Extension disabled.");
            _0x54665f = false;
            return;
          }
          const _0x37b600 = _0xfdd300();
          let _0x259aba = new Promise(async (_0x547c7e, _0x33c20a) => {
            try {
              _0x48c4b8 = "check-stock";
              console.log("Checking stock status...");
              const _0x2a4669 = finder.findElementWithSelectors(selectors.productPageSelectors.outOfStock);
              if (_0x2a4669 && finder.isElementVisible(_0x2a4669)) {
                _0x33c20a(new Error("Item is out of stock."));
              } else {
                _0x547c7e();
              }
            } catch (_0x4dcd2e) {
              if (_0x4dcd2e.message && _0x4dcd2e.message.includes("out of stock")) {
                _0x33c20a(_0x4dcd2e);
              } else {
                console.warn("Non-critical error in check-stock step: " + _0x4dcd2e.message + ". Continuing anyway.");
                _0x547c7e();
              }
            }
          });
          const [_0x402b7d] = await Promise.all([_0x37b600, _0x259aba]);
          if (!_0x402b7d) {
            console.log("Checkout aborted due to price check failure");
            _0x54665f = false;
            return;
          }
          try {
            try {
              _0x48c4b8 = "add-to-cart";
              console.log("Adding item to cart...");
              await _0x4a0400();
              await utils.sleep(30);
            } catch (_0x3bc496) {
              console.error("Critical error in add-to-cart step:", _0x3bc496);
              throw _0x3bc496;
            }
            try {
              _0x48c4b8 = "handle-popups";
              console.log("Handling popups...");
              await _0x4e771d();
            } catch (_0x28794c) {
              console.warn("Error handling popups: " + _0x28794c.message + ". Continuing anyway.");
            }
            _0x48c4b8 = "go-to-checkout";
            console.log("Proceeding to checkout...");
            await _0x574041();
          } catch (_0x45f8f6) {
            _0x10d20f(_0x45f8f6);
          }
        } catch (_0x417684) {
          console.error("Critical error before checkout could begin: " + _0x417684.message);
          utils.updateStatus("Error: " + _0x417684.message, "status-waiting");
          _0x54665f = false;
        }
      }
      async function _0x83973f() {
        console.log("proceedFromCart called but all cart page processing is disabled");
        return;
      }
      async function _0x39ce02() {
        if (_0x54665f) {
          console.log("Checkout continuation already in progress.");
          return;
        }
        await _0x51e9d3();
        if (!_0x1e2eb9) {
          utils.updateStatus("Error: No profile for checkout", "status-waiting");
          throw new Error("Cannot continue checkout: No profile selected.");
        }
        if (!_0x2ff9f4) {
          console.log("Continue checkout aborted: Extension disabled.");
          return;
        }
        _0x54665f = true;
        utils.updateStatus("Continuing checkout...", "status-running");
        _0x48c4b8 = "continue-checkout";
        try {
          console.log("Determining current step on checkout page...");
          await utils.sleep(100);
          try {
            _0x48c4b8 = "wait-for-load";
            console.log("Checking for loading indicators...");
            const _0x8658b = selectors.checkoutPageSelectors.loadingSpinner;
            if (Array.isArray(_0x8658b)) {
              const _0x4350c6 = finder.findElementWithSelectors(_0x8658b);
              if (_0x4350c6 && finder.isElementVisible(_0x4350c6)) {
                console.log("Checkout page loading detected, waiting...");
                await utils.sleep(2000);
                _0x54665f = false;
                await _0x39ce02();
                return;
              }
            }
          } catch (_0x377cfb) {
            console.warn("Loading detection error (continuing anyway):", _0x377cfb);
          }
          _0x48c4b8 = "check-payment-method-selection";
          if (_0x345816()) {
            console.log("Payment method selection required.");
            await _0x35551a();
            await utils.sleep(200);
            _0x54665f = false;
            await _0x39ce02();
            return;
          } else {
            _0x48c4b8 = "check-cvv";
            if (finder.findElementWithSelectors(selectors.checkoutPageSelectors.cvvVerification.input)) {
              console.log("CVV input detected.");
              await _0x4e1108();
              await utils.sleep(200);
              await _0x551157();
            } else {
              _0x48c4b8 = "check-card-verify";
              if (finder.findElementWithSelectors(selectors.checkoutPageSelectors.cardVerification.input)) {
                console.log("Card verification input detected.");
                await _0x195f8d();
                await utils.sleep(200);
                await _0x551157();
              } else {
                _0x48c4b8 = "check-place-order";
                if (document.querySelector(selectors.checkoutPageSelectors.placeOrderButton)) {
                  console.log("Place Order button detected.");
                  await _0x551157();
                } else {
                  _0x48c4b8 = "check-payment-form";
                  if (finder.findElementWithSelectors(selectors.checkoutPageSelectors.paymentForm)) {
                    console.log("Payment form detected.");
                    await _0x42e9cd();
                    await utils.sleep(200);
                    await _0x551157();
                  } else {
                    _0x48c4b8 = "check-shipping-form";
                    if (finder.findElementWithSelectors(selectors.checkoutPageSelectors.shippingForm)) {
                      console.log("Shipping form detected.");
                      await _0x4e14d6();
                      await utils.sleep(200);
                      await _0x42e9cd();
                      await utils.sleep(200);
                      await _0x551157();
                    } else {
                      _0x48c4b8 = "fallback-check";
                      console.log("Could not determine specific checkout step, trying payment info fill as fallback.");
                      await _0x42e9cd();
                      await utils.sleep(200);
                      await _0x551157();
                    }
                  }
                }
              }
            }
          }
        } catch (_0x16779b) {
          _0x10d20f(_0x16779b);
        } finally {
          _0x54665f = false;
        }
      }
      async function _0x53d30c() {
        _0x48c4b8 = "set-quantity";
        const _0x40832b = _0x57a58e.quantity;
        if (_0x40832b <= 1) {
          console.log("Default quantity (1).");
          return;
        }
        utils.updateStatus("Setting quantity: " + _0x40832b, "status-running");
        const _0x1e2229 = selectors.productPageSelectors.quantity;
        const _0x1ea9d8 = document.querySelector(_0x1e2229.stepper.increment);
        const _0x19a01e = document.querySelector(_0x1e2229.stepper.decrement);
        const _0x75bb8e = document.querySelector(_0x1e2229.stepper.value);
        if (_0x1ea9d8 && _0x75bb8e) {
          console.log("Using quantity stepper.");
          const _0x20092f = parseInt(_0x75bb8e.textContent?.trim() || "1");
          const clicks = _0x40832b - _0x20092f;
          const _0x2934cf = clicks > 0 ? _0x1ea9d8 : clicks < 0 ? _0x19a01e : null;
          if (_0x2934cf) {
            for (let _0x3fc6cb = 0; _0x3fc6cb < Math.abs(clicks); _0x3fc6cb++) {
              if (finder.isElementDisabled(_0x2934cf)) {
                break;
              }
              await utils.clickElement(_0x2934cf, clicks > 0 ? "qty-inc" : "qty-dec");
              await utils.sleep(_0x374d73.randomizeDelay ? utils.sleep(10, true) : 10);
            }
          }
          await utils.sleep(10);
          return;
        }
        const _0x5eaa4c = finder.findElementWithSelectors(_0x1e2229.dropdown);
        if (_0x5eaa4c) {
          console.log("Using quantity dropdown.");
          console.log("Dropdown trigger element:", _0x5eaa4c.outerHTML.substring(0, 200));
          console.log("Dropdown trigger visible: " + finder.isElementVisible(_0x5eaa4c) + ", enabled: " + !finder.isElementDisabled(_0x5eaa4c));
          if (_0x5eaa4c.tagName === "SELECT") {
            const _0x50f939 = Array.from(_0x5eaa4c.options);
            const _0x1eb493 = _0x50f939.find(_0x2f21ca => _0x2f21ca.value === String(_0x40832b) || _0x2f21ca.textContent.trim() === String(_0x40832b));
            if (_0x1eb493 && _0x5eaa4c.value !== _0x1eb493.value) {
              _0x5eaa4c.value = _0x1eb493.value;
              _0x5eaa4c.dispatchEvent(new Event("change", {
                bubbles: true
              }));
              await utils.sleep(_0x374d73.randomizeDelay ? utils.sleep(10, true) : 10);
            } else if (!_0x1eb493) {
              console.warn("Qty " + _0x40832b + " not found.");
            }
          } else {
            console.log("Attempting to click dropdown trigger for quantity " + _0x40832b + "...");
            const clicked = await utils.clickElement(_0x5eaa4c, "qty-dd-trigger");
            console.log("Click result: " + clicked);
            await utils.sleep(_0x374d73.randomizeDelay ? utils.sleep(20, true) : 20);
            let _0x51bf2a = document.querySelectorAll(_0x1e2229.dropdownOptions);
            console.log("Found " + _0x51bf2a.length + " options with primary selector");
            if (_0x51bf2a.length === 0) {
              console.log("Trying generic dropdown selector...");
              _0x51bf2a = document.querySelectorAll(_0x1e2229.genericDropdownOptions);
              console.log("Found " + _0x51bf2a.length + " options with generic selector");
            }
            if (_0x51bf2a.length > 0) {
              const _0x4b29cc = Array.from(_0x51bf2a);
              console.log("Dropdown options found:", _0x4b29cc.map(_0x54f034 => _0x54f034.textContent?.trim() || _0x54f034.getAttribute("aria-label")));
              const _0x59d9e9 = _0x4b29cc.find(_0xf1e3e => (_0xf1e3e.textContent || _0xf1e3e.getAttribute("aria-label") || "").trim() === String(_0x40832b));
              if (_0x59d9e9) {
                console.log("Found target option for qty " + _0x40832b + ", clicking...");
                await utils.clickElement(_0x59d9e9, "qty-opt-" + _0x40832b);
                await utils.sleep(_0x374d73.randomizeDelay ? utils.sleep(10, true) : 10);
              } else {
                console.warn("Qty option " + _0x40832b + " not found in available options");
              }
            } else {
              console.warn("No dropdown options found after clicking trigger");
            }
          }
          return;
        }
        console.log("Quantity selector not found.");
      }
      async function _0x4a0400() {
        _0x48c4b8 = "add-to-cart";
        utils.updateStatus("Adding item to cart...", "status-running");
        await _0x53d30c();
        await utils.sleep(5);
        let _0x26e6b5 = null;
        let _0x187927 = "add-to-cart";
        let _0x570115 = 0;
        const _0x46cd11 = 5;
        const _0x4f019d = 10;
        const _0x45c58b = 3000;
        const _0x461f84 = Date.now();
        console.log("Waiting " + _0x46cd11 + "ms for page to settle before searching for button...");
        await utils.sleep(_0x46cd11);
        const _0x5796d8 = _0x45c58b - _0x46cd11;
        const _0x3aec12 = Math.floor(_0x5796d8 / _0x4f019d);
        const _0x329eaa = _0x3aec12 + 1;
        while (!_0x26e6b5 && _0x570115 < _0x329eaa) {
          _0x570115++;
          const _0x3010f1 = Date.now() - _0x461f84;
          console.log("Searching for add-to-cart/pre-order button, attempt " + _0x570115 + "/" + _0x329eaa + " (" + _0x3010f1 + "ms elapsed)");
          _0x26e6b5 = finder.findElementWithSelectors(selectors.productPageSelectors.addToCart);
          _0x187927 = "add-to-cart";
          if (!_0x26e6b5) {
            _0x26e6b5 = finder.findElementWithSelectors([selectors.productPageSelectors.preOrderButton]);
            if (_0x26e6b5) {
              _0x187927 = "pre-order";
            }
          }
          if (!_0x26e6b5 && _0x570115 < _0x329eaa) {
            const _0x1b1496 = Date.now() - _0x461f84 + _0x4f019d;
            if (_0x1b1496 >= _0x45c58b) {
              console.log("Time limit (" + _0x45c58b + "ms) would be exceeded, stopping retries at attempt " + _0x570115);
              break;
            }
            console.log("Button not found on attempt " + _0x570115 + "/" + _0x329eaa + ", retrying in " + _0x4f019d + "ms...");
            await utils.sleep(_0x4f019d);
          }
        }
        const _0x36c9d5 = Date.now() - _0x461f84;
        if (!_0x26e6b5) {
          throw new Error("Add to Cart/Pre-Order button not found after " + _0x570115 + " attempts (" + _0x36c9d5 + "ms elapsed).");
        }
        if (finder.isElementDisabled(_0x26e6b5)) {
          throw new Error("\"" + _0x26e6b5.textContent?.trim() + "\" button disabled.");
        }
        console.log("Found " + _0x187927 + " button on attempt " + _0x570115 + "/" + _0x329eaa + " (" + _0x36c9d5 + "ms total time)");
        const clicked = await utils.clickElement(_0x26e6b5, _0x187927);
        if (!clicked) {
          throw new Error("Failed to click \"" + _0x26e6b5.textContent?.trim() + "\" button.");
        }
      }
      function _0x2af097() {
        try {
          const _0x505c57 = finder.findElementWithSelectors(selectors.popupSelectors.errorPopupOkButton);
          if (_0x505c57 && finder.isElementVisible(_0x505c57)) {
            console.log("Found dismiss button using defined selectors");
            return _0x505c57;
          }
          const _0x158198 = ["ok", "dismiss", "try again", "continue", "close"];
          const _0x6a80e3 = Array.from(document.querySelectorAll("button"));
          for (const _0x5a698d of _0x6a80e3) {
            if (!finder.isElementVisible(_0x5a698d)) {
              continue;
            }
            const _0xd28da5 = (_0x5a698d.textContent || "").trim().toLowerCase();
            const _0x101e5f = (_0x5a698d.getAttribute("aria-label") || "").toLowerCase();
            for (const _0x282336 of _0x158198) {
              if (_0xd28da5 === _0x282336 || _0x101e5f.includes(_0x282336)) {
                console.log("Found dismiss button with text/aria-label: \"" + _0xd28da5 + "\" / \"" + _0x101e5f + "\"");
                return _0x5a698d;
              }
            }
          }
          const _0x1bc1b3 = document.querySelectorAll("[role=\"dialog\"], .modal, [class*=\"modal\"], [class*=\"popup\"], [class*=\"alert\"]");
          for (const _0x38f41c of _0x1bc1b3) {
            if (!finder.isElementVisible(_0x38f41c)) {
              continue;
            }
            const _0x296d76 = _0x38f41c.querySelectorAll("button");
            if (_0x296d76.length === 1) {
              const _0x3e7b19 = _0x296d76[0];
              if (finder.isElementVisible(_0x3e7b19)) {
                console.log("Found single button in modal container");
                return _0x3e7b19;
              }
            } else if (_0x296d76.length > 1) {
              for (const _0xc05a75 of _0x296d76) {
                if (!finder.isElementVisible(_0xc05a75)) {
                  continue;
                }
                const _0x4f10b4 = _0xc05a75.className || "";
                const _0x27b68d = _0x4f10b4.includes("primary") || _0x4f10b4.includes("filled") || _0x4f10b4.includes("default");
                if (_0x27b68d) {
                  console.log("Found primary button in modal container");
                  return _0xc05a75;
                }
              }
            }
          }
          console.log("No universal dismiss button found");
          return null;
        } catch (_0x18c82a) {
          console.warn("Error in findUniversalDismissButton:", _0x18c82a);
          return null;
        }
      }
      function _0x38235() {
        try {
          const _0x9ef0eb = ["busier than we expected", "high demand item in cart", "checkout is busy", "couldn't complete your order", "one or more items in your cart may no longer be available", "limiting how many guests can check out", "try again in a few moments", "please try again", "temporarily unavailable", "error occurred", "something went wrong"];
          const _0x3f709a = Array.from(document.querySelectorAll("*")).filter(_0x23da6b => _0x23da6b.textContent && _0x23da6b.textContent.trim().length > 0 && finder.isElementVisible(_0x23da6b));
          for (const _0x4aec45 of _0x3f709a) {
            const _0x355a15 = _0x4aec45.textContent.trim().toLowerCase();
            for (const _0x255833 of _0x9ef0eb) {
              if (_0x355a15.includes(_0x255833)) {
                console.log("Detected error message: \"" + _0x255833 + "\" in element:", _0x4aec45);
                return true;
              }
            }
          }
          return false;
        } catch (_0x435066) {
          console.warn("Error in detectErrorMessage:", _0x435066);
          return false;
        }
      }
      async function _0x4e771d() {
        _0x48c4b8 = "handle-popups";
        utils.updateStatus("Checking for popups...", "status-running");
        await utils.sleep(10);
        try {
          console.log("Enhanced popup check...");
          if (_0x38235()) {
            console.log("Error message detected, looking for dismiss button");
            const _0x34ef5f = _0x2af097();
            if (_0x34ef5f) {
              console.log("Found universal dismiss button, clicking to dismiss error");
              await utils.clickElement(_0x34ef5f, "universal-dismiss");
              await utils.sleep(20);
              return _0x4e771d();
            } else {
              console.warn("Error message found but no dismiss button located");
              const _0x5f0ff1 = finder.findElementWithSelectors(selectors.popupSelectors.errorPopupOkButton);
              if (_0x5f0ff1 && finder.isElementVisible(_0x5f0ff1)) {
                console.log("Found error popup OK button using fallback selectors");
                await utils.clickElement(_0x5f0ff1, "error-popup-ok-fallback");
                await utils.sleep(20);
                return _0x4e771d();
              }
            }
          }
          const _0x509d37 = [{
            element: finder.findElementWithSelectors(selectors.popupSelectors.declineProtectionButton),
            name: "decline-protection",
            description: "protection plan popup"
          }, {
            element: finder.findElementWithSelectors(selectors.popupSelectors.noThanksButton),
            name: "no-thanks",
            description: "no thanks button"
          }, {
            element: finder.findElementWithSelectors(selectors.popupSelectors.continueButton),
            name: "popup-continue",
            description: "continue button",
            additionalCheck: _0x2f707b => !_0x2f707b.closest("form")
          }];
          const _0x2ef42a = _0x509d37.find(_0x45eebf => _0x45eebf.element && finder.isElementVisible(_0x45eebf.element) && (!_0x45eebf.additionalCheck || _0x45eebf.additionalCheck(_0x45eebf.element)));
          if (_0x2ef42a) {
            console.log("Found " + _0x2ef42a.description + ", clicking it");
            await utils.clickElement(_0x2ef42a.element, _0x2ef42a.name);
            await utils.sleep(20);
            return _0x4e771d();
          } else {
            console.log("No popups detected, proceeding to checkout.");
            return;
          }
        } catch (_0x5a408d) {
          console.warn("Error handling popups, but continuing to checkout:", _0x5a408d);
        }
      }
      async function _0xf8554c(_0x366e40 = 5000) {
        console.log("Starting post-click popup monitoring for " + _0x366e40 + "ms");
        const _0x3c3bd8 = Date.now();
        while (Date.now() - _0x3c3bd8 < _0x366e40) {
          try {
            if (_0x38235()) {
              console.log("Post-click: Error message detected");
              const _0x4ee1d8 = _0x2af097();
              if (_0x4ee1d8) {
                console.log("Post-click: Dismissing error popup");
                await utils.clickElement(_0x4ee1d8, "post-click-dismiss");
                await utils.sleep(20);
                return true;
              }
            }
            const _0x56f4f3 = [{
              selectors: selectors.popupSelectors.declineProtectionButton,
              name: "decline-protection"
            }, {
              selectors: selectors.popupSelectors.noThanksButton,
              name: "no-thanks"
            }, {
              selectors: selectors.popupSelectors.continueButton,
              name: "popup-continue"
            }];
            for (const _0x421931 of _0x56f4f3) {
              const _0x2f7163 = finder.findElementWithSelectors(_0x421931.selectors);
              if (_0x2f7163 && finder.isElementVisible(_0x2f7163)) {
                console.log("Post-click: Found " + _0x421931.name + " popup");
                await utils.clickElement(_0x2f7163, "post-click-" + _0x421931.name);
                await utils.sleep(20);
                return true;
              }
            }
            await utils.sleep(10);
          } catch (_0x46254c) {
            console.warn("Error in post-click popup monitoring:", _0x46254c);
          }
        }
        console.log("Post-click popup monitoring completed - no popups found");
        return false;
      }
      async function _0x574041() {
        _0x48c4b8 = "go-to-checkout";
        utils.updateStatus("Navigating to checkout...", "status-running");
        console.log("Redirecting to checkout page now");
        window.location.href = "https://www.target.com/checkout";
      }
      async function _0x4e14d6() {
        _0x48c4b8 = "fill-shipping";
        utils.updateStatus("Checking shipping info...", "status-running");
        if (!_0x1e2eb9) {
          throw new Error("Profile missing for shipping.");
        }
        const _0x5e7fb8 = finder.findElementWithSelectors(selectors.checkoutPageSelectors.continueButtons.shipping);
        if (_0x5e7fb8 && finder.isElementVisible(_0x5e7fb8)) {
          console.log("Detected pre-filled shipping information, proceeding...");
          await utils.clickElement(_0x5e7fb8, "shipping-continue");
          await utils.sleep(100);
          return;
        }
        utils.updateStatus("Filling shipping info...", "status-running");
        const _0x21d579 = selectors.checkoutPageSelectors.shippingForm.join(", ");
        const _0x4d8a8f = await utils.waitForElement(_0x21d579, 5000);
        if (!_0x4d8a8f) {
          if (finder.findElementWithSelectors(selectors.checkoutPageSelectors.paymentForm) || document.querySelector(selectors.checkoutPageSelectors.placeOrderButton)) {
            console.log("Skipping shipping, already past shipping step.");
            return;
          } else {
            console.log("Shipping form not found, assuming shipping is handled.");
            return;
          }
        }
        const _0x56e08d = selectors.checkoutPageSelectors.shippingFields;
        const _0x2636ff = _0x1e2eb9;
        await finder.fillFieldBySelectors(_0x56e08d.firstName, _0x2636ff.firstName);
        await utils.sleep(10);
        await finder.fillFieldBySelectors(_0x56e08d.lastName, _0x2636ff.lastName);
        await utils.sleep(10);
        await finder.fillFieldBySelectors(_0x56e08d.address1, _0x2636ff.address1);
        await utils.sleep(10);
        if (_0x2636ff.address2) {
          await finder.fillFieldBySelectors(_0x56e08d.address2, _0x2636ff.address2);
          await utils.sleep(10);
        }
        await finder.fillFieldBySelectors(_0x56e08d.city, _0x2636ff.city);
        await utils.sleep(10);
        await finder.fillFieldBySelectors(_0x56e08d.state, _0x2636ff.state);
        await utils.sleep(10);
        await finder.fillFieldBySelectors(_0x56e08d.zip, _0x2636ff.zip);
        await utils.sleep(10);
        await finder.fillFieldBySelectors(_0x56e08d.phone, _0x2636ff.phone);
        await utils.sleep(10);
        if (_0x56e08d.email && finder.findElementWithSelectors(_0x56e08d.email)) {
          await finder.fillFieldBySelectors(_0x56e08d.email, _0x2636ff.email);
          await utils.sleep(30);
        }
        const _0x3a25d3 = finder.findElementWithSelectors(selectors.checkoutPageSelectors.continueButtons.shipping);
        if (_0x3a25d3 && finder.isElementVisible(_0x3a25d3)) {
          await utils.clickElement(_0x3a25d3, "shipping-continue");
          await utils.sleep(20);
        } else {
          console.warn("Shipping continue button not found/visible");
        }
      }
      async function _0x42e9cd() {
        _0x48c4b8 = "fill-payment";
        utils.updateStatus("Filling payment info...", "status-running");
        if (!_0x1e2eb9) {
          throw new Error("Profile missing for payment.");
        }
        if (!_0x1e2eb9.paymentMethod) {
          console.log("No payment method in profile, skipping.");
          return;
        }
        const _0x42f2e5 = finder.findElementWithSelectors(selectors.checkoutPageSelectors.addPaymentButton);
        if (_0x42f2e5 && finder.isElementVisible(_0x42f2e5)) {
          await utils.clickElement(_0x42f2e5, "add-payment");
          await utils.sleep(50);
        }
        const _0x3831ad = selectors.checkoutPageSelectors.paymentForm.join(", ");
        const _0x42f52f = await utils.waitForElement(_0x3831ad, 6000);
        if (!_0x42f52f) {
          console.log("Payment form not found, may be already filled.");
          return;
        }
        const _0xb8c11f = document.querySelector(selectors.checkoutPageSelectors.cardNumberFrame.join(", "));
        if (_0xb8c11f) {
          console.log("Detected card input iframe, using special handling");
          return;
        }
        const _0x47ef0a = selectors.checkoutPageSelectors.paymentFields;
        const _0x4a49a3 = _0x1e2eb9.paymentMethod;
        await finder.fillFieldBySelectors(_0x47ef0a.cardNumber, _0x4a49a3.cardNumber);
        await utils.sleep(50);
        await finder.fillFieldBySelectors(_0x47ef0a.nameOnCard, _0x4a49a3.nameOnCard || _0x1e2eb9.firstName + " " + _0x1e2eb9.lastName);
        await utils.sleep(50);
        await finder.fillFieldBySelectors(_0x47ef0a.expiryMonth, _0x4a49a3.expiryMonth);
        await utils.sleep(30);
        await finder.fillFieldBySelectors(_0x47ef0a.expiryYear, _0x4a49a3.expiryYear);
        await utils.sleep(30);
        await finder.fillFieldBySelectors(_0x47ef0a.cvv, _0x4a49a3.cvv);
        await utils.sleep(50);
      }
      async function _0x4e1108() {
        if (_0x490f2a || _0x3959fe) {
          return;
        }
        _0x48c4b8 = "handle-cvv";
        utils.updateStatus("Confirming CVV...", "status-running");
        _0x490f2a = true;
        try {
          const _0x4b2911 = window.location.href;
          const _0x3eb2ce = _0x4b2911.includes("/account/signin") || _0x4b2911.includes("/login");
          const _0x2a44ab = _0x4b2911.includes("/checkout");
          if (_0x3eb2ce) {
            console.log("Detected login page context - skipping CVV handling to avoid password field confusion");
            return;
          }
          if (!_0x2a44ab) {
            console.log("Not on checkout page - validating CVV context carefully");
            const _0x315d3b = finder.findElementWithSelectors(selectors.loginPageSelectors.loginForm);
            if (_0x315d3b && finder.isElementVisible(_0x315d3b)) {
              console.log("Login form detected - skipping CVV handling to prevent password field targeting");
              return;
            }
          }
          await _0x51e9d3();
          let _0x34827d = null;
          if (_0x1e2eb9?.cvv) {
            console.log("Using CVV from direct profile property");
            _0x34827d = _0x1e2eb9.cvv;
          } else if (_0x1e2eb9?.paymentMethod?.cvv) {
            console.log("Using CVV from profile.paymentMethod structure");
            _0x34827d = _0x1e2eb9.paymentMethod.cvv;
          } else if (_0x1e2eb9?.payment?.cvv) {
            console.log("Using CVV from profile.payment structure");
            _0x34827d = _0x1e2eb9.payment.cvv;
          }
          if (!_0x34827d) {
            console.warn("No CVV found in profile (checked all structures), can't complete CVV verification");
            console.log("Profile data available for CVV verification:", {
              hasDirectCVV: !!_0x1e2eb9?.cvv,
              hasPaymentMethod: !!_0x1e2eb9?.paymentMethod,
              hasPayment: !!_0x1e2eb9?.payment,
              profileKeys: _0x1e2eb9 ? Object.keys(_0x1e2eb9) : []
            });
            return;
          }
          const _0x2010a3 = finder.findElementWithSelectors(selectors.checkoutPageSelectors.cvvVerification.input);
          if (!_0x2010a3 || !finder.isElementVisible(_0x2010a3)) {
            console.log("CVV input not visible, skipping.");
            return;
          }
          const _0x15d156 = _0x2010a3.id || "";
          const _0x3b530e = _0x2010a3.name || "";
          const _0x3a8b74 = _0x2010a3.placeholder || "";
          const _0x32f891 = _0x2010a3.getAttribute("aria-label") || "";
          const _0x491d4a = _0x2010a3.type || "";
          console.log("CVV field validation:", {
            id: _0x15d156,
            name: _0x3b530e,
            placeholder: _0x3a8b74,
            ariaLabel: _0x32f891,
            type: _0x491d4a,
            element: _0x2010a3.outerHTML.substring(0, 200)
          });
          if (_0x491d4a === "password" && (_0x3b530e.toLowerCase().includes("password") || _0x3a8b74.toLowerCase().includes("password") || _0x32f891.toLowerCase().includes("password"))) {
            console.log("SAFETY CHECK: Field appears to be a password field, not CVV - aborting to prevent login credential confusion");
            return;
          }
          const _0x272ae6 = _0x2010a3.closest("form")?.querySelectorAll("input[type=\"email\"], input[placeholder*=\"email\"], input[placeholder*=\"username\"]");
          if (_0x272ae6 && _0x272ae6.length > 0) {
            console.log("SAFETY CHECK: Found email/username fields nearby, this might be a login form - aborting CVV fill");
            return;
          }
          console.log("Field validation passed - proceeding with CVV fill");
          await utils.fillField(_0x2010a3, _0x34827d, "cvv-verification");
          await utils.sleep(20);
          const _0x3cb0e5 = finder.findElementWithSelectors(selectors.checkoutPageSelectors.cvvVerification.confirmButton);
          if (_0x3cb0e5 && finder.isElementVisible(_0x3cb0e5) && !finder.isElementDisabled(_0x3cb0e5)) {
            if (_0x3959fe) {
              console.log("CVV confirm already clicked, skipping.");
              return;
            }
            console.log("Clicking CVV confirm button");
            _0x3959fe = true;
            await utils.clickElement(_0x3cb0e5, "cvv-confirm");
            await utils.sleep(50);
          } else {
            console.warn("CVV confirm button not found/usable");
          }
        } catch (_0x4678ab) {
          console.error("Error in handleCVVConfirmation:", _0x4678ab);
        } finally {
          _0x490f2a = false;
        }
      }
      async function _0x195f8d() {
        if (_0x1e1acc || _0x42ab65) {
          return;
        }
        _0x48c4b8 = "handle-card-verification";
        utils.updateStatus("Verifying card...", "status-running");
        _0x1e1acc = true;
        try {
          await _0x51e9d3();
          let _0x36093d = null;
          if (_0x1e2eb9) {
            if (_0x1e2eb9.cardNumber) {
              console.log("Found card number directly in profile");
              _0x36093d = _0x1e2eb9.cardNumber;
            } else if (_0x1e2eb9.paymentMethod && _0x1e2eb9.paymentMethod.cardNumber) {
              console.log("Found card number in profile.paymentMethod");
              _0x36093d = _0x1e2eb9.paymentMethod.cardNumber;
            }
          }
          if (!_0x36093d) {
            console.warn("No card number found in profile (checked both direct and nested structures)");
            utils.updateStatus("Error: Missing card number in profile", "status-waiting");
            _0x1e1acc = false;
            return;
          }
          let _0x2d38dc = document.querySelector("#credit-card-number-input");
          if (!_0x2d38dc) {
            console.log("Direct selector didn't find card input, trying alternate methods");
            _0x2d38dc = finder.findElementWithSelectors(selectors.checkoutPageSelectors.cardVerification.input);
          }
          if (!_0x2d38dc) {
            console.log("Still no card input found, trying type selector");
            _0x2d38dc = document.querySelector("input[type=\"tel\"]");
          }
          if (!_0x2d38dc || !finder.isElementVisible(_0x2d38dc)) {
            console.log("Card input not visible after multiple attempts, skipping verification.");
            return;
          }
          console.log("Found card input field, filling with card number:", _0x1e2eb9.cardNumber);
          _0x2d38dc.focus();
          await utils.sleep(50);
          _0x2d38dc.value = "";
          _0x2d38dc.dispatchEvent(new Event("input", {
            bubbles: true
          }));
          await utils.sleep(50);
          await utils.fillField(_0x2d38dc, _0x1e2eb9.cardNumber, "card-verification");
          console.log("Card number filled:", _0x2d38dc.value ? "Yes" : "No");
          await utils.sleep(20);
          let _0x1b297f = finder.findElementWithSelectors(selectors.checkoutPageSelectors.cardVerification.verifyButton);
          if (!_0x1b297f) {
            _0x1b297f = document.querySelector("button[data-test=\"verify-card-button\"]");
          }
          if (!_0x1b297f) {
            const _0x491ff2 = Array.from(document.querySelectorAll("button"));
            _0x1b297f = _0x491ff2.find(_0x3d506c => (_0x3d506c.textContent || "").toLowerCase().includes("verify"));
          }
          if (_0x1b297f && finder.isElementVisible(_0x1b297f) && !finder.isElementDisabled(_0x1b297f)) {
            if (_0x42ab65) {
              console.log("Verify card already clicked, skipping.");
              return;
            }
            console.log("Clicking verify card button");
            _0x42ab65 = true;
            await utils.clickElement(_0x1b297f, "verify-card");
            await utils.sleep(50);
          } else {
            console.warn("Verify card button not found/usable");
          }
        } catch (_0x3315b6) {
          console.error("Error in handleCreditCardConfirmation:", _0x3315b6);
        } finally {
          _0x1e1acc = false;
        }
      }
      function _0xb3388d() {
        try {
          const _0x562980 = document.querySelector("#password");
          const _0x1a25a1 = document.querySelector("#username") || document.querySelector("input[type=\"email\"]");
          const _0x4eac3b = document.querySelector("#keepMeSignedIn");
          if (_0x562980 && _0x1a25a1 && finder.isElementVisible(_0x562980) && finder.isElementVisible(_0x1a25a1)) {
            console.log("Login modal detected: Both username and password fields visible");
            return true;
          }
          if (_0x4eac3b && finder.isElementVisible(_0x4eac3b)) {
            console.log("Login modal detected: Keep me signed in checkbox found");
            return true;
          }
          return false;
        } catch (_0x3c95ee) {
          console.warn("Error checking for login modal:", _0x3c95ee);
          return false;
        }
      }
      async function _0x24cead() {
        const _0x572ce0 = Date.now();
        if (_0x572ce0 - _0x5e0334 < _0x44abf7) {
          const _0x5a5874 = _0x44abf7 - (_0x572ce0 - _0x5e0334);
          console.log("Login modal: In cooldown period, " + _0x5a5874 + "ms remaining");
          return;
        }
        if (_0x17cb02) {
          console.log("Login modal already handled successfully this session, skipping");
          return;
        }
        if (_0x248029 >= _0x4ffcd0) {
          console.log("Login modal: Maximum attempts (" + _0x4ffcd0 + ") reached, giving up");
          utils.updateStatus("Login failed after multiple attempts", "status-waiting");
          return;
        }
        if (_0x2973fa) {
          console.log("Already handling login modal, skipping to prevent infinite loop");
          return;
        }
        _0x5e0334 = _0x572ce0;
        _0x248029++;
        _0x2973fa = true;
        _0x48c4b8 = "handle-login-modal";
        utils.updateStatus("Handling login modal (attempt " + _0x248029 + "/" + _0x4ffcd0 + ")...", "status-running");
        try {
          console.log("Login modal detected during checkout, attempting auto-login (attempt " + _0x248029 + "/" + _0x4ffcd0 + ")");
          const _0x2d4eb6 = await storage.getFromStorage(["globalSettings", "targetEmail", "targetPassword"]);
          const _0x15315b = _0x2d4eb6.globalSettings?.autoLogin === true;
          if (!_0x15315b) {
            console.log("Auto-login is disabled, cannot handle login modal");
            utils.updateStatus("Login modal detected but auto-login disabled", "status-waiting");
            return;
          }
          const _0x3d3ac2 = _0x2d4eb6.targetEmail;
          const _0x1e49ae = _0x2d4eb6.targetPassword;
          if (!_0x3d3ac2 || !_0x1e49ae) {
            console.log("Target credentials not found, cannot handle login modal");
            utils.updateStatus("Login modal detected but no credentials", "status-waiting");
            return;
          }
          const _0x523400 = document.querySelector("#username") || document.querySelector("input[type=\"email\"]");
          if (_0x523400 && finder.isElementVisible(_0x523400)) {
            const _0x37e221 = _0x523400.value.trim();
            if (!_0x37e221 || _0x37e221 === "") {
              console.log("Filling username field in login modal");
              await utils.fillField(_0x523400, _0x3d3ac2, "login-modal-username");
              let _0x34ec1f = 0;
              while (_0x523400.value.trim() !== _0x3d3ac2 && _0x34ec1f < 3) {
                await utils.sleep(30);
                await utils.fillField(_0x523400, _0x3d3ac2, "login-modal-username-retry");
                _0x34ec1f++;
              }
              if (_0x523400.value.trim() === _0x3d3ac2) {
                console.log("Username field verification successful");
              } else {
                console.warn("Failed to fill username field after 3 attempts");
              }
              await utils.sleep(50);
            } else {
              console.log("Username field appears to be pre-filled, skipping username fill");
            }
          }
          const _0x1f261d = document.querySelector("#password") || document.querySelector("[data-test=\"login-password\"]");
          if (_0x1f261d && finder.isElementVisible(_0x1f261d)) {
            console.log("Filling password field in login modal");
            await utils.fillField(_0x1f261d, _0x1e49ae, "login-modal-password");
            let _0x778183 = 0;
            while (_0x1f261d.value !== _0x1e49ae && _0x778183 < 3) {
              await utils.sleep(30);
              await utils.fillField(_0x1f261d, _0x1e49ae, "login-modal-password-retry");
              _0x778183++;
            }
            if (_0x1f261d.value === _0x1e49ae) {
              console.log("Password field verification successful");
            } else {
              console.warn("Failed to fill password field after 3 attempts");
            }
            await utils.sleep(50);
          } else {
            console.warn("Password field not found in login modal");
            return;
          }
          const _0x3bfee2 = document.querySelector("#keepMeSignedIn");
          if (_0x3bfee2 && finder.isElementVisible(_0x3bfee2)) {
            if (!_0x3bfee2.checked) {
              console.log("Checking 'Keep me signed in' checkbox in login modal (CRITICAL for session persistence)");
              _0x3bfee2.checked = true;
              _0x3bfee2.dispatchEvent(new Event("change", {
                bubbles: true
              }));
              _0x3bfee2.dispatchEvent(new Event("click", {
                bubbles: true
              }));
              let _0x594f6c = 0;
              while (!_0x3bfee2.checked && _0x594f6c < 5) {
                await utils.sleep(30);
                _0x3bfee2.checked = true;
                _0x3bfee2.dispatchEvent(new Event("change", {
                  bubbles: true
                }));
                _0x3bfee2.dispatchEvent(new Event("click", {
                  bubbles: true
                }));
                _0x594f6c++;
              }
              if (_0x3bfee2.checked) {
                console.log("✓ Keep me signed in checkbox successfully checked - session should persist");
              } else {
                console.error("✗ FAILED to check 'Keep me signed in' checkbox after 5 attempts - session may not persist!");
              }
            } else {
              console.log("✓ Keep me signed in checkbox already checked");
            }
            await utils.sleep(50);
          } else {
            console.warn("Keep me signed in checkbox not found - session persistence may be limited");
          }
          const _0x2238a8 = document.querySelector("#keepMeSignedIn");
          const _0x1e78e9 = document.querySelector("#username") || document.querySelector("input[type=\"email\"]");
          const _0x43f50f = document.querySelector("#password") || document.querySelector("[data-test=\"login-password\"]");
          let _0x3920c6 = true;
          if (_0x2238a8 && finder.isElementVisible(_0x2238a8)) {
            if (!_0x2238a8.checked) {
              console.warn("Final verification: Checkbox not checked");
              _0x3920c6 = false;
            }
          }
          if (_0x1e78e9 && finder.isElementVisible(_0x1e78e9)) {
            const _0x48427f = _0x1e78e9.value.trim();
            if (!_0x48427f) {
              console.warn("Final verification: Username field is empty");
              _0x3920c6 = false;
            }
          }
          if (_0x43f50f && finder.isElementVisible(_0x43f50f)) {
            if (!_0x43f50f.value) {
              console.warn("Final verification: Password field is empty");
              _0x3920c6 = false;
            }
          }
          if (!_0x3920c6) {
            console.error("Final verification failed - not all fields are properly filled");
            utils.updateStatus("Login form verification failed", "status-waiting");
            return;
          }
          console.log("All field verifications passed, proceeding with sign in");
          const _0x4376d0 = document.querySelector("#login") || document.querySelector("button[type=\"submit\"]");
          if (_0x4376d0 && finder.isElementVisible(_0x4376d0) && !finder.isElementDisabled(_0x4376d0)) {
            console.log("Clicking sign in button in login modal");
            utils.updateStatus("Signing in during checkout...", "status-running");
            await utils.clickElement(_0x4376d0, "login-modal-submit");
            await utils.sleep(300);
            const _0x38b484 = document.querySelector("#password") && finder.isElementVisible(document.querySelector("#password"));
            if (!_0x38b484) {
              console.log("Login modal disappeared - login appears successful");
              utils.updateStatus("Login successful, continuing checkout...", "status-running");
              _0x17cb02 = true;
              console.log("Marked login modal as handled for this session");
              _0x54665f = false;
              setTimeout(() => {
                _0x39ce02().catch(_0x10d20f);
              }, 200);
            } else {
              console.log("Login modal still visible - checking for errors");
              const _0x23044d = document.querySelectorAll(".error-message, [role=\"alert\"], [class*=\"error\"]");
              if (_0x23044d.length > 0) {
                const _0x4f2b73 = Array.from(_0x23044d).map(_0x53a76d => _0x53a76d.textContent.trim()).join("; ");
                console.log("Login error in modal:", _0x4f2b73);
                utils.updateStatus("Login failed in modal: " + _0x4f2b73, "status-waiting");
              } else {
                console.log("Login modal still visible but no obvious errors");
                utils.updateStatus("Login modal result unclear", "status-waiting");
              }
            }
          } else {
            console.warn("Sign in button not found/usable in login modal");
            utils.updateStatus("Cannot submit login in modal", "status-waiting");
          }
        } catch (_0x2a1349) {
          console.error("Error handling login modal:", _0x2a1349);
          utils.updateStatus("Login modal error: " + _0x2a1349.message, "status-waiting");
        } finally {
          _0x2973fa = false;
        }
      }
      function _0x345816() {
        try {
          const _0x27c0a2 = document.querySelectorAll("*");
          for (const _0x371e35 of _0x27c0a2) {
            const _0x854b61 = _0x371e35.textContent || "";
            if (_0x854b61.toLowerCase().includes("select payment type")) {
              console.log("Found 'select payment type' text in element:", _0x371e35);
              return true;
            }
          }
          return false;
        } catch (_0x198011) {
          console.warn("Error checking for payment method selection:", _0x198011);
          return false;
        }
      }
      async function _0x35551a() {
        _0x48c4b8 = "select-payment-method";
        utils.updateStatus("Selecting payment method...", "status-running");
        try {
          console.log("Handling payment method selection");
          let _0x415c83 = null;
          const _0x4fd1b4 = selectors.checkoutPageSelectors.paymentMethodSelection.firstPaymentRadio;
          for (const _0x34b437 of _0x4fd1b4) {
            _0x415c83 = document.querySelector(_0x34b437);
            if (_0x415c83 && finder.isElementVisible(_0x415c83)) {
              console.log("Found first payment radio using selector: " + _0x34b437);
              break;
            }
          }
          if (!_0x415c83) {
            const _0x3dd85c = selectors.checkoutPageSelectors.paymentMethodSelection.paymentRadioButtons;
            for (const _0x56f1cd of _0x3dd85c) {
              const _0x5badc7 = document.querySelectorAll(_0x56f1cd);
              if (_0x5badc7.length > 0) {
                _0x415c83 = _0x5badc7[0];
                console.log("Found payment radio using fallback selector: " + _0x56f1cd);
                break;
              }
            }
          }
          if (!_0x415c83) {
            const _0xc8a487 = document.querySelectorAll("input[type=\"radio\"]");
            for (const _0x4f3ca3 of _0xc8a487) {
              const _0x4626f6 = _0x4f3ca3.name || "";
              const _0x1a1cbd = _0x4f3ca3.getAttribute("data-test") || "";
              if (_0x4626f6.includes("payment") || _0x1a1cbd.includes("payment")) {
                _0x415c83 = _0x4f3ca3;
                console.log("Found payment radio using final fallback");
                break;
              }
            }
          }
          if (!_0x415c83) {
            console.warn("No payment method radio button found");
            return;
          }
          if (!_0x415c83.checked) {
            console.log("Selecting first payment method radio button");
            _0x415c83.checked = true;
            _0x415c83.dispatchEvent(new Event("change", {
              bubbles: true
            }));
            _0x415c83.dispatchEvent(new Event("click", {
              bubbles: true
            }));
            await utils.sleep(200);
            console.log("Payment method selected successfully");
          } else {
            console.log("Payment method already selected");
          }
        } catch (_0x503fef) {
          console.error("Error in handlePaymentMethodSelection:", _0x503fef);
          utils.updateStatus("Error selecting payment method", "status-waiting");
        }
      }
      function _0x5edb78() {
        try {
          const _0x429969 = document.querySelector(".styles_content__WBF0i");
          if (_0x429969) {
            const _0x10ef6a = _0x429969.textContent.trim();
            if (_0x10ef6a.includes("limiting how many guests can check out due to high demand")) {
              console.log("High demand message detected: " + _0x10ef6a);
              return true;
            }
          }
          const _0x696a2 = Array.from(document.querySelectorAll(".error, .error-message, [class*=\"error\"], [class*=\"Error\"], [class*=\"content\"]"));
          for (const _0x268fa6 of _0x696a2) {
            const _0x7eb384 = _0x268fa6.textContent.trim();
            if (_0x7eb384.includes("high demand") || _0x7eb384.includes("limiting") && _0x7eb384.includes("try") && _0x7eb384.includes("soon")) {
              console.log("High demand error message found via fallback: " + _0x7eb384);
              return true;
            }
          }
          return false;
        } catch (_0x5c003e) {
          console.warn("Error checking for high demand message:", _0x5c003e);
          return false;
        }
      }
      function _0xf35da2() {
        try {
          const _0x2a620a = ["We couldn't complete your order", "Couldn't complete your order", "One or more items in your cart may no longer be available"];
          const _0x370fa9 = document.querySelector(".styles_ndsAlertWarning__Hw0m1");
          if (_0x370fa9) {
            const _0x5467da = _0x370fa9.textContent.trim();
            console.log("Found warning alert with text:", _0x5467da);
            for (const _0x5afbbf of _0x2a620a) {
              if (_0x5467da.includes(_0x5afbbf)) {
                console.log("\"We couldn't complete your order\" error detected: " + _0x5afbbf);
                return true;
              }
            }
          }
          const _0x7c1de6 = Array.from(document.querySelectorAll("*"));
          for (const _0x53f3de of _0x7c1de6) {
            const _0x310f56 = _0x53f3de.textContent.trim();
            for (const _0x5b64ed of _0x2a620a) {
              if (_0x310f56.includes(_0x5b64ed)) {
                console.log("Order completion error found: \"" + _0x5b64ed + "\" in element:", _0x53f3de);
                return true;
              }
            }
          }
          return false;
        } catch (_0x28c200) {
          console.warn("Error checking for order completion error:", _0x28c200);
          return false;
        }
      }
      async function _0x551157() {
        _0x48c4b8 = "place-order";
        if (!_0x374d73.autoSubmit) {
          utils.updateStatus("Order ready - Submit disabled", "status-complete");
          console.log("Auto-submit disabled, stopping at final review.");
          return;
        }
        utils.updateStatus("Placing order...", "status-running");
        if (_0x5edb78()) {
          console.log("High demand message detected, will auto-retry every 2 seconds (max 10 attempts)");
          utils.updateStatus("High demand message detected - auto-retrying...", "status-running");
          if (!window.highDemandRetryInterval) {
            let _0x365fff = 0;
            const _0x1e4a05 = 10;
            window.highDemandRetryInterval = setInterval(() => {
              try {
                _0x365fff++;
                console.log("Auto-retrying place order due to high demand (attempt " + _0x365fff + "/" + _0x1e4a05 + ")...");
                if (_0x365fff >= _0x1e4a05) {
                  console.log("High demand retry limit reached (10 attempts), stopping auto-retry");
                  utils.updateStatus("High demand retry limit reached - please try manually", "status-waiting");
                  clearInterval(window.highDemandRetryInterval);
                  window.highDemandRetryInterval = null;
                  return;
                }
                const _0x2c0233 = document.querySelector(selectors.checkoutPageSelectors.placeOrderButton);
                if (_0x2c0233 && finder.isElementVisible(_0x2c0233)) {
                  _0x31ff88 = false;
                  utils.clickElement(_0x2c0233, "high-demand-retry");
                  _0x31ff88 = true;
                }
                if (!_0x5edb78()) {
                  console.log("High demand message no longer detected, clearing retry interval");
                  clearInterval(window.highDemandRetryInterval);
                  window.highDemandRetryInterval = null;
                }
              } catch (_0x742e8a) {
                console.error("Error in high demand retry interval:", _0x742e8a);
              }
            }, 2000);
            _0x337d31.push(window.highDemandRetryInterval);
          }
        }
        if (_0xf35da2()) {
          console.log("Order completion error detected, will auto-retry every 2 seconds (max 10 attempts)");
          utils.updateStatus("Order completion error detected - auto-retrying...", "status-running");
          if (!window.orderCompletionRetryInterval) {
            let _0x17bdc0 = 0;
            const _0x52ff61 = 10;
            window.orderCompletionRetryInterval = setInterval(() => {
              try {
                _0x17bdc0++;
                console.log("Auto-retrying place order due to order completion error (attempt " + _0x17bdc0 + "/" + _0x52ff61 + ")...");
                if (_0x17bdc0 >= _0x52ff61) {
                  console.log("Order completion error retry limit reached (10 attempts), stopping auto-retry");
                  utils.updateStatus("Order completion error retry limit reached - please try manually", "status-waiting");
                  clearInterval(window.orderCompletionRetryInterval);
                  window.orderCompletionRetryInterval = null;
                  return;
                }
                const _0x10821b = finder.findElementWithSelectors(selectors.popupSelectors.errorPopupOkButton);
                if (_0x10821b && finder.isElementVisible(_0x10821b)) {
                  console.log("Dismissing order completion error popup before retrying");
                  utils.clickElement(_0x10821b, "dismiss-order-error");
                  setTimeout(() => {
                    const _0x54c1e2 = document.querySelector(selectors.checkoutPageSelectors.placeOrderButton);
                    if (_0x54c1e2 && finder.isElementVisible(_0x54c1e2)) {
                      _0x31ff88 = false;
                      utils.clickElement(_0x54c1e2, "order-completion-retry");
                      _0x31ff88 = true;
                    }
                  }, 500);
                } else {
                  const _0x54dce8 = document.querySelector(selectors.checkoutPageSelectors.placeOrderButton);
                  if (_0x54dce8 && finder.isElementVisible(_0x54dce8)) {
                    _0x31ff88 = false;
                    utils.clickElement(_0x54dce8, "order-completion-retry");
                    _0x31ff88 = true;
                  }
                }
                if (!_0xf35da2()) {
                  console.log("Order completion error no longer detected, clearing retry interval");
                  clearInterval(window.orderCompletionRetryInterval);
                  window.orderCompletionRetryInterval = null;
                }
              } catch (_0x35a4ae) {
                console.error("Error in order completion retry interval:", _0x35a4ae);
              }
            }, 2000);
            _0x337d31.push(window.orderCompletionRetryInterval);
          }
        }
        const _0x31f27a = finder.findElementWithSelectors(selectors.checkoutPageSelectors.cvvVerification.input);
        if (_0x31f27a) {
          console.log("CVV confirmation required before placing order");
          _0x31ff88 = false;
          await _0x4e1108();
          return;
        }
        const _0x48de4a = finder.findElementWithSelectors(selectors.checkoutPageSelectors.cardVerification.input);
        if (_0x48de4a) {
          console.log("Card verification required before placing order");
          _0x31ff88 = false;
          await _0x195f8d();
          return;
        }
        const _0x373c53 = finder.findElementWithSelectors(selectors.checkoutPageSelectors.termsCheckbox);
        if (_0x373c53 && finder.isElementVisible(_0x373c53) && !_0x373c53.checked) {
          _0x373c53.checked = true;
          _0x373c53.dispatchEvent(new Event("change", {
            bubbles: true
          }));
          await utils.sleep(100);
        }
        const _0x4c8c27 = document.querySelector(selectors.checkoutPageSelectors.placeOrderButton);
        if (!_0x4c8c27) {
          console.warn("Place order button not found");
          return;
        }
        if (!finder.isElementVisible(_0x4c8c27)) {
          console.warn("Place order button not visible");
          return;
        }
        if (finder.isElementDisabled(_0x4c8c27)) {
          console.warn("Place order button is disabled");
          const _0x14d143 = finder.findElementWithSelectors(selectors.checkoutPageSelectors.continueButtons.saveAndContinue);
          if (_0x14d143 && finder.isElementVisible(_0x14d143) && !finder.isElementDisabled(_0x14d143)) {
            console.log("Found 'Save and continue' button when place order button is disabled");
            utils.updateStatus("Continuing checkout steps...", "status-running");
            await utils.clickElement(_0x14d143, "save-and-continue");
            await utils.sleep(200);
            _0x31ff88 = false;
            return;
          }
          return;
        }
        if (_0x31ff88) {
          console.log("Place order already clicked, avoiding duplicate click.");
          return;
        }
        _0x31ff88 = true;
        utils.updateStatus("Submitting order...", "status-running");
        await utils.clickElement(_0x4c8c27, "place-order");
        console.log("Monitoring for post-click popups and responses...");
        const _0x43b5ea = await _0xf8554c(3000);
        if (_0x43b5ea) {
          console.log("Post-click popup was handled, resetting flags for potential retry");
          _0x31ff88 = false;
          _0x3959fe = false;
          _0x42ab65 = false;
          await utils.sleep(200);
          const _0x22acc8 = document.querySelector(selectors.checkoutPageSelectors.placeOrderButton);
          if (_0x22acc8 && finder.isElementVisible(_0x22acc8) && !finder.isElementDisabled(_0x22acc8)) {
            console.log("Retrying place order after popup dismissal");
            await _0x551157();
            return;
          }
        }
        await utils.sleep(300);
        const _0x5afbce = finder.findElementWithSelectors(selectors.checkoutPageSelectors.cvvVerification.input);
        if (_0x5afbce) {
          console.log("CVV verification required after placing order");
          _0x3959fe = false;
          _0x31ff88 = false;
          await _0x4e1108();
          await utils.sleep(200);
          await _0x551157();
          return;
        }
        const _0x3fb6c0 = finder.findElementWithSelectors(selectors.checkoutPageSelectors.cardVerification.input);
        if (_0x3fb6c0) {
          console.log("Card verification required after placing order");
          _0x42ab65 = false;
          _0x31ff88 = false;
          await _0x195f8d();
          await utils.sleep(200);
          await _0x551157();
          return;
        }
      }
      function _0x68c4cb() {
        console.log("Setting up checkout page observers (Refined)");
        _0x2d6471.forEach(_0x475b3a => {
          if (_0x475b3a && _0x475b3a.disconnect) {
            _0x475b3a.disconnect();
          }
        });
        _0x2d6471 = [];
        _0x337d31.forEach(_0x38fc02 => clearInterval(_0x38fc02));
        _0x337d31 = [];
        _0x31ff88 = false;
        _0x3959fe = false;
        _0x42ab65 = false;
        _0x1e1acc = false;
        _0x490f2a = false;
        const _0x28c659 = new MutationObserver(_0x2a0f69 => {
          if (!_0x2ff9f4 || _0x490f2a || _0x1e1acc) {
            return;
          }
          const _0x21863b = window.location.href;
          const _0x4d5c5 = _0x21863b.includes("/account/signin") || _0x21863b.includes("/login");
          if (_0x4d5c5) {
            console.log("Observer: Login page detected - skipping to prevent field confusion");
            return;
          }
          try {
            if (_0x38235()) {
              console.log("Observer: Error message detected, handling immediately");
              const _0x25556f = _0x2af097();
              if (_0x25556f) {
                console.log("Observer: Dismissing error popup immediately");
                utils.clickElement(_0x25556f, "observer-error-dismiss").catch(_0x124b1a => console.error("Observer error dismiss error:", _0x124b1a));
                return;
              }
            }
          } catch (_0x1a461e) {
            console.warn("Observer: Error checking for error popups:", _0x1a461e);
          }
          if (_0xb3388d()) {
            console.log("Observer: Login modal detected during checkout");
            _0x24cead().catch(_0x120c76 => console.error("Observer Login Modal error:", _0x120c76));
            return;
          }
          if (_0x345816()) {
            console.log("Observer: Payment method selection detected");
            _0x35551a().catch(_0x31f4d4 => console.error("Observer Payment Method error:", _0x31f4d4));
            return;
          }
          const _0x2ca444 = document.querySelector("#enter-cvv");
          if (_0x2ca444 && _0x2ca444.offsetParent !== null && !_0x3959fe) {
            const _0x2b099a = _0x2ca444.type || "";
            const _0x24a921 = _0x2ca444.name || "";
            const _0x2c3e26 = _0x2ca444.placeholder || "";
            if (_0x2b099a === "password" && (_0x24a921.toLowerCase().includes("password") || _0x2c3e26.toLowerCase().includes("password"))) {
              console.log("Observer: CVV input appears to be a password field - skipping to prevent confusion");
              return;
            }
            const _0x3e02b3 = _0x2ca444.closest("form")?.querySelectorAll("input[type=\"email\"], input[placeholder*=\"email\"], input[placeholder*=\"username\"]");
            if (_0x3e02b3 && _0x3e02b3.length > 0) {
              console.log("Observer: CVV input is near login elements - skipping to prevent confusion");
              return;
            }
            console.log("Observer: CVV input detected and validated");
            _0x4e1108().catch(_0xa3af5f => console.error("Observer CVV error:", _0xa3af5f));
            return;
          }
          const _0x30b1e1 = document.querySelector("#credit-card-number-input");
          if (_0x30b1e1 && _0x30b1e1.offsetParent !== null && !_0x42ab65) {
            console.log("Observer: Card verification input detected");
            _0x195f8d().catch(_0x4ec0f2 => console.error("Observer Card Verify error:", _0x4ec0f2));
            return;
          }
          const _0x491286 = document.querySelector("button[data-test=\"placeOrderButton\"]");
          if (_0x491286 && _0x491286.offsetParent !== null && !_0x491286.disabled && !_0x31ff88) {
            console.log("Observer: Place order button detected");
            _0x551157().catch(_0x2e45e4 => console.error("Observer Place Order error:", _0x2e45e4));
          }
        });
        _0x28c659.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true
        });
        _0x2d6471.push(_0x28c659);
        const _0x4a8bb6 = setInterval(() => {
          if (!_0x2ff9f4 || _0x490f2a || _0x1e1acc) {
            return;
          }
          const _0x1d8a2f = window.location.href;
          const _0x263770 = _0x1d8a2f.includes("/account/signin") || _0x1d8a2f.includes("/login");
          if (_0x263770) {
            console.log("Interval: Login page detected - skipping to prevent field confusion");
            return;
          }
          try {
            try {
              if (_0x38235()) {
                console.log("Interval: Error message detected, handling immediately");
                const _0x1dd1fc = _0x2af097();
                if (_0x1dd1fc) {
                  console.log("Interval: Dismissing error popup immediately");
                  utils.clickElement(_0x1dd1fc, "interval-error-dismiss").catch(_0x4ddb03 => console.error("Interval error dismiss error:", _0x4ddb03));
                  return;
                }
              }
            } catch (_0x2a7133) {
              console.warn("Interval: Error checking for error popups:", _0x2a7133);
            }
            if (_0xb3388d()) {
              console.log("Interval: Login modal detected during checkout");
              _0x24cead().catch(_0x53a591 => console.error("Interval Login Modal error:", _0x53a591));
              return;
            }
            const _0x43352a = document.querySelector("#enter-cvv");
            if (_0x43352a && _0x43352a.offsetParent !== null && !_0x3959fe) {
              const _0x54ba4b = _0x43352a.type || "";
              const _0x2a6c54 = _0x43352a.name || "";
              const _0x432a3d = _0x43352a.placeholder || "";
              if (_0x54ba4b === "password" && (_0x2a6c54.toLowerCase().includes("password") || _0x432a3d.toLowerCase().includes("password"))) {
                console.log("Interval: CVV input appears to be a password field - skipping to prevent confusion");
                return;
              }
              const _0x2f4965 = _0x43352a.closest("form")?.querySelectorAll("input[type=\"email\"], input[placeholder*=\"email\"], input[placeholder*=\"username\"]");
              if (_0x2f4965 && _0x2f4965.length > 0) {
                console.log("Interval: CVV input is near login elements - skipping to prevent confusion");
                return;
              }
              console.log("Interval: CVV input detected and validated");
              _0x4e1108().catch(_0x26e1c2 => console.error("Interval CVV error:", _0x26e1c2));
              return;
            }
            const _0x1fa67f = document.querySelector("#credit-card-number-input");
            if (_0x1fa67f && _0x1fa67f.offsetParent !== null && !_0x42ab65) {
              console.log("Interval: Card verification input detected");
              _0x195f8d().catch(_0x485a57 => console.error("Interval Card Verify error:", _0x485a57));
              return;
            }
            const _0x3bab0d = document.querySelector("button[data-test=\"placeOrderButton\"]");
            if (_0x3bab0d && _0x3bab0d.offsetParent !== null && !_0x3bab0d.disabled && !_0x31ff88) {
              console.log("Interval: Place order button detected");
              _0x551157().catch(_0x54a056 => console.error("Interval Place Order error:", _0x54a056));
            }
          } catch (_0x207a23) {
            console.warn("Error in checkout interval check:", _0x207a23);
          }
        }, 1000);
        _0x337d31.push(_0x4a8bb6);
        console.log("Checkout page observers and safety interval set up");
      }
      async function _0x4fb218() {
        console.log("Login page detected, checking auto-login settings");
        try {
          const _0x1b4920 = await storage.getFromStorage(["globalSettings", "targetEmail", "targetPassword"]);
          const _0x3bbf69 = _0x1b4920.globalSettings?.autoLogin === true;
          if (!_0x3bbf69) {
            console.log("Auto-login is disabled, skipping login automation");
            utils.updateStatus("Login page detected (Auto-login disabled)", "status-waiting");
            return;
          }
          const _0x24b902 = _0x1b4920.targetEmail;
          const _0x559c08 = _0x1b4920.targetPassword;
          if (!_0x24b902 || !_0x559c08) {
            console.log("Target credentials not found, cannot auto-login");
            utils.updateStatus("Login page detected (No credentials)", "status-waiting");
            return;
          }
          console.log("Auto-login enabled and credentials found, proceeding with login");
          utils.updateStatus("Auto-logging in to Target...", "status-running");
          await utils.sleep(500);
          
          // Check if already logged in
          const _0x1d4381 = finder.findElementWithSelectors(selectors.loginPageSelectors.loggedInIndicators);
          if (_0x1d4381 && finder.isElementVisible(_0x1d4381)) {
            console.log("Already logged in, skipping auto-login");
            utils.updateStatus("Already logged in to Target", "status-waiting");
            return;
          }
          
          // NEW: Handle two-step Target.com login flow
          // Step 1: Check if on account page with "Sign in or create account" prompt
          console.log("Checking for Target.com account page login flow...");
          
          // Look for email field first
          const emailField = document.querySelector('#username') || 
                             document.querySelector('input[type="email"]') || 
                             document.querySelector('input[name="username"]');
          
          // Look for continue button (Step 1)
          const continueButton = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Sign in') || btn.textContent.includes('Continue')
          );
          
          // Look for password field
          const passwordField = document.querySelector('#password') || 
                                document.querySelector('input[type="password"]');
          
          // Determine which step we're on
          const isStep1 = emailField && continueButton && !passwordField;
          const isStep2 = passwordField && emailField;
          
          console.log(`Login flow detection: Step1=${isStep1}, Step2=${isStep2}`);
          
          if (isStep1) {
            // STEP 1: Check "Keep me signed in" checkbox, enter email, then click continue
            console.log("Step 1: Checking 'Keep me signed in', entering email, and clicking continue");
            utils.updateStatus("Preparing login...", "status-running");
            
            // Check "Keep me signed in" checkbox if present (using proper selectors)
            const keepSignedInCheckbox = finder.findElementWithSelectors(selectors.loginPageSelectors.loginFields.keepMeSignedIn);
            if (keepSignedInCheckbox && finder.isElementVisible(keepSignedInCheckbox)) {
              if (!keepSignedInCheckbox.checked) {
                console.log("Checking 'Keep me signed in' checkbox (CRITICAL for session persistence)");
                keepSignedInCheckbox.checked = true;
                keepSignedInCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
                keepSignedInCheckbox.dispatchEvent(new Event("click", { bubbles: true }));
                await utils.sleep(100);
                
                // Verify checkbox was checked
                if (keepSignedInCheckbox.checked) {
                  console.log("✓ Keep me signed in checkbox successfully checked");
                } else {
                  console.warn("✗ Keep me signed in checkbox failed to check - retrying...");
                  await utils.clickElement(keepSignedInCheckbox, "keep-signed-in-retry");
                  await utils.sleep(50);
                }
              } else {
                console.log("✓ Keep me signed in checkbox already checked");
              }
            } else {
              console.warn("Keep me signed in checkbox not found in Step 1 - session may not persist");
            }
            
            // Fill email
            console.log("Filling email field in Step 1");
            utils.updateStatus("Entering email...", "status-running");
            await utils.fillField(emailField, _0x24b902, "login-email-step1");
            await utils.sleep(200);
            
            // Verify email was filled
            if (emailField.value.trim() === _0x24b902) {
              console.log("✓ Email field successfully filled");
            } else {
              console.warn("Email field verification failed, retrying...");
              await utils.fillField(emailField, _0x24b902, "login-email-step1-retry");
              await utils.sleep(100);
              
              // Verify retry was successful
              if (emailField.value.trim() === _0x24b902) {
                console.log("✓ Email field successfully filled after retry");
              } else {
                console.error("✗ Email field failed to fill after retry - login may fail");
              }
            }
            
            // Click continue
            console.log("Clicking continue button to proceed to password entry");
            utils.updateStatus("Clicking continue...", "status-running");
            await utils.clickElement(continueButton, "login-continue");
            utils.updateStatus("Waiting for password field...", "status-running");
            
            // Wait for password field to appear
            let waitAttempts = 0;
            const maxWaitAttempts = 20;
            while (waitAttempts < maxWaitAttempts) {
              await utils.sleep(300);
              const pwField = document.querySelector('#password') || document.querySelector('input[type="password"]');
              if (pwField && finder.isElementVisible(pwField)) {
                console.log("Password field appeared, proceeding to Step 2");
                // Recursively call this function to handle Step 2
                await utils.sleep(300);
                await _0x4fb218();
                return;
              }
              waitAttempts++;
            }
            
            console.log("Password field did not appear after clicking continue");
            utils.updateStatus("Password field not found", "status-waiting");
            return;
          }
          
          if (isStep2) {
            // STEP 2: Enter password and click "Sign in with password"
            console.log("Step 2: Entering password and signing in");
            utils.updateStatus("Entering password...", "status-running");
            
            // Fill password
            await utils.fillField(passwordField, _0x559c08, "login-password-step2");
            await utils.sleep(200);
            
            // Look for "Sign in with password" button
            const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
              btn.textContent.includes('Sign in with password') || 
              btn.textContent.includes('Sign in')
            ) || document.querySelector('button[type="submit"]');
            
            if (signInButton && finder.isElementVisible(signInButton) && !finder.isElementDisabled(signInButton)) {
              console.log("Clicking 'Sign in with password' button");
              utils.updateStatus("Signing in...", "status-running");
              await utils.clickElement(signInButton, "login-submit-step2");
              await utils.sleep(500);
              
              // Check for errors
              const errorElement = document.querySelector('[data-test="authAlertDisplay"]') ||
                                   document.querySelector('.error') ||
                                   document.querySelector('[role="alert"]');
              if (errorElement && finder.isElementVisible(errorElement)) {
                const errorText = errorElement.textContent.trim();
                console.log("Login error detected:", errorText);
                utils.updateStatus("Login failed: " + errorText, "status-waiting");
                return;
              }
              
              // Wait and verify login success
              await utils.sleep(1000);
              const loggedInIndicator = finder.findElementWithSelectors(selectors.loginPageSelectors.loggedInIndicators);
              if (loggedInIndicator && finder.isElementVisible(loggedInIndicator)) {
                console.log("Auto-login successful!");
                utils.updateStatus("Successfully logged in to Target", "status-complete");
              } else {
                // Check if we're redirected away from login page
                if (!window.location.href.includes('/account') && !window.location.href.includes('/login')) {
                  console.log("Redirected away from login page - assuming success");
                  utils.updateStatus("Login completed", "status-complete");
                } else {
                  console.log("Login submitted but success not confirmed");
                  utils.updateStatus("Login submitted (verifying...)", "status-waiting");
                }
              }
            } else {
              console.log("Sign in button not available");
              utils.updateStatus("Sign in button not available", "status-waiting");
            }
            return;
          }
          
          // FALLBACK: Try old single-step login flow
          console.log("Attempting fallback to single-step login flow");
          const _0x4fc1eb = finder.findElementWithSelectors(selectors.loginPageSelectors.loginFields.username);
          const _0xc37d34 = finder.findElementWithSelectors(selectors.loginPageSelectors.loginFields.password);
          const _0x582543 = finder.findElementWithSelectors(selectors.loginPageSelectors.signInButton);
          
          if (!_0x4fc1eb || !_0xc37d34 || !_0x582543) {
            console.log("Could not find login form elements for any login flow");
            utils.updateStatus("Login form not found", "status-waiting");
            return;
          }
          
          console.log("Filling username/email field");
          await utils.fillField(_0x4fc1eb, _0x24b902, "login-username");
          await utils.sleep(50);
          console.log("Filling password field");
          await utils.fillField(_0xc37d34, _0x559c08, "login-password");
          await utils.sleep(50);
          
          const _0x59202b = finder.findElementWithSelectors(selectors.loginPageSelectors.loginFields.keepMeSignedIn);
          if (_0x59202b && finder.isElementVisible(_0x59202b)) {
            if (!_0x59202b.checked) {
              console.log("Checking 'Keep me signed in' checkbox (CRITICAL for session persistence)");
              _0x59202b.checked = true;
              _0x59202b.dispatchEvent(new Event("change", {
                bubbles: true
              }));
              _0x59202b.dispatchEvent(new Event("click", {
                bubbles: true
              }));
              await utils.sleep(50);
              if (_0x59202b.checked) {
                console.log("✓ Keep me signed in checkbox successfully checked");
              } else {
                console.error("✗ Keep me signed in checkbox failed to check - retrying...");
                await utils.clickElement(_0x59202b, "keep-signed-in-checkbox");
                await utils.sleep(30);
              }
            } else {
              console.log("✓ Keep me signed in checkbox already checked");
            }
          } else {
            console.warn("Keep me signed in checkbox not found - session may not persist");
          }
          
          if (finder.isElementVisible(_0x582543) && !finder.isElementDisabled(_0x582543)) {
            console.log("Clicking sign in button");
            utils.updateStatus("Signing in...", "status-running");
            await utils.clickElement(_0x582543, "login-submit");
            await utils.sleep(300);
            const _0x2d990f = finder.findElementWithSelectors(selectors.loginPageSelectors.loginErrors);
            if (_0x2d990f && finder.isElementVisible(_0x2d990f)) {
              const _0x567e9b = _0x2d990f.textContent.trim();
              console.log("Login error detected:", _0x567e9b);
              utils.updateStatus("Login failed: " + _0x567e9b, "status-waiting");
              return;
            }
            const _0x16eb04 = finder.findElementWithSelectors(selectors.loginPageSelectors.loggedInIndicators);
            if (_0x16eb04 && finder.isElementVisible(_0x16eb04)) {
              console.log("Auto-login successful!");
              utils.updateStatus("Successfully logged in to Target", "status-complete");
            } else {
              await utils.sleep(1000);
              const _0x910936 = finder.findElementWithSelectors(selectors.loginPageSelectors.loggedInIndicators);
              if (_0x910936 && finder.isElementVisible(_0x910936)) {
                console.log("Auto-login successful after delay!");
                utils.updateStatus("Successfully logged in to Target", "status-complete");
              } else {
                console.log("Login form submitted but success not confirmed");
                utils.updateStatus("Login submitted (result unknown)", "status-waiting");
              }
            }
          } else {
            console.log("Sign in button not available");
            utils.updateStatus("Sign in button not available", "status-waiting");
          }
        } catch (_0x11e172) {
          console.error("Error during auto-login:", _0x11e172);
          utils.updateStatus("Auto-login error: " + _0x11e172.message, "status-waiting");
        }
      }
    }
  }
}