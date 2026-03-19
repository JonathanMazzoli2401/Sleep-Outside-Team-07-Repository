import { getLocalStorage, setLocalStorage } from './utils.mjs';
import { loadHeaderFooter } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      removeProductFromCart(id);
    });
  });
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
<a href="#" class="cart-card__image">
<img
  src="${item.Image}"
  alt="${item.Name}"
/>
</a>
<a href="#">
<h2 class="cart-card__name">${item.Name}</h2>
</a>
<p class="cart-card__color">${item.Colors[0].ColorName}</p>
<p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
<p class="cart-card__price">$${item.FinalPrice}</p>
<button class="remove-item" data-id="${item.Id}">Remove</button>
</li>`;

  return newItem;
}

function removeProductFromCart(id) {
  let cartItems = getLocalStorage('so-cart') || [];

  const productIndex = cartItems.findIndex((item) => item.Id === id);

  if (productIndex !== -1) {
    if (cartItems[productIndex].quantity && cartItems[productIndex].quantity > 1) {
      cartItems[productIndex].quantity -= 1;
    } else {
      cartItems.splice(productIndex, 1);
    }
  }

  setLocalStorage('so-cart', cartItems);
  renderCartContents();
}

renderCartContents();
loadHeaderFooter();