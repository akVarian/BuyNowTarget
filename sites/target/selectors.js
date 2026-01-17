// Target site selectors for automated checkout
// This file contains CSS selectors for various elements on Target.com

const productPageSelectors = {
  outOfStock: [
    '[data-test="outOfStock"]',
    '[data-test="oosMessage"]',
    '.oos-message',
    'button[disabled][data-test="shipItButton"]',
    'button[disabled][data-test="addToCartButton"]',
    '[data-test="soldOutContainer"]',
    '[data-test="shippingNotAvailable"]'
  ],
  deliveryOptions: {
    shipping: [
      'button[data-test="fulfillment-cell-shipping"]',
      'button[data-test="shipItButton"]',
      'button[data-test="deliveryButton"]',
      'button[aria-label*="shipping"]',
      'button[aria-label*="ship"]'
    ],
    pickup: [
      'button[data-test="fulfillment-cell-pickup"]',
      'button[data-test="orderPickupButton"]',
      'button[data-test="pickupButton"]',
      'button[aria-label*="pickup"]',
      'button[aria-label*="pick up"]'
    ],
    delivery: [
      'button[data-test="fulfillment-cell-delivery"]',
      'button[data-test="deliveryButton"]',
      'button[data-test="sameDay"]',
      'button[aria-label*="delivery"]',
      'button[aria-label*="same day"]'
    ]
  },
  quantity: {
    stepper: {
      increment: '[data-test="stepperIncrement"]',
      decrement: '[data-test="stepperDecrement"]',
      value: '[data-test="stepperValue"]'
    },
    dropdown: [
      'select[data-test="quantitySelect"]',
      '[id^="select-"]',
      'select[aria-label*="quantity"]',
      '[class*="quantity-selector"]',
      '[class*="QuantitySelector"]',
      'button[data-test="quantity-selector"]'
    ],
    dropdownOptions: 'a.OptionItem_styles_optionItem__51Tn6',
    genericDropdownOptions: 'a[aria-label][href="#"]'
  },
  addToCart: [
    'button[data-test="buyNowButton"]',
    'button[data-test="shipItButton"]',
    'button[data-test="orderPickupButton"]',
    'button[data-test="deliveryButton"]',
    'button[data-test="addToCartButton"]',
    'button[id^="addToCartButtonOrTextIdFor"]'
  ],
  buyNow: [
    'button[data-test="buyNowButton"]',
    'button[aria-label*="Buy now"]',
    'button:contains("Buy now")'
  ]
};

const checkoutPageSelectors = {
  loadingSpinner: [
    '.Spinner',
    '[data-test="spinner"]',
    '[class*="spinner"]',
    '[class*="loading"]',
    '[class*="Loader"]',
    '[aria-busy="true"]'
  ],
  shippingForm: [
    '[data-test="addressFormContainer"]',
    'form[class*="shipping"]',
    'div[class*="Address"]'
  ],
  shippingFields: {
    firstName: [
      '[data-test="firstName"]',
      '[name="firstName"]',
      'input[placeholder*="First"]'
    ],
    lastName: [
      '[data-test="lastName"]',
      '[name="lastName"]',
      'input[placeholder*="Last"]'
    ],
    address1: [
      '[data-test="address"]',
      '[name="address"]',
      'input[placeholder*="Address"]'
    ],
    address2: [
      '[data-test="apartment"]',
      '[name="apartment"]',
      'input[placeholder*="Apt"]'
    ],
    city: [
      '[data-test="city"]',
      '[name="city"]',
      'input[placeholder*="City"]'
    ],
    state: [
      '[data-test="state"]',
      '[name="state"]',
      'select[aria-label*="State"]'
    ],
    zip: [
      '[data-test="zipCode"]',
      '[name="zipCode"]',
      'input[placeholder*="ZIP"]'
    ],
    phone: [
      '[data-test="phoneNumber"]',
      '[name="phoneNumber"]',
      'input[placeholder*="Phone"]'
    ],
    email: [
      '[data-test="email"]',
      '[name="email"]',
      'input[type="email"]'
    ]
  },
  continueButtons: {
    shipping: [
      '[data-test="fulfillment-continue-button"]',
      'button[data-test="shippingButton"]',
      '[data-test="save_and_continue_button_step_SHIPPING"]',
      'button[data-test^="save_and_continue_button"]'
    ],
    saveAndContinue: [
      '[data-test="save_and_continue_button_step_SHIPPING"]',
      'button[data-test^="save_and_continue_button"]',
      'button:contains("Save and continue")'
    ]
  },
  paymentForm: [
    '[data-test="credit-card-form"]',
    'form[class*="payment"]',
    'div[class*="CreditCard"]'
  ],
  addPaymentButton: [
    '[data-test="add-new-payment"]',
    '[data-test="checkout-unselected-creditdebit"]'
  ],
  paymentFields: {
    cardNumber: [
      'input[name*="cardNumber"]',
      'input[placeholder*="card number"]'
    ],
    nameOnCard: [
      '[data-test="creditCardInput-cardName"]',
      '[name*="nameOnCard"]',
      'input[placeholder*="name on card"]'
    ],
    expiryMonth: [
      '[data-test="expDateMonth"]',
      '[name*="expMonth"]',
      'select[aria-label*="Month"]'
    ],
    expiryYear: [
      '[data-test="expDateYear"]',
      '[name*="expYear"]',
      'select[aria-label*="Year"]'
    ],
    cvv: [
      '[data-test="cvvInput"]',
      '[name*="securityCode"]',
      'input[placeholder*="CVV"]'
    ]
  },
  cardNumberFrame: [
    'iframe[id^="card-number"]',
    'iframe[name*="creditCard"]',
    'iframe[title*="card"]'
  ],
  cvvVerification: {
    input: [
      '#enter-cvv',
      'input[name*="cvv"]',
      'input[name*="securityCode"]',
      'input[placeholder*="CVV"]',
      'input[data-test="cvvInput"]',
      'input[aria-label*="Security code"]'
    ],
    confirmButton: [
      'button[data-test="confirm-button"]',
      'button[aria-label*="confirm"]'
    ]
  },
  cardVerification: {
    input: [
      '#credit-card-number-input',
      'input[name*="cardNumber"]',
      'input[name*="creditCard"]',
      'input[placeholder*="card number"]',
      'input[aria-label*="card number"]',
      'input[type="tel"]'
    ],
    verifyButton: [
      'button[data-test="verify-card-button"]',
      'button[aria-label*="verify"]'
    ]
  },
  placeOrderButton: 'button[data-test="placeOrderButton"]',
  termsCheckbox: [
    '[data-test="checkbox-terms"]',
    'input[type="checkbox"][name*="terms"]',
    'input[type="checkbox"][id*="terms"]'
  ],
  paymentMethodSelection: {
    selectPaymentText: [
      '*[text()*="select payment type" i]',
      '*[text()*="Select payment type" i]',
      '*[text()*="SELECT PAYMENT TYPE" i]'
    ],
    paymentRadioButtons: [
      'input[type="radio"][name="payment-card-radio"]',
      'input[type="radio"][data-test*="payment-card-radio"]',
      '.styles_ndsCellRadio__8SdPD input[type="radio"]'
    ],
    firstPaymentRadio: [
      'input[type="radio"][name="payment-card-radio"]:first-of-type',
      'input[type="radio"][data-test*="payment-card-radio"]:first-of-type',
      '.styles_ndsCellRadio__8SdPD input[type="radio"]:first-of-type'
    ]
  }
};

