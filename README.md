# Campus Convenience Store POS — Stage 03

A responsive interface made with HTML, CSS, and vanilla JavaScript. Open `index.html` in a browser; no installation or build step is required.

## Files

- `index.html` defines the page header, catalog container, order summary, and payment section. It loads the stylesheet and deferred JavaScript.
- `style.css` contains the light theme, green accents, product card styling, and responsive layout. The catalog uses three columns on wider screens, two on smaller laptops, and the checkout moves below the catalog on narrow screens.
- `script.js` stores the six product definitions, creates their cards, and manages the cart. `Intl.NumberFormat` formats prices as Philippine pesos with two decimal places. Inline SVG illustrations are decorative and need no external assets.

## Scope

Cart contents and cash confirmation live in memory and reset on page reload. Cash payment is validated locally. No receipt, persistent storage, framework, or database connection is included.

## Cart functions

- `addToCart(productId)` adds one unit. A Map keyed by product ID stores one quantity per product, preventing duplicate rows.
- `changeQuantity(productId, change)` increases or decreases quantity by one. The minimum is one, where the minus button is disabled. Use Remove to delete the product.
- `removeFromCart(productId)` removes a product and all its units.
- `createCartButton(...)` creates controls with accessible product-specific labels.
- `renderCart()` rebuilds the summary, shows product names, unit prices, quantities, and item subtotals, updates the item count and totals, and toggles the empty-cart message. It also restores keyboard focus after controls are rebuilt.

One delegated click listener on the cart list handles quantity and removal buttons after each render. Calculations use integer centavos before formatting results as pesos.

## Verification

Run `node --check script.js` and `node --test tests/cart.test.cjs`. Tests use a lightweight DOM substitute to exercise the actual handlers and rendered output for cart operations, invalid payment inputs, exact payment, overpayment, change, and clearing outdated confirmations. These checks do not replace a visual browser review.

## Cash payment validation

The numeric input accepts peso amounts with up to two decimal places. The form uses `novalidate` so the JavaScript can display consistent validation messages rather than browser popups. Both clicking Confirm Payment and pressing Enter submit the form.

`confirmPayment(event)` checks the following in order:

1. Reject an empty cart.
2. Reject browser-reported non-numeric input and blank values. Check blank input before converting it, because `Number("")` equals zero.
3. Convert the input to a number and reject non-finite or negative values.
4. Require ordinary decimal notation with at most two decimal places, then convert pesos to integer centavos. Reject amounts outside the safe integer range.
5. Get the current total using `getTotalCentavos()` and reject cash below that total.
6. Calculate change as amount paid minus total, then format total, amount paid, and change in Philippine pesos and display confirmation.

`showPaymentError()` displays a clear message and marks invalid cash input for accessibility. `resetPayment()` clears the confirmation, message, and change when cash or the cart changes, so a previous payment never appears to confirm an edited order. The cart remains visible after success; no receipt is generated.

Product names and prices can be updated in the `products` array in `script.js`. Theme colors can be adjusted in the CSS variables at the top of `style.css`.
