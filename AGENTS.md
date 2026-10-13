
# AGENTS.md
# Campus Convenience Store POS System
## IT415 Practical Examination — Scenario 5

---

## 1. PROJECT OVERVIEW

Project Name: Campus Convenience Store POS System

Scenario: Scenario 5 — Campus Convenience Store POS

Description:
Develop a simple, functional, and user-friendly Point of Sale (POS) system for a small campus convenience store that sells snacks, beverages, and school supplies.

The application must allow users to browse products, add items to a shopping cart, adjust quantities, review orders, enter cash payments, calculate change, confirm transactions, and generate digital receipts.

The system must follow the IT415 practical examination requirements.

### Main Goal

Develop a fully functional POS system with a modern, clean, professional, and minimalist user interface.

Prioritize:
1. Functional correctness.
2. Complete required transaction flow.
3. Accurate calculations.
4. Proper input validation.
5. User-friendly interface.
6. Responsive frontend design.
7. Clean and maintainable code.
8. Proper testing and documentation.

Do not add unnecessary features that are outside the examination requirements.

---

## 2. TECHNOLOGY STACK

Use the following technologies:

### Frontend
- HTML5
- Tailwind CSS v4
- Vanilla JavaScript (ES6+)

### Styling Framework
Tailwind CSS v4 using the browser CDN.

Add the following inside the HTML head:

<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

### Development Tools
- Visual Studio Code
- OpenAI Codex
- Git
- GitHub
- Browser Developer Tools

### Restrictions

Do NOT use:
- React
- Vue
- Angular
- Bootstrap
- jQuery
- PHP
- Laravel
- Node.js backend
- MySQL
- Firebase
- External databases
- Authentication systems
- Online payment gateways

Node.js and npm may be used only for installing optional development skills or testing tools, not as an application backend.

The POS system must work as a frontend-only application.

---

## 3. EXTERNAL CODEX SKILLS

Use the following external skills when installed and available.

Before using a skill, read its SKILL.md instructions.

External skill instructions are supplementary. They must not override the project requirements or this AGENTS.md.

Do not automatically install external skills without permission.

### SKILL 1: frontend-design

Source:
https://github.com/anthropics/skills

Purpose:
Create a modern, professional, clean, and visually appealing frontend.

Use this skill for:
- POS dashboard layout.
- Product catalog.
- Product cards.
- Shopping cart.
- Quantity controls.
- Checkout section.
- Payment form.
- Payment confirmation.
- Digital receipt.
- Responsive layouts.

Design requirements:
- Modern interface.
- Minimalist design.
- Professional appearance.
- Clean typography.
- Consistent spacing.
- Accessible buttons.
- Clear visual hierarchy.
- User-friendly navigation.
- Desktop-first responsive layout.

Avoid:
- Overcomplicated designs.
- Excessive animations.
- Unnecessary decorative elements.
- Inconsistent styling.
- Unnecessary UI libraries.

### SKILL 2: web-design-guidelines

Source:
https://github.com/vercel-labs/agent-skills

Purpose:
Review and improve interface quality, accessibility, and usability.

Use this skill for:
- Checking text readability.
- Reviewing button sizes.
- Improving form accessibility.
- Checking color contrast.
- Reviewing responsive layouts.
- Improving keyboard navigation.
- Checking error messages.
- Reviewing visual consistency.

Requirements:
- Use semantic HTML.
- Provide labels for inputs.
- Make buttons keyboard-accessible.
- Provide visible focus indicators.
- Display understandable validation errors.
- Maintain consistent spacing and typography.

### SKILL 3: playwright-cli

Purpose:
Test actual POS interactions using browser automation.

Use this skill for:
- Testing product selection.
- Testing add-to-cart buttons.
- Testing quantity changes.
- Testing item removal.
- Testing subtotal calculations.
- Testing cash payment.
- Testing invalid payments.
- Testing change calculation.
- Testing receipt generation.
- Testing new transaction reset.

Testing rules:
- Test actual application behavior.
- Report successful and failed tests.
- Fix discovered problems.
- Retest after corrections.
- Never claim a test passed without executing it.
- If Playwright is unavailable, provide manual testing instructions.

