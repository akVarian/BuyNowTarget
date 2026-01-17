// Target Button Checker - Monitors for add-to-cart and preorder buttons
console.log('Target Button Checker: Loaded');

// Check if we're on a Target product page
function isTargetProductPage() {
  return window.location.hostname.includes('target.com') && 
         window.location.pathname.includes('/p/');
}

// Check for add-to-cart or preorder buttons
function checkForButtons() {
  console.log('Target Button Checker: Checking for buttons');
  
  // Common button selectors for Target.com
  const buttonSelectors = [
    'button[data-test="buyNowButton"]',
    'button[data-test="orderPickupButton"]',
    'button[data-test="shippingButton"]',
    'button[data-test="preorderButton"]',
    'button[data-test="shipItButton"]',
    'button[data-test="addToCartButton"]',
    '[data-test*="addToCart"]',
    '[data-test*="preorder"]',
    '[data-test*="buyNow"]',
    'button:contains("Buy now")',
    'button:contains("Add to cart")',
    'button:contains("Preorder")',
    'button:contains("Ship it")',
    'button:contains("Order pickup")'
  ];
  
  // Check if any buttons exist
  for (const selector of buttonSelectors) {
    try {
      const buttons = document.querySelectorAll(selector);
      if (buttons.length > 0) {
        // Check if any button is not disabled
        for (const button of buttons) {
          if (!button.disabled && !button.hasAttribute('disabled')) {
            console.log('Target Button Checker: Found active button', selector);
            return true;
          }
        }
      }
    } catch (e) {
      // Ignore selector errors (e.g., :contains pseudo-selector)
    }
  }
  
  // Also check for text content in buttons
  const allButtons = document.querySelectorAll('button');
  for (const button of allButtons) {
    const text = button.textContent?.toLowerCase() || '';
    if ((text.includes('buy now') ||
         text.includes('add to cart') || 
         text.includes('preorder') || 
         text.includes('ship it') ||
         text.includes('order pickup') ||
         text.includes('pick it up')) &&
        !button.disabled && 
        !button.hasAttribute('disabled')) {
      console.log('Target Button Checker: Found button by text', text.substring(0, 30));
      return true;
    }
  }
  
  console.log('Target Button Checker: No active buttons found');
  return false;
}

// Check if page shows out of stock
function isOutOfStock() {
  const bodyText = document.body.textContent?.toLowerCase() || '';
  return bodyText.includes('out of stock') || 
         bodyText.includes('sold out') ||
         bodyText.includes('currently unavailable') ||
         bodyText.includes('not available');
}

// Perform the check and notify background
async function performCheck() {
  if (!isTargetProductPage()) {
    console.log('Target Button Checker: Not a product page, skipping');
    return;
  }
  
  // Minimum delay for maximum speed
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const hasButtons = checkForButtons();
  const outOfStock = isOutOfStock();
  
  console.log('Target Button Checker: Results', { hasButtons, outOfStock });
  
  // If no buttons and out of stock, notify background
  if (!hasButtons || outOfStock) {
    try {
      await chrome.runtime.sendMessage({
        action: 'checkButtonAvailability',
        hasButtons: hasButtons && !outOfStock,
        outOfStock: outOfStock,
        url: window.location.href
      });
      console.log('Target Button Checker: Notified background script');
    } catch (error) {
      console.error('Target Button Checker: Error sending message', error);
    }
  }
}

// Run check on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', performCheck);
} else {
  performCheck();
}

// Ultra-fast follow-up checks for dynamic content
setTimeout(performCheck, 200);
setTimeout(performCheck, 500);

console.log('Target Button Checker: Initialized');
