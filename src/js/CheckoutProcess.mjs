import { getLocalStorage, formDataToJSON } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(cartKey) {
    this.cartKey = cartKey;
    this.cartItems = getLocalStorage(cartKey) || [];
    this.externalServices = new ExternalServices();
  }

  init() {
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const subtotal = this.cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = item.FinalPrice || item.finalPrice || item.price || 0;
      return sum + price * quantity;
    }, 0);

    document.querySelector("#subtotal").textContent = subtotal.toFixed(2);
    return subtotal;
  }

  calculateOrderTotal() {
    const subtotal = this.calculateItemSummary();

    const itemCount = this.cartItems.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);

    const tax = subtotal * 0.06;
    const shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    const orderTotal = subtotal + tax + shipping;

    document.querySelector("#tax").textContent = tax.toFixed(2);
    document.querySelector("#shipping").textContent = shipping.toFixed(2);
    document.querySelector("#orderTotal").textContent = orderTotal.toFixed(2);

    return {
      subtotal,
      tax,
      shipping,
      orderTotal,
    };
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1,
    }));
  }

  showMessage(message, type = "success") {
    const messageBox = document.querySelector("#checkout-message");
    const messageText = document.querySelector("#checkout-message-text");

    if (!messageBox || !messageText) return;

    messageText.textContent = message;
    messageBox.classList.remove("hidden", "success", "error");
    messageBox.classList.add(type);

    setTimeout(() => {
      messageBox.classList.add("hidden");
    }, 2500);
  }

  async checkout(form) {
    const formData = new FormData(form);
    const orderData = formDataToJSON(formData);
    const totals = this.calculateOrderTotal();

    orderData.orderDate = new Date().toISOString();
    orderData.items = this.packageItems(this.cartItems);
    orderData.orderTotal = totals.orderTotal.toFixed(2);
    orderData.shipping = totals.shipping.toFixed(2);
    orderData.tax = totals.tax.toFixed(2);

    try {
      const result = await this.externalServices.checkout(orderData);
      console.log("Order submitted:", result);

      localStorage.removeItem(this.cartKey);
      this.showMessage("Order placed successfully!", "success");

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1800);
    } catch (error) {
      console.error("Checkout error:", error);
      this.showMessage("There was a problem placing your order.", "error");
    }
  }
}