### Skill Priority

1. frontend-design — UI development.
2. web-design-guidelines — UI review.
3. playwright-cli — Functional testing.

Use only the skills relevant to the current task.

---

## 4. PROJECT FOLDER STRUCTURE

Use the following structure:

Campus-Convenience-Store-POS/
|
|-- index.html
|
|-- js/
|   |-- script.js
|
|-- AGENTS.md
|
|-- README.md
|
|-- AI_USAGE.md

### File Responsibilities

index.html
- Main application interface.
- Product catalog.
- Shopping cart.
- Checkout form.
- Receipt interface.
- Tailwind CSS styling.

js/script.js
- Product data.
- Cart functionality.
- Quantity management.
- Order calculations.
- Payment validation.
- Change calculation.
- Transaction confirmation.
- Receipt generation.
- Transaction reset.

AGENTS.md
- Development instructions.
- Coding rules.
- Project requirements.
- Skill usage.
- Testing rules.
- Submission restrictions.

README.md
- Project overview.
- Technologies.
- Features.
- Installation and usage.
- Instructions for running the application.

AI_USAGE.md
- Actual AI prompts used.
- Purpose of each prompt.
- AI response summaries.
- Student evaluation.
- Student modifications.

Do not create additional folders or files unless necessary.

---

## 5. PRODUCT CATALOG

Use the following products:

| Product | Price |
|---------|-------|
| Instant Noodles | ₱18.00 |
| Potato Chips | ₱25.00 |
| Soft Drink (Can) | ₱25.00 |
| Bottled Water | ₱20.00 |
| Ballpen (piece) | ₱12.00 |
| Notebook (piece) | ₱35.00 |

Requirements:
- Display all six products.
- Display product names clearly.
- Display prices in Philippine pesos.
- Provide an Add to Cart button for every product.
- Store product information in a JavaScript array.
- Assign each product a unique ID.

Do not introduce inventory management or stock tracking.

---

## 6. REQUIRED TRANSACTION FLOW

The application must follow this sequence:

STEP 1: Browse Products
- Display available products.
- Show product names and prices.

STEP 2: Add to Cart
- Allow users to add one or more products.
- Allow quantity adjustments.

STEP 3: Review Order
- Display selected products.
- Display quantities.
- Display subtotals.
- Display total amount.

STEP 4: Enter Payment
- Allow users to enter a cash amount.

STEP 5: Validate Payment
- Check whether the cash amount is valid.
- Check whether the cash is sufficient.
- Calculate change.

STEP 6: Confirm Payment
- Display successful payment confirmation.

STEP 7: Receipt and New Transaction
- Generate a digital receipt.
- Allow the user to start another transaction.

All stages must be functional.

---

## 7. REQUIRED SYSTEM FEATURES

Implement all twelve required features.

### FEATURE 1: Display Products
- Display at least five products.
- Use all six provided products.
- Show prices clearly.

### FEATURE 2: Add to Cart
- Add selected products to the cart.
- If the product already exists, increase its quantity.
- Do not create unnecessary duplicate cart rows.

### FEATURE 3: Quantity Adjustment
- Increase product quantity.
- Decrease product quantity.
- Update totals automatically.
- Prevent negative quantities.
- At zero quantity, remove the product or require explicit removal.

### FEATURE 4: Remove Products
- Provide a Remove button.
- Remove the selected product from the cart.
- Update the order summary.

### FEATURE 5: Automatic Calculations
- Calculate item subtotals.
- Calculate total amount.
- Recalculate whenever the cart changes.

Formula:

Subtotal = Price × Quantity

Total = Sum of All Subtotals

### FEATURE 6: Order Summary
Display:
- Product name.
- Quantity.
- Unit price.
- Subtotal.
- Total amount.

### FEATURE 7: Cash Payment Input
- Provide a clearly labeled payment input.
- Accept cash amounts.
- Support decimal values.
- Use a numeric-oriented input with proper validation.

### FEATURE 8: Payment Validation
Reject:
- Empty payment.
- Non-numeric payment.
- Negative payment.
- Insufficient cash.
- Invalid numeric values.
- Checkout with an empty cart.

Display understandable error messages.

