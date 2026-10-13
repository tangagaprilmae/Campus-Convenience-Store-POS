# AI assistance record

These are actual development requests from this chat. Student evaluation and modifications are left for the student to complete and verify.

## Interaction 1 — Cash payment

Exact prompt:

```text
Continue the existing POS project.

Implement cash payment functionality:

- Add a numeric cash payment input.
- Add a Confirm Payment button.
- Reject payment when the cart is empty.
- Reject blank, non-numeric, and negative amounts.
- Reject insufficient cash payment.
- Display clear validation messages.
- Calculate change using:

`Change = Amount Paid - Total Amount`

- Show payment confirmation after successful payment.
- Display total, amount paid, and change in Philippine pesos.

Do not generate the receipt yet. Keep the code simple and explain the payment validation logic.
```

Purpose: implement cash validation and payment confirmation.

AI response summary: added a numeric form, validation messages, calculations in centavos, peso formatting, and automated tests.

Student evaluation: To be completed by the student.

Student modifications: To be completed by the student; none claimed here.

## Interaction 2 — Receipt and reset

Exact prompt:

```text
Continue the existing Campus Convenience Store POS project.

Implement a digital receipt after successful payment.

The receipt must include:

- Store name
- Transaction reference number
- Product names
- Quantities
- Unit prices and subtotals
- Total amount
- Cash received
- Change

Add a New Transaction button that clears the previous cart, payment, errors, and receipt.

Make sure the application is ready for another customer without refreshing the browser.
```

Purpose: complete the transaction flow and prepare the application for another customer.

AI response summary: added receipt snapshots, session references, Manila date/time, completed-order protection, and a full reset. Seven automated DOM-substitute tests passed, including a second purchase without reloading. Browser testing was unavailable; manual steps are documented in README.md.

Student evaluation: To be completed by the student.

Student modifications: To be completed by the student; none claimed here.
