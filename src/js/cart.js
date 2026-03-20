import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const totalElement = document.querySelector("#cart-total");
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
  return `<li class="cart-card divider">
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
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button class="remove-item" data-id="${item.Id}">Remove</button>
  </li>`;
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

renderCartContents();
loadHeaderFooter();