const popupSelectors = {
  declineProtectionButton: [
    '[data-test="espModalContent-declineCoverageButton"]',
    'button[aria-label="decline coverage"]',
    'button[data-test="NoThanksButton"]'
  ],
  noThanksButton: [
    'button[data-test="NoThanksButton"]',
    'button[aria-label*="no thanks"]',
    'button[aria-label*="skip"]',
    'button[data-test*="decline"]',
    'button.decline-button'
  ],
  continueButton: [
    'button[data-test="continueButton"]',
    'button[aria-label*="continue"]',
    'button.continue-button',
    'button[type="submit"]'
  ],
  errorPopupOkButton: [
    'button[data-test="dismiss-warning-button"]',
    'button[data-test="dismiss-alert-button"]',
    'button[data-test="error-dismiss-button"]',
    'button[data-test="modal-dismiss-button"]',
    'button.styles_ndsBaseButton__W8Gl7.styles_md__X_r95.styles_mdGap__9J0yq.styles_fullWidth__3XX6f.styles_ndsButton__XOOOH.styles_md__Yc3tr.styles_filleddefault__7QnWt.h-margin-a-none',
    'button.styles_ndsBaseButton__W8Gl7.styles_ndsButton__XOOOH.styles_filleddefault__7QnWt',
    'button.styles_ndsButton__XOOOH[type="button"]',
    'button.styles_ndsButton__XOOOH',
    'button[class*="styles_ndsButton"]',
    'button[class*="styles_filleddefault"]',
    'button[class*="ndsButton"]',
    '[class*="alert"] button',
    '[class*="Alert"] button',
    '[class*="modal"] button',
    '[class*="Modal"] button',
    '[role="dialog"] button',
    '[role="alertdialog"] button',
    'button[class*="warning"]',
    'button[class*="error"]',
    'button[class*="dismiss"]',
    'button[class*="close"]',
    'button:contains("OK")',
    'button:contains("Ok")',
    'button:contains("Dismiss")',
    'button:contains("Close")',
    'button:contains("Try Again")',
    'button:contains("Continue")',
    'button:contains("Got it")',
    'button[aria-label*="dismiss"]',
    'button[aria-label*="close"]',
    'button[aria-label*="ok"]',
    'button[aria-label*="try again"]',
    'button[aria-label*="continue"]'
  ],
  errorPopupContent: [
    '.styles_content__WBF0i',
    '.styles_ndsAlertWarning__Hw0m1',
    '[class*="alert-content"]',
    '[class*="error-content"]',
    '[class*="warning-content"]',
    '[data-test="error-message"]',
    '[role="alert"]'
  ],
  modalContainers: [
    '[role="dialog"]',
    '[role="alertdialog"]',
    '.modal',
    '[class*="modal"]',
    '[class*="Modal"]',
    '[class*="popup"]',
    '[class*="Popup"]',
    '[data-test*="popup"]',
    '[class*="Alert"]',
    '.styles_modal__container',
    '[data-test*="modal"]',
    'div[class*="modal"]'
  ],
  busierThanExpectedPopup: [
    '*:contains("busier than we expected")',
    '*[text()*="busier than we expected" i]',
    '.styles_content__WBF0i:contains("busier")'
  ],
  highDemandCartPopup: [
    '*:contains("High Demand item in cart")',
    '*[text()*="High Demand item in cart" i]',
    '*:contains("high demand")',
    '*[text()*="limiting how many guests can check out" i]'
  ],
  checkoutBusyPopup: [
    '*:contains("Checkout is busy")',
    '*[text()*="Checkout is busy" i]',
    '*:contains("checkout is busy")'
  ],
  couldNotCompleteOrderPopup: [
    '*:contains("Couldn\'t complete your order")',
    '*[text()*="Couldn\'t complete your order" i]',
    '*:contains("We couldn\'t complete your order")',
    '*:contains("One or more items in your cart may no longer be available")',
    '*[text()*="may no longer be available" i]',
    '*:contains("no longer be available")'
  ],
  temporarilyUnavailablePopup: [
    '*:contains("temporarily unavailable")',
    '*[text()*="temporarily unavailable" i]',
    '*:contains("try again in a few moments")',
    '*[text()*="try again" i]'
  ],
  genericErrorPopup: [
    '*:contains("error occurred")',
    '*:contains("something went wrong")',
    '*:contains("please try again")',
    '*[text()*="error" i]',
    '*[text()*="wrong" i]'
  ]
};

