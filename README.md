# Campus Convenience Store POS — Stage 04

A responsive interface made with HTML, CSS, and vanilla JavaScript. Open `index.html` in a browser; no installation or build step is required.

## Files

- `index.html` defines the page header, catalog container, order summary, and payment section. It loads the stylesheet and deferred JavaScript.
- `style.css` contains the light theme, green accents, product card styling, and responsive layout. The catalog uses three columns on wider screens, two on smaller laptops, and the checkout moves below the catalog on narrow screens.
- `script.js` stores the six product definitions, creates their cards, and manages the cart. `Intl.NumberFormat` formats prices as Philippine pesos with two decimal places. Inline SVG illustrations are decorative and need no external assets.

## Scope

This IT415 Scenario 5 frontend lets a campus store build orders, validate cash, calculate change, issue digital receipts, and prepare for the next customer. Cart contents, payment, and receipts live in memory and reset on page reload. No persistent storage, framework, or database connection is included.

## Cart functions

- `addToCart(productId)` adds one unit. A Map keyed by product ID stores one quantity per product, preventing duplicate rows.
- `changeQuantity(productId, change)` increases or decreases quantity by one. The minimum is one, where the minus button is disabled. Use Remove to delete the product.
- `removeFromCart(productId)` removes a product and all its units.
- `createCartButton(...)` creates controls with accessible product-specific labels.
- `renderCart()` rebuilds the summary, shows product names, unit prices, quantities, and item subtotals, updates the item count and totals, and toggles the empty-cart message. It also restores keyboard focus after controls are rebuilt.

One delegated click listener on the cart list handles quantity and removal buttons after each render. Calculations use integer centavos before formatting results as pesos.

## Verification

Run `node --check script.js` and `node --test tests/cart.test.cjs`. All seven tests pass using a lightweight DOM substitute to exercise the actual handlers and rendered output for cart operations, invalid payments, exact payment, overpayment, receipt details, duplicate-payment protection, reset, and a second customer. These checks do not replace a visual browser review. Playwright CLI was not available as a global command and its local availability check did not respond; browser tests were not performed.

Manual browser check:

1. Add two Instant Noodles and one Notebook. Confirm total is ₱71.00.
2. Submit blank or ₱70 cash and verify an error appears without a receipt.
3. Pay ₱100. Verify the receipt shows the store name, reference, Manila date/time, both products, quantities, unit prices, subtotals, ₱71 total, ₱100 cash, and ₱29 change.
4. Verify cart and payment controls are disabled after success.
5. Click New Transaction. Verify cart, cash, messages, confirmation, and receipt clear, totals return to ₱0.00, and controls are enabled.
6. Add a Ballpen and pay ₱20 without refreshing. Verify a new reference, ₱12 total, and ₱8 change.

## Cash payment validation

The numeric input accepts peso amounts with up to two decimal places. The form uses `novalidate` so the JavaScript can display consistent validation messages rather than browser popups. Both clicking Confirm Payment and pressing Enter submit the form.

`confirmPayment(event)` checks the following in order:

1. Reject an empty cart.
2. Reject browser-reported non-numeric input and blank values. Check blank input before converting it, because `Number("")` equals zero.
3. Convert the input to a number and reject non-finite or negative values.
4. Require ordinary decimal notation with at most two decimal places, then convert pesos to integer centavos. Reject amounts outside the safe integer range.
5. Get the current total using `getTotalCentavos()` and reject cash below that total.
6. Calculate change as amount paid minus total, then format total, amount paid, and change in Philippine pesos and display confirmation.

`showPaymentError()` displays a clear message and marks invalid cash input for accessibility. Before payment succeeds, `resetPayment()` clears messages and confirmation when the cart or cash changes. After success, the transaction is locked until New Transaction is clicked.

## Receipt and next customer

- `generateReceipt(totalCentavos, paidCentavos)` copies the paid items into a transaction snapshot and displays the receipt. References combine a timestamp and a session sequence number. The sequence increments only for successful payments. Date and time use Asia/Manila.
- `setTransactionLocked(locked)` disables product, quantity, removal, cash, and confirmation controls after payment. Handler guards also prevent duplicate confirmations and changes to completed orders.
- `resetTransaction()` clears the cart, cash input, validation messages, payment details, receipt rows, reference, and transaction snapshot. It resets totals, enables controls, and returns keyboard focus to the catalog. The session sequence stays intact so the next receipt gets a different reference.

To perform a transaction, add products, adjust quantities, enter cash, and click Confirm Payment. Review the receipt, then click New Transaction for the next customer. Receipts are displayed on screen only; there is no printing, transaction archive, or server-side reference registry.

Product names and prices can be updated in the `products` array in `script.js`. Theme colors can be adjusted in the CSS variables at the top of `style.css`.
