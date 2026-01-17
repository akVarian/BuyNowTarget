function findButtonByText(_0xf907ad, _0x2318ba = true) {
  const _0x393d1d = Array.from(document.querySelectorAll("button"));
  for (const _0x312a9d of _0xf907ad) {
    const _0x8f9d1b = _0x393d1d.find(_0x2db44e => {
      const _0x13fa5f = _0x2db44e.textContent.trim().toLowerCase();
      if (_0x2318ba) {
        return _0x13fa5f.includes(_0x312a9d.toLowerCase());
      } else {
        return _0x13fa5f === _0x312a9d.toLowerCase();
      }
    });
    if (_0x8f9d1b) {
      return _0x8f9d1b;
    }
  }
  return null;
}
function findElementWithSelectors(_0x3a4180) {
  for (const _0x5800d0 of _0x3a4180) {
    const _0x1b737a = document.querySelector(_0x5800d0);
    if (_0x1b737a) {
      return _0x1b737a;
    }
  }
  return null;
}
async function fillFieldBySelectors(_0x5a92c6, value) {
  if (!value) {
    return false;
  }
  const _0x5defac = findElementWithSelectors(_0x5a92c6);
  if (!_0x5defac) {
    return false;
  }
  try {
    _0x5defac.focus();
    await sleep(100);
    _0x5defac.value = "";
    _0x5defac.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    await sleep(100);
    _0x5defac.value = value;
    _0x5defac.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    _0x5defac.dispatchEvent(new Event("change", {
      bubbles: true
    }));
    return true;
  } catch (_0x27f0c2) {
    console.error("Error filling field with selectors [" + _0x5a92c6.join(", ") + "]:", _0x27f0c2);
    return false;
  }
}
function createElementWatcher(_0x580ebc) {
  const {
    elementActions = {},
    shouldObserve = () => true,
    subtree = true,
    debounceMs = 100
  } = _0x580ebc;
  let _0x3f1301 = null;
  const _0x3a3276 = new MutationObserver(_0x4313a1 => {
    if (!shouldObserve()) {
      return;
    }
    if (_0x3f1301) {
      clearTimeout(_0x3f1301);
    }
    _0x3f1301 = setTimeout(() => {
      for (const [_0x554c6f, _0x138ec3] of Object.entries(elementActions)) {
        const _0x3cf846 = document.querySelector(_0x554c6f);
        if (_0x3cf846) {
          _0x138ec3(_0x3cf846);
        }
      }
    }, debounceMs);
  });
  _0x3a3276.observe(document.body, {
    childList: true,
    subtree: subtree,
    attributes: true
  });
  return _0x3a3276;
}
function createButtonWatcher(_0x54899d) {
  const {
    selector: _0x518920,
    onClick: _0x24a3c2,
    isEnabled = () => true,
    buttonType = "generic"
  } = _0x54899d;
  return createElementWatcher({
    elementActions: {
      [_0x518920]: _0x1c4a8c => {
        if (isEnabled()) {
          _0x24a3c2(_0x1c4a8c, buttonType);
        }
      }
    },
    shouldObserve: isEnabled
  });
}
function isElementVisible(_0x229c4c) {
  if (!_0x229c4c) {
    return false;
  }
  const style = window.getComputedStyle(_0x229c4c);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }
  const _0x2089ce = _0x229c4c.getBoundingClientRect();
  return _0x2089ce.width > 0 && _0x2089ce.height > 0;
}
function isElementDisabled(_0x17846d) {
  if (!_0x17846d) {
    return true;
  }
  return _0x17846d.disabled === true || _0x17846d.getAttribute("aria-disabled") === "true" || _0x17846d.classList.contains("disabled");
}
window.elementFinder = {
  findButtonByText: findButtonByText,
  findElementWithSelectors: findElementWithSelectors,
  fillFieldBySelectors: fillFieldBySelectors,
  createElementWatcher: createElementWatcher,
  createButtonWatcher: createButtonWatcher,
  isElementVisible: isElementVisible,
  isElementDisabled: isElementDisabled
};
console.log("common/element-finder.js: Script loaded.");