Do not proceed to payment confirmation when payment is invalid.

### FEATURE 9: Change Calculation

Formula:

Change = Cash Paid - Total Amount

Requirements:
- Calculate change correctly.
- Display change in Philippine pesos.
- Support exact payment.
- Support overpayment.

### FEATURE 10: Payment Confirmation
After valid payment:
- Display a success message.
- Show the total amount.
- Show the amount paid.
- Show the calculated change.
- Prevent duplicate transaction confirmation.

### FEATURE 11: Digital Receipt
Generate a receipt containing:
- Store name.
- Transaction reference number.
- Date and time.
- Purchased products.
- Quantities.
- Unit prices.
- Subtotals.
- Total amount.
- Cash received.
- Change.

The receipt must be readable and visually organized.

Printing is optional unless explicitly required.

### FEATURE 12: New Transaction
Provide a New Transaction button.

When clicked:
- Clear the shopping cart.
- Reset quantities.
- Clear the payment input.
- Clear validation errors.
- Clear payment confirmation.
- Clear the previous receipt.
- Reset the total amount.
- Return to the initial transaction state.

The user must be able to perform another complete transaction.

---

## 8. UI/UX DESIGN REQUIREMENTS

Use frontend-design and web-design-guidelines when available.

### Design Style
- Modern.
- Clean.
- Minimalist.
- Professional.
- Desktop-friendly.
- Responsive.
- Easy to understand.

### Suggested Color Palette

Background:
Slate-50

Cards:
White

Primary Action:
Emerald-600

Primary Hover:
Emerald-700

Main Text:
Slate-900

Secondary Text:
Slate-500

Borders:
Slate-200

Error:
Red-600

Success:
Emerald-600

### Layout

Desktop:
- Header at the top.
- Product catalog on the left.
- Shopping cart and checkout on the right.
- Clear receipt view after successful payment.

Mobile:
- Stack the product catalog and checkout sections vertically.
- Avoid horizontal scrolling.
- Keep buttons accessible.

### Product Cards

Each product card should contain:
- Product name.
- Product price.
- Add to Cart button.

### Shopping Cart

Display:
- Product name.
- Unit price.
- Quantity controls.
- Subtotal.
- Remove button.

### Payment Section

Display:
- Total amount.
- Cash payment input.
- Confirm Payment button.
- Validation message.

### Receipt Section

Display:
- Store name.
- Transaction information.
- Purchased items.
- Total.
- Payment.
- Change.
- New Transaction button.

---

## 9. JAVASCRIPT DEVELOPMENT RULES

Use Vanilla JavaScript only.

### Code Quality
- Use const and let appropriately.
- Use descriptive variable names.
- Create reusable functions.
- Avoid duplicated code.
- Use event listeners.
- Keep functions focused.
- Use clear comments when necessary.

### Recommended Functions

- renderProducts()
- addToCart(productId)
- increaseQuantity(productId)
- decreaseQuantity(productId)
- removeFromCart(productId)
- calculateSubtotal()
- calculateTotal()
- renderCart()
- validatePayment()
- calculateChange()
- confirmPayment()
- generateReceipt()
- resetTransaction()
- formatCurrency()

Function names may be adjusted when appropriate.

### State Management

Maintain a clear application state for:
- Product catalog.
- Cart items.
- Cash payment.
- Transaction status.
- Receipt data.

### Money Calculations

Prefer integer centavos to avoid floating-point rounding problems.

Examples:
- ₱18.00 = 1800 centavos.
- ₱25.00 = 2500 centavos.
- ₱35.00 = 3500 centavos.

Convert to peso formatting only when displaying amounts.

### Validation

- Never accept NaN or Infinity.
- Never allow negative quantities.
- Never confirm insufficient payments.
- Never allow payment for an empty cart.
- Prevent duplicate checkout confirmation.
- Prevent cart modifications after transaction completion until a new transaction begins.

---

## 10. DEVELOPMENT WORKFLOW

Develop the application in manageable phases.

### PHASE 1: Project Setup

Tasks:
- Create the project folders.
- Create index.html.
- Create js/script.js.
- Configure Tailwind CSS v4.
- Link JavaScript correctly.
- Build the basic HTML structure.

