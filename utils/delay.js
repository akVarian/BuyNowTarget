// utils/delay.js - Centralized delay helper (Attaches to window.autocheckoutDelay)

/**
 * Delay for a specified time, respecting fastMode and addRandomDelays settings
 * @param {number} minDelay - Minimum delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds (optional, defaults to minDelay)
 * @returns {Promise<void>} - Promise that resolves after the delay
 */
async function delay(minDelay, maxDelay) {
  // Get settings from chrome.storage
  let fastMode = true; // default
  let addRandomDelays = false; // default
  
  try {
    if (chrome && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(['globalSettings']);
      if (result.globalSettings) {
        fastMode = result.globalSettings.fastMode !== undefined ? result.globalSettings.fastMode : true;
        addRandomDelays = result.globalSettings.addRandomDelays || false;
      }
    }
  } catch (error) {
    console.warn('delay.js: Could not retrieve settings, using defaults:', error);
  }
  
  // Calculate actual delay
  let actualDelay = minDelay;
  
  if (fastMode) {
    // Fast mode: use minimal waits (5ms minimum for maximum speed)
    actualDelay = Math.max(5, Math.min(minDelay, maxDelay || minDelay) * 0.2); // Reduce to 20% of normal delay
  } else {
    // Normal mode
    if (maxDelay !== undefined && addRandomDelays) {
      // Add random delays between min and max
      actualDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    } else {
      actualDelay = minDelay;
    }
  }
  
  return new Promise(resolve => setTimeout(resolve, actualDelay));
}

/**
 * Wait for an element to appear on the page
 * @param {string} selector - CSS selector for the element
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 5000)
 * @returns {Promise<Element|null>} - Promise that resolves with the element or null if not found
 */
async function waitForElement(selector, timeout = 5000) {
  // Get settings from chrome.storage
  let fastMode = true; // default
  
  try {
    if (chrome && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(['globalSettings']);
      if (result.globalSettings) {
        fastMode = result.globalSettings.fastMode !== undefined ? result.globalSettings.fastMode : true;
      }
    }
  } catch (error) {
    console.warn('delay.js: Could not retrieve settings for waitForElement, using defaults:', error);
  }
  
  // Adjust polling interval based on fast mode (ultra-fast polling in fast mode)
  const pollInterval = fastMode ? 5 : 100;
  
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  console.log('delay.js: Element not found within timeout:', selector);
  return null;
}

// Attach to window object for global access
window.autocheckoutDelay = {
  delay,
  waitForElement
};

console.log('utils/delay.js: Script loaded.');
