import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
    constructor(cartKey) {
        this.cartKey = cartKey;
        this.cartItems = getLocalStorage(this.cartKey) || [];
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
        orderTotal
        };
    }
}