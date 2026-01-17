document.addEventListener("DOMContentLoaded", function () {
  console.log("Options page initialized");
  const _0x13ebf8 = chrome.runtime.getManifest().version;
  document.querySelectorAll(".version-display").forEach(_0xa21af9 => {
    _0xa21af9.textContent = "v" + _0x13ebf8;
  });
  if (document.title.includes("v3.4") || document.title.includes("v3.5")) {
    document.title = document.title.replace(/v\d+\.\d+/, "v" + _0x13ebf8);
  }
  document.querySelectorAll("h1").forEach(_0x2f857e => {
    if (_0x2f857e.textContent.includes("v3.4") || _0x2f857e.textContent.includes("v3.5")) {
      _0x2f857e.textContent = _0x2f857e.textContent.replace(/v\d+\.\d+/, "v" + _0x13ebf8);
    }
  });
  const _0x1df68b = document.querySelector(".card-header");
  if (_0x1df68b && (_0x1df68b.textContent.includes("v3.4") || _0x1df68b.textContent.includes("v3.5"))) {
    _0x1df68b.textContent = _0x1df68b.textContent.replace(/v\d+\.\d+/, "v" + _0x13ebf8);
  }
  const _0x2df151 = document.getElementById("profile-list");
  const addProfileBtn = document.getElementById("add-profile-btn");
  const _0x3e50a6 = document.getElementById("profile-modal");
  const _0x157b46 = document.getElementById("close-modal");
  const _0x21dbf6 = document.getElementById("cancel-profile");
  const _0x29736f = document.getElementById("save-profile");
  const _0x346151 = document.getElementById("profile-form");
  const _0x35c6c8 = document.getElementById("modal-title");
  const _0x530d7d = document.getElementById("profile-id");
  const _0x518653 = document.getElementById("success-message");
  const _0x2b3a1f = document.getElementById("error-message");
  const _0x3987e0 = document.getElementById("remember-toggle");
  const _0x280cc3 = document.getElementById("auto-submit-order");
  const addRandomDelays = document.getElementById("add-random-delays");
  const _0x1f9c9e = document.getElementById("debug-mode");
  const _0x58dc72 = document.getElementById("global-cooldown");
  const _0x2a9d72 = document.getElementById("sku-cooldown");
  const _0x447bbc = document.getElementById("save-settings-btn");
  const _0x19c921 = document.getElementById("export-data");
  const copyExportBtn = document.getElementById("copy-export-btn");
  const _0x147a5d = document.getElementById("import-data");
  const _0x51324d = document.getElementById("replace-existing");
  const _0x53ae5f = document.getElementById("import-btn");
  const _0x1ea2e6 = document.getElementById("target-email");
  const _0x3e5f5b = document.getElementById("target-password");
  const _0x4e9710 = document.getElementById("clear-credentials-btn");
  const scheduledLoginEnabled = document.getElementById("scheduled-login-enabled");
  const scheduledLoginTimes = document.getElementById("scheduled-login-times");
  const scheduledLoginDaily = document.getElementById("scheduled-login-daily");
  const randomLoginEnabled = document.getElementById("random-login-enabled");
  const intervalLoginEnabled = document.getElementById("interval-login-enabled");
  const intervalLoginMinutes = document.getElementById("interval-login-minutes");
  const testLoginBtn = document.getElementById("test-login-btn");
  const nextLoginDisplay = document.getElementById("next-login-display");
  const tabs = document.querySelectorAll(".tab");
  const _0x49a23c = document.querySelectorAll(".tab-content");
  tabs.forEach(_0x3596ae => {
    _0x3596ae.addEventListener("click", () => {
      const _0x356e36 = _0x3596ae.getAttribute("data-tab");
      tabs.forEach(_0x339257 => _0x339257.classList.remove("active"));
      _0x3596ae.classList.add("active");
      _0x49a23c.forEach(_0x39163d => {
        _0x39163d.classList.remove("active");
        if (_0x39163d.id === _0x356e36 + "-tab") {
          _0x39163d.classList.add("active");
        }
      });
      if (_0x356e36 === "import-export") {
        updateExportData();
      }
    });
  });
  _0x2dc50e();
  _0x3920f8();
  _0x458448();
  addProfileBtn.addEventListener("click", () => {
    _0x346151.reset();
    _0x530d7d.value = "";
    _0x35c6c8.textContent = "Add New Profile";
    _0x456e79();
  });
  _0x157b46.addEventListener("click", _0x430972);
  _0x21dbf6.addEventListener("click", _0x430972);
  _0x29736f.addEventListener("click", async () => {
    if (!_0x346151.checkValidity()) {
      _0x346151.reportValidity();
      return;
    }
    await _0x205fe0();
  });
  _0x447bbc.addEventListener("click", _0x5194a0);
  copyExportBtn.addEventListener("click", () => {
    if (!navigator.clipboard) {
      try {
        _0x19c921.select();
        document.execCommand("copy");
        _0x484f87("Profiles copied to clipboard! (Fallback)");
      } catch (_0x1cea96) {
        _0x487e55("Failed to copy profiles.");
      }
      return;
    }
    navigator.clipboard.writeText(_0x19c921.value).then(() => {
      _0x484f87("Profiles copied to clipboard!");
    }).catch(_0x32b43f => {
      _0x487e55("Failed to copy profiles: " + _0x32b43f);
    });
  });
  _0x53ae5f.addEventListener("click", _0x2c81b3);
  _0x1ea2e6.addEventListener("input", _0x5c5224);
  _0x3e5f5b.addEventListener("input", _0x5c5224);
  _0x4e9710.addEventListener("click", _0x10e108);
  testLoginBtn.addEventListener("click", _0x4d8f2a);
  async function _0x2dc50e() {
    _0x2df151.innerHTML = "<li class=\"empty-state\">Loading profiles...</li>";
    try {
      const _0x20386f = await chrome.storage.local.get("profiles");
      const _0x2e7cff = _0x20386f.profiles || [];
      console.log("Loading " + _0x2e7cff.length + " profiles");
      if (_0x2e7cff.length === 0) {
        _0x2df151.innerHTML = "<li class=\"empty-state\">No profiles added yet. Click \"Add New Profile\" to create one.</li>";
        return;
      }
      _0x2df151.innerHTML = "";
      _0x2e7cff.forEach(_0x3fb5ad => {
        const _0xd2a087 = document.createElement("li");
        _0xd2a087.className = "profile-item";
        _0xd2a087.innerHTML = "\n            <div class=\"profile-info\">\n              <div class=\"profile-name\">" + _0x3226fb(_0x3fb5ad.name) + "</div>\n              <div class=\"profile-details\">\n                " + (_0x3fb5ad.firstName && _0x3fb5ad.lastName ? _0x3226fb(_0x3fb5ad.firstName) + " " + _0x3226fb(_0x3fb5ad.lastName) + " - " + _0x9ac98b(_0x3fb5ad.cardNumber) : "Payment Profile - " + _0x9ac98b(_0x3fb5ad.cardNumber)) + "\n              </div>\n            </div>\n            <div class=\"profile-actions\">\n              <button class=\"action-btn edit\" data-id=\"" + _0x3226fb(_0x3fb5ad.id) + "\">Edit</button>\n              <button class=\"action-btn delete\" data-id=\"" + _0x3226fb(_0x3fb5ad.id) + "\">Delete</button>\n            </div>\n          ";
        _0x2df151.appendChild(_0xd2a087);
        const _0x545076 = _0xd2a087.querySelector(".edit");
        const deleteButton = _0xd2a087.querySelector(".delete");
        if (_0x545076) {
          _0x545076.addEventListener("click", _0x45cea5 => {
            _0x771729(_0x45cea5.target.getAttribute("data-id"));
          });
        }
        if (deleteButton) {
          deleteButton.addEventListener("click", _0x159a89 => {
            deleteProfileHandler(_0x159a89.target.getAttribute("data-id"));
          });
        }
      });
    } catch (_0x4d2aaf) {
      console.error("Error loading profiles:", _0x4d2aaf);
      _0x2df151.innerHTML = "<li class=\"empty-state error-message\">Error loading profiles. Please try again.</li>";
      _0x487e55("Failed to load profiles: " + _0x4d2aaf.message);
    }
  }
  function _0x9ac98b(_0x550d8e) {
    if (!_0x550d8e || typeof _0x550d8e !== "string" || _0x550d8e.trim() === "") {
      return "No Card Saved";
    }
    const _0x1da365 = _0x550d8e.replace(/\D/g, "");
    if (_0x1da365.length <= 4) {
      return "**** **** **** " + _0x1da365;
    }
    const _0x3058b8 = _0x1da365.slice(-4);
    return "**** **** **** " + _0x3058b8;
  }
  function _0x456e79() {
    _0x3e50a6.style.display = "flex";
  }
  function _0x430972() {
    _0x3e50a6.style.display = "none";
  }
  function _0x2066e9() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  }
  async function _0x205fe0() {
    const _0x162ba5 = _0x530d7d.value || null;
    const _0x38cacc = !_0x530d7d.value;
    const _0x2eaac0 = {
      id: _0x162ba5,
      name: document.getElementById("profile-name").value.trim(),
      cardNumber: document.getElementById("card-number").value.replace(/\s/g, ""),
      expiryMonth: document.getElementById("expiry-month").value.padStart(2, "0"),
      expiryYear: document.getElementById("expiry-year").value,
      cvv: document.getElementById("cvv").value.trim()
    };
    if (!_0x2eaac0.name || !_0x2eaac0.cardNumber || !_0x2eaac0.expiryMonth || !_0x2eaac0.expiryYear || !_0x2eaac0.cvv) {
      _0x487e55("Please fill in all required fields: Profile Name, Card Number, Expiry Month, Expiry Year, and CVV.");
      _0x346151.reportValidity();
      return;
    }
    if (_0x2eaac0.cardNumber.length < 13 || _0x2eaac0.cardNumber.length > 19) {
      _0x487e55("Card number must be between 13 and 19 digits.");
      return;
    }
    if (_0x2eaac0.expiryMonth < 1 || _0x2eaac0.expiryMonth > 12) {
      _0x487e55("Expiry month must be between 01 and 12.");
      return;
    }
    if (_0x2eaac0.expiryYear < new Date().getFullYear() || _0x2eaac0.expiryYear > new Date().getFullYear() + 20) {
      _0x487e55("Please enter a valid expiry year.");
      return;
    }
    if (_0x2eaac0.cvv.length < 3 || _0x2eaac0.cvv.length > 4) {
      _0x487e55("CVV must be 3 or 4 digits.");
      return;
    }
    const _0x1ba2d5 = {
      id: _0x2eaac0.id,
      name: _0x2eaac0.name,
      cardNumber: _0x2eaac0.cardNumber,
      expiryMonth: _0x2eaac0.expiryMonth,
      expiryYear: _0x2eaac0.expiryYear,
      cvv: _0x2eaac0.cvv,
      paymentMethod: {
        cardNumber: _0x2eaac0.cardNumber,
        expiryMonth: _0x2eaac0.expiryMonth,
        expiryYear: _0x2eaac0.expiryYear,
        cvv: _0x2eaac0.cvv
      },
      payment: {
        cardNumber: _0x2eaac0.cardNumber,
        expiryMonth: _0x2eaac0.expiryMonth,
        expiryYear: _0x2eaac0.expiryYear,
        cvv: _0x2eaac0.cvv
      }
    };
    console.log("Options Script: Saving normalized payment-only profile object:", JSON.stringify(_0x1ba2d5, null, 2));
    try {
      await _0x2a45e5(_0x1ba2d5, _0x38cacc);
      _0x430972();
      await _0x2dc50e();
      _0x484f87("Profile " + (_0x38cacc ? "added" : "updated") + " successfully!");
      chrome.runtime.sendMessage({
        action: "profileUpdated"
      }).catch(_0x2ba176 => console.warn("Could not notify about profile update:", _0x2ba176));
    } catch (_0x5c1bc7) {
      console.error("Error saving profile:", _0x5c1bc7);
      _0x487e55("Error saving profile: " + _0x5c1bc7.message);
    }
  }
  async function _0x2a45e5(_0x2c352a, _0x1b9e48) {
    const _0x236c3f = await chrome.storage.local.get("profiles");
    let _0x475444 = _0x236c3f.profiles || [];
    if (_0x1b9e48 || !_0x2c352a.id) {
      _0x2c352a.id = _0x2066e9();
    }
    const _0x516666 = _0x475444.findIndex(_0x3dfe48 => _0x3dfe48.id === _0x2c352a.id);
    if (_0x516666 !== -1) {
      _0x475444[_0x516666] = _0x2c352a;
    } else {
      _0x475444.push(_0x2c352a);
    }
    await chrome.storage.local.set({
      profiles: _0x475444
    });
    const _0x3c7d8d = await chrome.storage.local.get("selectedProfile");
    if (_0x475444.length === 1 || !_0x3c7d8d.selectedProfile) {
      await chrome.storage.local.set({
        selectedProfile: _0x2c352a.id
      });
      chrome.runtime.sendMessage({
        action: "profileSelected",
        profileId: _0x2c352a.id
      }).catch(_0x31167d => console.warn("Could not notify about profile selection:", _0x31167d));
    }
  }
  async function _0x771729(_0x222ea1) {
    try {
      const _0x42b48b = await chrome.storage.local.get("profiles");
      const _0xcad24 = _0x42b48b.profiles || [];
      const _0x20446f = _0xcad24.find(_0x3f52b3 => _0x3f52b3.id === _0x222ea1);
      if (_0x20446f) {
        _0x530d7d.value = _0x20446f.id;
        document.getElementById("profile-name").value = _0x20446f.name || "";
        document.getElementById("card-number").value = _0x20446f.cardNumber || "";
        document.getElementById("expiry-month").value = _0x20446f.expiryMonth || "";
        document.getElementById("expiry-year").value = _0x20446f.expiryYear || "";
        document.getElementById("cvv").value = _0x20446f.cvv || "";
        _0x35c6c8.textContent = "Edit Profile";
        _0x456e79();
      } else {
        console.error("Profile with ID " + _0x222ea1 + " not found for editing.");
        _0x487e55("Could not find the profile to edit.");
      }
    } catch (_0x7ca888) {
      console.error("Error fetching profile for editing:", _0x7ca888);
      _0x487e55("Error loading profile for edit: " + _0x7ca888.message);
    }
  }
  async function deleteProfileHandler(_0x316ce4) {
    if (!_0x316ce4) {
      console.error("Invalid profile ID for deletion.");
      return;
    }
    if (confirm("Are you sure you want to delete this profile?")) {
      try {
        await deleteProfileFromStorage(_0x316ce4);
        await _0x2dc50e();
        _0x484f87("Profile deleted successfully!");
        chrome.runtime.sendMessage({
          action: "profileUpdated"
        }).catch(_0x1d1831 => console.warn("Could not notify about profile deletion:", _0x1d1831));
      } catch (_0x42b16c) {
        console.error("Error deleting profile:", _0x42b16c);
        _0x487e55("Error deleting profile: " + _0x42b16c.message);
      }
    }
  }
  async function deleteProfileFromStorage(_0x19c278) {
    const _0x4e7ed8 = await chrome.storage.local.get(["profiles", "selectedProfile"]);
    let _0x3f3a97 = _0x4e7ed8.profiles || [];
    const _0x28c8bd = _0x4e7ed8.selectedProfile;
    const _0x26952a = _0x3f3a97.length;
    _0x3f3a97 = _0x3f3a97.filter(_0x5b1ab3 => _0x5b1ab3.id !== _0x19c278);
    if (_0x3f3a97.length === _0x26952a) {
      console.warn("Profile with ID " + _0x19c278 + " not found for deletion.");
      return;
    }
    const updateData = {
      profiles: _0x3f3a97
    };
    if (_0x28c8bd === _0x19c278) {
      updateData.selectedProfile = _0x3f3a97.length > 0 ? _0x3f3a97[0].id : "";
    }
    await chrome.storage.local.set(updateData);
    if (_0x28c8bd === _0x19c278) {
      chrome.runtime.sendMessage({
        action: "profileSelected",
        profileId: updateData.selectedProfile
      }).catch(_0x384f6b => console.warn("Could not notify about profile selection after delete:", _0x384f6b));
    }
  }
  async function _0x3920f8() {
    try {
      const _0x3bc4c4 = await chrome.storage.local.get(["enabled", "globalSettings", "debugMode", "discord_tabOpenCooldownSeconds", "discord_skuCooldownSeconds", "scheduledLogin"]);
      _0x3987e0.checked = _0x3bc4c4.enabled !== undefined;
      const _0x335eb0 = _0x3bc4c4.globalSettings || {};
      _0x280cc3.checked = _0x335eb0.autoSubmit !== false;
      addRandomDelays.checked = _0x335eb0.randomizeDelay || false;
      _0x1f9c9e.checked = _0x3bc4c4.debugMode !== undefined ? _0x3bc4c4.debugMode : true;
      _0x58dc72.value = _0x3bc4c4.discord_tabOpenCooldownSeconds || 5;
      _0x2a9d72.value = _0x3bc4c4.discord_skuCooldownSeconds || 10;
      const scheduledLoginData = _0x3bc4c4.scheduledLogin || {};
      scheduledLoginEnabled.checked = scheduledLoginData.enabled || false;
      scheduledLoginTimes.value = scheduledLoginData.times || "02:45";
      scheduledLoginDaily.checked = scheduledLoginData.daily || false;
      randomLoginEnabled.checked = scheduledLoginData.randomHourly || false;
      intervalLoginEnabled.checked = scheduledLoginData.intervalEnabled || false;
      intervalLoginMinutes.value = scheduledLoginData.intervalMinutes || 60;
      updateNextLoginDisplay(scheduledLoginData);
    } catch (_0x4ac397) {
      console.error("Error loading global settings:", _0x4ac397);
      _0x487e55("Failed to load global settings: " + _0x4ac397.message);
    }
  }
  async function _0x5194a0() {
    try {
      const _0x2da1e2 = {
        autoSubmit: _0x280cc3.checked,
        randomizeDelay: addRandomDelays.checked
      };
      const _0x44f337 = parseInt(_0x58dc72.value, 10);
      const _0x17b6c6 = parseInt(_0x2a9d72.value, 10);
      if (isNaN(_0x44f337) || _0x44f337 < 1 || _0x44f337 > 300) {
        _0x487e55("Global cooldown must be between 1 and 300 seconds.");
        return;
      }
      if (isNaN(_0x17b6c6) || _0x17b6c6 < 1 || _0x17b6c6 > 3600) {
        _0x487e55("SKU cooldown must be between 1 and 3600 seconds.");
        return;
      }
      
      const intervalMinutesValue = parseInt(intervalLoginMinutes.value, 10);
      if (intervalLoginEnabled.checked && (isNaN(intervalMinutesValue) || intervalMinutesValue < 1 || intervalMinutesValue > 1440)) {
        _0x487e55("Interval login minutes must be between 1 and 1440.");
        return;
      }
      
      const scheduledLoginData = {
        enabled: scheduledLoginEnabled.checked,
        times: scheduledLoginTimes.value,
        daily: scheduledLoginDaily.checked,
        randomHourly: randomLoginEnabled.checked,
        intervalEnabled: intervalLoginEnabled.checked,
        intervalMinutes: intervalLoginEnabled.checked ? intervalMinutesValue : 0
      };
      const _0x1de5e9 = {
        globalSettings: _0x2da1e2,
        debugMode: _0x1f9c9e.checked,
        discord_tabOpenCooldownSeconds: _0x44f337,
        discord_skuCooldownSeconds: _0x17b6c6,
        scheduledLogin: scheduledLoginData
      };
      if (_0x3987e0.checked) {
        const _0x446a6d = await chrome.storage.local.get("enabled");
        _0x1de5e9.enabled = _0x446a6d.enabled !== undefined ? _0x446a6d.enabled : false;
      } else {
        await chrome.storage.local.remove("enabled");
      }
      await chrome.storage.local.set(_0x1de5e9);
      _0x484f87("Global settings saved successfully!");
      chrome.runtime.sendMessage({
        action: "globalSettingsUpdated",
        settings: _0x1de5e9
      }).catch(_0x4819b5 => console.warn("Could not notify about global settings update:", _0x4819b5));
      chrome.runtime.sendMessage({
        action: "scheduleLoginUpdated",
        scheduledLogin: scheduledLoginData
      }).catch(_0x4819b5 => console.warn("Could not notify about scheduled login update:", _0x4819b5));
      updateNextLoginDisplay(scheduledLoginData);
    } catch (_0x4eb9ef) {
      console.error("Error saving global settings:", _0x4eb9ef);
      _0x487e55("Error saving global settings: " + _0x4eb9ef.message);
    }
  }
  async function updateExportData() {
    try {
      const _0x77f3a0 = await chrome.storage.local.get("profiles");
      const _0x3a5938 = _0x77f3a0.profiles || [];
      _0x19c921.value = JSON.stringify(_0x3a5938, null, 2);
    } catch (_0x40eca0) {
      console.error("Error generating export data:", _0x40eca0);
      _0x19c921.value = "Error loading profiles for export.";
    }
  }
  async function _0x2c81b3() {
    let _0x582c93 = [];
    try {
      const _0x264239 = _0x147a5d.value;
      if (!_0x264239 || _0x264239.trim() === "") {
        _0x487e55("Import data cannot be empty.");
        return;
      }
      _0x582c93 = JSON.parse(_0x264239);
      if (!Array.isArray(_0x582c93)) {
        _0x487e55("Invalid profile data format. Expected an array of profiles.");
        return;
      }
      const _0x4d8a0c = [];
      const _0x302ee7 = [];
      _0x582c93.forEach((_0x7fabe4, _0x522c0e) => {
        if (typeof _0x7fabe4 !== "object" || _0x7fabe4 === null) {
          _0x302ee7.push({
            index: _0x522c0e,
            reason: "Not a valid object"
          });
          return;
        }
        if (!_0x7fabe4.name || _0x7fabe4.name.trim() === "") {
          _0x302ee7.push({
            index: _0x522c0e,
            reason: "Missing profile name"
          });
          return;
        }
        let _0x147a1c = false;
        let _0x4b2140 = [];
        if (_0x7fabe4.cardNumber && _0x7fabe4.cvv && _0x7fabe4.expiryMonth && _0x7fabe4.expiryYear) {
          _0x147a1c = true;
          console.log("Profile " + _0x522c0e + ": Found payment data in direct structure");
        } else if (_0x7fabe4.paymentMethod && typeof _0x7fabe4.paymentMethod === "object") {
          const _0x8a2396 = _0x7fabe4.paymentMethod;
          if (_0x8a2396.cardNumber && _0x8a2396.cvv && _0x8a2396.expiryMonth && _0x8a2396.expiryYear) {
            _0x147a1c = true;
            console.log("Profile " + _0x522c0e + ": Found payment data in paymentMethod structure");
          } else {
            _0x4b2140.push("paymentMethod structure missing required fields");
          }
        } else if (_0x7fabe4.payment && typeof _0x7fabe4.payment === "object") {
          const _0x339773 = _0x7fabe4.payment;
          if (_0x339773.cardNumber && _0x339773.cvv && _0x339773.expiryMonth && _0x339773.expiryYear) {
            _0x147a1c = true;
            console.log("Profile " + _0x522c0e + ": Found payment data in payment structure");
          } else {
            _0x4b2140.push("payment structure missing required fields");
          }
        } else {
          _0x4b2140.push("no payment data found in any supported structure");
        }
        if (!_0x147a1c) {
          _0x302ee7.push({
            index: _0x522c0e,
            reason: "Missing payment data: " + _0x4b2140.join(", ")
          });
          return;
        }
        const _0x1e7f0c = {
          ..._0x7fabe4,
          id: _0x7fabe4.id || _0x2066e9()
        };
        let _0x109e73 = {};
        if (_0x7fabe4.cardNumber) {
          _0x109e73 = {
            cardNumber: _0x7fabe4.cardNumber,
            cvv: _0x7fabe4.cvv,
            expiryMonth: _0x7fabe4.expiryMonth,
            expiryYear: _0x7fabe4.expiryYear
          };
        } else if (_0x7fabe4.paymentMethod) {
          const _0x39bc49 = _0x7fabe4.paymentMethod;
          _0x109e73 = {
            cardNumber: _0x39bc49.cardNumber,
            cvv: _0x39bc49.cvv,
            expiryMonth: _0x39bc49.expiryMonth,
            expiryYear: _0x39bc49.expiryYear
          };
        } else if (_0x7fabe4.payment) {
          const _0x541059 = _0x7fabe4.payment;
          _0x109e73 = {
            cardNumber: _0x541059.cardNumber,
            cvv: _0x541059.cvv,
            expiryMonth: _0x541059.expiryMonth,
            expiryYear: _0x541059.expiryYear
          };
        }
        _0x1e7f0c.cardNumber = _0x109e73.cardNumber;
        _0x1e7f0c.cvv = _0x109e73.cvv;
        _0x1e7f0c.expiryMonth = _0x109e73.expiryMonth;
        _0x1e7f0c.expiryYear = _0x109e73.expiryYear;
        _0x1e7f0c.paymentMethod = {
          cardNumber: _0x109e73.cardNumber,
          cvv: _0x109e73.cvv,
          expiryMonth: _0x109e73.expiryMonth,
          expiryYear: _0x109e73.expiryYear
        };
        _0x1e7f0c.payment = {
          cardNumber: _0x109e73.cardNumber,
          cvv: _0x109e73.cvv,
          expiryMonth: _0x109e73.expiryMonth,
          expiryYear: _0x109e73.expiryYear
        };
        _0x4d8a0c.push(_0x1e7f0c);
      });
      if (_0x302ee7.length > 0) {
        console.warn(_0x302ee7.length + " profiles were filtered out during import:");
        _0x302ee7.forEach(({
          index: _0x1d9bd5,
          reason: _0x57443a
        }) => {
          console.warn("  Profile " + _0x1d9bd5 + ": " + _0x57443a);
        });
        if (_0x4d8a0c.length === 0) {
          _0x487e55("No valid profiles found. Issues found:\n" + _0x302ee7.map(_0x515f1d => "Profile " + (_0x515f1d.index + 1) + ": " + _0x515f1d.reason).join("\n"));
          return;
        } else {
          _0x484f87("Warning: " + _0x302ee7.length + " profiles were skipped due to validation errors. " + _0x4d8a0c.length + " valid profiles will be imported.");
        }
      }
      _0x4d8a0c.forEach(_0x5bd635 => {
        if (!_0x5bd635.id || _0x51324d.checked) {
          _0x5bd635.id = _0x2066e9();
        }
      });
      const _0x7c1938 = await chrome.storage.local.get(["profiles", "selectedProfile"]);
      let _0x378e4a = _0x7c1938.profiles || [];
      let _0x320843 = _0x7c1938.selectedProfile;
      let _0x4d8d9f = [];
      let _0x2482ef = "";
      if (_0x51324d.checked) {
        _0x4d8d9f = _0x4d8a0c;
        _0x2482ef = "Replaced all profiles with " + _0x4d8a0c.length + " imported profiles.";
        _0x320843 = _0x4d8d9f.length > 0 ? _0x4d8d9f[0].id : "";
      } else {
        const _0x5e8a24 = new Set(_0x378e4a.map(_0x1d62bc => _0x1d62bc.id));
        let addedCount = 0;
        _0x4d8a0c.forEach(_0xb32d5d => {
          if (!_0x5e8a24.has(_0xb32d5d.id)) {
            _0x378e4a.push(_0xb32d5d);
            _0x5e8a24.add(_0xb32d5d.id);
            addedCount++;
          }
        });
        _0x4d8d9f = _0x378e4a;
        _0x2482ef = "Merged profiles. Added " + addedCount + " new profiles. Total: " + _0x4d8d9f.length + ".";
        if (!_0x320843 && _0x4d8d9f.length > 0) {
          _0x320843 = _0x4d8d9f[0].id;
        }
      }
      await chrome.storage.local.set({
        profiles: _0x4d8d9f,
        selectedProfile: _0x320843
      });
      await _0x2dc50e();
      _0x484f87(_0x2482ef);
      _0x147a5d.value = "";
      chrome.runtime.sendMessage({
        action: "profileUpdated"
      }).catch(_0x5b09b1 => console.warn("Could not notify about profile import:", _0x5b09b1));
      if (_0x320843 !== _0x7c1938.selectedProfile) {
        chrome.runtime.sendMessage({
          action: "profileSelected",
          profileId: _0x320843
        }).catch(_0x2ff88c => console.warn("Could not notify about profile selection after import:", _0x2ff88c));
      }
    } catch (_0x53c59d) {
      console.error("Error importing profiles:", _0x53c59d);
      if (_0x53c59d instanceof SyntaxError) {
        _0x487e55("Error importing profiles: Invalid JSON format.");
      } else {
        _0x487e55("Error importing profiles: " + _0x53c59d.message);
      }
    }
  }
  function _0x484f87(_0x195abb) {
    _0x518653.textContent = _0x195abb;
    _0x518653.style.display = "block";
    _0x2b3a1f.style.display = "none";
    setTimeout(() => {
      _0x518653.style.display = "none";
    }, 3000);
  }
  function _0x487e55(_0x10f3bf) {
    _0x2b3a1f.textContent = _0x10f3bf;
    _0x2b3a1f.style.display = "block";
    _0x518653.style.display = "none";
  }
  async function _0x458448() {
    try {
      const _0xd76aa5 = await chrome.storage.local.get(["targetEmail", "targetPassword"]);
      if (_0x1ea2e6) {
        _0x1ea2e6.value = _0xd76aa5.targetEmail || "";
      }
      if (_0x3e5f5b) {
        _0x3e5f5b.value = _0xd76aa5.targetPassword || "";
      }
      console.log("Target credentials loaded");
    } catch (_0x5989fc) {
      console.error("Error loading Target credentials:", _0x5989fc);
    }
  }
  async function _0x5c5224() {
    try {
      const _0x3f1eeb = {
        targetEmail: _0x1ea2e6.value.trim(),
        targetPassword: _0x3e5f5b.value
      };
      await chrome.storage.local.set(_0x3f1eeb);
      console.log("Target credentials saved");
    } catch (_0x2ca94e) {
      console.error("Error saving Target credentials:", _0x2ca94e);
      _0x487e55("Error saving Target credentials");
    }
  }
  async function _0x10e108() {
    try {
      await chrome.storage.local.remove(["targetEmail", "targetPassword"]);
      if (_0x1ea2e6) {
        _0x1ea2e6.value = "";
      }
      if (_0x3e5f5b) {
        _0x3e5f5b.value = "";
      }
      _0x484f87("Target credentials cleared successfully!");
      console.log("Target credentials cleared");
    } catch (_0x389d70) {
      console.error("Error clearing Target credentials:", _0x389d70);
      _0x487e55("Error clearing Target credentials");
    }
  }
  
  async function _0x4d8f2a() {
    try {
      console.log("Test login button clicked");
      _0x484f87("Opening Target.com/account for login test...");
      
      // Send message to background script to trigger login
      chrome.runtime.sendMessage({ action: 'testLogin' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending test login message:", chrome.runtime.lastError);
          _0x487e55("Error triggering test login: " + chrome.runtime.lastError.message);
        } else if (response && response.success) {
          _0x484f87("Test login initiated! Check the new tab.");
        } else {
          _0x487e55("Test login failed: " + (response?.error || "Unknown error"));
        }
      });
    } catch (error) {
      console.error("Error in test login:", error);
      _0x487e55("Error triggering test login: " + error.message);
    }
  }
  
  function _0x3226fb(_0x20cfcc) {
    if (!_0x20cfcc) {
      return "";
    }
    return _0x20cfcc.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function updateNextLoginDisplay(scheduledLoginData) {
    if (!scheduledLoginData || (!scheduledLoginData.enabled && !scheduledLoginData.randomHourly && !scheduledLoginData.intervalEnabled)) {
      nextLoginDisplay.textContent = "Not scheduled";
      nextLoginDisplay.style.color = "#666";
      return;
    }
    
    let displayText = [];
    
    if (scheduledLoginData.enabled && scheduledLoginData.times) {
      const now = new Date();
      const times = scheduledLoginData.times.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      if (times.length > 0) {
        const nextTimes = times.map(timeStr => {
          const [hours, minutes] = timeStr.split(":").map(Number);
          const scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);
          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }
          return scheduledTime;
        }).sort((a, b) => a - b);
        
        const nextTime = nextTimes[0];
        const timeStr = nextTime.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });
        
        displayText.push(timeStr + (scheduledLoginData.daily ? " (Daily)" : " (Once)"));
        
        if (times.length > 1) {
          displayText.push(" + " + (times.length - 1) + " more time" + (times.length > 2 ? "s" : ""));
        }
      }
    }
    
    if (scheduledLoginData.randomHourly) {
      // Generate next 5 random login times for display
      const now = new Date();
      const randomTimes = [];
      for (let i = 0; i < 5; i++) {
        const randomMinute = Math.floor(Math.random() * 60);
        const nextLogin = new Date();
        nextLogin.setHours(now.getHours() + i + 1, randomMinute, 0, 0);
        randomTimes.push(nextLogin.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }));
      }
      displayText.push((displayText.length > 0 ? " | " : "") + "Random hourly: " + randomTimes.join(", "));
    }
    
    if (scheduledLoginData.intervalEnabled && scheduledLoginData.intervalMinutes > 0) {
      displayText.push((displayText.length > 0 ? " | " : "") + "Every " + scheduledLoginData.intervalMinutes + " minutes");
    }
    
    nextLoginDisplay.textContent = displayText.join('');
    nextLoginDisplay.style.color = "#2196F3";
  }
}); // Fast Mode checkbox handler
(function () {
  const fastModeCheckbox = document.getElementById("fast-mode");

  // Load Fast Mode setting
  async function loadFastMode() {
    try {
      const result = await chrome.storage.local.get(["globalSettings"]);
      const globalSettings = result.globalSettings || {};
      if (fastModeCheckbox) {
        fastModeCheckbox.checked = globalSettings.fastMode !== undefined ? globalSettings.fastMode : true;
      }
    } catch (error) {
      console.error("Error loading Fast Mode setting:", error);
    }
  }

  // Save Fast Mode setting (called by existing save handler)
  window.saveFastModeSetting = async function () {
    if (!fastModeCheckbox) {
      return {};
    }
    return {
      fastMode: fastModeCheckbox.checked
    };
  };

  // Load on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFastMode);
  } else {
    loadFastMode();
  }

  // Patch the existing save function
  const originalSaveBtn = document.getElementById("save-settings-btn");
  if (originalSaveBtn) {
    originalSaveBtn.addEventListener("click", async function (e) {
      try {
        const result = await chrome.storage.local.get(["globalSettings"]);
        const globalSettings = result.globalSettings || {};
        globalSettings.fastMode = fastModeCheckbox ? fastModeCheckbox.checked : true;
        await chrome.storage.local.set({
          globalSettings
        });
      } catch (error) {
        console.error("Error saving Fast Mode:", error);
      }
    });
  }
})();