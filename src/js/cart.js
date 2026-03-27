import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

function renderEmptyCart() {
  const productList = document.querySelector(".product-list");
  const totalElement = document.querySelector("#cart-total");
  const cartFooter = document.querySelector(".cart-footer");

  productList.innerHTML = `
    <li class="empty-cart-message">
      <p>Your cart is empty.</p>
      <a href="../index.html" class="checkout-button">Continue Shopping</a>
    </li>
  `;

  if (totalElement) {
    totalElement.textContent = "0.00";
  }

  if (cartFooter) {
    cartFooter.style.display = "none";
  }
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  const totalElement = document.querySelector("#cart-total");
  const cartFooter = document.querySelector(".cart-footer");

  if (cartItems.length === 0) {
    renderEmptyCart();
    return;
  }

  if (cartFooter) {
    cartFooter.style.display = "block";
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  if (totalElement) {
    totalElement.textContent = calculateCartTotal(cartItems);
  }

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeProductFromCart(id);
    });
  });
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${item.Images.PrimaryMedium}"
          alt="${item.Name}"
        />
      </a>
      <a href="#">
        <h2 class="cart-card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "See Photo"}</p>
      <p class="cart-card__quantity">Qty: ${item.quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="remove-item" data-id="${item.Id}">Remove</button>
    </li>
  `;
}

function calculateCartTotal(cartItems) {
  const total = cartItems.reduce((sum, item) => {
    return sum + item.FinalPrice * (item.quantity || 1);
  }, 0);

  return total.toFixed(2);
}

function removeProductFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];

  const productIndex = cartItems.findIndex((item) => item.Id == id);

  if (productIndex !== -1) {
    if (cartItems[productIndex].quantity && cartItems[productIndex].quantity > 1) {
      cartItems[productIndex].quantity -= 1;
    } else {
      cartItems.splice(productIndex, 1);
    }
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

loadHeaderFooter();
renderCartContents();