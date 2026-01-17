class CheckoutBase {
  constructor(_0x43de90) {
    if (!_0x43de90) {
      throw new Error("CheckoutBase requires a siteName in constructor");
    }
    this.siteName = _0x43de90;
    this.isEnabled = false;
    this.siteSettings = {};
    this.globalSettings = {};
    this.checkoutInProgress = false;
    this.currentStep = "";
    this.profile = null;
    this.observers = [];
    this.intervals = [];
    this.buttonClickTracking = {};
    this.inputFillingTracking = {};
    this.utils = {
      sleep: sleep,
      waitForElement: waitForElement,
      findElementWithSelectors: findElementWithSelectors,
      clickElement: clickElement,
      fillField: fillField,
      updateStatus: updateStatus,
      debugLog: debugLog,
      getFromStorage: getFromStorage,
      saveToStorage: saveToStorage,
      getProfiles: getProfiles
    };
    this.storage = {
      getFromStorage: getFromStorage,
      saveToStorage: saveToStorage,
      getSiteSettings: getSiteSettings,
      updateSiteSettings: updateSiteSettings,
      getProfiles: getProfiles,
      saveProfile: saveProfile,
      deleteProfile: deleteProfile
    };
    this.finder = {
      findButtonByText: findButtonByText,
      findElementWithSelectors: findElementWithSelectors,
      fillFieldBySelectors: fillFieldBySelectors,
      createElementWatcher: createElementWatcher,
      createButtonWatcher: createButtonWatcher,
      isElementVisible: isElementVisible,
      isElementDisabled: isElementDisabled
    };
  }
  async init() {
    console.log("Initializing " + this.siteName + " checkout system");
    try {
      await this.loadSettings();
      this.setupListeners();
      this.detectCurrentPage();
    } catch (_0x8e915d) {
      console.error("Error during " + this.siteName + " initialization:", _0x8e915d);
      this.utils.updateStatus("Error initializing " + this.siteName + ": " + _0x8e915d.message, "status-waiting");
    }
  }
  async loadSettings() {
    const _0x534b2e = await this.storage.getFromStorage(["enabled", "siteSettings", "globalSettings"]);
    this.isEnabled = _0x534b2e.enabled || false;
    if (_0x534b2e.siteSettings && _0x534b2e.siteSettings[this.siteName]) {
      this.siteSettings = _0x534b2e.siteSettings[this.siteName];
      this.isEnabled &&= this.siteSettings.enabled !== undefined ? this.siteSettings.enabled : false;
    } else {
      this.siteSettings = {};
      this.isEnabled = false;
      console.warn("No settings found for site: " + this.siteName);
    }
    this.globalSettings = _0x534b2e.globalSettings || {
      autoSubmit: true,
      randomizeDelay: false
    };
    this.utils.debugLog(this.siteName + "-settings-loaded", {
      isEnabledGlobally: _0x534b2e.enabled || false,
      isEnabledForSite: this.isEnabled,
      siteSettings: this.siteSettings,
      globalSettings: this.globalSettings
    });
    await this.loadProfileData();
  }
  async loadProfileData() {
    try {
      const _0x2f3f9a = await this.storage.getProfiles();
      this.profile = _0x2f3f9a.selectedProfile;
      if (!this.profile) {
        console.warn(this.siteName + ": No profile selected or found.");
      } else {
        this.utils.debugLog(this.siteName + "-profile-loaded", {
          profileName: this.profile.name
        });
      }
    } catch (_0x45f0c0) {
      console.error(this.siteName + ": Error loading profile data:", _0x45f0c0);
      this.profile = null;
    }
  }
  setupListeners() {
    if (this.messageListener) {
      chrome.runtime.onMessage.removeListener(this.messageListener);
    }
    this.messageListener = (_0x30548e, _0x22bfc4, _0x326077) => {
      let _0x337733 = false;
      if (_0x30548e.action === "activateSite" && _0x30548e.site === this.siteName) {
        console.log(this.siteName + ": Received activation command.");
        const _0x3b1212 = this.isEnabled;
        this.isEnabled = true;
        this.siteSettings = _0x30548e.siteSettings || this.siteSettings;
        if (this.siteSettings.enabled !== undefined) {
          this.isEnabled = this.siteSettings.enabled;
        }
        if (!_0x3b1212 && this.isEnabled) {
          this.utils.debugLog(this.siteName + "-activated", {
            siteSettings: this.siteSettings
          });
          this.onActivate();
        }
      }
      if (_0x30548e.action === "detectPage" && _0x30548e.site === this.siteName) {
        console.log(this.siteName + ": Received page detection command: " + _0x30548e.type);
        this.detectPage(_0x30548e.type);
      }
      if (_0x30548e.action === "toggleStatus") {
        console.log(this.siteName + ": Received global toggle command: " + _0x30548e.enabled);
        const _0xaafd24 = _0x30548e.enabled;
        const _0x4fe380 = this.siteSettings?.enabled ?? false;
        const _0x2b0010 = this.isEnabled;
        this.isEnabled = _0xaafd24 && _0x4fe380;
        this.utils.debugLog(this.siteName + "-toggled", {
          global: _0xaafd24,
          site: _0x4fe380,
          now: this.isEnabled,
          was: _0x2b0010
        });
        if (_0x2b0010 && !this.isEnabled) {
          this.cleanup();
        } else if (!_0x2b0010 && this.isEnabled) {
          this.onActivate();
        }
      }
      if (_0x30548e.action === "updateSiteSetting" && _0x30548e.site === this.siteName) {
        console.log(this.siteName + ": Received setting update: " + _0x30548e.setting + "=" + _0x30548e.value);
        this.siteSettings[_0x30548e.setting] = _0x30548e.value;
        if (_0x30548e.setting === "enabled") {
          this.storage.getFromStorage("enabled").then(_0x426b2f => {
            const _0x148714 = _0x426b2f.enabled ?? false;
            const _0x3d7f51 = this.isEnabled;
            this.isEnabled = _0x148714 && this.siteSettings.enabled;
            console.log(this.siteName + ": Enabled state updated via setting: " + this.isEnabled);
            if (_0x3d7f51 && !this.isEnabled) {
              this.cleanup();
            } else if (!_0x3d7f51 && this.isEnabled) {
              this.onActivate();
            }
          });
        }
        this.onSettingsUpdated();
      }
      if (_0x30548e.action === "updateGlobalSetting") {
        console.log(this.siteName + ": Received global setting update: " + _0x30548e.setting + "=" + _0x30548e.value);
        this.globalSettings[_0x30548e.setting] = _0x30548e.value;
        this.onSettingsUpdated();
      }
      if (_0x30548e.action === "profileUpdated" || _0x30548e.action === "profileSelected") {
        console.log(this.siteName + ": Received profile update/selection command.");
        this.loadProfileData();
      }
      if (_0x337733) {
        return true;
      }
    };
    chrome.runtime.onMessage.addListener(this.messageListener);
    console.log(this.siteName + ": Message listeners set up.");
  }
  cleanup() {
    console.log(this.siteName + ": Cleaning up processes");
    this.utils.updateStatus(this.siteName + ": Disabled", "status-waiting");
    this.checkoutInProgress = false;
    this.currentStep = "";
    this.buttonClickTracking = {};
    this.inputFillingTracking = {};
    this.observers.forEach(_0x26bade => {
      if (_0x26bade && typeof _0x26bade.disconnect === "function") {
        try {
          _0x26bade.disconnect();
        } catch (_0x112ebf) {
          console.warn("Error disconnecting observer:", _0x112ebf);
        }
      }
    });
    this.observers = [];
    console.log(this.siteName + ": Observers disconnected.");
    this.intervals.forEach(_0x219747 => {
      clearInterval(_0x219747);
    });
    this.intervals = [];
    console.log(this.siteName + ": Intervals cleared.");
    if (typeof this.onCleanup === "function") {
      this.onCleanup();
    }
  }
  onActivate() {
    console.warn("onActivate() called on CheckoutBase for " + this.siteName + ". Subclass should implement this.");
    if (this.isEnabled) {
      console.log(this.siteName + ": Activated. Detecting page.");
      this.detectCurrentPage();
    } else {
      console.log(this.siteName + ": Activation requested but still disabled.");
      this.utils.updateStatus(this.siteName + ": Disabled", "status-waiting");
    }
  }
  onSettingsUpdated() {
    this.utils.debugLog(this.siteName + ": Settings updated", {
      siteSettings: this.siteSettings,
      globalSettings: this.globalSettings
    });
  }
  detectCurrentPage() {
    throw new Error("detectCurrentPage() must be implemented by " + this.siteName + " subclass");
  }
  detectPage(_0x296eb6) {
    throw new Error("detectPage(pageType) must be implemented by " + this.siteName + " subclass");
  }
  async startCheckoutProcess() {
    throw new Error("startCheckoutProcess() must be implemented by " + this.siteName + " subclass");
  }
  async continueCheckoutProcess() {
    throw new Error("continueCheckoutProcess() must be implemented by " + this.siteName + " subclass");
  }
  trackButtonClick(_0x469298, clicked = true) {
    this.utils.debugLog(this.siteName + "-click-track", {
      button: _0x469298,
      status: clicked
    });
    this.buttonClickTracking[_0x469298] = clicked;
  }
  hasButtonBeenClicked(_0x49ac96) {
    return this.buttonClickTracking[_0x49ac96] === true;
  }
  trackInputFilling(_0x5b746b, _0x329639 = true) {
    this.utils.debugLog(this.siteName + "-input-track", {
      input: _0x5b746b,
      status: _0x329639 ? "filling" : "idle"
    });
    this.inputFillingTracking[_0x5b746b] = _0x329639;
  }
  isInputBeingFilled(_0xaeaaf4) {
    return this.inputFillingTracking[_0xaeaaf4] === true;
  }
  trackObserver(_0x35449a) {
    if (_0x35449a && typeof _0x35449a.disconnect === "function") {
      this.observers.push(_0x35449a);
      this.utils.debugLog(this.siteName + "-observer-tracked", {
        count: this.observers.length
      });
    } else {
      console.warn(this.siteName + ": Attempted to track invalid observer.");
    }
  }
  trackInterval(_0x13bb38) {
    if (_0x13bb38) {
      this.intervals.push(_0x13bb38);
      this.utils.debugLog(this.siteName + "-interval-tracked", {
        id: _0x13bb38,
        count: this.intervals.length
      });
    } else {
      console.warn(this.siteName + ": Attempted to track invalid interval ID.");
    }
  }
}
console.log("common/checkout-base.js: Script loaded, CheckoutBase class defined.");