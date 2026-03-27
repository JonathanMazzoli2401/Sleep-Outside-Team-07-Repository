import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart");
myCheckout.init();

document.querySelector("#zip").addEventListener("blur", () => {
  myCheckout.calculateOrderTotal();
});

document.querySelector("#checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  await myCheckout.checkout(form);
});