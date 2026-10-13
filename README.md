# Campus Convenience Store POS — Stage 01

A responsive interface made with HTML, CSS, and vanilla JavaScript. Open `index.html` in a browser; no installation or build step is required.

## Files

- `index.html` defines the page header, catalog container, order summary, and payment section. It loads the stylesheet and deferred JavaScript.
- `style.css` contains the light theme, green accents, product card styling, and responsive layout. The catalog uses three columns on wider screens, two on smaller laptops, and the checkout moves below the catalog on narrow screens.
- `script.js` stores the six product definitions and creates their cards using DOM methods. `Intl.NumberFormat` formats prices as Philippine pesos with two decimal places. Inline SVG illustrations are decorative and need no external assets.

## Scope

Add to Cart buttons, the amount received field, and Complete payment are intentionally disabled. The order summary and payment amounts are static placeholders. There are no click handlers, cart calculations, payment processing, persistent storage, frameworks, or database connections.

Product names and prices can be updated in the `products` array in `script.js`. Theme colors can be adjusted in the CSS variables at the top of `style.css`.
