import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart");
checkout.init();

document.querySelector("#zip").addEventListener("blur", () => {
    checkout.calculateOrderTotal();
});