# TODO - Payment optimization + backend fix

- [ ] Simplify frontend payment UI: replace `src/components/PaymentForm.jsx` with a minimal "Pay" form (no card fields)
- [ ] Update `src/pages/CheckoutPage.jsx` to submit order to backend `/api/orders` with `paymentInfo="PAID"` and minimal payment payload
- [x] Backend fix: replace `OrderController` request parsing from `Map<String,Object>` to a typed DTO (`CreateOrderRequest`)

- [ ] Ensure backend accepts optional/absent paymentInfo/shippingAddress without crashes
- [ ] Frontend/order-success compatibility check (update if it assumes localStorage-only order)
- [ ] Run backend build/tests (compile) and run frontend build to verify no TS/JS errors

