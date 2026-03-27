import {
  getLocalStorage,
  formDataToJSON,
  alertMessage,
  removeAlerts,
} from "./utils.mjs";
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

  async checkout(form) {
    removeAlerts();

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
      window.location.href = "../checkout/success.html";
    } catch (error) {
      console.error("Checkout error:", error);
      console.log("Full error object:", error);
      console.log("Error message:", error?.message);

      let messages = ["There was a problem placing your order."];

      if (error?.message) {
        if (Array.isArray(error.message)) {
          messages = error.message;
        } else if (typeof error.message === "string") {
          messages = [error.message];
        } else if (Array.isArray(error.message.errors)) {
          messages = error.message.errors;
        } else if (Array.isArray(error.message.error)) {
          messages = error.message.error;
        } else if (Array.isArray(error.message.message)) {
          messages = error.message.message;
        } else if (Array.isArray(error.message.Message)) {
          messages = error.message.Message;
        } else if (typeof error.message.message === "string") {
          messages = [error.message.message];
        } else if (typeof error.message.Message === "string") {
          messages = [error.message.Message];
        } else if (typeof error.message.Error === "string") {
          messages = [error.message.Error];
        } else {
          const values = Object.values(error.message).flat();
          if (values.length) {
            messages = values.map((item) => String(item));
          }
        }
      }

      alertMessage(messages);
    }
  }
}