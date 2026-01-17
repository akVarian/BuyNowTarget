console.log("common/utils.js: Script start executing.");
function sleep(_0x332e7d, _0x239208 = false, _0x179f57 = 0.3) {
  if (_0x239208) {
    const _0xc90bda = _0x332e7d * (1 - _0x179f57);
    const _0x5b1ae1 = _0x332e7d * (1 + _0x179f57);
    _0x332e7d = Math.floor(Math.random() * (_0x5b1ae1 - _0xc90bda + 1)) + _0xc90bda;
  }
  return new Promise(_0x51dc50 => setTimeout(_0x51dc50, _0x332e7d));
}
async function waitForElement(_0xf5b8af, _0x145965 = 5000, _0x19804a = 100) {
  const _0x335ef3 = Date.now();
  while (Date.now() - _0x335ef3 < _0x145965) {
    const _0xef6361 = document.querySelector(_0xf5b8af);
    if (_0xef6361) {
      return _0xef6361;
    }
    await sleep(_0x19804a);
  }
  console.log("Element not found within timeout: " + _0xf5b8af);
  return null;
}
async function findElementWithSelectors(_0x536bd4, _0x333097 = 5000) {
  for (const _0xc88826 of _0x536bd4) {
    const _0xf078de = await waitForElement(_0xc88826, _0x333097 / _0x536bd4.length);
    if (_0xf078de) {
      return {
        element: _0xf078de,
        selector: _0xc88826
      };
    }
  }
  return {
    element: null,
    selector: null
  };
}
async function clickElement(_0x38d9c3, _0x115b9a = "button") {
  if (!_0x38d9c3) {
    return false;
  }
  console.log("Clicking " + _0x115b9a + ": " + _0x38d9c3.textContent?.trim());
  _0x38d9c3.scrollIntoView({
    behavior: "auto",
    block: "center"
  });
  await sleep(100);
  try {
    _0x38d9c3.click();
    console.log("Direct click successful on " + _0x115b9a);
    return true;
  } catch (_0x4d461a) {
    console.log("Direct click failed on " + _0x115b9a + ":", _0x4d461a);
    try {
      _0x38d9c3.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      console.log("MouseEvent click successful on " + _0x115b9a);
      return true;
    } catch (_0x291ccf) {
      console.log("MouseEvent click failed on " + _0x115b9a + ":", _0x291ccf);
      try {
        _0x38d9c3.focus();
        await sleep(100);
        _0x38d9c3.dispatchEvent(new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true
        }));
        console.log("Focus + Enter click successful on " + _0x115b9a);
        return true;
      } catch (_0x3636f9) {
        console.log("All click methods failed on " + _0x115b9a + ":", _0x3636f9);
        return false;
      }
    }
  }
}
async function fillField(_0x431155, value) {
  if (!_0x431155 || value === null || value === undefined) {
    return false;
  }
  try {
    _0x431155.focus();
    await sleep(100);
    _0x431155.value = "";
    _0x431155.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    await sleep(100);
    _0x431155.value = value;
    _0x431155.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    _0x431155.dispatchEvent(new Event("change", {
      bubbles: true
    }));
    return true;
  } catch (_0x494e04) {
    console.error("Error filling field:", _0x494e04);
    return false;
  }
}
function updateStatus(_0x565704, className) {
  console.log("Status update:", _0x565704);
  try {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
      setTimeout(() => {
        try {
          const _0x24a636 = chrome.runtime.sendMessage({
            action: "updateStatus",
            text: _0x565704,
            class: className
          }).catch(() => {});
          setTimeout(() => {
            try {
              if (_0x24a636 && typeof _0x24a636.catch === "function") {
                _0x24a636.catch(() => {});
              }
            } catch (_0x40b122) {}
          }, 1000);
          let _0x51bb14 = "";
          if (className === "status-running") {
            _0x51bb14 = "ON";
          }
          if (className === "status-complete") {
            _0x51bb14 = "OK";
          }
          setTimeout(() => {
            try {
              chrome.runtime.sendMessage({
                action: "updateBadge",
                text: _0x51bb14,
                color: _0x51bb14 === "ERR" ? "#FF0000" : "#cc0000"
              }).catch(() => {});
            } catch (_0x3ce5c4) {}
          }, 100);
        } catch (_0x5c8a14) {}
      }, 0);
    }
  } catch (_0xe39bbf) {}
}
function debugLog(_0x50cb28, _0x493bbe) {
  try {
    console.log("DEBUG [" + _0x50cb28 + "]:", _0x493bbe);
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
      setTimeout(() => {
        try {
          const _0xd1ac98 = chrome.runtime.sendMessage({
            action: "debugLog",
            context: _0x50cb28,
            data: _0x493bbe
          }).catch(() => {});
          setTimeout(() => {
            try {
              if (_0xd1ac98 && typeof _0xd1ac98.catch === "function") {
                _0xd1ac98.catch(() => {});
              }
            } catch (_0x1a1d58) {}
          }, 1000);
        } catch (_0x598606) {}
      }, 0);
    }
  } catch (_0x578aa5) {}
}
function getFromStorage(_0x59974e) {
  return new Promise((_0x4878a4, _0x1d6649) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const _0x4a8330 = setTimeout(() => {
          console.warn("Storage get timeout for keys: " + JSON.stringify(_0x59974e));
          _0x4878a4({});
        }, 3000);
        try {
          chrome.storage.local.get(_0x59974e, _0x5d4646 => {
            clearTimeout(_0x4a8330);
            if (chrome.runtime.lastError) {
              console.error("Storage get error:", chrome.runtime.lastError);
              _0x4878a4({});
            } else {
              _0x4878a4(_0x5d4646 || {});
            }
          });
        } catch (_0x18e01c) {
          clearTimeout(_0x4a8330);
          console.error("Error calling storage API:", _0x18e01c);
          _0x4878a4({});
        }
      } else {
        console.warn("chrome.storage.local is not available, using fallback empty object.");
        _0x4878a4({});
      }
    } catch (_0x587c27) {
      console.error("Unexpected error in getFromStorage:", _0x587c27);
      _0x4878a4({});
    }
  });
}
function saveToStorage(_0xbb68a0) {
  return new Promise(_0x2d2576 => {
    try {
      const _0x31c231 = JSON.parse(JSON.stringify(_0xbb68a0 || {}));
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const _0x44f17d = setTimeout(() => {
          console.warn("Storage save timeout - operation may not have completed");
          _0x2d2576(false);
        }, 3000);
        try {
          chrome.storage.local.set(_0x31c231, () => {
            clearTimeout(_0x44f17d);
            if (chrome.runtime.lastError) {
              console.error("Storage set error:", chrome.runtime.lastError);
              _0x2d2576(false);
            } else {
              _0x2d2576(true);
            }
          });
        } catch (_0x150d95) {
          clearTimeout(_0x44f17d);
          console.error("Error calling storage.set API:", _0x150d95);
          _0x2d2576(false);
        }
      } else {
        console.warn("chrome.storage.local is not available, save operation failed");
        _0x2d2576(false);
      }
    } catch (_0x41fd9d) {
      console.error("Unexpected error in saveToStorage:", _0x41fd9d);
      _0x2d2576(false);
    }
  });
}
async function getProfiles() {
  const _0x3bbed9 = await getFromStorage(["profiles", "selectedProfile"]);
  const _0x200a63 = _0x3bbed9.profiles || [];
  const _0xdf8618 = _0x3bbed9.selectedProfile;
  let _0x5a37ef = null;
  if (_0xdf8618 && _0x200a63.length > 0) {
    _0x5a37ef = _0x200a63.find(_0x213b18 => _0x213b18.id === _0xdf8618);
    if (!_0x5a37ef && _0x200a63.length > 0) {
      console.warn("Selected profile ID " + _0xdf8618 + " not found, using first profile as fallback.");
      _0x5a37ef = _0x200a63[0];
    }
  } else if (_0x200a63.length > 0) {
    console.log("No profile selected, defaulting to the first profile.");
    _0x5a37ef = _0x200a63[0];
  }
  return {
    profiles: _0x200a63,
    selectedProfile: _0x5a37ef
  };
}
console.log("common/utils.js: Script loaded.");