const loginPageSelectors = {
  loginForm: [
    'form[name="login"]',
    'form[id*="login"]',
    'form[class*="login"]',
    '[data-test="login-form"]',
    '.login-form'
  ],
  loginFields: {
    username: [
      '#username',
      '[name="username"]',
      '[data-test="username"]',
      'input[type="email"]',
      'input[placeholder*="email"]',
      'input[placeholder*="Username"]',
      'input[aria-label*="username"]',
      'input[aria-label*="email"]'
    ],
    password: [
      '#password',
      '[name="password"]',
      '[data-test="password"]',
      '[data-test="login-password"]',
      'input[type="password"]',
      'input[placeholder*="Password"]',
      'input[aria-label*="password"]'
    ],
    keepMeSignedIn: [
      '#keepMeSignedIn',
      '[name="keepMeSignedIn"]',
      '[data-test="keepMeSignedIn"]',
      'input[type="checkbox"][name*="remember"]',
      'input[type="checkbox"][id*="remember"]',
      'input[type="checkbox"][aria-label*="keep me signed in"]',
      'input[type="checkbox"][aria-label*="remember"]'
    ]
  },
  signInButton: [
    '#login',
    'button#login',
    '[data-test="accountNav-signIn"]',
    '[data-test="login-button"]',
    'button[type="submit"]',
    'button[aria-label*="sign in"]',
    'button[aria-label*="login"]',
    'input[type="submit"][value*="Sign in"]',
    '.login-button',
    '[class*="signin-button"]'
  ],
  loginModal: {
    container: [
      '.login-modal',
      '[class*="login-modal"]',
      '[class*="LoginModal"]',
      '.modal[class*="login"]',
      '[role="dialog"]'
    ],
    fields: {
      username: [
        '#username',
        '[name="username"]',
        '[data-test="username"]',
        'input[type="email"]',
        'input[placeholder*="email"]'
      ],
      password: [
        '#password',
        '[name="password"]',
        '[data-test="password"]',
        'input[type="password"]'
      ],
      keepMeSignedIn: [
        '#keepMeSignedIn',
        '[name="keepMeSignedIn"]',
        'input[type="checkbox"].styles_ndsBaseCheckbox__7ay8D'
      ]
    },
    signInButton: [
      '#login',
      'button#login',
      'button[type="submit"]',
      'button.styles_ndsBaseButton__W8Gl7[type="submit"]'
    ]
  },
  loginErrors: [
    '.error-message',
    '[data-test="error-message"]',
    '[role="alert"]',
    '.alert-danger',
    '[class*="error"]',
    '[class*="invalid"]'
  ],
  loginLoading: [
    '.loading',
    '[data-test="loading"]',
    '[aria-busy="true"]',
    '.spinner',
    '[class*="spinner"]'
  ],
  loggedInIndicators: [
    '[data-test="accountNav-avatar"]',
    '[data-test="account-hi"]',
    '.account-avatar',
    '[class*="logged-in"]',
    '[aria-label*="account menu"]'
  ]
};

// Export selectors to window object for use in other scripts
window.targetSelectors = {
  productPageSelectors: productPageSelectors,
  checkoutPageSelectors: checkoutPageSelectors,
  popupSelectors: popupSelectors,
  loginPageSelectors: loginPageSelectors
};

console.log('sites/target/selectors.js: Script loaded.');