Expected result:
A working application shell.

### PHASE 2: Frontend Design

Use frontend-design.

Tasks:
- Create the header.
- Create the product catalog.
- Design product cards.
- Create the cart panel.
- Create the checkout section.
- Apply responsive Tailwind styling.

Expected result:
A clean and professional POS interface.

### PHASE 3: Product and Cart Functionality

Tasks:
- Define products.
- Implement Add to Cart.
- Implement quantity increase.
- Implement quantity decrease.
- Implement item removal.
- Implement automatic calculations.
- Update the cart interface.

Expected result:
A functional shopping cart.

### PHASE 4: Payment Processing

Tasks:
- Create cash input.
- Validate cash payment.
- Reject invalid values.
- Reject insufficient payments.
- Calculate change.
- Implement payment confirmation.

Expected result:
Functional cash payment processing.

### PHASE 5: Receipt and Reset

Tasks:
- Generate transaction reference.
- Display receipt.
- Display purchased items.
- Display payment details.
- Implement New Transaction.
- Clear previous transaction state.

Expected result:
A complete POS transaction flow.

### PHASE 6: Testing and Debugging

Use playwright-cli when available.

Tasks:
- Test all required features.
- Test invalid inputs.
- Test payment calculations.
- Test transaction reset.
- Fix discovered errors.
- Retest corrected functionality.

Expected result:
A stable application with verified behavior.

### PHASE 7: Documentation

Tasks:
- Complete README.md.
- Complete AI_USAGE.md using actual interactions.
- Review Git history.
- Identify required screenshots.
- Review all examination requirements.

Expected result:
A complete project ready for student review.

IMPORTANT:
Do not submit the project.

---

## 11. TESTING REQUIREMENTS

Test every required feature.

### Test 1: Product Display
Expected:
All six products appear with correct prices.

### Test 2: Add to Cart
Action:
Add Instant Noodles.

Expected:
The cart displays Instant Noodles with quantity 1.

### Test 3: Increase Quantity
Action:
Increase Instant Noodles quantity to 2.

Expected:
Subtotal is ₱36.00.

### Test 4: Add Another Product
Action:
Add one Notebook.

Expected:
Total is ₱71.00.

### Test 5: Remove Product
Action:
Remove Notebook.

Expected:
Notebook disappears and total updates.

### Test 6: Empty Payment
Action:
Leave payment blank.

Expected:
Display a validation error.

### Test 7: Insufficient Payment
Total:
₱71.00

Cash:
₱70.00

Expected:
Reject payment.

### Test 8: Exact Payment
Total:
₱71.00

Cash:
₱71.00

Expected:
Change is ₱0.00.

### Test 9: Overpayment
Total:
₱71.00

Cash:
₱100.00

Expected:
Change is ₱29.00.

### Test 10: Invalid Payment
Input:
Negative, non-numeric, malformed, or non-finite values.

Expected:
Reject payment.

### Test 11: Receipt
Expected:
Display all required transaction information.

### Test 12: New Transaction
Expected:
Cart, payment, errors, receipt, and confirmation are cleared.

### Testing Rules

- Report actual test results.
- Do not fabricate successful tests.
- Fix errors before continuing.
- Clearly identify tests that were not performed.

---

## 12. GIT AND GITHUB REQUIREMENTS

Use Git for version control.

### Suggested Commit Checkpoints

Commit 1:
Initial project setup.

Commit 2:
Product catalog and shopping cart.

Commit 3:
Payment validation and change calculation.

Commit 4:
Receipt generation and transaction reset.

Commit 5:
Testing, debugging, and documentation.

### Git Rules

- Use meaningful commit messages.
- Keep commits organized.
- Do not commit broken code intentionally.
- Do not rewrite or delete existing Git history without permission.
- Do not create commits automatically unless instructed.
- Do not push to GitHub automatically unless instructed.
- Do not create pull requests unless instructed.

Codex may explain Git commands and assist with commits or pushes only when the students explicitly request them.

GitHub preparation and pushing code are separate from examination submission.

---

## 13. AI USAGE DOCUMENTATION

