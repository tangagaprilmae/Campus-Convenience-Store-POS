# Campus Convenience Store POS — Stage 02

A responsive interface made with HTML, CSS, and vanilla JavaScript. Open `index.html` in a browser; no installation or build step is required.

## Files

- `index.html` defines the page header, catalog container, order summary, and payment section. It loads the stylesheet and deferred JavaScript.
- `style.css` contains the light theme, green accents, product card styling, and responsive layout. The catalog uses three columns on wider screens, two on smaller laptops, and the checkout moves below the catalog on narrow screens.
- `script.js` stores the six product definitions, creates their cards, and manages the cart. `Intl.NumberFormat` formats prices as Philippine pesos with two decimal places. Inline SVG illustrations are decorative and need no external assets.

## Scope

Cart contents live in memory and reset on page reload. The amount received field and Complete payment are disabled. There is no payment processing, persistent storage, framework, or database connection.

## Cart functions

- `addToCart(productId)` adds one unit. A Map keyed by product ID stores one quantity per product, preventing duplicate rows.
- `changeQuantity(productId, change)` increases or decreases quantity by one. The minimum is one, where the minus button is disabled. Use Remove to delete the product.
- `removeFromCart(productId)` removes a product and all its units.
- `createCartButton(...)` creates controls with accessible product-specific labels.
- `renderCart()` rebuilds the summary, shows product names, unit prices, quantities, and item subtotals, updates the item count and totals, and toggles the empty-cart message. It also restores keyboard focus after controls are rebuilt.

One delegated click listener on the cart list handles quantity and removal buttons after each render. Calculations use integer centavos before formatting results as pesos.

## Verification

Run `node --check script.js` and `node --test tests/cart.test.cjs`. Tests use a lightweight DOM substitute to exercise the actual click handlers and rendered output for adding, duplicate additions, increasing, decreasing, minimum quantities, removal, totals, and restoring an empty cart.

Product names and prices can be updated in the `products` array in `script.js`. Theme colors can be adjusted in the CSS variables at the top of `style.css`.