The practical examination requires documentation of AI assistance.

Create AI_USAGE.md.

Document at least two actual AI-assisted interactions.

For each interaction include:

1. Exact prompt used.
2. Purpose of the prompt.
3. Summary of AI response.
4. Student evaluation.
5. Changes or modifications made by the student.

### Rules

- Record actual AI interactions only.
- Do not invent prompts.
- Do not fabricate student evaluations.
- Do not claim student modifications that were not performed.
- Leave student evaluation fields for the students to complete when necessary.
- Do not submit AI_USAGE.md.

Codex may prepare the documentation structure, but students must verify the contents.

---

## 14. README DOCUMENTATION

Create a README.md containing:

- Project title.
- Scenario description.
- Project objectives.
- Technologies used.
- Required features.
- Folder structure.
- How to run the application.
- How to perform a transaction.
- Project limitations.

Keep documentation concise and understandable.

---

## 15. STRICT SUBMISSION RESTRICTIONS

IMPORTANT: THE STUDENTS ARE RESPONSIBLE FOR SUBMISSION.

Codex must NOT submit the project or any examination requirements.

### Prohibited Actions

- Do NOT submit the application.
- Do NOT upload files to Google Classroom.
- Do NOT upload files to an LMS.
- Do NOT submit through school portals.
- Do NOT submit repository links.
- Do NOT submit screenshots.
- Do NOT submit documentation.
- Do NOT submit source code.
- Do NOT mark requirements as submitted.
- Do NOT send final examination deliverables to instructors.
- Do NOT perform any submission-related action without explicit instructions from the students.

### Allowed Actions

Codex MAY:
- Develop the POS system.
- Design the frontend.
- Write HTML.
- Apply Tailwind CSS.
- Implement JavaScript.
- Debug the application.
- Test system functionality.
- Generate documentation.
- Prepare screenshots for student review.
- Explain Git commands.
- Help create Git commits when instructed.
- Help push code to GitHub when instructed.
- Review the final project.

### Final Submission Responsibility

Only the students will:
- Review the finished project.
- Verify examination requirements.
- Decide when the project is complete.
- Upload the required files.
- Submit the GitHub repository link.
- Submit screenshots.
- Submit documentation.
- Complete the official examination submission.

Once development and documentation are complete, Codex must stop and wait for instructions.

Never assume permission to submit.

---

## 16. CODEX RESPONSE FORMAT

After completing a development task, respond using this structure:

### Completed Tasks
Explain what was implemented.

### Files Modified
List changed files.

### Functionality
Explain how the feature works.

### Testing
Describe tests actually performed and their results.

### Issues
Report remaining problems, if any.

### Next Recommended Step
Suggest the next development task.

Do not claim the project has been submitted.

---

## 17. DEFINITION OF DONE

The project is ready for student review when:

- All six products are displayed.
- Add to Cart works.
- Quantity controls work.
- Remove Item works.
- Subtotals calculate correctly.
- Total calculates correctly.
- Order summary is complete.
- Cash input works.
- Payment validation works.
- Insufficient payment is rejected.
- Change calculation is accurate.
- Payment confirmation works.
- Digital receipt is generated.
- New Transaction works.
- The interface is clean and responsive.
- JavaScript runs without critical errors.
- Required tests have been performed or identified for manual testing.
- README.md is complete.
- AI_USAGE.md contains actual AI usage records.
- Git history is ready for student review.

IMPORTANT:
Meeting these conditions does not authorize submission.

The students are responsible for final review and submission.

---

## 18. FINAL INSTRUCTIONS TO CODEX

Always read this AGENTS.md before working on the project.

Follow the IT415 Scenario 5 requirements.

Use:
- HTML5
- Tailwind CSS v4
- Vanilla JavaScript

Use installed external skills when relevant:
- frontend-design
- web-design-guidelines
- playwright-cli

Prioritize functionality over decoration.

Develop in manageable phases.

Preserve existing working features.

Do not introduce unnecessary technologies.

Do not fabricate test results.

Do not fabricate AI documentation.

Do not automatically commit or push code.

NEVER submit the project.

The students will handle all examination submissions.

After completing the requested task, report the results and wait for further instructions.
